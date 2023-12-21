
import { Request } from 'express';
import { Sample } from '../models/sample';


export type IdParams = {id: string};

export type HeaderApiKey =  {api_key: string};
export type HeaderAuthorization =  {authorization: string};


export type PartialSampleBody = Omit<Sample, '_id'>;


interface ProtectedRequest<TParams, Tbody, Tbody2> 
extends Request<TParams, Tbody, Tbody2> {
    headers: HeaderApiKey & HeaderAuthorization;
}

export type RequestEmpty = ProtectedRequest<{}, {}, {}>;

export type RequestWithId = ProtectedRequest<IdParams, {}, any>;

export type RequestWithPartialSampleBody = ProtectedRequest<{}, {}, PartialSampleBody>;

export type RequestWithBodyAndid = RequestWithId & RequestWithPartialSampleBody

export type AllProtectedRequests = RequestEmpty | RequestWithId | RequestWithPartialSampleBody | RequestWithBodyAndid;