<template>
    <div>
        <a-row>
            <a-col>
                <a-descriptions title="宿舍卫生得分情况" bordered :column="4">
                    <a-descriptions-item label="宿舍门牌号">{{rinfo.key}}</a-descriptions-item>
                    <a-descriptions-item label="卫生得分">{{rinfo.score + " 分"}}</a-descriptions-item>
                </a-descriptions>
            </a-col>
        </a-row>
        <br>
        <h2>分数变动记录 <a-button style="margin:0 5px"
                 @click="util.exportCsv('分数变动记录',util.deepCopy(table.cols),util.deepCopy(table.data))"
                  type="primary">导出</a-button></h2>
        <a-row>
            <a-col :span="24">
                <a-table :dataSource="table.data" :columns="table.cols"></a-table>
            </a-col>
        </a-row>
        <a-row>
            <a-col :span="8" :offset="8">
                <DfChart ref="chart1" :config="chart1config"></DfChart>
            </a-col>
        </a-row>
    </div>
</template>

<script>
    import util from "../util.js"
    import DfChart from "../components/DfChart.vue"
    export default {
        data() {
            return {
                chart1config: {
                    name: "宿舍卫生得分",
                    id: "c1"
                },
                rinfo: {},
                userinfo: util.getObjSession("userinfo"),
                table: {
                    data: [],
                    cols: [{
                        title: '序号',
                        dataIndex: 'inde',
                        align: 'center',
                        customRender({
                            text,
                            record,
                            index,
                            column
                        }) {
                            return index + 1;
                        }
                    }, {
                        title: '寝室号',
                        dataIndex: 'rid',
                        align: 'center'
                    }, {
                        title: '事件',
                        dataIndex: 'str',
                        align: 'center'
                    }, {
                        title: '分数变动',
                        dataIndex: 'score',
                        align: 'center'
                    }, {
                        title: '发生时间',
                        dataIndex: 'createTime',
                        align: 'center'
                    }, {
                        title: '操作人',
                        dataIndex: 'usr',
                        align: 'center'
                    }, ]
                },
            }
        },
        mounted() {
            this.loadAll();
            this.util = util;
        },
        methods: {
            loadAll() {
                util.method.getData("room", {
                    key: this.userinfo.key
                }, false, res => {
                    this.rinfo = res.data[0];
                    this.$refs.chart1.setData(this.rinfo.score);
                });
                util.method.getData("ph", {
                    rid: this.userinfo.key
                }, false, res => {
                    this.table.data = res.data;
                });
            },
        },
        components: {
            DfChart
        }
    }
</script>

<style>

</style>