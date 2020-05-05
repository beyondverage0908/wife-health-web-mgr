/* eslint-disable no-param-reassign */
/* eslint-disable func-names */
/* eslint-disable no-use-before-define */
import config from '@/config';

export const forEach = (arr, fn) => {
    if (!arr.length || !fn) {
        return;
    }
    let i = -1;
    const len = arr.length;
    while (++i < len) {
        const item = arr[i];
        fn(item, i, arr);
    }
};

/**
 * @param {Array} arr1
 * @param {Array} arr2
 * @description 得到两个数组的交集, 两个数组的元素为数值或字符串
 */
export const getIntersection = (arr1, arr2) => {
    const len = Math.min(arr1.length, arr2.length);
    let i = -1;
    const res = [];
    while (++i < len) {
        const item = arr2[i];
        if (arr1.indexOf(item) > -1) {
            res.push(item);
        }
    }
    return res;
};

/**
 * @param {Array} arr1
 * @param {Array} arr2
 * @description 得到两个数组的并集, 两个数组的元素为数值或字符串
 */
export const getUnion = (arr1, arr2) => {
    return Array.from(new Set([...arr1, ...arr2]));
};

/**
 * @param {Array} target 目标数组
 * @param {Array} arr 需要查询的数组
 * @description 判断要查询的数组是否至少有一个元素包含在目标数组中
 */
export const hasOneOf = (targetarr, arr) => {
    return targetarr.some(_ => arr.indexOf(_) > -1);
};

/**
 * @param {String|Number} value 要验证的字符串或数值
 * @param {*} validList 用来验证的列表
 */
export function oneOf(value, validList) {
    for (let i = 0; i < validList.length; i++) {
        if (value === validList[i]) {
            return true;
        }
    }
    return false;
}

/**
 * @param {Number} timeStamp 判断时间戳格式是否是毫秒
 * @returns {Boolean}
 */
const isMillisecond = timeStamp => {
    const timeStr = String(timeStamp);
    return timeStr.length > 10;
};

/**
 * @param {Number} timeStamp 传入的时间戳
 * @param {Number} currentTime 当前时间时间戳
 * @returns {Boolean} 传入的时间戳是否早于当前时间戳
 */
const isEarly = (timeStamp, currentTime) => {
    return timeStamp < currentTime;
};

/**
 * @param {Number} num 数值
 * @returns {String} 处理后的字符串
 * @description 如果传入的数值小于10，即位数只有1位，则在前面补充0
 */
const getHandledValue = num => {
    return num < 10 ? `0${num}` : num;
};

/**
 * @param {Number} timeStamp 传入的时间戳
 * @param {Number} startType 要返回的时间字符串的格式类型，传入'year'则返回年开头的完整时间
 */
const getDate = (timeStamp, startType) => {
    const d = new Date(timeStamp * 1000);
    const year = d.getFullYear();
    const month = getHandledValue(d.getMonth() + 1);
    const date = getHandledValue(d.getDate());
    const hours = getHandledValue(d.getHours());
    const minutes = getHandledValue(d.getMinutes());
    const second = getHandledValue(d.getSeconds());
    let resStr = '';
    if (startType === 'year') {
        resStr = `${year}-${month}-${date} ${hours}:${minutes}:${second}`;
    } else {
        resStr = `${month}-${date} ${hours}:${minutes}`;
    }
    return resStr;
};

/**
 * @param {String|Number} timeStamp 时间戳
 * @returns {String} 相对时间字符串
 */
