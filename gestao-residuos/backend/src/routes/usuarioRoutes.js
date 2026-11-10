
import express from "express";
import UsuarioController from "../controllers/usuarioController.js";
import autenticar from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", UsuarioController.listar);
router.post("/", UsuarioController.cadastrar);
router.post("/login", UsuarioController.login);
router.get("/perfil", autenticar, UsuarioController.perfil);

export default router;
