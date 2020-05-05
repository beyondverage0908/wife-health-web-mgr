<template>
    <Form ref="loginForm" :model="form" :rules="rules" @keydown.enter.native="handleSubmit">
        <FormItem prop="username">
            <Input v-model="form.username" placeholder="请输入用户名">
                <span slot="prepend">
                    <Icon :size="16" type="ios-person"></Icon>
                </span>
            </Input>
        </FormItem>
        <FormItem prop="password">
            <Input type="password" password v-model="form.password" placeholder="请输入密码">
                <span slot="prepend">
                    <Icon :size="14" type="md-lock"></Icon>
                </span>
            </Input>
        </FormItem>
        <FormItem>
            <Button @click="handleSubmit" type="primary" long :loading="isLogging">登录</Button>
        </FormItem>
    </Form>
</template>
<script>
import { appContainer } from '@/libs/common-utils';

export default {
    name: 'LoginForm',
    props: {
        usernameRules: {
            type: Array,
            default: () => {
                return [{ required: true, message: '账号不能为空', trigger: 'blur' }];
            }
        },
        passwordRules: {
            type: Array,
            default: () => {
                return [{ required: true, message: '密码不能为空', trigger: 'blur' }];
            }
        },
        isLogging: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            form: {
                username: '18516133629',
                password: 'abcdefg369258'
            }
        };
    },
    computed: {
        rules() {
            return {
                username: this.usernameRules,
                password: this.passwordRules
            };
        }
    },
    mounted() {
        if (appContainer.isRebuild) {
            // 如果是重新构建app，不再生产验证码
            console.log('rebuild');
            appContainer.isRebuild = false;
        }
    },
    methods: {
        handleSubmit() {
            this.$refs.loginForm.validate(async valid => {
                if (valid) {
                    await this.$emit('on-success-valid', {
                        username: this.form.username,
                        password: this.form.password
                    });
                }
            });
        }
    }
};
</script>
