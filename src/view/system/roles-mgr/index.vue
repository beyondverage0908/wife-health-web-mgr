<template>
    <div class="container role-container" v-loading="isLoading">
        <Row :gutter="20">
            <Col :xl="9" :xxl="9">
                <Roles @on-role-change="handleRoleChange" />
            </Col>
            <Col :xl="15" :xxl="15" class="right">
                <Tabs :animated="false">
                    <TabPane name="users" label="角色用户">
                        <Users ref="users" />
                    </TabPane>
                    <TabPane name="privs" label="角色权限">
                        <Privs ref="privs" />
                    </TabPane>
                </Tabs>
            </Col>
        </Row>
    </div>
</template>
<script>
import Roles from './components/roles';
import Users from './components/users';
import Privs from './components/privs';

export default {
    name: 'roles-management',
    components: {
        Roles,
        Users,
        Privs
    },
    data() {
        return {
            isLoading: false
        };
    },
    methods: {
        async handleRoleChange(selectRoleId) {
            // 获取角色的用户/权限数据
            try {
                this.isLoading = true;
                await Promise.all([
                    this.$refs.users.changeRole(selectRoleId),
                    this.$refs.privs.changeRole(selectRoleId)
                ]);
            } finally {
                this.isLoading = false;
            }
        }
    }
};
</script>
<style lang="less" scoped>
.right {
    border-left: 1px solid #f0f2f5;
    padding-left: 20px;
}
</style>
