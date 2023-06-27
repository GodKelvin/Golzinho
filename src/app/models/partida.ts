import puppeteer, { launch } from "puppeteer";
import { IPartida } from "../interfaces/partida";

export class Partida{
    link: string = "https://ge.globo.com/agenda/#/todos/27-06-2023";

    constructor(){}
    
    //@TODO: Fazer de outros campeonatos, no momento só busco do brasileiro
    async getAMatch(): Promise<any>{
        let browser = await launch({
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
        return pageContent;
    }
}