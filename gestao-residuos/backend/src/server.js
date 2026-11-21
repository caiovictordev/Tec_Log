import "dotenv/config";
import express from "express";
import cors from "cors";
import conect from "./config/database.js";

import setorRoutes from "./routes/setorRoutes.js";
import materialRoutes from "./routes/materialRoutes.js";
import maquinaRoutes from "./routes/maquinaRoutes.js";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import ocorrenciaRoutes from "./routes/ocorrenciaRoutes.js";
import tipoOcorrenciaRoutes from "./routes/tipoOcorrenciaRoute.js";
import destinoResiduoRoutes from "./routes/destinoResiduoRoute.js";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas
app.use("/api/setores", setorRoutes);
app.use("/api/materiais", materialRoutes);
app.use("/api/maquinas", maquinaRoutes);
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/ocorrencias", ocorrenciaRoutes);
app.use("/api/tipos-ocorrencia", tipoOcorrenciaRoutes);
app.use("/api/destinos-residuos", destinoResiduoRoutes);

const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        await conect.query("SELECT 1");
        console.log("🚀 MySQL conectado com sucesso!");

        app.listen(PORT, () => {
            console.log(`📡 Servidor rodando em http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error("❌ Falha crítica ao conectar com MySQL:", error.message);
        process.exit(1);
    }
}

startServer();
