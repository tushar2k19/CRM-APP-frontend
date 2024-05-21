<template>
  <div id="app" class="app-container">
    <Header class="header"/>
    <div class="content-wrapper">
      <Navbar class="fixed-right-navbar" />
      <router-view style="margin-right: -5px"/>
    </div>

  </div>
</template>

<script>
import Header from './components/Header.vue'
import Navbar from './components/Navbar.vue'

export default {
  name: 'App',
  components: {Header, Navbar}
}
</script>

<style scoped>
* {
  margin-left: -3px;
  margin-top: -3px;
  box-sizing: border-box;
}

.app-container {
  display: flex;
  flex-direction: column; /* Stack header and content vertically */
  /* min-height: calc(90vh - 50px); Ensure content fills viewport height */
  height: 638px;
  background-color: #E6F2FF;
}

.content-wrapper {
  display: flex;
  flex-grow: 1;
  background-color: #ffffff;
}
.header{
  height: 80px;
}
body {
  margin: 0px;
  padding: 0px;
}

/* Style the header and navbar components as needed */
</style>
