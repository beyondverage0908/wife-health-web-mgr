<template>
    <div class="roles">
        <Card title="角色列表" :dis-hover="true" :bordered="false">
            <Button type="primary" @click="handleAdd">添加角色</Button>
            <Divider />
            <el-table
                :data="data"
                :highlight-current-row="true"
                :row-class-name="getRowClassName"
                @row-click="handleRowClick"
                ref="roles-table"
                v-loading="isLoading"
                size="mini"
            >
                <el-table-column prop="roleName" label="角色名称"></el-table-column>
                <!-- <el-table-column prop="roleType" label="角色类型" :formatter="roleTypeFormatter"> </el-table-column> -->
                <el-table-column prop="remark" label="角色备注"></el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="{ row }">
                        <Button
                            type="error"
                            shape="circle"
                            size="small"
                            @click.stop="handleDelete(row)"
                            icon="md-trash"
                            style="margin-right:5px"
                            v-if="row.sysFlag !== '1'"
                        ></Button>
                        <Button
                            shape="circle"
                            size="small"
                            type="warning"
                            @click.stop="handleEdit(row)"
                            icon="md-create"
                        ></Button>
                    </template>
                </el-table-column>
            </el-table>
            <Page
                :current="page"
                :page-size="pageSize"
                :total="total"
                show-total
                @on-change="handlePageChange"
                @on-page-size-change="handlePageSizeChange"
                style="text-align:right;margin-top:10px;"
            />
        </Card>
        <Modal title="编辑角色" v-model="isVisible" @on-cancel="hideModal">
            <Form ref="role-form" :model="roleForm" :label-width="100" :rules="rules">
                <FormItem label="角色名称" prop="roleName">
                    <Input v-model.trim="roleForm.roleName" />
                </FormItem>
                <FormItem label="角色备注" prop="remark" v-if="!this.editRole">
                    <Input v-model.trim="roleForm.remark" />
                </FormItem>
            </Form>
            <template slot="footer">
                <Button type="primary" @click="handleSubmit">提交</Button>
                <Button @click="hideModal">取消</Button>
            </template>
        </Modal>
    </div>
</template>
<script>
import { deleteRole, addRole, updateRole, getRoles } from '@/api/roles';

export default {
    data() {
        return {
            // 列表数据
            data: [],
            page: 1,
            pageSize: 20,
            total: 0,
            isLoading: false,
            // 表单数据
            roleForm: {
                roleName: '',
                remark: ''
            },
            rules: {
                roleName: [{ required: true, message: '该字段不能为空' }]
            },
            editRole: null, // 编辑角色
            selectRoleId: null, // 当前选中的角色id
            isVisible: false
        };
    },
    mounted() {
        this.initData();
    },
    methods: {
        async getData(query = {}) {
            const page = query.page || this.page;
            const pageSize = query.pageSize || this.pageSize;
            this.page = page;
            this.pageSize = pageSize;
            try {
                this.isLoading = true;
                const { data } = await getRoles({ currPage: page, pageSize });
                if (data.success && data.data) {
                    this.data = data.data.list.map(item => ({ ...item, disabled: false }));
                    this.total = data.data.totalCount;
                }
            } finally {
                this.isLoading = false;
            }
        },
        async initData() {
            await this.getData();
            this.toggleDefault();
        },
        handleDelete(role) {
            this.$Modal.confirm({
                title: '警告',
                content: '确定删除此角色吗？',
                onOk: async () => {
                    const { data } = await deleteRole(role.roleId);
                    if (data.success) {
                        this.$Message.success('删除成功');
                        await this.getData();
                        if (role.roleId === this.selectRoleId) {
                            this.toggleDefault();
                        }
                    }
                }
            });
        },
        handleAdd() {
            this.showModal();
        },
        getRowClassName({ row }) {
            return row.roleId === this.selectRoleId
                ? 'row-selected'
                : row.disabled
                ? 'row-disabled'
                : 'row-common';
        },
        hideModal() {
            this.$refs['role-form'].resetFields();
            this.isVisible = false;
        },
        showModal(row) {
            if (row) {
                this.editRole = row;
                this.roleForm.roleName = row.roleName;
            } else {
                this.editRole = null;
            }
            this.isVisible = true;
        },
        handleEdit(row) {
            this.showModal(row);
        },
        async handleSubmit() {
            const valid = await this.$refs['role-form'].validate();
            if (valid) {
                const formData = { ...this.roleForm };
                let data = {};
                if (this.editRole) {
                    const { data: tmpData } = await updateRole({
                        ...formData,
                        roleId: this.editRole.roleId
                    });
                    data = tmpData;
                } else {
                    // 添加角色
                    const { data: tmpData } = await addRole(formData);
                    data = tmpData;
                }
                if (data.success) {
                    this.$Message.success(this.editRole ? '更新成功' : '添加成功');
                    this.getData();
                    this.hideModal();
                }
            }
        },
        handleRowClick(currentRow) {
            this.selectRoleId = currentRow ? currentRow.roleId : null;
            this.$refs['roles-table'].setCurrentRow(currentRow);
            this.$emit('on-role-change', currentRow ? currentRow.roleId : null);
        },
        handlePageChange(page) {
            if (page !== this.page) {
                this.getData({ page });
            }
        },
        handlePageSizeChange(pageSize) {
            this.getData({ page: 1, pageSize });
        },
        toggleDefault() {
            // 默认选择第一个角色
            if (this.data.length > 0) {
                this.handleRowClick(this.data[0]);
            } else {
                this.handleRowClick(null);
            }
        }
    }
};
</script>
<style>
.el-table__body tr.row-selected > td {
    background: #fedbd0;
}
.el-table__body tr.row-selected:hover > td {
    background: #fedbd0;
}
.el-table__body tr.row-common > td {
    background: #fff;
}
</style>
<style lang="less">
.el-table tr.row-disabled {
    background: #eee;
    // pointer-events: none; // ie11+
    cursor: not-allowed;
}
</style>
