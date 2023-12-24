import { Document, model, Schema } from 'mongoose';
import Column from '../types/Column';



export interface MongoTableProps {
  tableName: string;
  appApiKey: string;
  columns: Column[];
}

export type MongoTable  = Document & MongoTableProps;

const ColSchema = new Schema(
  {
    name: String,
    require: Boolean,
    columnType: String
},
{ versionKey: false })

ColSchema.add(new Schema({
  children: [ColSchema]
}));


const MongoTableSchema = new Schema(
  {
    tableName: { type: String, require: true },
    appApiKey: { type: String, require: true },
    columns: {
      type: [ColSchema],
      require: true,
    },
  },
  { versionKey: false }
);

export const MongoTableeModel = model('mongoTable', MongoTableSchema);
