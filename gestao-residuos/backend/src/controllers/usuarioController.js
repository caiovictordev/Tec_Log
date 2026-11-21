
import bcrypt from "bcrypt";
import UsuarioModel from "../models/usuarioModel.js";
import jwt from "jsonwebtoken";

class UsuarioController {
    static async listar(req, res) {
        try {
            if (req.usuario.perfil !== "admin") {
                return res.status(403).json({
                    message: "Acesso permitido apenas para administradores."
                });
            }

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

            if (!nome || !email || !senha) {
                return res.status(400).json({
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

    static async cadastrarAdmin(req, res) {
        try {
            if (req.usuario.perfil !== "admin") {
                return res.status(403).json({
                    message: "Acesso permitido apenas para administradores."
                });
            }

            const { nome, email, senha, perfil } = req.body;

            if (!nome || !email || !senha || !perfil) {
                return res.status(400).json({
                    message: "Todos os campos são obrigatórios."
                });
            }

            if (!["admin", "operador"].includes(perfil)) {
                return res.status(400).json({
                    message: "Perfil inválido."
                });
            }

            const emailNormalizado = email.trim().toLowerCase();

            const usuarioExistente = await UsuarioModel.buscarPorEmail(
                emailNormalizado
            );

            if (usuarioExistente) {
                return res.status(409).json({
                    message: "Este e-mail já está cadastrado."
                });
            }

            const senhaHash = await bcrypt.hash(senha, 10);

            const usuario = await UsuarioModel.cadastrar(
                nome.trim(),
                emailNormalizado,
                senhaHash,
                perfil
            );

            return res.status(201).json({
                message: "Membro cadastrado com sucesso!",
                usuario
            });

        } catch (error) {
            console.error(error);

            return res.status(500).json({
                message: "Erro ao cadastrar membro."
            });
        }
    }

    static async alterarPerfil(req, res) {
        try {
            if (req.usuario.perfil !== "admin") {
                return res.status(403).json({
                    message: "Acesso permitido apenas para administradores."
                });
            }

            const { id } = req.params;
            const { perfil } = req.body;

            if (!["admin", "operador"].includes(perfil)) {
                return res.status(400).json({
                    message: "Perfil inválido."
                });
            }

            if (
                Number(id) === Number(req.usuario.id) &&
                perfil !== "admin"
            ) {
                return res.status(400).json({
                    message: "Você não pode remover seu próprio acesso administrativo."
                });
            }

            if (perfil !== "admin") {
                const totalAdmins = await UsuarioModel.contarAdmins();

                if (totalAdmins <= 1) {
                    return res.status(400).json({
                        message: "O sistema precisa ter pelo menos um administrador."
                    });
                }
            }

            // Só atualiza depois de todas as verificações
            const alterado = await UsuarioModel.alterarPerfil(id, perfil);

            if (!alterado) {
                return res.status(404).json({
                    message: "Usuário não encontrado."
                });
            }

            return res.status(200).json({
                message: "Perfil atualizado com sucesso!"
            });

        } catch (error) {
            console.error(error);

            return res.status(500).json({
                message: "Erro ao alterar perfil do usuário."
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

    static async excluir(req, res) {
        try {
            if (req.usuario.perfil !== "admin") {
                return res.status(403).json({
                    message: "Acesso permitido apenas para administradores."
                });
            }

            const { id } = req.params;

            if (Number(id) === Number(req.usuario.id)) {
                return res.status(400).json({
                    message: "Você não pode excluir sua própria conta."
                });
            }
            const usuario = await UsuarioModel.buscarPorId(id);

            if (!usuario) {
                return res.status(404).json({
                    message: "Usuário não encontrado."
                });
            }

            if (usuario.perfil === "admin") {
                const totalAdmins = await UsuarioModel.contarAdmins();

                if (totalAdmins <= 1) {
                    return res.status(400).json({
                        message: "Não é possível excluir o último administrador."
                    });
                }
            }

            const excluido = await UsuarioModel.excluir(id);

            if (!excluido) {
                return res.status(404).json({
                    message: "Usuário não encontrado."
                });
            }

            return res.status(200).json({
                message: "Usuário excluído com sucesso!"
            });

        } catch (error) {
            console.error(error);

            if (error.code === "ER_ROW_IS_REFERENCED_2") {
                return res.status(409).json({
                    message: "Não é possível excluir este usuário, pois ele possui ocorrências registradas no sistema."
                });
            }

            return res.status(500).json({
                message: "Erro ao excluir usuário."
            });
        }
    }
}

export default UsuarioController;
