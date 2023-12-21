
import { Request } from 'express';
import { Sample } from '../models/sample';


export type IdParams = {id: string};

export type PartialSampleBody = Omit<Sample, '_id'>;



export type RequestWithId = Request<IdParams, {}, any>;

export type RequestWithPartialSampleBody = Request<{}, {}, PartialSampleBody>;

export type RequestWithBodyAndid = RequestWithId & RequestWithPartialSampleBody;

