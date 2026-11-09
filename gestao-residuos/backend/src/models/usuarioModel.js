
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

    async function cadastrar(nome, email, senhaHash) {
        const [dados] = await conect.execute(
            `INSERT INTO usuarios (nome, email, senha, perfil)
             VALUES (?, ?, ?, ?)`,
            [nome, email, senhaHash, "operador"]
        );

        return {
            id: dados.insertId,
            nome,
            email,
            perfil: "operador"
        };
    }

export default { listar, buscarPorEmail, cadastrar };