export const getRelativeTime = timeStamp => {
    // 判断当前传入的时间戳是秒格式还是毫秒
    const IS_MILLISECOND = isMillisecond(timeStamp);
    // 如果是毫秒格式则转为秒格式
    if (IS_MILLISECOND) {
        Math.floor((timeStamp /= 1000));
    }
    // 传入的时间戳可以是数值或字符串类型，这里统一转为数值类型
    timeStamp = Number(timeStamp);
    // 获取当前时间时间戳
    const currentTime = Math.floor(Date.parse(new Date()) / 1000);
    // 判断传入时间戳是否早于当前时间戳
    const IS_EARLY = isEarly(timeStamp, currentTime);
    // 获取两个时间戳差值
    let diff = currentTime - timeStamp;
    // 如果IS_EARLY为false则差值取反
    if (!IS_EARLY) {
        diff = -diff;
    }
    let resStr = '';
    const dirStr = IS_EARLY ? '前' : '后';
    // 少于等于59秒
    if (diff <= 59) {
        resStr = `${diff}秒${dirStr}`;
    }
    // 多于59秒，少于等于59分钟59秒
    else if (diff > 59 && diff <= 3599) {
        resStr = `${Math.floor(diff / 60)}分钟${dirStr}`;
    }
    // 多于59分钟59秒，少于等于23小时59分钟59秒
    else if (diff > 3599 && diff <= 86399) {
        resStr = `${Math.floor(diff / 3600)}小时${dirStr}`;
    }
    // 多于23小时59分钟59秒，少于等于29天59分钟59秒
    else if (diff > 86399 && diff <= 2623859) {
        resStr = `${Math.floor(diff / 86400)}天${dirStr}`;
    }
    // 多于29天59分钟59秒，少于364天23小时59分钟59秒，且传入的时间戳早于当前
    else if (diff > 2623859 && diff <= 31567859 && IS_EARLY) {
        resStr = getDate(timeStamp);
    } else {
        resStr = getDate(timeStamp, 'year');
    }
    return resStr;
};

/**
 * @returns {String} 当前浏览器名称
 */
export const getExplorer = () => {
    const ua = window.navigator.userAgent;
    const isExplorer = exp => {
        return ua.indexOf(exp) > -1;
    };
    if (isExplorer('MSIE')) {
        return 'IE';
    } else if (isExplorer('Firefox')) {
        return 'Firefox';
    } else if (isExplorer('Chrome')) {
        return 'Chrome';
    } else if (isExplorer('Opera')) {
        return 'Opera';
    } else if (isExplorer('Safari')) {
        return 'Safari';
    }
};

/**
 * @description 绑定事件 on(element, event, handler)
 */
export const on = (function() {
    if (document.addEventListener) {
        return function(element, event, handler) {
            if (element && event && handler) {
                element.addEventListener(event, handler, false);
            }
        };
    }

    return function(element, event, handler) {
        if (element && event && handler) {
            element.attachEvent(`on${event}`, handler);
        }
    };
})();

/**
 * @description 解绑事件 off(element, event, handler)
 */
export const off = (function() {
    if (document.removeEventListener) {
        return function(element, event, handler) {
            if (element && event) {
                element.removeEventListener(event, handler, false);
            }
        };
    }

    return function(element, event, handler) {
        if (element && event) {
            element.detachEvent(`on${event}`, handler);
        }
    };
})();

/**
 * 判断一个对象是否存在key，如果传入第二个参数key，则是判断这个obj对象是否存在key这个属性
 * 如果没有传入key这个参数，则判断obj对象是否有键值对
 */
export const hasKey = (obj, key) => {
    if (key) {
        return key in obj;
    }

    const keysArr = Object.keys(obj);
    return keysArr.length;
};

/**
 * @param {*} obj1 对象
 * @param {*} obj2 对象
 * @description 判断两个对象是否相等，这两个对象的值只能是数字或字符串
 */
export const objEqual = (obj1, obj2) => {
    const keysArr1 = Object.keys(obj1);
    const keysArr2 = Object.keys(obj2);
    if (keysArr1.length !== keysArr2.length) {
        return false;
    } else if (keysArr1.length === 0 && keysArr2.length === 0) {
        return true;
    }

    /* eslint-disable-next-line */
    return !keysArr1.some(key => obj1[key] != obj2[key]);
};

// 转换权限数据到树
export const parsePrivsToTreeData = function(arr, parentId) {
    const result = [];
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] && arr[i].parentPrivId === parentId) {
            const node = {
                title: arr[i].privName,
                label: arr[i].privName,
                id: arr[i].privId,
                ...arr[i]
            };
            const children = parsePrivsToTreeData(arr, node.id);
            if (children.length > 0) {
                node.children = children;
            }
            result.push(node);
        }
    }
    return result;
};

// 转换权限数据到树,并和已经选择的权限比较，已选的设checked
export const parsePrivsToTreeDataWithChecked = function(arr, checkedArr, parentId) {
    const result = [];
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] && arr[i].parentPrivId === parentId) {
            const node = {
                title: arr[i].privName,
                label: arr[i].privName,
                id: arr[i].privId,
                ...arr[i]
            };
            if (checkedArr.find(item => item && item.privId === node.id)) {
                node.checked = true;
            }
            const children = parsePrivsToTreeDataWithChecked(arr, checkedArr, node.id);
            if (children.length > 0) {
                node.children = children;
            }
            result.push(node);
        }
    }
    return result;
};
/**
 *
 * @param {*} map
 * @param {*} isAdmin
 * @description 切换系统配置权限，只给isAdmin的用户
 */
