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
        <!-- 验证码相关 -->
        <input type="hidden" id="contextId" />
        <input type="hidden" id="accountIdHide" value="admin" />
        <div
            id="containerId"
            style="border:1px solid #d7dde4;width:100%;height:46px;margin-bottom:10px;"
        ></div>
        <!-- end -->
        <FormItem>
            <Button @click="handleSubmit" type="primary" long :loading="isLogging">登录</Button>
        </FormItem>
    </Form>
</template>
<script>
import { appContainer } from '@/libs/common-utils';
import axios from '@/libs/api.request';

let capt = null;
let timer = null;
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
                username: 'admin',
                password: ''
            },
            captchaConsolidateReq: {
                Account: 'admin',
                ContextId: '',
                ValidateResult: ''
            },
            contextId: null
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
            return;
        }
        this.getAppId();
        timer = setInterval(() => {
            this.getAppId();
        }, 1000 * 60 * 5);
    },
    methods: {
        handleSubmit() {
            this.captchaConsolidateReq.ContextId = capt && capt.getValidate().contextId;
            this.captchaConsolidateReq.ValidateResult = capt && capt.getValidate().validate;
            // TODO:启用验证码时开启必选
            if (
                !this.captchaConsolidateReq.ContextId
                || !this.captchaConsolidateReq.ValidateResult
            ) {
                console.log(this.captchaConsolidateReq);
                this.$Message.warning({
                    content: '请输入合法验证码',
                    duration: 5,
                    closable: true
                });
                return;
            }
            this.$refs.loginForm.validate(async valid => {
                if (valid) {
                    await this.$emit('on-success-valid', {
                        username: this.form.username,
                        password: this.form.password,
                        captchaConsolidateReq: this.captchaConsolidateReq
                    });
                    // 登陆成功清除定时器
                    clearInterval(timer);
                }
            });
        },
        getAppId() {
            axios
                .request({
                    url: '/sys/gencontext',
                    method: 'post',
                    data: { AppId: '201901231134', Scope: 'ICM' }
                })
                .then(
                    res => {
                        if (res.data.success === true) {
                            this.contextId = res.data.data;
                            if (this.contextId != null) {
                                this.reset();
                            }
                        }
                    },
                    err => {
                        console.log(err);
                    }
                );
        },
        // 后台二次认证后重置验证码
        reset() {
            // eslint-disable-next-line
            if (this.contextId != '') {
                capt = new EMCaptcha({
                    containerId: 'containerId',
                    appid: '201901231134',
                    captchaContextId: this.contextId,
                    product: 'float'
                })
                    .onSuccess(() => {
                        // console.log('成功');
                    })
                    .onError(() => {
                        // console.log('失败');
                    });
                const accountId = 'accountIdHide'; // 账户input控件
                // const passwordId = 'passwordId'; // 密码input控件
                // const account = !!accountId ? $('#' + accountId).val() : '';
                const account = document.getElementById(accountId).value || '';
                // const pwd = !!passwordId ? this.form.password : "";
                const pwd = '111111';
                capt.refresh(account, pwd);
            }
        }
    }
};
</script>
