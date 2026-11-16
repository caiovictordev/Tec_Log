import express from "express";
import MaterialController from "../controllers/materialController.js";
import autenticar from "../middlewares/authMiddleware.js";
import autorizarAdmin from "../middlewares/autorizarAdmin.js";

const router = express.Router();

// Qualquer usuário autenticado pode listar
router.get("/", autenticar, MaterialController.listar);

// Somente administradores podem gerenciar materiais
router.post("/", autenticar, autorizarAdmin, MaterialController.cadastrar);
router.put("/:id", autenticar, autorizarAdmin, MaterialController.editar);
router.delete("/:id", autenticar, autorizarAdmin, MaterialController.excluir);

export default router;
