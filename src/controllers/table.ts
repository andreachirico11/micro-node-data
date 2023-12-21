import { RequestHandler } from 'express';
import { ServerErrorResp } from '../types/ApiResponses';
import { GENERIC } from '../types/ErrorCodes';
import { log_info, log_error } from '../utils/log';
import { RequestWithPartialSampleBody } from '../types/Requests';
import { MongoTable, MongoTableeModel } from '../models/mongoTable';
import { GetSetRequestProps } from '../utils/GetSetAppInRequest';
import generateColumnsFromBody from '../utils/columnGenerator';
import schemaGenerator from '../utils/schemaGenerator';


export const addTableIfDoesntExists: RequestHandler = async (
  req: RequestWithPartialSampleBody,
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
    const mongoDoc = schemaGenerator(GetSetRequestProps.getTableModel(req));
    log_info(mongoDoc.modelName + " generated successfully");
    GetSetRequestProps.setDynamicModel(req, mongoDoc);
    return next();
  } catch (error) {
    log_error(error, 'There was an error generating the model');
    return new ServerErrorResp(res, GENERIC);
  }
};
