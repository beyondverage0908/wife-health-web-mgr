import qs from 'qs';
import axios from '@/libs/api.request';
/**
 *
 * @param {{username:string,password:string}} {username,password}
 *
 */
export const login = ({ username, password }) => {
    const data = {
        username,
        password
    };
    return axios.request({
        url: '/sys/login',
        data,
        method: 'post'
    });
};

export const logout = () => {
    return axios.request({
        url: '/sys/logout'
    });
};
// 获取当前用户信息
export const getUserStatus = () =>
    axios.request({
        url: '/users/cur-user'
    });

// 更新密码
export const updatePassword = data =>
    axios.request({
        url: '/users/password',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: qs.stringify(data),
        method: 'post'
    });

/**
 *
 * @param {string|number} userId
 * @description 重置密码
 */
export const resetPassword = userId =>
    axios.request({
        url: `/users/${userId}/reset-pwd`,
        method: 'post'
    });

export const addUser = data =>
    axios.request({
        url: '/users',
        data,
        method: 'post'
    });
// 分页查询用户列表
export const getUsers = query =>
    axios.request({
        url: '/users/page',
        params: query
    });
// 查询全部用户
export const getUsersList = query =>
    axios.request({
        url: '/users',
        params: query
    });
export const getDeptUsers = query => {
    const { deptId } = query;
    delete query.deptId;
    return axios.request({
        url: `/depts/${deptId}/users`,
        params: query
    });
};
// 更新用户
export const updateUser = data => {
    const { userId } = data;
    delete data.userId;
    return axios.request({
        url: `/users/${userId}`,
        data,
        method: 'put'
    });
};

export const changeUserStatus = (userId, state) =>
    axios.request({
        url: `/users/${userId}/state`,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: qs.stringify({ state }),
        // data: { state },
        method: 'post'
    });

export const getUserPrivs = userId =>
    axios.request({
        url: `/users/${userId}/privs`
    });

// 获取某个用户的角色
// 查询用户角色
export const getUserRoles = ({ userId, currPage, pageSize }) =>
    axios.request({
        url: `/users/${userId}/roles`,
        params: {
            currPage,
            pageSize,
            isUserRole: 1
        }
    });

// 给用户添加一些角色
export const addUserRoles = (userId, roleIds) =>
    axios.request({
        url: `/users/${userId}/roles`,
        data: roleIds,
        method: 'post'
    });
// 删除用户的一些角色
export const deleteUserRoles = (userId, roleIds) =>
    axios.request({
        url: `/users/${userId}/roles`,
        data: roleIds,
        method: 'delete'
    });
