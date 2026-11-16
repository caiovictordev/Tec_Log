
import express from "express";
import DestinoResiduoController from "../controllers/destinoResiduoController.js";

const router = express.Router();

router.get("/", DestinoResiduoController.listar);
router.post("/", DestinoResiduoController.cadastrar);

export default router;
