import MaterialModel from "../models/materialModel.js";

class MaterialController {
    static async listar(req, res) {
        try {
            const materiais = await MaterialModel.listar();

            return res.status(200).json(materiais);
        } catch (error) {
            console.error(error);

            return res.status(500).json({
                message: "Erro ao listar materiais."
            });
        }
    }

    static async cadastrar(req, res) {
        try {
            const { nome, unidade_medida, descricao } = req.body;

            if (
                typeof nome !== "string" ||
                !nome.trim() ||
                typeof unidade_medida !== "string" ||
                !unidade_medida.trim()
            ) {
                return res.status(400).json({
                    message: "Nome e unidade de medida são obrigatórios."
                });
            }

            if (nome.trim().length > 120 || unidade_medida.trim().length > 20) {
                return res.status(400).json({
                    message: "Nome ou unidade de medida muito longos."
                });
            }

            if (
                descricao !== undefined &&
                descricao !== null &&
                typeof descricao !== "string"
            ) {
                return res.status(400).json({
                    message: "A descrição deve ser um texto."
                });
            }

            const material = await MaterialModel.cadastrar(
                nome.trim(),
                unidade_medida.trim(),
                descricao?.trim() || null
            );

            return res.status(201).json({
                message: "Material cadastrado com sucesso!",
                material
            });

        } catch (error) {
            console.error(error);

            return res.status(500).json({
                message: "Erro ao cadastrar material."
            });
        }
    }
}

export default MaterialController;