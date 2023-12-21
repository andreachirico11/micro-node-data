import {Document, model, Schema } from "mongoose";

const PingSchema = new Schema({
    ping: {type: Boolean}
})

export const PingModel = model('ping', PingSchema);

export interface Ping extends Document {
    ping: boolean;
}