import puppeteer, { launch } from "puppeteer";
import { IPartida } from "../interfaces/partida";
import redisClient from "../../redis/redis";

export class Partida{
    link: string = "https://ge.globo.com/agenda/#/todos/";

    constructor(){}
    
    //@TODO: Fazer de outros campeonatos, no momento só busco do brasileiro
    async getAMatch(data?: string): Promise<any>{
        this.proximoHorario(23);
        const partidas = await redisClient.get("partidas")
        if(partidas) return JSON.parse(partidas);

        let browser = await launch({
            headless: 'new',
            args: [
                "--disable-setuid-sandbox",
                "--no-sandbox",
                "--single-process",
                "--no-zygote"
            ],
            executablePath: process.env.NODE_ENV == "production" ? process.env.PUPPETEER_EXECUTABLE_PATH : puppeteer.executablePath()
        });
        let page = await browser.newPage();
        //await page.setViewport({ width: 3840, height: 2160});
        await page.goto(this.link, {
            waitUntil: "load",
            timeout: 0
        });

        //Tira um print da pagina
        //await page.screenshot({path: "screenshot_page.png"});

        let pageContent: any = await page.evaluate(() => {
            //Expande todas as partidas da pagina
            let buttons = [...document.querySelectorAll(".bUoAfX")]
            buttons.forEach((el: any) => {
                el.click();
            });
            let divs = [...document.querySelectorAll(".feqhES")];
            
            //Retorna um array contendo em cada posicao o campeonato e as partidas do mesmo
            return divs.map((el: any) => {
                let campeonato = el.querySelector(".fndQTL").innerText;
                let divsChamps = [...el.querySelectorAll(".dKTUvJ")];
                let partidas =  divsChamps.map((el: any) => {
                    return{
                        campeonato: campeonato,
                        momento: el.querySelector(".bRoxNA").innerText,
                        hora: el.querySelector(".kkQFQb").innerText,
                        mandante: el.querySelectorAll(".kXBLsZ")[0].innerText,
                        visitante: el.querySelectorAll(".kXBLsZ")[1].innerText,
                        placar_mandante: el.querySelectorAll(".eqJVIF")[0]?.innerText,
                        placar_visitante: el.querySelectorAll(".eqJVIF")[1]?.innerText
                    }
                });
                return {
                    campeonato: campeonato,
                    partidas: partidas
                };
            });
        });
        await browser.close();
        await redisClient.set("partidas", JSON.stringify(pageContent), {EXAT: this.proximoHorario(12)});
        return pageContent;
    }

    //Recebe um inteiro representando a hora do dia => 00 ~ 23
    private proximoHorario(hora: number): number{
        let now = new Date();
        let proximaHora = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hora, 0, 0);
        if(proximaHora < now) proximaHora.setDate(proximaHora.getDate() + 1);
        const expirationTime = Math.floor(proximaHora.getTime() / 1000);
        return expirationTime;
    }
}