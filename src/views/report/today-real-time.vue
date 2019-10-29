<template>
  <div class="main">
    <div class="content-wrapper">
      <div class="content">
        <el-table
          @header-click="handleTableHeaderClick"
          @cell-click="handleTableCellClick"
          :data="summaryData"
          v-loading="isSummaryLoading"
          class="real-time-summary-table"
          :header-cell-class-name="tableHeaderCellClass"
          :row-class-name="tableRowClass"
          :cell-class-name="tableCellClass"
          fit
          style="width: 100%;">
          <el-table-column
            prop="name">
          </el-table-column>
          <el-table-column
            v-for="item in indicators"
            align="right"
            :key="item.name"
            :prop="item.name"
            :label="item.text"
            :min-width="item.text.length < 6 ? 'auto' : item.text.length < 7 ? 110 : 120">
            <template slot-scope="scope" v-if="scope.row.name">
              <span>{{ scope.row[item.name] || '--' }}</span>
              <template v-if="scope.row[item.name] && scope.row[item.name + 'Diff']">
                <font-awesome-icon v-if="scope.row[item.name + 'Diff'] > 0" :icon="icons.faLongArrowAltUp" class="text-danger ml-1"></font-awesome-icon>
                <font-awesome-icon v-else-if="scope.row[item.name + 'Diff'] < 0" :icon="icons.faLongArrowAltDown" class="text-success ml-1"></font-awesome-icon>
              </template>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="content">
        <div class="time-granularity-wrapper">
          <label>时间粒度：</label>
          <el-select :disabled="isChartLoading" @change="handleTimeGranularityChange" v-model="timeGranularity" style="width: 100px;">
            <el-option
              v-for="item in timeGranularityOptions"
              :key="item.value"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <general-chart v-loading="isChartLoading" :chart-data="chartData" style="height: 350px;"></general-chart>
      </div>
      <div v-for="compareObject in compareObjects" :key="compareObject.name" class="content">
        <div class="d-flex justify-content-between align-items-center table-title">
          <h6 class="mb-0">TOP10{{ compareObject.text }}</h6>
          <font-awesome-icon @click="viewCompareAnalysis(compareObject.name)" :icon="icons.faChevronCircleRight" class="link"></font-awesome-icon>
        </div>
        <el-table
          :data="$data[`table${compareObject.name}Data`]"
          v-loading="$data[`is${compareObject.name}Loading`]"
          :header-cell-class-name="topTableHeaderCellClass"
          :cell-class-name="topTableCellClass"
          border
          fit
          highlight-current-row
          style="width: 100%;">
          <el-table-column
            prop="RealName"
            :label="compareObject.text">
          </el-table-column>
          <el-table-column
            v-for="group in indicatorGroupForTable"
            :key="group.groupName"
            :label="group.groupName">
            <el-table-column
              v-for="item in group.indicators"
              :key="item.name"
              :prop="item.name"
              :label="item.text">
              <template slot-scope="scope">
                <span>{{ scope.row[item.name + 'Text'] }}</span>
              </template>
            </el-table-column>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import GeneralChart from '@/components/report/general-chart'
import * as TodayRealTimeApi from '@/api/report/today-real-time'
import swal from 'sweetalert2'
import { toPercent, formatNumber } from '@/utils'
import { faLongArrowAltUp, faLongArrowAltDown, faChevronCircleRight } from '@fortawesome/free-solid-svg-icons'

