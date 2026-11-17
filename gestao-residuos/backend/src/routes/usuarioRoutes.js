
import express from "express";
import UsuarioController from "../controllers/usuarioController.js";
import autenticar from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", autenticar, UsuarioController.listar);
router.post("/", UsuarioController.cadastrar);
router.post("/login", UsuarioController.login);
router.get("/perfil", autenticar, UsuarioController.perfil);
router.put( "/:id/perfil", autenticar, UsuarioController.alterarPerfil);

router.post( "/admin/cadastrar",autenticar, UsuarioController.cadastrarAdmin );

export default router;
