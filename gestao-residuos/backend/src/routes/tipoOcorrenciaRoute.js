
import express from "express";
import TipoOcorrenciaController from "../controllers/tipoOcorrenciaController.js";

const router = express.Router();

router.get("/", TipoOcorrenciaController.listar);
router.post("/", TipoOcorrenciaController.cadastrar);

export default router;
