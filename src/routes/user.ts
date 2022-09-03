// rotas de usuario

// importando o router do express
import {Router} from "express"

// importando a UserController da pasta controller
import { UserController } from "../controller/UserController"

// importando o checkJwt da pasta middlewares
import {checkJwt} from "../middlewares/checkJwt"

// importando o checkRole da pasta middlewares
import {checkRole} from "../middlewares/checkRole"

const router = Router()

//Get All users, o checkJwt vai fazer uma verificação do token e o checkRole so vai deixar quem for ADMIN do meu sistema vai poder acessar essa Role e depois passando por essa validação vamos poder mostrar para as pessoas o UserController.listAll 
router.get("/", [checkJwt, checkRole(["ADMIN"])], UserController.listAll)

//Get One user 
router.get(
    "/:id([0-9]+)", [checkJwt, checkRole(["ADMIN"])],
    UserController.getOneById
)

//Create a new user, checkJwt vai fazer uma verificação do token e o checkRole vai dixar so o ADMIN criar usuarios no sistema, UserController.newUser vai criar os usuarios
router.post("/", [checkJwt, checkRole(["ADMIN"])], UserController.newUser)

//Edit one user 
router.put(
    "/:id([0-9]+)",
    [checkJwt, checkRole(["ADMIN"])],
    UserController.editUser
)

// delete user
router.delete(
    "/:id([0-9]+)",
    [checkJwt, checkRole(["ADMIN"])],
    UserController.deleteUser
)

// exortando a rota
export default router