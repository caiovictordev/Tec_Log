
import express from "express";
import SetorController from "../controllers/setorController.js";

const router = express.Router();

router.get("/", SetorController.listar);
router.post("/", SetorController.cadastrar);

export default router;
