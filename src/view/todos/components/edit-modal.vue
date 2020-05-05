<template>
    <Modal
        v-model="isVisible"
        :title="`${this.row ? '更新' : '创建'}表单`"
        width="700"
        @on-cancel="hide"
    >
        <Form ref="form" :model="form" :label-width="100" :rules="rules">
            <Row class-name="form-row" :gutter="15">
                <Col :xs="24" :sm="24" :md="12">
                    <FormItem label="title" prop="title">
                        <Input
                            v-model="form.title"
                            placeholder="请输入..."
                            :readonly="isReadOnly"
                        />
                    </FormItem>
                </Col>
                <Col :xs="24" :sm="24" :md="12">
                    <FormItem label="author" prop="author">
                        <Input
                            v-model="form.author"
                            placeholder="请输入..."
                            :readonly="isReadOnly"
                        />
                    </FormItem>
                </Col>
            </Row>
        </Form>
        <template slot="footer">
            <Button
                type="primary"
                :loading="isSubmitting"
                v-if="!isReadOnly"
                @click="handleSubmit"
                >{{ this.row ? '更新' : '提交' }}</Button
            >
            <Button @click="hide">取消</Button>
        </template>
    </Modal>
</template>

<script>
function updateTodo() {
    return {
        data: {
            success: true
        }
    };
}
const createTodo = updateTodo;
export default {
    data() {
        return {
            isVisible: false,
            row: null,
            isSubmitting: false,
            isReadOnly: false,
            form: {
                title: '',
                author: ''
            },
            rules: {
                title: [
                    {
                        required: true,
                        message: '该字段不能为空'
                    }
                ],
                author: [
                    {
                        required: true,
                        message: '该字段不能为空'
                    }
                ]
            }
        };
    },
    methods: {
        show(row, isReadOnly) {
            this.row = row;
            this.isReadOnly = !!isReadOnly;
            this.isVisible = true;
        },
        hide() {
            this.$refs.form.resetFields();
            this.row = null;
            this.isVisible = false;
        },
        async handleSubmit() {
            const valid = await this.$refs.form.validate();
            if (valid) {
                let success = false;
                try {
                    this.isSubmitting = true;
                    if (this.row) {
                        const { data } = await updateTodo(this.form);
                        success = data.success;
                    } else {
                        const { data } = await createTodo(this.form);
                        success = data.success;
                    }
                    if (success) {
                        this.$Message.success('操作成功');
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
