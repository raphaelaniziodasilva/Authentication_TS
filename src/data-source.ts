import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./entity/User"

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "Vaizards1$",
    database: "AuthenticationTS",
    synchronize: true,
    logging: false,
    entities: [User],
    migrations: [],
    subscribers: [],
})

// Aqui e o nosso arquivo de configuração do banco de dado, com o banco configurado vamos criar a conexão va para o index.ts para fazer a conexão
