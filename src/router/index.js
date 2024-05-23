import Vue from 'vue'
import Router from 'vue-router'

import Signin from '../components/Signin.vue'
import Signup from '../components/Signup.vue'

import Crm from '../components/Crm.vue'
import Analytics from '../components/Analytics.vue'
import Audience from '../components/Audience.vue'
import Home from '../components/Home.vue'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'Signin',
      component: Signin
    },
    {
      path: '/analytics',
      name: 'Analytics',
      component: Analytics
    },
    {
      path: '/audience',
      name: 'Audience',
      component: Audience,
      meta: { requiresAuth: true }
    },
    {
      path: '/signup',
      name: 'Signup',
      component: Signup
    },
    {
      path: '/crm',
      name: 'Crm',
      component: Crm
    },
    {
      path: '/home',
      name: 'Home',
      component: Home
    },
    {
      path: '/signin',
      name: 'Signin',
      component: Signin
    }

  ]
})

router.beforeEach((to, from, next) => {
  const isSignedIn = localStorage.signedIn
  if (to.name === 'Signin' || to.name === 'Signup') {
    next()
    return
  }

  if (!isSignedIn) {
    next({ name: 'Signin' }) // can also do {{{{  next('/signin')   }}}} but not doing to keep the original url entact (login krke bhi ussi endpoint pr jaaega jisko hot kara tha)
  } else {
    next()
  }
})

export default router
