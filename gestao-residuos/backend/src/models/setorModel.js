import conect from "../config/database.js";

async function listar() {
    const [dados] = await conect.query(`
        SELECT * FROM setores
        ORDER BY nome ASC
    `);

    return dados;
}

async function cadastrar(nome, descricao) {
    const [dados] = await conect.execute(
        `INSERT INTO setores (nome, descricao)
         VALUES (?, ?)`,
        [nome, descricao]
    );

    return {
        id: dados.insertId,
        nome,
        descricao
    };
}

async function editar(id, nome, descricao) {
    await conect.execute(
        `UPDATE setores
         SET nome = ?, descricao = ?
         WHERE id = ?`,
        [nome, descricao, id]
    );

    return {
        id,
        nome,
        descricao
    };
}

async function excluir(id) {
    const [dados] = await conect.execute(
        `DELETE FROM setores
         WHERE id = ?`,
        [id]
    );

    return dados.affectedRows > 0;
}

export default { listar, cadastrar, editar, excluir };
