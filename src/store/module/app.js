import {
    getBreadCrumbList,
    setTagNavListInLocalstorage,
    getMenuByRouter,
    getTagNavListFromLocalstorage,
    getHomeRoute,
    getNextRoute,
    routeHasExist,
    routeEqual,
    getRouteTitleHandled,
    localSave,
    localRead
} from '@/libs/util';
import { getEnv } from '@/api/system';
import { appContainer } from '@/libs/common-utils';
import config from '@/config';

const { homeName } = config;

const closePage = (state, route) => {
    const nextRoute = getNextRoute(state.tagNavList, route);
    state.tagNavList = state.tagNavList.filter(item => {
        return !routeEqual(item, route);
    });
    appContainer.router.push(nextRoute);
};

export default {
    state: {
        breadCrumbList: [],
        tagNavList: [],
        homeRoute: {},
        local: localRead('local'),
        env: {}, // 系统部署环境
        routes: [],
        menuMap: {}
    },
    getters: {
        menuList: (state, getters, rootState) =>
            getMenuByRouter(state.routes, rootState.user.access),
        routes: state => state.routes,
        menuMap: state => state.menuMap
    },
    mutations: {
        setBreadCrumb(state, route) {
            state.breadCrumbList = getBreadCrumbList(route, state.homeRoute);
        },
        setHomeRoute(state, routes) {
            state.homeRoute = getHomeRoute(routes, homeName);
        },
        setTagNavList(state, list) {
            let tagList = [];
            if (list) {
                tagList = [...list];
            } else {
                tagList = getTagNavListFromLocalstorage() || [];
            }

            if (tagList[0] && tagList[0].name !== homeName) {
                tagList.shift();
            }
            const homeTagIndex = tagList.findIndex(item => item.name === homeName);
            if (homeTagIndex > 0) {
                const homeTag = tagList.splice(homeTagIndex, 1)[0];
                tagList.unshift(homeTag);
            }
            state.tagNavList = tagList;
            setTagNavListInLocalstorage([...tagList]);
        },
        closeTag(state, route) {
            const tag = state.tagNavList.filter(item => routeEqual(item, route));
            // eslint-disable-next-line no-param-reassign
            route = tag[0] ? tag[0] : null;
            if (!route) {
                return;
            }
            closePage(state, route);
        },
        addTag(state, { route, type = 'unshift' }) {
            const router = getRouteTitleHandled(route);
            if (!routeHasExist(state.tagNavList, router)) {
                if (type === 'push') {
                    state.tagNavList.push(router);
                } else if (router.name === homeName) {
                    state.tagNavList.unshift(router);
                } else {
                    state.tagNavList.splice(1, 0, router);
                }
                setTagNavListInLocalstorage([...state.tagNavList]);
            }
        },
        setLocal(state, lang) {
            localSave('local', lang);
            state.local = lang;
        },
        setEnv(state, env) {
            state.env = env;
        },
        setRoutes(state, routes) {
            state.routes = routes;
        },
        setMenuMap(state, map) {
            state.menuMap = map;
        }
    },
    actions: {
        async getEnv({ commit }) {
            const { data } = await getEnv();
            if (data.success && data.data) {
                commit('setEnv', data.data);
            }
        }
    }
};
