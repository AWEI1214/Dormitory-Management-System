<template>
  <div>
    <div :id="config.id" style="width:100%;height:400px;">

    </div>
  </div>
</template>

<script>
  import * as echarts from 'echarts';
  export default {
    data() {
      let self = this;
      return {

      }
    },
    mounted() {
      // this.setData({y:[820, 932, 901, 934, 1290, 1330, 1320],x:['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']});
      
    },
    methods: {
      initChart(x,y) {
        let chart = document.getElementById(this.config.id);
        let myChart = echarts.init(chart);
        let option;
        option = {
          title:{text:this.config.title},
          xAxis: {
            type: 'category',
            data: x
          },
          yAxis: {
            type: 'value'
          },
          series: [{
            data: y,
            type: 'line',
            smooth: true
          }]
        };
        myChart.setOption(option);
      },
      setData(data) {
        this.initChart(data.x,data.y);
      }
    },
    props: ["config"]
  }
</script>