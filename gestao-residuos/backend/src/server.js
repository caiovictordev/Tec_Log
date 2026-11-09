import "dotenv/config";
import express from "express";
import cors from "cors";
import conect from "./config/database.js";
import setorRoutes from "./routes/setorRoutes.js";
import materialRoutes from "./routes/materialRoutes.js";
import maquinaRoutes from "./routes/maquinaRoutes.js";
import usuarioRoutes from "./routes/usuarioRoutes.js";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas
app.use("/api/setores", setorRoutes);
app.use("/api/materiais", materialRoutes);
app.use("/api/maquinas", maquinaRoutes);
app.use("/api/usuarios", usuarioRoutes);

const PORT = process.env.PORT;

async function startServer() {
    try {
        // Testa a conexão antes de abrir a porta do servidor
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
