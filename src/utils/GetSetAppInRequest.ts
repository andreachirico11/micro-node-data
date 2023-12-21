import { Request } from 'express';
import { MongoTable } from '../models/mongoTable';
import { Model } from 'mongoose';

const CLIENT_IP = "client_ip", ACTUAL_TABLE= "ACTUAL_TABLE", DYNAMIC_MODEL = "DYNAMIC_MODEL";

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

    
    static getDynamicModel(req: Request) {
        return req[DYNAMIC_MODEL] as Model<any>;
    }

    static setDynamicModel(req: Request, t: Model<any>) {
        req[DYNAMIC_MODEL] = t;
    }
}