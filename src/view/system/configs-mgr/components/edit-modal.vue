<template>
    <Modal v-model="isVisible" title="修改配置" width="700" @on-cancel="hide">
        <Form
            ref="basic-form"
            :model="form"
            :rules="rules"
            :label-width="100"
            label-position="left"
        >
            <FormItem label="配置名称" prop="configName">
                <Input v-model="form.configName" />
            </FormItem>
            <FormItem label="描述">
                <Input v-model="form.configDesc" />
            </FormItem>
        </Form>
        <component :is="componentName" v-if="isVisible" ref="config-form"></component>
        <template slot="footer">
            <Button type="primary" :loading="isSubmitting" @click="handleSubmit">更新</Button>
            <Button @click="hide">取消</Button>
        </template>
    </Modal>
</template>

<script>
import { updateConfigByCode } from '@/api/configs';
import LoginPolicyConfig from './config-templates/login-policy';

// 将configcode与对应的组件进行映射。组件必须有initData方法，接收configValue
const configFormMap = {
    LOGIN_POLICY: 'LoginPolicyConfig'
};
export default {
    components: {
        LoginPolicyConfig
    },
    data() {
        return {
            isVisible: false,
            row: null,
            isSubmitting: false,
            form: {
                configName: '',
                configDesc: ''
            },
            rules: {
                configName: [{ required: true, message: '该字段不能为空' }]
            }
        };
    },
    computed: {
        componentName() {
            if (this.row) {
                return configFormMap[this.row.configCode];
            }

            // 由于在show中先赋值row，再设isVisible，因此在component显示时row一定存在。
            return '';
        }
    },
    methods: {
        show(row) {
            this.row = row;
            this.isVisible = true;
            Object.assign(this.form, {
                configName: row.configName,
                configDesc: row.configDesc
            });
            this.$nextTick(() => {
                // 等到conponent渲染完再获取ref
                try {
                    this.$refs['config-form'].initData(row.configValue);
                } catch (e) {
                    this.$Message.error(e.message || '解析json错误');
                    throw e;
                }
            });
        },
        hide() {
            this.row = null;
            this.isVisible = false;
        },
        async handleSubmit() {
            const valid = this.$refs['basic-form'].validate();
            if (valid) {
                try {
                    this.isSubmitting = true;
                    const configValue = this.$refs['config-form'].getFormData();
                    const { data } = await updateConfigByCode({
                        ...this.form,
                        configCode: this.row.configCode,
                        configValue
                    });
                    if (data.success) {
                        this.$Message.success('修改成功');
                        this.hide();
                        this.$emit('on-get-data');
                    }
                } finally {
                    this.isSubmitting = false;
                }
            }
        }
    }
};
</script>
