import { RequestHandler } from 'express';
import { connection } from 'mongoose';
import { ServerErrorResp } from '../types/ApiResponses';
import { GENERIC } from '../types/ErrorCodes';
import { log_error, log_info } from '../utils/log';
import { GetSetRequestProps } from '../utils/GetSetAppInRequest';

export const cleanup: RequestHandler = async (req, res, next) => {
  try {
    const model = GetSetRequestProps.getDynamicModel(req);
    log_info('deleting model model.modelName');
    connection.deleteModel(model.modelName);
    next();
  } catch (error) {
    log_error(error, 'Error deleting model');
    return new ServerErrorResp(res, GENERIC);
  }
};
