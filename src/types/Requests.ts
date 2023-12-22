import { Request } from 'express';

export type IdParams = { id: string };
export type TableNameParams = { tableName: string };

export type HeaderApiKey = { api_key: string };
export type HeaderAuthorization = { authorization: string };

export type PartialBody = Omit<Object, '_id'>;

interface ProtectedRequest<TParams, Tbody, Tbody2>
  extends Request<TParams & TableNameParams, Tbody, Tbody2> {
  headers: HeaderApiKey & HeaderAuthorization;
}

export type RequestEmpty = ProtectedRequest<{}, {}, {}>;

export type RequestWithId = ProtectedRequest<IdParams, {}, any>;

export type RequestWithBody = ProtectedRequest<{}, {}, PartialBody>;

export type RequestWithBodyAndid = RequestWithId & RequestWithBody;

export type AllProtectedRequests =
  | RequestEmpty
  | RequestWithId
  | RequestWithBody
  | RequestWithBodyAndid;
