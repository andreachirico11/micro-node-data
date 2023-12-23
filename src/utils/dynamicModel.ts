import columnTypes from '../configs/columnTypes';
import { Column, MongoTable } from '../models/mongoTable';
import { deleteModel, Model, model, Schema } from 'mongoose';

const estrapolateTypeConstructor = (c: Column) => {
  return columnTypes(c).constructorType;
};

const reducer = (prevSchema: Object, c: Column) => {
  const { name, require } = c;
  try {
    const newColumn = { require, type: estrapolateTypeConstructor(c) };
    return { ...prevSchema, [name]: newColumn };
  } catch (e) {
    throw new UnhandledDataType(name);
  }
};

const getSchema = (columns: Column[]) => {
  return new Schema(
    { ...columns.reduce((schema, column) => reducer(schema, column), {}) },
    { versionKey: false }
  );
};

const schemaGenerator = ({ tableName, columns }: MongoTable) => {
  return model<any>(tableName, getSchema(columns));
};

export class DynamicModel {
  private static _model: Model<any>;

  public static generate(t: MongoTable) {
    this._model = schemaGenerator(t);
  }

  public static get modelName() {
    return this._model.modelName;
  }

  public static async getAll() {
    const result = await this._model.find<Object>({});
    const output = result.map((o) => this._model.castObject(o));
    deleteModel(this.modelName);
    return output;
  }

  public static async get(id: string) {
    const result: Model<Object> = await this._model.findById(id);
    const output: Object = { ...this._model.castObject(result) };
    deleteModel(this.modelName);
    return output;
  }

  public static async post(body: Object) {
    this._model.init();
    const result: Model<Object> = await new this._model(body).save();
    const output: Object = { ...this._model.castObject(result) };
    deleteModel(this.modelName);
    return output;
  }

  public static async put(body: Object, _id: string) {
    const result: Model<Object> = await this._model.findByIdAndUpdate(_id, body);
    const output: Object = { ...this._model.castObject(result), ...body };
    deleteModel(this.modelName);
    return output;
  }

  public static async delete(_id: string) {
    const hasBeenDeleted = !!(await this._model.findByIdAndDelete(_id));
    deleteModel(this.modelName);
    return hasBeenDeleted;
  }
}

export class UnhandledDataType extends Error {
  constructor(private propN: string) {
    super();
  }

  get propertyWhichCausedError() {
    return this.propN;
  }
}
