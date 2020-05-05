import Mock from 'mockjs';
import { login, logout, getUserStatus } from './login';
// import { success, getSuccess } from './common-res';

// 配置Ajax请求延时，可用来测试网络延迟大时项目中一些效果
Mock.setup({
    timeout: 100
});

// 登录相关和获取用户信息
Mock.mock(/\/sys\/login/, login);
Mock.mock(/\/sys\/logout/, logout);
Mock.mock(/\/users\/cur-user/, getUserStatus); // 获取当前登陆用户

Mock.mock(/\/systems\/env/, {
    success: true,
    data: 'mock'
});
export default Mock;
