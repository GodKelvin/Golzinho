import { Request, Response, Router } from "express";
import { Partida } from "../models/partida";
const partidaRouter = Router();

partidaRouter.get("/", async(req: Request, res: Response): Promise<any> => {
    try{
        const partida = new Partida();
        let partidas = await partida.getAMatch();
        console.log(partidas);
        return res.status(200).json(partidas);
    }catch(error){
        return res.status(500).json(`Internal Server Error => ${error}`);
    }
});

export default partidaRouter;