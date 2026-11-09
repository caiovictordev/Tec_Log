
import express from "express";
import MaquinaController from "../controllers/maquinaController.js";

const router = express.Router();

router.get("/", MaquinaController.listar);
router.post("/", MaquinaController.cadastrar);

export default router;
