import conect from "../config/database.js";

    async function listar(){
        const [dados] = await conect.query(`
            SELECT * FROM setores ORDER BY nome ASC 
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


export default { listar, cadastrar }