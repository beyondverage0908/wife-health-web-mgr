<template>
    <div class="container todos">
        <div class="header-search-wrap">
            <HeaderSearch @on-get-data="getData"></HeaderSearch>
        </div>
        <div class="header-actions">
            <Button type="primary" icon="md-add" @click="handleAddRow">新增</Button>
        </div>
        <main>
            <Table border :data="data" :columns="columns" :loading="isLoading">
                <template slot="actions" slot-scope="{ row }">
                    <div class="row-actions">
                        <Button size="small" type="primary" @click="handleShowRow(row)"
                            >查看</Button
                        >
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
        <EditModal ref="edit-modal" />
    </div>
</template>

<script>
import HeaderSearch from './components/header-search';
import EditModal from './components/edit-modal';
// 假的
const getTodos = () => {
    return {
        data: {
            success: true,
            data: {
                list: [
                    {
                        id: 1,
                        title: 'aa',
                        author: 'james'
                    }
                ],
                totalCount: 1
            }
        }
    };
};
export default {
    name: 'todos',
    components: {
        HeaderSearch,
        EditModal
    },
    data() {
        return {
            columns: [
                {
                    title: '序号',
                    type: 'index',
                    align: 'center',
                    width: 70,
                    indexMethod: row => (this.page - 1) * this.pageSize + row._index + 1
                },
                {
                    title: 'id',
                    key: 'id',
                    align: 'center',
                    width: 70
                },
                {
                    title: '标题',
                    key: 'title',
                    align: 'center',
                    maxWidth: 500,
                    minWidth: 200
                },
                {
                    title: '作者',
                    key: 'author',
                    align: 'center'
                },
                {
                    title: '操作',
                    slot: 'actions',
                    align: 'center',
                    minWidth: 80
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
                const { data } = await getTodos(queryData);
                if (data.success) {
                    this.data = data.data.list;
                    this.total = data.data.totalCount;
                }
            } finally {
                this.isLoading = false;
            }
        },
        handleEditRow(row) {
            this.$refs['edit-modal'].show(row);
        },
        handleAddRow() {
            this.$refs['edit-modal'].show();
        },
        handleShowRow(row) {
            this.$refs['edit-modal'].show(row, true);
        },
        handleDeleteRow(row) {
            console.log(row);
            this.$Modal.confirm({
                title: '警告',
                content: '确实要删除此行吗？',
                onOk: () => {
                    this.$Message.success('删除成功');
                }
            });
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
