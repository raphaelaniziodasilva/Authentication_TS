// vai nos ajudar a tratar metadados 
import "reflect-metadata"
import * as express from "express"

// vai nos auxiliar a tratar o corpo das menssagens que vamos montar
import * as bodyParser from "body-parser"

// vai nos ajudar a tratar algumas coisas de cores  
import helmet from "helmet"

// vai complementar o helmet
import * as cors from "cors"

import routes from "./routes"

// Agora vamos configurar o data-source.ts

// importando o AppDataSource para fazer a conexão com o banco de dados
import { AppDataSource } from "./data-source"

// iniciando o database, fazendo a configuração do banco de dados
AppDataSource.initialize()
    .then(() => {

        // usando o express para poder trazer as informações os dados que queremos
        const app = express()

        //call middlewares

        // a autenticação cors serve para poder bloquear ou autorizar conexões externas que esta fora do nosso servidor
        app.use(cors()) 

        // o helmet vai nos fornercer uma serie de configurações que vai proteger a nssa aplicação express com isso vamos ter um pouco mais de segurança no nosso projeto a nossa aplicação
        app.use(helmet())

        // o bodyParser e um middleware que vai catar toda as respostas que vier para a gente ele vai parciar ela automaticamente, tudo que vier de resposta ele vai capiturar e vai transformar em json
        app.use(bodyParser.json())

        //Set all routes from routes folder
        app.use("/", routes)

        app.listen(3030, () => {
            console.log("Server started on por 3030")
        })
    })
    .catch((error) => console.log(error))

    // Agora vamos configurar as rotas