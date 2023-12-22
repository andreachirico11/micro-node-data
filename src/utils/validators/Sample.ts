import { object, number, string, date, boolean } from 'yup';


export const validatorexample = object({
  name: string().required(),
  passwordLenght: number().required(),
  uppercaseLetters: boolean().required(),
  symbols: boolean().required(),
  numbers: boolean().required(),
  refreshToken: boolean().required(),
  tokenHoursValidity: number().required(),
  refreshTokenHoursValidity: number().required(),
  resetTokenHoursValidity: number().required(),
}).required();

