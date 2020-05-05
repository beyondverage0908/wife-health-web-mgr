import axios from '../libs/api.request';

export const getPrivs = query =>
    axios.request({
        url: '/privs/list',
        params: query
    });
export const addPriv = data =>
    axios.request({
        url: '/privs',
        data,
        method: 'post'
    });
export const updatePriv = data =>
    axios.request({
        url: '/privs',
        data,
        method: 'put'
    });
export const deletePriv = privId =>
    axios.request({
        url: `/privs/${privId}`,
        method: 'delete'
    });
// 获取登陆用户的菜单权限
export const getUserMenuPrivs = () =>
    axios.request({
        url: '/privs/menu'
    });
export const getUserOpreratePrivs = () =>
    axios.request({
        url: '/privs/operate'
    });
