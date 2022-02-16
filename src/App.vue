<template>
  <div id="app">
    <!-- <WorkFlow/> -->
    <router-view></router-view>
  </div>
</template>

<script>
import WorkFlow from './Pages/WorkFlow.vue'
export default {
  name: 'App',
  components: {
    WorkFlow
  }
}
</script>

<style lang="scss">
html,body{
  padding: 0;
  margin: 0;
  width: 100%;
  height: 100%;
}
#app {
  width: 100%;
  height: 100%;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  overflow: hidden;
}
</style>
