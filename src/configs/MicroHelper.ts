import { MicroAuthHelper } from "../helpers/MIcroAuthHelper";
import { MICRO_AUTH_URI } from "./Envs";

export const AuthHelper = new MicroAuthHelper(MICRO_AUTH_URI);