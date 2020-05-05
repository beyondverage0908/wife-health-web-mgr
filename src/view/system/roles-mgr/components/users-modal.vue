<template>
    <Modal v-model="isVisible" width="800" title="添加用户" @on-cancel="hide">
        <div class="search-wrap">
            <Form :label-width="80" @submit.native.prevent>
                <Row :gutter="10">
                    <Col :span="12">
                        <FormItem label="关键词">
                            <Input v-model.trim="keyword" />
                        </FormItem>
                    </Col>
                    <Col :span="4">
                        <Button type="primary" @click="handleSearch">查询</Button>
                    </Col>
                </Row>
            </Form>
        </div>
        <el-table
            :data="data"
            v-loading="isLoading"
            @selection-change="handleSelectionChange"
            max-height="400"
            size="small"
        >
            <el-table-column type="selection"></el-table-column>
            <el-table-column label="用户名" prop="userName"></el-table-column>
            <el-table-column label="姓名" prop="realName"></el-table-column>
            <el-table-column label="rtx工号" prop="workNo"></el-table-column>
            <el-table-column label="手机" prop="phone"></el-table-column>
            <el-table-column label="邮箱" prop="email"></el-table-column>
        </el-table>
        <Row type="flex" justify="end" style="margin-top:10px">
            <Col>
                <Page
                    :current="page"
                    :page-size="pageSize"
                    :total="total"
                    show-sizer
                    show-elevator
                    show-total
                    @on-change="handlePageChange"
                    @on-page-size-change="handlePageSizeChange"
                    :page-size-opts="[10, 50, 100]"
                />
            </Col>
        </Row>
        <template slot="footer">
            <Button type="primary" @click="handleAdd" :loading="submitting">添加</Button>
            <Button @click="hide">取消</Button>
        </template>
    </Modal>
</template>
<script>
import { getUsersNotInRole, addRoleUsers } from '@/api/roles';

export default {
    props: {
        selectRoleId: {
            type: [String, Number],
            default: ''
        }
    },
    data() {
        return {
            isVisible: false,
            selectedUserIds: [],
            data: [],
            page: 1,
            pageSize: 10,
            total: 0,
            isLoading: false,
            userId: '',
            keyword: '',
            submitting: false
        };
    },
    methods: {
        show() {
            this.getData();
            this.isVisible = true;
        },
        hide() {
            Object.assign(this, this.$options.data());
        },
        async getData(query = {}) {
            const page = query.page || this.page;
            const pageSize = query.pageSize || this.pageSize;
            const keyword = query.keyword || this.keyword;
            this.page = page;
            this.pageSize = pageSize;
            try {
                this.isLoading = true;
                const { data } = await getUsersNotInRole({
                    roleId: this.selectRoleId,
                    currPage: page,
                    pageSize,
                    keyword
                });
                if (data.success && data.data) {
                    this.data = data.data.list;
                    this.total = data.data.totalCount;
                }
            } finally {
                this.isLoading = false;
            }
        },
        handleSearch() {
            this.getData({ page: 1, keyword: this.keyword });
        },
        async handleAdd() {
            if (this.selectedUserIds.length === 0) {
                this.$Message.error('请先选择用户');
                return;
            }

            try {
                this.submitting = true;
                const { data } = await addRoleUsers(this.selectRoleId, this.selectedUserIds);
                if (data.success && data.data) {
                    this.$Message.success('添加成功');
                    // store.getUsers();
                    this.$emit('on-get-users'); // 重新获取用户
                    this.hide();
                }
            } finally {
                this.submitting = false;
            }
        },
        handleSelectionChange(val) {
            this.selectedUserIds = val.map(item => item.userId);
        },
        handlePageChange(page) {
            if (this.page === page) {
                return;
            }
            this.getData({ page });
        },
        handlePageSizeChange(pageSize) {
            this.getData({ page: 1, pageSize });
        }
    }
};
</script>
