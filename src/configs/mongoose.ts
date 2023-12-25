import { connect, connection, ConnectionStates } from "mongoose";
import { MONGO_URI } from "./Envs";

export function mongooseConnect() {
    return connect(MONGO_URI, {
        dbName: "micro-data"
    })
}


export function getDbState() {
    return Object.values(ConnectionStates)[connection.readyState] as string;
}
