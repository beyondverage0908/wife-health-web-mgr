// import { getParams } from '@/libs/util';
import { getSuccess, success } from './common-res';

export const login = () => {
    return getSuccess({
        deptId: 0,
        duty: '',
        phone: '',
        pwdSalt: '',
        realName: 'mock-real',
        roles: ['A'],
        state: 0,
        userId: 0,
        userName: 'mockuser',
        userPwd: ''
    });
};

export const logout = () => {
    return success;
};

export const getUserStatus = () => {
    return getSuccess({
        deptId: 0,
        duty: '',
        phone: '',
        pwdSalt: '',
        realName: 'mock-real',
        roles: ['A'],
        state: 0,
        userId: 0,
        userName: 'mockuser'
    });
};
