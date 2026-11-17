
import conect from "../config/database.js";

async function listar() {
    const [dados] = await conect.query(`
        SELECT * FROM destinos_residuos
        ORDER BY nome ASC
    `);

    return dados;
}

async function cadastrar(nome, descricao) {
    const [dados] = await conect.execute(
        `INSERT INTO destinos_residuos (nome, descricao)
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
    const [existente] = await conect.execute(
        "SELECT id FROM destinos_residuos WHERE id = ?",
        [id]
    );

    if (existente.length === 0) {
        return false;
    }

    await conect.execute(
        `UPDATE destinos_residuos
         SET nome = ?, descricao = ?
         WHERE id = ?`,
        [nome, descricao, id]
    );

    return true;
}

async function excluir(id) {
    const [dados] = await conect.execute(
        `DELETE FROM destinos_residuos
         WHERE id = ?`,
        [id]
    );

    return dados.affectedRows > 0;
}

export default { listar, cadastrar, editar, excluir };
