<template>
  <div class="main">
    <div ref="queryContent" v-sticky="{zIndex: 2001, stickyTop: 0, disabled: false}">
      <div class="header-wrapper">
        <div class="mb-3">
          <h6 class="d-inline-block mb-0 mr-2 font-weight-bold">趋势分析</h6>
          <span>{{ title }}</span>
        </div>
        <div class="d-flex justify-content-between">
          <div class="filter-wrapper mr-2">
            <time-selector
              :disabled="isListLoading || isSummaryLoading || isExcelExporting"
              :date-type.sync="dateType"
              :date-range.sync="dateRange"
              :compare-date-range.sync="compareDateRange"
              :granularity.sync="granularity">
            </time-selector>

            <div class="filter-container">
              <div class="filter-item mr-3">
                <label>地域：</label>
                <tree-transfer
                  :disabled="isListLoading || isSummaryLoading || isExcelExporting"
                  v-model="area"
                  :source="areaList">
                </tree-transfer>
              </div>
              <div class="filter-item mr-3">
                <label>场景：</label>
                <tree-transfer
                  :disabled="isListLoading || isSummaryLoading || isExcelExporting"
                  v-model="scene"
                  :source="sceneList"
                  :show-shortcut="true">
                </tree-transfer>
              </div>
              <div class="filter-item mr-3">
                <label>合伙人：</label>
                <tree-transfer
                  :disabled="isListLoading || isSummaryLoading || isExcelExporting"
                  v-model="agent"
                  :source="agentList"
                  value-consists-of="leaf"
                  :show-shortcut="true">
                </tree-transfer>
              </div>
              <div class="filter-item">
                <label>铺秤人员：</label>
                <tree-transfer
                  :disabled="isListLoading || isSummaryLoading || isExcelExporting || isFilterDisabled"
                  v-model="employee"
                  :source="employeeList"
                  :show-shortcut="true">
                </tree-transfer>
              </div>
              <div class="filter-item" style="padding-left: 10px">
                <label>所属公司：</label>
                <el-select style="width: 100%" v-model="Search_CompId" clearable placeholder="请选择">
                    <el-option
                            v-for="item in companyOptions"
                            :key="item.CompId"
                            :label="item.CompName"
                            :value="item.CompId">
                    </el-option>
                </el-select>
              </div>
            </div>
          </div>
          <div class="tools">
            <div class="filter-item">
              <el-button :loading="isListLoading || isSummaryLoading" :disabled="isExcelExporting || isFilterDisabled" @click="fetchData" type="primary" style="width: 100px;" icon="el-icon-search">查询</el-button>
            </div>
            <div class="filter-item">
              <el-button :loading="isExcelExporting" :disabled="isListLoading || isSummaryLoading || isFilterDisabled" @click="exportExcel" type="primary" style="width: 100px;" icon="el-icon-download">导出</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="content-wrapper">
      <div class="main-content">
        <indicator-summary
          :indicators="indicatorList"
          :value="summaryData">
        </indicator-summary>
        <div class="indicator-wrapper">
          <indicator-pop
            v-model="chartIndicators"
            :indicator-group="indicatorGroup"
            :max="this.query.compareDateRange && this.query.compareDateRange.length > 0 ? 1 : 2">
          </indicator-pop>
        </div>

        <general-chart v-loading="isListLoading" :chart-data="chartData" style="height: 290px;"></general-chart>

        <div v-show="this.query.dateRange && this.query.dateRange.length === 2 && this.query.dateRange[0] === this.query.dateRange[1]" class="chart-compare">
          <label class="mr-2">对比：</label>
          <el-checkbox-group
            :disabled="isSummaryLoading || isListLoading || isExcelExporting"
            @change="handleChartCompareTypeChange"
            v-model="selectedChartCompareType"
            class="d-inline-block">
            <el-checkbox :label="1">前一日</el-checkbox>
            <el-checkbox :label="2">上周同期</el-checkbox>
          </el-checkbox-group>
        </div>
        <div class="table-indicator-wrapper">
          <indicator-panel
            v-model="tableIndicators"
            :shortcuts="indicatorShortcuts"
            :indicator-group="indicatorGroup">
          </indicator-panel>
        </div>
        <el-table
          ref="table"
          @sort-change="handleTableSortChange"
          :default-sort="{prop: 'DateFormat', order: 'descending'}"
          :data="tableData"
          v-loading="isListLoading"
          :cell-class-name="tableCellClass"
          border
          fit
          highlight-current-row
          style="width: 100%;"
          :max-height="tableMaxHeight">
          <el-table-column
            prop="DateFormat"
            label="时间"
            sortable="custom">
            <template slot-scope="scope">
              <div class="text-truncate">
                <span class="d-inline-block align-middle text-truncate index-column" :title="scope.row.index">{{ scope.row.index }}</span>
                <span>{{ scope.row.DateFormat }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            v-for="group in indicatorGroup"
            v-if="tableIndicators.some(i => group.indicators.map(j => j.name).indexOf(i.name) > -1)"
            :key="group.groupName"
            :label="group.groupName">
            <el-table-column
              v-for="item in group.indicators"
              v-if="tableIndicators.map(i => i.name).indexOf(item.name) > -1"
              :key="item.name"
              :prop="item.name"
              :label="item.text"
              sortable="custom">
            </el-table-column>
          </el-table-column>
        </el-table>
        <div v-show="!isListLoading" class="text-center py-3">
          <el-pagination
            @size-change="handlePageSizeChange"
            :current-page.sync="tableCurrentPage"
            :page-sizes="tablePageSizeOption"
            :page-size="tablePageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="tableTotalSize"
            background>
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TimeSelector from '@/components/report/time-selector'
import TreeTransfer from '@/components/report/tree-transfer'
import IndicatorSummary from '@/components/report/indicator-summary'
import IndicatorPop from '@/components/report/indicator-pop'
import IndicatorPanel from '@/components/report/indicator-panel'
import GeneralChart from '@/components/report/general-chart'
import VueSticky from 'vue-sticky'
import moment from 'moment'
import * as ReportCommonApi from '@/api/report/common'
import * as TrendApi from '@/api/report/trend'
import {getCompList} from '@/api/powderAdvertising'
import swal from 'sweetalert2'
import { deepClone, percentage, toPercent, formatNumber } from '@/utils'
import { mapGetters } from 'vuex'
import exportExcel from '@/utils/exportExcel'

export default {
  name: 'trend',
  components: {
    TimeSelector,
    TreeTransfer,
    IndicatorSummary,
    IndicatorPop,
    IndicatorPanel,
    GeneralChart
  },
  directives: {
    sticky: VueSticky
  },
  data () {
    const today = moment().format('YYYY-MM-DD')
    const indicatorList = [
      {
        name: 'OnlineCountRate',
        text: '设备在线率',
        desc: '指定时间范围内，在线设备数/上线运营设备数',
        unit: '%'
      }, {
        name: 'OnlineCount',
        text: '在线设备数',
        desc: '上线运营设备中，在指定时间范围内在线过的设备数'
      }, {
        name: 'OperateCount',
        text: '上线运营设备数',
        desc: '指定时间范围内上线运营的设备数'
      }, {
        name: 'DayAvgFollowCount',
        text: '设备日均导粉数',
        desc: '有称重的设备，日均每设备的导粉数量'
      }, {
        name: 'WeightCountSum',
        text: '称重次数',
        desc: '用户上秤称重的次数，<br>一个用户多次称重，称重次数累计'
      }, {
        name: 'ScanCountSum',
        text: '屏幕扫码数',
        desc: '上秤后扫描电子屏右侧二维码的次数<br>（通过用户访问二维码H5地址统计，一次称重多次扫码不重复计算）'
      }, {
        name: 'FollowCountSum',
        text: '导粉数',
        desc: '用户关注公众号的次数，<br>一个用户多次关注不同公众号，导粉次数累计'
      }, {
        name: 'ScanCountRate',
        text: '屏幕扫码率',
        desc: '屏幕扫码数与称重次数的比值',
        unit: '%'
      }, {
        name: 'WeightCountRate',
        text: '导粉率',
        desc: '导粉数与称重次数的比值',
        unit: '%'
      }
    ]
    const indicatorGroup = [
      {
        groupName: '设备指标',
        indicators: [
          {
            name: 'OnlineCountRate',
            text: '设备在线率',
            yAxisIndex: 2,
            unit: '%'
          }, {
            name: 'OnlineCount',
            text: '在线设备数',
            yAxisIndex: 0
          }, {
            name: 'OperateCount',
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
    const indicatorMap = new Map([].concat(...indicatorGroup.map(item => item.indicators)).map(item => [item.name, item]))
    const chartIndicators = [indicatorMap.get('FollowCountSum')]
    const indicatorShortcuts = [
      indicatorMap.get('WeightCountSum'),
      indicatorMap.get('FollowCountSum'),
      indicatorMap.get('ScanCountRate'),
      indicatorMap.get('WeightCountRate'),
      indicatorMap.get('DayAvgWeightCount'),
      indicatorMap.get('DayAvgFollowCount')
    ]
    const tableIndicators = indicatorShortcuts

    const dateType = 1
    const dateRange = [today, today]
    const compareDateRange = []
    const granularity = 1

    const agent = []
    const scene = []
    const area = []
    const employee = []

    return {
      // 时间 今天：1, 昨天：2, 最近7天：3，最近30天：4
      dateType: dateType,
      // 日期范围，今天/昨天传两个日期相同的数组
      dateRange: dateRange,
      // 对比日期范围
      compareDateRange: compareDateRange,
      // 时间粒度
      granularity: granularity,

      // 已选合伙人
      agent: agent,
      // 已选场景
      scene: scene,
      // 已选地域
      area: area,
      // 已选铺秤人员
      employee: employee,
      Search_CompId: '',
      // 用于过滤以上四种选项
      filters: {},

      isFilterDisabled: false,

      // 图对比类型数组 1：前一日 2：上周同期
      selectedChartCompareType: [],
      // 汇总指标列表
      indicatorList: indicatorList,
      // 默认汇总指标列表
      defaultIndicatorList: indicatorList,
      // 汇总指标数据
      summaryData: {},

      // 分组的指标列表对象
      indicatorGroup: indicatorGroup,
      // 指标key与指标对象Map
      indicatorMap: indicatorMap,
      // 图展示指标
      chartIndicators: chartIndicators,
      // 之前选择的图展示指标，用于取消对比查看时恢复
      oldChartIndicators: [],
      // 表格展示指标
      tableIndicators: tableIndicators,
      // 表格展示指标默认快捷选项
      indicatorShortcuts: indicatorShortcuts,

      // 图表数据加载状态
      isListLoading: false,
      // 汇总数据加载状态
      isSummaryLoading: false,
      // 导出状态
      isExcelExporting: false,
      // 保存之前的请求参数
      query: deepClone({ dateType, dateRange, compareDateRange, granularity, agent, scene, area, employee }),
      // 图表原始数据
      rawListData: [],

      // 表格当前页
      tableCurrentPage: 1,
      // 表格一页条数可选项
      tablePageSizeOption: [20, 30, 50, 100],
      // 表格一页条数
      tablePageSize: 30,
      // 表格当前排序字段
      sortBy: 'DateFormat',
      // 表格当前排序方向
      order: 'descending',
      // 除表格外内容区域高度
      othersHeight: 0,
      companyOptions: [],
      // 合伙人收益模式列表
      agentGainList: []
    }
  },
  computed: {
    tableMaxHeight () {
      return Math.max(this.$store.getters.containerHeight - this.othersHeight, 300)
    },
    // 标题时间
    title () {
      if (Object.keys(this.query).length === 0) return ''
      const dateRangeText = this.getDateText(this.query.dateRange, 'YYYY/MM/DD')
      const compareDateRangeText = this.query.compareDateRange.length === 2
        ? '与' + this.getDateText(this.query.compareDateRange, 'YYYY/MM/DD')
        : ''
      return '(' + dateRangeText + compareDateRangeText + ')'
    },
    // 过滤条件选项原始数据
    ...mapGetters([
      'agentRawData',
      'sceneRawData',
      'areaRawData',
      'employeeRawData'
    ]),
    // 合伙人收益模式map
    agentGainMap () {
      return new Map(this.agentGainList.map(item => [item.id, item.name]))
    },
    // 合伙人选项数据
    agentList () {
      const agent = this.filters.agent || new Map()
      const size = agent.size
      const agentGroupMap = {}

      this.agentRawData.forEach(item => {
        const group = agentGroupMap[item.AgentGainId]
        if (group) {
          group.children.push({
            id: item.AgentId,
            label: item.RealName,
            fullLabel: item.RealName,
            disabled: size > 0 && !agent.has(item.AgentId),
            raw: item
          })
        } else {
          const newGroup = {
            id: 'gain' + item.AgentGainId,
            label: this.agentGainMap.get(+item.AgentGainId) || '未知收益模式',
            fullLabel: this.agentGainMap.get(+item.AgentGainId) || '未知收益模式',
            disabled: false,
            children: [{
              id: item.AgentId,
              label: item.RealName,
              fullLabel: item.RealName,
              disabled: size > 0 && !agent.has(item.AgentId),
              raw: item
            }]
          }
          agentGroupMap[item.AgentGainId] = newGroup
        }
      })
      return Object.values(agentGroupMap)
    },
    // 场景选项数据
    sceneList () {
      const scene = this.filters.scene || new Map()
      const size = scene.size
      const map = new Map()
      const sceneList = []
      this.sceneRawData.forEach(item => {
        if (map.has(item.ParentId)) {
          const parent = map.get(item.ParentId)
          if (!parent.hasOwnProperty('children')) {
            parent.children = []
          }
          const child = { id: item.SceneId, label: item.Name, fullLabel: parent.fullLabel + '-' + item.Name, raw: item, disabled: size > 0 && !scene.has(item.SceneId) && !scene.has(item.ParentId) }
          parent.children.push(child)
          map.set(item.SceneId, child)
        } else {
          const obj = { id: item.SceneId, label: item.Name, fullLabel: item.Name, raw: item, disabled: size > 0 && !scene.has(item.SceneId) && !scene.has(item.ParentId) }
          sceneList.push(obj)
          map.set(item.SceneId, obj)
        }
      })
      return sceneList
    },
    // 地域选项数据
    areaList () {
      const area = this.filters.area || new Map()
      const size = area.size
      const map = new Map()
      const areaList = []
      this.areaRawData.forEach(item => {
        if (map.has(item.ParentId)) {
          const parent = map.get(item.ParentId)
          if (!parent.hasOwnProperty('children')) {
            parent.children = []
          }
          const child = { id: item.Id, label: item.Name, fullLabel: parent.fullLabel + '-' + item.Name, raw: item, disabled: size > 0 && !area.has(item.Id) && !area.has(item.ParentId) && !map.has(item.ParentId) }
          parent.children.push(child)
          map.set(item.Id, child)
        } else {
          const obj = { id: item.Id, label: item.Name, fullLabel: item.Name, raw: item, disabled: size > 0 && !area.has(item.Id) && !area.has(item.ParentId) && !map.has(item.ParentId) }
          areaList.push(obj)
          map.set(item.Id, obj)
        }
      })
      return areaList
    },
    // 铺秤人员选项数据
    employeeList () {
      const employee = this.filters.employee || new Map()
      const size = employee.size
      return this.employeeRawData.map(item => {
        return {
          id: item.EmployeeId,
          label: item.RealName,
          fullLabel: item.RealName,
          disabled: size > 0 && !employee.has(item.EmployeeId),
          raw: item
        }
      })
    },
    chartData () {
      return {
        // 横轴类目
        xAxis: {
          data: this.rawListData.map(item => {
            if (this.query.compareDateRange.length > 0 && this.query.granularity !== 1) {
              return (item.DateFormat || '--') + '与' + (item.Compare.DateFormat || '--')
            } else {
              if (this.query.granularity === 1) {
                return moment(item.Date, 'HH').format('H')
              } else {
                return item.DateFormat || '--'
              }
            }
          })
        },
        // tooltip标题
        categoryTooltip: this.rawListData.map(item => {
          if (this.query.compareDateRange.length > 0 && this.query.granularity !== 1) {
            return this.chartIndicators[0].text
          } else {
            return item.DateFormat || ''
          }
        }),
        // 数据
        series: [].concat(...this.chartIndicators.map(indicator => {
          const arr = []
          if (this.query.compareDateRange.length > 0) {
            arr.push({
              name: this.getDateText(this.query.dateRange, 'YYYY/MM/DD') + ' ' + indicator.text,
              category: this.query.granularity !== 1 ? this.rawListData.map(item => item.DateFormat || '--') : null,
              data: this.rawListData.map(item => {
                if (indicator.unit === '%') {
                  return parseFloat(item[indicator.name]) * 100
                } else {
                  return parseFloat(item[indicator.name])
                }
              }),
              type: 'line',
              symbolSize: 6,
              smooth: false,
              areaStyle: {},
              yAxisIndex: indicator.yAxisIndex
            }, {
              name: this.getDateText(this.query.compareDateRange, 'YYYY/MM/DD') + ' ' + indicator.text,
              category: this.query.granularity !== 1 ? this.rawListData.map(item => item.Compare.DateFormat || '--') : null,
              data: this.rawListData.map(item => {
                if (indicator.unit === '%') {
                  return parseFloat(item.Compare[indicator.name]) * 100
                } else {
                  return parseFloat(item.Compare[indicator.name])
                }
              }),
              type: 'line',
              symbolSize: 6,
              smooth: false,
              areaStyle: {},
              yAxisIndex: indicator.yAxisIndex
            })
          } else {
            arr.push({
              name: indicator.text,
              data: this.rawListData.map(item => {
                if (indicator.unit === '%') {
                  return parseFloat(item[indicator.name]) * 100
                } else {
                  return parseFloat(item[indicator.name])
                }
              }),
              type: 'line',
              symbolSize: 6,
              smooth: false,
              areaStyle: {},
              yAxisIndex: indicator.yAxisIndex
            })
          }
          return arr
        }))
      }
    },
    tableTotalSize () {
      return this.rawListData.length
    },
    tableData () {
      if (this.rawListData.length === 0) return []
      const sortBy = this.sortBy || 'DateFormat'
      const order = this.order || 'descending'
      const rawListData = [...this.rawListData].sort((a, b) => {
        if (sortBy === 'DateFormat') {
          const dateRegExp = /((\d{4}[-/])?\d{2}[-/]\d{2})?\D*(\d{2}:\d{2}(:\d{2})?)?/g
          const resultA = dateRegExp.exec(a[sortBy])
          dateRegExp.lastIndex = 0
          const resultB = dateRegExp.exec(b[sortBy])
          if (resultA[0] && resultB[0]) {
            return moment(resultA[0], ['YYYY-MM-DD HH:mm:ss', 'YYYY-MM-DD', 'MM-DD', 'HH:mm:ss']).diff(moment(resultB[0], ['YYYY-MM-DD HH:mm:ss', 'YYYY-MM-DD', 'MM-DD', 'HH:mm:ss'])) * (order === 'ascending' ? 1 : -1)
          } else {
            return 0
          }
        } else {
          const numA = parseFloat(a[sortBy])
          const numB = parseFloat(b[sortBy])
          if (isNaN(numA) && isNaN(numB)) {
            return 0
          } else if (isNaN(numA)) {
            return 1
          } else if (isNaN(numB)) {
            return -1
          } else {
            return (numA - numB) * (order === 'ascending' ? 1 : -1)
          }
        }
      })

      const startIndex = (this.tableCurrentPage - 1) * this.tablePageSize
      const length = Math.min(this.tableCurrentPage * this.tablePageSize, this.tableTotalSize)
      return this.generateTableData(this.summaryData, rawListData, startIndex, length, this.query.dateRange, this.query.compareDateRange, this.query.granularity, true)
    }
  },
  watch: {
    agent: {
      handler: function (val, oldVal) {
        this.getAssociatedFilters('agent')
      },
      deep: false
    },
    employeeList: {
      handler: function (val, oldVal) {
        const employee = []
        this.employee.forEach(item => {
          if (val.findIndex(i => i.id === item.id && !i.disabled) > -1) {
            employee.push(item)
          }
        })
        this.employee = employee
      },
      deep: false
    },
    tableIndicators: {
      handler: function (val, oldVal) {
        if (this.sortBy !== 'DateFormat' && val.map(i => i.name).indexOf(this.sortBy) === -1) {
          this.sortBy = null
          this.order = null
        }
      },
      deep: false
    },
    query: {
      handler: function (val, oldVal) {
        if (val.dateRange.length === 2) {
          if (val.dateRange[0] === val.dateRange[1]) {
            this.indicatorList = this.defaultIndicatorList
          } else {
            this.indicatorList = this.defaultIndicatorList.slice(3)
          }
        }
      },
      deep: false
    }
  },
  created () {
    this.$store.dispatch('getAllReportFilters')
    this.getIncomeList()
    this.getCompList()
    this.fetchData()
  },
  mounted () {

  },
  updated () {
    this.$nextTick(() => {
      const queryContent = this.$refs.queryContent
      const queryContentHeight = queryContent ? Math.round(queryContent.clientHeight) : 0
      this.othersHeight = queryContentHeight + 20 + 64
    })
  },
  methods: {
    getIncomeList () {
      ReportCommonApi.getIncomeList().then(({ data }) => {
        if (data.Status === 200) {
          this.agentGainList = data.Result instanceof Array ? data.Result : []
        }
      })
    },
    getCompList () {
      getCompList().then(data => {
        if (data.data.Status == 200) {
          this.companyOptions = data.data.Result
        }
      })
    },
    getDateText (dateArr, pattern, separator = '~') {
      return dateArr[0] === dateArr[1] ? moment(dateArr[0]).format(pattern) : moment(dateArr[0]).format(pattern) + separator + moment(dateArr[1]).format(pattern)
    },
    generateTableData (summaryData, rawListData, startIndex, length, dateRange, compareDateRange, granularity, isSumAhead = false) {
      const tableData = []

      for (let i = startIndex; i < length; i++) {
        const data = deepClone(rawListData[i])

        if (compareDateRange.length > 0) {
          const compareData = data.Compare
          const firstRowData = {
            index: i + 1,
            DateFormat: (data.DateFormat || '--') + '与' + (compareData.DateFormat || '--')
          }
          const rateRowData = {
            DateFormat: '变化率'
          }
          if (granularity === 1) {
            firstRowData.DateFormat = data.DateFormat || '--'
            data.DateFormat = this.getDateText(dateRange, 'YYYY/MM/DD', ' - ')
            compareData.DateFormat = this.getDateText(compareDateRange, 'YYYY/MM/DD', ' - ')
          }
          Object.keys(data).forEach(key => {
            const indicator = this.indicatorMap.get(key)
            if (indicator) {
              rateRowData[key] = percentage(data[key], compareData[key])
              if (indicator.unit) {
                if (indicator.unit === '%') {
                  data[key] = toPercent(data[key])
                  compareData[key] = toPercent(compareData[key])
                } else {
                  data[key] = data[key] + indicator.unit
                  compareData[key] = compareData[key] + indicator.unit
                }
              } else {
                data[key] = formatNumber(data[key])
                compareData[key] = formatNumber(compareData[key])
              }
            }
          })
          tableData.push(firstRowData, data, compareData, rateRowData)
        } else {
          data.index = i + 1
          Object.keys(data).forEach(key => {
            const indicator = this.indicatorMap.get(key)
            if (indicator) {
              if (indicator.unit) {
                if (indicator.unit === '%') {
                  data[key] = toPercent(data[key])
                } else {
                  data[key] = data[key] + indicator.unit
                }
              } else {
                data[key] = formatNumber(data[key])
              }
            }
          })
          tableData.push(data)
        }
      }

      if (compareDateRange.length > 0) {
        // 汇总数据
        const sum = {}
        // 汇总对比数据
        const compareSum = {}
        // 汇总变化率
        const sumRateRow = {
          DateFormat: '变化率'
        }
        Object.keys(summaryData).forEach(key => {
          if (this.indicatorMap.has(key)) {
            const indicator = this.indicatorMap.get(key)
            sumRateRow[key] = percentage(summaryData[key], summaryData.Compare[key])
            if (indicator.unit) {
              if (indicator.unit === '%') {
                sum[key] = toPercent(summaryData[key])
                compareSum[key] = toPercent(summaryData.Compare[key])
              } else {
                sum[key] = summaryData[key] + indicator.unit
                compareSum[key] = summaryData.Compare[key] + indicator.unit
              }
            } else {
              sum[key] = formatNumber(summaryData[key])
              compareSum[key] = formatNumber(summaryData.Compare[key])
            }
          }
        })
        sum.DateFormat = this.getDateText(dateRange, 'YYYY/MM/DD', ' - ')
        compareSum.DateFormat = this.getDateText(compareDateRange, 'YYYY/MM/DD', ' - ')
        if (isSumAhead) {
          tableData.unshift({ DateFormat: '汇总' }, sum, compareSum, sumRateRow)
        } else {
          tableData.push({ DateFormat: '汇总' }, sum, compareSum, sumRateRow)
        }
      } else {
        // 汇总数据
        const sum = {}
        Object.keys(summaryData).forEach(key => {
          if (this.indicatorMap.has(key)) {
            const indicator = this.indicatorMap.get(key)
            if (indicator.unit) {
              if (indicator.unit === '%') {
                sum[key] = toPercent(summaryData[key])
              } else {
                sum[key] = summaryData[key] + indicator.unit
              }
            } else {
              sum[key] = formatNumber(summaryData[key])
            }
          }
        })
        sum.DateFormat = '汇总'
        if (isSumAhead) {
          tableData.unshift(sum)
        } else {
          tableData.push(sum)
        }
      }
      return tableData
    },
    handleChartCompareTypeChange () {
      if (this.selectedChartCompareType.length > 0) {
        if (this.selectedChartCompareType.length > 1) {
          this.selectedChartCompareType.shift()
        }
        const date = moment(this.query.dateRange[0]).subtract(this.selectedChartCompareType[0] === 1 ? 1 : 7, 'days').format('YYYY-MM-DD')
        this.compareDateRange = [date, date]
      } else {
        this.compareDateRange = []
      }
      this.dateType = this.query.dateType
      this.dateRange = deepClone(this.query.dateRange)
      this.granularity = this.query.granularity

      this.agent = deepClone(this.query.agent)
      this.scene = deepClone(this.query.scene)
      this.area = deepClone(this.query.area)
      this.employee = deepClone(this.query.employee)
      this.fetchData()
    },
    getAssociatedFilters (changedFilter) {
      this.isFilterDisabled = true
      const agentId = this.agent.map(item => item.id).join(',')
      const employeeId = this.employee.map(item => item.id).join(',')
      const provinceId = this.area.filter(item => item.raw.Level === '1').map(item => item.id).join(',')
      const cityId = this.area.filter(item => item.raw.Level === '2').map(item => item.id).join(',')
      const districtId = this.area.filter(item => item.raw.Level === '3').map(item => item.id).join(',')
      const mainScene = this.scene.filter(item => item.raw.ParentId === '0').map(item => item.id).join(',')
      const subScene = this.scene.filter(item => item.raw.ParentId !== '0').map(item => item.id).join(',')

      const postData = {}
      if (changedFilter === 'agent') {
        agentId && (postData.AgentId = agentId)
      } else {
        agentId && (postData.AgentId = agentId)
        employeeId && (postData.EmployeeId = employeeId)
        provinceId && (postData.ProvinceId = provinceId)
        cityId && (postData.CityId = cityId)
        districtId && (postData.DistrictId = districtId)
        mainScene && (postData.MainScene = mainScene)
        subScene && (postData.SubScene = subScene)
      }

      if (Object.keys(postData).length === 0) {
        this.filters = {}
        this.isFilterDisabled = false
        return
      }

      ReportCommonApi.getAssociatedFilters(postData).then(({ data }) => {
        if (data.Status !== 200) {
          this.filters = {}
          this.isFilterDisabled = false
          return
        }
        let rawFilters = []
        if (data.Result instanceof Array) {
          rawFilters = data.Result
        } else if (data.Result instanceof Object && Object.keys(data.Result).length > 0) {
          rawFilters = [data.Result]
        }

        const agent = new Map()
        const scene = new Map()
        const area = new Map()
        const employee = new Map()
        rawFilters.forEach(item => {
          if (item.AgentId) {
            agent.set(item.AgentId + '', null)
          }
          if (item.SubScene) {
            scene.set(item.SubScene + '', null)
          } else if (item.MainScene) {
            scene.set(item.MainScene + '', null)
          }
          if (item.DistrictId) {
            area.set(item.DistrictId + '', null)
          } else if (item.CityId) {
            area.set(item.CityId + '', null)
          } else if (item.ProvinceId) {
            area.set(item.ProvinceId + '', null)
          }
          if (item.EmployeeId) {
            employee.set(item.EmployeeId + '', null)
          }
        })
        let filters = {}
        if (changedFilter === 'agent') {
          filters = { employee }
        } else if (changedFilter === 'scene') {
          filters = { area, employee }
        } else if (changedFilter === 'area') {
          filters = { employee }
        }
        this.filters = Object.assign({}, this.filters, filters)
        this.isFilterDisabled = false
      }).catch(() => {
        this.filters = {}
        this.isFilterDisabled = false
      })
    },

    fetchData () {
      // 克隆当前查询条件
      const { dateType, dateRange, compareDateRange, granularity, agent, scene, area, employee } = this
      this.query = deepClone({ dateType, dateRange, compareDateRange, granularity, agent, scene, area, employee })

      // 根据是否选择对比改变图形所选指标
      if (this.query.compareDateRange.length > 0) {
        if (this.oldChartIndicators.length === 0) {
          this.oldChartIndicators = this.chartIndicators
        }
        this.chartIndicators = this.chartIndicators.slice(0, 1)
      } else {
        if (this.oldChartIndicators.length > 0) {
          this.chartIndicators = this.oldChartIndicators
          this.oldChartIndicators = []
        }
      }

      // 改变对比快捷选项的值
      if (this.query.compareDateRange.length === 2 && this.query.compareDateRange[0] === this.query.compareDateRange[1]) {
        const diffDays = moment(this.query.dateRange[0]).diff(this.query.compareDateRange[0], 'days')
        if (diffDays === 1) {
          this.selectedChartCompareType = [1]
        } else if (diffDays === 7) {
          this.selectedChartCompareType = [2]
        } else {
          this.selectedChartCompareType = []
        }
      } else {
        this.selectedChartCompareType = []
      }

      // 获取统计数据
      this.isSummaryLoading = true
      this.summaryData = {}
      this.fetchStaticSummary().then(({ data }) => {
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
        this.summaryData = data.Result
      }).catch(() => {
        this.isSummaryLoading = false
      })

      // 获取图表数据
      this.isListLoading = true
      this.rawListData = []
      this.fetchStaticList().then(({ data }) => {
        this.isListLoading = false
        if (data.Status !== 200) {
          swal({
            text: data.Result.ErrorMsg,
            type: 'error',
            timer: 2000,
            showConfirmButton: false
          })
          return
        }
        this.rawListData = data.Result instanceof Array ? data.Result : []
      }).catch(() => {
        this.isListLoading = false
      })
    },
    fetchStaticSummary () {
      // 按照粒度调用对应的获取数据方法
      let method = 'getHourStatSummary'
      switch (this.granularity) {
        case 1:
          method = 'getHourStatSummary'
          break
        case 2:
          method = 'getDayStatSummary'
          break
        case 3:
          method = 'getWeekStatSummary'
          break
        case 4:
          method = 'getMonthStatSummary'
          break
      }

      const agentId = this.agent.map(item => item.id).join(',')
      const employeeId = this.employee.map(item => item.id).join(',')
      const provinceId = this.area.filter(item => item.raw.Level === '1').map(item => item.id).join(',')
      const cityId = this.area.filter(item => item.raw.Level === '2').map(item => item.id).join(',')
      const districtId = this.area.filter(item => item.raw.Level === '3').map(item => item.id).join(',')
      const mainScene = this.scene.filter(item => item.raw.ParentId === '0').map(item => item.id).join(',')
      const subScene = this.scene.filter(item => item.raw.ParentId !== '0').map(item => item.id).join(',')
      const postData = {
        StartDate: this.dateRange[0],
        EndDate: this.dateRange[1],
        CompareStatus: 0,
        Search_CompId : this.Search_CompId,
      }

      agentId && (postData.AgentId = agentId)
      employeeId && (postData.EmployeeId = employeeId)
      provinceId && (postData.ProvinceId = provinceId)
      cityId && (postData.CityId = cityId)
      districtId && (postData.DistrictId = districtId)
      mainScene && (postData.MainScene = mainScene)
      subScene && (postData.SubScene = subScene)
      if (this.compareDateRange.length > 0) {
        postData.CompareStatus = 1
        postData.CompareStartDate = this.compareDateRange[0]
        postData.CompareEndDate = this.compareDateRange[1]
      }

      return TrendApi[method](postData)
    },
    fetchStaticList () {
      // 按照粒度调用对应的获取数据方法
      let method = 'getHourStatList'
      switch (this.granularity) {
        case 1:
          method = 'getHourStatList'
          break
        case 2:
          method = 'getDayStatList'
          break
        case 3:
          method = 'getWeekStatList'
          break
        case 4:
          method = 'getMonthStatList'
          break
      }

      const agentId = this.agent.map(item => item.id).join(',')
      const employeeId = this.employee.map(item => item.id).join(',')
      const provinceId = this.area.filter(item => item.raw.Level === '1').map(item => item.id).join(',')
      const cityId = this.area.filter(item => item.raw.Level === '2').map(item => item.id).join(',')
      const districtId = this.area.filter(item => item.raw.Level === '3').map(item => item.id).join(',')
      const mainScene = this.scene.filter(item => item.raw.ParentId === '0').map(item => item.id).join(',')
      const subScene = this.scene.filter(item => item.raw.ParentId !== '0').map(item => item.id).join(',')
      const postData = {
        StartDate: this.dateRange[0],
        EndDate: this.dateRange[1],
        CompareStatus: 0,
        Search_CompId : this.Search_CompId,
      }

      agentId && (postData.AgentId = agentId)
      employeeId && (postData.EmployeeId = employeeId)
      provinceId && (postData.ProvinceId = provinceId)
      cityId && (postData.CityId = cityId)
      districtId && (postData.DistrictId = districtId)
      mainScene && (postData.MainScene = mainScene)
      subScene && (postData.SubScene = subScene)
      if (this.compareDateRange.length > 0) {
        postData.CompareStatus = 1
        postData.CompareStartDate = this.compareDateRange[0]
        postData.CompareEndDate = this.compareDateRange[1]
      }

      return TrendApi[method](postData)
    },

    tableCellClass ({ row, column, rowIndex, columnIndex }) {
      if (this.query.compareDateRange && this.query.compareDateRange.length > 0 && (rowIndex + 1) % 4 !== 0) {
        return 'border-bottom-0'
      }
      return ''
    },
    handleTableSortChange ({ column, prop, order }) {
      this.tableCurrentPage = 1
      this.sortBy = prop
      this.order = order
    },
    handlePageSizeChange (value) {
      this.tableCurrentPage = 1
      this.tablePageSize = value
    },
    exportExcel () {
      const dateRange = deepClone(this.dateRange)
      const compareDateRange = deepClone(this.compareDateRange)
      const granularity = this.granularity
      const fileName = '趋势分析_' + moment(dateRange[0]).format('YYYYMMDD') + '-' + moment(dateRange[1]).format('YYYYMMDD')
      this.isExcelExporting = true

      Promise.all([
        this.fetchStaticSummary(),
        this.fetchStaticList()
      ]).then(([{ data: sumData }, { data: listData }]) => {
        if (sumData.Status !== 200) {
          swal({
            text: sumData.Result.ErrorMsg,
            type: 'error',
            timer: 2000,
            showConfirmButton: false
          })
          this.isExcelExporting = false
          return
        } else if (listData.Status !== 200) {
          swal({
            text: listData.Result.ErrorMsg,
            type: 'error',
            timer: 2000,
            showConfirmButton: false
          })
          this.isExcelExporting = false
          return
        }
        const summaryData = sumData.Result
        const rawListData = listData.Result instanceof Array ? listData.Result : []
        const exportData = this.generateTableData(summaryData, rawListData, 0, rawListData.length, dateRange, compareDateRange, granularity, true)
        const fields = {
          DateFormat: '时间'
        }
        this.indicatorMap.forEach((value, key) => {
          fields[key] = value.text
        })

        exportExcel([{ sheetName: fileName, data: exportData }], fields, fileName)
        this.isExcelExporting = false
      }).catch(() => {
        this.isExcelExporting = false
      })
    }
  }
}
</script>

<style lang="less" scoped>
.main {
  display: table;
  table-layout: fixed;
  min-width: 1400px;
  width: 100%;
  height: 100%;
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
    .main-content {
      border-top: 1px solid #e1e3e4;
      border-left: 1px solid #e1e3e4;
      border-right: 1px solid #e1e3e4;
      background-color: #fff;
      .indicator-wrapper {
        padding: 20px 0 15px 20px;
      }
      .chart-compare {
        margin-bottom: 16px;
        text-align: center;
      }
      .table-indicator-wrapper {
        padding: 20px 20px 10px;
        border-top: 1px solid rgb(240, 240, 240);
      }
    }
  }
}
.index-column {
  width: 24px;
  margin-right: 14px;
}
</style>
