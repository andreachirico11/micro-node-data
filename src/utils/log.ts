import { pino, Level, LogFn } from 'pino';

const level: Level = 'debug';

const _pino = pino({
  level,
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      colorizeObjects: true,
    },
  },
});

const mesageParser = (input: Object, label?: string) => {
  const parser = (str, key) => `${str}\n${key}: ${input[key]}`; 
  return '{' + Object.keys(input).reduce(parser, '') + '\n}';
};

const logger = (logFn: LogFn, input: any, label?: string) => {
  if (typeof input === "object" && !(input instanceof Error)) {
    input = mesageParser(input, label);
  }
  logFn.bind(_pino)(!!label ? label + '\n' + input : input);
  return input;
}; 

export const log_info = (input: any, label?: string) => logger(_pino.info, input, label);
export const log_fatal = (input: any, label?: string) => logger(_pino.fatal, input, label);
export const log_error = (input: any, label?: string) => logger(_pino.error, input, label);
export const log_warn = (input: any, label?: string) => logger(_pino.warn, input, label);
