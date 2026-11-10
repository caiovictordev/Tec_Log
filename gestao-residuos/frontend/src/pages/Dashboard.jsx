
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    BarChart,
    Bar,
    CartesianGrid,
    XAxis,
    YAxis
} from "recharts";

import "./Dashboard.css";

function Dashboard() {
    const navigate = useNavigate();

    const [dados, setDados] = useState({
        ocorrencias: 0,
        setores: 0,
        maquinas: 0,
        materiais: 0
    });

    const [ocorrencias, setOcorrencias] = useState([]);
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        async function carregarDados() {
            const token = localStorage.getItem("token");

            if (!token) {
                navigate("/");
                return;
            }

            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                };

                const [
                    resOcorrencias,
                    resSetores,
                    resMaquinas,
                    resMateriais
                ] = await Promise.all([
                    api.get("/ocorrencias", config),
                    api.get("/setores"),
                    api.get("/maquinas"),
                    api.get("/materiais")
                ]);

                setOcorrencias(resOcorrencias.data);

                setDados({
                    ocorrencias: resOcorrencias.data.length,
                    setores: resSetores.data.length,
                    maquinas: resMaquinas.data.length,
                    materiais: resMateriais.data.length
                });

            } catch (error) {
                console.error("Erro ao carregar dashboard:", error);
            }

            setCarregando(false);
        }

        carregarDados();
    }, [navigate]);

    // Agrupar quantidades por unidade de medida
    const quantidadesPorUnidade = ocorrencias.reduce((acumulador, item) => {
    const unidade = item.unidade_medida || "Não informada";
    const quantidade = Number(item.quantidade) || 0;

    acumulador[unidade] = (acumulador[unidade] || 0) + quantidade;

    return acumulador;
    }, {});

    // Contar ocorrências por setor
    const ocorrenciasPorSetor = ocorrencias.reduce((acumulador, item) => {
        const setor = item.setor || "Não informado";

        acumulador[setor] = (acumulador[setor] || 0) + 1;

        return acumulador;
    }, {});

    const ocorrenciasPorTipo = ocorrencias.reduce((acumulador, item) => {
        const tipo = item.tipo || "outro";

        acumulador[tipo] = (acumulador[tipo] || 0) + 1;

        return acumulador;
    }, {});

    const dadosGraficoTipo = Object.entries(ocorrenciasPorTipo).map(
        ([tipo, quantidade]) => ({
            tipo,
            quantidade
        })
    );

    const coresGrafico = [
        "#7f77dd",
        "#16a34a",
        "#d97706",
        "#3b82f6",
        "#dc2626"
    ];

    // Encontrar o setor com mais ocorrências
    const setorMaiorOcorrencia = Object.entries(ocorrenciasPorSetor)
        .sort((a, b) => b[1] - a[1])[0];

    const indicadores = [
        { titulo: "Ocorrências", valor: dados.ocorrencias },
        { titulo: "Setores", valor: dados.setores },
        { titulo: "Máquinas", valor: dados.maquinas },
        { titulo: "Materiais", valor: dados.materiais }
    ];

    return (
        <main className="dashboard">
            <header className="dashboard-header">
                <h1>Dashboard</h1>
                <p>Visão geral da gestão de resíduos industriais.</p>
            </header>

            {carregando ? (
                <p>Carregando indicadores...</p>
            ) : (
                <>
                    <section className="dashboard-grid">
                        {indicadores.map((item) => (
                            <article className="dashboard-card" key={item.titulo}>
                                <h2>{item.titulo}</h2>
                                <strong>{item.valor}</strong>
                            </article>
                        ))}
                    </section>

                    <section className="dashboard-grid">
                        <article className="dashboard-card">
                            <h2>Quantidade de resíduos</h2>

                            {Object.entries(quantidadesPorUnidade).length === 0 ? (
                                <p>Nenhum registro disponível.</p>
                            ) : (
                                Object.entries(quantidadesPorUnidade).map(
                                    ([unidade, quantidade]) => (
                                        <p key={unidade}>
                                            <strong>
                                                {quantidade.toLocaleString("pt-BR", {
                                                    maximumFractionDigits: 2
                                                })} {unidade}
                                            </strong>
                                        </p>
                                    )
                                )
                            )}
                        </article>

                        <article className="dashboard-card">
                            <h2>Setor com mais ocorrências</h2>

                            {setorMaiorOcorrencia ? (
                                <>
                                    <strong>{setorMaiorOcorrencia[0]}</strong>
                                    <p>
                                        {setorMaiorOcorrencia[1]} ocorrência(s)
                                    </p>
                                </>
                            ) : (
                                <p>Nenhuma ocorrência registrada.</p>
                            )}
                        </article>
                    </section>
                    <section className="dashboard-grid">
                        <article className="dashboard-card">
                            <h2>Ocorrências por tipo</h2>

                            {dadosGraficoTipo.length === 0 ? (
                                <p>Nenhuma ocorrência disponível.</p>
                            ) : (
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={dadosGraficoTipo}
                                            dataKey="quantidade"
                                            nameKey="tipo"
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={65}
                                            outerRadius={100}
                                            paddingAngle={4}
                                        >
                                            {dadosGraficoTipo.map((item, index) => (
                                                <Cell
                                                    key={item.tipo}
                                                    fill={coresGrafico[index % coresGrafico.length]}
                                                />
                                            ))}
                                        </Pie>

                                        <Tooltip />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            )}
                        </article>
                    </section>

                    <section className="dashboard-grid">
                        <article className="dashboard-card">
                            <h2>Ocorrências por setor</h2>

                            {Object.keys(ocorrenciasPorSetor).length === 0 ? (
                                <p>Nenhuma ocorrência disponível.</p>
                            ) : (
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart
                                        data={Object.entries(ocorrenciasPorSetor).map(
                                            ([setor, quantidade]) => ({
                                                setor,
                                                quantidade
                                            })
                                        )}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="setor" />
                                        <YAxis allowDecimals={false} />
                                        <Tooltip />
                                        <Bar
                                            dataKey="quantidade"
                                            fill="#7f77dd"
                                            radius={[6, 6, 0, 0]}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </article>
                    </section>

                </>
                
            )}
        </main>
    );
}

export default Dashboard;
