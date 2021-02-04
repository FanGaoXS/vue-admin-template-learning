<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'


const animationDuration = 1000

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300px'
    },
    map: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      chart: null,
      valueMap:[

      ],
      yAxisValue: ''
    }
  },

  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  watch: {
    valueMap(newValue,oldValue){
      let xAxisDataList = []
      let seriesDataList = [];
      for (const item of newValue) {
        xAxisDataList.push(item.xAxis)
        seriesDataList.push(item.series)
      }
      this.chart.setOption({
        xAxis:[{
          data:xAxisDataList
        }],
        series:[{
          data:seriesDataList
        }]
      })
    },
    yAxisValue(newValue,oldValue){

    }
  },
  methods: {
    fetchData(valueMap,yAxisValue){
      /*console.log(valueMap)
      console.log(yAxisValue)*/
      this.valueMap = valueMap
      this.yAxisValue = yAxisValue
    },

    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')

      this.chart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          top: 10,
          left: '2%',
          right: '2%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          data: [ '星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期天'],
          axisTick: {
            alignWithLabel: true
          }
        },
        ],
        yAxis: [{
          type: 'value',
          data: '值',
          axisTick: {
            show: false
          }
        }],
        series: [{
          // name: 'pageA',
          type: 'bar',
          stack: 'vistors',
          barWidth: '60%',
          data: [79, 52, 200, 334, 390, 330, 220],
          animationDuration
        },/* {
          name: 'pageB',
          type: 'bar',
          stack: 'vistors',
          barWidth: '60%',
          data: [80, 52, 200, 334, 390, 330, 220],
          animationDuration
        }, {
          name: 'pageC',
          type: 'bar',
          stack: 'vistors',
          barWidth: '60%',
          data: [30, 52, 200, 334, 390, 330, 220],
          animationDuration
        }*/
        ]
      })
    }
  }
}
</script>
