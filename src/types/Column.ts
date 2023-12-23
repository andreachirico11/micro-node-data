import HandledTypes from "../configs/HandledTypes";

export default interface Column {
    name: string;
    require: boolean;
    columnType: HandledTypes;
  }
  