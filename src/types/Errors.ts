export class ColumnTypeNotHandledError implements Error {
  name: string;
  message: string;
  stack?: string;
  cause?: unknown;
  constructor(fieldName: string, fieldValue: any) {
    this.message = `The field name << ${fieldName} >> has a non supported value of\n${JSON.stringify(
      fieldValue
    )}`;
  }
}
