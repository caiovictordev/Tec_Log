
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Ocorrencia from "./pages/Ocorrencia";
import ListaOcorrencias from "./pages/ListaOcorrencias";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard/>} />
                <Route path="/ocorrencias/nova" element={<Ocorrencia />} />
                <Route path="/ocorrencias" element={<ListaOcorrencias />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
