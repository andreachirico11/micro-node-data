import { RequestHandler } from 'express';
import { ValidationError } from 'yup';
import { log_error, log_info } from '../utils/log';
import { ValidationErrResp } from '../types/ApiResponses';
import { RequestWithBody } from '../types/Requests';
import { GetSetRequestProps } from '../utils/GetSetAppInRequest';
import tableRemover from '../utils/tableRemover';
import dynamicSchemaGenerator, { printSchema } from '../utils/dynamicSchemaGenerator';

export const dynamicValidator: RequestHandler = async (req: RequestWithBody, res, next) => {
  try {
    const schema = dynamicSchemaGenerator(GetSetRequestProps.getTableModel(req)).yup();
    log_info('Generated Validation SChema');
    printSchema(schema);
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
