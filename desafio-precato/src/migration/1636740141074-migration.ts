import { MigrationInterface, QueryRunner } from "typeorm";

export class migration1636740141074 implements MigrationInterface {
    name = "migration1636740141074";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "credor" ("identificador_credor" uuid NOT NULL DEFAULT uuid_generate_v4(), "nome_credor" character varying NOT NULL, "cpf_credor" character varying NOT NULL, "status_cadastro" character varying NOT NULL, CONSTRAINT "UQ_350092aaaa1cb1efab345831465" UNIQUE ("cpf_credor"), CONSTRAINT "PK_d14549a24d2352d09bd505b9360" PRIMARY KEY ("identificador_credor"))`
        );

        await queryRunner.query(
            `CREATE TABLE "ente_devedor" ("identificador_ente_devedor" uuid NOT NULL DEFAULT uuid_generate_v4(), "nome_ente_devedor" character varying NOT NULL, "cnpj_ente_devedor" character varying NOT NULL, CONSTRAINT "UQ_34b4ee5c63262064498ad490fda" UNIQUE ("cnpj_ente_devedor"), CONSTRAINT "PK_a8713682d6a0456d9d718b3a24f" PRIMARY KEY ("identificador_ente_devedor"))`
        );

        await queryRunner.query(
            `CREATE TABLE "pagamento" ("identificador_remessa" uuid NOT NULL DEFAULT uuid_generate_v4(), "valor_inicial" double precision NOT NULL, "valor_final" double precision NOT NULL, "data" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp without time zone, "status_remessa" character varying NOT NULL, "motivo" character varying, "identificador-credor" uuid, "identificador-ente-devedor" uuid, CONSTRAINT "REL_2fc02b471463dfc064a42197da" UNIQUE ("identificador-credor"), CONSTRAINT "REL_980f749372d997e91b7f0006b1" UNIQUE ("identificador-ente-devedor"), CONSTRAINT "PK_0ca631934a41f5dedc58d973719" PRIMARY KEY ("identificador_remessa"))`
        );

        await queryRunner.query(
            `ALTER TABLE "pagamento" ADD CONSTRAINT "FK_2fc02b471463dfc064a42197da9" FOREIGN KEY ("identificador-credor") REFERENCES "credor"("identificador_credor") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );

        await queryRunner.query(
            `ALTER TABLE "pagamento" ADD CONSTRAINT "FK_980f749372d997e91b7f0006b16" FOREIGN KEY ("identificador-ente-devedor") REFERENCES "ente_devedor"("identificador_ente_devedor") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "pagamento" DROP CONSTRAINT "FK_980f749372d997e91b7f0006b16"`
        );

        await queryRunner.query(
            `ALTER TABLE "pagamento" DROP CONSTRAINT "FK_2fc02b471463dfc064a42197da9"`
        );

        await queryRunner.query(`DROP TABLE "pagamento"`);

        await queryRunner.query(`DROP TABLE "ente_devedor"`);

        await queryRunner.query(`DROP TABLE "credor"`);
    }
}
