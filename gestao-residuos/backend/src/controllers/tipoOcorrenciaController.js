
import TipoOcorrenciaModel from "../models/tipoOcorrenciaModel.js";

class TipoOcorrenciaController {

    static async listar(req, res) {
        try {
            const tipos = await TipoOcorrenciaModel.listar();

            return res.status(200).json(tipos);

        } catch (error) {
            console.error(error);

            return res.status(500).json({
                message: "Erro ao listar tipos de ocorrência."
            });
        }
    }

    static async cadastrar(req, res) {
        try {
            const { nome, descricao } = req.body;

            if (!nome || !nome.trim()) {
                return res.status(400).json({
                    message: "O nome do tipo é obrigatório."
                });
            }

            const tipo = await TipoOcorrenciaModel.cadastrar(
                nome.trim(),
                descricao?.trim() || null
            );

            return res.status(201).json({
                message: "Tipo de ocorrência cadastrado com sucesso!",
                tipo
            });

        } catch (error) {
            console.error(error);

            if (error.code === "ER_DUP_ENTRY") {
                return res.status(409).json({
                    message: "Este tipo de ocorrência já está cadastrado."
                });
            }

            return res.status(500).json({
                message: "Erro ao cadastrar tipo de ocorrência."
            });
        }
    }
}

export default TipoOcorrenciaController;
