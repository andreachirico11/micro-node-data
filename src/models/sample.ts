import {Document, model, Schema, Types } from "mongoose";

export interface Sample extends Document {
    name: string,
    imgUrl: string,
    description: string,
    externalUrl: string,
    _id: string
}

const SampleSchema = new Schema({
    name: {type: String, require: true},
    imgUrl:  {type: String, require: true},
    description: {type: String, require: false},
    externalUrl:  {type: String, require: true}
}, { versionKey: false })

export const SampleModel = model('sample', SampleSchema);
