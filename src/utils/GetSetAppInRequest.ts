import { Request } from 'express';
import { CollectionConfig } from '../models/collectionConfig';

const CLIENT_IP = 'client_ip',
  ACTUAL_TABLE = 'ACTUAL_TABLE';

export class GetSetRequestProps {
  static getClientIp(req: Request) {
    return req[CLIENT_IP] as string;
  }

  static setClientIp(req: Request, ip: string) {
    req[CLIENT_IP] = ip;
  }

  static getTableModel(req: Request) {
    return req[ACTUAL_TABLE] as CollectionConfig;
  }

  static setTableModel(req: Request, t: CollectionConfig) {
    req[ACTUAL_TABLE] = t;
  }
}
