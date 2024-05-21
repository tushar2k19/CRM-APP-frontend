<template>
  <header class="header">
    <router-link to="/home" class="nav-link">Grant Thornton Bharat</router-link>
    <p class="header-text"></p>
  </header>
</template>

<script>
export default {
  name: 'Header',
}
</script>

<style scoped>
.header {
  background-color: #2C4E80;
  padding: 10px;
  height: 10vh;
  text-align: center;
  color: #ffff;
  font-size: 30px;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

.nav-link {
  text-decoration: none;
  color: #fff;
  font-size: 30px;
  display: block;
  margin-bottom: 15px;
  padding: 10px 20px;
  border-radius: 10px;
  transition: box-shadow 0.3s, transform 0.3s;
}
.header-text {
  margin: 0;
}
</style>
