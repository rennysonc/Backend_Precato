import { validate } from "class-validator";
import { Router } from "express";

import { CredorController } from "../controller/CredorController";
import { Credor } from "../entity/Credor";

export const routerCredor = Router();
const credorCtrl = new CredorController();

routerCredor.post("/", async (req, res) => {
    const { nomeCredor, cpfCredor, statusCadastro } = req.body;
    // Verificando se o CPF já foi registrado
    let credor = await credorCtrl.recuperarCredor(cpfCredor);
    if (!credor) {
        credor = new Credor(nomeCredor, cpfCredor, statusCadastro);
        // Validações
        const erros = await validate(credor);

        if (erros.length === 0) {
            const credorSalvo = await credorCtrl.salvar(credor);
            res.status(201).json(credorSalvo);
        } else {
            res.status(400).json(erros);
        }
    } else {
        res.status(409).json({ mensagem: "CPF já cadastrado!" });
    }
});
// Recuperando todos os credores
routerCredor.get("/", async (req, res) => {
    const credores = await credorCtrl.recuperarTodos();
    res.json(credores);
});
// Recuperar um credor pelo UUID
routerCredor.get("/:identificadorCredor", async (req, res) => {
    const credor = await credorCtrl.recuperarCredorUUID(
        req.params.identificadorCredor
    );
    if (credor) {
        res.json(credor);
    } else {
        res.status(404).json({ mensagem: "Credor não encontrado!" });
    }
});
// Atualizar um credor
routerCredor.patch("/:identificadorCredor", async (req, res) => {
    const credor = await credorCtrl.recuperarCredorUUID(
        req.params.identificadorCredor
    );
    if (!credor) {
        res.status(404).json({ mensagem: "Credor não encontrado!" });
    } else {
        const { nomeCredor, cpfCredor, statusCadastro } = req.body;
        // Verificando campos alterados
        credor.nomeCredor = nomeCredor || credor.nomeCredor;
        credor.cpfCredor = cpfCredor || credor.cpfCredor;
        credor.statusCadastro = statusCadastro || credor.statusCadastro;
        // Verificando se o CPF já foi registrado
        const credorAuxiliar = await credorCtrl.recuperarCredor(
            credor.cpfCredor
        );
        if (
            credorAuxiliar &&
            credorAuxiliar.identificadorCredor !== credor.identificadorCredor
        ) {
            res.status(409).json({ mensagem: "CPF já cadastrado!" });
        } else {
            // Salvando alterações
            // Validações
            const erros = await validate(credor);
            if (erros.length === 0) {
                const credorSalvo = await credorCtrl.salvar(credor);
                res.status(200).json(credorSalvo);
            } else {
                res.status(400).json(erros);
            }
        }
    }
});
// Deletar um ente devedor
routerCredor.delete("/:credor", async (req, res) => {
    const credor = await credorCtrl.deletar(req.params.credor);
    if (credor.affected === 0) {
        res.status(404).json({ mensagem: "Credor não encontrado!" });
    } else {
        res.json({ mensagem: "Credor deletado!" });
    }
});
