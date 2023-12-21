import {ParsedVariables} from "dotenv-parse-variables";

export default interface IEnvs extends ParsedVariables {
    PRODUCTION: boolean;
    PORT: number;
    BASE_URL: string;
    MONGO_URI: string;
    MICRO_AUTH_URI: string;
  }
  