import axios from '../libs/api.request';

export const getOperateLogs = query =>
    axios.request({
        url: '/operate-log/page',
        params: query
    });
