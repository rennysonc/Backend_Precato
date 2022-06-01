import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    JoinColumn,
    ManyToOne,
} from "typeorm";

import { Credor } from "./Credor";
import { EnteDevedor } from "./EnteDevedor";

@Entity()
export class Pagamento {
    constructor(
        credor: Credor,
        enteDevedor: EnteDevedor,
        valorInicial: number,
        valorFinal: number,
        statusRemessa: string,
        motivo: string
    ) {
        this.credor = credor;
        this.enteDevedor = enteDevedor;
        this.valorInicial = valorInicial;
        this.valorFinal = valorFinal;
        this.statusRemessa = statusRemessa;
        this.motivo = motivo;
    }

    @PrimaryGeneratedColumn("uuid", { name: "identificador_remessa" })
    identificadorRemessa: string;

    @ManyToOne(() => Credor)
    @JoinColumn({ name: "identificador-credor" })
    credor: Credor;

    @ManyToOne(() => EnteDevedor)
    @JoinColumn({ name: "identificador-ente-devedor" })
    enteDevedor: EnteDevedor;

    @Column({ type: "float", name: "valor_inicial" })
    valorInicial: number;

    @Column({ type: "float", name: "valor_final" })
    valorFinal: number;

    @Column({
        type: "timestamp",
        name: "data",
        default: () => "LOCALTIMESTAMP",
    })
    data: string;

    @Column({ name: "status_remessa" })
    statusRemessa: string;

    @Column({ name: "motivo", nullable: true })
    motivo: string;
}
