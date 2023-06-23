
import express, { Request, Response } from 'express';
//import indexRoutes from './routes/indexRoutes';
import dotenv from 'dotenv';
//import cron from 'node-cron';

//Carregando variaveis de ambiente
dotenv.config();

const server = express();
//server.use(indexRoutes);

server.get('/', async(_req: Request, res: Response) => {
    res.status(200).json({"Feito por: Kelvin Lehrback":"-> https://github.com/GodKelvin"});
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Servidor running on port ${port}, acess: http://localhost:${port}/`);
});