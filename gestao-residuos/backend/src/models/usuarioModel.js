
import conect from "../config/database.js";

async function listar() {
    const [dados] = await conect.query(`
            SELECT
                id,
                nome,
                email,
                perfil,
                criado_em
            FROM usuarios
            ORDER BY nome ASC
        `);

    return dados;
}

async function buscarPorEmail(email) {
    const [dados] = await conect.execute(
        "SELECT * FROM usuarios WHERE email = ?",
        [email]
    );

    return dados[0];
}

async function cadastrar(nome, email, senhaHash, perfil = "operador") {
    const [dados] = await conect.execute(
        `INSERT INTO usuarios (nome, email, senha, perfil)
         VALUES (?, ?, ?, ?)`,
        [nome, email, senhaHash, perfil]
    );

    return {
        id: dados.insertId,
        nome,
        email,
        perfil
    };
}

async function alterarPerfil(id, perfil) {
    const [dados] = await conect.execute(
        `UPDATE usuarios
         SET perfil = ?
         WHERE id = ?`,
        [perfil, id]
    );

    return dados.affectedRows > 0;
}

async function contarAdmins() {
    const [dados] = await conect.query(`
        SELECT COUNT(*) AS total
        FROM usuarios
        WHERE perfil = 'admin'
    `);

    return dados[0].total;
}
export default { listar, buscarPorEmail, cadastrar, alterarPerfil, contarAdmins };
