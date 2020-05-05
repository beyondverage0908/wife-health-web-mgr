import dayjs from 'dayjs';
import store from '../store';

export default {
    install(Vue) {
        // ！！全局混入！！
        Vue.mixin({
            filters: {},
            methods: {
                filterDate(value) {
                    return value ? dayjs(value).format('YYYY-MM-DD') : value;
                },
                filterDateHour(value) {
                    return value ? dayjs(value).format('YYYY-MM-DD HH时') : value;
                },
                filterDateTime(value) {
                    return value ? dayjs(value).format('YYYY-MM-DD HH:mm:ss') : value;
                },
                // 检查单个按钮权限
                hasPermission(needCode) {
                    const userAccess = store.state.user.operatePrivsMap[needCode];
                    return !!userAccess;
                }
            }
        });
    }
};
