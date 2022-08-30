// Aqui vai ser o nosso controler de autenticação quando for usar login

import {Request, Reponse} from "express"
import * as jwt from "jsonwebtoken"
import { AppDataSource } from "../data-source"

import { User} from "../entity/User"
import config from "../config/config"
import { rmSync } from "fs"
import { validate } from "class-validator"

class AuthController {
    static login = async (req: Request, res: Reponse) => {
        let {username, password} = req.body

        if (!(username && password)) {
           return res.status(404).send()
        }

        const userRepository = AppDataSource.getRepository(User)
        let user: User

        try {
            user = await userRepository.findOneOrFail({where: {username}})
        } catch (error) {
            return res.status(401).send("User not found!")            
        }

        if(!user.checkIfUnencryptedPasswordIsValid(password)) {
            return res.status(401).send("Password or user not found")
        }

        const token = jwt.sign(
            {userId: user.id, username: user.username},
            config.jwtSecret,
            {expiresIn: "1h"}
        )
        return res.send(token)
    } 

    static changePassword = async (req: Request, res: Reponse) => {
        const id = res.locals.jwtPayload.userId
        
        const {oldPassword, newPassword} = req.body

        if(!(oldPassword && newPassword)) {
            return res.status(400).send()
        }

        const userRepository = AppDataSource.getRepository(User)
        let user: User

        try {
            user = await userRepository.findOneOrFail(id)
        } catch (error) {
            return res.status(401).send("User not found!")  
        }

        if(!user.checkIfUnencryptedPasswordIsValid(oldPassword)){
            return res.status(401).send("Old password not match!")  
        }

        user.password = newPassword

        const errors = await validate(user)

        if(errors.length > 0) {
            return res.status(400).send(errors)   
        }

        user.hashPassword()
        userRepository.save(user)

        return res.status(204).send("Password changed!")
    }
}

export default AuthController