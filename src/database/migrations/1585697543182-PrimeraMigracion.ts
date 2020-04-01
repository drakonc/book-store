import {MigrationInterface, QueryRunner} from "typeorm";

export class PrimeraMigracion1585697543182 implements MigrationInterface {
    name = 'PrimeraMigracion1585697543182'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_details" ("id" SERIAL NOT NULL, "name" character varying(50), "lastname" character varying, "status" character varying(8) NOT NULL DEFAULT 'Activo', "create_at" TIMESTAMP DEFAULT now(), "update_at" TIMESTAMP DEFAULT now(), CONSTRAINT "PK_fb08394d3f499b9e441cab9ca51" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "roles" ("id" SERIAL NOT NULL, "name" character varying(25) NOT NULL, "description" text NOT NULL, "status" character varying(8) NOT NULL DEFAULT 'Activo', "create_at" TIMESTAMP NOT NULL DEFAULT now(), "update_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_648e3f5447f725579d7d4ffdfb7" UNIQUE ("name"), CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "username" character varying(25) NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "status" character varying(8) NOT NULL DEFAULT 'Activo', "create_at" TIMESTAMP NOT NULL DEFAULT now(), "update_at" TIMESTAMP NOT NULL DEFAULT now(), "detail_id" integer NOT NULL, CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "REL_9fc134ca20766e165ad650ee74" UNIQUE ("detail_id"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "books" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "description" character varying(500) NOT NULL, "status" character varying(8) NOT NULL DEFAULT 'Activo', "create_at" TIMESTAMP NOT NULL DEFAULT now(), "update_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_f3f2f25a099d24e12545b70b022" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "user_roles" ("usersId" integer NOT NULL, "rolesId" integer NOT NULL, CONSTRAINT "PK_38ffcfb865fc628fa337d9a0d4f" PRIMARY KEY ("usersId", "rolesId"))`, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_99b019339f52c63ae615358738" ON "user_roles" ("usersId") `, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_13380e7efec83468d73fc37938" ON "user_roles" ("rolesId") `, undefined);
        await queryRunner.query(`CREATE TABLE "user_books" ("usersId" integer NOT NULL, "booksId" integer NOT NULL, CONSTRAINT "PK_961956f2dfd99f08f8053cf4950" PRIMARY KEY ("usersId", "booksId"))`, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_e8384931aac8ac91dda9d1f83c" ON "user_books" ("usersId") `, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_feb9d8083aefec5c5cc9208263" ON "user_books" ("booksId") `, undefined);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_9fc134ca20766e165ad650ee740" FOREIGN KEY ("detail_id") REFERENCES "user_details"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "user_roles" ADD CONSTRAINT "FK_99b019339f52c63ae6153587380" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "user_roles" ADD CONSTRAINT "FK_13380e7efec83468d73fc37938e" FOREIGN KEY ("rolesId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "user_books" ADD CONSTRAINT "FK_e8384931aac8ac91dda9d1f83c8" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "user_books" ADD CONSTRAINT "FK_feb9d8083aefec5c5cc9208263c" FOREIGN KEY ("booksId") REFERENCES "books"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_books" DROP CONSTRAINT "FK_feb9d8083aefec5c5cc9208263c"`, undefined);
        await queryRunner.query(`ALTER TABLE "user_books" DROP CONSTRAINT "FK_e8384931aac8ac91dda9d1f83c8"`, undefined);
        await queryRunner.query(`ALTER TABLE "user_roles" DROP CONSTRAINT "FK_13380e7efec83468d73fc37938e"`, undefined);
        await queryRunner.query(`ALTER TABLE "user_roles" DROP CONSTRAINT "FK_99b019339f52c63ae6153587380"`, undefined);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_9fc134ca20766e165ad650ee740"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_feb9d8083aefec5c5cc9208263"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_e8384931aac8ac91dda9d1f83c"`, undefined);
        await queryRunner.query(`DROP TABLE "user_books"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_13380e7efec83468d73fc37938"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_99b019339f52c63ae615358738"`, undefined);
        await queryRunner.query(`DROP TABLE "user_roles"`, undefined);
        await queryRunner.query(`DROP TABLE "books"`, undefined);
        await queryRunner.query(`DROP TABLE "users"`, undefined);
        await queryRunner.query(`DROP TABLE "roles"`, undefined);
        await queryRunner.query(`DROP TABLE "user_details"`, undefined);
    }

}
