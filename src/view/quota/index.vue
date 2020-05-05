<template>
    <div class="container todos">
        <div class="header-search-wrap">
            <HeaderSearch @on-get-data="getData"></HeaderSearch>
        </div>
        <div class="header-actions">
            <Button type="primary" icon="md-add" @click="handleAddRow">新增</Button>
        </div>
        <main>
            <Table :data="data" :columns="columns" :loading="isLoading">
                <template slot="actions" slot-scope="{ row }">
                    <div class="row-actions">
                        <Button size="small" type="primary" @click="handleEditRow(row)"
                            >编辑</Button
                        >
                        <Button size="small" type="error" @click="handleDeleteRow(row)"
                            >删除</Button
                        >
                    </div>
                </template>
            </Table>
            <Row type="flex" justify="end" style="margin-top:15px">
                <Col>
                    <Page
                        :current="page"
                        :total="total"
                        :page-size="pageSize"
                        show-sizer
                        show-total
                        show-elevator
                        @on-change="handlePageChange"
                        @on-page-size-change="handlePageSizeChange"
                        :page-size-opts="[20, 50, 100]"
                /></Col>
            </Row>
        </main>
    </div>
</template>

<script>
import { getBodyDetailList, deleteBodyDetail } from '@/api/body-detail';
import dayjs from 'dayjs';
import HeaderSearch from './components/header-search';

export default {
    name: 'todos',
    components: {
        HeaderSearch
    },
    data() {
        return {
            columns: [
                {
                    title: '#',
                    type: 'index',
                    align: 'center',
                    width: 80,
                    indexMethod: row => (this.page - 1) * this.pageSize + row._index + 1
                },
                {
                    title: '脖围',
                    key: 'neck',
                    align: 'center',
                    width: 80
                },
                {
                    title: '胸围',
                    key: 'bust',
                    align: 'center',
                    minWidth: 80
                },
                {
                    title: '腰围',
                    key: 'waistline',
                    align: 'center',
                    minWidth: 80
                },
                {
                    title: '臀围',
                    key: 'hips',
                    align: 'center',
                    minWidth: 80
                },
                {
                    title: '左手围',
                    key: 'leftArm',
                    align: 'center',
                    minWidth: 80
                },
                {
                    title: '右手围',
                    key: 'rightArm',
                    align: 'center',
                    minWidth: 80
                },
                {
                    title: '左腿',
                    key: 'leftLeg',
                    align: 'center',
                    minWidth: 80
                },
                {
                    title: '右腿',
                    key: 'rightLeg',
                    align: 'center',
                    minWidth: 80
                },
                {
                    title: '记录时间',
                    key: 'publicTime',
                    align: 'center',
                    minWidth: 120,
                    render: (h, params) => {
                        if (params.row.publicTime) {
                            return h(
                                'span',
                                {},
                                dayjs(params.row.publicTime).format('YYYY-MM-DD HH:mm:ss')
                            );
                        }
                        return h('span', '');
                    }
                },
                {
                    title: '操作',
                    slot: 'actions',
                    align: 'center',
                    minWidth: 160
                }
            ],
            data: [],
            page: 1,
            pageSize: 20,
            total: 0,
            isLoading: false,
            queryInfo: {}
        };
    },
    mounted() {
        this.getData();
    },
    methods: {
        async getData(query = {}) {
            this.page = query.page || this.page;
            this.pageSize = query.pageSize || this.pageSize;
            this.queryInfo = query.queryInfo || this.queryInfo;

            try {
                this.isLoading = true;
                const queryData = {
                    currPage: this.page,
                    pageSize: this.pageSize,
                    ...this.queryInfo
                };
                // TODO:change
                const { data } = await getBodyDetailList(queryData);
                if (data.success) {
                    this.data = data.data;
                    this.total = data.data.length;
                }
            } finally {
                this.isLoading = false;
            }
        },
        handleEditRow(row) {
            this.$modal.create(
                {
                    width: '800px',
                    okText: '确定',
                    zIndex: 999,
                    title: '修改',
                    props: {
                        isEdit: true,
                        detail: row
                    },
                    component: () => import('./components/edit-modal.vue') // 引入子组件
                },
                result => {
                    // callback
                    if (result) {
                    }
                }
            );
        },
        handleAddRow() {
            this.$modal.create(
                {
                    width: '800px',
                    okText: '确定',
                    zIndex: 999,
                    title: '新增变化',
                    props: {
                        isEdit: false
                    },
                    component: () => import('./components/edit-modal.vue') // 引入子组件
                },
                result => {
                    // callback
                    if (result) {
                        this.getData();
                    }
                }
            );
        },
        handleShowRow(row) {},
        handleDeleteRow(row) {
            console.log(row);
            this.$Modal.confirm({
                title: '警告',
                content: '确实要删除此行吗？',
                onOk: () => {
                    this.deleteBodyDetail(row.id);
                }
            });
        },
        async deleteBodyDetail(id) {
            try {
                const { data } = await deleteBodyDetail(id);
                if (data.success) {
                    this.$Message.success('删除成功');
                    this.getData();
                } else {
                    this.$Message.success(data.message);
                }
            } catch (error) {
                console.log(error);
                this.$Message.warning(error.message);
            }
        },
        handlePageChange(page) {
            if (page !== this.page) {
                this.getData({ page });
            }
        },
        handlePageSizeChange(pageSize) {
            this.getData({ page: 1, pageSize });
        }
    }
};
</script>

<style lang="less" scoped>
.header-search-wrap {
    margin: 10px 0 20px;
}
.row-actions {
    button {
        margin-right: 10px;
    }
}
</style>
