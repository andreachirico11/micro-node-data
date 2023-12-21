import { Column } from "../models/mongoTable";


const generateColumn = (name: string, value: any): Column => ({name, require: true, columnType: typeof value})


const generateColumnsFromBody = (body: Object) => {
    return Object.keys(body).map(k => generateColumn(k, body[k]))
};


export default generateColumnsFromBody;