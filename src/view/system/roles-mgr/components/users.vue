<template>
    <div class="users">
        <header>
            <div class="actions">
                <Button
                    type="primary"
                    icon="md-add"
                    @click="handleAddUsers"
                    :disabled="!selectRoleId"
                    >添加用户</Button
                >
            </div>
        </header>
        <el-table
            :data="data"
            v-loading="isLoading"
            empty-text="没有数据，请检查是否选择角色"
            size="mini"
        >
            <el-table-column label="序号" type="index" :index="indexMethod"></el-table-column>
            <el-table-column label="用户名" prop="userName"></el-table-column>
            <el-table-column label="姓名" prop="realName"></el-table-column>
            <el-table-column label="手机" prop="phone" width="120"></el-table-column>
            <el-table-column label="邮箱" prop="email" width="200"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="{ row }">
                    <Button type="error" @click="handleDeleteRow(row)" v-if="row.sysFlag !== '1'"
                        >删除</Button
                    >
                </template>
            </el-table-column>
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
                    :page-size-opts="[20, 50, 100]"
                    transfer
                />
            </Col>
        </Row>
        <UsersModal ref="users-modal" :selectRoleId="selectRoleId" @on-get-users="getData" />
    </div>
</template>
<script>
import { deleteUserRoles } from '@/api/user';
import { getRoleUsers } from '@/api/roles';
import UsersModal from './users-modal';

export default {
    components: {
        UsersModal
    },
    data() {
        return {
            data: [],
            page: 1,
            pageSize: 20,
            total: 0,
            isLoading: false,
            selectRoleId: null // 当前选中角色id
        };
    },
    methods: {
        async getData(query = {}) {
            if (this.selectRoleId) {
                this.page = query.page || this.page;
                this.pageSize = query.pageSize || this.pageSize;

                try {
                    this.isLoading = true;
                    const { data } = await getRoleUsers({
                        roleId: this.selectRoleId,
                        currPage: this.page,
                        pageSize: this.pageSize
                    });
                    if (data.success && data.data) {
                        this.data = data.data.list;
                        this.total = data.data.totalCount;
                    }
                } finally {
                    this.isLoading = false;
                }
            } else {
                Object.assign(this, { data: [], total: 0 });
            }
        },
        async changeRole(selectRoleId) {
            this.selectRoleId = selectRoleId;
            await this.getData();
        },
        indexMethod(index) {
            return (this.page - 1) * this.pageSize + index + 1;
        },
        handlePageChange(page) {
            if (this.page === page) {
                return;
            }
            this.getData({ page });
        },
        handlePageSizeChange(pageSize) {
            this.getData({ page: 1, pageSize });
        },
        handleDeleteRow(row) {
            this.$Modal.confirm({
                title: '警告',
                content: '确定删除该用户？',
                onOk: async () => {
                    const { data } = await deleteUserRoles(row.userId, [this.selectRoleId]);
                    if (data.success && data.data) {
                        this.$Message.success('删除成功');
                        this.getData();
                    }
                }
            });
        },
        handleAddUsers() {
            if (!this.selectRoleId) {
                this.$Message.error('请先选择角色');
                return;
            }
            this.$refs['users-modal'].show();
        }
    }
};
</script>
