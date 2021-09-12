export class WebserviceErro extends Error {
    public codigo: number = 500
    
    constructor (codigo: number, mensagem: string) {
      super(mensagem)
      this.name = 'WebserviceErro'
      this.codigo = codigo
    }
}