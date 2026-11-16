
import express from "express";

import OcorrenciaController from "../controllers/ocorrenciaController.js";
import autenticar from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/alertas", autenticar, OcorrenciaController.listarAlertas);

router.get("/", autenticar, OcorrenciaController.listar);
router.post("/", autenticar, OcorrenciaController.cadastrar);

export default router;
