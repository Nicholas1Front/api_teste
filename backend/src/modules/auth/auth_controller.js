const authService = require('./auth_service');
const { loginSchema, registerSchema } = require('./auth_schema');

class AuthController{
    async login(req, res){
        try{
            const data = loginSchema.parse(req.body);

            const result = await authService.login({
                email : data.email,
                password : data.password
            });

            return res.status(200).json({
                message : "Login successful",
                data : result
            });
        }catch(err){
            return res.status(401).json({
                message : 'Login failed',
                error : err.message
            })
        }
    }
    async me(req, res){
        try{
            const user = await authService.me(req.user.id);

            return res.status(200).json({
                message : "User retrieved successfully",
                data : user
            })
        }
        catch(err){
            return res.status(400).json({
                message : "Failed to retrieve user",
                error : err
            })
        }
    }

    async register(req, res){
        try{
            const data = registerSchema.parse(req.body);

            await authService.register({
                name : data.name,
                email : data.email,
                password : data.password
            });

            return res.status(200).json({
                message : "User registered successfully"
            })
        }catch(err){
            return res.status(400).json({
                message : "Failed to register user",
                error : err
            })
        }
    }
}

module.exports = new AuthController();