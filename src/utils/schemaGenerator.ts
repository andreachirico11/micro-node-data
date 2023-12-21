import { Column, MongoTable } from '../models/mongoTable';
import { model, Schema } from 'mongoose';

const estrapolateTypeConstructor = (stringType: string) => {
  switch (stringType) {
    case 'boolean':
      return Boolean;
    case 'number':
      return Number;
    case 'string':
    default:
      return String;
  }
};

const reducer = (prevSchema: Object, { columnType, name, require }: Column) => {
  const newColumn = { require, type: estrapolateTypeConstructor(columnType) };
  console.log(newColumn);

  return { ...prevSchema, [name]: newColumn };
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

export default schemaGenerator;
