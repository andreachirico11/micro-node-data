import { PORT } from './configs/Envs';
import { log_error, log_fatal, log_info } from './utils/log';
import express from './configs/express';
import { Application } from 'express';
import { mongooseConnect } from './configs/mongoose';

(async function () {
  let app: Application;

  try {
    app = express();
  } catch (e) {
    log_error(e, 'Error Configuring Express');
  }

  try {
    mongooseConnect();
    log_info('Db connected');
  } catch (e) {
    log_error("Can't connect to db");
  }

  app
    .listen(PORT, () => {
      log_info('Listening on port: ' + PORT);
    })
    .on('error', () => {
      log_fatal('App listen Crashed');
    });
})();
