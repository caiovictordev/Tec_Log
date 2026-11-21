import "./Notificacao.css";

function Notificacao({ tipo = "sucesso", mensagem, onFechar }) {
    if (!mensagem) {
        return null;
    }

    return (
        <div
            className={`notificacao notificacao-${tipo}`}
            role="alert"
        >
            <span>{mensagem}</span>

            <button
                type="button"
                onClick={onFechar}
                aria-label="Fechar notificação"
            >
                ×
            </button>
        </div>
    );
}

export default Notificacao;