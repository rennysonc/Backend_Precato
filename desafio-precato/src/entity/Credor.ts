import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Credor {
    constructor(nomeCredor: string, cpfCredor: string, statusCadastro: string) {
        this.nomeCredor = nomeCredor;

        this.cpfCredor = cpfCredor;

        this.statusCadastro = statusCadastro;
    }

    @PrimaryGeneratedColumn("uuid", { name: "identificador_credor" })
    identificadorCredor: string;

    @Column({ name: "nome_credor" })
    @IsString({ message: "Nome do credor deve ser uma string!" })
    @IsNotEmpty({ message: "Nome do credor é obrigatório!" })
    nomeCredor: string;

    @Column({ name: "cpf_credor", unique: true })
    @MinLength(11, { message: "CPF deve ter 11 digitos" })
    @MaxLength(11, { message: "CPF deve ter 11 digitos" })
    @IsString({ message: "CPF deve ser um número!" })
    cpfCredor: string;

    @Column({ name: "status_cadastro" })
    @IsString({ message: "Status de cadastro do credor deve ser uma string!" })
    @IsNotEmpty({ message: "Status de cadastro do credor é obrigatório!" })
    statusCadastro: string;
}
