import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './global'
import './filters'
import api from './http/api'
import dayjs from 'dayjs'
import axios from 'axios'
import "nprogress/nprogress.css";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import VueTable from 'vue-table-with-tree-grid';

Vue.prototype.$api = api
Vue.prototype.$dayjs = dayjs
Vue.prototype.$axios = axios
Vue.config.productionTip = false
Vue.use(ElementUI);
Vue.use(VueTable);

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')