import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Ocorrencia() {
    const navigate = useNavigate();

    const [enviando, setEnviando] = useState(false);
    const [mensagem, setMensagem] = useState("");

    const [setores, setSetores] = useState([]);
    const [maquinas, setMaquinas] = useState([]);
    const [materiais, setMateriais] = useState([]);

    const [carregando, setCarregando] = useState(true);

    const [formulario, setFormulario] = useState({
        setor_id: "",
        maquina_id: "",
        material_id: "",
        data_ocorrencia: "",
        processo: "",
        tipo: "sucata",
        quantidade: "",
        unidade_medida: "kg",
        custo_estimado: "",
        destino: "nao_informado",
        observacao: ""
    });
    async function handleSubmit(event) {
        event.preventDefault();

        setMensagem("");
        setEnviando(true);

        const token = localStorage.getItem("token");

        const dados = {
            ...formulario,
            setor_id: Number(formulario.setor_id),
            maquina_id: formulario.maquina_id
                ? Number(formulario.maquina_id)
                : null,
            material_id: formulario.material_id
                ? Number(formulario.material_id)
                : null,
            data_ocorrencia: formulario.data_ocorrencia.replace("T", " ") + ":00",
            quantidade: Number(formulario.quantidade),
            custo_estimado: formulario.custo_estimado
                ? Number(formulario.custo_estimado)
                : null
        };

        try {
            await api.post("/ocorrencias", dados, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setMensagem("Ocorrência registrada com sucesso!");

            setFormulario({
                setor_id: "",
                maquina_id: "",
                material_id: "",
                data_ocorrencia: "",
                processo: "",
                tipo: "sucata",
                quantidade: "",
                unidade_medida: "kg",
                custo_estimado: "",
                destino: "nao_informado",
                observacao: ""
            });

        } catch (error) {
            setMensagem(
                error.response?.data?.message ||
                "Não foi possível registrar a ocorrência."
            );
        }

    setEnviando(false);
}

    function handleChange(event) {
        const { name, value } = event.target;

        setFormulario({
            ...formulario,
            [name]: value
        });
    }

    useEffect(() => {
        async function carregarDados() {
            try {
                const [resSetores, resMaquinas, resMateriais] =
                    await Promise.all([
                        api.get("/setores"),
                        api.get("/maquinas"),
                        api.get("/materiais")
                    ]);

                setSetores(resSetores.data);
                setMaquinas(resMaquinas.data);
                setMateriais(resMateriais.data);

            } catch (error) {
                console.error("Erro ao carregar dados:", error);
            }

            setCarregando(false);
        }

        carregarDados();
    }, []);

    return (
        <main className="ocorrencia">
            <header>
                <h1>Registrar ocorrência</h1>
                <p>Preencha as informações da ocorrência de resíduo.</p>
            </header>

            <form onSubmit={handleSubmit}>
                <label>Setor</label>
                <select name="setor_id" value={formulario.setor_id} onChange={handleChange}>
                    <option value="">Selecione um setor</option>
                    {setores.map((setor) => (
                        <option key={setor.id} value={setor.id}>
                            {setor.nome}
                        </option>
                    ))}
                </select>

                <label>Máquina</label>
                <select name="maquina_id" value={formulario.maquina_id} onChange={handleChange}>
                    <option value="">Selecione uma máquina (opcional)</option>
                    {maquinas.map((maquina) => (
                        <option key={maquina.id} value={maquina.id}>
                            {maquina.nome}
                        </option>
                    ))}
                </select>

                <label>Material</label>
                <select name="material_id" value={formulario.material_id} onChange={handleChange}>
                    <option value="">Selecione um material (opcional)</option>
                    {materiais.map((material) => (
                        <option key={material.id} value={material.id}>
                            {material.nome}
                        </option>
                    ))}
                </select>

                <label>Data e horário</label>
                <input
                    type="datetime-local"
                    name="data_ocorrencia"
                    value={formulario.data_ocorrencia}
                    onChange={handleChange}
                    required
                />

                <label>Processo</label>
                <input
                    type="text"
                    name="processo"
                    value={formulario.processo}
                    onChange={handleChange}
                    placeholder="Ex: Produção de peças"
                    required
                />

                <label>Tipo de ocorrência</label>
                <select
                    name="tipo"
                    value={formulario.tipo}
                    onChange={handleChange}
                    required
                >
                    <option value="sucata">Sucata</option>
                    <option value="retrabalho">Retrabalho</option>
                    <option value="perda_materia_prima">Perda de matéria-prima</option>
                    <option value="embalagem">Embalagem</option>
                    <option value="outro">Outro</option>
                </select>

                <label>Quantidade</label>
                <input
                    type="number"
                    name="quantidade"
                    value={formulario.quantidade}
                    onChange={handleChange}
                    placeholder="Ex: 25"
                    min="0.01"
                    step="0.01"
                    required
                />

                <label>Unidade de medida</label>
                <select
                    name="unidade_medida"
                    value={formulario.unidade_medida}
                    onChange={handleChange}
                >
                    <option value="kg">Quilograma (kg)</option>
                    <option value="g">Grama (g)</option>
                    <option value="un">Unidade (un)</option>
                    <option value="L">Litro (L)</option>
                    <option value="m">Metro (m)</option>
                </select>
                <label>Custo estimado (opcional)</label>
                <input
                    type="number"
                    name="custo_estimado"
                    value={formulario.custo_estimado}
                    onChange={handleChange}
                    placeholder="Ex: 150.50"
                    min="0"
                    step="0.01"
                />

                <label>Destino do resíduo</label>
                <select
                    name="destino"
                    value={formulario.destino}
                    onChange={handleChange}
                >
                    <option value="nao_informado">Não informado</option>
                    <option value="reutilizacao">Reutilização</option>
                    <option value="reciclagem">Reciclagem</option>
                    <option value="descarte">Descarte</option>
                </select>

                <label>Observações (opcional)</label>
                <textarea
                    name="observacao"
                    value={formulario.observacao}
                    onChange={handleChange}
                    placeholder="Descreva detalhes adicionais sobre a ocorrência..."
                    rows="4"
                />
                {mensagem && <p role="status">{mensagem}</p>}
                <button type="submit" disabled={enviando}>
                    {enviando ? "Registrando..." : "Registrar ocorrência"}
                </button>
            </form>
        </main>
    );
}

export default Ocorrencia;