import { Request, Response, Router } from 'express'
import { AutenticacaoRepositorio } from './repositorios/AutenticacaoRepositorio'
import { UsuarioModelo } from './repositorios/sequelize/model/UsuarioModelo'
import { UsuarioRepositorio } from './repositorios/UsuarioRepositorio'
import { WebserviceErro } from './WebserviceErro'
import { v4 } from 'uuid'
import { AutenticacaoModelo } from './repositorios/sequelize/model/AutenticacaoModelo'
var randomstring = require("randomstring");

const autenticacaoRepos = new AutenticacaoRepositorio()
const usuarioRepos = new UsuarioRepositorio()
const router = Router()

router.post("/auth/usuario/config", async (req: Request, res: Response) => {
  try {
    // verifica se o header tem a chave de autenticação
    const token = req.headers.authorization
    if(token != process.env.TOKEN_API){
      throw new WebserviceErro(401, 'Chave de acesso inválida')
    }

    // criar usuario
    const bodyUsuario = req.body.usuario
    let usuario: UsuarioModelo = new UsuarioModelo()
    usuario.id = v4()
    usuario.nome = bodyUsuario.nome
    usuario.cpf = bodyUsuario.cpf
    usuario.celular = bodyUsuario.celular
    usuario.area_atuacao = bodyUsuario.area_atuacao
    usuario.inicializado = false
    usuario.notificado = false
    await usuarioRepos.salvar(usuario)

    //criar autenticacoes
    const tiposAutenticacao: string[] = bodyUsuario.autenticacoes.tipos
    const qtdAuth: Number = Number(bodyUsuario.autenticacoes.quantidade)

    const turnos = ['MANHA', 'TARDE']
    let t = 0
    
    for (const tipo of tiposAutenticacao) {
    
      for (let i= 0; i < qtdAuth; i++) {
        let novoCodigo = false
        let codigoLink = null
        while(!novoCodigo){
          codigoLink = randomstring.generate(6)
          const retorno = await autenticacaoRepos.buscarPorCodigoLink(codigoLink)
          if(retorno == null){
            novoCodigo = true
          }
        }
        let autenticacao = new AutenticacaoModelo()
        autenticacao.id = v4()
        autenticacao.id_usuario = usuario.id
        autenticacao.tipo = tipo
        autenticacao.pendente = true
        autenticacao.codigo_link = codigoLink 
        autenticacao.turno_preferencial = turnos[t]

        t++
        if(t >= turnos.length){
          t=0
        }

        await autenticacaoRepos.salvar(autenticacao)
      }
      
    }

    return res.status(204).send()
    
  } catch (error) {
    const erro: string = error.name;
    switch (erro) {
      case "WebserviceErro":
        return res.status(error.codigo).send(error.message)
      default:
        console.log(error);
        return res.status(500).send('Ocorreu uma falha ao executar a operação')
    }
  }
})

export { router as configRoutes }
