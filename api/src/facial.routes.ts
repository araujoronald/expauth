import { Request, Response, Router } from 'express'
import { UsuarioRepositorio } from './repositorios/UsuarioRepositorio'
import { verificarNuloOuVazio } from './Util'

const usuarioRepos = new UsuarioRepositorio()
const router = Router()


router.put("/auth/facial/:idUsuario", async (req: Request, res: Response) => {
  try {
    const idUsuario = req.params.idUsuario
    verificarNuloOuVazio('ID Usuario', idUsuario)

    const cpf = req.body.cpf
    verificarNuloOuVazio('CPF', cpf)

    const usuario = await usuarioRepos.buscarPorIdCPF(idUsuario, cpf)
    if(!usuario){
      return res.status(500).send('Usuário Inválido')
    }
    //Math.random() < 0.7;
  
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


export { router as facialRoutes }
