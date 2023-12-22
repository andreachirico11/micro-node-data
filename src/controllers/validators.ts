import { RequestHandler } from 'express';
import { ISchema, ObjectSchema, StringSchema, ValidationError } from 'yup';
import { log_error, log_info } from '../utils/log';
import { ValidationErrResp } from '../types/ApiResponses';
import { RequestWithBody } from '../types/Requests';
import { Column, MongoTable } from '../models/mongoTable';
import { GetSetRequestProps } from '../utils/GetSetAppInRequest';
import { object, number, string, boolean } from 'yup';

const typeValidator = (c: Column) => {
  let output;
  switch (c.columnType) {
    case 'string':
      output = string();
      break;
    case 'boolean':
      output = boolean();
      break;
    case 'number':
      output = number();
      break;
    default:
      throw new Error();
  }
  return c.require ? output.required() : output;
};

const columnReducer = (schema: Object, c: Column) => ({ ...schema, [c.name]: typeValidator(c) });

const generateValidatorSchemaFromTable = ({ columns }: MongoTable): ObjectSchema<any> => {
  return object(
    columns.reduce((actual, column) => (actual = columnReducer(actual, column)), {})
  ).required();
};

const printSchema = ({ fields }: ObjectSchema<any>) => {
  return Object.keys(fields).map((key) => {
    return key + " --> " + fields[key]['type'];
  });
};

export const dynamicValidator: RequestHandler = async (req: RequestWithBody, res, next) => {
  try {
    const t = GetSetRequestProps.getTableModel(req);
    log_info('Generating Validation SChema for the table: ' + t.tableName);
    const schema = generateValidatorSchemaFromTable(t);
    log_info(printSchema(schema), 'Generated Validation SChema');
    schema.validateSync(req.body);
    log_info('Request body is valid');
    next();
  } catch (e) {
    let message = 'Unknown Validation Error';
    if (e instanceof ValidationError) {
      message = e.message;
      log_error(message);
    }
    new ValidationErrResp(res, [message]);
  }
};
