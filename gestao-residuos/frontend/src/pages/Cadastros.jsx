
import { useEffect, useState } from "react";
import api from "../services/api";
import "./Cadastros.css";

function Cadastros() {
    const [abaAtiva, setAbaAtiva] = useState("setores");

    const [setores, setSetores] = useState([]);
    const [nome, setNome] = useState("");
    const [descricao, setDescricao] = useState("");
    const [mensagem, setMensagem] = useState("");
    const [carregando, setCarregando] = useState(false);
    const [setorEditando, setSetorEditando] = useState(null);

    const [maquinas, setMaquinas] = useState([]);
    const [maquinaNome, setMaquinaNome] = useState("");
    const [maquinaSetorId, setMaquinaSetorId] = useState("");
    const [maquinaEditando, setMaquinaEditando] = useState(null);

    const [materiais, setMateriais] = useState([]);
    const [materialNome, setMaterialNome] = useState("");
    const [materialUnidade, setMaterialUnidade] = useState("");
    const [materialDescricao, setMaterialDescricao] = useState("");
    const [materialEditando, setMaterialEditando] = useState(null);

    const [tipos, setTipos] = useState([]);
    const [tipoNome, setTipoNome] = useState("");
    const [tipoDescricao, setTipoDescricao] = useState("");
    const [tipoEditando, setTipoEditando] = useState(null);

    const [destinos, setDestinos] = useState([]);
    const [destinoNome, setDestinoNome] = useState("");
    const [destinoDescricao, setDestinoDescricao] = useState("");
    const [destinoEditando, setDestinoEditando] = useState(null);

    const abas = [
        { id: "setores", nome: "Setores" },
        { id: "maquinas", nome: "Máquinas" },
        { id: "materiais", nome: "Materiais" },
        { id: "tipos", nome: "Tipos de ocorrência" },
        { id: "destinos", nome: "Destinos de resíduos" }
    ];

    async function listarSetores() {
        try {
            const resposta = await api.get("/setores");
            setSetores(resposta.data);
        } catch (error) {
            console.error(error);
            setMensagem("Erro ao carregar setores.");
        }
    }
    async function listarMaquinas() {
        try {
            const resposta = await api.get("/maquinas");
            setMaquinas(resposta.data);
        } catch (error) {
            console.error(error);
            setMensagem("Erro ao carregar máquinas.");
        }
    }

    async function listarMateriais() {
        try {
            const resposta = await api.get("/materiais");
            setMateriais(resposta.data);
        } catch (error) {
            console.error(error);
            setMensagem("Erro ao carregar materiais.");
        }
    }

    async function listarTipos() {
        try {
            const resposta = await api.get("/tipos-ocorrencia");
            setTipos(resposta.data);
        } catch (error) {
            console.error(error);
            setMensagem("Erro ao carregar tipos de ocorrência.");
        }
    }

    async function listarDestinos() {
        try {
            const resposta = await api.get("/destinos-residuos");
            setDestinos(resposta.data);
        } catch (error) {
            console.error(error);
            setMensagem("Erro ao carregar destinos.");
        }
    }

    async function salvarDestino(e) {
        e.preventDefault();

        try {
            const dados = {
                nome: destinoNome,
                descricao: destinoDescricao
            };

            if (destinoEditando) {
                await api.put(`/destinos-residuos/${destinoEditando}`, dados);
                setMensagem("Destino atualizado com sucesso!");
            } else {
                await api.post("/destinos-residuos", dados);
                setMensagem("Destino cadastrado com sucesso!");
            }

            setDestinoNome("");
            setDestinoDescricao("");
            setDestinoEditando(null);

            listarDestinos();
        } catch (error) {
            setMensagem(
                error.response?.data?.message || "Erro ao salvar destino."
            );
        }
    }

    function editarDestino(destino) {
        setDestinoEditando(destino.id);
        setDestinoNome(destino.nome);
        setDestinoDescricao(destino.descricao || "");
        setMensagem("");
    }

    async function excluirDestino(id) {
        const confirmar = window.confirm(
            "Tem certeza que deseja excluir este destino?"
        );

        if (!confirmar) return;

        try {
            await api.delete(`/destinos-residuos/${id}`);

            setMensagem("Destino excluído com sucesso!");

            listarDestinos();
        } catch (error) {
            setMensagem(
                error.response?.data?.message || "Erro ao excluir destino."
            );
        }
    }

    async function salvarTipo(e) {
        e.preventDefault();

        try {
            const dados = {
                nome: tipoNome,
                descricao: tipoDescricao
            };

            if (tipoEditando) {
                await api.put(`/tipos-ocorrencia/${tipoEditando}`, dados);
                setMensagem("Tipo de ocorrência atualizado com sucesso!");
            } else {
                await api.post("/tipos-ocorrencia", dados);
                setMensagem("Tipo de ocorrência cadastrado com sucesso!");
            }

            setTipoNome("");
            setTipoDescricao("");
            setTipoEditando(null);

            listarTipos();
        } catch (error) {
            setMensagem(
                error.response?.data?.message || "Erro ao salvar tipo de ocorrência."
            );
        }
    }

    function editarTipo(tipo) {
        setTipoEditando(tipo.id);
        setTipoNome(tipo.nome);
        setTipoDescricao(tipo.descricao || "");
        setMensagem("");
    }

    async function excluirTipo(id) {
        const confirmar = window.confirm(
            "Tem certeza que deseja excluir este tipo de ocorrência?"
        );

        if (!confirmar) return;

        try {
            await api.delete(`/tipos-ocorrencia/${id}`);

            setMensagem("Tipo de ocorrência excluído com sucesso!");

            listarTipos();
        } catch (error) {
            setMensagem(
                error.response?.data?.message ||
                "Erro ao excluir tipo de ocorrência."
            );
        }
    }

    async function salvarMaterial(e) {
        e.preventDefault();

        try {
            const dados = {
                nome: materialNome,
                unidade_medida: materialUnidade,
                descricao: materialDescricao
            };

            if (materialEditando) {
                await api.put(`/materiais/${materialEditando}`, dados);
                setMensagem("Material atualizado com sucesso!");
            } else {
                await api.post("/materiais", dados);
                setMensagem("Material cadastrado com sucesso!");
            }

            setMaterialNome("");
            setMaterialUnidade("");
            setMaterialDescricao("");
            setMaterialEditando(null);

            listarMateriais();
        } catch (error) {
            setMensagem(
                error.response?.data?.message || "Erro ao salvar material."
            );
        }
    }

    function editarMaterial(material) {
        setMaterialEditando(material.id);
        setMaterialNome(material.nome);
        setMaterialUnidade(material.unidade_medida);
        setMaterialDescricao(material.descricao || "");
        setMensagem("");
    }

    async function excluirMaterial(id) {
        const confirmar = window.confirm(
            "Tem certeza que deseja excluir este material?"
        );

        if (!confirmar) return;

        try {
            await api.delete(`/materiais/${id}`);

            setMensagem("Material excluído com sucesso!");

            listarMateriais();
        } catch (error) {
            setMensagem(
                error.response?.data?.message || "Erro ao excluir material."
            );
        }
    }

    async function salvarMaquina(e) {
        e.preventDefault();

        try {
            const dados = {
                nome: maquinaNome,
                setor_id: Number(maquinaSetorId)
            };

            if (maquinaEditando) {
                await api.put(`/maquinas/${maquinaEditando}`, dados);
                setMensagem("Máquina atualizada com sucesso!");
            } else {
                await api.post("/maquinas", dados);
                setMensagem("Máquina cadastrada com sucesso!");
            }

            setMaquinaNome("");
            setMaquinaSetorId("");
            setMaquinaEditando(null);

            listarMaquinas();
        } catch (error) {
            setMensagem(
                error.response?.data?.message || "Erro ao salvar máquina."
            );
        }
    }

    function editarMaquina(maquina) {
        setMaquinaEditando(maquina.id);
        setMaquinaNome(maquina.nome);
        setMaquinaSetorId(String(maquina.setor_id));
        setMensagem("");
    }

    async function excluirMaquina(id) {
        const confirmar = window.confirm(
            "Tem certeza que deseja excluir esta máquina?"
        );

        if (!confirmar) return;

        try {
            await api.delete(`/maquinas/${id}`);

            setMensagem("Máquina excluída com sucesso!");

            listarMaquinas();
        } catch (error) {
            setMensagem(
                error.response?.data?.message || "Erro ao excluir máquina."
            );
        }
    }

    async function salvarSetor(e) {
        e.preventDefault();

        try {
            if (setorEditando) {
                await api.put(`/setores/${setorEditando}`, {
                    nome,
                    descricao
                });

                setMensagem("Setor atualizado com sucesso!");
            } else {
                await api.post("/setores", {
                    nome,
                    descricao
                });

                setMensagem("Setor cadastrado com sucesso!");
            }

            setNome("");
            setDescricao("");
            setSetorEditando(null);

            listarSetores();


        } catch (error) {
            setMensagem(
                error.response?.data?.message || "Erro ao salvar setor."
            );
        }
    }

    async function excluirSetor(id) {
        const confirmar = window.confirm(
            "Tem certeza que deseja excluir este setor?"
        );

        if (!confirmar) return;

        try {
            await api.delete(`/setores/${id}`);

            setMensagem("Setor excluído com sucesso!");

            listarSetores();

        } catch (error) {
            setMensagem(
                error.response?.data?.message || "Erro ao excluir setor."
            );
        }
    }

    function editarSetor(setor) {
        setSetorEditando(setor.id);
        setNome(setor.nome);
        setDescricao(setor.descricao || "");
        setMensagem("");
    }

    useEffect(() => {
        if (abaAtiva === "maquinas") {
            listarMaquinas();
            listarSetores();
        }

        if (abaAtiva === "materiais") {
            listarMateriais();
        }

        if (abaAtiva === "tipos") {
            listarTipos();
        }

        if (abaAtiva === "destinos") {
            listarDestinos();
        }
    }, [abaAtiva]);

    return (
        <main className="cadastros-container">
            <header className="cadastros-header">
                <div>
                    <h1>Gerenciar Cadastros</h1>
                    <p>
                        Gerencie os dados utilizados no sistema de gestão de resíduos.
                    </p>
                </div>
            </header>

            <nav className="cadastros-abas">
                {abas.map((aba) => (
                    <button
                        key={aba.id}
                        className={abaAtiva === aba.id ? "aba ativa" : "aba"}
                        onClick={() => setAbaAtiva(aba.id)}
                    >
                        {aba.nome}
                    </button>
                ))}
            </nav>

            <section className="cadastros-conteudo">
                {abaAtiva === "setores" && (
                    <>
                        <h2>Gerenciar Setores</h2>

                        <form onSubmit={salvarSetor}>
                            <label>Nome do setor</label>
                            <input
                                type="text"
                                value={nome}
                                onChange={(event) => setNome(event.target.value)}
                                placeholder="Ex: Produção"
                                required
                            />

                            <label>Descrição</label>
                            <textarea
                                value={descricao}
                                onChange={(event) => setDescricao(event.target.value)}
                                placeholder="Descreva o setor"
                            />

                            <button type="submit">
                                {setorEditando ? "Salvar alterações" : "Cadastrar setor"}
                            </button>

                        </form>

                        {mensagem && <p>{mensagem}</p>}

                        <h3>Setores cadastrados</h3>

                        <div className="lista-setores">
                            {setores.map((setor) => (
                                <div className="setor-item" key={setor.id}>
                                    <div>
                                        <h3>{setor.nome}</h3>
                                        <p>{setor.descricao || "Sem descrição"}</p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => editarSetor(setor)}
                                    >
                                        Editar
                                    </button>

                                    <button
                                        type="button"
                                        className="btn-excluir"
                                        onClick={() => excluirSetor(setor.id)}
                                    >
                                        Excluir
                                    </button>
                                </div>
                            ))}

                            {setores.length === 0 && (
                                <p>Nenhum setor cadastrado.</p>
                            )}
                        </div>
                    </>
                )}

                {abaAtiva === "maquinas" && (
                    <>
                        <h2>Gerenciar Máquinas</h2>

                        <form onSubmit={salvarMaquina}>
                            <label>Nome da máquina</label>
                            <input
                                type="text"
                                value={maquinaNome}
                                onChange={(event) => setMaquinaNome(event.target.value)}
                                placeholder="Ex: Máquina de corte"
                                required
                            />

                            <label>Setor</label>
                            <select
                                value={maquinaSetorId}
                                onChange={(event) => setMaquinaSetorId(event.target.value)}
                                required
                            >
                                <option value="">Selecione um setor</option>

                                {setores.map((setor) => (
                                    <option key={setor.id} value={setor.id}>
                                        {setor.nome}
                                    </option>
                                ))}
                            </select>

                            <button type="submit">
                                {maquinaEditando ? "Salvar alterações" : "Cadastrar máquina"}
                            </button>
                        </form>

                        {mensagem && <p>{mensagem}</p>}

                        <h3>Máquinas cadastradas</h3>

                        <div className="lista-setores">
                            {maquinas.map((maquina) => (
                                <div className="setor-item" key={maquina.id}>
                                    <div>
                                        <h3>{maquina.nome}</h3>
                                        <p>Setor: {maquina.setor}</p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => editarMaquina(maquina)}
                                    >
                                        Editar
                                    </button>

                                    <button
                                        type="button"
                                        className="btn-excluir"
                                        onClick={() => excluirMaquina(maquina.id)}
                                    >
                                        Excluir
                                    </button>
                                </div>
                            ))}

                            {maquinas.length === 0 && (
                                <p>Nenhuma máquina cadastrada.</p>
                            )}
                        </div>
                    </>
                )}
                {abaAtiva === "materiais" && (
                    <>
                        <h2>Gerenciar Materiais</h2>

                        <form onSubmit={salvarMaterial}>
                            <label>Nome do material</label>
                            <input
                                type="text"
                                value={materialNome}
                                onChange={(event) => setMaterialNome(event.target.value)}
                                placeholder="Ex: Papelão"
                                required
                            />

                            <label>Unidade de medida</label>
                            <input
                                type="text"
                                value={materialUnidade}
                                onChange={(event) => setMaterialUnidade(event.target.value)}
                                placeholder="Ex: kg, litro, unidade"
                                required
                            />

                            <label>Descrição</label>
                            <textarea
                                value={materialDescricao}
                                onChange={(event) => setMaterialDescricao(event.target.value)}
                                placeholder="Descreva o material"
                            />

                            <button type="submit">
                                {materialEditando ? "Salvar alterações" : "Cadastrar material"}
                            </button>
                        </form>

                        {mensagem && <p>{mensagem}</p>}

                        <h3>Materiais cadastrados</h3>

                        <div className="lista-setores">
                            {materiais.map((material) => (
                                <div className="setor-item" key={material.id}>
                                    <div>
                                        <h3>{material.nome}</h3>
                                        <p>Unidade: {material.unidade_medida}</p>
                                        <p>{material.descricao || "Sem descrição"}</p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => editarMaterial(material)}
                                    >
                                        Editar
                                    </button>

                                    <button
                                        type="button"
                                        className="btn-excluir"
                                        onClick={() => excluirMaterial(material.id)}
                                    >
                                        Excluir
                                    </button>
                                </div>

                            ))}

                            {materiais.length === 0 && (
                                <p>Nenhum material cadastrado.</p>
                            )}
                        </div>
                    </>
                )}

                {abaAtiva === "tipos" && (
                    <>
                        <h2>Gerenciar Tipos de Ocorrência</h2>

                        <form onSubmit={salvarTipo}>
                            <label>Nome do tipo</label>
                            <input
                                type="text"
                                value={tipoNome}
                                onChange={(event) => setTipoNome(event.target.value)}
                                placeholder="Ex: Vazamento"
                                required
                            />

                            <label>Descrição</label>
                            <textarea
                                value={tipoDescricao}
                                onChange={(event) => setTipoDescricao(event.target.value)}
                                placeholder="Descreva o tipo de ocorrência"
                            />

                            <button type="submit">
                                {tipoEditando ? "Salvar alterações" : "Cadastrar tipo"}
                            </button>
                        </form>

                        {mensagem && <p>{mensagem}</p>}

                        <h3>Tipos cadastrados</h3>

                        <div className="lista-setores">
                            {tipos.map((tipo) => (
                                <div className="setor-item" key={tipo.id}>
                                    <div>
                                        <h3>{tipo.nome}</h3>
                                        <p>{tipo.descricao || "Sem descrição"}</p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => editarTipo(tipo)}
                                    >
                                        Editar
                                    </button>

                                    <button
                                        type="button"
                                        className="btn-excluir"
                                        onClick={() => excluirTipo(tipo.id)}
                                    >
                                        Excluir
                                    </button>
                                </div>
                            ))}

                            {tipos.length === 0 && (
                                <p>Nenhum tipo de ocorrência cadastrado.</p>
                            )}
                        </div>
                    </>
                )}
                {abaAtiva === "destinos" && (
                    <>
                        <h2>Gerenciar Destinos de Resíduos</h2>

                        <form onSubmit={salvarDestino}>
                            <label>Nome do destino</label>
                            <input
                                type="text"
                                value={destinoNome}
                                onChange={(event) => setDestinoNome(event.target.value)}
                                placeholder="Ex: Reciclagem"
                                required
                            />

                            <label>Descrição</label>
                            <textarea
                                value={destinoDescricao}
                                onChange={(event) => setDestinoDescricao(event.target.value)}
                                placeholder="Descreva o destino dos resíduos"
                            />

                            <button type="submit">
                                {destinoEditando ? "Salvar alterações" : "Cadastrar destino"}
                            </button>
                        </form>

                        {mensagem && <p>{mensagem}</p>}

                        <h3>Destinos cadastrados</h3>

                        <div className="lista-setores">
                            {destinos.map((destino) => (
                                <div className="setor-item" key={destino.id}>
                                    <div>
                                        <h3>{destino.nome}</h3>
                                        <p>{destino.descricao || "Sem descrição"}</p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => editarDestino(destino)}
                                    >
                                        Editar
                                    </button>
                                    <button
                                        type="button"
                                        className="btn-excluir"
                                        onClick={() => excluirDestino(destino.id)}
                                    >
                                        Excluir
                                    </button>
                                </div>
                            ))}

                            {destinos.length === 0 && (
                                <p>Nenhum destino cadastrado.</p>
                            )}
                        </div>
                    </>
                )}
            </section>
        </main>
    );
}

export default Cadastros;
