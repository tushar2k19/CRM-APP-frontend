<template>
  <div class="login-container">
    <h1 class="login-title">Welcome Back!</h1>
    <form @submit.prevent="signin">
      <div class = "error-card" v-if="error"> {{ error }}</div>
      <div class="input-group">
        <label for="email">Email:</label>
        <input type="email" id="username" v-model="email" placeholder="abc@xyz.com" @input="clearError" required>
      </div>
      <div class="input-group">
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="password" placeholder="********" @input="clearError" required>
      </div>
      <div class="button-container">
        <button type="submit">Login</button>
        <div class="signup-link">
          Not a user?
          <router-link to="/signup" class="signup-link" style="padding-top: 2px; padding-left: 4px;">Sign Up</router-link>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'Signin',
  data () {
    return {
      email: '',
      password: '',
      error: ''
    }
  },
  created: function () {
    this.checkSignedin()
  },
  updated () {
    this.checkSignedin()
  },
  methods: {
    clearError () {
      this.error = ''
    },
    checkSignedin: function () {
      if (localStorage.signedIn) {
        this.$router.replace('/home')
      }
    },
    async signin() {
      try {
        const response = await this.$http.plain.post('/signin', { email: this.email, password: this.password })
        this.signinSuccessful(response)
      } catch (error) {
        this.signinFailed(error)
      }
    },
    signinSuccessful (response) {
      if (!response.data.csrf) {
        this.signinFailed(response)
        return
      }
      localStorage.csrf = response.data.csrf
      localStorage.signedIn = true
      this.error = ''
      window.location.href = '/#/home'
    },
    signinFailed: function (error) {
      this.error = (error.response && error.response.data && error.response.data.error) || ''
      this.password = ''
      this.email = ''
      delete localStorage.csrf
      delete localStorage.signedIn
    }
  }
}
</script>

<style scoped>
.error-card {
  background-color: #f8d7da;
  color: #721c24;
  padding: 1rem;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;
}
.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  width: 300vh;
  height: 100vh;
  background-color: #f0f2f5;
}

.login-title {
  font-size: 2rem;
  margin-bottom: 2rem;
  color: #343a40;
}

.input-group {
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
}

.input-group label {
  font-size: 1rem;
  margin-bottom: 0.5rem;
  color: #343a40;
}

.input-group input {
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.button-container {
  margin-top: 1rem;
}

.button-container button {
  padding: 0.8rem 1.6rem;
  background-color: #28539e;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;

}

.button-container button:hover {
  background-color: #2c6bd1;
}
.signup-link{
  font-size: smaller;
  display: flex;
  justify-content: flex-end;
}
.signup-link a {
  text-decoration: none;
  color:blue
}
.signup-link a:hover {
  text-decoration: none;
  color:purple
}
</style>
