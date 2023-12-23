import { RequestHandler } from 'express';
import { NotFoundResp, ServerErrorResp, ServerErrorRespWithMessage } from '../types/ApiResponses';
import { GENERIC, NON_EXISTENT, UNSUPPORTED_URL } from '../types/ErrorCodes';
import { log_info, log_error } from '../utils/log';
import { AllProtectedRequests, RequestWithBody } from '../types/Requests';
import { MongoTable, MongoTableeModel } from '../models/mongoTable';
import { GetSetRequestProps } from '../utils/GetSetAppInRequest';
import generateColumnsFromBody from '../utils/columnGenerator';
import { DynamicModel, UnhandledDataType } from '../utils/dynamicModel';
import tableRemover from '../utils/tableRemover';

export const retrieveTableModel: RequestHandler = async (req: AllProtectedRequests, res, next) => {
  const { tableName } = req.params;
  if (!!!tableName) {
    log_info('No table name found');
    return new NotFoundResp(res, UNSUPPORTED_URL, 'Missing table reference in url');
  }
  log_info('Checking if the table ' + tableName + ' exists');
  const found = (await MongoTableeModel.findOne({ tableName })) as unknown as MongoTable;
  if (!!!found) {
    const message = `The table <<${tableName} >> does not exists`; 
    log_error(message);
    return new ServerErrorResp(res, NON_EXISTENT);
  }
  log_info("Table model retrieved"); 
  GetSetRequestProps.setTableModel(req, found);
  return next();
};

export const addTableIfDoesntExists: RequestHandler = async (req: RequestWithBody, res, next) => {
  try {
    const {
      body,
      headers: { api_key },
      params: { tableName },
    } = req;
    const found = (await MongoTableeModel.findOne({ tableName })) as unknown as MongoTable;
    
    if (!!found) {
      log_info(`The table exists: ${found._id}`);
      GetSetRequestProps.setTableModel(req, found);
      return next();
    } 
    
    log_info('No table model was found, starting generation process');
    const columns = generateColumnsFromBody(body);
    log_info(
      columns.map((c) => JSON.stringify(c)),
      'These column will be generated for the new table: ' + tableName.toUpperCase()
    );
    MongoTableeModel.init();
    const result = (await new MongoTableeModel({
      appApiKey: api_key,
      tableName,
      columns,
    }).save()) as unknown as MongoTable;

    log_info(`Successfully created table with id: ${result._id}`);

    GetSetRequestProps.setTableModel(req, result);
    tableRemover.scheduleTableForElimination(result._id);

    return next();
  } catch (error) {
    log_error(error, 'There was an error generating the table');
    return new ServerErrorResp(res, GENERIC);
  }
};

export const generateModelFromTable: RequestHandler = async (req, res, next) => {
  try {
    DynamicModel.generate(GetSetRequestProps.getTableModel(req));
    log_info(DynamicModel.modelName + ' generated successfully');
    return next();
  } catch (error) {
    if (error instanceof UnhandledDataType) {
      const message = 'The property: ' + error.propertyWhichCausedError + ' is not supported yet';
      log_error(message);
      return new ServerErrorRespWithMessage(res, message);
    }
    log_error(error, 'There was an error generating the model');
    tableRemover.eliminateTableIfScheduled();
    return new ServerErrorResp(res);
  }
};
