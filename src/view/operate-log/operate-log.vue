<template>
    <div class="container operate-container">
        <header class="search">
            <Form :label-width="100" label-position="left">
                <Row :gutter="15">
                    <Col :xl="7" :xxl="5"
                        ><FormItem label="操作描述"> <Input v-model.trim="operDesc"/></FormItem
                    ></Col>
                    <Col :xl="7" :xxl="5"
                        ><FormItem label="ip地址"> <Input v-model.trim="operIp"/></FormItem
                    ></Col>
                    <Col :xl="7" :xxl="5"
                        ><FormItem label="操作方法"> <Input v-model.trim="operMethod"/></FormItem
                    ></Col>
                    <Col :xl="2" :xxl="2">
                        <Button type="primary" @click="handleSearch">查询</Button></Col
                    >
                </Row>
            </Form>
        </header>
        <main>
            <Table size="small" :data="data" :columns="columns" :loading="isLoading" border />
            <Page
                :current="page"
                :page-size="pageSize"
                :total="total"
                @on-change="handlePageChange"
                @on-page-size-change="handlePageSizeChange"
                show-total
                show-elevator
                show-sizer
                style="text-align:right;margin-top:20px;"
                :page-size-opts="[20, 50, 100]"
            />
        </main>
    </div>
</template>
<script>
import { getOperateLogs } from '@/api/operate';

export default {
    data() {
        return {
            data: [],
            page: 1,
            pageSize: 20,
            total: 0,
            isLoading: false,
            operDesc: '',
            operIp: '',
            operMethod: '',
            columns: [
                {
                    title: '序号',
                    type: 'index',
                    width: 70,
                    align: 'center',
                    indexMethod: row => (this.page - 1) * this.pageSize + row._index + 1
                },
                {
                    title: '操作方法',
                    key: 'operMethod',
                    minWidth: 200,
                    ellipsis: true,
                    tooltip: true
                },
                {
                    title: 'ip地址',
                    key: 'operIp',
                    width: 100
                },
                {
                    title: '操作描述',
                    key: 'operDesc',
                    minWidth: 130,
                    ellipsis: true,
                    tooltip: true
                },
                {
                    title: '请求类型',
                    key: 'requestMethod',
                    minWidth: 100
                },
                {
                    title: '请求路径',
                    key: 'requestUri',
                    minWidth: 200,
                    ellipsis: true,
                    tooltip: true
                },
                {
                    title: '用户标识',
                    key: 'userAgent',
                    minWidth: 200,
                    ellipsis: true,
                    tooltip: true
                },
                {
                    title: '操作用户',
                    key: 'createByUserName',
                    minWidth: 100
                },
                {
                    title: '设备名称',
                    key: 'operSysName',
                    minWidth: 100
                },
                {
                    title: '浏览器名称',
                    key: 'browserName',
                    minWidth: 100
                },
                {
                    title: '操作时间',
                    key: 'createTime',
                    minWidth: 149
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
            this.page = page;
            this.pageSize = pageSize;

            try {
                this.isLoading = true;
                const { data } = await getOperateLogs({
                    currPage: page,
                    pageSize,
                    operDesc: this.operDesc,
                    operIp: this.operIp,
                    operMethod: this.operMethod
                });
                if (data.success && data.data) {
                    const { list } = data.data;
                    this.data = list;
                    this.total = data.data.totalCount;
                }
            } finally {
                this.isLoading = false;
            }
        },
        handlePageChange(page) {
            if (page !== this.page) {
                this.getData({ page });
            }
        },
        handlePageSizeChange(pageSize) {
            this.getData({ pageSize, page: 1 });
        },
        handleSearch() {
            this.getData({ page: 1 });
        }
    }
};
</script>
