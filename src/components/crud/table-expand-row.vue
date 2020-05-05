<template>
    <div>
        <Row class="expand-row" v-for="(itemRow, idx) in splitedColumns" :key="idx">
            <Col span="8" v-for="col in itemRow" :key="col.key">
                <span class="expand-key">{{ col.key }}</span>
                <span class="expand-value">{{ col.value }}</span>
            </Col>
        </Row>
    </div>
</template>

<script>
export default {
    inject: ['data', 'columns'],
    props: {
        row: Object,
        expandedColumns: {
            type: Array,
            default() {
                // 传对象或key字符串
                /**
                 * [{
                 *  key:string,
                 *  value?:string|(k:string)=>string,
                 *  label?:string
                 * },
                 * key:string
                 * ]
                 */
                return [];
            }
        },
        // 每行几列
        colNum: {
            type: Number,
            default: 3
        }
    },
    computed: {
        splitedColumns() {
            const columns = [];
            let cur = -1;
            for (let i = 0; i < this.expandedColumns.length; i++) {
                if (i % this.colNum === 0) {
                    columns[++cur] = [];
                }
                const curKeyOrObj = this.expandedColumns[i]; // string|object
                let key;
                let value;
                if (typeof curKeyOrObj === 'string') {
                    // 必须是columns中定义过该key
                    const originCol = this.columns.find(item => item.key === curKeyOrObj);
                    key = originCol.title;
                    value = this.row[curKeyOrObj];
                } else {
                    // ?如果拿到的是obj，判断其显示key
                    if (curKeyOrObj.label) {
                        key = curKeyOrObj.label;
                    } else {
                        const originCol = this.columns.find(item => item.key === curKeyOrObj.key);
                        key = (originCol && originCol.title) || curKeyOrObj.key;
                    }

                    if (curKeyOrObj.value) {
                        if (typeof curKeyOrObj.value === 'function') {
                            value = curKeyOrObj.value(curKeyOrObj.key, this.row);
                        } else {
                            value = curKeyOrObj.value;
                        }
                    } else {
                        value = this.row[curKeyOrObj.key];
                    }
                }
                columns[cur].push({
                    key,
                    value,
                    span: Math.floor(24 / this.colNum)
                });
            }
            return columns;
        }
    }
};
</script>

<style lang="less" scoped>
.expand-row {
    margin-bottom: 16px;

    .expand-key {
        display: inline-block;
        margin-right: 10px;
        color: #17233d;
        font-weight: bold;
    }
    .expand-value {
        color: #515a6e;
        font-size: 13px;
    }
}
</style>
