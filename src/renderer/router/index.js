import Vue from 'vue'
import Router from 'vue-router'
import mainView from '../components/mainView'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: mainView
    }
  ]
})
