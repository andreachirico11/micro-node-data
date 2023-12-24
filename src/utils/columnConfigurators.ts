import * as y from 'yup';
import { isDateValid } from './dates';
import { ColumnTypeNotHandledError, UnhandledDataType } from '../types/Errors';
import HandledTypes from '../configs/HandledTypes';
import Column from '../types/Column';


type ValidatorFn = ReturnType<typeof y.string | typeof y.boolean | typeof y.number | typeof y.date>;

type ConstructorType = StringConstructor | BooleanConstructor | NumberConstructor | DateConstructor;

export const columnConfigs = (c: Column) => {
  let validator: ValidatorFn, constructorType: ConstructorType;
  switch (c.columnType) {
    case HandledTypes.string:
    case HandledTypes.undefined:
      constructorType = String;
      validator = y.string();
      break;
    case HandledTypes.boolean:
      constructorType = Boolean;
      validator = y.boolean();
      break;
    case HandledTypes.number:
      constructorType = Number;
      validator = y.number();
      break;
    case HandledTypes.date:
      constructorType = Date;
      validator = y.date();
      break;
    default:
    throw new UnhandledDataType(c.name);
  }
  if (c.require) {
    validator = validator.required();
  } else {
    validator = validator.nullable()
  }
  return { validator, constructorType };
};

const isSupported = (stringType: any) => Object.values(HandledTypes).includes(stringType);

const generateColumn = (name: string, value: any): Column => {
  let columnType: any = typeof value, require = true, children = null;
  if (value === null) {
    // HOW TO solve required problem
    // if a field is null will become of type undefined
    // undefined are treated as strings
    columnType = HandledTypes.undefined;  
  }
  if (!isSupported(columnType)) {
    throw new ColumnTypeNotHandledError(name, value);
  }
  if (columnType === HandledTypes.undefined) require = false;
  if (columnType === HandledTypes.string && isDateValid(value)) columnType = HandledTypes.date;
  if (columnType === HandledTypes.object) {
    if (Array.isArray(value)) {
      columnType = HandledTypes.array;
      if (typeof value[0] !== 'object') {
        throw new UnhandledDataType(name);
      }

      children = parseObjectToColumnDefinition(value[0]);
    } else {
      children = parseObjectToColumnDefinition(value);
    }
  }
  return { name, require, columnType, children };
};

export const parseObjectToColumnDefinition = (body: Object) => {
  return Object.keys(body).map((k) => generateColumn(k, body[k]));
};
