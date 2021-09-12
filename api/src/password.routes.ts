import { compare, hash } from 'bcrypt'
import { Request, Response, Router } from 'express'
import { AutenticacaoRepositorio } from './repositorios/AutenticacaoRepositorio'
import { UsuarioRepositorio } from './repositorios/UsuarioRepositorio'
import { verificarNuloOuVazio } from './Util'

const usuarioRepos = new UsuarioRepositorio()
const autenticacaoRepos = new AutenticacaoRepositorio()
const router = Router()


router.put("/auth/config/password/:idUsuario/:idAutenticacao", async (req: Request, res: Response) => {
  try {
    const idUsuario = req.params.idUsuario
    const idAutenticacao = req.params.idAutenticacao
    
    verificarNuloOuVazio('ID Usuario', idUsuario)
    verificarNuloOuVazio('ID Autenticação', idAutenticacao)
    verificarNuloOuVazio('Senha', req.body.password)
    
    const hashSenha = await hash(req.body.password, 10)
    usuarioRepos.atualizarSenha(idUsuario, hashSenha)

    await autenticacaoRepos.incrementaRecuperacaoCredencial(idAutenticacao)
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

router.put("/auth/password/:idUsuario/:idAutenticacao", async (req: Request, res: Response) => {
  try {
    const idUsuario = req.params.idUsuario
    const idAutenticacao = req.params.idAutenticacao
    const cpf = req.body.cpf
    const senha = req.body.senha
    verificarNuloOuVazio('ID Usuario', idUsuario)
    verificarNuloOuVazio('ID Autenticação', idAutenticacao)
    verificarNuloOuVazio('CPF', cpf)
    verificarNuloOuVazio('Senha', senha)
  
    const usuario = await usuarioRepos.buscarPorIdCPF(idUsuario, cpf)
    if(!usuario){
      return res.status(401).send('Usuário ou senha inválidos')
    }
  
    const result = await compare(senha, usuario.senha)
    if(!result){
      await autenticacaoRepos.incrementaFalhaCredencial(idAutenticacao)
      return res.status(401).send('Usuário ou senha inválidos')
    }
  
    return res.status(200).send({
      idUsuario: usuario.id,
      nome: usuario.nome
    })
    
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

export { router as passwordRoutes }