export default {
  name: 'today-real-time',
  components: {
    GeneralChart
  },
  data () {
    const indicators = [
      {
        name: 'OnlineActionScaleRate',
        text: '在线率',
        yAxisIndex: 2,
        unit: '%',
        field: 'OnlineCountRateSum'
      }, {
        name: 'OnlineScale',
        text: '在线数',
        yAxisIndex: 0,
        field: 'OnlineCountSum'
      }, {
        name: 'OperateScale',
        text: '运营设备数',
        yAxisIndex: 0,
        field: 'OperateCountSum'
      }, {
        name: 'WeightCount',
        text: '称重次数',
        yAxisIndex: 0,
        field: 'WeightCountSum'
      }, {
        name: 'ScanCount',
        text: '屏幕扫码次数',
        yAxisIndex: 0,
        field: 'ScanCountSum'
      }, {
        name: 'GzhScanCount',
        text: '公众号扫码数',
        yAxisIndex: 0,
        field: 'GzhScanCountSum'
      }, {
        name: 'FollowCount',
        text: '导粉数',
        yAxisIndex: 0,
        field: 'FollowCountSum'
      }, {
        name: 'XcxScanCount',
        text: '小程序扫码数',
        yAxisIndex: 0,
        field: 'XcxScanCountSum'
      }, {
        name: 'ScanCountRate',
        text: '屏幕扫码率',
        yAxisIndex: 2,
        unit: '%',
        field: 'ScanCountRateSum'
      }, {
        name: 'WeightCountRate',
        text: '导粉率',
        yAxisIndex: 2,
        unit: '%',
        field: 'FollowCountRateSum'
      }, {
        name: 'DayAvgFollow',
        text: '平均每设备导粉数',
        yAxisIndex: 1,
        field: 'AvgFollowCountSum'
      }
    ]

    const indicatorGroupForTable = [
      {
        groupName: '设备指标',
        indicators: [
          {
            name: 'OnlineCountRate',
            text: '设备在线率',
            yAxisIndex: 2,
            unit: '%'
          }, {
            name: 'OnlineCountSum',
            text: '在线设备数',
            yAxisIndex: 0
          }, {
            name: 'OperateCountSum',
            text: '上线运营设备数',
            yAxisIndex: 0
          }
        ]
      }, {
        groupName: '基础指标',
        indicators: [
          {
            name: 'WeightCountSum',
            text: '称重数',
            yAxisIndex: 0
          }, {
            name: 'ScanCountSum',
            text: '屏幕扫码数',
            yAxisIndex: 0
          }, {
            name: 'GzhScanCountSum',
            text: 'H5扫码数',
            yAxisIndex: 0
          }, {
            name: 'FollowCountSum',
            text: '导粉数',
            yAxisIndex: 0
          }, {
            name: 'XcxScanCountSum',
            text: 'H5扫码数（小程序）',
            yAxisIndex: 0
          }
        ]
      }, {
        groupName: '转化指标',
        indicators: [
          {
            name: 'ScanCountRate',
            text: '屏幕扫码率',
            yAxisIndex: 2,
            unit: '%'
          }, {
            name: 'GzhScanCountRate',
            text: 'H5扫码转化率',
            yAxisIndex: 2,
            unit: '%'
          }, {
            name: 'WeightCountRate',
            text: '导粉率',
            yAxisIndex: 2,
            unit: '%'
          }, {
            name: 'XcxScanCountRate',
            text: '导粉率（小程序）',
            yAxisIndex: 2,
            unit: '%'
          }
        ]
      }, {
        groupName: '设备质量指标',
        indicators: [
          {
            name: 'DayAvgWeightCount',
            text: '设备日均称重次数',
            yAxisIndex: 1
          }, {
            name: 'DayAvgFollowCount',
            text: '设备日均导粉数',
            yAxisIndex: 1
          }
        ]
      }
    ]

    const indicatorMap = new Map(indicators.map(item => [item.name, item]))
    const indicatorMapForTable = new Map([].concat(...indicatorGroupForTable.map(item => item.indicators)).map(item => [item.name, item]))

    const timeGranularityOptions = [
      {
        name: '10分钟',
        value: 600
      }, {
        name: '30分钟',
        value: 1800
      }, {
        name: '1小时',
        value: 3600
      }
    ]

    const compareObjects = [
      { name: 'MainScene', text: '主场景' },
      { name: 'SubScene', text: '子场景' },
      { name: 'ProvinceId', text: '省份' },
      { name: 'CityId', text: '城市' },
      { name: 'AgentId', text: '合伙人' },
      { name: 'EmployeeId', text: '铺秤人员' }
    ]

    return {
      // 统计指标
      indicators: indicators,
      indicatorMap: indicatorMap,
      indicator: 'OnlineActionScaleRate',
      // 表格展示指标
      indicatorGroupForTable: indicatorGroupForTable,
      indicatorMapForTable: indicatorMapForTable,
      // 图形时间粒度
      timeGranularityOptions: timeGranularityOptions,
      timeGranularity: 600,
      // 维度
      compareObjects: compareObjects,
      // 汇总数据加载状态
      isSummaryLoading: false,
      // 图形数据加载状态
      isChartLoading: false,
      // 表格数据加载状态
      isMainSceneLoading: false,
      isSubSceneLoading: false,
      isProvinceIdLoading: false,
      isCityIdLoading: false,
      isAgentIdLoading: false,
      isEmployeeIdLoading: false,
      // 汇总指标原始数据
      rawSummaryData: {},
      // 历史峰值原始数据
      rawHistoryMaxData: {},
      // 图形原始数据
      rawChartData: {},
      // 表格原始数据
      tableMainSceneData: [],
      tableSubSceneData: [],
      tableProvinceIdData: [],
      tableCityIdData: [],
      tableAgentIdData: [],
      tableEmployeeIdData: [],
      icons: {
        faLongArrowAltUp,
        faLongArrowAltDown,
        faChevronCircleRight
      }
    }
  },
  computed: {
    cachedViews () {
      return this.$store.state.tagsView.cachedViews
    },
    // 汇总数据
    summaryData () {
      const rawSummaryData = { ...this.rawSummaryData, max: this.rawHistoryMaxData }
      const summaryData = {}
      Object.keys(rawSummaryData).forEach(key => {
        const item = rawSummaryData[key]
        const data = this.indicators.reduce((acc, cur) => {
          if (cur.unit) {
            if (cur.unit === '%') {
              acc[cur.name] = toPercent(item[cur.name])
            } else {
              acc[cur.name] = item[cur.name] + cur.unit
            }
          } else {
            acc[cur.name] = formatNumber(item[cur.name])
          }
          if (key === 'today' || key === 'estimateToday') {
            const numA = parseFloat(item[cur.name])
            const numB = parseFloat(rawSummaryData.yesterday[cur.name])
            if (!isNaN(numA) && !isNaN(numB)) {
              acc[cur.name + 'Diff'] = numA - numB
            }
          }
          return acc
        }, {})
        summaryData[key] = data
      })

      return [
        {
          name: '今日',
          ...summaryData.today || {}
        }, {
          name: '昨日',
          ...summaryData.yesterday || {},
          OnlineActionScaleRate: null,
          OnlineScale: null,
          OperateScale: null
        }, {
          name: '预计今日',
          ...summaryData.estimateToday || {},
          OnlineActionScaleRate: null,
          OnlineScale: null,
          OperateScale: null,
          DayAvgFollow: null
        }, {}, {}, {
          name: '昨日此时',
          ...summaryData.yesterdayHere || {}
        }, {
          name: '七日平均',
          ...summaryData.avgSevenDay || {},
          OnlineActionScaleRate: null,
          OnlineScale: null,
          OperateScale: null
        }, {
          name: '历史峰值',
          ...summaryData.max || {}
        }, {}
      ]
    },
    // 图形数据
    chartData () {
      const indicator = this.indicatorMap.get(this.indicator)
      return {
        legend: {
          show: true,
          top: 5,
          bottom: 'auto'
        },
        toolbox: {
          show: true,
          right: 20,
          feature: {
            saveAsImage: {
              show: this.rawChartData.XLine && this.rawChartData.XLine.length > 0
            }
          }
        },
        grid: {
          top: 40,
          bottom: 65
        },
        // 横轴类目
        xAxis: {
          data: this.rawChartData.XLine || []
        },
        minInterval: 0,
        // 数据
        series: [{
          name: '今日' + indicator.text,
          data: this.rawChartData.Today ? this.rawChartData.Today.map(item => {
            if (indicator.unit === '%') {
              return parseFloat(item) * 100
            } else {
              return parseFloat(item)
            }
          }) : [],
          type: 'line',
          symbolSize: 6,
          smooth: false,
          areaStyle: {},
          yAxisIndex: indicator.yAxisIndex
        }, {
          name: '昨日' + indicator.text,
          data: this.rawChartData.Yesterday ? this.rawChartData.Yesterday.map(item => {
            if (indicator.unit === '%') {
              return parseFloat(item) * 100
            } else {
              return parseFloat(item)
            }
          }) : [],
          type: 'line',
          symbolSize: 6,
          smooth: false,
          areaStyle: {},
          yAxisIndex: indicator.yAxisIndex
        }]
      }
    }
  },
  created () {
  },
  mounted () {
    this.getTodayStat()
    this.getHistoryMax()
    this.getTodayEcharts()
    this.getTopList(this.compareObjects[0].name)
    setTimeout(() => {
      this.compareObjects.slice(1).forEach(item => {
        this.getTopList(item.name)
      })
    }, 1000)
  },
  methods: {
    // 获取汇总数据
    getTodayStat () {
      this.isSummaryLoading = true
      this.rawSummaryData = {}
      TodayRealTimeApi.getTodayStat().then(({ data }) => {
        this.isSummaryLoading = false
        if (data.Status !== 200) {
          swal({
            text: data.Result.ErrorMsg,
            type: 'error',
            timer: 2000,
            showConfirmButton: false
          })
          return
        }
        this.rawSummaryData = data.Result
      }).catch(() => {
        this.isSummaryLoading = false
      })
    },
    // 获取历史峰值数据
    getHistoryMax () {
      this.rawHistoryMaxData = {}
      TodayRealTimeApi.getHistoryMax().then(({ data }) => {
        if (data.Status !== 200) {
          swal({
            text: data.Result.ErrorMsg,
            type: 'error',
            timer: 2000,
            showConfirmButton: false
          })
          return
        }
        this.rawHistoryMaxData = data.Result
      }).catch(() => {})
    },
    // 表头点击事件
    handleTableHeaderClick (column, event) {
      this.indicator = column.property
      this.timeGranularity = 600
      this.getTodayEcharts()
      this.compareObjects.forEach(item => {
        this.getTopList(item.name)
      })
    },
    // 表格点击事件
    handleTableCellClick (row, column, cell, event) {
      this.indicator = column.property
      this.timeGranularity = 600
      this.getTodayEcharts()
      this.compareObjects.forEach(item => {
        this.getTopList(item.name)
      })
    },
    tableRowClass ({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0) {
        return 'text-emphasize'
      } else if (rowIndex > 3) {
        return 'row-dark'
      }
      return ''
    },
    tableHeaderCellClass ({ row, column, rowIndex, columnIndex }) {
      const classList = ['cell-no-border']
      if (columnIndex > 0) {
        classList.push('cell-clickable')
      }
      if (column.property === this.indicator) {
        classList.push('selected')
      }
      return classList.join(' ')
    },
    tableCellClass ({ row, column, rowIndex, columnIndex }) {
      const classList = []
      if (columnIndex > 0) {
        classList.push('cell-clickable')
      }
      if (row.name) {
        classList.push('cell-border-left')
      } else {
        classList.push('cell-no-border')
      }
      return classList.join(' ')
    },
    // 获取图形数据
    getTodayEcharts () {
      this.isChartLoading = true
      this.rawChartData = {}
      const indicator = this.indicatorMap.get(this.indicator)
      const postData = {
        Gra: this.timeGranularity,
        FieldTarget: indicator.field
      }
      TodayRealTimeApi.getTodayEcharts(postData).then(({ data }) => {
        this.isChartLoading = false
        if (data.Status !== 200) {
          swal({
            text: data.Result.ErrorMsg,
            type: 'error',
            timer: 2000,
            showConfirmButton: false
          })
          return
        }
        this.rawChartData = data.Result
      }).catch(() => {
        this.isChartLoading = false
      })
    },
    // 时间粒度改变事件
    handleTimeGranularityChange (val) {
      this.getTodayEcharts()
    },
    // 获取TOP10数据
    getTopList (compareObjectName) {
      this[`is${compareObjectName}Loading`] = true
      this[`table${compareObjectName}Data`] = []
      const indicator = this.indicatorMap.get(this.indicator)
      const postData = {
        Group: compareObjectName,
        FieldTarget: indicator.field
      }
      TodayRealTimeApi.getTopList(postData).then(({ data }) => {
        this[`is${compareObjectName}Loading`] = false
        if (data.Status !== 200) {
          swal({
            text: data.Result.ErrorMsg,
            type: 'error',
            timer: 2000,
            showConfirmButton: false
          })
          return
        }

        const tableData = data.Result
        tableData.forEach(item => {
          Object.keys(item).forEach(key => {
            const indicatorForTable = this.indicatorMapForTable.get(key)
            if (indicatorForTable) {
              if (indicatorForTable.unit) {
                if (indicatorForTable.unit === '%') {
                  item[key + 'Text'] = toPercent(item[key])
                } else {
                  item[key + 'Text'] = item[key] + indicatorForTable.unit
                }
              } else {
                item[key + 'Text'] = formatNumber(item[key])
              }
            }
          })
        })

        this[`table${compareObjectName}Data`] = tableData
      }).catch(() => {
        this[`is${compareObjectName}Loading`] = false
      })
    },
    topTableHeaderCellClass ({ row, column, rowIndex, columnIndex }) {
      if (column.property === 'FollowCountSum' || column.property === 'DayAvgFollowCount') {
        return 'font-weight-bold text-dark'
      }
      return ''
    },
    topTableCellClass ({ row, column, rowIndex, columnIndex }) {
      if (column.property === 'FollowCountSum' || column.property === 'DayAvgFollowCount') {
        return 'font-weight-bold text-dark'
      }
      return ''
    },
    // 查看对比分析
    viewCompareAnalysis (compareObject) {
      if (this.cachedViews.includes('compare-analysis')) {
        this.$router.push({ path: '/compare-analysis' }, () => {
          this.$nextTick(() => {
            this.$router.replace({ path: '/compare-analysis', query: { compare: compareObject, indicator: this.indicatorMap.get(this.indicator).field, dt: '1', top: '10' } })
          })
        })
      } else {
        this.$router.push({ path: '/compare-analysis', query: { compare: compareObject, indicator: this.indicatorMap.get(this.indicator).field, dt: '1', top: '10' } })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.main {
  display: table;
  table-layout: fixed;
  min-width: 1300px;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: #ececec;
  .filter-item {
    margin-bottom: 15px;
  }
  .filter-container {
    .filter-item {
      display: inline-block;
      white-space: nowrap;
    }
  }
  .header-wrapper {
    padding: 14px 20px 0;
    box-shadow: 0 1px 3px rgba(0,0,0,.1);
    background-color: #fff;
  }
  .content-wrapper {
    padding: 20px;
    .content {
      border: 1px solid #e1e3e4;
      background-color: #fff;
      &:not(:first-child) {
        margin-top: 18px;
      }
    }
  }
}

.table-title {
  padding: 20px 20px 10px;
  h6 {
    font-weight: bold;
  }
  .link {
    font-size: 20px;
    color: #D4D5D7;
    cursor: pointer;
    &:hover {
      color: #50A8F7;
    }
  }
}

.time-granularity-wrapper {
  padding: 20px 0 0 20px;
}
</style>

<style lang="less">
.el-table.real-time-summary-table {
  font-size: 14px;
  .cell-border-left {
    border: none;
    &:not(:first-child) {
      border-left: 1px solid #f0f0f0;
    }
  }
  .cell-no-border {
    border: none;
  }
  .cell-clickable {
    cursor: pointer;
  }
  .text-emphasize {
    font-weight: bold;
  }
  .selected {
    font-weight: bold;
    color: #409EFF;
  }
  .row-dark {
    background-color: #f9f9f9;
  }
  tr:hover {
    td {
      background: none !important;
    }
  }
}
</style>
