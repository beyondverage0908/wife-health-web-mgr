export const assign = (originObj, fromObj) => {
    // 只修改源对象有的属性，会修改源对象
    Object.keys(originObj).forEach(key => {
        originObj[key] = fromObj[key] || undefined;
    });
};
/**
 *
 * @param {Array<Object>} sourceObject
 * @param {array} keys
 * @description 获取原对象属性，不需要keys的属性
 */
export const assignWithOutKeys = (sourceObject, keys) => {
    const target = {};
    Object.assign(target, sourceObject);
    keys.forEach(key => {
        delete target[key];
    });
    return target;
};
/**
 *
 * @param {Array<Object>} sourceObject
 * @param {array} keys
 * @description 获取原对象属性，只需要keys的属性
 */
export const assignWithKeys = (sourceObject, keys) => {
    const target = {};
    keys.forEach(key => {
        if (sourceObject[key] !== void 0) {
            target[key] = sourceObject[key];
        }
    });
    return target;
};
