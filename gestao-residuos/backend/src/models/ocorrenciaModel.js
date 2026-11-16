
import conect from "../config/database.js";

async function listar() {
    const [dados] = await conect.query(`
        SELECT
            o.id,
            o.data_ocorrencia,
            o.processo,
            o.tipo_id,
            t.nome AS tipo,
            o.quantidade,
            o.unidade_medida,
            o.custo_estimado,
            o.destino_id,
            d.nome AS destino,
            o.observacao,
            u.nome AS usuario,
            s.nome AS setor,
            m.nome AS maquina,
            mat.nome AS material
        FROM ocorrencias o
        INNER JOIN usuarios u ON o.usuario_id = u.id
        INNER JOIN setores s ON o.setor_id = s.id
        INNER JOIN tipos_ocorrencia t ON o.tipo_id = t.id
        INNER JOIN destinos_residuos d ON o.destino_id = d.id
        LEFT JOIN maquinas m ON o.maquina_id = m.id
        LEFT JOIN materiais mat ON o.material_id = mat.id
        ORDER BY o.data_ocorrencia DESC
    `);

    return dados;
}

async function cadastrar(dados) {
    const {
        usuario_id,
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
    } = dados;

    const [result] = await conect.execute(
        `INSERT INTO ocorrencias (
            usuario_id,
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
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            usuario_id,
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
        ]
    );

    return {
        id: result.insertId,
        ...dados
    };
}

async function buscarHistoricoSemelhante(dados) {
    const [historico] = await conect.execute(
        `SELECT quantidade
         FROM ocorrencias
         WHERE setor_id = ?
           AND material_id <=> ?
           AND unidade_medida = ?
         ORDER BY data_ocorrencia DESC`,
        [
            dados.setor_id,
            dados.material_id,
            dados.unidade_medida
        ]
    );

    return historico;
}

async function criarAlerta(dados) {
    const {
        ocorrencia_id,
        metodo,
        criterio,
        valor_observado,
        valor_referencia,
        descricao
    } = dados;

    const [result] = await conect.execute(
        `INSERT INTO alertas (
            ocorrencia_id,
            metodo,
            criterio,
            valor_observado,
            valor_referencia,
            descricao
        ) VALUES (?, ?, ?, ?, ?, ?)`,
        [
            ocorrencia_id,
            metodo,
            criterio,
            valor_observado,
            valor_referencia,
            descricao
        ]
    );

    return result.insertId;
}

async function listarAlertas() {
    const [alertas] = await conect.query(`
        SELECT
            a.id,
            a.ocorrencia_id,
            a.metodo,
            a.criterio,
            a.valor_observado,
            a.valor_referencia,
            a.descricao,
            a.status,
            a.criado_em,
            s.nome AS setor,
            mat.nome AS material
        FROM alertas a
        LEFT JOIN ocorrencias o ON a.ocorrencia_id = o.id
        LEFT JOIN setores s ON o.setor_id = s.id
        LEFT JOIN materiais mat ON o.material_id = mat.id
        ORDER BY a.criado_em DESC
    `);

    return alertas;
}

export default {
    listar,
    cadastrar,
    buscarHistoricoSemelhante,
    criarAlerta,
    listarAlertas
};
