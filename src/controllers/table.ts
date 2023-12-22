import { RequestHandler } from 'express';
import { ServerErrorResp, ServerErrorRespWithMessage } from '../types/ApiResponses';
import { GENERIC } from '../types/ErrorCodes';
import { log_info, log_error } from '../utils/log';
import { RequestWithBody } from '../types/Requests';
import { MongoTable, MongoTableeModel } from '../models/mongoTable';
import { GetSetRequestProps } from '../utils/GetSetAppInRequest';
import generateColumnsFromBody from '../utils/columnGenerator';
import { DynamicModel, UnhandledDataType } from '../utils/dynamicModel';


export const addTableIfDoesntExists: RequestHandler = async (
  req: RequestWithBody,
  res,
  next
) => {
  try {
    const {
      body,
      params: { tableName },
      headers: { api_key },
    } = req;
    log_info('Checking if the table ' + tableName + ' exists');
    const found = (await MongoTableeModel.findOne({ tableName })) as unknown as MongoTable;
    if (!!found) {
      log_info(`The table exists: ${found._id}`);
      GetSetRequestProps.setTableModel(req, found);
      return next();
    }

    log_info('No table model was found, starting generation');
    const columns = generateColumnsFromBody(body);
    log_info(columns.map(c => JSON.stringify(c)), 'These column will be generated')

    MongoTableeModel.init();
    const result = (await new MongoTableeModel({
      appApiKey: api_key,
      tableName,
      columns,
    }).save()) as unknown as MongoTable;
    log_info(`Successfully created table with id: ${result._id}`);

    GetSetRequestProps.setTableModel(req, result);
    return next();
  } catch (error) {
    log_error(error, 'There was an error generating the table');
    return new ServerErrorResp(res, GENERIC);
  }
};


export const generateModelFromTable: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    DynamicModel.generate(GetSetRequestProps.getTableModel(req));
    log_info(DynamicModel.modelName + " generated successfully");
    return next();
  } catch (error) {
    if (error instanceof UnhandledDataType) {
      const message = 'The property: ' + error.propertyWhichCausedError + ' is not supported yet'
      log_error(message);
      return new ServerErrorRespWithMessage(res, message);
    }
    log_error(error, 'There was an error generating the model');
    return new ServerErrorResp(res);
  }
};
