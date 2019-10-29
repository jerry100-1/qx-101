<template>
  <div class="main">
    <div ref="queryContent" v-sticky="{zIndex: 2001, stickyTop: 0, disabled: false}">
      <div class="header-wrapper">
        <div class="mb-3">
          <h6 class="d-inline-block mb-0 mr-2 font-weight-bold">对比分析</h6>
          <span>{{ title }}</span>
        </div>
        <div>
          <div class="filter-container">
            <div class="filter-item mr-3">
              <label>升降类型：</label>
              <el-radio-group v-model="compareObject" :disabled="isListLoading || isSummaryLoading">
                <el-radio-button v-for="item in compareObjects" :key="item.name" :label="item">{{ item.text }}</el-radio-button>
              </el-radio-group>
            </div>
            <div v-show="!isMainSceneDisabled" class="filter-item mr-3">
              <label>主场景：</label>
              <tree-transfer
                :disabled="isListLoading || isSummaryLoading || isMainSceneDisabled"
                v-model="mainScene"
                :source="mainSceneList"
                :width="140"
                :show-shortcut="true">
              </tree-transfer>
            </div>
            <div v-show="!isSubSceneDisabled" class="filter-item mr-3">
              <label>子场景：</label>
              <tree-transfer
                :disabled="isListLoading || isSummaryLoading || isSubSceneDisabled"
                v-model="subScene"
                :source="subSceneList"
                :width="140"
                :show-shortcut="true">
              </tree-transfer>
            </div>
            <div v-show="!isProvinceDisabled" class="filter-item mr-3">
              <label>省份：</label>
              <tree-transfer
                :disabled="isListLoading || isSummaryLoading || isProvinceDisabled"
                v-model="province"
                :source="provinceList"
                :width="140"
                :show-shortcut="true">
              </tree-transfer>
            </div>
            <div v-show="!isCityDisabled" class="filter-item mr-3">
              <label>城市：</label>
              <tree-transfer
                :disabled="isListLoading || isSummaryLoading || isCityDisabled"
                v-model="city"
                :source="cityList"
                :width="140"
                :show-shortcut="true">
              </tree-transfer>
            </div>
            <div v-show="!isAgentDisabled" class="filter-item mr-3">
              <label>合伙人：</label>
              <tree-transfer
                :disabled="isListLoading || isSummaryLoading || isAgentDisabled"
                v-model="agent"
                :source="agentList"
                :width="140"
                value-consists-of="leaf"
                :show-shortcut="true">
              </tree-transfer>
            </div>
            <div v-show="!isEmployeeDisabled" class="filter-item">
              <label>铺秤人员：</label>
              <tree-transfer
                :disabled="isListLoading || isSummaryLoading || isEmployeeDisabled || isLoadingEmployeeFilter"
                v-model="employee"
                :source="employeeList"
                :width="140"
                :show-shortcut="true">
              </tree-transfer>
            </div>
          </div>
          <div class="filter-container">
            <time-selector
              class="d-inline-block"
              :disabled="isListLoading || isSummaryLoading"
              :date-type.sync="dateType"
              :date-range.sync="dateRange"
              :compare-checkable="false"
              :compare-date-range.sync="compareDateRange"
              :disabled-date="disabledDate"
              :show-granularity="false"
              :show-compare-shortcut="true">
            </time-selector>
            <div class="filter-item mr-4">
              <label>指标：</label>
              <indicator-pop
                :disabled="isListLoading || isSummaryLoading"
                v-model="indicators"
                :indicator-group="indicatorGroup"
                :hide-label="true"
                :max="1">
              </indicator-pop>
            </div>
            <div class="filter-item">
              <el-button :loading="isListLoading || isSummaryLoading" :disabled="isExcelExporting || isLoadingEmployeeFilter" @click="fetchData" type="primary" style="width: 100px;" icon="el-icon-search">查询</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="content-wrapper">
      <div class="main-content">
        <div class="legend-wrapper">
          <div
            v-if="chartOptions"
            v-for="(item, index) in chartOptions.series"
            :key="item.name"
            @mouseenter="highlightChart(index)"
            @mouseleave="downplayChart(index)"
            @click="toggleChart(item.name)"
            class="legend"
            :class="{ inactive: !chartOptions.legend[0].selected[item.name] }"
            :style="{ color: chartOptions.legend[0].textStyle.color }">
            <span class="legend-icon" :style="{ backgroundColor: chartOptions.color[index] }"></span>
            <span class="legend-name">{{ item.name }}</span>
            <span @click.stop="changeChartSort(item.chartSortBy)" :class="chartSortBy === item.chartSortBy ? { [chartOrder]: true } : {}" class="caret-wrapper">
              <i class="sort-caret ascending"></i>
              <i class="sort-caret descending"></i>
            </span>
          </div>
        </div>
        <general-chart v-loading="isListLoading" :chart-instance.sync="chart" :chart-data="chartData" style="height: 350px;"></general-chart>

        <div class="table-filter-wrapper">
          <el-radio-group v-model="tableFilter">
            <el-radio-button :label="1">全部</el-radio-button>
            <el-radio-button :label="2">升</el-radio-button>
            <el-radio-button :label="3">降</el-radio-button>
            <el-radio-button :label="4">平</el-radio-button>
          </el-radio-group>
          <el-button :loading="isExcelExporting" :disabled="isListLoading || isSummaryLoading || isLoadingEmployeeFilter" @click="exportExcel" type="primary" style="width: 100px;" class="ml-3" icon="el-icon-download">导出</el-button>
        </div>

        <el-table
          v-if="query.indicators"
          ref="table"
          @sort-change="handleTableSortChange"
          :data="tableData"
          v-loading="isListLoading"
          :cell-class-name="tableCellClass"
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
            prop="CountSum"
            :label="query.indicators[0].text + '_' + getDateText(query.dateRange, 'YYYY/MM/DD', '-')"
            :sort-orders="['descending', 'ascending', null]"
            sortable="custom">
            <template slot-scope="scope">
              <span>{{ scope.row.CountSumText }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="CompareCountSum"
            :label="query.indicators[0].text + '_' + getDateText(query.compareDateRange, 'YYYY/MM/DD', '-')"
            :sort-orders="['descending', 'ascending', null]"
            sortable="custom">
            <template slot-scope="scope">
              <span>{{ scope.row.CompareCountSumText }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="DiffCount"
            label="差异"
            sortable="custom">
            <template slot-scope="scope">
              <span>{{ scope.row.DiffCountText }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="DiffRate"
            label="增幅"
            sortable="custom">
            <template slot-scope="scope">
              <span>{{ scope.row.DiffRateText }}</span>
            </template>
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
import IndicatorPop from '@/components/report/indicator-pop'
import GeneralChart from '@/components/report/general-chart'
import VueSticky from 'vue-sticky'
import moment from 'moment'
import * as ReportCommonApi from '@/api/report/common'
import * as ContrastApi from '@/api/report/contrast'
import swal from 'sweetalert2'
import { deepClone, toPercent, formatNumber } from '@/utils'
import { mapGetters } from 'vuex'
import exportExcel from '@/utils/exportExcel'

export default {
  name: 'contrast',
  components: {
    TimeSelector,
    TreeTransfer,
    IndicatorPop,
    GeneralChart
  },
  directives: {
    sticky: VueSticky
  },
  data () {
    const today = moment().format('YYYY-MM-DD')
    const yesterday = moment(today).subtract(1, 'days').format('YYYY-MM-DD')
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
    const indicatorMap = new Map([].concat(...indicatorGroup.map(item => item.indicators)).map(item => [item.name, item]))
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
    const compareDateRange = [yesterday, yesterday]

    const agent = []
    const mainScene = []
    const subScene = []
    const province = []
    const city = []
    const employee = []

    return {
      // 时间 今天：1, 昨天：2, 最近7天：3，最近30天：4
      dateType: dateType,
      // 日期范围，今天/昨天传两个日期相同的数组
      dateRange: dateRange,
      // 对比日期范围
      compareDateRange: compareDateRange,
      // 禁止选择的日期
      disabledDate: (date) => {
        return moment().diff(date, 'days') <= 0
      },
      // 升降类型选项
      compareObjects: compareObjects,
      // 已选升降类型
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
      isMainSceneDisabled: true,
      isSubSceneDisabled: true,
      isProvinceDisabled: false,
      isCityDisabled: false,
      isAgentDisabled: false,
      isEmployeeDisabled: false,

      // 汇总指标数据
      summaryData: {},

      // 分组的指标列表对象
      indicatorGroup: indicatorGroup,
      // 指标key与指标对象Map
      indicatorMap: indicatorMap,
      // 展示指标
      indicators: indicators,

      // 图表数据加载状态
      isListLoading: false,
      // 汇总数据加载状态
      isSummaryLoading: false,
      // 导出状态
      isExcelExporting: false,
      // 保存之前的请求参数
      query: deepClone({ dateType, dateRange, compareDateRange, compareObject, indicators, agent, mainScene, subScene, province, city, employee }),
      // 图表原始数据
      rawListData: [],

      // 图形排序字段
      chartSortBy: null,
      // 图形排序方向
      chartOrder: 'ascending',
      // chart实例
      chart: null,
      chartOptions: {},
      selectedLegend: null,
      // 表格当前页
      tableCurrentPage: 1,
      // 表格一页条数可选项
      tablePageSizeOption: [20, 30, 50, 100],
      // 表格一页条数
      tablePageSize: 50,
      // 表格当前排序字段
      sortBy: null,
      // 表格当前排序方向
      order: null,
      // 表格过滤条件
      tableFilter: 1,
      // 路由参数
      routeQuery: {
        compare: null,
        indicator: null,
        dt: null
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
    // 标题时间
    title () {
      if (Object.keys(this.query).length === 0) return ''
      const dateRangeText = this.getDateText(this.query.dateRange, 'YYYY/MM/DD')
      const compareDateRangeText = this.query.compareDateRange.length === 2
        ? ' VS ' + this.getDateText(this.query.compareDateRange, 'YYYY/MM/DD')
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

    chartData () {
      const rawListData = [...this.rawListData]
      if (this.chartSortBy) {
        const sortBy = this.chartSortBy
        const order = this.chartOrder
        rawListData.sort((a, b) => {
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
        })
      }

      let selected = {
        [this.query.indicators[0].text + '_' + this.getDateText(this.query.dateRange, 'YYYY/MM/DD', '-')]: true,
        [this.query.indicators[0].text + '_' + this.getDateText(this.query.compareDateRange, 'YYYY/MM/DD', '-')]: true,
        '增长量': false,
        '增幅': false
      }
      if (this.selectedLegend) {
        selected = this.selectedLegend
      }

      const unit = this.query.indicators[0].unit

      return {
        legend: {
          show: false,
          top: 5,
          bottom: 'auto',
          selected: selected
        },
        grid: {
          top: 10,
          bottom: 65
        },
        dataZoom: {
          show: true,
          endValue: Math.min(rawListData.length - 1, 9)
        },
        xAxis: {
          boundaryGap: true,
          data: rawListData.map(item => item.RealName),
          axisLabel: {
            interval: 'auto'
          }
        },
        series: [{
          name: this.query.indicators[0].text + '_' + this.getDateText(this.query.dateRange, 'YYYY/MM/DD', '-'),
          chartSortBy: 'CountSum',
          data: rawListData.map(item => {
            if (unit === '%') {
              return parseFloat(item.CountSum) * 100
            } else {
              return parseFloat(item.CountSum)
            }
          }),
          type: 'bar',
          barMaxWidth: 60,
          symbolSize: 6,
          smooth: false,
          areaStyle: {},
          yAxisIndex: unit === '%' ? 2 : 0
        }, {
          name: this.query.indicators[0].text + '_' + this.getDateText(this.query.compareDateRange, 'YYYY/MM/DD', '-'),
          chartSortBy: 'CompareCountSum',
          data: rawListData.map(item => {
            if (unit === '%') {
              return parseFloat(item.CompareCountSum) * 100
            } else {
              return parseFloat(item.CompareCountSum)
            }
          }),
          type: 'bar',
          barMaxWidth: 60,
          symbolSize: 6,
          smooth: false,
          areaStyle: {},
          yAxisIndex: unit === '%' ? 2 : 0
        }, {
          name: '增长量',
          chartSortBy: 'DiffCount',
          data: rawListData.map(item => {
            if (unit === '%') {
              return parseFloat(item.DiffCount) * 100
            } else {
              return parseFloat(item.DiffCount)
            }
          }),
          type: 'bar',
          barMaxWidth: 60,
          symbolSize: 6,
          smooth: false,
          areaStyle: {},
          yAxisIndex: unit === '%' ? 2 : 0
        }, {
          name: '增幅',
          chartSortBy: 'DiffRate',
          data: rawListData.map(item => parseFloat(item.DiffRate) * 100),
          type: 'bar',
          barMaxWidth: 60,
          symbolSize: 6,
          smooth: false,
          areaStyle: {},
          yAxisIndex: 3
        }]
      }
    },
    tableTotalSize () {
      switch (this.tableFilter) {
        case 1:
          return this.rawListData.length
        case 2:
          return this.rawListData.filter(item => parseFloat(item.DiffRate) > 0).length
        case 3:
          return this.rawListData.filter(item => parseFloat(item.DiffRate) < 0).length
        case 4:
          return this.rawListData.filter(item => parseFloat(item.DiffRate) === 0).length
      }
    },
    tableData () {
      let rawListData = []
      let showSum = true
      switch (this.tableFilter) {
        case 1:
          rawListData = [...this.rawListData]
          showSum = true
          break
        case 2:
          rawListData = this.rawListData.filter(item => parseFloat(item.DiffRate) > 0)
          showSum = false
          break
        case 3:
          rawListData = this.rawListData.filter(item => parseFloat(item.DiffRate) < 0)
          showSum = false
          break
        case 4:
          rawListData = this.rawListData.filter(item => parseFloat(item.DiffRate) === 0)
          showSum = false
          break
      }
      if (rawListData.length === 0) return []

      if (this.sortBy) {
        const sortBy = this.sortBy
        const order = this.order
        rawListData.sort((a, b) => {
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
        })
      }

      const startIndex = (this.tableCurrentPage - 1) * this.tablePageSize
      const length = Math.min(this.tableCurrentPage * this.tablePageSize, rawListData.length)
      return this.generateTableData(this.summaryData, rawListData, startIndex, length, this.query.indicators, showSum, true)
    }
  },
  watch: {
    compareObject: {
      handler: function (val, oldVal) {
        // 选 合伙人 时，禁用 合伙人、运维人员 筛选框；
        // 选 运维人员 时，禁用 运维人员 筛选框；
        // 选 主场景 时，禁用 主场景、子场景 筛选框；
        // 选 子场景 时，禁用 子场景 筛选框；
        // 选 省份 时，禁用 省份、城市 筛选框；
        // 选 城市 时，禁用 城市 筛选框；
        this.isMainSceneDisabled = false
        this.isSubSceneDisabled = false
        this.isProvinceDisabled = false
        this.isCityDisabled = false
        this.isAgentDisabled = false
        this.isEmployeeDisabled = false

        switch (val.name) {
          case 'AgentId':
            this.isAgentDisabled = true
            this.isEmployeeDisabled = true
            this.agent = []
            this.employee = []
            break
          case 'EmployeeId':
            this.isEmployeeDisabled = true
            this.employee = []
            break
          case 'MainScene':
            this.isMainSceneDisabled = true
            this.isSubSceneDisabled = true
            this.mainScene = []
            this.subScene = []
            break
          case 'SubScene':
            this.isSubSceneDisabled = true
            this.subScene = []
            break
          case 'ProvinceId':
            this.isProvinceDisabled = true
            this.isCityDisabled = true
            this.province = []
            this.city = []
            break
          case 'CityId':
            this.isCityDisabled = true
            this.city = []
            break
        }
      },
      deep: false
    },
    dateRange: {
      handler: function (val, oldVal) {
        if (val[0] === val[1]) {
          this.indicatorGroup[0].indicators.forEach(item => {
            item.disabled = false
          })
        } else {
          this.indicatorGroup[0].indicators.forEach(item => {
            item.disabled = true
          })
          this.indicators = [this.indicatorMap.get('FollowCountSum')]
        }
        this.indicatorGroup = [...this.indicatorGroup]
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
    chart: {
      handler: function (val, oldVal) {
        val && (this.chartOptions = this.chart.getOption())
      },
      deep: false
    },
    $route (val, oldVal) {
      if (val.path === '/contrast') {
        const routeQuery = this.$route.query
        if (Object.keys(routeQuery).length > 0) {
          if (!(this.routeQuery.compare === routeQuery.compare &&
            this.routeQuery.indicator === routeQuery.indicator &&
            parseInt(this.routeQuery.dt) === parseInt(routeQuery.dt))) {
            this.setQueryFormByRouteQuery(routeQuery)
            this.$nextTick(() => {
              this.fetchData()
            })
          }
        } else {
          this.routeQuery.compare = null
          this.routeQuery.indicator = null
          this.routeQuery.dt = null
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
    },
    getDateText (dateArr, pattern, separator = '~') {
      return dateArr[0] === dateArr[1] ? moment(dateArr[0]).format(pattern) : moment(dateArr[0]).format(pattern) + separator + moment(dateArr[1]).format(pattern)
    },
    generateTableData (summaryData, rawListData, startIndex, length, indicators, showSum = true, isSumAhead = false) {
      const tableData = []
      for (let i = startIndex; i < length; i++) {
        const raw = deepClone(rawListData[i])
        tableData.push(raw)
      }
      if (showSum && Object.keys(summaryData).length > 0) {
        // 汇总数据
        const sum = {
          RealName: '汇总',
          ...deepClone(summaryData)
        }
        if (isSumAhead) {
          tableData.unshift(sum)
        } else {
          tableData.push(sum)
        }
      }
      return tableData
    },
    changeChartSort (sortBy) {
      if (this.chartSortBy !== sortBy) {
        this.chartOrder = 'ascending'
      } else {
        this.chartOrder = this.chartOrder === 'ascending' ? 'descending' : 'ascending'
      }
      this.chartSortBy = sortBy
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
      const { dateType, dateRange, compareDateRange, compareObject, indicators, agent, mainScene, subScene, province, city, employee } = this
      this.query = deepClone({ dateType, dateRange, compareDateRange, compareObject, indicators, agent, mainScene, subScene, province, city, employee })

      // 获取图表数据
      this.isListLoading = true
      this.selectedLegend = null
      this.summaryData = {}
      this.rawListData = []
      this.fetchList().then(({ data }) => {
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
        const summaryData = data.Result.countSumResult
        const rawListData = data.Result.List instanceof Array ? data.Result.List : []

        const unit = this.query.indicators[0].unit

        if (unit) {
          if (unit === '%') {
            summaryData.CountSumText = toPercent(summaryData.Count)
            summaryData.CompareCountSumText = toPercent(summaryData.CompareCount)
            summaryData.DiffCountText = toPercent(summaryData.DiffCount)
          } else {
            summaryData.CountSumText = summaryData.Count + unit
            summaryData.CompareCountSumText = summaryData.CompareCount + unit
            summaryData.DiffCountText = summaryData.DiffCount + unit
          }
        } else {
          summaryData.CountSumText = formatNumber(summaryData.Count)
          summaryData.CompareCountSumText = formatNumber(summaryData.CompareCount)
          summaryData.DiffCountText = formatNumber(summaryData.DiffCount)
        }
        summaryData.DiffRateText = toPercent(summaryData.DiffRate)
        this.summaryData = summaryData

        rawListData.forEach(item => {
          if (unit) {
            if (unit === '%') {
              item.CountSumText = toPercent(item.CountSum)
              item.CompareCountSumText = toPercent(item.CompareCountSum)
              item.DiffCountText = toPercent(item.DiffCount)
            } else {
              item.CountSumText = item.CountSum + unit
              item.CompareCountSumText = item.CompareCountSum + unit
              item.DiffCountText = item.DiffCount + unit
            }
          } else {
            item.CountSumText = formatNumber(item.CountSum)
            item.CompareCountSumText = formatNumber(item.CompareCountSum)
            item.DiffCountText = formatNumber(item.DiffCount)
          }
          item.DiffRateText = toPercent(item.DiffRate)
        })
        this.rawListData = rawListData
      }).catch(() => {
        this.isListLoading = false
      })
    },
    fetchList () {
      const agentId = this.agent.map(item => item.id).join(',')
      const employeeId = this.employee.map(item => item.id).join(',')
      const provinceId = this.province.map(item => item.id).join(',')
      const cityId = this.city.map(item => item.id).join(',')
      const mainScene = this.mainScene.map(item => item.id).join(',')
      const subScene = this.subScene.map(item => item.id).join(',')

      const postData = {
        Group: this.compareObject.name,
        FieldTarget: this.indicators[0].name,
        StartDate: this.dateRange[0],
        EndDate: this.dateRange[1],
        CompareStatus: 1,
        CompareStartDate: this.compareDateRange[0],
        CompareEndDate: this.compareDateRange[1]
      }

      agentId && (postData.AgentId = agentId)
      employeeId && (postData.EmployeeId = employeeId)
      provinceId && (postData.ProvinceId = provinceId)
      cityId && (postData.CityId = cityId)
      mainScene && (postData.MainScene = mainScene)
      subScene && (postData.SubScene = subScene)

      return ContrastApi.getIndexCompareList(postData)
    },

    tableCellClass ({ row, column, rowIndex, columnIndex }) {
      if (column.property === 'DiffCount' || column.property === 'DiffRate') {
        const value = parseFloat(row[column.property])
        if (value > 0) {
          return 'text-danger'
        } else if (value < 0) {
          return 'text-success'
        }
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
      this.isExcelExporting = true
      const { dateRange, compareDateRange, compareObject, indicators } = this.query
      const fileName = '指标对比分析_' + this.getDateText(dateRange, 'YYYYMMDD', '-') + 'VS' + this.getDateText(compareDateRange, 'YYYYMMDD', '-')
      const summaryData = this.summaryData
      const rawListData = this.rawListData

      const sheetData = []

      let filteredData = [...rawListData]
      let length = filteredData.length
      sheetData.push({
        sheetName: '全部',
        data: this.generateTableData(summaryData, filteredData, 0, length, indicators, true, true)
      })

      filteredData = rawListData.filter(item => parseFloat(item.DiffRate) > 0)
      length = filteredData.length
      sheetData.push({
        sheetName: '升',
        data: this.generateTableData(summaryData, filteredData, 0, length, indicators, false, true)
      })

      filteredData = rawListData.filter(item => parseFloat(item.DiffRate) < 0)
      length = filteredData.length
      sheetData.push({
        sheetName: '降',
        data: this.generateTableData(summaryData, filteredData, 0, length, indicators, false, true)
      })

      filteredData = rawListData.filter(item => parseFloat(item.DiffRate) === 0)
      length = filteredData.length
      sheetData.push({
        sheetName: '平',
        data: this.generateTableData(summaryData, filteredData, 0, length, indicators, false, true)
      })

      const fields = {
        RealName: compareObject.text,
        CountSumText: indicators[0].text + '_' + this.getDateText(dateRange, 'YYYY/MM/DD', '-'),
        CompareCountSumText: indicators[0].text + '_' + this.getDateText(compareDateRange, 'YYYY/MM/DD', '-'),
        DiffCountText: '差异',
        DiffRateText: '增幅'
      }

      exportExcel(sheetData, fields, fileName)
      this.isExcelExporting = false
    },
    highlightChart (seriesIndex) {
      this.chart.dispatchAction({
        type: 'highlight',
        seriesIndex: seriesIndex
      })
    },
    downplayChart (seriesIndex) {
      this.chart.dispatchAction({
        type: 'downplay',
        seriesIndex: seriesIndex
      })
    },
    toggleChart (name) {
      this.chart.dispatchAction({
        type: 'legendToggleSelect',
        name: name
      })
      this.chartOptions = this.chart.getOption()
      this.selectedLegend = this.chartOptions.legend[0].selected
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
      border-top: 1px solid #e1e3e4;
      border-left: 1px solid #e1e3e4;
      border-right: 1px solid #e1e3e4;
      background-color: #fff;
      .indicator-wrapper {
        padding: 20px 0 15px 20px;
      }
      .chart-sort {
        padding: 20px 20px 0;
        text-align: right;
      }
      .chart-compare {
        margin-bottom: 16px;
        text-align: center;
      }
      .table-filter-wrapper {
        padding: 20px 20px 10px;
        border-top: 1px solid rgb(240, 240, 240);
        text-align: right;
      }
    }
  }
}
.index-column {
  width: 24px;
  margin-right: 14px;
}
.legend-wrapper {
  margin-top: 15px;
  text-align: center;
  .legend {
    display: inline-block;
    margin: 0 10px;
    vertical-align: middle;
    cursor: pointer;
    user-select: none;
    .legend-icon {
      display: inline-block;
      width: 25px;
      height: 14px;
      border-radius: 3px;
      vertical-align: middle;
    }
    .legend-name {
      font: 12px 'Microsoft YaHei';
      margin-left: 5px;
    }
    .caret-wrapper {
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      height: 34px;
      width: 24px;
      margin-left: 5px;
      vertical-align: middle;
      cursor: pointer;
      overflow: initial;
      position: relative;

      .sort-caret {
        width: 0;
        height: 0;
        border: 5px solid transparent;
        position: absolute;
        left: 7px;
        &.ascending {
          border-bottom-color: #c0c4cc;
          top: 5px;
        }
        &.descending {
          border-top-color: #c0c4cc;
          bottom: 7px;
        }

      }
      &.ascending {
        .ascending {
          border-bottom-color: #409EFF;
        }
      }
      &.descending {
        .descending {
          border-top-color: #409EFF;
        }
      }
    }
    &.inactive {
      .legend-icon {
        background-color: #ccc !important;
      }
      .legend-name {
        color: #ccc !important;
      }
    }
    &:hover {
      .legend-icon {
        opacity: 0.7;
      }
    }
  }
}
</style>
