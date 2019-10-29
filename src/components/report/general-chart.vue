<template>
  <div style="width: 100%; height: 100%;"></div>
</template>

<script>
import echarts from 'echarts'
import 'echarts/theme/macarons' // echarts theme
import { debounce, formatNumber } from '@/utils'
import BigNumber from 'bignumber.js'

export default {
  name: 'general-chart',
  props: {
    chartData: {
      type: Object
    }
  },
  data () {
    return {
      chart: null
    }
  },
  computed: {
    showYAxis0 () {
      return this.chartData.series.filter(item => item.yAxisIndex === 0).length > 0
    },
    showYAxis1 () {
      return this.chartData.series.filter(item => item.yAxisIndex === 1).length > 0
    },
    showYAxis2 () {
      return this.chartData.series.filter(item => item.yAxisIndex === 2).length > 0
    },
    showYAxis3 () {
      return this.chartData.series.filter(item => item.yAxisIndex === 3).length > 0
    },
    showYAxis4 () {
      return this.chartData.series.filter(item => item.yAxisIndex === 4).length > 0
    },
    showYAxis5 () {
      return this.chartData.series.filter(item => item.yAxisIndex === 5).length > 0
    }
  },
  watch: {
    chartData: {
      handler: function (val, oldVal) {
        this.initChart()
      },
      deep: false
    },
    chart: {
      handler: function (val, oldVal) {
        this.$emit('update:chartInstance', val)
      },
      deep: false
    }
  },
  mounted () {
    this.initChart()
    this.__resizeHanlder = debounce(() => {
      if (this.chart) {
        this.chart.resize()
      }
    }, 100)
    window.addEventListener('resize', this.__resizeHanlder)
  },
  beforeDestroy () {
    if (!this.chart) {
      return
    }
    window.removeEventListener('resize', this.__resizeHanlder)
    this.chart.dispose()
    this.chart = null
  },
  activated () {
    this.chart && this.chart.resize()
  },
  methods: {
    percentage (num1, num2) {
      return num2 === 0 ? '0%' : (num1 / num2 * 100).toFixed(2) + '%'
    },
    // 计算各y轴最大最小值，以对齐0刻度
    getYAxisRange (legendSelected) {
      // 是否调整最大最小值
      let fitYAxisRange = false
      // 存放每个轴中的最大最小值
      const yAxisData = {}
      // 是否有正数
      let isPositiveExist = false
      // 是否有负数
      let isNegativeExist = false
      for (let i = 0; i < this.chartData.series.length; i++) {
        const series = this.chartData.series[i]
        if (series.yAxisIndex === 5) continue
        if (legendSelected && legendSelected[series.name] === false) continue
        const data = series.data.map(item => item || 0)
        const max = Math.max(...data, 0)
        const min = Math.min(...data, 0)
        if (max > 0) {
          isPositiveExist = true
        }
        if (min < 0) {
          isNegativeExist = true
        }
        if (yAxisData.hasOwnProperty(series.yAxisIndex)) {
          const prevData = yAxisData[series.yAxisIndex]
          yAxisData[series.yAxisIndex] = {
            max: Math.max(prevData.max, max),
            min: Math.min(prevData.min, min)
          }
        } else {
          yAxisData[series.yAxisIndex] = {
            max: max,
            min: min
          }
        }
      }
      if (Object.keys(yAxisData).length > 1 && isPositiveExist && isNegativeExist) {
        fitYAxisRange = true
        let baseRatio = null
        let minRatioOffset = null
        let minRatioOffsetYAxis = null
        Object.keys(yAxisData).forEach(yAxisIndex => {
          const max = yAxisData[yAxisIndex].max
          const min = yAxisData[yAxisIndex].min
          if (max > 0 && min < 0) {
            const ratio = max / min
            const ratioOffset = Math.abs(Math.abs(ratio) - 1)
            if (!minRatioOffset || ratioOffset < minRatioOffset) {
              baseRatio = ratio
              minRatioOffset = ratioOffset
              minRatioOffsetYAxis = yAxisIndex
            }
          }
        })
        if (baseRatio !== null) {
          const baseRatioFixed = -parseFloat(Math.ceil(Math.abs(baseRatio) * 100) / 100)
          Object.keys(yAxisData).forEach(yAxisIndex => {
            const max = yAxisData[yAxisIndex].max
            const min = yAxisData[yAxisIndex].min
            if (yAxisIndex === minRatioOffsetYAxis) {
              yAxisData[yAxisIndex].max = new BigNumber(baseRatioFixed).multipliedBy(min).toNumber()
            } else {
              if (max > 0 && min < 0) {
                const ratio = Math.abs(max / min)
                if (ratio > 1) {
                  yAxisData[yAxisIndex].min = -parseFloat(Math.ceil(Math.abs(max / baseRatioFixed) * 100) / 100)
                  yAxisData[yAxisIndex].max = new BigNumber(baseRatioFixed).multipliedBy(yAxisData[yAxisIndex].min).toNumber()
                } else {
                  yAxisData[yAxisIndex].max = new BigNumber(baseRatioFixed).multipliedBy(min).toNumber()
                }
              } else {
                if (max <= 0) {
                  yAxisData[yAxisIndex].max = new BigNumber(baseRatioFixed).multipliedBy(min).toNumber()
                } else {
                  yAxisData[yAxisIndex].min = -parseFloat(Math.ceil(Math.abs(max / baseRatioFixed) * 100) / 100)
                  yAxisData[yAxisIndex].max = new BigNumber(baseRatioFixed).multipliedBy(yAxisData[yAxisIndex].min).toNumber()
                }
              }
            }
          })
        } else {
          Object.keys(yAxisData).forEach(yAxisIndex => {
            const max = yAxisData[yAxisIndex].max
            const min = yAxisData[yAxisIndex].min
            if (min >= 0) {
              yAxisData[yAxisIndex].min = -max
            } else {
              yAxisData[yAxisIndex].max = -min
            }
          })
        }
      }
      return { fitYAxisRange, yAxisData }
    },
    initChart () {
      this.chart && this.chart.dispose()
      this.chart = echarts.init(this.$el, 'macarons')

      const { fitYAxisRange, yAxisData } = this.getYAxisRange(this.chartData.legend ? this.chartData.legend.selected : null)

      this.chart.setOption({
        title: {
          show: false
        },
        legend: {
          bottom: 10
        },
        grid: {
          top: 40,
          bottom: 60
        },
        dataZoom: {
          type: 'slider',
          show: false,
          xAxisIndex: [0],
          startValue: 0,
          endValue: this.chartData.xAxis.data.length - 1
        },
        xAxis: {
          type: 'category',
          boundaryGap: this.chartData.xAxis.data.length === 1,
          // axisLabel: {
          //   interval: Math.floor((this.chartData.xAxis.data.length - 8) / 8)
          // },
          axisLine: {
            show: false
          },
          axisTick: {
            show: true,
            length: 2,
            lineStyle: {
              color: '#ccc'
            }
          }
        },
        yAxis: [{
          type: 'value',
          show: this.showYAxis0,
          position: 'left',
          minInterval: this.chartData.hasOwnProperty('minInterval') ? this.chartData.minInterval : 1,
          max: fitYAxisRange && yAxisData[0] ? yAxisData[0].max : null,
          min: fitYAxisRange && yAxisData[0] ? yAxisData[0].min : null,
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitArea: {
            show: false
          },
          splitLine: {
            lineStyle: {
              type: 'solid'
            }
          }
        }, {
          type: 'value',
          show: this.showYAxis1,
          position: this.showYAxis0 ? 'right' : 'left',
          minInterval: this.chartData.hasOwnProperty('minInterval') ? this.chartData.minInterval : 1,
          max: fitYAxisRange && yAxisData[1] ? yAxisData[1].max : null,
          min: fitYAxisRange && yAxisData[1] ? yAxisData[1].min : null,
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitArea: {
            show: false
          },
          splitLine: {
            lineStyle: {
              type: this.showYAxis0 ? 'dashed' : 'solid'
            }
          }
        }, {
          type: 'value',
          show: this.showYAxis2,
          position: this.showYAxis0 || this.showYAxis1 ? 'right' : 'left',
          minInterval: this.chartData.hasOwnProperty('minInterval') ? this.chartData.minInterval : 1,
          max: fitYAxisRange && yAxisData[2] ? yAxisData[2].max : null,
          min: fitYAxisRange && yAxisData[2] ? yAxisData[2].min : null,
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            formatter: '{value} %'
          },
          splitArea: {
            show: false
          },
          splitLine: {
            lineStyle: {
              type: this.showYAxis0 || this.showYAxis1 ? 'dashed' : 'solid'
            }
          }
        }, {
          type: 'value',
          show: this.showYAxis3,
          position: this.showYAxis0 || this.showYAxis1 || this.showYAxis2 ? 'right' : 'left',
          minInterval: this.chartData.hasOwnProperty('minInterval') ? this.chartData.minInterval : 1,
          max: fitYAxisRange && yAxisData[3] ? yAxisData[3].max : null,
          min: fitYAxisRange && yAxisData[3] ? yAxisData[3].min : null,
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            formatter: '{value} %'
          },
          splitArea: {
            show: false
          },
          splitLine: {
            lineStyle: {
              type: this.showYAxis0 || this.showYAxis1 || this.showYAxis2 ? 'dashed' : 'solid'
            }
          }
        }, {
          type: 'value',
          show: this.showYAxis4,
          position: this.showYAxis0 || this.showYAxis1 || this.showYAxis2 || this.showYAxis3 ? 'right' : 'left',
          minInterval: this.chartData.hasOwnProperty('minInterval') ? this.chartData.minInterval : 1,
          max: fitYAxisRange && yAxisData[4] ? yAxisData[4].max : null,
          min: fitYAxisRange && yAxisData[4] ? yAxisData[4].min : null,
          name: '元',
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitArea: {
            show: false
          },
          splitLine: {
            lineStyle: {
              type: this.showYAxis0 || this.showYAxis1 || this.showYAxis2 || this.showYAxis3 ? 'dashed' : 'solid'
            }
          }
        }, {
          type: 'category',
          data: this.showYAxis5 ? this.chartData.series.filter(item => item.yAxisIndex === 5)[0].yAxisData : null,
          show: this.showYAxis5,
          position: this.showYAxis0 || this.showYAxis1 || this.showYAxis2 || this.showYAxis3 || this.showYAxis4 ? 'right' : 'left',
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitArea: {
            show: false
          },
          splitLine: {
            lineStyle: {
              type: this.showYAxis0 || this.showYAxis1 || this.showYAxis2 || this.showYAxis3 || this.showYAxis4 ? 'dashed' : 'solid'
            }
          }
        }],
        tooltip: {
          trigger: 'axis',
          formatter: (params, ticket, callback) => {
            const name = this.chartData.categoryTooltip ? this.chartData.categoryTooltip[params[0].dataIndex] : params[0].name
            return name + '<br>' + params.reduce((acc, cur) => {
              if (this.chartData.series[cur.seriesIndex].yAxisIndex === 2 || this.chartData.series[cur.seriesIndex].yAxisIndex === 3) {
                return `${acc}${cur.marker}${this.chartData.series[cur.seriesIndex].category ? this.chartData.series[cur.seriesIndex].category[cur.dataIndex] : cur.seriesName}: ${cur.value.toFixed(2)}%<br>`
              } else {
                return `${acc}${cur.marker}${this.chartData.series[cur.seriesIndex].category ? this.chartData.series[cur.seriesIndex].category[cur.dataIndex] : cur.seriesName}: ${formatNumber(cur.value)}<br>`
              }
            }, '')
          }
        }
      })
      this.chart.setOption(this.chartData)

      this.chart.on('legendselectchanged', (params) => {
        const { fitYAxisRange, yAxisData } = this.getYAxisRange(params.selected)
        this.chart.setOption({
          yAxis: [{
            max: fitYAxisRange && yAxisData[0] ? yAxisData[0].max : null,
            min: fitYAxisRange && yAxisData[0] ? yAxisData[0].min : null
          }, {
            max: fitYAxisRange && yAxisData[1] ? yAxisData[1].max : null,
            min: fitYAxisRange && yAxisData[1] ? yAxisData[1].min : null
          }, {
            max: fitYAxisRange && yAxisData[2] ? yAxisData[2].max : null,
            min: fitYAxisRange && yAxisData[2] ? yAxisData[2].min : null
          }, {
            max: fitYAxisRange && yAxisData[3] ? yAxisData[3].max : null,
            min: fitYAxisRange && yAxisData[3] ? yAxisData[3].min : null
          }, {
            max: fitYAxisRange && yAxisData[4] ? yAxisData[4].max : null,
            min: fitYAxisRange && yAxisData[4] ? yAxisData[4].min : null
          }]
        })
      })
    }
  }
}
</script>
