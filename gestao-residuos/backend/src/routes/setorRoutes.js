import express from "express";
import SetorController from "../controllers/setorController.js";
import autenticar from "../middlewares/authMiddleware.js";
import autorizarAdmin from "../middlewares/autorizarAdmin.js";

const router = express.Router();

// Listar setores: qualquer usuário autenticado
router.get("/", autenticar, SetorController.listar);

// Gerenciar setores: somente administradores
router.post("/", autenticar, autorizarAdmin, SetorController.cadastrar);
router.put("/:id", autenticar, autorizarAdmin, SetorController.editar);
router.delete("/:id", autenticar, autorizarAdmin, SetorController.excluir);

export default router;