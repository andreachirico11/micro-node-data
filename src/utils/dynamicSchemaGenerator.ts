import { Schema, model } from 'mongoose';
import HandledTypes from '../configs/HandledTypes';
import { MongoTableProps, MongoTable, MongoTableeModel } from '../models/mongoTable';
import Column from '../types/Column';
import { array, ObjectSchema, object } from 'yup';
import { columnConfigs } from './columnConfigurators';
import { log_info } from './log';

const reducer = (columns: Column[], action: (c: Column) => any) => {
  return columns.reduce((actual, column) => ({ ...actual, [column.name]: action(column) }), {});
};

const getFlags = (c: Column) => {
  const { columnType, children } = c;
  const isArray = columnType === HandledTypes.array,
    hasChildren = children && children.length > 0;
  return {
    arrayCase: hasChildren && isArray,
    objectCase: hasChildren && !isArray
  }
}

const constructorOrSchema = (c: Column) => {
  const {children, require } = c;
  const {arrayCase, objectCase} = getFlags(c);
  if (arrayCase) return { type: [getSchema(children)], require };
  if (objectCase) return getSchema(children);
  return {
    require,
    type: columnConfigs(c).constructorType
  };
};

const getSchema = (columns: Column[]) => {
  return new Schema(reducer(columns, constructorOrSchema), { versionKey: false });
};

const getValidatorOrChildren = (c: Column) => {
  const {children } = c;
  const {arrayCase, objectCase} = getFlags(c);
  if (arrayCase) return array().of(generateObjectSchema(children));
  if (objectCase) return  generateObjectSchema(children);
  return columnConfigs(c).validator;
};

const schemaGenerator = ({ tableName, columns }: MongoTableProps) => {
  return model<any>(tableName, getSchema(columns));
};


const generateObjectSchema = (columns: Column[]): ObjectSchema<any> => {
  return object(reducer(columns, getValidatorOrChildren)).required();
};

export const printSchema = ({ fields }: ObjectSchema<any>, indentation = '  ') => {
  console.log('{');
  Object.keys(fields).forEach((key) => {
    log_info(indentation + key + ' --> ' + fields[key]['type']);
    if (fields[key]['type'] === 'object') {
      printSchema(fields[key] as ObjectSchema<any>, indentation + '  ');
    }
    if (fields[key]['type'] === 'array') {
      printSchema(fields[key]['innerType'] as ObjectSchema<any>, indentation + '  ');
    }
  });
  console.log('}');
};

export default (t: MongoTable) => {
  const casted = MongoTableeModel.castObject(t) as MongoTableProps;
  return {
    mongo: () => schemaGenerator(casted),
    yup: () => generateObjectSchema(casted.columns),
  };
};
