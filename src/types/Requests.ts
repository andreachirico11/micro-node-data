import { Request } from 'express';
import { ParsedUrlQuery } from 'querystring';

export type IdParams = { id: string };
export type TableNameParams = { tableName: string };

export type UncheckedOperationsQUery = {unchecked_operations: string};

export type HeaderBase = { [key: string]: string };
export type HeaderApiKey = { api_key: string };
export type HeaderAuthorization = { authorization: string };
export type HeaderDropColl = { drop_if_empty: string };

export type PartialBody = Omit<Object, '_id'>;

interface ProtectedRequest<TParams, Tbody, Tbody2>
  extends Request<TParams & TableNameParams, Tbody, Tbody2> {
  headers: HeaderApiKey & HeaderAuthorization;
}

interface ProtectedRequestWithCustomQuery<TParams, Tbody, Tbody2, Tquery extends ParsedUrlQuery>
  extends ProtectedRequest<TParams, Tbody, Tbody2> {
  query: Tquery;
}

interface ProtectedRequestWithCustomHeaders<
  TParams,
  Tbody,
  Tbody2,
  TCustomHeaders extends HeaderBase
> extends ProtectedRequest<TParams, Tbody, Tbody2> {
  headers: HeaderApiKey & HeaderAuthorization & TCustomHeaders;
}

export type RequestEmpty = ProtectedRequest<{}, {}, {}>;

export type RequestWithId = ProtectedRequest<IdParams, {}, any>;

export type RequestWithBody = ProtectedRequest<{}, {}, PartialBody>;

export type RequestWithBodyAndQuery = ProtectedRequestWithCustomQuery<{}, {}, PartialBody, UncheckedOperationsQUery>;

export type RequestWithBodyAndid = RequestWithId & RequestWithBody;

export type DeleteRequest = ProtectedRequestWithCustomHeaders<IdParams, null, null, HeaderDropColl>;

export type AllProtectedRequests =
  | RequestEmpty
  | RequestWithId
  | RequestWithBody
  | RequestWithBodyAndid
  | DeleteRequest;
