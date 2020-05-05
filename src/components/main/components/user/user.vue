<template>
    <div class="user-avatar-dropdown">
        <Dropdown @on-click="handleClick">
            <Avatar style="background-color: #87d068;margin-right:5px;" :title="userInfo.realName">
                {{ userInfo.userName && userInfo.userName[0] }}</Avatar
            >
            <span>{{ userInfo.userName }}</span>
            <Icon :size="18" type="md-arrow-dropdown"></Icon>
            <DropdownMenu slot="list">
                <DropdownItem name="change-log">更新日志</DropdownItem>
                <DropdownItem name="change-password">修改密码</DropdownItem>
                <DropdownItem name="logout">退出登录</DropdownItem>
            </DropdownMenu>
        </Dropdown>
        <ChangePwdModal ref="change-pwd-modal" />
    </div>
</template>

<script>
import './user.less';
import { mapActions } from 'vuex';
import ChangePwdModal from './change-password-modal';

export default {
    name: 'User',
    components: {
        ChangePwdModal
    },
    props: {
        userAvatar: {
            type: String,
            default: ''
        },
        messageUnreadCount: {
            type: Number,
            default: 0
        }
    },
    computed: {
        userInfo() {
            return this.$store.state.user.userInfo;
        }
    },
    methods: {
        ...mapActions(['handleLogOut']),
        logout() {
            this.handleLogOut().then(() => {
                this.$router.push({
                    name: 'login'
                });
            });
        },
        handleClick(name) {
            switch (name) {
                case 'logout':
                    this.logout();
                    break;
                case 'change-log':
                    this.$router.push({ name: 'change-log' });
                    break;
                case 'change-password': {
                    this.$refs['change-pwd-modal'].show();
                    break;
                }
                default:
                    break;
            }
        }
    }
};
</script>
