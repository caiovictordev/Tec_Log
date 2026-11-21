import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Notificacao from "../components/Notificacao";
import api from "../services/api";

import "./Login.css";

function Login() {
    const navigate = useNavigate();

    const [aba, setAba] = useState("login");

    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");

    const [mensagem, setMensagem] = useState("");
    const [tipoMensagem, setTipoMensagem] = useState("sucesso");
    const [carregando, setCarregando] = useState(false);

    async function handleLogin(event) {
        event.preventDefault();

        setMensagem("");
        setCarregando(true);

        try {
            const resposta = await api.post("/usuarios/login", {
                email,
                senha
            });

            const { token, usuario } = resposta.data;

            localStorage.setItem("token", token);
            localStorage.setItem("usuario", JSON.stringify(usuario));

            navigate("/dashboard");

        } catch (error) {
            setTipoMensagem("erro");
            setMensagem(
                error.response?.data?.message ||
                "Não foi possível realizar o login."
            );
        }

        setCarregando(false);
    }

    async function handleCadastro(event) {
        event.preventDefault();

        setMensagem("");

        if (senha !== confirmarSenha) {
            setTipoMensagem("erro");
            setMensagem("As senhas não coincidem.");
            return;
        }

        setCarregando(true);

        try {
            const resposta = await api.post("/usuarios", {
                nome,
                email,
                senha
            });

            setMensagem(resposta.data.message);

            setNome("");
            setEmail("");
            setSenha("");
            setConfirmarSenha("");

        } catch (error) {
            setTipoMensagem("erro");
            setMensagem(
                error.response?.data?.message ||
                "Não foi possível cadastrar o usuário."
            );
        }

        setCarregando(false);
    }

    function trocarAba(novaAba) {
        setAba(novaAba);
        setMensagem("");
        setSenha("");
        setConfirmarSenha("");
    }

    return (
        <main className="auth-container">
            <section className="auth-card">

                <header className="auth-header">
                    <h1>Gestão de Resíduos Industriais</h1>
                    <p>
                        {aba === "login"
                            ? "Entre com suas credenciais para continuar."
                            : "Crie sua conta para acessar o sistema."}
                    </p>
                </header>

                <div className="auth-abas">
                    <button
                        type="button"
                        className={aba === "login" ? "ativa" : ""}
                        onClick={() => trocarAba("login")}
                    >
                        Entrar
                    </button>

                    <button
                        type="button"
                        className={aba === "cadastro" ? "ativa" : ""}
                        onClick={() => trocarAba("cadastro")}
                    >
                        Cadastrar
                    </button>
                </div>

                {aba === "login" ? (
                    <form onSubmit={handleLogin}>

                        <label htmlFor="email">E-mail</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            placeholder="seuemail@exemplo.com"
                            required
                        />

                        <label htmlFor="senha">Senha</label>
                        <input
                            id="senha"
                            type="password"
                            value={senha}
                            onChange={(event) => setSenha(event.target.value)}
                            placeholder="Digite sua senha"
                            required
                        />

                        <Notificacao
                            tipo={tipoMensagem}
                            mensagem={mensagem}
                            onFechar={() => setMensagem("")}
                        />

                        <button type="submit" disabled={carregando}>
                            {carregando ? "Entrando..." : "Entrar"}
                        </button>

                    </form>
                ) : (
                    <form onSubmit={handleCadastro}>

                        <label htmlFor="nome">Nome completo</label>
                        <input
                            id="nome"
                            type="text"
                            value={nome}
                            onChange={(event) => setNome(event.target.value)}
                            placeholder="Digite seu nome"
                            required
                        />

                        <label htmlFor="email">E-mail</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            placeholder="seuemail@exemplo.com"
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

                        <label htmlFor="confirmarSenha">
                            Confirmar senha
                        </label>
                        <input
                            id="confirmarSenha"
                            type="password"
                            value={confirmarSenha}
                            onChange={(event) =>
                                setConfirmarSenha(event.target.value)
                            }
                            placeholder="Digite a senha novamente"
                            required
                        />

                        <Notificacao
                            tipo={tipoMensagem}
                            mensagem={mensagem}
                            onFechar={() => setMensagem("")}
                        />

                        <button type="submit" disabled={carregando}>
                            {carregando ? "Cadastrando..." : "Criar conta"}
                        </button>

                    </form>
                )}

            </section>
        </main>
    );
}

export default Login;
