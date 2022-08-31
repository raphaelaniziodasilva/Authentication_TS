import { 
    Entity,
    PrimaryGeneratedColumn, 
    Column,
    Unique,
    CreateDateColumn,
    UpdateDateColumn
} from "typeorm"

// importando os validator para fazer as validações
import { Length, IsNotEmpty } from "class-validator"
import * as bcrypt from "bcryptjs"

// montando a entidade User
@Entity()
@Unique(["username"]) // transformando o username como unico
export class User {

    // chave primaria com auto incremento
    @PrimaryGeneratedColumn()
    id: number

    // coluna da tabela
    @Column()
    // vai ter no minimo 4 caractere e no maximo 20 caractere
    @Length(4, 20)
    username: string // vai ser unico 

    @Column()
    // vai ter no minimo 6 caractere e no maximo 100 caractere
    @Length(6, 100)
    password: string

    // o role vai definir o que o usuario e dentro do sistema se for um admin vai passar role: string = "ADMIN", se for usuario role: string = "USER"
    @Column()
    // não pode ser nulo ou vazio, tem que passar o valor para poder ser dentificado
    @IsNotEmpty()
    role: string

    // o createdAt vai dizer quando foi criado indicando a data de criação
    @Column()
    // criando uma coluna de data
    @CreateDateColumn()
    createdAt: Date

    // o updatedAt vai dizer quando foi alterado indicando a data
    @Column()
    // Atualizando a data e hora da coluna
    @UpdateDateColumn()
    updatedAt: Date

    // vamos fazer a criptação da senha para dar segurança 
    hashPassword() {
        this.password = bcrypt.hashSync(this.password, 8)
    }

    // criando um metodo para descriptar a senha
    checkIfUnencryptedPasswordIsValid(unencripytedPassword: string) {
        return bcrypt.compareSync(unencripytedPassword, this.password)

        // o que esse comando vai fazer vai incriptar a senha e depois vai comparar com senha do banco de dados, vai comparar a senha não criptografada que depois vai criptografa-la por debaixo dos panos e vai comparar com a senha atual
        // e dessa forma que conseguimos identificar se a senha esta correta ou não no nosso sistema
    }
}

// Agora vamos criar os controller
