import * as y from 'yup';
import { Column } from '../models/mongoTable';

type ValidatorFn = ReturnType<typeof y.string | typeof y.boolean | typeof y.number>;

type ConstructorType = StringConstructor | BooleanConstructor | NumberConstructor;

export default (c: Column) => {
  let validator: ValidatorFn, constructorType: ConstructorType;
  switch (c.columnType) {
    case 'string':
      constructorType = String;
      validator = y.string();
      break;
    case 'boolean':
      constructorType = Boolean;
      validator = y.boolean();
      break;
    case 'number':
      constructorType = Number;
      validator = y.number();
      break;
    default:
      throw new Error();
  }
  if (c.require) {
    validator = validator.required();
  }
  return { validator, constructorType };
};
