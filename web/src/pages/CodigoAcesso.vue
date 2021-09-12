<template>
  <div class="container-md">
      <div class="row align-items-center">
        <div class="col m-3 text-start" v-show="this.exibirCpf">
          <!-- <form> -->
            <div class="mb-3">
              <label for="cpf" class="form-label">CPF</label>
              <input type="number" v-model="cpf" class="form-control" id="cpf" required />
              <div class="invalid-feedback">
                Campo obrigatório.
              </div>
            </div>
            <div class="d-grid gap-2 mx-auto">
              <button type="submit" class="btn btn-primary" v-on:click="gerarOTP">Avançar</button>
            </div>
        </div>
        <div class="col m-3 text-start" v-show="!this.exibirCpf">
            <div class="d-grid gap-3 mt-3">
              <span class="badge bg-success opacity-50" v-show="this.otpEnviado">Código de acesso enviado via SMS</span>
            </div>
            <div class="mb-3">
              <label for="codigoAcesso" class="form-label">Código de Acesso</label>
              <input type="number" v-model="codigoAcesso" class="form-control" id="codigoAcesso" required />
            </div>
            <div class="mb-3 form-text">
              <a href="#" v-on:click="gerarOTP">Não recebi o código</a>
            </div>
            <div class="d-grid gap-2 mx-auto">
              <button type="submit" class="btn btn-primary" v-on:click="autenticar">Entrar</button>
            </div>
          <!-- </form> -->
        </div>
      </div>
  </div>
</template>

<script>
import api from '@/services/api.js';
import router from '@/routes/router.js';
import dataStore from '@/services/dataStore.js'

export default {
  name: "CodigoAcesso",
  data() {
    return {
      exibirCpf: true,
      cpf: null,
      codigoAcesso: null,
      dataStore: dataStore,
      tempoInicio: null,
      otpEnviado: false
    }
  },
  mounted(){
    this.tempoInicio = Date.now()
  },
  methods: {
    gerarOTP(){
      this.otpEnviado = false
      api.get(`/otp/${dataStore.expInfo.usuario.id}/${this.cpf}`).then(response => {
        if(response.status === 204){
          dataStore.erros.splice(0, dataStore.erros.length);
          this.exibirCpf = false
          this.otpEnviado = true
        } 

      }).catch(function (error) {
        let msgErro = 'Desculpe, ocorreu um erro ao realizar a ação, por favor tente novamente mais tarde.'
        if (error.response) {
          msgErro = error.response.data
        }
        dataStore.erros.push(msgErro)
      })
    },
    autenticar(){
      this.dataStore.duracao = Date.now() - this.tempoInicio
      let bodyParam = {
          otp: this.codigoAcesso,
      }
      api.put(`/otp/${dataStore.expInfo.usuario.id}/${dataStore.expInfo.autenticacao.id}`, bodyParam).then(response => {
        if(response.status === 200){
          dataStore.erros.splice(0, dataStore.erros.length);
          router.push('/auth/feedback')
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
