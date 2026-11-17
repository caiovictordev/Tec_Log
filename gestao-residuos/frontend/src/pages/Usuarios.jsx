
import { useEffect, useState } from "react";
import api from "../services/api";

import "./Usuarios.css";

function Usuarios() {
    const [usuarios, setUsuarios] = useState([]);

    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [perfil, setPerfil] = useState("operador");

    const [mensagem, setMensagem] = useState("");
    const [carregando, setCarregando] = useState(false);

    const usuarioLogado = JSON.parse(
        localStorage.getItem("usuario") || "{}");


    async function alterarPerfil(id, novoPerfil) {
        try {
            const resposta = await api.put(
                `/usuarios/${id}/perfil`,
                {
                    perfil: novoPerfil
                }
            );

            setMensagem(resposta.data.message);

            const atualizacao = await api.get("/usuarios");
            setUsuarios(atualizacao.data);

        } catch (error) {
            setMensagem(
                error.response?.data?.message ||
                "Erro ao alterar perfil."
            );
        }
    }

    useEffect(() => {
        async function carregarUsuarios() {
            try {
                const resposta = await api.get("/usuarios");
                setUsuarios(resposta.data);
            } catch (error) {
                setMensagem(
                    error.response?.data?.message ||
                    "Erro ao carregar usuários."
                );
            }
        }

        carregarUsuarios();
    }, []);

    async function handleCadastro(event) {
        event.preventDefault();

        setMensagem("");
        setCarregando(true);

        try {
            const resposta = await api.post(
                "/usuarios/admin/cadastrar",
                {
                    nome,
                    email,
                    senha,
                    perfil
                }
            );

            setMensagem(resposta.data.message);

            setNome("");
            setEmail("");
            setSenha("");
            setPerfil("operador");

            const atualizacao = await api.get("/usuarios");
            setUsuarios(atualizacao.data);

        } catch (error) {
            setMensagem(
                error.response?.data?.message ||
                "Erro ao cadastrar membro."
            );
        }

        setCarregando(false);
    }

    return (
        <main className="usuarios-container">

            <header className="usuarios-header">
                <h1>Gerenciar usuários</h1>
                <p>
                    Cadastre membros e gerencie os acessos ao sistema.
                </p>
            </header>

            <section className="usuarios-conteudo">

                <h2>Novo membro</h2>

                <form onSubmit={handleCadastro}>

                    <label htmlFor="nome">Nome completo</label>
                    <input
                        id="nome"
                        type="text"
                        value={nome}
                        onChange={(event) => setNome(event.target.value)}
                        placeholder="Digite o nome do membro"
                        required
                    />

                    <label htmlFor="email">E-mail</label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="membro@exemplo.com"
                        required
                    />

                    <label htmlFor="senha">Senha</label>
                    <input
                        id="senha"
                        type="password"
                        value={senha}
                        onChange={(event) => setSenha(event.target.value)}
                        placeholder="Crie uma senha"
                        required
                    />

                    <label htmlFor="perfil">Perfil de acesso</label>
                    <select
                        id="perfil"
                        value={perfil}
                        onChange={(event) => setPerfil(event.target.value)}
                    >
                        <option value="operador">Operador</option>
                        <option value="admin">Administrador</option>
                    </select>

                    <button type="submit" disabled={carregando}>
                        {carregando ? "Cadastrando..." : "Cadastrar membro"}
                    </button>

                </form>

                {mensagem && <p role="alert">{mensagem}</p>}

            </section>

            <section className="usuarios-conteudo">

                <h2>Membros cadastrados</h2>

                <div className="lista-usuarios">

                    {usuarios.length === 0 ? (
                        <p>Nenhum usuário encontrado.</p>
                    ) : (
                        usuarios.map((usuario) => (
                            <article
                                className="usuario-item"
                                key={usuario.id}
                            >
                                <div>
                                    <h3>{usuario.nome}</h3>
                                    <p>{usuario.email}</p>
                                </div>
                                <select
                                    value={usuario.perfil}
                                    disabled={Number(usuario.id) === Number(usuarioLogado.id)}
                                    onChange={(event) =>
                                        alterarPerfil(usuario.id, event.target.value)
                                    }
                                >
                                    <option value="operador">Operador</option>
                                    <option value="admin">Administrador</option>
                                </select>
                            </article>
                        ))
                    )}

                </div>

            </section>

        </main>
    );
}

export default Usuarios;
