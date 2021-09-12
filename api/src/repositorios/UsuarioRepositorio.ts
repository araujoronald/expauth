import { UsuarioModelo } from "./sequelize/model/UsuarioModelo";
const sequelize = require('./sequelize/index')

export class UsuarioRepositorio {

    async salvar(usuarioModelo: UsuarioModelo): Promise<UsuarioModelo> {
        return await usuarioModelo.save()
    }
    
    async atualizarSenha(id: string, senha: string): Promise<void> {
        let usuarioModelo: UsuarioModelo = await UsuarioModelo.findByPk(id)
        usuarioModelo.senha = senha
        await usuarioModelo.save({fields: ['senha']})
    }

    async inicializarUsuario(id: string): Promise<void> {
        let usuarioModelo: UsuarioModelo = await UsuarioModelo.findByPk(id)
        usuarioModelo.inicializado = true
        await usuarioModelo.save({fields: ['inicializado']})
    }

    async registrarNotificacaoUsuario(id: string): Promise<void> {
        let usuarioModelo: UsuarioModelo = await UsuarioModelo.findByPk(id)
        usuarioModelo.notificado = true
        await usuarioModelo.save({fields: ['notificado']})
    }

    async buscarPorId(id: string): Promise<UsuarioModelo>{
        const usuarioModelo: UsuarioModelo = await UsuarioModelo.findByPk(id)
        return usuarioModelo
    }

    async buscarPorCpf(cpf: string): Promise<UsuarioModelo>{
        const usuarioModelo = await UsuarioModelo.findOne({ 
            where: { cpf } 
        })
        return usuarioModelo
    }

    async buscarPorIdCPF(id: string, cpf: string): Promise<UsuarioModelo>{
        const usuarioModelo = await UsuarioModelo.findOne({ 
            where: { id, cpf } 
        })
        return usuarioModelo
    }

    async listar(): Promise<UsuarioModelo[]>{
        return await UsuarioModelo.findAll()
    }

    async listarNaoNotificados(): Promise<UsuarioModelo[]>{
        return await UsuarioModelo.findAll({where: {notificado: false}})
    }
}