import {ParsedVariables} from "dotenv-parse-variables";

export default interface IEnvs extends ParsedVariables {
    PRODUCTION: boolean;
    PORT: number;
    BASE_URL: string;
  }
  