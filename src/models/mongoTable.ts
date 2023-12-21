import { Document, model, Schema } from 'mongoose';

export interface Column {
  name: string;
  require: boolean;
  columnType: string;
}

export interface MongoTable extends Document {
  _id: string;
  tableName: string;
  appApiKey: string;
  columns: Column[];
}

const MongoTableSchema = new Schema(
  {
    tableName: { type: String, require: true },
    appApiKey: { type: String, require: true },
    columns: {
      type: [
        {
          name: String,
          require: Boolean,
          columnType: String,
          _id: false
        },
      ],
      require: true,
    },
  },
  { versionKey: false }
);

export const MongoTableeModel = model('mongoTable', MongoTableSchema);
