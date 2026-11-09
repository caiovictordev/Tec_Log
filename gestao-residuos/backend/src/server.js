import "dotenv/config";
import express from "express";
import cors from "cors";
import conect from "./config/database.js";
import setorRoutes from "./routes/setorRoutes.js";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas
app.use("/api/setores", setorRoutes);

// Rota de teste/saúde da API
app.get("/api/health", async (req, res) => {
    try {
        const [rows] = await conect.query("SELECT DATABASE() AS banco");

        return res.status(200).json({
            status: "UP",
            message: "API funcionando!",
            database: rows[0].banco
        });
    } catch (error) {
        console.error("Erro na rota de health check:", error);
        return res.status(500).json({
            status: "DOWN",
            message: "Erro ao conectar com o banco de dados."
        });
    }
});

// Definição da porta com fallback seguro
const PORT = process.env.PORT || 3000;

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
