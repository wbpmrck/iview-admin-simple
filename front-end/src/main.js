import Vue from 'vue';
import iView from 'iview';
import {router} from './router/index';
import {appRouter} from './router/router';
import store from './store';
import App from './app.vue';
import '@/locale';
import 'iview/dist/styles/iview.css';
import VueI18n from 'vue-i18n';
import util from '@/libs/util';

Vue.use(VueI18n);
Vue.use(iView);

let bus = new Vue();

//全局混入一些辅助方法
Vue.mixin({

    data:function () {
        return {
            bus
        }
    },
    computed: {
        userInfo () {
            return this.$store.state.user.userInfo;
        }
    },
    methods: {
        foo: function () {
            console.log('foo')
        }
    }
})


// //todo:初始化默认的用户信息（这部分逻辑应该是从页面上读取服务器传入的用户信息）
store.commit("login", user);

// 设置默认语言
store.commit('switchLang',Vue.config.lang);
new Vue({
    el: '#app',
    // mixins: [mixin],
    router: router,
    store: store,
    render: h => h(App),
    data: {
        currentPageName: ''
    },
    mounted () {
        this.currentPageName = this.$route.name;



        // 显示打开的页面的列表
        this.$store.commit('setOpenedList');
        this.$store.commit('initCachePage');
        // 权限菜单过滤相关
        // this.$store.commit('updateMenulist');
        this.$store.dispatch('updateMenulist');
        // iview-admin检查更新
        // util.checkUpdate(this);
    },
    created () {
        let tagsList = [];
        appRouter.map((item) => {
            if (item.children.length <= 1) {
                tagsList.push(item.children[0]);
            } else {
                tagsList.push(...item.children);
            }
        });
        this.$store.commit('setTagsList', tagsList);
    }
});
