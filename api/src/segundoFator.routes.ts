import { compare } from 'bcrypt'
import { Request, Response, Router } from 'express'
import { AutenticacaoRepositorio } from './repositorios/AutenticacaoRepositorio'
import { UsuarioRepositorio } from './repositorios/UsuarioRepositorio'
import { OTPServico } from './servicos/OTPServico'
import { verificarNuloOuVazio } from './Util'

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = `+${process.env.TWILIO_NUMBER}`;
const twilioClient = require('twilio')(accountSid, authToken);

const usuarioRepos = new UsuarioRepositorio()
const autenticacaoRepos = new AutenticacaoRepositorio()
const otpServico = new OTPServico()
const router = Router()


router.put("/auth/2fa/password/:idUsuario/:idAutenticacao", async (req: Request, res: Response) => {
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
  
    // gerar otp
    const otp = otpServico.gerarOTP(usuario.id)
    console.log(`Código de Acesso gerado: ${otp}`);

    twilioClient.messages.create({
      body: `${otp} é o seu código de acesso. Experimento uAUTH`,
      messagingServiceSid: 'MGefc432236437f8d2eef4fac2fa2d4800',
      to: `+55${usuario.celular}`
    }).then(message => console.log('Código de acesso enviado: ' + message.sid)).done();
    
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

router.put("/auth/2fa/otp/:idUsuario/:idAutenticacao", async (req: Request, res: Response) => {
  try {
    const idUsuario = req.params.idUsuario
    const idAutenticacao = req.params.idAutenticacao
    const otpInformado = req.body.otp
  
    try {
      verificarNuloOuVazio('ID Autenticação', idAutenticacao)
      verificarNuloOuVazio('ID Usuario', idUsuario)
      verificarNuloOuVazio('Código de Acesso', otpInformado)
    } catch (error) {
      return res.status(error.codigo).send(error.message)
    }
  
    const usuario = await usuarioRepos.buscarPorId(idUsuario)
    if(!usuario){
      return res.status(500).send('Usuário Inválido')
    }
    
    const result = otpServico.verificarOTP(otpInformado, usuario.id)
    if(!result){
      await autenticacaoRepos.incrementaFalhaCredencial(idAutenticacao)
      return res.status(401).send('Código de acesso inválido ou expirado')
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


export { router as segundoFatorRoutes }
