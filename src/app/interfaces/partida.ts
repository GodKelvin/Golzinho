export interface IPartida
{
    campeonato: string;
    hora: Date
    //Rodada, quartas de final, final
    momento: string; 
    mandante: string;
    visitante: string;
    placar_mandante?: number;
    placar_visitante?: number;
}