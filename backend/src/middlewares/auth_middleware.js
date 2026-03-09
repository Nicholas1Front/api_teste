const jwt = require('jsonwebtoken');

/* 
    Middleware responsável por proteger rotas que exigem autenticação.

    Ele configura a autenticação utilizando tokens JWT, verificando se o token enviado no header da requisição é válido e não expirou.

*/

function authMiddleware(req,res,next){
    // Lê o header "Authorization" da requisição
    const authReader = req.headers.authorization;

    if(!authReader){
        return res.status(401).json({message: 'No token provided'});
    }

    // Separa o tipo de autenticação e o token
    const [type, token] = authReader.split(' ');

    if(type !== 'Bearer' || !token){
        return res.status(401).json({message: "Invalid token format"})
    }

    try{
        // Verifica o token JWT utilizando a chave secreta definida na variável de ambiente JWT_SECRET
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        )
        // Se o token for válido, adiciona os dados do usuário autenticado ao objeto req para uso nas rotas protegidas
        req.user = {
            id : decoded.sub
        }

        return next();

    }catch(err){
        return res.status(401).json({message: "Invalid or expired token"});
    }
}

module.exports = authMiddleware;