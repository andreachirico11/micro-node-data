import { RequestHandler } from 'express';
import { NotFoundResp, ServerErrorResp, ServerErrorRespWithMessage } from '../types/ApiResponses';
import { GENERIC, NON_EXISTENT, UNSUPPORTED_URL } from '../types/ErrorCodes';
import { log_info, log_error } from '../utils/log';
import { AllProtectedRequests, RequestWithBody, RequestWithBodyAndQuery } from '../types/Requests';
import { CollectionConfig, CollectionConfigModel } from '../models/collectionConfig';
import { GetSetRequestProps } from '../utils/GetSetAppInRequest';
import { DynamicModel } from '../models/dynamicModel';
import tableRemover from '../utils/tableRemover';
import { parseObjectToColumnDefinition } from '../utils/columnConfigurators';
import { UnhandledDataType } from '../types/Errors';
import dynamicSchemaGenerator from '../utils/dynamicSchemaGenerator';
import { CONFIGS_COLLECTION_NAME, DEFAULT_UNCHEKED_OPS } from '../configs/Envs';
import { CrudOperations } from '../types/CrudOperations';
import uncheckedOpsSplitter from '../utils/uncheckedOpsSplitter';

export const retrieveTableModel: RequestHandler = async (req: AllProtectedRequests, res, next) => {
  const { tableName } = req.params;
  if (!!!tableName) {
    log_info('No table name found');
    return new NotFoundResp(res, UNSUPPORTED_URL, 'Missing table reference in url');
  }
  log_info('Checking if the table ' + tableName + ' exists');
  const found = (await CollectionConfigModel.findOne({ tableName })) as unknown as CollectionConfig;
  if (!!!found) {
    const message = `The table <<${tableName} >> does not exists`;
    log_error(message);
    return new ServerErrorResp(res, NON_EXISTENT);
  }
  log_info('Table model retrieved');
  GetSetRequestProps.setTableModel(req, found);
  return next();
};

export const addTableIfDoesntExists: RequestHandler = async (req: RequestWithBodyAndQuery, res, next) => {
  try {
    const {
      body,
      headers: { api_key },
      params: { tableName },
      query: {unchecked_operations}
    } = req;
    const found = (await CollectionConfigModel.findOne({ tableName })) as unknown as CollectionConfig;

    if (!!found) {
      log_info(`The table exists: ${found._id}`);
      GetSetRequestProps.setTableModel(req, found);
      return next();
    }

    log_info('No table model was found, starting generation process');
    if (tableName === CONFIGS_COLLECTION_NAME) {
      const message = 'Table name is reserved';
      log_error(message);
      return new ServerErrorRespWithMessage(res, message);
    }

    const columns = parseObjectToColumnDefinition(body);
    log_info(
      columns.map((c) => JSON.stringify(c)),
      'These column will be generated for the new table: ' + tableName.toUpperCase()
      );
      log_info(unchecked_operations, "These operations will be free from auth checking");
    CollectionConfigModel.init();
    const result = (await new CollectionConfigModel({
      appApiKey: api_key,
      tableName,
      unCheckedOperations: uncheckedOpsSplitter(unchecked_operations) || DEFAULT_UNCHEKED_OPS,
      columns,
    }).save()) as unknown as CollectionConfig;

    log_info(`Successfully created table with id: ${result._id}`);

    GetSetRequestProps.setTableModel(req, result);
    tableRemover.scheduleTableForElimination(result._id);

    return next();
  } catch (error) {
    if (error instanceof UnhandledDataType) {
      const message = 'The property: ' + error.propertyWhichCausedError + ' is not supported yet';
      log_error(message);
      return new ServerErrorRespWithMessage(res, message);
    }
    log_error(error, 'There was an error generating the table');
    return new ServerErrorResp(res, GENERIC);
  }
};

export const generateModelFromTable: RequestHandler = async (req, res, next) => {
  try {
    const schema = dynamicSchemaGenerator(GetSetRequestProps.getTableModel(req)).mongo();
    log_info("Schema generated")
    DynamicModel.generate(schema);
    log_info(DynamicModel.modelName + ' generated successfully');
    return next();
  } catch (error) {
    if (error instanceof UnhandledDataType) {
      const message = 'The property: ' + error.propertyWhichCausedError + ' is not supported yet';
      log_error(message);
      tableRemover.eliminateTableIfScheduled();
      return new ServerErrorRespWithMessage(res, message);
    }
    log_error(error, 'There was an error generating the model');
    tableRemover.eliminateTableIfScheduled();
    return new ServerErrorResp(res);
  }
};
