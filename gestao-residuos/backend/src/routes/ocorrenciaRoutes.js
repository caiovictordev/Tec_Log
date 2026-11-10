
import express from "express";

import OcorrenciaController from "../controllers/ocorrenciaController.js";
import autenticar from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", autenticar, OcorrenciaController.listar);
router.post("/", autenticar, OcorrenciaController.cadastrar);

export default router;
