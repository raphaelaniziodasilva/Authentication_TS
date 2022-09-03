// vai checar as nossas autenticações dos tokens que vamos passar ele vai verificar para nos

import {Request, Response, NextFunction} from "express"

// importando o jwt
import * as jwt from "jsonwebtoken"

// importando o config da pasta config
import config from "../config/config"

// criando a função base do jwt 
export const checkJwt = (req: Request, res: Response, next: NextFunction) => {
    const token = <string>req.headers["auth"]
    let jwtPayload

    try {
        // vai verificar o token no arquivo de configuração que e o config.jwtSecret que esta na pasta config

        jwtPayload = <any>jwt.verify(token, config.jwtSecret)
        // estamos armazenando o Payload que e uma instancia da verificação do token que vem la do config.jwtSecret, essa linha esta definido que o jwtPayload vai ser a resposta quando vier 
        res.locals.jwtPayload = jwtPayload

        // vamos armazenar o jwtPayload numa variavel local ou seja toda vez que eu for executar alguma coisa vai verificar se o payload esta la, se estiver la o cara esta autenticado
    } catch(error:any) {
        res.status(401).send
    }

    // Agora vamos criar uma funcionalidade para fazer a expiração do token ou seja vamos acabar com a seçao do usuario depois de uma hora de execução. Depois de uma hora logado o usuario vai expirar e não vai mais funcionar 
    const {userId, username} = jwtPayload

    // gerando um novo token com algumas config.
    const newToken = jwt.sign({userId, username}, config.jwtSecret, {
        expiresIn: "1h"

        // Criando um novo token baseado no config.jwtSecret vai criar um token pro userId e username e esse usaario vai expirar em uma hora, a cada uma hora o usuario vai ter que logar novamente
    })

    // setando no header
    res.setHeader("token", newToken)

    next()
}