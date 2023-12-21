import { BASE_URL } from './Envs';
import * as express from 'express';
import router from './routes';

export default function () {
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use('/' + BASE_URL, router);
  return app;
}
