import { Request } from 'express';
import { MongoTable } from '../models/mongoTable';

const CLIENT_IP = 'client_ip',
  ACTUAL_TABLE = 'ACTUAL_TABLE',
  ACTUAL_TABLENAME = 'ACTUAL_TABLENAME';

export class GetSetRequestProps {
  static getClientIp(req: Request) {
    return req[CLIENT_IP] as string;
  }

  static setClientIp(req: Request, ip: string) {
    req[CLIENT_IP] = ip;
  }

  static getTableModel(req: Request) {
    return req[ACTUAL_TABLE] as MongoTable;
  }

  static setTableModel(req: Request, t: MongoTable) {
    req[ACTUAL_TABLE] = t;
  }

  static getTableName(req: Request) {
    return req[ACTUAL_TABLENAME] as string;
  }

  static setTableName(req: Request, t: string) {
    req[ACTUAL_TABLENAME] = t;
  }
}
