<style lang="less">
@import './change-log.less';
</style>
<template>
    <div class="log-content">
        <vue-markdown>{{ msg }}</vue-markdown>
    </div>
</template>
<script>
import VueMarkdown from 'vue-markdown';
import upadteContent from '../../../CHANGELOG.md';
import 'highlight.js/styles/googlecode.css';

export default {
    name: 'updatelog_index',
    components: { VueMarkdown },
    data() {
        return {
            msg: upadteContent
        };
    },
    methods: {},
    created() {}
};
</script>
