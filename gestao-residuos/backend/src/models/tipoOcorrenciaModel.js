
import conect from "../config/database.js";

async function listar() {
    const [dados] = await conect.query(`
        SELECT * FROM tipos_ocorrencia
        ORDER BY nome ASC
    `);

    return dados;
}

async function cadastrar(nome, descricao) {
    const [dados] = await conect.execute(
        `INSERT INTO tipos_ocorrencia (nome, descricao)
         VALUES (?, ?)`,
        [nome, descricao]
    );

    return {
        id: dados.insertId,
        nome,
        descricao
    };
}

export default { listar, cadastrar };
