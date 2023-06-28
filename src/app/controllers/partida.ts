import { Request, Response, Router } from "express";
import { Partida } from "../models/partida";
import { dateIsValid, dateToday } from "../utils/date";
const partidaRouter = Router();

partidaRouter.get("/", async(req: Request, res: Response): Promise<any> => {
    try{
        let date = String(req.query["data"]);
        if(!dateIsValid(date)) date = dateToday();
        const partida = new Partida();
        let partidas = await partida.getAMatch(date);
        return res.status(200).json(partidas);
    }catch(error){
        return res.status(500).json(`Internal Server Error => ${error}`);
    }
});
export default partidaRouter;