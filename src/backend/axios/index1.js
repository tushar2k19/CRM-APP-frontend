import axios from 'axios'
// import {process} from 'karma/lib/cli'

// API_URL = process.env.REACT_APP_API_URL;

const API_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://crm-be.up.railway.app'
console.log('tmkoc', API_URL, process.env)

const securedAxiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
})

const plainAxiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
})

securedAxiosInstance.interceptors.request.use(config => {
  const method = config.method.toUpperCase()
  if (method !== 'OPTIONS' && method !== 'GET') {
    config.headers = {
      ...config.headers,
      'X-CSRF-TOKEN': localStorage.csrf
    }
  }
  return config
})

securedAxiosInstance.interceptors.response.use(null, error => {
  if (error.response && error.response.config && error.response.status === 401) {
    console.log("inside the response error");
    return plainAxiosInstance.post('/refresh', {}, { headers: { 'X-CSRF-TOKEN': localStorage.csrf } })
      .then(response => {
        console.log("inside the response error (then)");

        localStorage.csrf = response.data.csrf
        localStorage.signedIn = true

        let retryConfig = error.response.config
        retryConfig.headers['X-CSRF-TOKEN'] = localStorage.csrf
        return plainAxiosInstance.request(retryConfig)
      }).catch(error => {
        console.log("inside the response error (catch)");
        delete localStorage.csrf
        delete localStorage.signedIn

        location.replace('/')
        return Promise.reject(error)
      })
  } else {
    console.log('outside the response error')
    return Promise.reject(error)
  }
})

export {securedAxiosInstance, plainAxiosInstance}
