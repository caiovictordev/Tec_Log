import conect from "../config/database.js";

async function listar() {
    const [dados] = await conect.query(
        "SELECT * FROM materiais ORDER BY nome ASC"
    );

    return dados;
}

async function cadastrar(nome, unidadeMedida, descricao) {
    const [dados] = await conect.execute(
        `INSERT INTO materiais (nome, unidade_medida, descricao)
         VALUES (?, ?, ?)`,
        [nome, unidadeMedida, descricao]
    );

    return {
        id: dados.insertId,
        nome,
        unidade_medida: unidadeMedida,
        descricao
    };
}

async function editar(id, nome, unidadeMedida, descricao) {
    const [dados] = await conect.execute(
        `UPDATE materiais
         SET nome = ?, unidade_medida = ?, descricao = ?
         WHERE id = ?`,
        [nome, unidadeMedida, descricao, id]
    );

    return dados.affectedRows > 0;
}

async function excluir(id) {
    const [dados] = await conect.execute(
        `DELETE FROM materiais WHERE id = ?`,
        [id]
    );

    return dados.affectedRows > 0;
}

export default {
    listar,
    cadastrar,
    editar,
    excluir
};
