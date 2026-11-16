
function autorizarAdmin(req, res, next) {

    if (!req.usuario || req.usuario.perfil !== "admin") {
        return res.status(403).json({
            message: "Acesso permitido somente para administradores."
        });
    }

    next();
}

export default autorizarAdmin;
