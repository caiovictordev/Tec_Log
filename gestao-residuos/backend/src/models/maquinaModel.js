import conect from "../config/database.js";

    async function listar() {
        const [dados] = await conect.query(`
            SELECT
                m.id,
                m.nome,
                m.setor_id,
                s.nome AS setor
            FROM maquinas m
            INNER JOIN setores s ON m.setor_id = s.id
            ORDER BY m.nome ASC
        `);

        return dados;
    }

    async function cadastrar(nome, setorId) {
        const [dados] = await conect.execute(
            `INSERT INTO maquinas (nome, setor_id)
             VALUES (?, ?)`,
            [nome, setorId]
        );

        return {
            id: dados.insertId,
            nome,
            setor_id: setorId
        };
    }

export default { listar, cadastrar };
