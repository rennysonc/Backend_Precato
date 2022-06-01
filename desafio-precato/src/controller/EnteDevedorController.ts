import { getManager } from "typeorm";

import { EnteDevedor } from "../entity/EnteDevedor";

export class EnteDevedorController {
    async salvar(enteDevedor: EnteDevedor) {
        const enteDevedorSalvo = await getManager().save(enteDevedor);
        return enteDevedorSalvo;
    }

    async recuperarTodos() {
        const enteDevedores = await getManager().find(EnteDevedor);
        return enteDevedores;
    }
    // Recuperar ente devedor pelo CPF
    async recuperarEnteDevedor(cnpj: string) {
        const enteDevedor = await getManager().findOne(EnteDevedor, {
            cnpjEnteDevedor: cnpj,
        });
        return enteDevedor;
    }
    // Recuperar ente devedor pelo UUID
    async recuperarEnteDevedorUUID(id_ente_devedor: string) {
        const enteDevedor = await getManager().findOne(
            EnteDevedor,
            id_ente_devedor
        );
        return enteDevedor;
    }
    // Deletando um ente devedor
    async deletar(id_ente_devedor: string) {
        const enteDevedor = await getManager().delete(
            EnteDevedor,
            id_ente_devedor
        );
        return enteDevedor;
    }
}
