// Libs
import Vue from 'vue';

// Styles
import '../scss/index.scss';

// Router
import router from './router';

// Components
import App from './App';

// Start VueJS
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App },
});
