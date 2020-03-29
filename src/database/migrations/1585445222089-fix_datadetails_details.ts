import {MigrationInterface, QueryRunner} from "typeorm";

export class fixDatadetailsDetails1585445222089 implements MigrationInterface {
    name = 'fixDatadetailsDetails1585445222089'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_details" ALTER COLUMN "create_at" SET DEFAULT now()`, undefined);
        await queryRunner.query(`ALTER TABLE "user_details" ALTER COLUMN "update_at" SET DEFAULT now()`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_details" ALTER COLUMN "update_at" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "user_details" ALTER COLUMN "create_at" DROP DEFAULT`, undefined);
    }

}
