import { validate } from "class-validator";
import { Router } from "express";

import { EnteDevedorController } from "../controller/EnteDevedorController";
import { EnteDevedor } from "../entity/EnteDevedor";

export const routerEnteDevedor = Router();
const enteDevedorCtrl = new EnteDevedorController();

// Criando novo ente devedor
routerEnteDevedor.post("/", async (req, res) => {
    const { nomeEnteDevedor, cnpjEnteDevedor } = req.body;
    // Verificando se o CNPJ já foi registrado
    let enteDevedor = await enteDevedorCtrl.recuperarEnteDevedor(
        cnpjEnteDevedor
    );
    if (!enteDevedor) {
        enteDevedor = new EnteDevedor(nomeEnteDevedor, cnpjEnteDevedor);
        // Validações
        const erros = await validate(enteDevedor);

        if (erros.length === 0) {
            const enteDevedorSalvo = await enteDevedorCtrl.salvar(enteDevedor);
            res.status(201).json(enteDevedorSalvo);
        } else {
            res.status(400).json(erros);
        }
    } else {
        res.status(409).json({ mensagem: "CNPJ já cadastrado!" });
    }
});
// Recuperando todos os entes devedores
routerEnteDevedor.get("/", async (req, res) => {
    const entesDevedores = await enteDevedorCtrl.recuperarTodos();
    res.json(entesDevedores);
});
// Recuperar um ente devedor
routerEnteDevedor.get("/:identificadorEnteDevedor", async (req, res) => {
    const enteDevedor = await enteDevedorCtrl.recuperarEnteDevedorUUID(
        req.params.identificadorEnteDevedor
    );
    if (enteDevedor) {
        res.json(enteDevedor);
    } else {
        res.status(404).json({ mensagem: "Ente devedor não encontrado!" });
    }
});
// Atualizar um ente devedor
routerEnteDevedor.patch("/:identificadorEnteDevedor", async (req, res) => {
    const enteDevedor = await enteDevedorCtrl.recuperarEnteDevedorUUID(
        req.params.identificadorEnteDevedor
    );
    if (!enteDevedor) {
        res.status(404).json({ mensagem: "Ente devedor não encontrado!" });
    } else {
        const { nomeEnteDevedor, cnpjEnteDevedor } = req.body;
        // Verificando campos alterados
        enteDevedor.nomeEnteDevedor =
            nomeEnteDevedor || enteDevedor.nomeEnteDevedor;
        enteDevedor.cnpjEnteDevedor =
            cnpjEnteDevedor || enteDevedor.cnpjEnteDevedor;
        // Verificando se o CNPJ já foi registrado
        const enteDevedorAuxiliar = await enteDevedorCtrl.recuperarEnteDevedor(
            enteDevedor.cnpjEnteDevedor
        );
        if (
            enteDevedorAuxiliar &&
            enteDevedorAuxiliar.identificadorEnteDevedor !==
                enteDevedor.identificadorEnteDevedor
        ) {
            res.status(400).json({ mensagem: "CNPJ já cadastrado!" });
        } else {
            // Salvando alterações
            // Validações
            const erros = await validate(enteDevedor);
            if (erros.length === 0) {
                const enteDevedorSalvo = await enteDevedorCtrl.salvar(
                    enteDevedor
                );
                res.status(200).json(enteDevedorSalvo);
            } else {
                res.status(400).json(erros);
            }
        }
    }
});
// Deletar um ente devedor
routerEnteDevedor.delete("/:enteDevedor", async (req, res) => {
    const enteDevedor = await enteDevedorCtrl.deletar(req.params.enteDevedor);
    if (enteDevedor.affected === 0) {
        res.status(404).json({ mensagem: "Ente devedor não encontrado!" });
    } else {
        res.json({ mensagem: "Ente devedor deletado!" });
    }
});
