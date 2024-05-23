<template>
  <div class="signup-container" style="margin-top: 0px">
    <h1 class="signup-title">Create an Account</h1>
    <form @submit.prevent="signup">
      <div class="input-group">
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="email" required>
      </div>
      <div class="input-group">
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="password" @click="clearError" required>
      </div>
      <div class="input-group">
        <label for="confirmPassword">Confirm Password:</label>
        <input type="password" id="confirmPassword" v-model="password_confirmation" @click="clearError" required>
      </div>
      <div class = "error-card" v-if="error"> {{ error }}</div>
      <div class="button-container">
        <button type="submit">Signup</button>
        <div class="signup-link">
          Already an user?
          <router-link to="/signin" class="signup-link" style="padding-top: 2px; padding-left: 4px;">Sign In</router-link>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'Signup',
  data () {
    return {
      email: '',
      password: '',
      error: '',
      password_confirmation: ''
    }
  },
  methods: {
    clearError () {
      this.error = ''
    },
    signup () {
      if (this.password !== this.password_confirmation) {
        this.error = 'Passwords do not match'
        this.password = ''
        this.password_confirmation = ''
        return
      }

      this.$http.plain.post('/signup', {email: this.email, password: this.password, password_confirmation: this.password_confirmation})
        .then(response => {
          this.signinSuccessful(response)
          this.email = ''
          this.password = ''
        })
        .catch(error => this.signinFailed(error))
    },
    signinSuccessful (response) {
      if (!response.data.csrf) {
        this.signinFailed(response)
        return
      }
      localStorage.csrf = response.data.csrf
      localStorage.signedIn = true
      this.error = ''
      this.$router.replace('/home')
      window.location.reload()
    },
    signinFailed: function (error) {
      this.error = (error.response && error.response.data && error.response.data.error) || 'Something went wrong'
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
.signup-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  width: 300vh;
  height: 100vh;
  background-color: #f0f2f5;
}

.signup-title {
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
