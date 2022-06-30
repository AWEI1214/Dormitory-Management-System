<template>
    <a-row :gutter="10">
        <a-col :span="8">
            <DfChart ref="chart4" :config="chart4config"></DfChart>
        </a-col>
    </a-row>
    <a-row :gutter="10">
        <a-col :span="8">
            <LineChart ref="chart1" :config="chart1config"></LineChart>
        </a-col>
        <a-col :span="8">
            <PieChart ref="chart2" :config="chart2config"></PieChart>
        </a-col>
        <a-col :span="8">
            <PhChart ref="chart3" :config="chart3config"></PhChart>
        </a-col>
    </a-row>
</template>

<script>
    import LineChart from "../components/LineChart.vue"
    import PieChart from "../components/PieChart.vue"
    import PhChart from "../components/PhChart.vue"
    import DfChart from "../components/DfChart.vue"
    import util from "../util.js"
    export default {
        data() {
            return {
                chart1config: {
                    title: "测试表格1",
                    id: "c1"
                },
                chart2config: {
                    title: "测试表格1",
                    id: "c2"
                },
                chart3config: {
                    title: "测试表格1",
                    name:"排行",
                    id: "c3"
                },
                chart4config: {
                    name:"卫生得分",
                    id: "c4"
                },
            }
        },
        mounted() {
            this.$refs.chart1.setData({
                y: [820, 932, 901, 934, 1290, 1330, 1320],
                x: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            });
            this.$refs.chart2.setData([{
                    value: 1048,
                    name: 'Search Engine'
                },
                {
                    value: 735,
                    name: 'Direct'
                },
                {
                    value: 580,
                    name: 'Email'
                },
                {
                    value: 484,
                    name: 'Union Ads'
                },
                {
                    value: 300,
                    name: 'Video Ads'
                }
            ]);
            this.$refs.chart3.setData({y:['a','b','c','d',],x:[1223,1253,4234,3783]});
            this.$refs.chart4.setData(40);
        },
        methods: {},
        components: {
            LineChart,
            PieChart,PhChart,DfChart
        }
    }
</script>

<style>

</style>