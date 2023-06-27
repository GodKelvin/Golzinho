import { launch } from "puppeteer";
import { IPartida } from "../interfaces/partida";

export class Partida{
    link: string = "https://ge.globo.com/agenda/#/";

    constructor(){}
    
    //@TODO: Fazer de outros campeonatos, no momento só busco do brasileiro
    async getAMatch(): Promise<any>{
        let browser = await launch();
        let page = await browser.newPage();
        await page.goto(this.link, {
            waitUntil: "load",
            timeout: 0
        });
        await page.screenshot({path: "screenshot_page.png"});

        let pageContent: any = await page.evaluate(() => {
            function cleanDiv(div: any, classCSS: String): string{
                return div.querySelector(classCSS)?.innerText;
            }
            //GroupByChampionshipsstyle__GroupBychampionshipsWrapper-sc-132ht2b-0 feqhES
            //querySelectorAll(".dKTUvJ")
            //fndQTL
            let divs = [...document.querySelectorAll(".feqhES")];

            return divs.map((el: any) => {
                let campeonato = el.querySelector(".fndQTL").innerText;
                let divsChamps = [...el.querySelectorAll(".dKTUvJ")];
                return divsChamps.map((el: any) => {
                    return{
                        campeonato: campeonato,
                        momento: el.querySelector(".bRoxNA").innerText,
                        hora: el.querySelector(".kkQFQb").innerText,
                        mandante: el.querySelectorAll(".kXBLsZ")[0].innerText,
                        visitante: el.querySelectorAll(".kXBLsZ")[1].innerText,
                        placar_mandante: el.querySelectorAll(".eqJVIF")[0]?.innerText,
                        placar_vistante: el.querySelectorAll(".eqJVIF")[1]?.innerText
                    }
                });
            });
        });
        return pageContent;
    }
}