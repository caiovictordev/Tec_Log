
import DestinoResiduoModel from "../models/destinoResiduoModel.js";

class DestinoResiduoController {

    static async listar(req, res) {
        try {
            const destinos = await DestinoResiduoModel.listar();

            return res.status(200).json(destinos);

        } catch (error) {
            console.error(error);

            return res.status(500).json({
                message: "Erro ao listar destinos."
            });
        }
    }

    static async cadastrar(req, res) {
        try {
            const { nome, descricao } = req.body;

            if (!nome || !nome.trim()) {
                return res.status(400).json({
                    message: "O nome do destino é obrigatório."
                });
            }

            const destino = await DestinoResiduoModel.cadastrar(
                nome.trim(),
                descricao?.trim() || null
            );

            return res.status(201).json({
                message: "Destino cadastrado com sucesso!",
                destino
            });

        } catch (error) {
            console.error(error);

            if (error.code === "ER_DUP_ENTRY") {
                return res.status(409).json({
                    message: "Este destino já está cadastrado."
                });
            }

            return res.status(500).json({
                message: "Erro ao cadastrar destino."
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
                    message: "O nome do destino é obrigatório."
                });
            }

            const destino = await DestinoResiduoModel.editar(
                id,
                nome.trim(),
                descricao?.trim() || null
            );

            return res.status(200).json({
                message: "Destino atualizado com sucesso!",
                destino
            });

        } catch (error) {
            console.error(error);

            if (error.code === "ER_DUP_ENTRY") {
                return res.status(409).json({
                    message: "Este destino já está cadastrado."
                });
            }

            return res.status(500).json({
                message: "Erro ao editar destino."
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

            const excluido = await DestinoResiduoModel.excluir(id);

            if (!excluido) {
                return res.status(404).json({
                    message: "Destino não encontrado."
                });
            }

            return res.status(200).json({
                message: "Destino excluído com sucesso!"
            });

        } catch (error) {
            console.error(error);

            if (error.code === "ER_ROW_IS_REFERENCED_2") {
                return res.status(409).json({
                    message: "Este destino está sendo utilizado em ocorrências e não pode ser excluído."
                });
            }

            return res.status(500).json({
                message: "Erro ao excluir destino."
            });
        }
    }
}

export default DestinoResiduoController;
