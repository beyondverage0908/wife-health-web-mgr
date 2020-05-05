import { login, logout, getUserStatus } from '@/api/user';
import { setToken, getToken } from '@/libs/util';
import { appContainer, initApp } from '@/libs/common-utils';
import { getUserMenuPrivs, getUserOpreratePrivs } from '@/api/privs';
import { getActionPrivsMap } from '@/libs/tools'; // 操作权限
import config from '@/config';

const state = {
    userInfo: {},
    token: getToken(),
    access: '', // 菜单权限
    hasGetInfo: false,
    hasLogged: false,
    hasGetPrivs: false,
    menuPrivs: [], // 拥有的菜单权限
    operatePrivsMap: {} // 拥有的操作权限
};

const mutations = {
    setUserInfo(state, userInfo) {
        state.userInfo = {};
        Object.assign(state.userInfo, userInfo);
    },
    setAccess(state, access) {
        state.access = access;
    },
    setToken(state, token) {
        // 设置token到cookie
        state.token = token;
        setToken(token);
    },
    setHasGetInfo(state, status) {
        state.hasGetInfo = status;
    },
    setHasLogged(state, status) {
        state.hasLogged = status;
    },
    setMenuPrivs(state, privs) {
        state.menuPrivs = privs;
    },
    setOperatePrivs(state, privs) {
        state.operatePrivsMap = getActionPrivsMap(privs);
    },
    setHasGetPrivs(state, status) {
        state.hasGetPrivs = status;
    }
};
const actions = {
    // 登录
    async handleLogin({ dispatch }, loginData) {
        const { data } = await login(loginData);
        if (data.success) {
            // 登陆成功后获取用户信息
            const logged = await dispatch('getUserStatus');
            return logged;
        }
        return false;
    },

    // 退出登录
    async handleLogOut({ commit }) {
        const { router, vm } = appContainer;
        const { data } = await logout();
        commit('setHasLogged', false);
        commit('setHasGetInfo', false);
        commit('setUserInfo', {});
        commit('setAccess', []);
        commit('setHasGetPrivs', false);
        if (router) {
            router.replace({
                name: 'login'
            });
            if (config.usePermission) {
                // 只有启用权限管理时才重建app
                vm.$nextTick(() => {
                    appContainer.isRebuild = true;
                    initApp();
                });
            }
        }
        return data;
    },
    // 获取用户信息和状态
    async getUserStatus({ commit }, status) {
        // 直接设置登陆态
        if (status !== undefined) {
            commit('setHasLogged', status);
            return;
        }
        const { data } = await getUserStatus();
        if (data.success && data.data) {
            commit('setUserInfo', data.data);
            commit('setHasLogged', true);
            commit('setHasGetInfo', true);
            commit('setAccess', data.data.roles);
            return true;
        }

        commit('setHasGetInfo', false);
        commit('setUserInfo', {});
        commit('setAccess', []);
        commit('setHasLogged', false);
        return false;
    },
    async getUserPrivs({ commit }) {
        try {
            const { data } = await getUserMenuPrivs();
            const { data: operationData } = await getUserOpreratePrivs();
            if (data.success && data.data && operationData.success && operationData.data) {
                commit('setMenuPrivs', data.data);
                commit('setOperatePrivs', operationData.data);
                return data.data;
            }

            return [];
        } finally {
            commit('setHasGetPrivs', true);
        }
    }
};

export default {
    namespaced: false,
    state,
    mutations,
    actions
};
