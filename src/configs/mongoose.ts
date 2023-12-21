import { connect } from "mongoose";
import { MONGO_URI } from "./Envs";

export function mongooseConnect() {
    return connect(MONGO_URI, {
        dbName: "micro-data"
    })
}