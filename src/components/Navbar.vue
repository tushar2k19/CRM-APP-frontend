<template>
  <div class="container">
    <div v-if="!signedIn()">
    </div>
    <div v-else >
      <nav class="navbar">
        <ul>
          <li :class="{ 'active': $route.path === '/home' }"><router-link to="/home" class="nav-link">Home</router-link></li>
          <li :class="{ 'active': $route.path === '/audience' }"><router-link to="/audience" class="nav-link">Customers</router-link></li>
          <li :class="{ 'active': $route.path === '/crm' }"><router-link to="/crm" class="nav-link">Conversations</router-link></li>
          <li :class="{ 'active': $route.path === '/analytics' }"><router-link to="/analytics" class="nav-link">Analytics</router-link></li>
          <br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>
          <a href="#" @click.prevent="signOut" class="link-grey px-2 no-underline" style="text-decoration:none; color: black; padding-left: 19px; font-weight: bold; font-size: larger">Sign out</a>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script>
export default {
  name: "Navbar",
  methods: {
    signedIn(){
      return localStorage.signedIn === "true";
    },
    signOut () {
      this.$http.secured.delete('/signout')
        .then(response => {
          delete localStorage.csrf;
          delete localStorage.signedIn;
          this.$router.replace('/');
          window.location.reload();
        })
        .catch(error => {
          console.log("signout_error -> ", error)
        });
    }
  }
}
</script>

<style scoped>
.container {
  display: flex;
}

.navbar {
  background-color: #2C4E80;
  padding: 15px;
  margin-bottom: -20px;
  width: 140px;
  align-items: center;
  height: 88vh;
  margin-top: 30%;
}

ul {
  list-style-type: none;
  padding: 0;
}

.nav-link {
  text-decoration: none;
  color: #fff;
  font-size: 20px;
  display: block;
  margin-bottom: 15px;
  padding: 10px 20px;
  border-radius: 10px;
  transition: box-shadow 0.3s, transform 0.3s;
}

.active {
  background-color: #4C7BB1;
  border-radius: 10px;
}

.nav-link:hover {
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
}
</style>
