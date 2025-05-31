import {MigrationInterface, QueryRunner} from 'typeorm';

export class $npmConfigName1748680665936 implements MigrationInterface {
  name = ' $npmConfigName1748680665936';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."task_status_enum" AS ENUM('TODO', 'IN_PROGRESS', 'COMPLETED')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."task_priority_enum" AS ENUM('LOW', 'MEDIUM', 'HIGH')`,
    );
    await queryRunner.query(
      `CREATE TABLE "task" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" text NOT NULL, "status" "public"."task_status_enum" NOT NULL DEFAULT 'TODO', "priority" "public"."task_priority_enum" NOT NULL DEFAULT 'MEDIUM', "dueDate" TIMESTAMP, "completedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "assignedToId" uuid NOT NULL, "createdById" uuid NOT NULL, CONSTRAINT "PK_fb213f79ee45060ba925ecd576e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "task" ADD CONSTRAINT "FK_fd5f652e2fcdc4a5ab30aaff7a7" FOREIGN KEY ("assignedToId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "task" ADD CONSTRAINT "FK_91d76dd2ae372b9b7dfb6bf3fd2" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "task" DROP CONSTRAINT "FK_91d76dd2ae372b9b7dfb6bf3fd2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task" DROP CONSTRAINT "FK_fd5f652e2fcdc4a5ab30aaff7a7"`,
    );
    await queryRunner.query(`DROP TABLE "task"`);
    await queryRunner.query(`DROP TYPE "public"."task_priority_enum"`);
    await queryRunner.query(`DROP TYPE "public"."task_status_enum"`);
  }
}
