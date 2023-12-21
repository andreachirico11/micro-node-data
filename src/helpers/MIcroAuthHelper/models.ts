import { ErrorCodes } from "./ErrorCodes";

  
  export interface AuthSuccessResp {
    success: true;
  }

  export interface AuthErrorResponse {
    errCode: ErrorCodes;
    errors: [string];
    success: false;
  }
  
  export function isAuthErrorResponse(r: AuthErrorResponse | AuthSuccessResp): r is AuthErrorResponse {
      return !r.success;
  }
  