import { Router } from "express";
import { getPing } from "../controllers/ping";
import { unsupportedUrl } from "../controllers/unsuportedUrl";
import { configRequest } from "../controllers/utils";
import { checkAuthToken } from "../controllers/auth";
import { addTableIfDoesntExists, generateModelFromTable, retrieveTableModel } from "../controllers/table";
import { getAll, post, get, remove, put } from "../controllers/cruds";
import { dynamicValidator } from "../controllers/validators";

const router = Router();

router.all('*', configRequest);

const crudRouter = Router();
crudRouter.delete("/:id",generateModelFromTable, remove);
crudRouter.put("/:id", dynamicValidator, generateModelFromTable,  put);
crudRouter.get("/:id", generateModelFromTable, get);
crudRouter.post("/", addTableIfDoesntExists, dynamicValidator, generateModelFromTable, post);
crudRouter.get("/", generateModelFromTable, getAll);
router.use("/:tableName", checkAuthToken, retrieveTableModel, crudRouter);


router.get('/ping', getPing);

router.use('*', unsupportedUrl);

export default router;
