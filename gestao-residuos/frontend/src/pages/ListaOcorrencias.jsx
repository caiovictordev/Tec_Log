import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./ListaOcorrencias.css";

function ListaOcorrencias() {
    const navigate = useNavigate();

    const [filtroSetor, setFiltroSetor] = useState("");
    const [filtroTipo, setFiltroTipo] = useState("");
    const [pesquisa, setPesquisa] = useState("");

    const [ocorrencias, setOcorrencias] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [mensagem, setMensagem] = useState("");

    useEffect(() => {
        async function carregarOcorrencias() {
            const token = localStorage.getItem("token");

            if (!token) {
                navigate("/");
                return;
            }

            try {
                const resposta = await api.get("/ocorrencias", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setOcorrencias(resposta.data);

            } catch (error) {
                console.error("Erro ao carregar ocorrências:", error);
                setMensagem("Não foi possível carregar as ocorrências.");
            }

            setCarregando(false);
        }

        carregarOcorrencias();
    }, [navigate]);
    const ocorrenciasFiltradas = ocorrencias.filter((item) => {
        const correspondeSetor =
            !filtroSetor || item.setor_nome === filtroSetor;

        const correspondeTipo =
            !filtroTipo || item.tipo === filtroTipo;

        const termo = pesquisa.toLowerCase();

        const correspondePesquisa =
            !termo ||
            item.material?.toLowerCase().includes(termo) ||
            item.maquina?.toLowerCase().includes(termo) ||
            item.usuario?.toLowerCase().includes(termo);

        return (
            correspondeSetor &&
            correspondeTipo &&
            correspondePesquisa
        );
    });

    return (
        <main className="lista-ocorrencias">
            <header className="lista-header">
                <div>
                    <h1>Ocorrências registradas</h1>
                    <p>Consulte e acompanhe os registros de resíduos industriais.</p>
                </div>

                <button onClick={() => navigate("/dashboard")}>
                    Voltar ao Dashboard
                </button>
            </header>
            <section className="filtros">
                <input
                    type="text"
                    placeholder="Pesquisar material, máquina ou operador..."
                    value={pesquisa}
                    onChange={(event) => setPesquisa(event.target.value)}
                />

                <select
                    value={filtroSetor}
                    onChange={(event) => setFiltroSetor(event.target.value)}
                >
                    <option value="">Todos os setores</option>

                    {[...new Set(ocorrencias.map((item) => item.setor_nome))]
                        .filter(Boolean)
                        .map((setor) => (
                            <option key={setor} value={setor}>
                                {setor}
                            </option>
                        ))}
                </select>

                <select
                    value={filtroTipo}
                    onChange={(event) => setFiltroTipo(event.target.value)}
                >
                    <option value="">Todos os tipos</option>
                    <option value="sucata">Sucata</option>
                    <option value="retrabalho">Retrabalho</option>
                    <option value="perda_materia_prima">Perda de matéria-prima</option>
                    <option value="embalagem">Embalagem</option>
                    <option value="outro">Outro</option>
                </select>

                <button
                    type="button"
                    onClick={() => {
                        setPesquisa("");
                        setFiltroSetor("");
                        setFiltroTipo("");
                    }}
                >
                    Limpar filtros
                </button>
            </section>
            {carregando ? (
                <p>Carregando ocorrências...</p>
            ) : mensagem ? (
                <p role="alert">{mensagem}</p>
            ) : ocorrencias.length === 0 ? (
                <p>Nenhuma ocorrência cadastrada.</p>
            ) : (
                <>
                    <p>
                        Exibindo {ocorrenciasFiltradas.length} de {ocorrencias.length} ocorrências.
                    </p>

                    <div className="tabela-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Data</th>
                                    <th>Setor</th>
                                    <th>Máquina</th>
                                    <th>Material</th>
                                    <th>Tipo</th>
                                    <th>Quantidade</th>
                                    <th>Operador</th>
                                </tr>
                            </thead>

                            <tbody>
                                {ocorrenciasFiltradas.map((item) => (
                                    <tr key={item.id}>
                                        <td>
                                            {new Date(item.data_ocorrencia).toLocaleString("pt-BR")}
                                        </td>
                                        <td>{item.setor}</td>
                                        <td>{item.maquina || "Não informado"}</td>
                                        <td>{item.material || "Não informado"}</td>
                                        <td>{item.tipo}</td>
                                        <td>
                                            {item.quantidade} {item.unidade_medida}
                                        </td>
                                        <td>{item.usuario_nome}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>

            )}
        </main>
    );
}

export default ListaOcorrencias;
