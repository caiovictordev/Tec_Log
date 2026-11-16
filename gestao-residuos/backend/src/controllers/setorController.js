
import SetorModel from "../models/setorModel.js";

class SetorController {

    static async listar(req, res) {
        try {
            const setores = await SetorModel.listar();

            return res.status(200).json(setores);

        } catch (error) {
            console.error(error);

            return res.status(500).json({
                message: "Erro ao listar setores."
            });
        }
    }

    static async cadastrar(req, res) {
        try {
            const { nome, descricao } = req.body;

            if (!nome || !nome.trim()) {
                return res.status(400).json({
                    message: "O nome do setor é obrigatório."
                });
            }

            const setor = await SetorModel.cadastrar(
                nome.trim(),
                descricao?.trim() || null
            );

            return res.status(201).json({
                message: "Setor cadastrado com sucesso!",
                setor
            });

        } catch (error) {
            console.error(error);

            if (error.code === "ER_DUP_ENTRY") {
                return res.status(409).json({
                    message: "Este setor já está cadastrado."
                });
            }

            return res.status(500).json({
                message: "Erro ao cadastrar setor."
            });
        }
    }

    static async editar(req, res) {
        try {
            const id = Number(req.params.id);
            const { nome, descricao } = req.body;

            if (!Number.isInteger(id) || id <= 0) {
                return res.status(400).json({
                    message: "ID inválido."
                });
            }

            if (!nome || !nome.trim()) {
                return res.status(400).json({
                    message: "O nome do setor é obrigatório."
                });
            }

            const setor = await SetorModel.editar(
                id,
                nome.trim(),
                descricao?.trim() || null
            );

            return res.status(200).json({
                message: "Setor atualizado com sucesso!",
                setor
            });

        } catch (error) {
            console.error(error);

            if (error.code === "ER_DUP_ENTRY") {
                return res.status(409).json({
                    message: "Este setor já está cadastrado."
                });
            }

            return res.status(500).json({
                message: "Erro ao editar setor."
            });
        }
    }

    static async excluir(req, res) {
        try {
            const id = Number(req.params.id);

            if (!Number.isInteger(id) || id <= 0) {
                return res.status(400).json({
                    message: "ID inválido."
                });
            }

            const excluido = await SetorModel.excluir(id);

            if (!excluido) {
                return res.status(404).json({
                    message: "Setor não encontrado."
                });
            }

            return res.status(200).json({
                message: "Setor excluído com sucesso!"
            });

        } catch (error) {
            console.error(error);

            if (error.code === "ER_ROW_IS_REFERENCED_2") {
                return res.status(409).json({
                    message: "Este setor está associado a máquinas ou ocorrências e não pode ser excluído."
                });
            }

            return res.status(500).json({
                message: "Erro ao excluir setor."
            });
        }
    }
}

export default SetorController;
