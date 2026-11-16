
import OcorrenciaModel from "../models/ocorrenciaModel.js";

function analisarQuantidade(historico, quantidadeAtual) {
    const quantidades = historico.map(
        item => Number(item.quantidade)
    );

    if (quantidades.length < 5) {
        return null;
    }

    const media =
        quantidades.reduce((total, valor) => total + valor, 0) /
        quantidades.length;

    const variancia =
        quantidades.reduce(
            (total, valor) => total + Math.pow(valor - media, 2),
            0
        ) / quantidades.length;

    const desvioPadrao = Math.sqrt(variancia);
    const limite = media + (2 * desvioPadrao);

    if (quantidadeAtual > limite) {
        return {
            media,
            limite,
            desvioPadrao
        };
    }

    return null;
}

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
                tipo_id,
                quantidade,
                unidade_medida,
                custo_estimado,
                destino_id,
                observacao
            } = req.body;

            const destinoFinal = destino_id ?? 4;

            // Validar campos obrigatórios
            if (
                !Number.isInteger(Number(setor_id)) ||
                Number(setor_id) <= 0 ||

                !Number.isInteger(Number(tipo_id)) ||
                Number(tipo_id) <= 0 ||

                !Number.isInteger(Number(destinoFinal)) ||
                Number(destinoFinal) <= 0 ||

                typeof data_ocorrencia !== "string" ||
                !data_ocorrencia ||

                typeof processo !== "string" ||
                !processo.trim() ||

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

            // Preparar dados da ocorrência
            const dados = {
                usuario_id: req.usuario.id,
                setor_id: Number(setor_id),
                maquina_id: maquina_id ? Number(maquina_id) : null,
                material_id: material_id ? Number(material_id) : null,
                data_ocorrencia,
                processo: processo.trim(),
                tipo_id: Number(tipo_id),
                quantidade: Number(quantidade),
                unidade_medida: unidade_medida.trim(),
                custo_estimado: custo_estimado ?? null,
                destino_id: Number(destinoFinal),
                observacao: observacao?.trim() || null
            };

            // Consultar histórico
            const historico =
                await OcorrenciaModel.buscarHistoricoSemelhante(dados);

            // Analisar quantidade
            const analise = analisarQuantidade(
                historico,
                dados.quantidade
            );

            // Cadastrar ocorrência
            const ocorrencia = await OcorrenciaModel.cadastrar(dados);

            // Criar alerta se houver possível anomalia
            if (analise) {
                try {
                    await OcorrenciaModel.criarAlerta({
                        ocorrencia_id: ocorrencia.id,
                        metodo: "estatistico",
                        criterio: "quantidade_acima_media_2_desvios",
                        valor_observado: dados.quantidade,
                        valor_referencia: analise.limite,
                        descricao:
                            `Quantidade acima do padrão histórico. ` +
                            `Média: ${analise.media.toFixed(2)}. ` +
                            `Limite esperado: ${analise.limite.toFixed(2)}.`
                    });

                } catch (erroAlerta) {
                    console.error("Erro ao criar alerta:", erroAlerta);
                }
            }

            return res.status(201).json({
                message: "Ocorrência registrada com sucesso!",
                ocorrencia
            });

        } catch (error) {
            console.error(error);

            if (error.code === "ER_NO_REFERENCED_ROW_2") {
                return res.status(400).json({
                    message: "Um dos cadastros informados não existe."
                });
            }

            return res.status(500).json({
                message: "Erro ao registrar ocorrência."
            });
        }
    }

    static async listarAlertas(req, res) {
        try {
            const alertas = await OcorrenciaModel.listarAlertas();

            return res.status(200).json(alertas);

        } catch (error) {
            console.error(error);

            return res.status(500).json({
                message: "Erro ao listar alertas."
            });
        }
    }
}

export default OcorrenciaController;
