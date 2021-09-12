import { WebserviceErro } from "./WebserviceErro";

export function verificarNuloOuVazio(nome: string, valor: string){
    if(!valor || (typeof valor === 'string' && !valor.trim())){
        throw new WebserviceErro(422, `O campo ${nome} está vazio ou não foi informado`)
    }
}
