<template>
    <div class="env" v-if="activeEnv !== 'prod'">当前环境: {{ activeEnv }}</div>
</template>
<script>
export default {
    data() {
        return {};
    },
    computed: {
        activeEnv() {
            return this.$store.state.app.env.activeProfile;
        }
    },
    mounted() {}
};
</script>
<style lang="less" scoped>
.env {
    margin-right: 10px;
    color: #f77000;
    font-size: 16px;
}
</style>
