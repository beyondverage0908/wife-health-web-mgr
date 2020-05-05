/* eslint-disable func-names */
/* eslint-disable no-use-before-define */
import Cookies from 'js-cookie';
import { Base64 } from 'js-base64';
// cookie保存的天数
import config from '@/config';
import { forEach, hasOneOf, objEqual } from '@/libs/tools';

const { title, cookieExpires, useI18n } = config;

export const TOKEN_KEY = 'token'; // 设置tokenKey

export const setToken = token => {
    Cookies.set(TOKEN_KEY, token, { expires: cookieExpires || 1 });
};

export const getToken = () => {
    const token = Cookies.get(TOKEN_KEY);
    if (token) {
        return token;
    }
    return false;
};

// 获取basic认证
export const getBasicAuth = () => {
    const token = getToken();
    if (token) {
        return `Basic ${Base64.encode(`${token}:`)}`;
    }
    return '';
};

export const hasChild = item => {
    return item.children && item.children.length !== 0;
};

const showThisMenuEle = (item, access) => {
    if (item.meta && item.meta.access && item.meta.access.length) {
        if (hasOneOf(item.meta.access, access)) {
            return true;
        }
        return false;
    }
    return true;
};
/**
 * @param {Array} list 通过路由列表得到菜单列表
 * @returns {Array}
 */
export const getMenuByRouter = (list, access) => {
    const res = [];
    forEach(list, item => {
        if (!item.meta || (item.meta && !item.meta.hideInMenu)) {
            const obj = {
                icon: (item.meta && item.meta.icon) || '',
                name: item.name,
                meta: item.meta
            };
            if (
                (hasChild(item) || (item.meta && item.meta.showAlways))
                && showThisMenuEle(item, access)
            ) {
                obj.children = getMenuByRouter(item.children, access);
            }
            if (item.meta && item.meta.href) {
                obj.href = item.meta.href;
            }
            if (showThisMenuEle(item, access)) {
                res.push(obj);
            }
        }
    });
    return res;
};

/**
 * @param {Array} routeMetched 当前路由metched
 * @returns {Array}
 */
export const getBreadCrumbList = (route, homeRoute) => {
    const homeItem = { ...homeRoute, icon: homeRoute.meta.icon };
    const routeMetched = route.matched;
    if (routeMetched.some(item => item.name === homeRoute.name)) {
        return [homeItem];
    }
    let res = routeMetched
        .filter(item => {
            return item.meta === undefined || !item.meta.hideInBread;
        })
        .map(item => {
            const meta = { ...item.meta };
            if (meta.title && typeof meta.title === 'function') {
                meta.__titleIsFunction__ = true;
                meta.title = meta.title(route);
            }
            const obj = {
                icon: (item.meta && item.meta.icon) || '',
                name: item.name,
                meta
            };
            return obj;
        });
    res = res.filter(item => {
        return !item.meta.hideInMenu;
    });
    return [{ ...homeItem, to: homeRoute.path }, ...res];
};

export const getRouteTitleHandled = route => {
    const router = { ...route };
    const meta = { ...route.meta };
    let title = '';
    if (meta.title) {
        if (typeof meta.title === 'function') {
            meta.__titleIsFunction__ = true;
            title = meta.title(router);
        } else {
            title = meta.title;
        }
    }
    meta.title = title;
    router.meta = meta;
    return router;
};

export const showTitle = (item, vm) => {
    // eslint-disable-next-line prefer-const
    let { title, __titleIsFunction__ } = item.meta;
    if (!title) {
        return;
    }
    if (useI18n) {
        if (title.includes('{{') && title.includes('}}') && useI18n) {
            title = title.replace(/({{[\s\S]+?}})/, (m, str) =>
                str.replace(/{{([\s\S]*)}}/, (m, _) => vm.$t(_.trim()))
            );
        } else if (__titleIsFunction__) {
            title = item.meta.title;
        } else {
            title = vm.$t(item.name);
        }
    } else {
        title = (item.meta && item.meta.title) || item.name;
    }
    return title;
};

/**
 * @description 本地存储和获取标签导航列表
 */
export const setTagNavListInLocalstorage = list => {
    localStorage.tagNaveList = JSON.stringify(list);
};
/**
 * @returns {Array} 其中的每个元素只包含路由原信息中的name, path, meta三项
 */
export const getTagNavListFromLocalstorage = () => {
    const list = localStorage.tagNaveList;
    return list ? JSON.parse(list) : [];
};

/**
 * @param {Array} routers 路由列表数组
 * @description 用于找到路由列表中name为home的对象
 */
