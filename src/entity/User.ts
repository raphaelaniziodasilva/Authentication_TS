import { 
    Entity,
    PrimaryGeneratedColumn, 
    Column,
    Unique,
    CreateDateColumn,
    UpdateDateColumn
} from "typeorm"
import {Length, IsNotEmpty} from "class-validator"
import * as bcrypt from "bcryptjs"

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    @Length(4, 20)
    username: string

    @Column()
    @Length(6, 100)
    password: string

    @Column()
    @IsNotEmpty()
    role: string

    @Column()
    @CreateDateColumn()
    createdAt: Date

    @Column()
    @UpdateDateColumn()
    updatedAt: Date

    hashPassword() {
        this.password = bcrypt.hashSync(this.password, 8)
    }

    checkIfUnencryptedPasswordIsValid(unencripytedPassword: string) {
        return bcrypt.compareSync(unencripytedPassword, this.password)
    }




}
