import axios from '@/libs/api.request';
// 添加系统配置
export const addConfig = data =>
    axios.request({
        url: 'configs',
        data,
        method: 'post'
    });

export const getConfigs = query =>
    axios.request({
        url: '/configs/page',
        params: query
    });
export const getConfigByCode = configCode =>
    axios.request({
        url: `/configs/${configCode}`
    });
export const getConfigsBatch = configCodes =>
    axios.request({
        url: '/configs/codes',
        method: 'post',
        data: {
            configCodes
        }
    });
export const updateConfigsBatch = data =>
    axios.request({
        url: '/configs/update-configs',
        method: 'post',
        data
    });
export const updateConfigByCode = data => {
    const { configCode } = data;
    delete data.configCode;
    return axios.request({
        url: `/configs/${configCode}`,
        data,
        method: 'put'
    });
};
