import { deleteModel, Model } from 'mongoose';

export abstract class DynamicModel {
  private static _model: Model<any>;

  public static generate(t:  Model<any>) {
    this._model = t;
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
    return this.deleteResource<Object>(async () => {
      this._model.init();
      const result: Model<Object> = await new this._model(body).save();
      return { ...this._model.castObject(result) };
    });
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

  private static deleteResource<T>(action: () => Promise<T>) {
    try {
      return action();
    } finally {
      deleteModel(this.modelName);
    }
  }
}
