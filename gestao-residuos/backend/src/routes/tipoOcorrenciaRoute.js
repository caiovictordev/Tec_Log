
import express from "express";
import TipoOcorrenciaController from "../controllers/tipoOcorrenciaController.js";
import autenticar from "../middlewares/authMiddleware.js";
import autorizarAdmin from "../middlewares/autorizarAdmin.js";

const router = express.Router();

router.get("/", autenticar, TipoOcorrenciaController.listar);

router.post(
    "/",
    autenticar,
    autorizarAdmin,
    TipoOcorrenciaController.cadastrar
);

export default router;
