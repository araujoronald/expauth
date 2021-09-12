<template>
  <div id="app">
    <img alt="uAUTH experimento" id="logo" src="./assets/uauth-logo.svg">
    <div class="alert alert-danger" role="alert" v-show="erros.length > 0 && sucessos.length < 1">
      {{erros[0]}}
    </div>
    <div class="alert alert-success" role="alert" v-show="erros.length < 1 && sucessos.length > 0">
      {{sucessos[0]}}
    </div>
    <router-view path="$router.key" />
  </div>
</template>

<script>
import dataStore from '@/services/dataStore.js'

export default {
  name: 'App',
  data() {
    return {
      erros: dataStore.erros,
      sucessos: dataStore.sucessos
    }
  },
  components: {
    // HelloWorld
  }
}

</script>

<style>
#app {
  text-align: center;
  background-color: #F8F9FA;
  padding-top: 20px;
  padding-bottom: 20px;
}

#logo {
  width: 200px;
}

</style>
