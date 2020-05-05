<template>
    <div class="container options-mgr-table">
        <div class="header-search-wrap">
            <HeaderSearch @on-get-data="getData"></HeaderSearch>
        </div>

        <main>
            <Table border :data="data" :columns="columns" :loading="isLoading">
                <template slot="actions" slot-scope="{ row }">
                    <div class="row-actions">
                        <Button size="small" type="primary" @click="handleEditRow(row)"
                            >编辑</Button
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
                        @on-change="handlePageChange"
                        @on-page-size-change="handlePageSizeChange"
                        :page-size-opts="[20, 50, 100]"
                /></Col>
            </Row>
        </main>
        <EditModal ref="edit-modal" @on-get-data="getData" />
    </div>
</template>

<script>
import { getConfigs } from '@/api/configs';
import HeaderSearch from './components/header-search';
import EditModal from './components/edit-modal';

export default {
    name: 'options-mgr-table',
    components: {
        HeaderSearch,
        EditModal
    },
    data() {
        return {
            data: [],
            page: 1,
            pageSize: 20,
            total: 0,
            isLoading: false,
            queryInfo: {},
            columns: [
                {
                    title: '配置名称',
                    key: 'configName',
                    align: 'center',
                    minWidth: 100
                },
                {
                    title: '配置编码',
                    key: 'configCode',
                    align: 'center',
                    minWidth: 100
                },
                {
                    title: '描述',
                    key: 'configDesc',
                    align: 'center',
                    minWidth: 100
                },
                {
                    title: '操作',
                    slot: 'actions',
                    align: 'center',
                    minWidth: 80
                }
            ]
        };
    },
    mounted() {
        this.getData();
    },
    methods: {
        async getData(query = {}) {
            const page = query.page || this.page;
            const pageSize = query.pageSize || this.pageSize;
            const queryInfo = query.queryInfo || this.queryInfo;
            this.page = page;
            this.pageSize = pageSize;
            this.queryInfo = queryInfo;
            try {
                this.isLoading = true;
                const queryData = {
                    currPage: page,
                    pageSize,
                    ...queryInfo
                };
                const { data } = await getConfigs(queryData);
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
