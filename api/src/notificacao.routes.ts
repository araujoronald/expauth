import { Request, Response, Router } from 'express'
import { AutenticacaoRepositorio } from './repositorios/AutenticacaoRepositorio'
import { UsuarioRepositorio } from './repositorios/UsuarioRepositorio'

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = `+${process.env.TWILIO_NUMBER}`;
const twilioClient = require('twilio')(accountSid, authToken);

const autenticacaoRepos = new AutenticacaoRepositorio()
const usuarioRepos = new UsuarioRepositorio()
const router = Router()


router.get('/auth/notificacao/:turno', async (req: Request, res: Response) => {
  try {
  const turno = req.params.turno

    // consultar os usuários
    const usuarios = await usuarioRepos.listar()

    for (const usuario of usuarios) {
      const ultimaAutenticacao = await autenticacaoRepos.ultimaAutenticacao(usuario.id)
      const autenticacoesPendentes = await autenticacaoRepos.buscar(usuario.id, turno, true)
      if(autenticacoesPendentes && autenticacoesPendentes.length > 0){
        let randomElement = autenticacoesPendentes[Math.floor(Math.random() * autenticacoesPendentes.length)];
        if(ultimaAutenticacao && randomElement.tipo == ultimaAutenticacao.tipo){
          randomElement = autenticacoesPendentes[Math.floor(Math.random() * autenticacoesPendentes.length)];
        }

        let linkAcesso = process.env.LINK_ACESSO
        linkAcesso = linkAcesso.replace(":link", randomElement.codigo_link)

        //enviar o SMS
        console.log(`Usuário: ${usuario.nome} | Autenticação: ${linkAcesso} - ${randomElement.tipo} - ${randomElement.pendente}`);
        
        twilioClient.messages.create({
            body: `Olá ${usuario.nome}, aqui está o link para o experimento de autenticação uAUTH: ${linkAcesso}`,
            messagingServiceSid: 'MGefc432236437f8d2eef4fac2fa2d4800',
            to: `+55${usuario.celular}`
          }).then(message => console.log('Notificação enviada: ' + message.sid)).done();
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


export { router as notificacaoRoutes }
