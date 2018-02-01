import Cookies from 'js-cookie';

const user = {
    state: {
        userInfo:{
            id:undefined,
            name:undefined,
            passwordSecret: "",
            salt: "",
            role:[], //[2,3,4] 前端只保留角色id
            access:[], //[ {id:1,name:'user.add'} ] 权限当是root用户的时候，是一个字符串 "__all__"
            avatar:""
        }
    },
    getters: {
        userInfo: state => {
            return state.userInfo
        }
    },
    mutations: {
        changeAccess:function (state, access) {
            state.userInfo.access = access;
        },
        login:function (state, user) {
            state.userInfo = user;
        },
        logout (state, vm) {

            // Cookies.remove('user');
            // Cookies.remove('password');
            // Cookies.remove('access');

            state.userInfo = undefined;

            // 恢复默认样式
            let themeLink = document.querySelector('link[name="theme"]');
            themeLink.setAttribute('href', '');
            // 清空打开的页面等数据，但是保存主题数据
            let theme = '';
            if (localStorage.theme) {
                theme = localStorage.theme;
            }
            localStorage.clear();
            if (theme) {
                localStorage.theme = theme;
            }
        }
    }
};

export default user;
