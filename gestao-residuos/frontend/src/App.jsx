import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Ocorrencia from "./pages/Ocorrencia";
import ListaOcorrencias from "./pages/ListaOcorrencias";
import Cadastros from "./pages/Cadastros";
import Usuarios from "./pages/Usuarios";

import Navbar from "./components/Navbar";

function Layout() {
    const token = localStorage.getItem("token");

    if (!token) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="app-layout">
            <Navbar />

            <div className="app-content">
                <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/ocorrencias" element={<ListaOcorrencias />} />
                    <Route path="/ocorrencias/nova" element={<Ocorrencia />} />

                    <Route
                        path="/cadastros"
                        element={
                            JSON.parse(localStorage.getItem("usuario") || "{}").perfil === "admin"
                                ? <Cadastros />
                                : <Navigate to="/dashboard" replace />
                        }
                    />
                    <Route
                        path="/usuarios"
                        element={
                            JSON.parse(localStorage.getItem("usuario") || "{}").perfil === "admin"
                                ? <Usuarios />
                                : <Navigate to="/dashboard" replace />
                        }
                    />

                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>


            </div>
        </div>
    );
}

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/*" element={<Layout />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
