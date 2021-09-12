import { AutenticacaoModelo } from "./sequelize/model/AutenticacaoModelo"

export class AutenticacaoRepositorio {

    async salvar(autenticacaoModelo: AutenticacaoModelo): Promise<AutenticacaoModelo>{
        return await autenticacaoModelo.save()
    }

    async buscarPorId(id: string): Promise<AutenticacaoModelo>{
        const autenticacaoModelo = await AutenticacaoModelo.findByPk(id)
        return autenticacaoModelo
    }
    
    async buscar(id_usuario: string, turno_preferencial: string, pendente: boolean): Promise<AutenticacaoModelo[]>{
        const autenticacaoModelo = await AutenticacaoModelo.findAll({ 
            where: { 
                id_usuario,
                turno_preferencial,
                pendente
            } 
        })
        
        return autenticacaoModelo
    }

    async ultimaAutenticacao(id_usuario: string): Promise<AutenticacaoModelo>{
        return await AutenticacaoModelo.findOne({
            where: { 
                id_usuario, 
                pendente: false 
            },
            order: [
                ['data', 'DESC'],
            ]
        })
    }

    async buscarPorTipo(tipo: string, pendente: boolean): Promise<AutenticacaoModelo[]>{
        const autenticacaoModelo = await AutenticacaoModelo.findAll({ 
            where: { 
                tipo,
                pendente
            } 
        })
        
        return autenticacaoModelo
    }

    async buscarPorCodigoLink(codigoLink: string): Promise<AutenticacaoModelo>{
        const autenticacaoModelo = await AutenticacaoModelo.findOne({ 
            where: { 
                codigo_link: codigoLink
            } 
        })
        
        return autenticacaoModelo
    }

    async registrar(id: string, avaliacao: number, avaliacaoSeguranca: number, avaliacaoPrivacidade: number, duracao: number): Promise<void> {
        let autenticacaoModelo: AutenticacaoModelo = await AutenticacaoModelo.findByPk(id)
        if(!autenticacaoModelo){
            throw new Error('Autenticação inválida');
        }

        autenticacaoModelo.avaliacao = avaliacao
        autenticacaoModelo.avaliacao_seguranca = avaliacaoSeguranca
        autenticacaoModelo.avaliacao_privacidade = avaliacaoPrivacidade
        autenticacaoModelo.duracao = String(duracao)
        autenticacaoModelo.data = new Date()
        autenticacaoModelo.pendente = false
        await autenticacaoModelo.save({fields: ['avaliacao', 'avaliacao_seguranca', 'avaliacao_privacidade', 'duracao', 'data', 'pendente']})
    }

    async incrementaFalhaCredencial(id: string): Promise<void> {
        let autenticacaoModelo: AutenticacaoModelo = await AutenticacaoModelo.findByPk(id)
        if(!autenticacaoModelo){
            throw new Error('Autenticação inválida');
        }

        autenticacaoModelo.qtd_falha_credencial = autenticacaoModelo.qtd_falha_credencial + 1
        await autenticacaoModelo.save({fields: ['qtd_falha_credencial']})
    }

    async incrementaRecuperacaoCredencial(id: string): Promise<void> {
        let autenticacaoModelo: AutenticacaoModelo = await AutenticacaoModelo.findByPk(id)
        if(!autenticacaoModelo){
            throw new Error('Autenticação inválida');
        }

        autenticacaoModelo.qtd_recuperacao_credencial = autenticacaoModelo.qtd_recuperacao_credencial + 1
        await autenticacaoModelo.save({fields: ['qtd_recuperacao_credencial']})
    }

    toDTO(modelo: AutenticacaoModelo): any{
        return {
            id: modelo.id,
            tipo: modelo.tipo,
            codigo_link: modelo.codigo_link,
            pendente: modelo.pendente
        }
    }

}