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
    },
    methods: {
      initChart(value) {
        let chart = document.getElementById(this.config.id);
        let myChart = echarts.init(chart);
        let option;
        option = {
          series: [{
            type: 'gauge',
            startAngle: 180,
            endAngle: 0,
            min: 0,
            max: 1,
            splitNumber: 8,
            axisLine: {
              lineStyle: {
                width: 6,
                color: [
                  [0.25, '#FF6E76'],
                  [0.5, '#FDDD60'],
                  [0.75, '#58D9F9'],
                  [1, '#7CFFB2']
                ]
              }
            },
            pointer: {
              icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
              length: '12%',
              width: 20,
              offsetCenter: [0, '-60%'],
              itemStyle: {
                color: 'auto'
              }
            },
            axisTick: {
              length: 12,
              lineStyle: {
                color: 'auto',
                width: 2
              }
            },
            splitLine: {
              length: 20,
              lineStyle: {
                color: 'auto',
                width: 5
              }
            },
            axisLabel: {
              color: '#464646',
              fontSize: 20,
              distance: -60,
              formatter: function (value) {
                if (value === 0.875) {
                  return '优秀';
                } else if (value === 0.625) {
                  return '良好';
                } else if (value === 0.375) {
                  return '一般';
                } else if (value === 0.125) {
                  return '较差';
                }
                return '';
              }
            },
            title: {
              offsetCenter: [0, '-30%'],
              fontSize: 30
            },
            detail: {
              fontSize: 50,
              offsetCenter: [0, '0%'],
              valueAnimation: true,
              formatter: function (value) {
                return Math.round(value * 100) + '分';
              },
              color: 'auto'
            },
            data: [{
              value: value/100,
              name: this.config.name
            }]
          }]
        };
        myChart.setOption(option);
      },
      setData(value) {
        this.initChart(value);
      }
    },
    props: ["config"]
  }
</script>