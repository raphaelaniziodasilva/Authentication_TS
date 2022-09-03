import { MigrationInterface, QueryRunner } from "typeorm"
import { AppDataSource } from "../data-source"
import { User } from "../entity/User"

export class CreateAdminUser1662075985859 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        let user = new User()
        user.username = "admin"
        user.password = "admin"
        user.hashPassword()
        user.role = "ADMIN"
        const userRepository = AppDataSource.getRepository(User)
        await userRepository.save(user)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {

    }

}
// npx typeorm migration:create .\src\migration\CreateAdminUser


