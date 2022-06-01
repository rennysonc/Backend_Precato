import { IsString, IsNotEmpty, MaxLength, MinLength } from "class-validator";
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class EnteDevedor {
    constructor(nomeEnteDevedor: string, cnpjEnteDevedor: string) {
        this.nomeEnteDevedor = nomeEnteDevedor;
        this.cnpjEnteDevedor = cnpjEnteDevedor;
    }

    @PrimaryGeneratedColumn("uuid", { name: "identificador_ente_devedor" })
    identificadorEnteDevedor: string;

    @Column({ name: "nome_ente_devedor" })
    @IsString({ message: "Nome do ente devedor deve ser uma string!" })
    @IsNotEmpty({ message: "Nome do ente devedor é obrigatório!" })
    nomeEnteDevedor: string;

    @Column({ name: "cnpj_ente_devedor", unique: true })
    @MinLength(14, { message: "CNPJ deve ter 14 digitos!" })
    @MaxLength(14, { message: "CNPJ deve ter 14 digitos!" })
    @IsString({ message: "CNPJ deve ser uma string!" })
    @IsNotEmpty({ message: "CNPJ do ente devedor é obrigatório!" })
    cnpjEnteDevedor: string;
}
