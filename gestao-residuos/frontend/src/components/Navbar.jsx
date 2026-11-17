
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
    const navigate = useNavigate();
    const [menuAberto, setMenuAberto] = useState(false);

    const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
    const isAdmin = usuario.perfil === "admin";

    function handleLogout() {
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");

        setMenuAberto(false);
        navigate("/");
    }

    function fecharMenu() {
        setMenuAberto(false);
    }

    return (
        <>
            <button
                className="menu-toggle"
                onClick={() => setMenuAberto(!menuAberto)}
                aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}
                aria-expanded={menuAberto}
            >
                {menuAberto ? "✕" : "☰"}
            </button>

            {menuAberto && (
                <div
                    className="navbar-overlay"
                    onClick={fecharMenu}
                />
            )}

            <aside className={`navbar ${menuAberto ? "navbar-open" : ""}`}>
                <div className="navbar-logo">
                    <h2>Gestão de Resíduos</h2>
                    <span>Sistema Industrial</span>
                </div>

                <nav className="navbar-links">
                    <NavLink to="/dashboard" onClick={fecharMenu}>
                        Dashboard
                    </NavLink>

                    <NavLink to="/ocorrencias" end onClick={fecharMenu}>
                        Ocorrências
                    </NavLink>

                    <NavLink to="/ocorrencias/nova" onClick={fecharMenu}>
                        Nova ocorrência
                    </NavLink>

                    {isAdmin && (
                        <>
                            <NavLink to="/cadastros" onClick={fecharMenu}>
                                Cadastros
                            </NavLink>

                            <NavLink to="/usuarios" onClick={fecharMenu}>
                                Gerenciar usuários
                            </NavLink>
                        </>
                    )}
                </nav>

                <div className="navbar-footer">
                    <button onClick={handleLogout}>
                        Sair do sistema
                    </button>
                </div>
            </aside>
        </>
    );
}

export default Navbar;
