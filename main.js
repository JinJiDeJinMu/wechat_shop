import Vue from 'vue';
import App from './App';
// import buttonDiy from "./components/button-diy.vue";
// Vue.component("button-diy", buttonDiy);

// import uParse from "./components/gaoyia-parse/parse.vue";
// Vue.component("u-parse", uParse);

Vue.config.productionTip = false;
App.mpType = 'app';
const app = new Vue({
    ...App
});
app.$mount();
