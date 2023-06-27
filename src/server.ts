import dotenv from "dotenv";
//Configurando todas as variaveis de ambiente
dotenv.config();

import redisClient from "./redis/redis";
import express from "express";
//Importando o arquivo principal das rotas
import routes from "./app/routes/routes";

const server = express();
//Permite converter o dado que vem em json
server.use(express.json());
server.use(routes);

const port = process.env.PORT || 3000;
server.listen(port, async () => {
    await redisClient.connect();
    console.log(`--Servidor rodando na porta ${port}, acess: http://localhost:${port}/`);
});