<template>
    <Modal title="修改密码" v-model="isVisible" @on-cancel="hide">
        <Form :model="form" ref="form" :label-width="100" :rules="rules">
            <FormItem label="旧密码" prop="oldPwd">
                <Input type="password" password v-model="form.oldPwd" autocomplete="off" />
            </FormItem>
            <FormItem label="新密码" prop="newPwd">
                <Input type="password" password v-model="form.newPwd" autocomplete="off" />
            </FormItem>
            <FormItem label="确认新密码" prop="checkNewPwd">
                <Input type="password" password v-model="form.checkNewPwd" autocomplete="off" />
            </FormItem>
        </Form>
        <template slot="footer">
            <Button @click="handleSubmit" type="primary">提交</Button>
            <Button @click="hide">取消</Button>
        </template>
    </Modal>
</template>
<script>
import { mapActions } from 'vuex';
import { updatePassword } from '@/api/user';

export default {
    data() {
        const validatePassCheck = (rule, value, callback) => {
            if (value.length === 0) {
                callback(new Error('不能为空'));
            } else if (value !== this.form.newPwd) {
                callback(new Error('两次密码输入不一致'));
            } else {
                callback();
            }
        };
        // const validPwd = (rule, value, callback) => {
        //     const regAlpha = /[a-zA-Z]+/;
        //     const regNum = /[0-9]+/;
        //     if (value.length === 0) {
        //         callback(new Error('新密码不能为空'));
        //     } else if (!(regAlpha.test(value) && regNum.test(value)) || value.length < 8) {
        //         callback(new Error('字母+数字，不少于8位'));
        //     } else {
        //         callback();
        //     }
        // };
        return {
            form: {
                oldPwd: '',
                newPwd: '',
                checkNewPwd: ''
            },
            rules: {
                oldPwd: [{ required: true, message: '旧密码不能为空' }],
                newPwd: [{ required: true, message: '新密码不能为空' }],
                checkNewPwd: [
                    { required: true, message: '确认密码不能为空' },
                    { validator: validatePassCheck }
                ]
            },
            isVisible: false
        };
    },
    methods: {
        ...mapActions(['handleLogOut']),
        hide() {
            this.$refs.form.resetFields();
            this.isVisible = false;
        },
        show() {
            this.isVisible = true;
        },
        async handleSubmit() {
            const valid = await this.$refs.form.validate();
            if (valid) {
                const { data } = await updatePassword({
                    oldPwd: this.form.oldPwd,
                    newPwd: this.form.newPwd
                });
                if (data.success && data.data) {
                    this.$Message.success('修改成功！请重新登陆');
                    this.handleLogOut();
                }
            }
        }
    }
};
</script>
