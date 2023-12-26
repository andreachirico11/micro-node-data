import { Document, model, Schema } from 'mongoose';
import Column from '../types/Column';
import { CONFIGS_COLLECTION_NAME } from '../configs/Envs';
import { CrudOperations } from '../types/CrudOperations';



export interface CollectionConfigProps {
  tableName: string;
  appApiKey: string;
  columns: Column[];
  unCheckedOperations:  CrudOperations[];
}

export type CollectionConfig  = Document & CollectionConfigProps;

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


const schema = new Schema(
  {
    tableName: { type: String, require: true },
    appApiKey: { type: String, require: true },
    unCheckedOperations: [{type: String, enum: CrudOperations}],
    columns: {
      type: [ColSchema],
      require: true,
    },
  },
  { versionKey: false }
);

export const CollectionConfigModel = model(CONFIGS_COLLECTION_NAME, schema);
