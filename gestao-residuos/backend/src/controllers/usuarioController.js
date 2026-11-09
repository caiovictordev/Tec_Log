
import bcrypt from "bcrypt";
import UsuarioModel from "../models/usuarioModel.js";

class UsuarioController {
    static async listar(req, res) {
        try {
            const usuarios = await UsuarioModel.listar();

            return res.status(200).json(usuarios);

        } catch (error) {
            console.error(error);

            return res.status(500).json({
                message: "Erro ao listar usuários."
            });
        }
    }

    static async cadastrar(req, res) {
        try {
            const { nome, email, senha } = req.body;

            if(!nome || !email || !senha){
                return res.status(200).json({
                    message: "Todos os campos são obrigatórios"
                })
            }

            const usuarioExistente = await UsuarioModel.buscarPorEmail(
                email.trim().toLowerCase()
            );

            if (usuarioExistente) {
                return res.status(409).json({
                    message: "Este e-mail já está cadastrado."
                });
            }

            const senhaHash = await bcrypt.hash(senha, 10);

            const usuario = await UsuarioModel.cadastrar(
                nome.trim(),
                email.trim().toLowerCase(),
                senhaHash
            );

            return res.status(201).json({
                message: "Usuário cadastrado com sucesso!",
                usuario
            });

        } catch (error) {
            console.error(error);

            return res.status(500).json({
                message: "Erro ao cadastrar usuário."
            });
        }
    }
}

export default UsuarioController;
