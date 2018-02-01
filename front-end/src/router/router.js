import Main from '@/views/Main.vue';

// 不作为Main组件的子页面展示的页面单独写，如下
export const loginRouter = {
    path: '/login',
    name: 'login',
    meta: {
        title: {i18n: 'title.login'}
    },
    component: resolve => { require(['@/views/login/login.vue'], resolve); }
};

export const page404 = {
    path: '/*',
    name: 'error-404',
    meta: {
        title: {i18n: 'title.404'}
    },
    component: resolve => { require(['@/views/error-page/404.vue'], resolve); }
};

export const page403 = {
    path: '/403',
    meta: {
        title: {i18n: 'title.403'}
    },
    name: 'error-403',
    component: resolve => { require(['@//views/error-page/403.vue'], resolve); }
};

export const page500 = {
    path: '/500',
    meta: {
        title: {i18n: 'title.500'}
    },
    name: 'error-500',
    component: resolve => { require(['@/views/error-page/500.vue'], resolve); }
};

export const locking = {
    path: '/locking',
    name: 'locking',
    meta: {
        title: {i18n: 'title.locking'}
    },
    component: resolve => { require(['@/views/main-components/lockscreen/components/locking-page.vue'], resolve); }
};

// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
export const otherRouter = {
    path: '/',
    name: 'otherRouter',
    redirect: '/home',
    meta: {
        title: {i18n: 'title.home'}
    },
    component: Main,
    children: [
        { path: 'home',  meta: {title: {i18n: 'title.home'} }, name: 'home_index', component: resolve => { require(['@/views/home/home.vue'], resolve); } },
        { path: 'ownspace',  meta:{ title: {i18n: 'title.ownSpace'} }, name: 'ownspace_index', component: resolve => { require(['@/views/own-space/own-space.vue'], resolve); } },
        { path: 'access/create',  meta:{ title: {i18n: 'title.access.create'} }, name: 'access_create', component: resolve => { require(['@/views/access/access-create.vue'], resolve); } },
    ]
};

// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const appRouter = [
    {
        path: '/access',
        icon: 'key',
        name: 'access',
        meta: {
            title: {i18n: 'title.access'}
        },
        component: Main,
        children: [
            { path: 'demo',  meta:{title: {i18n: 'title.access.demo'} },name: 'access_demo', component: resolve => { require(['@/views/access/access.vue'], resolve); } },
            { path: 'index',  meta:{title: {i18n: 'title.access.index'} },name: 'access_index', component: resolve => { require(['@/views/access/access-index.vue'], resolve); } }
        ]
    },
    {
        path: '/error-page',
        icon: 'android-sad',
        meta:{
            title: {i18n: 'title.errorDemo'}
        },
        name: 'errorpage',
        component: Main,
        children: [
            { path: 'index', access:"error_page",  meta:{ title: {i18n: 'title.errorDemoIndex'} }, name: 'errorpage_index', component: resolve => { require(['@/views/error-page/error-page.vue'], resolve); } },
        ]
    }
];

// 所有上面定义的路由都要写在下面的routers里
export const routers = [
    loginRouter,
    otherRouter,
    locking,
    ...appRouter,
    page500,
    page403,
    page404
];
