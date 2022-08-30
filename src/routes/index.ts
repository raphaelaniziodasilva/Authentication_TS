// aqui vai ser o arquivo de rotas global, aqui aonde vai ser controlado todas as rotas

import {Router, Request, Response} from "express"
import auth from "./auth"
import user from "./user"
import { request } from "http"

const routes = Router()

routes.use('/auth', auth)
routes.use("/user", user)

export default routes

// Agora vamos comecar a desenvolver os middleware