import axios from '@/libs/api.request';

export const getEnv = () =>
    axios.request({
        url: '/systems/active-profile'
    });
