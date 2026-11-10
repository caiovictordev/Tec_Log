
import bcrypt from "bcrypt";
import UsuarioModel from "../models/usuarioModel.js";
import jwt from "jsonwebtoken";

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

    static async login(req, res) {
        try {
            const { email, senha } = req.body;

            if (
                typeof email !== "string" ||
                !email.trim() ||
                typeof senha !== "string" ||
                !senha
            ) {
                return res.status(400).json({
                    message: "E-mail e senha são obrigatórios."
                });
            }

            const usuario = await UsuarioModel.buscarPorEmail(
                email.trim().toLowerCase()
            );

            if (!usuario) {
                return res.status(401).json({
                    message: "E-mail ou senha inválidos."
                });
            }

            const senhaValida = await bcrypt.compare(
                senha,
                usuario.senha
            );

            if (!senhaValida) {
                return res.status(401).json({
                    message: "E-mail ou senha inválidos."
                });
            }

            if (!process.env.JWT_SECRET) {
                throw new Error("JWT_SECRET não configurado.");
            }

            const token = jwt.sign(
                {
                    id: usuario.id,
                    perfil: usuario.perfil
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: "2h"
                }
            );

            return res.status(200).json({
                message: "Login realizado com sucesso!",
                token,
                usuario: {
                    id: usuario.id,
                    nome: usuario.nome,
                    email: usuario.email,
                    perfil: usuario.perfil
                }
            });

        } catch (error) {
            console.error(error);

            return res.status(500).json({
                message: "Erro ao realizar login."
            });
        }
    }
    static async perfil(req, res) {
        return res.status(200).json({
            message: "Usuário autenticado!",
            usuario: req.usuario
        });
    }

}

export default UsuarioController;
