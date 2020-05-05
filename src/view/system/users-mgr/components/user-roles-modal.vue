<template>
    <Modal title="权限角色" v-model="isVisible" @on-cancel="hide" :footer-hide="true">
        <el-table :data="roles" v-loading="isLoading">
            <el-table-column prop="roleName" label="角色名称"></el-table-column>
            <el-table-column prop="remark" label="角色备注"></el-table-column>
        </el-table>
        <Page
            :current="page"
            :page-size="pageSize"
            :total="total"
            show-total
            @on-change="handleRolePageChange"
            @on-page-size-change="handleRolePageSizeChange"
            style="text-align:right;margin-top:10px;"
        />
    </Modal>
</template>
<script>
import { getUserRoles } from '@/api/user';

export default {
    data() {
        return {
            roles: [],
            page: 1,
            pageSize: 20,
            total: 0,
            userId: '',
            isVisible: false,
            isLoading: false
        };
    },
    methods: {
        show(row) {
            this.userId = row.userId;
            this.isVisible = true;
            this.getRoles();
        },
        hide() {
            Object.assign(this, this.$options.data());
        },
        async getRoles(query = {}) {
            const page = query.page || this.page;
            const pageSize = query.pageSize || this.pageSize;
            try {
                this.isLoading = true;
                const { data } = await getUserRoles({
                    userId: this.userId,
                    currPage: page,
                    pageSize
                });
                if (data.success && data.data) {
                    this.roles = data.data.list;
                    this.total = data.data.totalCount;
                }
            } finally {
                this.isLoading = false;
            }
        },
        handleRolePageChange(page) {
            if (page !== this.page) {
                this.getData({ page });
            }
        },
        handleRolePageSizeChange(pageSize) {
            this.getRoles({ page: 1, pageSize });
        }
    }
};
</script>
