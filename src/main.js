import { createApp } from 'vue'
import { createPinia } from 'pinia'

import {
    Form, Field, ErrorMessage, defineRule, configure,
} from 'vee-validate';
import * as AllRules from '@vee-validate/rules';
import { localize, setLocale } from '@vee-validate/i18n';
import zhTW from '@vee-validate/i18n/dist/locale/zh_TW.json';


import axios from 'axios'
import VueAxios from 'vue-axios'

// import CKEditor from '@ckeditor/ckeditor5-vue';
import CKEditor from '@ckeditor/ckeditor5-vue';

import { date, currency } from '@/methods/filters'

import 'bootstrap';
// import 'bootstrap/dist/css/bootstrap.min.css'; // 引入 Bootstrap 的 

import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/css/index.css';

import $httpMessageState from '@/methods/pushMessageState'

import App from './App.vue'
import router from './router'

Object.keys(AllRules).forEach(rule => {
    defineRule(rule, AllRules[rule]);
});

configure({
    generateMessage: localize({ zh_TW: zhTW }), //載入繁體中文語系
    validateOnInput: true, //當輸入任何內容直接驗證
})
// 預設中文語系
setLocale('zh-TW');

const pinia = createPinia()
const app = createApp(App)

app.config.globalProperties.$filters = {
    date,     //函數用格格是畫日期，會回傳格式化後的日期字符串
    currency, //他接受數字輸入並返回格式化後的貨幣字串福
}



// 正常來說不建議太多方法掛 Global，這裡可以使用 provide 來處理
app.config.globalProperties.$httpMessageState = $httpMessageState

app.use(createPinia())
app.use(router)
app.use(pinia)
app.use(CKEditor)

app.component('FormVee', Form)
app.component('FieldVee', Field)
app.component('ErrorMessage', ErrorMessage)

app.component('LoadingPlugin', Loading)

app.use(VueAxios, axios)
app.mount('#app')
