import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import VueSocketIO from 'vue-socket.io';

// export const SocketInstance = SocketIO('http://localhost:8081/video_streaming');

Vue.use(new VueSocketIO({
  debug: true,
  connection: "http://localhost:5000/",
  options: { withCredentials: false }
}))

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
