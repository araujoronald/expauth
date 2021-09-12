<template>
  <div class="container-md">
      <div class="row align-items-center">
        <div class="col m-3 text-start" v-show="!this.exibirCodigoAcesso && dataStore.expInfo.usuario.senhaDefinida">
          <!-- <form> -->
            <div class="mb-3">
              <label for="cpf" class="form-label">CPF</label>
              <input type="number" v-model="cpf" class="form-control" id="cpf" required />
              <div class="invalid-feedback">
                Campo obrigatório.
              </div>
            </div>
            <div class="mb-3">
              <label for="password" class="form-label">Senha</label>
              <input type="password" v-model="password" class="form-control" id="password" required />
            </div>
            <div class="mb-3 form-text">
              <a href="#" v-on:click="esqueciSenha">Esqueci minha senha</a>
            
            </div>
            <div class="d-grid gap-2 mx-auto">
              <button type="submit" class="btn btn-primary" v-on:click="gerarOTP">Avançar</button>
            </div>
          <!-- </form> -->
        </div>

        <div class="col m-3 text-start" v-show="!this.exibirCodigoAcesso && !dataStore.expInfo.usuario.senhaDefinida">
          <h6>Olá {{dataStore.expInfo.usuario.nome}},</h6>
          <p>
          é hora de definir sua senha. Vamos lá!
          </p>
          <div class="mb-3">
            <label for="definirPassword" class="form-label">Senha</label>
            <input type="password" v-model="definirPassword"  v-on:keyup="validarForcaSenha" class="form-control" id="definirPassword" required />
            <div id="passwordHelpBlock" class="form-text">
                Sua senha deve possuir ao menos 8 carateres, contendo ao menos uma letra minúscula, uma letra maiúscula, um número e um caractere especial.
              </div>
              <div class="d-grid gap-3 mt-3">
              <span class="badge bg-danger opacity-75" v-show="!this.senhaValida">Senha fraca</span>
            </div>
          </div>
          <div class="d-grid gap-2 mx-auto">
            <button type="submit" class="btn btn-primary" :disabled="!this.senhaValida" v-on:click="confirmarSenha">Confirmar Senha</button>
          </div>
        </div>

        <div class="col m-3 text-start" v-show="this.exibirCodigoAcesso">
            <div class="d-grid gap-3 mt-3">
              <span class="badge bg-success opacity-50" v-show="this.otpEnviado">Código de acesso enviado via SMS</span>
            </div>
            <div class="mb-3">
              <label for="codigoAcesso" class="form-label">Código de Acesso</label>
              <input type="number"  v-on:click="dataStore.sucessos.pop()"  v-model="codigoAcesso" class="form-control" id="codigoAcesso" required />
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

let strongPassword = new RegExp('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})')

export default {
  name: "Password",
  data() {
    return {
      cpf: null,
      password: null,
      codigoAcesso: null,
      definirPassword: null,
      dataStore: dataStore,
      tempoInicio: null,
      exibirCodigoAcesso: false,
      senhaValida: true,
      otpEnviado: false
    }
  },
  mounted(){
    this.tempoInicio = Date.now()
  },
  methods: {
    validarForcaSenha(){
      if(strongPassword.test(this.definirPassword)){
        this.senhaValida = true
      } else {
        this.senhaValida = false
      }
    },
    gerarOTP(){
      this.otpEnviado = false
      let bodyParam = {
          cpf: this.cpf,
          senha: this.password
      }
      api.put(`/2fa/password/${dataStore.expInfo.usuario.id}/${dataStore.expInfo.autenticacao.id}`, bodyParam).then(response => {
        if(response.status === 204){
          dataStore.erros.splice(0, dataStore.erros.length);
          this.exibirCodigoAcesso = true
          this.otpEnviado = true
        } 

      }).catch(function (error) {
        let msgErro = 'Desculpe, ocorreu um erro ao realizar a ação, por favor tente novamente mais tarde.'
        if (error.response) {
          msgErro = error.response.data
        }
        dataStore.sucessos.splice(0, dataStore.sucessos.length);
        dataStore.erros.push(msgErro)
      })
    },
    autenticar(){
      this.dataStore.duracao = Date.now() - this.tempoInicio
      let bodyParam = {
          otp: this.codigoAcesso
      }
      api.put(`/2fa/otp/${dataStore.expInfo.usuario.id}/${dataStore.expInfo.autenticacao.id}`, bodyParam).then(response => {
        if(response.status === 200 || response.status === 204){
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
    },
    esqueciSenha(){
      dataStore.expInfo.usuario.senhaDefinida = false
      this.definirPassword = null
      dataStore.erros.splice(0, dataStore.erros.length);
    },
    confirmarSenha(){
      let bodyParam = {
          password: this.definirPassword
      }
      api.put(`/config/password/${dataStore.expInfo.usuario.id}/${dataStore.expInfo.autenticacao.id}`, bodyParam).then(response => {
          if(response.status === 204){
              dataStore.expInfo.usuario.senhaDefinida = true 
              this.cpf = null
              this.password = null 
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
