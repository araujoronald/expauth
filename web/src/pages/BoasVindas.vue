<template>
  <div class="container-md">
      <div class="row align-items-center">
          <div class="col m-3 text-start" v-if="this.info.autenticacao && !this.info.autenticacao.pendente">
            <h6>Olá {{this.info.usuario.nome}},</h6>
            <p></p>
            <p>
                Você já respondeu este link anteriormente. 
            </p>
            <p>
                Muito obrigado pela sua contribuição.  
            </p>
          </div>
          <div class="col m-3 text-start" v-if="this.info.autenticacao && this.info.autenticacao.pendente && this.info.usuario && !this.info.usuario.inicializado">
            <h6>Olá {{this.info.usuario.nome}},</h6>
            <p>
            este experimento faz parte do trabalho de conclusão do curso de mestrado no Programa de Pós-graduação 
            em Computação Aplicada da Universidade de Brasília (UnB). 
            </p>
            <p>
            O objetivo aqui é investigar sua satisfação com diferentes métodos
            de autenticação (senha, código de acesso, biometria facial e duplo fator de
            autenticação).
            </p>
            <p>
            A partir de hoje você vai receber SMS diários com um link para que possa realizar uma autenticação.
            </p>
            <p>
            Solicitamos que leia com atenção o Termo de Consentimento Livre e Esclarecido 
            disponível no link <a href="https://bit.ly/3y0DHyj" target="_blank">https://bit.ly/3y0DHyj</a>.
            </p>
          </div>

          <div class="col m-3 text-start" v-if="this.info.autenticacao && this.info.autenticacao.pendente && this.info.usuario && this.info.usuario.inicializado">
            <!-- <h6>Olá {{this.info.usuario.nome}},</h6> -->
            <p>
            redirecionando... 
            </p>
          </div>
      </div>
      <div class="d-grid gap-2 mx-auto">
        <button type="button" class="btn btn-success" v-on:click="participar"  v-if="this.info.usuario && !this.info.usuario.inicializado">Estou ciente e quero participar!</button>
      </div>

  </div>
</template>

<script>
import api from '@/services/api.js';
import router from '@/routes/router.js';
import dataStore from '@/services/dataStore.js'

export default {
    name: 'BoasVindas',
    data() {
        return {
            info: {},
            dataStore: dataStore,
        }
    },
    beforeMount() {
        api.get(`/info/${this.$route.params.codLink}`).then(response => {
            dataStore.erros.splice(0, dataStore.erros.length);
            this.info = response.data;
            dataStore.expInfo = this.info;
            if(this.info.autenticacao.pendente && this.info.usuario.inicializado){
                this.participar()
            }
        }).catch(function (error) {
            console.log(error);
            let msgErro = 'Desculpe, ocorreu um erro ao realizar a ação, por favor tente novamente mais tarde.'
            if (error.response) {
                msgErro = error.response.data
            }
            dataStore.erros.push(msgErro)
        });
    },
    methods: {
        participar(){            
            api.put(`/usuario/inicializar/${dataStore.expInfo.usuario.id}`).then(response => {
                if(response.status === 204){
                    dataStore.erros.splice(0, dataStore.erros.length);
                    this.navegarParaAutenticacao()   
                }
            }).catch(function (error) {
                let msgErro = 'Desculpe, ocorreu um erro ao inicializar o usuário, por favor tente novamente mais tarde.'
                if (error.response) {
                    msgErro = error.response.data
                }
                dataStore.erros.push(msgErro)
            });
        },
        navegarParaAutenticacao(){
            if(dataStore.expInfo.autenticacao.tipo === 'SENHA'){
                router.push('/auth/password')

            } else if (dataStore.expInfo.autenticacao.tipo === 'CODIGO_ACESSO') {
                router.push('/auth/codigoAcesso')

            } else if (dataStore.expInfo.autenticacao.tipo === 'FACE') {
                router.push('/auth/face')

            } else if (dataStore.expInfo.autenticacao.tipo === 'SENHA_CODIGO_ACESSO') {
                router.push('/auth/password_codigo_acesso')

            } else {
                console.log('Nenhum tipo de autenticação encontradao');

            }
        }
    }

}
</script>

<style scoped>
    
</style>
