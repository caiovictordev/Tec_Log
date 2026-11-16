
import MaquinaModel from "../models/maquinaModel.js";

class MaquinaController {
    static async listar(req, res) {
        try {
            const maquinas = await MaquinaModel.listar();

            return res.status(200).json(maquinas);

        } catch (error) {
            console.error(error);

            return res.status(500).json({
                message: "Erro ao listar máquinas."
            });
        }
    }

    static async cadastrar(req, res) {
        try {
            const { nome, setor_id } = req.body;

            if (
                typeof nome !== "string" ||
                !nome.trim() ||
                !Number.isInteger(Number(setor_id)) ||
                Number(setor_id) <= 0
            ) {
                return res.status(400).json({
                    message: "Nome e setor válido são obrigatórios."
                });
            }

            const maquina = await MaquinaModel.cadastrar(
                nome.trim(),
                Number(setor_id)
            );

            return res.status(201).json({
                message: "Máquina cadastrada com sucesso!",
                maquina
            });

        } catch (error) {
            console.error(error);

            if (error.code === "ER_NO_REFERENCED_ROW_2") {
                return res.status(400).json({
                    message: "O setor informado não existe."
                });
            }

            return res.status(500).json({
                message: "Erro ao cadastrar máquina."
            });
        }
    }

    static async editar(req, res) {
        try {
            const { id } = req.params;
            const { nome, setor_id } = req.body;

            if (
                !Number.isInteger(Number(id)) ||
                Number(id) <= 0 ||
                typeof nome !== "string" ||
                !nome.trim() ||
                !Number.isInteger(Number(setor_id)) ||
                Number(setor_id) <= 0
            ) {
                return res.status(400).json({
                    message: "ID, nome e setor válido são obrigatórios."
                });
            }

            const atualizado = await MaquinaModel.editar(
                Number(id),
                nome.trim(),
                Number(setor_id)
            );

            if (!atualizado) {
                return res.status(404).json({
                    message: "Máquina não encontrada."
                });
            }

            return res.status(200).json({
                message: "Máquina atualizada com sucesso!"
            });

        } catch (error) {
            console.error(error);

            if (error.code === "ER_NO_REFERENCED_ROW_2") {
                return res.status(400).json({
                    message: "O setor informado não existe."
                });
            }

            return res.status(500).json({
                message: "Erro ao atualizar máquina."
            });
        }
    }

    static async excluir(req, res) {
        try {
            const { id } = req.params;

            if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
                return res.status(400).json({
                    message: "ID da máquina inválido."
                });
            }

            const excluida = await MaquinaModel.excluir(Number(id));

            if (!excluida) {
                return res.status(404).json({
                    message: "Máquina não encontrada."
                });
            }

            return res.status(200).json({
                message: "Máquina excluída com sucesso!"
            });

        } catch (error) {
            console.error(error);

            if (error.code === "ER_ROW_IS_REFERENCED_2") {
                return res.status(409).json({
                    message: "Esta máquina está associada a ocorrências e não pode ser excluída."
                });
            }

            return res.status(500).json({
                message: "Erro ao excluir máquina."
            });
        }
    }
}

export default MaquinaController;
