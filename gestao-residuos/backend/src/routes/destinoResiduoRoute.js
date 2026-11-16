
import express from "express";
import DestinoResiduoController from "../controllers/destinoResiduoController.js";
import autenticar from "../middlewares/authMiddleware.js";
import autorizarAdmin from "../middlewares/autorizarAdmin.js";

const router = express.Router();

router.get("/", autenticar, DestinoResiduoController.listar);

router.post(
    "/",
    autenticar,
    autorizarAdmin,
    DestinoResiduoController.cadastrar
);

export default router;
