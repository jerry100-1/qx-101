<template>
  <div class="main">
    <div ref="queryContent" v-sticky="{zIndex: 2001, stickyTop: 0, disabled: false}">
      <div class="header-wrapper">
        <div class="d-flex justify-content-between">
          <div class="filter-wrapper mr-2">
            <div class="filter-container">
              <time-selector
                class="d-inline-block"
                :disabled="isListLoading || isSummaryLoading || isExcelExporting"
                :date-type.sync="dateType"
                :date-range.sync="dateRange"
                :granularity.sync="granularity"
                :disabled-date="disabledDate"
                :show-compare="false">
                <template slot="after-compare">
                  <div class="filter-item mx-3">
                    <label>分析：</label>
                    <el-radio-group v-model="compareObject" :disabled="isListLoading || isSummaryLoading || isExcelExporting">
                      <el-radio-button v-for="item in compareObjects" :key="item.name" :label="item">{{ item.text }}</el-radio-button>
                    </el-radio-group>
                  </div>
                </template>
              </time-selector>
            </div>
            <div class="filter-container">
              <div v-show="!isMainSceneDisabled" class="filter-item mr-3">
                <label>主场景：</label>
                <tree-transfer
                  :disabled="isListLoading || isSummaryLoading || isExcelExporting || isMainSceneDisabled"
                  v-model="mainScene"
                  :source="mainSceneList"
                  :width="140"
                  :show-shortcut="true">
                </tree-transfer>
              </div>
              <div v-show="!isSubSceneDisabled" class="filter-item mr-3">
                <label>子场景：</label>
                <tree-transfer
                  :disabled="isListLoading || isSummaryLoading || isExcelExporting || isSubSceneDisabled"
                  v-model="subScene"
                  :source="subSceneList"
                  :width="140"
                  :show-shortcut="true">
                </tree-transfer>
              </div>
              <div v-show="!isProvinceDisabled" class="filter-item mr-3">
                <label>省份：</label>
                <tree-transfer
                  :disabled="isListLoading || isSummaryLoading || isExcelExporting || isProvinceDisabled"
                  v-model="province"
                  :source="provinceList"
                  :width="140"
                  :show-shortcut="true">
                </tree-transfer>
              </div>
              <div v-show="!isCityDisabled" class="filter-item mr-3">
                <label>城市：</label>
                <tree-transfer
                  :disabled="isListLoading || isSummaryLoading || isExcelExporting || isCityDisabled"
                  v-model="city"
                  :source="cityList"
                  :width="140"
                  :show-shortcut="true">
                </tree-transfer>
              </div>
              <div v-show="!isAgentDisabled" class="filter-item mr-3">
                <label>合伙人：</label>
                <tree-transfer
                  :disabled="isListLoading || isSummaryLoading || isExcelExporting || isAgentDisabled"
                  v-model="agent"
                  :source="agentList"
                  :width="140"
                  value-consists-of="leaf"
                  :show-shortcut="true">
                </tree-transfer>
              </div>
              <div v-show="!isEmployeeDisabled" class="filter-item mr-3">
                <label>铺秤人员：</label>
                <tree-transfer
                  :disabled="isListLoading || isSummaryLoading || isExcelExporting || isEmployeeDisabled || isLoadingEmployeeFilter"
                  v-model="employee"
                  :source="employeeList"
                  :width="140"
                  :show-shortcut="true">
                </tree-transfer>
              </div>
              <div class="filter-item mr-3">
                <label>指标：</label>
                <indicator-pop
                  :disabled="isListLoading || isSummaryLoading || isExcelExporting"
                  class="mr-1"
                  v-model="indicators"
                  :indicator-group="indicatorGroup"
                  :hide-label="true"
                  :max="1">
                </indicator-pop>
                <el-radio-group v-model="indicatorOrder" :disabled="isListLoading || isSummaryLoading || isExcelExporting">
                  <el-radio-button label="asc">升序</el-radio-button>
                  <el-radio-button label="desc">降序</el-radio-button>
                </el-radio-group>
              </div>
            </div>
          </div>
          <div class="tools">
            <div class="filter-item">
              <el-button :loading="isListLoading || isSummaryLoading" :disabled="isExcelExporting || isLoadingEmployeeFilter" @click="fetchData" type="primary" style="width: 100px;" icon="el-icon-search">查询</el-button>
            </div>
            <div class="filter-item">
              <el-button :loading="isExcelExporting" :disabled="isListLoading || isSummaryLoading || isLoadingEmployeeFilter" @click="exportExcel" type="primary" style="width: 100px;" icon="el-icon-download">导出</el-button>
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
        <div class="chart-wrapper">
          <general-chart v-loading="isChartLoading" :chart-data="chartData" style="height: 350px;"></general-chart>
          <el-select v-model="chartSeriesNum" class="chart-series-num-select">
            <el-option
              v-for="(item, index) in 10"
              :key="10 - index"
              :label="'TOP ' + (10 - index)"
              :value="10 - index">
            </el-option>
          </el-select>
        </div>
        <el-table
          ref="table"
          @sort-change="handleTableSortChange"
          :data="tableData"
          :span-method="tableSpan"
          v-loading="isListLoading"
          border
          fit
          highlight-current-row
          style="width: 100%;"
          :max-height="tableMaxHeight">
          <el-table-column
            prop="RealName"
            :label="query.compareObject.text">
          </el-table-column>
          <el-table-column
            prop="DateFormat"
            label="时间"
            min-width="100">
          </el-table-column>
          <el-table-column
            v-for="group in query.indicatorGroupForTable"
            v-if="group.indicators.some(indicator => !indicator.disabled)"
            :key="group.groupName"
            :label="group.groupName">
            <el-table-column
              v-for="item in group.indicators"
              v-if="!item.disabled"
              :key="item.name"
              :prop="item.name"
              :label="item.text">
              <template slot-scope="scope">
                <span>{{ scope.row[item.name + 'Text'] }}</span>
              </template>
            </el-table-column>
          </el-table-column>
        </el-table>
        <div v-show="!isListLoading" class="text-center py-3">
          <el-pagination
            @current-change="handleCurrentChange"
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
import GeneralChart from '@/components/report/general-chart'
import VueSticky from 'vue-sticky'
import moment from 'moment'
import * as ReportCommonApi from '@/api/report/common'
import * as CompareAnalysisApi from '@/api/report/compare-analysis'
import * as TrendApi from '@/api/report/trend'
import swal from 'sweetalert2'
import { deepClone, toPercent, formatNumber } from '@/utils'
import { mapGetters } from 'vuex'
import exportExcel from '@/utils/exportExcel'

