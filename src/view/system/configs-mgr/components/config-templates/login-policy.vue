<template>
    <Card title="防暴力尝试策略" :dis-hover="true">
        <Form :label-width="100" label-position="left" :model="form" ref="form">
            <FormItem label="是否开启">
                <i-switch v-model="form.state" :true-value="1" :false-value="0"></i-switch>
            </FormItem>
            <FormItem label="策略规则">
                <p>
                    在<InputNumber v-model="form.trySeconds" :min="0" />秒内，连续访问<InputNumber
                        :min="0"
                        v-model="form.tryTimes"
                    />次，禁止访问<InputNumber :min="0" v-model="form.limitSeconds" />秒
                </p>
            </FormItem>
        </Form>
    </Card>
</template>

<script>
export default {
    data() {
        return {
            form: {
                state: 0,
                trySeconds: 0,
                tryTimes: 0,
                limitSeconds: 0
            }
        };
    },
    methods: {
        getFormData() {
            if (
                !(
                    this.form.trySeconds != null
                    && this.form.tryTimes != null
                    && this.form.limitSeconds != null
                )
            ) {
                this.$Message.warning('不能填空值');
                return;
            }
            return JSON.stringify(this.form);
        },
        initData(data) {
            const formData = JSON.parse(data);
            if (typeof formData === 'object') {
                Object.assign(this.form, formData);
            }
        },
        clear() {
            this.$refs.form.resetFields();
        }
    }
};
</script>
