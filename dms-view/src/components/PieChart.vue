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
    mounted() {
      // this.setData({y:[820, 932, 901, 934, 1290, 1330, 1320],x:['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']});

    },
    methods: {
      initChart(data) {
        let chart = document.getElementById(this.config.id);
        let myChart = echarts.init(chart);
        let option;
        option = {
          title: {
            text: this.config.title
          },
          tooltip: {
            trigger: 'item'
          },
          series: [{
            name: this.config.name,
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '40',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: data
          }]
        };
        if(!this.config.hideLe){
          option.legend = {
            top: '5%',
            left: 'center'
          }
        }
        myChart.setOption(option);
      },
      setData(data) {
        this.initChart(data);
      }
    },
    props: ["config"]
  }
</script>