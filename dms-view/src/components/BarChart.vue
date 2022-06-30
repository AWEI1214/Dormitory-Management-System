<template>
  <div>
    <div :id="config.id" style="width:100%;height:300px;">

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
    mounted() {},
    methods: {
      initChart(x, y) {
        let chart = document.getElementById(this.config.id);
        let myChart = echarts.init(chart);
        let option;
        option = {
          xAxis: {
            type: 'category',
            data: x
          },
          
          tooltip: {
            trigger: 'item'
          },
          yAxis: {
            type: 'value',
            minInterval: 1
          },
          series: [{
            name:this.config.name,
            data: y,
            type: 'bar',
            showBackground: true,
            backgroundStyle: {
              color: 'rgba(180, 180, 180, 0.2)'
            }
          }]
        };
        myChart.setOption(option);
      },
      setData(data) {
        this.initChart(data.x, data.y);
      }
    },
    props: ["config"]
  }
</script>