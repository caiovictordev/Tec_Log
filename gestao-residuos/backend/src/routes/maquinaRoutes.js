
import express from "express";
import MaquinaController from "../controllers/maquinaController.js";
import autenticar from "../middlewares/authMiddleware.js";
import autorizarAdmin from "../middlewares/autorizarAdmin.js";

const router = express.Router();

// Qualquer usuário autenticado pode listar
router.get("/", autenticar, MaquinaController.listar);

// Somente administradores podem gerenciar máquinas
router.post("/", autenticar, autorizarAdmin, MaquinaController.cadastrar);
router.put("/:id", autenticar, autorizarAdmin, MaquinaController.editar);
router.delete("/:id", autenticar, autorizarAdmin, MaquinaController.excluir);

export default router;
