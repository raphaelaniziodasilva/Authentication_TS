// Aqui vai ser o nosso controler de autenticação, vamos criar o login e suas funcionalidades e validações

// importando o express
import {Request, Reponse} from "express"

// importando o controlador de autenticação o jwt
import * as jwt from "jsonwebtoken"

// usando o AppDataSource para poder pegar o repositorio
import { AppDataSource } from "../data-source"

// repositorio User
import { User} from "../entity/User"

// importando a configuração aonde tem a chave do jwt
import config from "../config/config"
import { rmSync } from "fs"
import { validate } from "class-validator"

// criando a classe AuthController que vai conter varios metodos, ou seja é uma classe que controla uma parte do meu sistema, aqui vamos desenvolver metodos que vão nos auxiliar no contexto de autenticação
class AuthController {

    // criando o login e suas funcionalidades, a função static não vai ter retorno 
    static login = async (req: Request, res: Reponse) => {

        // vamos capturar do express o username e password e enviar pro body da requisição
        let {username, password} = req.body

        // fazendo validação dizendo que o username e password são obrigatorio
        if (!(username && password)) {
           return res.status(404).send({message: "Username and password are required"})
        }

        // vamos pegar algumas informações do repositorio User 
        const userRepository = AppDataSource.getRepository(User)

        // vamos criar uma variavel de usuario que vai conter o usuario
        let user: User

        try {
            // agora vamos procurar o username que esta no repositorio User
            user = await userRepository.findOneOrFail({where: {username}})

        } catch (error) { // se não for encontrado o username vai devolver um erro
            return res.status(401).send("User not found!")            
        }

        // verificando a senha que esta no repositorio, eu estou enviando o password que não esta incriptado para poder verificar se esta certo ou não então se o password não der match com o password incriptado que esta no banco de dados vamos enviar uma resposta pro usuario
        if(!user.checkIfUnencryptedPasswordIsValid(password)) {
            return res.status(401).send("Password or user not found")
        }

        // com usuario achado e o password correto vamos gerar um token para o usuario, precisamos cadastrar o usuario no jwt para gerar o token
        const token = jwt.sign(
            {userId: user.id, username: user.username}, // passando o id e username
            config.jwtSecret, // passando a senha secreta do jwt para ser validada
            {expiresIn: "1h"} // expira em uma hora
        )
        // com tudo certo vamos enviar o token para o usuario, o usuario vai usar o token para poder utilizar o sistema
        return res.send(token)

        // o login ja esta completo
    } 

    // trocar senha, função static não vai ter retorno 
    static changePassword = async (req: Request, res: Reponse) => {

        // vamos pegaro id do jwtPayload o userId, no jwtPayload esta armazenado o username e userId
        const id = res.locals.jwtPayload.userId

        // vamos capiturar o que o usuario esta mandando do body   
        const {oldPassword, newPassword} = req.body

        // validação se o usuario não esta mandando a antiga senha e a nova senha
        if(!(oldPassword && newPassword)) {
            return res.status(400).send()
        }

        // vamos pegar algumas informações do repositorio User  
        const userRepository = AppDataSource.getRepository(User)

        // vamos criar uma variavel de usuario que vai conter o usuario
        let user: User

        try {
            // agora vamos pegar por id porque eu ja conheço o id do usuario e deixei armazenado no locals que esta no começo dessa função 
            user = await userRepository.findOneOrFail(id)
        } catch (error) {
            return res.status(401).send("User not found!")  
        }

        // aqui estou verificando se o antigo password esta correto, se o password não for valido não vou deixar o usuario trocar de senha
        if(!user.checkIfUnencryptedPasswordIsValid(oldPassword)){
            return res.status(401).send("Old password not match!")  
        }

        // fazendo a mudança da senha substituindo a senha antiga pela nova
        user.password = newPassword

        // o validator vai la no banco de dados e vai validar a nova senha que foi definida
        const errors = await validate(user) 
        if(errors.length > 0) {
            return res.status(400).send(errors)   
        }

        // a nova senha não foi criptada, vamos fazer a criptação da nova senha por motivos de segurança
        user.hashPassword()

        // passando a nova entidade para o banco de dados, passando a instancia de user alterada  
        userRepository.save(user)

        return res.status(204).send("Password changed!")
    }
}

export default AuthController