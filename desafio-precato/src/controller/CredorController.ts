import { getManager } from "typeorm";

import { Credor } from "../entity/Credor";

export class CredorController {
    async salvar(credor: Credor) {
        const credorSalvo = await getManager().save(credor);
        return credorSalvo;
    }
    // Recuperar todos os credores
    async recuperarTodos() {
        const credores = await getManager().find(Credor);
        return credores;
    }
    // Recuperar credor pelo CPF
    async recuperarCredor(cpf: string) {
        const credor = await getManager().findOne(Credor, { cpfCredor: cpf });
        return credor;
    }
    // Recuperar credor pelo UUID
    async recuperarCredorUUID(id_credor: string) {
        const credor = await getManager().findOne(Credor, id_credor);
        return credor;
    }
    // Deletando um ente credor
    async deletar(id_credor: string) {
        const credor = await getManager().delete(Credor, id_credor);
        return credor;
    }
}
