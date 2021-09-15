import { Request, Response, Router } from 'express'
import { AutenticacaoRepositorio } from './repositorios/AutenticacaoRepositorio'
import { UsuarioRepositorio } from './repositorios/UsuarioRepositorio'
import { verificarNuloOuVazio } from './Util'

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = `+${process.env.TWILIO_NUMBER}`;
const twilioClient = require('twilio')(accountSid, authToken);

const autenticacaoRepos = new AutenticacaoRepositorio()
const usuarioRepos = new UsuarioRepositorio()
const router = Router()

router.get('/auth/hello', (req: Request, res: Response) => {
  return res.status(200).send([{ "message": "Olá! Este é um experimento de autenticação!" }])
})

router.get('/auth/info/:codLink', async (req: Request, res: Response) => {
  try {
    const codigoLink = req.params.codLink
    const autenticacao = await autenticacaoRepos.buscarPorCodigoLink(codigoLink)
    const usuario = await usuarioRepos.buscarPorId(autenticacao.id_usuario)
    if(!usuario){
      return res.status(500).send('Usuário Inválido')
    }
    return res.status(200).send({
      autenticacao: autenticacaoRepos.toDTO(autenticacao),
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        inicializado: usuario.inicializado,
        senhaDefinida: usuario.senha? true : false
      }
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

router.put("/auth/usuario/inicializar/:idUsuario", async (req: Request, res: Response) => {
  try {
    const idUsuario = req.params.idUsuario
    verificarNuloOuVazio('ID Usuario', idUsuario)
    usuarioRepos.inicializarUsuario(idUsuario)
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

router.put("/auth/usuario/notificar", async (req: Request, res: Response) => {
  try {
    
    const usuarios = await usuarioRepos.listarNaoNotificados()
    for (const usuario of usuarios) {
      try {
        twilioClient.messages.create({
          body: `Olá ${usuario.nome}, amanhã iniciaremos o nosso experimento e você receberá instruções via SMS. Conto com sua participação. Abraço! Ronald Araujo.`,
          messagingServiceSid: 'MGefc432236437f8d2eef4fac2fa2d4800',
          to: `+55${usuario.celular}`
        }).then(message => console.log(`Notificação inicial enviada: ${message.sid}. Usuário: ${usuario.nome} - Celular: ${usuario.celular}`)).done();
        usuarioRepos.registrarNotificacaoUsuario(usuario.id)

      } catch (error) {
        console.log(`Ocorreu uma falha ao notificar o usuário ${usuario.nome} - Celular: ${usuario.celular}`);  
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

export { router as infoRoutes }
