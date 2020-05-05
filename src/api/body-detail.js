import axios from '@/libs/api.request';

// 获取列表
export const getBodyDetailList = () =>
    axios.request({
        url: '/bodydetail/list',
        method: 'get'
    });

// 新增
export const addBodyDetail = params =>
    axios.request({
        url: '/bodydetail/add',
        method: 'post',
        data: params
    });

// 更新
export const updateBodyDetail = params =>
    axios.request({
        url: '/bodydetail/update',
        method: 'put',
        data: params
    });

// 删除
export const deleteBodyDetail = id =>
    axios.request({
        url: `/bodydetail/${id}`,
        method: 'delete'
    });
