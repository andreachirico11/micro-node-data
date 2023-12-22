import { RequestHandler } from 'express';
import { SuccessResponse, ServerErrorResp } from '../types/ApiResponses';
import { GENERIC, INTERNAL_SERVER, NON_EXISTENT } from '../types/ErrorCodes';
import { log_info, log_error } from '../utils/log';
import {
  RequestEmpty,
  RequestWithBody,
  RequestWithBodyAndid,
  RequestWithId,
} from '../types/Requests';
import { deleteModel } from 'mongoose';
import { DynamicModel } from '../utils/dynamicModel';

const cleanupModel = (modelName: string) => {
  try {
    log_info('deleting model ', modelName);
    deleteModel(modelName);
    log_info('deleted');
  } catch (e) {
    log_error(e, 'Error deleting model');
  }
};

export const getAll: RequestHandler = async (req: RequestEmpty, res) => {
  try {
    log_info('Getting all objects from the table ' + DynamicModel.modelName);
    const result = await DynamicModel.getAll();
    const message = `Successfully retrieved ${result.length} records`;
    log_info(message);
    return new SuccessResponse(res, result);
  } catch (error) {
    log_error(error, 'There was an error fetching objecs');
    return new ServerErrorResp(res, GENERIC);
  }
};

export const get: RequestHandler = async (req: RequestWithId, res) => {
  const {
    params: { id },
  } = req;
  try {
    log_info('Getting object with id: ' + id + ' from table ' + DynamicModel.modelName);
    const result = await DynamicModel.get(id);
    const message = `Successfully retrieved ${result['_id']}`;
    log_info(message);
    return new SuccessResponse(res, result);
  } catch (error) {
    log_error(error, 'There was an error fetching ' + id);
    return new ServerErrorResp(res, GENERIC);
  }
};

export const post: RequestHandler = async (req: RequestWithBody, res) => {
  const { body } = req;
  try {
    log_info(body, 'Generating new ' + DynamicModel.modelName + ' with following data');
    const result = await DynamicModel.post(body);
    const message = `Successfully created with id: ${result['_id']}`;
    log_info(message);
    return new SuccessResponse(res, result);
  } catch (error) {
    log_error(error, 'There was an error generating object');
    return new ServerErrorResp(res, INTERNAL_SERVER);
  }
};

export const put: RequestHandler = async (req: RequestWithBodyAndid, res) => {
  const {
    body,
    params: { id: _id },
  } = req;
  try {
    log_info(body, 'Updating objec with id: ' + _id + ' from table ' + DynamicModel.modelName);
    const updated = await DynamicModel.put(body, _id);
    const message = `Successfully updated ${updated['_id']} record`;
    log_info(message);
    return new SuccessResponse(res, updated);
  } catch (error) {
    log_error(error, 'There was an error updating object');
    return new ServerErrorResp(res, GENERIC);
  }
};

export const remove: RequestHandler = async (req: RequestWithId, res) => {
  const {
    params: { id: _id },
  } = req;
  try {
    log_info('Deleting objec with id: ' + _id);
    if (!(await DynamicModel.delete(_id))) {
      throw new Error();
    }
    const message = `Successfully deleted`;
    log_info(message);
    return new SuccessResponse(res);
  } catch (error) {
    log_error(error, 'There was an error deleting object');
    return new ServerErrorResp(res, NON_EXISTENT);
  }
};