export const getHomeRoute = (routers, homeName = 'home') => {
    let i = -1;
    const len = routers.length;
    let homeRoute = {};
    while (++i < len) {
        const item = routers[i];
        if (item.children && item.children.length) {
            const res = getHomeRoute(item.children, homeName);
            if (res.name) {
                return res;
            }
        } else if (item.name === homeName) {
            homeRoute = item;
        }
    }
    return homeRoute;
};

/**
 * @param {*} list 现有标签导航列表
 * @param {*} newRoute 新添加的路由原信息对象
 * @description 如果该newRoute已经存在则不再添加
 */
export const getNewTagList = (list, newRoute) => {
    const { name, path, meta } = newRoute;
    const newList = [...list];
    if (newList.findIndex(item => item.name === name) >= 0) {
        return newList;
    }
    newList.push({ name, path, meta });
    return newList;
};

/**
 * @param {*} access 用户权限数组，如 ['super_admin', 'admin']
 * @param {*} route 路由列表
 */
const hasAccess = (access, route) => {
    if (route.meta && route.meta.access) {
        return hasOneOf(access, route.meta.access);
    }
    return true;
};

/**
 * 权鉴
 * @param {*} name 即将跳转的路由name
 * @param {*} access 用户权限数组
 * @param {*} routes 路由列表
 * @description 用户是否可跳转到该页
 */
export const canTurnTo = (name, access, routes) => {
    const routePermissionJudge = list => {
        return list.some(item => {
            if (item.children && item.children.length) {
                return routePermissionJudge(item.children);
            } else if (item.name === name) {
                return hasAccess(access, item);
            }
            return false;
        });
    };

    return routePermissionJudge(routes);
};

/**
 * @param {String} url
 * @description 从URL中解析参数
 */
export const getParams = url => {
    const keyValueArr = url.split('?')[1].split('&');
    const paramObj = {};
    keyValueArr.forEach(item => {
        const keyValue = item.split('=');
        // eslint-disable-next-line prefer-destructuring
        paramObj[keyValue[0]] = keyValue[1];
    });
    return paramObj;
};

/**
 * @param {Array} list 标签列表
 * @param {String} name 当前关闭的标签的name
 */
export const getNextRoute = (list, route) => {
    let res = {};
    if (list.length === 2) {
        res = getHomeRoute(list);
    } else {
        const index = list.findIndex(item => routeEqual(item, route));
        if (index === list.length - 1) {
            res = list[list.length - 2];
        } else {
            res = list[index + 1];
        }
    }
    return res;
};

/**
 * @param {Number} times 回调函数需要执行的次数
 * @param {Function} callback 回调函数
 */
export const doCustomTimes = (times, callback) => {
    let i = -1;
    while (++i < times) {
        callback(i);
    }
};

/**
 * @param {Object} file 从上传组件得到的文件对象
 * @returns {Promise} resolve参数是解析后的二维数组
 * @description 从Csv文件中解析出表格，解析成二维数组
 */
export const getArrayFromFile = file => {
    const nameSplit = file.name.split('.');
    const format = nameSplit[nameSplit.length - 1];
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsText(file); // 以文本格式读取
        let arr = [];
        reader.onload = function(evt) {
            const data = evt.target.result; // 读到的数据
            const pasteData = data.trim();
            arr = pasteData
                .split(/[\n\u0085\u2028\u2029]|\r\n?/g)
                .map(row => {
                    return row.split('\t');
                })
                .map(item => {
                    return item[0].split(',');
                });
            if (format === 'csv') {
                resolve(arr);
            } else {
                reject(new Error('[Format Error]:你上传的不是Csv文件'));
            }
        };
    });
};

/**
 * @param {Array} array 表格数据二维数组
 * @returns {Object} { columns, tableData }
 * @description 从二维数组中获取表头和表格数据，将第一行作为表头，用于在iView的表格中展示数据
 */
export const getTableDataFromArray = array => {
    let columns = [];
    let tableData = [];
    if (array.length > 1) {
        const titles = array.shift();
        columns = titles.map(item => {
            return {
                title: item,
                key: item
            };
        });
        tableData = array.map(item => {
            const res = {};
            item.forEach((col, i) => {
                res[titles[i]] = col;
            });
            return res;
        });
    }
    return {
        columns,
        tableData
    };
};

export const findNodeUpper = (ele, tag) => {
    if (ele.parentNode) {
        if (ele.parentNode.tagName === tag.toUpperCase()) {
            return ele.parentNode;
        }

        return findNodeUpper(ele.parentNode, tag);
    }
};

