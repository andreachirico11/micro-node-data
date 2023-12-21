import { Router } from "express";
import { getPing } from "../controllers/ping";
import { unsupportedUrl } from "../controllers/unsuportedUrl";
import { configRequest } from "../controllers/utils";

const router = Router();

router.all('*', configRequest);

router.get('/ping', getPing);

router.use('*', unsupportedUrl);

export default router;
