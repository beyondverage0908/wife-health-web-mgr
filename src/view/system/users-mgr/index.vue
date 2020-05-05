<template>
    <div class="container user-table">
        <header>
            <Form :label-width="50">
                <Row :gutter="10">
                    <Col :span="5">
                        <FormItem label="关键字" style="margin:0">
                            <Input v-model.trim="queryForm.keyword" placeholder="用户名、姓名" />
                        </FormItem>
                    </Col>
                    <Col :span="4">
                        <Button type="primary" @click="handleSearch">查询</Button>
                    </Col>
                </Row>
            </Form>
        </header>
        <div class="header-actions">
            <Button @click="handleAdd" type="primary" icon="md-add" style="margin-right:10px;"
                >新建用户</Button
            >
        </div>
        <main>
            <el-table :data="data" v-loading="isLoading" size="mini">
                <el-table-column label="序号" type="index" :index="indexMethod"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="{ row }">
                        <Dropdown transfer @on-click="handleAction($event, row)" size="small">
                            <Button type="primary" size="small">
                                操作
                                <Icon type="ios-arrow-down"></Icon>
                            </Button>
                            <DropdownMenu slot="list">
                                <DropdownItem name="basic">编辑基本信息</DropdownItem>
                                <DropdownItem name="reset-password">重置密码</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </template>
                </el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="{ row }">
                        <i-switch
                            :true-value="0"
                            :false-value="1"
                            :value="row.state"
                            :before-change="changeUserStatus(row)"
                            :loading="row.isLoading"
                            v-if="row.sysFlag != 1"
                        ></i-switch>
                    </template>
                </el-table-column>
                <el-table-column label="用户名" prop="userName"></el-table-column>
                <el-table-column label="姓名" prop="realName"></el-table-column>
                <el-table-column label="手机" prop="phone"></el-table-column>
                <el-table-column label="邮箱" prop="email" width="200px"></el-table-column>
                <el-table-column label="角色">
                    <template slot-scope="{ row }">
                        <a @click="handleShowUserRoles(row)">查看</a>
                    </template>
                </el-table-column>
                <el-table-column label="权限">
                    <template slot-scope="{ row }">
                        <a @click="handleShowUserPrivs(row)">查看</a>
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
            <EditModal ref="edit-modal" @on-get-data="getData" />
            <UserRolesModal ref="user-roles-modal" />
            <UserPrivsModal ref="user-privs-modal" />
        </main>
    </div>
</template>
<script>
import EditModal from './components/edit-modal';
import UserRolesModal from './components/user-roles-modal';
import UserPrivsModal from './components/privs-modal';
import { resetPassword, changeUserStatus, getUsers } from '@/api/user';
import { filterEmptyData } from '@/libs/util';

export default {
    components: {
        EditModal,
        UserRolesModal,
        UserPrivsModal
    },
    data() {
        return {
            queryForm: {
                // 搜索条件
                keyword: ''
            },
            data: [], // 部门普通用户
            page: 1,
            pageSize: 20,
            total: 0,
            isLoading: false
        };
    },
    mounted() {
        this.getData();
    },
    methods: {
        indexMethod(index) {
            return (this.page - 1) * this.pageSize + index + 1;
        },
        async getData(query = {}) {
            this.page = query.page || this.page;
            this.pageSize = query.pageSize || this.pageSize;
            this.data = [];
            this.total = 0;
            try {
                this.isLoading = true;
                const queryData = {
                    currPage: this.page,
                    pageSize: this.pageSize,
                    ...this.queryForm
                };
                const res = await getUsers(filterEmptyData(queryData));
                const { data } = res;
                if (data.success && data.data) {
                    this.data = data.data.list;
                    this.total = data.data.totalCount;
                }
            } finally {
                this.isLoading = false;
            }
        },
        handleAdd() {
            this.$refs['edit-modal'].show();
        },
        handleSearch() {
            this.getData({ page: 1 });
        },
        async handleAction(name, row) {
            switch (name) {
                case 'basic': {
                    this.$refs['edit-modal'].show(row);
                    break;
                }
                case 'reset-password': {
                    const { data } = await resetPassword(row.userId);
                    if (data.success && data.data) {
                        this.$Message.success({
                            content: '重置密码成功,默认密码为Abce1234',
                            closable: true,
                            duration: 10
                        });
                        this.getData();
                    }
                    break;
                }
                default:
                    break;
            }
        },
        handlePageChange(page) {
            if (page !== this.page) {
                this.getData({ page });
            }
        },
        handlePageSizeChange(pageSize) {
            this.getData({ page: 1, pageSize });
        },
        handleShowUserRoles(row) {
            this.$refs['user-roles-modal'].show(row);
        },
        handleShowUserPrivs(row) {
            this.$refs['user-privs-modal'].show(row);
        },
        changeUserStatus(row) {
            return () => {
                return new Promise(resolve => {
                    this.$set(row, 'isLoading', true);
                    changeUserStatus(row.userId, row.state == 0 ? 1 : 0)
                        .then(({ data }) => {
                            if (data.success) {
                                resolve();
                                this.$Message.success(row.state == 0 ? '禁用成功' : '启用成功');
                                this.$set(row, 'state', row.state == 1 ? 0 : 1);
                            }
                        })
                        .catch(e => {
                            this.$Message.error(e.message || '脚本错误');
                        })
                        .then(() => {
                            this.$set(row, 'isLoading', false);
                        });
                });
            };
        }
    }
};
</script>
