import { Router } from "express";
import { getPing } from "../controllers/ping";
import { unsupportedUrl } from "../controllers/unsuportedUrl";
import { configRequest } from "../controllers/utils";
import { checkAuthToken } from "../controllers/auth";
import { addTableIfDoesntExists, generateModelFromTable } from "../controllers/table";
import { getAll, post, get, remove, put } from "../controllers/cruds";

const router = Router();

router.all('*', configRequest);

const crudRouter = Router();
crudRouter.delete("/:id", remove);
crudRouter.put("/:id", put);
crudRouter.get("/:id", get);
crudRouter.post("/", post);
crudRouter.get("/", getAll);
router.use("/:tableName", checkAuthToken, addTableIfDoesntExists, generateModelFromTable, crudRouter);



router.get('/ping', getPing);

router.use('*', unsupportedUrl);

export default router;
