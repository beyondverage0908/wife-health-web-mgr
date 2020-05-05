<template>
    <div class="todo-header-search">
        <Form :label-width="85" label-position="left">
            <Row :gutter="16">
                <Col :span="6">
                    <FormItem label="关键词" style="margin-bottom:0">
                        <Input v-model.trim="queryInfo.keyword" />
                    </FormItem>
                </Col>
                <Col :span="6">
                    <Button type="primary" @click="handleSearch" style="margin-right:10px"
                        >查询</Button
                    >
                    <Button @click="handleReset">清空</Button>
                </Col>
            </Row>
        </Form>
    </div>
</template>

<script>
export default {
    data() {
        return {
            queryInfo: {
                keyword: ''
            }
        };
    },
    methods: {
        handleSearch() {
            this.$emit('on-get-data', { page: 1, queryInfo: this.queryInfo });
        },
        handleReset() {
            Object.assign(this.queryInfo, this.$options.data().queryInfo);
            this.handleSearch();
        }
    }
};
</script>
