import { RequestHandler } from 'express';
import { ObjectSchema, ValidationError } from 'yup';
import { log_error, log_info } from '../utils/log';
import { ValidationErrResp } from '../types/ApiResponses';
import { RequestWithBody } from '../types/Requests';
import { Column, MongoTable } from '../models/mongoTable';
import { GetSetRequestProps } from '../utils/GetSetAppInRequest';
import { object } from 'yup';
import tableRemover from '../utils/tableRemover';
import columnTypes from '../configs/columnTypes';

const typeValidator = (c: Column) => {
  return columnTypes(c).validator;
};

const columnReducer = (schema: Object, c: Column) => ({ ...schema, [c.name]: typeValidator(c) });

const generateValidatorSchemaFromTable = ({ columns }: MongoTable): ObjectSchema<any> => {
  return object(
    columns.reduce((actual, column) => (actual = columnReducer(actual, column)), {})
  ).required();
};

const printSchema = ({ fields }: ObjectSchema<any>) => {
  return Object.keys(fields).map((key) => {
    return key + ' --> ' + fields[key]['type'];
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
    tableRemover.eliminateTableIfScheduled();
    new ValidationErrResp(res, [message]);
  }
};
