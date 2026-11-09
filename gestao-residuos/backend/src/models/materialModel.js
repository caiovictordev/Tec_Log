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


export default { listar, cadastrar };