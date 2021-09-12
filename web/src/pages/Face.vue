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
              <button type="submit" class="btn btn-primary" v-on:click="exibirFace">Avançar</button>
            </div>
        </div>
        <div class="col m-3 text-center" v-show="!this.exibirCpf">
            <div class="embed-responsive embed-responsive-16by9">
              <video id="webcam" autoplay playsinline class="embed-responsive-item" width="300px" height="220px"></video>
              <canvas id="canvas" class="d-none" width="0px" height="0px"></canvas>
              <audio id="snapSound" src="audio/snap.wav" preload = "auto"></audio>
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
import Webcam from 'webcam-easy';


export default {
  name: "Face",
  data() {
    return {
      exibirCpf: true,
      cpf: null,
      dataStore: dataStore,
      tempoInicio: null,
      webcam: null
    }
  },
  mounted(){
    const webcamElement = document.getElementById('webcam');
    const canvasElement = document.getElementById('canvas');
    const snapSoundElement = document.getElementById('snapSound');
    this.webcam = new Webcam(webcamElement, 'user', canvasElement, snapSoundElement);
    this.tempoInicio = Date.now()
  },
  methods: {
    exibirFace(){
      this.tempoInicio = Date.now()
      if(!this.cpf){
        dataStore.erros.push('É preciso informar um CPF')
        return
      } else {
        dataStore.erros.splice(0, dataStore.erros.length);
      }
      this.exibirCpf = false
      this.webcam.start()
        .then((result) =>{
            console.log("webcam started: " + result);
        })
        .catch(err => {
            console.log(err);
        });
    },
    autenticar(){
      this.webcam.stop()
      this.dataStore.duracao = Date.now() - this.tempoInicio
      let bodyParam = {
          cpf: this.cpf,
      }
      api.put(`/facial/${dataStore.expInfo.usuario.id}`, bodyParam).then(response => {
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
