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

}

export default SetorController;
