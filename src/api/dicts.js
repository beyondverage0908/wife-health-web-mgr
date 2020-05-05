import axios from '../libs/api.request';
// 根据字典类型获取字典列表
export const getDicts = types =>
    axios.request({
        url: '/dicts/types',
        data: types,
        method: 'post'
    });

export const addDict = data =>
    axios.request({
        url: '/dicts',
        data,
        method: 'post'
    });
export const deleteDict = dictId =>
    axios.request({
        url: `/dicts/child/${dictId}`,
        method: 'delete'
    });

export const updateDict = data =>
    axios.request({
        url: '/dicts',
        method: 'put',
        data
    });
// 获取字典项（父类）
export const getDictsParentList = query =>
    axios.request({
        url: '/dicts/parent-list',
        params: query
    });
export const deleteDictsParent = parentId =>
    axios.request({
        url: `/dicts/${parentId}`,
        method: 'delete'
    });
// 根据字典类型获取字典子列表
export const getDictsType = type =>
    axios.request({
        url: `/dicts/${type}`
    });
// 根据字典类型获取本地缓存的字典子列表
export const getDictsLocalType = type =>
    axios.request({
        url: `/dicts/local/${type}`
    });
