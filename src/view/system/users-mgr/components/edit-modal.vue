<template>
    <Modal title="用户基本信息" v-model="isVisible" @on-cancel="hide">
        <Form ref="form" :model="form" :rules="rules" :label-width="100" label-position="left">
            <!-- 阻止自动保存密码时自动填入 -->
            <div class="hidden">
                <input type="text" />
                <input type="password" />
            </div>
            <Row :gutter="10" type="flex">
                <Col :span="12">
                    <FormItem label="用户名" prop="userName">
                        <Input v-model.trim="form.userName" />
                    </FormItem>
                </Col>
                <Col :span="12">
                    <FormItem label="姓名" prop="realName">
                        <Input v-model.trim="form.realName" />
                    </FormItem>
                </Col>
                <!-- 新建时才显示密码框 -->
                <Col :span="12" v-if="!this.userId">
                    <FormItem label="密码" prop="userPwd">
                        <Input v-model="form.userPwd" type="password" />
                    </FormItem>
                </Col>
                <Col :span="12">
                    <FormItem label="手机号码" prop="phone">
                        <Input v-model.trim="form.phone" />
                    </FormItem>
                </Col>
                <Col :span="12">
                    <FormItem label="邮箱地址" prop="email">
                        <Input v-model.trim="form.email" />
                    </FormItem>
                </Col>
            </Row>
        </Form>
        <template slot="footer">
            <Button type="primary" @click="handleSubmit" :loading="submitting">提交</Button>
            <Button @click="hide">取消</Button>
        </template>
    </Modal>
</template>
<script>
import { addUser, updateUser } from '@/api/user';
import { getKeysObject } from '@/libs/util';

export default {
    data() {
        return {
            isVisible: false,
            userId: null,
            submitting: false,
            form: {
                userName: '',
                realName: '',
                userPwd: '',
                phone: '',
                email: ''
            },
            rules: {
                userName: [{ required: true, message: '该字段不能为空' }],
                userPwd: [{ required: true, message: '该字段不能为空' }],
                realName: [{ required: true, message: '该字段不能为空' }],
                phone: [{ required: true, message: '该字段不能为空' }],
                email: [{ required: true, message: '该字段不能为空' }]
            }
        };
    },
    methods: {
        show(row) {
            if (row && row.userId) {
                this.userId = row.userId;
                // 使用row数据初始化表单
                Object.assign(
                    this.form,
                    getKeysObject(row, ['userName', 'realName', 'userPwd', 'phone', 'email'])
                );
            }
            this.isVisible = true;
        },
        hide() {
            this.$refs.form.resetFields();
            this.isVisible = false;
            this.userId = null;
        },
        async handleSubmit() {
            this.submitting = true;
            try {
                const valid = await this.$refs.form.validate();
                if (valid) {
                    const postData = getKeysObject(this.form, [
                        'userName',
                        'userPwd',
                        'realName',
                        'phone',
                        'email'
                    ]);
                    // 是否选中部门,没有部门则不带deptId
                    let success;
                    if (this.userId) {
                        // 更新
                        postData.userId = this.userId;
                        const { data } = await updateUser(postData);
                        success = data.success;
                    } else {
                        // 新建用户
                        const { data } = await addUser(postData);
                        success = data.success;
                    }
                    if (success) {
                        this.$Message.success('操作成功');
                        this.$emit('on-get-data'); // 刷新
                        this.hide();
                    }
                }
            } finally {
                this.submitting = false;
            }
        }
    }
};
</script>
<style lang="less" scoped>
.hidden {
    position: absolute;
    left: -10000px;
    top: -10000px;
}
</style>
