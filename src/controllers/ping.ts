import { RequestHandler } from 'express';
import { log_error, log_info } from '../utils/log';
import { ServerErrorResp, SuccessResponse } from '../types/ApiResponses';
import { GENERIC } from '../types/ErrorCodes';
import { GetSetRequestProps } from '../utils/GetSetAppInRequest';
import { PingModel } from '../models/ping';

export const getPing: RequestHandler = async (req, res) => {
  try {
    log_info('Start ping');
    const result = await PingModel.findOne();
    const message = "Ping from db = " + result.ping
    log_info(message);
    return new SuccessResponse(res, {message, host: GetSetRequestProps.getClientIp(req)});
  } catch (error) {
    log_error(error, 'There was an error fetching tests');
    return new ServerErrorResp(res, GENERIC);
  }
};