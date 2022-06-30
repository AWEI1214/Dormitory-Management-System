<template>
  <div>
    <div :id="config.id" style="width: 100%; height: 400px"></div>
  </div>
</template>

<script>
import * as echarts from "echarts";
export default {
  data() {
    let self = this;
    return {};
  },
  mounted() {},
  methods: {
    initChart(x, y) {
      let chart = document.getElementById(this.config.id);
      let myChart = echarts.init(chart);
      let option = {
        title: {
          text: this.config.title,
        },

        tooltip: {
          trigger: "item",
        },
        xAxis: {
          max: "dataMax",
        },
        yAxis: {
          data: y,
          type: "category",
          inverse: true,
          animationDuration: 300,
          animationDurationUpdate: 300,
          max: 9,
        },
        series: [
          {
            realtimeSort: true,
            name: this.config.name,
            showBackground: false,
            // backgroundStyle: {
            //   color: 'rgba(180, 180, 180, 0.2)'
            // },
            type: "bar",
            data: x,
            label: {
              show: true,
              position: "right",
              valueAnimation: true,
            },
          },
        ],
        legend: {
          show: true,
        },
        // animationDuration: 0,
        // animationDurationUpdate: 3000,
        // animationEasing: 'linear',
        // animationEasingUpdate: 'linear'
      };
      // option.yAxis.data = idData;
      // option.series[0].data = data;
      myChart.setOption(option);
    },
    setData(data) {
      this.initChart(data.x, data.y);
    },
  },
  props: ["config"],
};
</script>