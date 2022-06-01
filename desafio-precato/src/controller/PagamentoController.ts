import { getManager } from "typeorm";

import { Pagamento } from "../entity/Pagamento";

export class PagamentoController {
    async salvar(pagamento: Pagamento) {
        const pagamentoSalvo = await getManager().save(pagamento);
        return pagamentoSalvo;
    }
    // Recuperando todos os pagamentos
    async recuperarTodos() {
        const pagamentos = await getManager().find(Pagamento);
        return pagamentos;
    }
    // Recuperando um pagamento por UUID
    async recuperarPagamentoUUID(id_pagamento: string) {
        const pagamento = await getManager().findOne(Pagamento, id_pagamento);
        return pagamento;
    }
    // Deletando um pagamento
    async deletar(id_pagamento: string) {
        const pagamento = await getManager().delete(Pagamento, id_pagamento);
        return pagamento;
    }
}
