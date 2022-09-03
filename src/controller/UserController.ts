import { validate } from "class-validator"
import { Request, Response } from "express"
import { AppDataSource } from "../data-source"
import { User } from "../entity/User"

// criando um crud para o Usuario
export class UserController {

    // listar todos os usuarios
    static listAll = async(req: Request, res: Response) => {

        // criando o userRepository que vai pegar as informações do repositorio User da class User
        const userRepository = AppDataSource.getRepository(User)

        const users = await userRepository.find({
            // selecione as informações do repositorio e os traga 
            select: ["id", "username", "role"]
        })

        // enviando enviamos as informações do usuario
        return res.send(users)
    }

    // listando um unico usuario pelo id
    static getOneById = async(req: Request, res: Response) => {

        // pegando o id que vem do parametro de rota aonde vamos ter que passar o numero do id para poder listar
        const id = req.params.id

        // criando o userRepository que vai pegar as informações do repositorio User da class User
        const userRepository = AppDataSource.getRepository(User)
        
        // definindo o user como User
        let user: User

        try { // buscando o usuario pelo id
            user = await userRepository.findOneOrFail({where: id})
        } catch (error) {

            // e der erro vai vir uma resposta
            return res.status(404).send("User not found")            
        }
        // se deu certo enviamos as informações do usuario
        return res.send(user)
    }

    // criando um novo usuario
    static newUser = async(req: Request, res: Response) => {

        // recebendo informações do body
        let {username, password, role} = req.body

        // criando um instancia da classe user, ja que não temos o metodo construtor
        let user: User = new User()

        // incluindo os atributos e atribuindo os valores para cada aributo
        user.username = username
        user.password = password
        user.role = role

        // fazendo a validação das informações pegando a classe user
        const errors = await validate(user)

        // validação pegando os erros de length de tamanho de valor em atributos
        if(errors.length > 0) {
            return res.status(400).send(errors)
        }

        // fazendo o hash do password ou seja estamos incriptografando com bcrypt, chamando o metodo hashPassword() que vai pegar o valor da classe User this.password que enviamos o password e vai incriptar com o bcrypt
        user.hashPassword()

        // criando o userRepository que vai pegar as informações do banco de dados
        const userRepository = AppDataSource.getRepository(User)
        
        try { 
            // enviando as informações para o banco de dados 
            await userRepository.save(user)
        } catch (error) {
            return res.status(400).send(error)            
        }

        // se deu certo enviamos as informações do usuario
        return res.status(201).send("User created")        
    }

    // editando um usuario
    static editUser = async(req: Request, res: Response) => {

        // pegando o id que vem do parametro de rota aonde vamos ter que passar o numero do id para poder editar
        const id = req.params.id

        // recebendo informações do body, a senha não e tratada aqui ja tratamos  senha no AythController 
        const {username, role} = req.body

        // criando o userRepository que vai pegar as informações do banco de dados
        const userRepository = AppDataSource.getRepository(User)

        // definindo a variavel de user que vai ser do tipo User
        let user: User

        try { // pegando o id do usuario se realmente existir
            user = await userRepository.findOneOrFail({where: id})           
        } catch (error) {
            return res.status(404).send("User not found")            
        }

        // PARAMOS EM 52:00
        if(username) {
            user.username = username
        }

        if(role) {
            user.role = role
        }

        const errors = await validate(user)
        if(errors.length > 0) {
            return res.status(400).send(errors)
        }

        try {
            await userRepository.save(user)
        } catch(error) {
            return res.status(409).send("Username already in use")
        }

        return res.status(204).send()
    }

    static deleteUser = async (req: Request, res: Response) => {
        const id = req.params.id

        const userRepository = AppDataSource.getRepository(User)
        let user: User
        try {
            user = await userRepository.findOneOrFail({where: id})
        } catch(error) {
            return res.status(404).send("User not found")
        }

        userRepository.delete(id)

        return res.status(204).send()
    }

}