import iView from 'view-design';
import Vue from 'vue';
import App from '@/App';
import createRouter from '@/router';
import store from '@/store';
import { getToken } from './util';

/**
 * router每次initApp时都会重新new，因此要获取router必须从appContainer中得到
 * vm表示当前的vue实例，原因同上
 * isRebuild在权限启用时会用到，主要防止退出登陆时login界面验证码二次刷新。如果重建的app则不再刷新验证码。
 */
export const appContainer = {
    router: null,
    vm: null,
    isRebuild: false
};
export function initApp() {
    const router = createRouter();
    console.log('重建实例');
    appContainer.router = router;
    appContainer.vm = new Vue({
        el: '#app',
        router,
        store,
        render: h => h(App)
    });
}
// ============ 使用getStatus判断登陆态时使用
export const initAppByStatus = async () => {
    iView.Spin.show({
        render: h => {
            return h('div', [
                h('Icon', {
                    class: 'index-spin-load',
                    props: {
                        type: 'ios-loading',
                        size: 18
                    }
                }),
                h('div', '正在加载，请稍后...')
            ]);
        }
    });
    try {
        await store.dispatch('getUserStatus');
    } finally {
        iView.Spin.hide();
        initApp();
    }
};

// 通过token判断登陆态
export const initAppByToken = async () => {
    const hasLogged = !!getToken();
    await store.dispatch('getUserStatus', hasLogged); // 传入第二个登陆态参数则不会调用接口
    initApp();
};

/**
 * @description production环境禁用console.log
 */
export const disableLog = () => {
    if (process.env.NODE_ENV === 'production') {
        console.log = () => {}; // 取消console
    }
};
