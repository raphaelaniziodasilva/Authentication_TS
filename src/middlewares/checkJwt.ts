// vai checar as nossas autenticações dos tokens que vamos passar ele vai verificar para nos

// PARAMOS EM 2:02:00 HORAS

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
        jwtPayload = <any>jwt.verify(token, config.jwtSecret)
        res.locals.jwtPayload = jwtPayload
    } catch(error:any) {
        res.status(401).send
    }


    const {userId, username} = jwtPayload
    const newToken = jwt.sign({userId, username}, config.jwtSecret, {
        expiresIn: "1h"
    })

    res.setHeader("token", newToken)

    next()
}