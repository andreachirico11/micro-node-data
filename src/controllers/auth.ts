import { RequestHandler } from 'express';
import { AllProtectedRequests } from '../types/Requests';
import { log_error, log_info } from '../utils/log';
import { ServerErrorResp, UnauthorizedResp } from '../types/ApiResponses';
import { INTERNAL_SERVER } from '../types/ErrorCodes';
import { AuthHelper } from '../configs/MicroHelper';
import { isAuthErrorResponse } from '../helpers/MIcroAuthHelper';
import { BYPASS_AUTH, NodeTlsHandler } from '../configs/Envs';
import { GetSetRequestProps } from '../utils/GetSetAppInRequest';
import { CrudOperations } from '../types/CrudOperations';
import tableRemover from '../utils/tableRemover';

const isRequestFreeFromCheck = (unCheckedOperations: CrudOperations[], req: AllProtectedRequests) => {
    return unCheckedOperations.some(method => method === req.method)
}

export const authorize: RequestHandler = async (
  req: AllProtectedRequests,
  res,
  next
) => {
  if (BYPASS_AUTH) {
    log_info('BYPASSING AUTHENTICATION');
    return next();
  }
  try {
    const { headers: { api_key, authorization } } = req;

    if (!!!api_key) {
      log_error('Missing Api key');
      return new UnauthorizedResp(res, 'Missing Api key');
    }

    const {unCheckedOperations} = GetSetRequestProps.getTableModel(req);
    log_info(JSON.stringify(unCheckedOperations) , "This collection doesn't need authentication for these operations")
    
    if (isRequestFreeFromCheck(unCheckedOperations, req)) {
      log_info("This request doesn't need to be authorized")
      return next();
    }

    if (!!!authorization) {
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
      tableRemover.eliminateTableIfScheduled();
      log_error(response.errors, response.errCode);
      return new UnauthorizedResp(res, "invalid token");
    }

    log_info('Token Valid');
    return next();
  } catch (e) {
    tableRemover.eliminateTableIfScheduled();
    log_error(e, 'Error checking the authentication');
    return new ServerErrorResp(res, INTERNAL_SERVER);
  }
  finally {
    NodeTlsHandler.enableTls();
  }
};
