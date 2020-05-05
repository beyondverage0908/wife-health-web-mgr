<template>
    <div class="options-mgr-header-search">
        <Form :label-width="100" label-position="left">
            <Row :gutter="15">
                <Col :span="7">
                    <FormItem label="配置编码" style="margin-bottom:0">
                        <Input v-model.trim="queryInfo.configCode" />
                    </FormItem>
                </Col>
                <Col :span="7">
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
                configCode: ''
            }
        };
    },
    methods: {
        handleSearch() {
            this.$emit('on-get-data', { page: 1, queryInfo: this.queryInfo });
        },
        handleReset() {
            this.queryInfo.configCode = '';
            this.handleSearch();
        }
    }
};
</script>
