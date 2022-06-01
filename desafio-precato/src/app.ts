import * as cors from "cors";
import * as express from "express";
import * as logger from "morgan";

import { connectServerDB } from "./config/db";
import { routerCredor } from "./routes/credor";
import { routerEnteDevedor } from "./routes/ente-devedor";
import { routerPagamento } from "./routes/pagamento";

import * as swaggerDocs from "./swagger.json"

/* Criando a aplicação */
export const app = express();
const swaggerUi = require('swagger-ui-express');
// Liberando acesso a serviços
app.use(cors());

// Permite enviar ou receber JSON
app.use(express.json());

// Configuração de logs
app.use(logger("dev"));

// Conectar ao BD
connectServerDB();
// Configuração de rotas
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use("/credor", routerCredor);
app.use("/ente-devedor", routerEnteDevedor);
app.use("/pagamento", routerPagamento);
app.use("/", (req, res) => res.send("API do teste prático backend Precato"));
