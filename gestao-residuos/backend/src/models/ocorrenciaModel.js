import conect from "../config/database.js";

async function listar() {
    const [dados] = await conect.query(`
        SELECT
            o.id,
            o.data_ocorrencia,
            o.processo,
            o.tipo,
            o.quantidade,
            o.unidade_medida,
            o.custo_estimado,
            o.destino,
            o.observacao,
            u.nome AS usuario,
            s.nome AS setor,
            m.nome AS maquina,
            mat.nome AS material
        FROM ocorrencias o
        INNER JOIN usuarios u ON o.usuario_id = u.id
        INNER JOIN setores s ON o.setor_id = s.id
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
        tipo,
        quantidade,
        unidade_medida,
        custo_estimado,
        destino,
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
            tipo,
            quantidade,
            unidade_medida,
            custo_estimado,
            destino,
            observacao
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            usuario_id,
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
        ]
    );

    return {
        id: result.insertId,
        ...dados
    };
}

export default { listar, cadastrar };
