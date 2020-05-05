<template>
    <Modal
        v-model="isVisible"
        :title="`${isReadOnly ? '详情' : editRow ? '更新' : '创建'}表单`"
        width="50%"
    >
        <EditForm
            ref="edit-form"
            :loading="isSubmitting"
            :isReadOnly="isReadOnly"
            @close-modal="closeModal"
        >
            <slot></slot>
        </EditForm>
        <template slot="footer">
            <Button
                type="primary"
                :loading="isSubmitting"
                @click="handleSubmit"
                v-if="!isReadOnly"
                >{{ this.editRow ? '更新' : '提交' }}</Button
            >
            <Button @click="closeModal">取消</Button>
        </template>
    </Modal>
</template>

<script>
import EditForm from './form';

export default {
    name: 'crud-form-modal',
    components: {
        EditForm
    },
    data() {
        return {
            isVisible: false,
            isSubmitting: false,
            editRow: null,
            isReadOnly: false
        };
    },
    methods: {
        openModal(row, isReadOnly = false) {
            this.editRow = row;
            this.isReadOnly = isReadOnly;
            this.$refs['edit-form'].initForm(row);
            this.isVisible = true;
        },
        closeModal() {
            this.$refs['edit-form'].clearForm();
            this.isVisible = false;
        },
        async handleSubmit() {
            if (this.isReadOnly) {
                return;
            }
            try {
                this.isSubmitting = true;
                // 调用表单更新
                await this.$refs['edit-form'].submit();
            } finally {
                this.isSubmitting = false;
            }
        }
    }
};
</script>
