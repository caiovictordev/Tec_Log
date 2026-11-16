
import express from "express";
import DestinoResiduoController from "../controllers/destinoResiduoController.js";
import autenticar from "../middlewares/authMiddleware.js";
import autorizarAdmin from "../middlewares/autorizarAdmin.js";

const router = express.Router();

// Listagem: qualquer usuário autenticado
router.get("/", autenticar, DestinoResiduoController.listar);

// Cadastro: somente administrador
router.post(
    "/",
    autenticar,
    autorizarAdmin,
    DestinoResiduoController.cadastrar
);

// Edição: somente administrador
router.put(
    "/:id",
    autenticar,
    autorizarAdmin,
    DestinoResiduoController.editar
);

// Exclusão: somente administrador
router.delete(
    "/:id",
    autenticar,
    autorizarAdmin,
    DestinoResiduoController.excluir
);

export default router;