export const findNodeUpperByClasses = (ele, classes) => {
    const { parentNode } = ele;
    if (parentNode) {
        const { classList } = parentNode;
        if (classList && classes.every(className => classList.contains(className))) {
            return parentNode;
        }

        return findNodeUpperByClasses(parentNode, classes);
    }
};

export const findNodeDownward = (ele, tag) => {
    const tagName = tag.toUpperCase();
    if (ele.childNodes.length) {
        let i = -1;
        const len = ele.childNodes.length;
        while (++i < len) {
            const child = ele.childNodes[i];
            if (child.tagName === tagName) {
                return child;
            }
            return findNodeDownward(child, tag);
        }
    }
};

export const showByAccess = (access, canViewAccess) => {
    return hasOneOf(canViewAccess, access);
};

/**
 * @description 根据name/params/query判断两个路由对象是否相等
 * @param {*} route1 路由对象
 * @param {*} route2 路由对象
 */
export const routeEqual = (route1, route2) => {
    const params1 = route1.params || {};
    const params2 = route2.params || {};
    const query1 = route1.query || {};
    const query2 = route2.query || {};
    return route1.name === route2.name && objEqual(params1, params2) && objEqual(query1, query2);
};

/**
 * 判断打开的标签列表里是否已存在这个新添加的路由对象
 */
export const routeHasExist = (tagNavList, routeItem) => {
    const len = tagNavList.length;
    let res = false;
    doCustomTimes(len, index => {
        if (routeEqual(tagNavList[index], routeItem)) {
            res = true;
        }
    });
    return res;
};

export const localSave = (key, value) => {
    localStorage.setItem(key, value);
};

export const localRead = key => {
    return localStorage.getItem(key) || '';
};

// scrollTop animation
export const scrollTop = (el, from = 0, to, duration = 500, endCallback) => {
    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame
            = window.webkitRequestAnimationFrame
            || window.mozRequestAnimationFrame
            || window.msRequestAnimationFrame
            || function(callback) {
                return window.setTimeout(callback, 1000 / 60);
            };
    }
    const difference = Math.abs(from - to);
    const step = Math.ceil((difference / duration) * 50);

    const scroll = (start, end, step) => {
        if (start === end) {
            // eslint-disable-next-line no-unused-expressions
            endCallback && endCallback();
            return;
        }

        let d = start + step > end ? end : start + step;
        if (start > end) {
            d = start - step < end ? end : start - step;
        }

        if (el === window) {
            window.scrollTo(d, d);
        } else {
            el.scrollTop = d;
        }
        window.requestAnimationFrame(() => scroll(d, end, step));
    };
    scroll(from, to, step);
};

/**
 * @description 根据当前跳转的路由设置显示在浏览器标签的title
 * @param {Object} routeItem 路由对象
 * @param {Object} vm Vue实例
 */
export const setTitle = (routeItem, vm) => {
    const handledRoute = getRouteTitleHandled(routeItem);
    const pageTitle = showTitle(handledRoute, vm);
    const resTitle = pageTitle ? `${title} - ${pageTitle}` : title;
    window.document.title = resTitle;
};

/**
 *
 * @param {Object} obj
 * @param {Array<string>} keys
 * @description 只获取一个对象的置顶keys，返回一个新对象
 */
export const getKeysObject = (obj, keys) => {
    const o = {};
    keys.forEach(key => {
        if (obj[key] !== undefined && obj[key] !== null && obj[key] !== '') {
            o[key] = obj[key];
        }
    });
    return o;
};

/**
 *
 * @param {Object} data
 * @description 对一个对象里值是all的字段赋值为''，会直接修改该对象并返回
 */
export const filterOptionAll = data => {
    Object.keys({ ...data }).forEach(key => {
        if (data[key] === 'all') {
            data[key] = '';
        }
    });
    return data;
};
/**
 *
 * @param {Object} obj
 * @description 过滤一个对象的空值字段，返回一个新对象
 */
export const filterEmptyData = obj => {
    const o = {};
    Object.keys(obj).forEach(key => {
        if (obj[key] !== undefined && obj[key] !== null && obj[key] !== '') {
            o[key] = obj[key];
        }
    });
    return o;
};

/**
 *
 * @param {*} treeData  树的数组
 * @param {vm} _this vue实例
 * @param {bool} expand 是否展开
 * @description 全部展开or收起tree类型的树
 */
export const expandOrRetract = (treeData, _this, expand) => {
    for (let i = 0; i < treeData.length; i++) {
        if (treeData[i].children) {
            _this.$set(treeData[i], 'expand', expand);
            expandOrRetract(treeData[i].children, _this, expand);
        }
    }
};
