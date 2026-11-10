import OcorrenciaModel from "../models/ocorrenciaModel.js";

class OcorrenciaController {
    static async listar(req, res) {
        try {
            const ocorrencias = await OcorrenciaModel.listar();

            return res.status(200).json(ocorrencias);

        } catch (error) {
            console.error(error);

            return res.status(500).json({
                message: "Erro ao listar ocorrências."
            });
        }
    }

    static async cadastrar(req, res) {
        try {
            const {
                setor_id,
                maquina_id,
                material_id,
                data_ocorrencia,
                processo,
                tipo,
                quantidade,
                unidade_medida,
                custo_estimado,
                destino,
                observacao
            } = req.body;

            // Validação dos campos obrigatórios
            if (
                !Number.isInteger(Number(setor_id)) ||
                Number(setor_id) <= 0 ||
                typeof data_ocorrencia !== "string" ||
                !data_ocorrencia ||
                typeof processo !== "string" ||
                !processo.trim() ||
                typeof tipo !== "string" ||
                typeof unidade_medida !== "string" ||
                !unidade_medida.trim() ||
                quantidade === undefined ||
                quantidade === null ||
                !Number.isFinite(Number(quantidade)) ||
                Number(quantidade) <= 0
            ) {
                return res.status(400).json({
                    message: "Preencha corretamente os campos obrigatórios."
                });
            }

            const tiposPermitidos = [
                "sucata",
                "retrabalho",
                "perda_materia_prima",
                "embalagem",
                "outro"
            ];

            if (!tiposPermitidos.includes(tipo)) {
                return res.status(400).json({
                    message: "Tipo de ocorrência inválido."
                });
            }

            const destinosPermitidos = [
                "reutilizacao",
                "reciclagem",
                "descarte",
                "nao_informado"
            ];

            const destinoFinal = destino || "nao_informado";

            if (!destinosPermitidos.includes(destinoFinal)) {
                return res.status(400).json({
                    message: "Destino inválido."
                });
            }

            if (
                custo_estimado !== undefined &&
                custo_estimado !== null &&
                (
                    !Number.isFinite(Number(custo_estimado)) ||
                    Number(custo_estimado) < 0
                )
            ) {
                return res.status(400).json({
                    message: "Custo estimado inválido."
                });
            }

            // O usuário vem do token JWT
            const dados = {
                usuario_id: req.usuario.id,
                setor_id: Number(setor_id),
                maquina_id: maquina_id ? Number(maquina_id) : null,
                material_id: material_id ? Number(material_id) : null,
                data_ocorrencia,
                processo: processo.trim(),
                tipo,
                quantidade: Number(quantidade),
                unidade_medida: unidade_medida.trim(),
                custo_estimado: custo_estimado ?? null,
                destino: destinoFinal,
                observacao: observacao?.trim() || null
            };

            const ocorrencia = await OcorrenciaModel.cadastrar(dados);

            return res.status(201).json({
                message: "Ocorrência registrada com sucesso!",
                ocorrencia
            });

        } catch (error) {
            console.error(error);

            if (error.code === "ER_NO_REFERENCED_ROW_2") {
                return res.status(400).json({
                    message: "Usuário, setor, máquina ou material informado não existe."
                });
            }

            return res.status(500).json({
                message: "Erro ao registrar ocorrência."
            });
        }
    }
}

export default OcorrenciaController;
