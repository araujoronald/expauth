<template>
    <div class="container-md">
      <div class="row align-items-center">
          <div class="col m-3 text-start">
              <div class="alert alert-success" role="alert">
                <h4 class="alert-heading">Muito obrigado!</h4>
                <p>{{dataStore.expInfo.usuario.nome}}</p>
                <hr>
                <p class="mb-0">Sua contribuição está sendo fundamental para este experimento.</p>
              </div>
          </div>
      </div>
    </div>
</template>

<script>

import dataStore from '@/services/dataStore.js'

export default {
  name: "Agradecimento",
  data() {
    return {
      dataStore: dataStore
    }
  }
};

</script>

<style scoped>

</style>
