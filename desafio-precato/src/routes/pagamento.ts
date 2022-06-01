import { Router } from "express";

import { CredorController } from "../controller/CredorController";
import { EnteDevedorController } from "../controller/EnteDevedorController";
import { PagamentoController } from "../controller/PagamentoController";
import { Pagamento } from "../entity/Pagamento";

export const routerPagamento = Router();
const pagamentoCtrl = new PagamentoController();
const credorCtrl = new CredorController();
const enteDevedorCtrl = new EnteDevedorController();

// Criar um novo pagamento
routerPagamento.post("/", async (req, res) => {
    const { cpfCredor, cnpjEnteDevedor, valorInicial, valorFinal } = req.body;
    let motivo = "";

    // Procurando pelo credor
    const credor = await credorCtrl.recuperarCredor(cpfCredor);
    // Procurando pelo ente devedor
    const enteDevedor = await enteDevedorCtrl.recuperarEnteDevedor(
        cnpjEnteDevedor
    );
    // Verificação das regras de negócio
    if (!credor) {
        res.status(404).json({ mensagem: "Credor não registrado!" });
    } // 2 - Uma solicitação de pagamento deve sempre haver um ente devedor.
    if (!enteDevedor) {
        res.status(404).json({ mensagem: "Ente devedor não registrado!" });
    } // Verificando se valores iniciais e finais foram informados
    if (!valorFinal || !valorInicial) {
        res.status(400).json({
            mensagem: "Valor inicial ou final não informados!",
        });
    } // Verificando se valores iniciais e finais são de fato números
    if (Number.isNaN(valorInicial) || Number.isNaN(valorFinal)) {
        res.status(400).json({
            mensagem: "Valor inicial ou final devem ser números!",
        });
    }

    // 1 - Uma solicitação só pode ser feita se o cadastro do credor a receber o pagamento estiver aprovado.
    if (credor.statusCadastro === "reprovado") {
        motivo = "Cadastro do credor não foi aprovado!";
    } // 3 - Em uma solicitação de pagamento, o valor inicial e final devem ser sempre maiores do que 0.
    else if (valorInicial <= 0 || valorFinal <= 0) {
        motivo = "Valor inicial ou(e) final não são maiores que zero!";
    } // 4 - Em uma solicitação de pagamento, o valor final deve ser sempre menor que o valor inicial.
    else if (valorFinal >= valorInicial) {
        motivo = "Valor final maior do que o valor inicial!";
    } // 5 - Solicitações de pagamentos para um mesmo credor deve ocorrer apenas
    // se o identificador de remessa for diferente das solicitações já existentes.
    // O identificador de remessa é único, pois é uma chave primária

    let statusRemessa = "aprovado";
    // 6 - Se uma solicitação for identificada como inválida, o motivo que a definiu como inválida deve ser armazenado.
    if (motivo !== "") {
        // Em caso de pagamento reprovado
        statusRemessa = "reprovado";
    }

    // Salvando operação
    const pagamento = new Pagamento(
        credor,
        enteDevedor,
        valorInicial,
        valorFinal,
        statusRemessa,
        motivo
    );
    const pagamentoSalvo = await pagamentoCtrl.salvar(pagamento);
    res.status(201).json(pagamentoSalvo);
});
// Recuperando todos os pagamentos
routerPagamento.get("/", async (req, res) => {
    const pagamentos = await pagamentoCtrl.recuperarTodos();
    res.json(pagamentos);
});
// Recuperando pagamento por UUID
routerPagamento.get("/:pagamento", async (req, res) => {
    const pagamento = await pagamentoCtrl.recuperarPagamentoUUID(
        req.params.pagamento
    );
    if (pagamento) {
        res.json(pagamento);
    } else {
        res.status(404).json({ mensagem: "Pagamento não encontado!" });
    }
});
// Deletar um credor
routerPagamento.delete("/:pagamento", async (req, res) => {
    const pagamento = await pagamentoCtrl.deletar(req.params.pagamento);
    if (pagamento.affected === 0) {
        res.status(404).json({ mensagem: "Pagamento não encontrado!" });
    } else {
        res.json({ mensagem: "Pagamento deletado!" });
    }
});
