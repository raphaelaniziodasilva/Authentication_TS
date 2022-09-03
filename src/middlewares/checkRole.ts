// aqui vai ajudar a proteger mais o nosso sistema com alguma inteigencia de bloqueio

import {Request, Response, NextFunction} from "express"
import { AppDataSource } from "../data-source"
import {User} from "../entity/User"

export const checkRole = (roles: Array<string>) => {
    return async (req: Request, res: Response, next: NextFunction) => {

        // vamos usar o jwt para nos ajudar em algumas coisas, o jwt armazenou para nos o id o usuario e vamos usar esse id pra nos auxiliar
        const id = res.locals.jwtPayload.userId // uma forma de capiturar o id do usuario

        // estamos pegando as informações do usuario do repostorio de usuario, ou seja estou pegando as informações do usuario que esta no banco de dados
        const userRepository = AppDataSource.getRepository(User)
        let user: User
        
        try {
            // estamos sando uma função pronta do TypeOrm que vai fazer uma query no banco de dados tentando pegar um usuario pelo id e se der falha ele vai nos retorna uma exceção que vai ser tratado pelo catch
            user = await userRepository.findOneOrFail({where: id})
        } catch(error: any) {
            res.status(401).send(error.message)

            // Vai tentar pegar um usuario se não conseguir me retorne uma falha
        }

        // indexOf vai procurar dentro do array de roles se o user possui a roler que queremos se não encontrar vai me retornar -1
        if(roles.indexOf(user.role) > -1){
            next();
        } else {
            res.status(401).send()
        }
    }
}   