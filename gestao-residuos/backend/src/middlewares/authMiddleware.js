
import jwt from "jsonwebtoken";

function autenticar(req, res, next) {
    try {
        const authorization = req.headers.authorization;

        if (!authorization) {
            return res.status(401).json({
                message: "Token de autenticação não informado."
            });
        }

        const [tipo, token] = authorization.split(" ");

        if (tipo !== "Bearer" || !token) {
            return res.status(401).json({
                message: "Formato de token inválido."
            });
        }

        const dadosUsuario = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.usuario = dadosUsuario;

        next();

    } catch (error) {
        return res.status(401).json({
            message: "Token inválido ou expirado."
        });
    }
}

export default autenticar;
