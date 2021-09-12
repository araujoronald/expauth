<template>
    <div class="container-md">
      <div class="row align-items-center">
          <div class="col m-3 text-start" >
              <h6>Olá {{dataStore.expInfo.usuario.nome}},</h6>
              <p>
              obrigado por vir até aqui. 
              </p>
              <p>
              Agora dê uma nota que represente o uso desta forma de autenticação.
              </p>
              <!-- <label class="mt-3">
                0 = Muito insatisfeito | 5 = Muito satisfeito
              </label> -->
          </div>
          
          <div class="text-start">
            <p>Como você se sente com relação a sua experiência de uso?</p>
          </div>
          <div class="btn-group" role="group" aria-label="experiência de uso">
            <button type="button" v-on:click="avaliar(1)" class="btn btn-danger mx-0">1</button>
            <button type="button" v-on:click="avaliar(2)" class="btn btn-danger opacity-75 mx-0">2</button>
            <button type="button" v-on:click="avaliar(3)" class="btn btn-warning opacity-75 mx-0">3</button>
            <button type="button" v-on:click="avaliar(4)" class="btn btn-success opacity-75 mx-0">4</button>
            <button type="button" v-on:click="avaliar(5)" class="btn btn-success mx-0">5</button>
          </div>

          <div class="d-grid gap-3 mt-1">
            <span class="badge bg-danger fs-6" v-show="this.avaliacao == 1">Muito insatisfeito</span>
            <span class="badge bg-danger opacity-75 fs-6" v-show="this.avaliacao == 2">Insatisfeito</span>
            <span class="badge bg-warning text-dark fs-6" v-show="this.avaliacao == 3">Indiferente</span>
            <span class="badge bg-success opacity-75 fs-6" v-show="this.avaliacao == 4">Satisfeito</span>
            <span class="badge bg-success fs-6" v-show="this.avaliacao == 5">Muito Satisfeito</span>
          </div>

          <div class="text-start mt-4">
            <p>Como você se sente com relação a sua percepção de segurança?</p>
          </div>
          <div class="btn-group" role="group" aria-label="segurança">
            <button type="button" v-on:click="avaliarSeguranca(1)" class="btn btn-danger mx-0">1</button>
            <button type="button" v-on:click="avaliarSeguranca(2)" class="btn btn-danger opacity-75 mx-0">2</button>
            <button type="button" v-on:click="avaliarSeguranca(3)" class="btn btn-warning opacity-75 mx-0">3</button>
            <button type="button" v-on:click="avaliarSeguranca(4)" class="btn btn-success opacity-75 mx-0">4</button>
            <button type="button" v-on:click="avaliarSeguranca(5)" class="btn btn-success mx-0">5</button>
          </div>

          <div class="d-grid gap-3 mt-1">
            <span class="badge bg-danger fs-6" v-show="this.avaliacaoSeguranca == 1">Muito insatisfeito</span>
            <span class="badge bg-danger opacity-75 fs-6" v-show="this.avaliacaoSeguranca == 2">Insatisfeito</span>
            <span class="badge bg-warning text-dark fs-6" v-show="this.avaliacaoSeguranca == 3">Indiferente</span>
            <span class="badge bg-success opacity-75 fs-6" v-show="this.avaliacaoSeguranca == 4">Satisfeito</span>
            <span class="badge bg-success fs-6" v-show="this.avaliacaoSeguranca == 5">Muito Satisfeito</span>
          </div>

          <div class="text-start mt-4">
            <p>Como você se sente com relação ao respeito a sua privacidade?</p>
          </div>
          <div class="btn-group" role="group" aria-label="privacidade">
            <button type="button" v-on:click="avaliarPrivacidade(1)" class="btn btn-danger mx-0">1</button>
            <button type="button" v-on:click="avaliarPrivacidade(2)" class="btn btn-danger opacity-75 mx-0">2</button>
            <button type="button" v-on:click="avaliarPrivacidade(3)" class="btn btn-warning opacity-75 mx-0">3</button>
            <button type="button" v-on:click="avaliarPrivacidade(4)" class="btn btn-success opacity-75 mx-0">4</button>
            <button type="button" v-on:click="avaliarPrivacidade(5)" class="btn btn-success mx-0">5</button>
          </div>

          <div class="d-grid gap-3 mt-1">
            <span class="badge bg-danger fs-6" v-show="this.avaliacaoPrivacidade == 1">Muito insatisfeito</span>
            <span class="badge bg-danger opacity-75 fs-6" v-show="this.avaliacaoPrivacidade == 2">Insatisfeito</span>
            <span class="badge bg-warning text-dark fs-6" v-show="this.avaliacaoPrivacidade == 3">Indiferente</span>
            <span class="badge bg-success opacity-75 fs-6" v-show="this.avaliacaoPrivacidade == 4">Satisfeito</span>
            <span class="badge bg-success fs-6" v-show="this.avaliacaoPrivacidade == 5">Muito Satisfeito</span>
          </div>

          <div class="d-grid gap-3 mt-5">
            <button type="submit" class="btn btn-primary" v-on:click="registrarFeedback">Confirmar Avaliação</button>
          </div>
      </div>
    </div>
</template>

<script>
import api from '@/services/api.js';
import router from '@/routes/router.js';
import dataStore from '@/services/dataStore.js'

export default {
  name: "Feedback",
  data() {
    return {
      avaliacao: null,
      avaliacaoSeguranca: null,
      avaliacaoPrivacidade: null,
      dataStore: dataStore
    }
  },
  methods: {
    avaliar(val) {
      this.avaliacao = val
    },
    avaliarSeguranca(val) {
      this.avaliacaoSeguranca = val
    },
    avaliarPrivacidade(val) {
      this.avaliacaoPrivacidade = val
    },
    registrarFeedback(){
      let bodyParam = {
          avaliacao: this.avaliacao,
          avaliacaoSeguranca: this.avaliacaoSeguranca,
          avaliacaoPrivacidade: this.avaliacaoPrivacidade,
          duracao: this.dataStore.duracao
      }
      api.put(`/feedback/${dataStore.expInfo.autenticacao.id}`, bodyParam).then(response => {
        if(response.status === 204){
          dataStore.erros.splice(0, dataStore.erros.length);
          router.push('/auth/agradecimento')
        } 

      }).catch(function (error) {
        let msgErro = 'Desculpe, ocorreu um erro ao realizar a ação, por favor tente novamente mais tarde.'
        if (error.response) {
          msgErro = error.response.data
        }
        dataStore.erros.push(msgErro)
      })
    }
  }
};

</script>

<style scoped>

</style>
