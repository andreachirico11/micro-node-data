import { RequestHandler } from 'express';
import { AllProtectedRequests } from '../types/Requests';
import { log_error, log_info } from '../utils/log';
import { ServerErrorResp, UnauthorizedResp } from '../types/ApiResponses';
import { INTERNAL_SERVER } from '../types/ErrorCodes';
import { AuthHelper } from '../configs/MicroHelper';
import { isAuthErrorResponse } from '../helpers/MIcroAuthHelper';
import { BYPASS_AUTH, NodeTlsHandler } from '../configs/Envs';

export const checkAuthToken: RequestHandler = async (
  { headers: { api_key, authorization }, params }: AllProtectedRequests,
  res,
  next
) => {
  if (BYPASS_AUTH) {
    log_info('BYPASSING AUTHENTICATION');
    return next();
  }
  try {

    if (!!!api_key || !!!authorization) {
      log_error('Impossible to verify authorization');
      return new UnauthorizedResp(res, 'Missing Api key or token');
    }
    log_info(
      `Check if the token << ${authorization} >> is valid for the api key << ${api_key} >>`,
      `The route is protected`
    );
    NodeTlsHandler.disableTls();

    const response = await AuthHelper.checkToken(api_key, authorization);

    if (isAuthErrorResponse(response)) {
      log_error(response.errors, response.errCode);
      return new UnauthorizedResp(res, "invalid token");
    }

    log_info('Token Valid');
    return next();
  } catch (e) {
    log_error(e, 'Error checking the authentication');
    return new ServerErrorResp(res, INTERNAL_SERVER);
  }
  finally {
    NodeTlsHandler.enableTls();
  }
};
