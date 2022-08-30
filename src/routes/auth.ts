// rotas de autenticação 
// importando a rota do express
import router, { Router } from "express"

// importando AuthController da pasta controller
import AuthController from "../controller/AuthController"

// importando o middleware checkJwt da pasta middleware
import { checkJwt } from "../middlewares/checkJwt"


//criando a rota de login que vai ser controlada pelo AuthController.login
router.post("/login", AuthController.login)

//criando a rota de mudança senha aonde o checkJwt vai fazer uma verificação do token e o AuthController.changePassword vai tratar a alteração da senha
router.post("change-password", [checkJwt], AuthController.changePassword)

// exportando a rota
export default router