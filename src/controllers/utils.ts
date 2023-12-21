import { RequestHandler } from 'express';
import { log_info } from '../utils/log';
import { getClientIp } from 'request-ip';
import { GetSetRequestProps } from '../utils/GetSetAppInRequest';

export const configRequest: RequestHandler = async (req, _, next) => {
  const ipAddress = getClientIp(req);
  log_info(ipAddress, "GOT REQUEST FROM: ");
  GetSetRequestProps.setClientIp(req, ipAddress);
  next();
};