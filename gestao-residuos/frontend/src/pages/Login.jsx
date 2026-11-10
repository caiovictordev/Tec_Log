
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [mensagem, setMensagem] = useState("");
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
            setMensagem(
                error.response?.data?.message ||
                "Não foi possível realizar o login."
            );
        }

        setCarregando(false);
    }

    return (
        <main>
            <h1>Gestão de Resíduos Industriais</h1>
            <p>Entre com suas credenciais para continuar.</p>

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

                {mensagem && <p role="alert">{mensagem}</p>}

                <button type="submit" disabled={carregando}>
                    {carregando ? "Entrando..." : "Entrar"}
                </button>
            </form>
        </main>
    );
}

export default Login;
