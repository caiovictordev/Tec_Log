import express from "express";
import MaterialController from "../controllers/materialController.js";

const router = express.Router();

router.get("/", MaterialController.listar);
router.post("/", MaterialController.cadastrar);

export default router;