export function dateIsValid(dateString: string): boolean{
    const regex = /^\d{2}-\d{2}-\d{4}$/;
    return regex.test(dateString);
}

//Retorna a data de hoje no formato "dd-mm-ano"
export function dateToday(): string{
    const data = new Date();
    let dataFormatada = data.toLocaleDateString('pt-BR', {day: "2-digit", month: "2-digit", year: "numeric"}).split("/").join("-");
    return dataFormatada;
}
