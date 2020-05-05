<style lang="less">
@import './login.less';
</style>

<template>
    <div class="login">
        <div class="login-con">
            <Card icon="log-in" title="欢迎登录" :bordered="false">
                <div class="form-con">
                    <login-form
                        ref="login-form"
                        @on-success-valid="handleSubmit"
                        :isLogging="isLogging"
                    ></login-form>
                </div>
            </Card>
        </div>
    </div>
</template>

<script>
import LoginForm from '_c/login-form';
import { mapActions } from 'vuex';

export default {
    components: {
        LoginForm
    },
    data() {
        return {
            isLogging: false
        };
    },
    methods: {
        ...mapActions(['handleLogin']),
        async handleSubmit({ username, password }) {
            try {
                this.isLogging = true;
                const isLogged = await this.handleLogin({ username, password });
                if (isLogged) {
                    this.$router.push({
                        name: this.$config.homeName
                    });
                } else {
                    this.$refs['login-form'].getAppId();
                }
            } finally {
                this.isLogging = false;
            }
        }
    }
};
</script>
