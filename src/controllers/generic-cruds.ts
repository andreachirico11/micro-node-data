import { RequestHandler } from 'express';
import { SuccessResponse, ServerErrorResp } from '../types/ApiResponses';
import { GENERIC } from '../types/ErrorCodes';
import { log_info, log_error } from '../utils/log';
import { RequestEmpty, RequestWithBodyAndid, RequestWithId, RequestWithPartialSampleBody } from '../types/Requests';
import { GetSetRequestProps } from '../utils/GetSetAppInRequest';
import { deleteModel } from 'mongoose';

const cleanupModel = (modelName: string) => {
  try {
    log_info('deleting model ',  modelName);
    deleteModel(modelName);
    log_info('deleted');
  } catch(e) {
    log_error(e, 'Error deleting model');
  }
}


export const getAll: RequestHandler = async (req: RequestEmpty, res) => {
  const model = GetSetRequestProps.getDynamicModel(req);
  try {
    log_info('Getting all objects from the table ' + model.modelName);
    const result = await model.find({});
    const message = `Successfully retrieved ${result.length} records`;
    log_info(message);
    return new SuccessResponse(res, result);
  } catch (error) {
    log_error(error, 'There was an error fetching samples');
    return new ServerErrorResp(res, GENERIC);
  } finally {
    cleanupModel(model.modelName);
  }
};

export const get: RequestHandler = async (req: RequestWithId, res) => {
  const { params: { id } } = req;
  const model = GetSetRequestProps.getDynamicModel(req);
  try {
    log_info('Getting object with id: ' + id + ' from table ' + model.modelName);
    const result = await model.findById(id);
    const message = `Successfully retrieved ${result.name}`;
    log_info(message);
    return new SuccessResponse(res, result);
  } catch (error) {
    log_error(error, 'There was an error fetching ' + id);
    return new ServerErrorResp(res, GENERIC);
  } finally {
    cleanupModel(model.modelName);
  }
};

export const post: RequestHandler = async (req: RequestWithPartialSampleBody, res) => {
  const model = GetSetRequestProps.getDynamicModel(req),
  { body } = req;
  try {
    log_info(body, 'Generating new ' + model.modelName + ' with following data');
    model.init();
    const { _id } = await new model(body).save();
    const message = `Successfully created with id: ${_id}`;
    log_info(message);
    return new SuccessResponse(res, _id);
  } catch (error) {
    log_error(error, 'There was an error generating object');
    return new ServerErrorResp(res, GENERIC);
  } finally {
    cleanupModel(model.modelName);
  }
};

export const put: RequestHandler = async (req: RequestWithBodyAndid, res) => {
  const model = GetSetRequestProps.getDynamicModel(req), {body, params: {id: _id}} = req;
  try {
    log_info(body, 'Updating sample with id: ' + _id + ' from table ' + model.modelName);
    const {modifiedCount} = await model.updateOne({
      ...body, _id
    });
    const message = `Successfully updated ${modifiedCount} record`
    log_info(message);
    return new SuccessResponse(res);
  } catch (error) {
    log_error(error, 'There was an error updating object');
    return new ServerErrorResp(res, GENERIC);
  } finally {
    cleanupModel(model.modelName);
  }
};

export const remove: RequestHandler = async (req: RequestWithId, res) => {
  const model = GetSetRequestProps.getDynamicModel(req), {params: {id: _id}} = req;
  try {
    log_info('Deleting sample with id: ' + _id);
    await model.findByIdAndDelete(_id);
    const message = `Successfully deleted`;
    log_info(message);
    return new SuccessResponse(res);
  } catch (error) {
    log_error(error, 'There was an error generating object');
    return new ServerErrorResp(res, GENERIC);
  } finally {
    cleanupModel(model.modelName);
  }
};

