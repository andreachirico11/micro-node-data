import { RequestHandler } from 'express';
import { ObjectSchema, ValidationError } from 'yup';
import { log_error, log_info } from '../utils/log';
import { ValidationErrResp } from '../types/ApiResponses';

export const getRequestBodyValidator = (schema: ObjectSchema<any>) => {
  return function ({ body }, res, next) {
    try {
      schema.validateSync(body);
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
  } as RequestHandler;
};