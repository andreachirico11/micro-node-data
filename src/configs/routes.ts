import { Router } from "express";
import { getPing } from "../controllers/ping";
import { unsupportedUrl } from "../controllers/unsuportedUrl";
import { configRequest } from "../controllers/utils";
import { put, remove, get, post, getAll } from "../controllers/sample";
import { checkAuthToken } from "../controllers/auth";

const router = Router();

router.all('*', configRequest);

const samplesRouter = Router();
samplesRouter.delete("/:id", remove);
samplesRouter.put("/:id", put);
samplesRouter.get("/:id", get);
samplesRouter.post("/", post);
samplesRouter.get("/", getAll);
router.use("/samples", checkAuthToken, samplesRouter);

router.get('/ping', getPing);

router.use('*', unsupportedUrl);

export default router;
