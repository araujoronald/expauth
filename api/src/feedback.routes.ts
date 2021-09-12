import { Request, Response, Router } from 'express'
import { AutenticacaoRepositorio } from './repositorios/AutenticacaoRepositorio'
import { UsuarioRepositorio } from './repositorios/UsuarioRepositorio'
import { verificarNuloOuVazio } from './Util'

const autenticacaoRepos = new AutenticacaoRepositorio()
const usuarioRepos = new UsuarioRepositorio()
const router = Router()

router.put("/auth/feedback/:idAutenticacao", async (req: Request, res: Response) => {
  try {
    const idAutenticacao = req.params.idAutenticacao
    const avaliacao = req.body.avaliacao
    const avaliacaoSeguranca = req.body.avaliacaoSeguranca
    const avaliacaoPrivacidade = req.body.avaliacaoPrivacidade
    const duracao = req.body.duracao

    verificarNuloOuVazio('Avaliação Experiência de uso', avaliacao)
    verificarNuloOuVazio('Avaliação Segurança', avaliacaoSeguranca)
    verificarNuloOuVazio('Avaliação Privacidade', avaliacaoPrivacidade)
    verificarNuloOuVazio('Duração', duracao)

    const autenticacao = autenticacaoRepos.buscarPorId(idAutenticacao)
    if(!autenticacao){
      throw new Error('Autenticação não encontrada')
    }

    autenticacaoRepos.registrar(idAutenticacao, avaliacao, avaliacaoSeguranca, avaliacaoPrivacidade, duracao)
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

export { router as feedbackRoutes }
