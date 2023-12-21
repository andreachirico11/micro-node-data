import { RequestHandler } from "express";
import { SuccessResponse, ServerErrorResp } from "../types/ApiResponses";
import { GENERIC } from "../types/ErrorCodes";
import { log_info, log_error } from "../utils/log";
import { Sample, SampleModel } from "../models/sample";
import { RequestEmpty, RequestWithBodyAndid, RequestWithId, RequestWithPartialSampleBody } from "../types/Requests";

export const getAll: RequestHandler = async (req: RequestEmpty, res) => {
    try {
      log_info('Getting all samples');
      const result = await SampleModel.find({}) as unknown as Sample[];
      const message = `Successfully retrieved ${result.length} records`;
      log_info(message);
      return new SuccessResponse(res, result);
    } catch (error) {
      log_error(error, 'There was an error fetching samples');
      return new ServerErrorResp(res, GENERIC);
    }
  };

  export const get: RequestHandler = async ({params: {id}}: RequestWithId, res) => {
    try {
      log_info('Getting sample with id: ' + id);
      const result = await SampleModel.findById(id) as unknown as Sample;
      const message = `Successfully retrieved ${result.name}`;
      log_info(message);
      return new SuccessResponse(res, result);
    } catch (error) {
      log_error(error, 'There was an error fetching ' + id);
      return new ServerErrorResp(res, GENERIC);
    }
  };
  
  export const post: RequestHandler = async ({body}: RequestWithPartialSampleBody, res) => {
    try {
      log_info(body, 'Generating new sample with following data');
      SampleModel.init();
      const {_id} = await new SampleModel(body).save() as unknown as Sample;
      const message = `Successfully created with id: ${_id}`;
      log_info(message);
      return new SuccessResponse(res, _id);
    } catch (error) {
      log_error(error, 'There was an error generating object');
      return new ServerErrorResp(res, GENERIC);
    }
  };

  export const put: RequestHandler = async ({body, params: {id: _id}}: RequestWithBodyAndid, res) => {
    try {
      log_info(body, 'Updating sample with id: ' + _id);
      const {modifiedCount} = await SampleModel.updateOne({
        ...body, _id
      });
      const message = `Successfully updated ${modifiedCount} record`;
      log_info(message);
      return new SuccessResponse(res);
    } catch (error) {
      log_error(error, 'There was an error updating object');
      return new ServerErrorResp(res, GENERIC);
    }
  };

  export const remove: RequestHandler = async ({params: {id: _id}}: RequestWithId, res) => {
    try {
      log_info('Deleting sample with id: ' + _id);
      await SampleModel.findByIdAndDelete(_id);
      const message = `Successfully deleted`;
      log_info(message);
      return new SuccessResponse(res);
    } catch (error) {
      log_error(error, 'There was an error generating object');
      return new ServerErrorResp(res, GENERIC);
    }
  };