function toggleSystemRoutes(map, isAdmin) {
    // 系统管理-可见的路由
    // 在config中进行配置
    const routes = config.adminRoutes || [];
    routes.forEach(name => {
        if (isAdmin) {
            if (!map[name]) {
                map[name] = {};
            }
        } else {
            delete map[name];
        }
    });
}
// 映射权限数据到路由
// 最终返回的routes是该用户有权限访问的
export function mapPrivsDataToRouter(privs, routes, isAdmin) {
    const menuMap = {};
    privs.forEach(priv => {
        if (priv.privCode && priv.privType !== 'A') {
            menuMap[priv.privCode] = {
                ...priv,
                icon: priv.privIcon,
                path: priv.privCode,
                name: priv.privCode
            };
        }
    });
    // 这里如果isAdmin===true，会把systemRoutes的权限给用户；否则移除。
    toggleSystemRoutes(menuMap, isAdmin);
    function parse(menuMap, routes) {
        const result = [];
        for (let i = 0; i < routes.length; i++) {
            const priv = menuMap[routes[i].name]; // 根据name定位
            const route = { ...routes[i] };
            // priv.isShow 可能是null，但也表示显示
            if (priv && (priv.isShow == undefined || priv.isShow)) {
                let children = [];
                if (route.children) {
                    children = parse(menuMap, route.children);
                }
                if (children.length > 0) {
                    route.children = children; // 重新赋值children，否则下一次递归会修改到原始对象
                } else {
                    // 没有children删除该字段，注意如果在routes里配置了showAlways，如果只给父级菜单权限会报错
                    // 应该至少给该菜单一个子菜单权限，因为需要读取children
                    delete route.children;
                }
                if (priv.icon) {
                    route.meta.icon = priv.icon;
                }

                result.push(route);
            }
        }
        return result;
    }

    return { routes: parse(menuMap, routes), menuMap };
}

/**
 *
 * @param {Array<any>} privs
 * @description 对权限数组映射成map
 */
export function getActionPrivsMap(privs) {
    const actionMap = {};
    /**
     * 映射结果应该是这样的,每个权限编码唯一
     * {
     *  [privCode]:true
     * }
     */
    privs.forEach(priv => {
        actionMap[priv.privCode] = true;
    });

    return actionMap;
}

/**
 *
 * @param {Array<any>} arr
 * @param {string|number} parentId
 * @description 把部门数据转化成树结构。parentId应为根节点id
 */
export const parseArrayToTreeData = function(arr, parentId) {
    const result = [];
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].parentDeptId === parentId) {
            const node = {
                title: arr[i].deptName,
                label: arr[i].deptName,
                id: arr[i].deptId,
                value: arr[i].deptId,
                expand: true,
                selected: false,
                ...arr[i]
            };
            const children = parseArrayToTreeData(arr, node.id);
            if (children.length > 0) {
                node.children = children;
            }
            result.push(node);
        }
    }
    return result;
};

export const recurToTreeData = function(arr, parentId, limit) {
    const itemArr = [];
    for (let i = 0; i < arr.length; i++) {
        const node = arr[i];
        // data.splice(i, 1)
        if (node.parentDeptId === parentId) {
            const newNode = merge({}, node);
            newNode.id = node.deptId;
            newNode.label = node.deptName;
            if (limit && newNode.deptType === 'D') {
                newNode.isDisabled = true;
            }
            if (checkIsChild(arr, node.deptId) === false) {
                if (newNode.parentDeptId === -1) {
                    newNode.isDefaultExpanded = true;
                }
                newNode.children = recurToTreeData(arr, node.deptId, limit);
            }
            itemArr.push(newNode);
        }
    }
    return itemArr;
};
export const checkIsChild = function(arr, id) {
    let isChild = true;
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].parentDeptId === id) {
            isChild = false;
            break;
        }
    }
    return isChild;
};
export const merge = function() {
    // eslint-disable-next-line prefer-rest-params
    return Object.assign.apply(this, arguments);
};