export default {
  name: 'compare-analysis',
  components: {
    TimeSelector,
    TreeTransfer,
    IndicatorSummary,
    IndicatorPop,
    GeneralChart
  },
  directives: {
    sticky: VueSticky
  },
  data () {
    const today = moment().format('YYYY-MM-DD')
    const indicatorList = [
      {
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
            name: 'OnlineCountRateSum',
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
            name: 'ScanCountRateSum',
            text: '屏幕扫码率',
            yAxisIndex: 2,
            unit: '%'
          }, {
            name: 'GzhScanCountRateSum',
            text: 'H5扫码转化率',
            yAxisIndex: 2,
            unit: '%'
          }, {
            name: 'FollowCountRateSum',
            text: '导粉率',
            yAxisIndex: 2,
            unit: '%'
          }, {
            name: 'XcxScanCountRateSum',
            text: '导粉率（小程序）',
            yAxisIndex: 2,
            unit: '%'
          }
        ]
      }, {
        groupName: '设备质量指标',
        indicators: [
          {
            name: 'AvgWeightCountSum',
            text: '设备日均称重次数',
            yAxisIndex: 1
          }, {
            name: 'AvgFollowCountSum',
            text: '设备日均导粉数',
            yAxisIndex: 1
          }
        ]
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

    const indicatorMap = new Map([].concat(...indicatorGroup.map(item => item.indicators)).map(item => [item.name, item]))
    const indicatorMapForTable = new Map([].concat(...indicatorGroupForTable.map(item => item.indicators)).map(item => [item.name, item]))
    const indicators = [indicatorMap.get('FollowCountSum')]

    const compareObjects = [
      { name: 'MainScene', text: '主场景' },
      { name: 'SubScene', text: '子场景' },
      { name: 'ProvinceId', text: '省份' },
      { name: 'CityId', text: '城市' },
      { name: 'AgentId', text: '合伙人' },
      { name: 'EmployeeId', text: '铺秤人员' }
    ]
    const compareObject = compareObjects[0]

    const dateType = 1
    const dateRange = [today, today]
    const granularity = 1

    const agent = []
    const mainScene = []
    const subScene = []
    const province = []
    const city = []
    const employee = []

    const indicatorOrder = 'desc'

    return {
      // 时间 今天：1, 昨天：2, 最近7天：3，最近30天：4
      dateType: dateType,
      // 日期范围，今天/昨天传两个日期相同的数组
      dateRange: dateRange,
      // 时间粒度
      granularity: granularity,
      // 禁止选择的日期
      disabledDate: (date) => {
        return moment().diff(date, 'days') <= 0
      },
      // 对比类型选项
      compareObjects: compareObjects,
      // 已选对比类型
      compareObject: compareObject,
      // 已选合伙人
      agent: agent,
      // 已选主场景
      mainScene: mainScene,
      // 已选子场景
      subScene: subScene,
      // 已选省份
      province: province,
      // 已选城市
      city: city,
      // 已选铺秤人员
      employee: employee,
      // 用于过滤以上四种选项
      filters: {},
      // 加载过滤条件
      isLoadingEmployeeFilter: false,

      // 是否禁用筛选条件
      isMainSceneDisabled: false,
      isSubSceneDisabled: false,
      isProvinceDisabled: false,
      isCityDisabled: false,
      isAgentDisabled: false,
      isEmployeeDisabled: false,

      // 汇总指标列表
      indicatorList: indicatorList,
      // 汇总指标数据
      summaryData: {},

      // 分组的指标列表对象
      indicatorGroup: indicatorGroup,
      // 指标key与指标对象Map
      indicatorMap: indicatorMap,
      // 表格可展示指标
      indicatorGroupForTable: indicatorGroupForTable,
      // 表格可展示指标的Map
      indicatorMapForTable: indicatorMapForTable,
      // 查询指标
      indicators: indicators,
      // 排序
      indicatorOrder: indicatorOrder,

      // 图表数据加载状态
      isChartLoading: false,
      isListLoading: false,
      // 汇总数据加载状态
      isSummaryLoading: false,
      // 导出状态
      isExcelExporting: false,
      // 保存之前的请求参数
      query: deepClone({ dateType, dateRange, granularity, compareObject, indicators, agent, mainScene, subScene, province, city, employee, indicatorOrder, indicatorGroupForTable }),
      // 表格原始数据
      rawListData: [],

      // 图形原始数据
      rawChartData: [],
      // 图形显示的top数量
      chartSeriesNum: 10,
      // 表格当前页
      tableCurrentPage: 1,
      // 表格一页条数可选项
      tablePageSizeOption: [10, 20, 30],
      // 表格一页条数
      tablePageSize: 10,
      // 总条数
      tableTotalSize: 0,
      // 表格当前排序字段
      sortBy: null,
      // 表格当前排序方向
      order: null,
      // 路由参数
      routeQuery: {
        compare: null,
        indicator: null,
        dt: null,
        top: null
      },
      // 除表格外内容区域高度
      othersHeight: 0,
      // 合伙人收益模式列表
      agentGainList: []
    }
  },
  computed: {
    tableMaxHeight () {
      return Math.max(this.$store.getters.containerHeight - this.othersHeight, 300)
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
      let sceneList = []
      this.sceneRawData.forEach(item => {
        if (map.has(item.ParentId)) {
          const parent = map.get(item.ParentId)
          if (!parent.hasOwnProperty('children')) {
            parent.children = []
          }
          const child = { id: item.SceneId, pid: item.ParentId, label: parent.fullLabel + '-' + item.Name, fullLabel: parent.fullLabel + '-' + item.Name, raw: item, disabled: size > 0 && !scene.has(item.SceneId) && !scene.has(item.ParentId) }
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
    // 主场景选项数据
    mainSceneList () {
      const sceneList = []
      this.sceneList.forEach(item => {
        const { children, ...restProps } = item
        sceneList.push({ ...restProps })
      })
      return sceneList
    },
    // 子场景选项数据
    subSceneList () {
      const sceneList = [].concat(...this.sceneList.filter(item => {
        if (this.mainScene.length > 0) {
          return this.mainScene.findIndex(i => i.id === item.id) > -1 && item.children
        } else {
          return item.children
        }
      }).map(item => item.children))
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
          const child = { id: item.Id, pid: item.ParentId, label: parent.fullLabel + '-' + item.Name, fullLabel: parent.fullLabel + '-' + item.Name, raw: item, disabled: size > 0 && !area.has(item.Id) && !area.has(item.ParentId) && !map.has(item.ParentId) }
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
    // 省份选项数据
    provinceList () {
      const areaList = []
      this.areaList.forEach(item => {
        const { children, ...restProps } = item
        areaList.push({ ...restProps })
      })
      return areaList
    },
    // 城市选项数据
    cityList () {
      const areaList = []
      const list = [].concat(...this.areaList.filter(item => {
        if (this.province.length > 0) {
          return this.province.findIndex(i => i.id === item.id) > -1 && item.children
        } else {
          return item.children
        }
      }).map(item => item.children))

      list.forEach(item => {
        const { children, ...restProps } = item
        areaList.push({ ...restProps })
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
    // 图形数据
    chartData () {
      let selected = {}
      let maxLegendWidth = 100
      this.rawChartData.forEach((series, index) => {
        const name = series[0].RealName
        selected[name] = index < 2
        if (typeof name === 'string') {
          maxLegendWidth = Math.max(name.length * 12 + 30, maxLegendWidth)
        }
      })

      return {
        legend: {
          orient: 'vertical',
          top: 60,
          bottom: 'auto',
          right: 80,
          selected: selected
        },
        grid: {
          right: 100 + maxLegendWidth
        },
        // 横轴类目
        xAxis: {
          data: this.rawChartData.length > 0 ? this.rawChartData[0].map((item, index) => {
            if (this.query.granularity === 1) {
              return parseInt(item.DateFormat)
            } else {
              return item.DateFormat || '--'
            }
          }) : []
        },
        // tooltip标题
        categoryTooltip: this.rawChartData.length > 0 ? this.rawChartData[0].map((item, index) => {
          if (this.query.granularity === 1 && !isNaN(item.DateFormat)) {
            return item.DateFormat + ':00-' + item.DateFormat + ':59'
          } else {
            return item.DateFormat || '--'
          }
        }) : [],
        // 数据
        series: this.rawChartData.length > 0 ? this.rawChartData.slice(0, this.chartSeriesNum).map(series => {
          const indicator = this.query.indicators[0]
          return {
            name: series[0].RealName,
            data: series.map(item => {
              if (indicator.unit === '%') {
                return parseFloat(item.number) * 100
              } else {
                return parseFloat(item.number)
              }
            }),
            type: 'line',
            symbolSize: 6,
            smooth: false,
            areaStyle: {},
            yAxisIndex: indicator.yAxisIndex
          }
        }) : []
      }
    },
    tableData () {
      return this.generateTableData(this.rawListData)
    }
  },
  watch: {
    // compareObject: {
    //   handler: function (val, oldVal) {
    //     // 选 合伙人 时，禁用 合伙人、运维人员 筛选框；
    //     // 选 运维人员 时，禁用 运维人员 筛选框；
    //     // 选 主场景 时，禁用 主场景、子场景 筛选框；
    //     // 选 子场景 时，禁用 子场景 筛选框；
    //     // 选 省份 时，禁用 省份、城市 筛选框；
    //     // 选 城市 时，禁用 城市 筛选框；
    //     this.isMainSceneDisabled = false
    //     this.isSubSceneDisabled = false
    //     this.isProvinceDisabled = false
    //     this.isCityDisabled = false
    //     this.isAgentDisabled = false
    //     this.isEmployeeDisabled = false

    //     switch (val.name) {
    //       case 'AgentId':
    //         this.isAgentDisabled = true
    //         this.isEmployeeDisabled = true
    //         this.agent = []
    //         this.employee = []
    //         break
    //       case 'EmployeeId':
    //         this.isEmployeeDisabled = true
    //         this.employee = []
    //         break
    //       case 'MainScene':
    //         this.isMainSceneDisabled = true
    //         this.isSubSceneDisabled = true
    //         this.mainScene = []
    //         this.subScene = []
    //         break
    //       case 'SubScene':
    //         this.isSubSceneDisabled = true
    //         this.subScene = []
    //         break
    //       case 'ProvinceId':
    //         this.isProvinceDisabled = true
    //         this.isCityDisabled = true
    //         this.province = []
    //         this.city = []
    //         break
    //       case 'CityId':
    //         this.isCityDisabled = true
    //         this.city = []
    //         break
    //     }
    //   },
    //   deep: false
    // },
    granularity: {
      handler: function (val, oldVal) {
        if (val < 3) {
          this.indicatorGroup[0].indicators.forEach(item => {
            item.disabled = false
          })
          this.indicatorGroupForTable[0].indicators.forEach(item => {
            item.disabled = false
          })
        } else {
          this.indicatorGroup[0].indicators.forEach(item => {
            item.disabled = true
          })
          this.indicatorGroupForTable[0].indicators.forEach(item => {
            item.disabled = true
          })
          this.indicators = [this.indicatorMap.get('FollowCountSum')]
        }
        this.indicatorGroup = [...this.indicatorGroup]
        this.indicatorGroupForTable = [...this.indicatorGroupForTable]
      },
      deep: false
    },
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
    subSceneList: {
      handler: function (val, oldVal) {
        const subScene = []
        this.subScene.forEach(item => {
          if (val.findIndex(i => i.id === item.id && !i.disabled) > -1) {
            subScene.push(item)
          }
        })
        this.subScene = subScene
      },
      deep: false
    },
    cityList: {
      handler: function (val, oldVal) {
        const city = []
        this.city.forEach(item => {
          if (val.findIndex(i => i.id === item.id && !i.disabled) > -1) {
            city.push(item)
          }
        })
        this.city = city
      },
      deep: false
    },
    $route (val, oldVal) {
      if (val.path === '/compare-analysis') {
        const routeQuery = this.$route.query
        if (Object.keys(routeQuery).length > 0) {
          if (!(this.routeQuery.compare === routeQuery.compare &&
            this.routeQuery.indicator === routeQuery.indicator &&
            parseInt(this.routeQuery.dt) === parseInt(routeQuery.dt) &&
            parseInt(this.routeQuery.top) === parseInt(routeQuery.top))) {
            this.setQueryFormByRouteQuery(routeQuery)
            this.$nextTick(() => {
              this.fetchData()
            })
          }
        } else {
          this.routeQuery.compare = null
          this.routeQuery.indicator = null
          this.routeQuery.dt = null
          this.routeQuery.top = null
        }
      }
    }
  },
  created () {
    const routeQuery = this.$route.query
    if (Object.keys(routeQuery).length > 0) {
      this.setQueryFormByRouteQuery(routeQuery)
    }
    this.$store.dispatch('getAllReportFilters')
    this.getIncomeList()
    this.$nextTick(() => {
      this.fetchData()
    })
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
    setQueryFormByRouteQuery (routeQuery) {
      this.agent = []
      this.mainScene = []
      this.subScene = []
      this.province = []
      this.city = []
      this.employee = []
      this.granularity = 1
      this.indicatorOrder = 'desc'
      if (routeQuery.compare) {
        const compareObject = this.compareObjects.find(item => item.name === routeQuery.compare)
        compareObject && (this.compareObject = compareObject)
        this.routeQuery.compare = routeQuery.compare
      }
      if (routeQuery.indicator) {
        if (this.indicatorMap.has(routeQuery.indicator)) {
          this.indicators = [this.indicatorMap.get(routeQuery.indicator)]
        }
        this.routeQuery.indicator = routeQuery.indicator
      }
      if (routeQuery.dt && !isNaN(routeQuery.dt)) {
        this.dateType = parseInt(routeQuery.dt)
        this.routeQuery.dt = routeQuery.dt
      }
      if (routeQuery.top && !isNaN(routeQuery.top)) {
        this.chartSeriesNum = parseInt(routeQuery.top)
        this.routeQuery.top = routeQuery.top
      }
    },
    tableSpan ({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if (row.dateCount) {
          return {
            rowspan: row.dateCount,
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    },
    generateTableData (rawListData) {
      const tableData = []
      rawListData.forEach(item => {
        if (item.child) {
          item.child.forEach((dailyData, index) => {
            const data = {
              RealName: item.RealName
            }
            if (index === 0) {
              data.dateCount = item.child.length
            }
            tableData.push({ ...data, ...dailyData })
          })
        }
      })
      tableData.forEach(item => {
        Object.keys(item).forEach(name => {
          if (this.indicatorMapForTable.has(name)) {
            const unit = this.indicatorMapForTable.get(name).unit
            if (unit) {
              if (unit === '%') {
                item[name + 'Text'] = toPercent(item[name])
              } else {
                item[name + 'Text'] = item[name] + unit
              }
            } else {
              item[name + 'Text'] = formatNumber(item[name])
            }
          }
        })
      })
      return tableData
    },
    getAssociatedFilters (changedFilter) {
      this.isLoadingEmployeeFilter = true
      const agentId = this.agent.map(item => item.id).join(',')
      const employeeId = this.employee.map(item => item.id).join(',')
      const provinceId = this.province.map(item => item.id).join(',')
      const cityId = this.city.map(item => item.id).join(',')
      const mainScene = this.mainScene.map(item => item.id).join(',')
      const subScene = this.subScene.map(item => item.id).join(',')

      const postData = {}
      if (changedFilter === 'agent') {
        agentId && (postData.AgentId = agentId)
      } else {
        agentId && (postData.AgentId = agentId)
        employeeId && (postData.EmployeeId = employeeId)
        provinceId && (postData.ProvinceId = provinceId)
        cityId && (postData.CityId = cityId)
        mainScene && (postData.MainScene = mainScene)
        subScene && (postData.SubScene = subScene)
      }

      if (Object.keys(postData).length === 0) {
        this.filters = {}
        this.isLoadingEmployeeFilter = false
        return
      }

      ReportCommonApi.getAssociatedFilters(postData).then(({ data }) => {
        if (data.Status !== 200) {
          this.filters = {}
          this.isLoadingEmployeeFilter = false
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
        this.isLoadingEmployeeFilter = false
      }).catch(() => {
        this.filters = {}
        this.isLoadingEmployeeFilter = false
      })
    },

    fetchData () {
      // 克隆当前查询条件
      const { dateType, dateRange, granularity, compareObject, indicators, agent, mainScene, subScene, province, city, employee, indicatorOrder, indicatorGroupForTable } = this
      this.query = deepClone({ dateType, dateRange, granularity, compareObject, indicators, agent, mainScene, subScene, province, city, employee, indicatorOrder, indicatorGroupForTable })
      this.tableCurrentPage = 1
      this.tableTotalSize = 0
      this.fetchList(true)
      this.fetchSummary()
    },
    fetchSummary () {
      this.isSummaryLoading = true
      this.summaryData = {}
      const { dateRange, granularity, agent, mainScene, subScene, province, city, employee } = this.query
      // 按照粒度调用对应的获取数据方法
      let method = 'getHourStatSummary'
      switch (granularity) {
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

      const agentId = agent.map(item => item.id).join(',')
      const employeeId = employee.map(item => item.id).join(',')
      const provinceId = province.map(item => item.id).join(',')
      const cityId = city.map(item => item.id).join(',')
      const mainSceneId = mainScene.map(item => item.id).join(',')
      const subSceneId = subScene.map(item => item.id).join(',')
      const postData = {
        StartDate: dateRange[0],
        EndDate: dateRange[1],
        CompareStatus: 0
      }

      agentId && (postData.AgentId = agentId)
      employeeId && (postData.EmployeeId = employeeId)
      provinceId && (postData.ProvinceId = provinceId)
      cityId && (postData.CityId = cityId)
      mainSceneId && (postData.MainScene = mainSceneId)
      subSceneId && (postData.SubScene = subSceneId)

      TrendApi[method](postData).then(({ data }) => {
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
    },
    fetchList (refreshChart = false) {
      this.isListLoading = true
      this.rawListData = []
      if (refreshChart) {
        this.isChartLoading = true
        this.rawChartData = []
      }

      const { dateRange, granularity, compareObject, indicators, agent, mainScene, subScene, province, city, employee, indicatorOrder } = this.query

      // 按照粒度调用对应的获取数据方法
      let method = 'getHourStatCompareAnalysisList'
      switch (granularity) {
        case 1:
          method = 'getHourStatCompareAnalysisList'
          break
        case 2:
          method = 'getDayStatCompareAnalysisList'
          break
        case 3:
          method = 'getWeekStatCompareAnalysisList'
          break
        case 4:
          method = 'getMonthStatCompareAnalysisList'
          break
      }

      const agentId = agent.map(item => item.id).join(',')
      const employeeId = employee.map(item => item.id).join(',')
      const provinceId = province.map(item => item.id).join(',')
      const cityId = city.map(item => item.id).join(',')
      const mainSceneId = mainScene.map(item => item.id).join(',')
      const subSceneId = subScene.map(item => item.id).join(',')

      const postData = {
        Group: compareObject.name,
        FieldTarget: indicators[0].name,
        StartDate: dateRange[0],
        EndDate: dateRange[1],
        CompareStatus: 0,
        Sort: indicatorOrder,
        Page: this.tableCurrentPage,
        Limit: this.tablePageSize
      }

      agentId && (postData.AgentId = agentId)
      employeeId && (postData.EmployeeId = employeeId)
      provinceId && (postData.ProvinceId = provinceId)
      cityId && (postData.CityId = cityId)
      mainSceneId && (postData.MainScene = mainSceneId)
      subSceneId && (postData.SubScene = subSceneId)

      CompareAnalysisApi[method](postData).then(({ data }) => {
        this.isListLoading = false
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
        if (refreshChart) {
          this.rawChartData = data.Result.Echarts
        }
        this.rawListData = data.Result.List
        this.tableTotalSize = data.Result.Count
      }).catch(() => {
        this.isListLoading = false
        this.isChartLoading = false
      })
    },
    handleTableSortChange ({ column, prop, order }) {
      this.tableCurrentPage = 1
      this.sortBy = prop
      this.order = order
      this.fetchList()
    },
    handleCurrentChange (value) {
      this.fetchList()
    },
    handlePageSizeChange (value) {
      this.tableCurrentPage = 1
      this.tablePageSize = value
      this.fetchList()
    },
    exportExcel () {
      const { dateRange, granularity, compareObject, indicators, agent, mainScene, subScene, province, city, employee, indicatorOrder, indicatorMapForTable } = this
      const fileName = '对比分析_' + moment(dateRange[0]).format('YYYYMMDD') + '-' + moment(dateRange[1]).format('YYYYMMDD')
      this.isExcelExporting = true

      // 按照粒度调用对应的获取数据方法
      let method = 'getHourStatCompareAnalysisList'
      switch (granularity) {
        case 1:
          method = 'getHourStatCompareAnalysisList'
          break
        case 2:
          method = 'getDayStatCompareAnalysisList'
          break
        case 3:
          method = 'getWeekStatCompareAnalysisList'
          break
        case 4:
          method = 'getMonthStatCompareAnalysisList'
          break
      }

      const agentId = agent.map(item => item.id).join(',')
      const employeeId = employee.map(item => item.id).join(',')
      const provinceId = province.map(item => item.id).join(',')
      const cityId = city.map(item => item.id).join(',')
      const mainSceneId = mainScene.map(item => item.id).join(',')
      const subSceneId = subScene.map(item => item.id).join(',')

      const postData = {
        Group: compareObject.name,
        FieldTarget: indicators[0].name,
        StartDate: dateRange[0],
        EndDate: dateRange[1],
        CompareStatus: 0,
        Sort: indicatorOrder,
        Page: 1,
        Limit: 10000
      }

      agentId && (postData.AgentId = agentId)
      employeeId && (postData.EmployeeId = employeeId)
      provinceId && (postData.ProvinceId = provinceId)
      cityId && (postData.CityId = cityId)
      mainSceneId && (postData.MainScene = mainSceneId)
      subSceneId && (postData.SubScene = subSceneId)

      CompareAnalysisApi[method](postData).then(({ data }) => {
        if (data.Status !== 200) {
          swal({
            text: data.Result.ErrorMsg,
            type: 'error',
            timer: 2000,
            showConfirmButton: false
          })
          this.isExcelExporting = false
          return
        }
        const rawListData = data.Result.List
        const tableData = this.generateTableData(rawListData)
        const fields = {
          RealName: compareObject.text,
          DateFormat: '时间'
        }
        indicatorMapForTable.forEach(indicator => {
          if (!indicator.disabled) {
            fields[indicator.name + 'Text'] = indicator.text
          }
        })

        exportExcel([{ sheetName: fileName, data: tableData }], fields, fileName)
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
  min-width: 1300px;
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
      position: relative;
      border-top: 1px solid #e1e3e4;
      border-left: 1px solid #e1e3e4;
      border-right: 1px solid #e1e3e4;
      background-color: #fff;
      .indicator-wrapper {
        padding: 20px 0 15px 20px;
      }
      .chart-wrapper {
        position: relative;
        .chart-series-num-select {
          position: absolute;
          top: 20px;
          right: 80px;
          width: 100px;
        }
      }
    }
  }
}
</style>
