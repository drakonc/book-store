import {MigrationInterface, QueryRunner} from "typeorm";

export class fixLastnameDetails1585444897025 implements MigrationInterface {
    name = 'fixLastnameDetails1585444897025'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_details" ALTER COLUMN "lastname" DROP NOT NULL`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_details" ALTER COLUMN "lastname" SET NOT NULL`, undefined);
    }

}
