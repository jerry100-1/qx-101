<template>
  <div class="main">
    <div ref="queryContent" v-sticky="{zIndex: 2001, stickyTop: 0, disabled: false}">
      <div class="header-wrapper">
        <div class="d-flex justify-content-between">
          <div class="filter-wrapper mr-2">
            <div class="filter-container">
              <time-selector
                class="d-inline-block mr-3"
                :disabled="isListLoading || isChartLoading || isExcelExporting"
                :date-type.sync="dateType"
                :date-range.sync="dateRange"
                :granularity.sync="granularity"
                :enabled-granularity="[1, 2]"
                :show-compare="false">
              </time-selector>
              <div class="filter-item">
                <label>设备ID：</label>
                <el-input
                  class="filter-input"
                  :disabled="isListLoading || isChartLoading || isExcelExporting"
                  clearable
                  v-model.trim="scaleNo">
                </el-input>
              </div>
            </div>
            <div class="filter-container">
              <div class="filter-item mr-3">
                <label>地域：</label>
                <tree-transfer
                  :disabled="isListLoading || isChartLoading || isExcelExporting"
                  v-model="area"
                  :source="areaList">
                </tree-transfer>
              </div>
              <div class="filter-item mr-3">
                <label>场景：</label>
                <tree-transfer
                  :disabled="isListLoading || isChartLoading || isExcelExporting"
                  v-model="scene"
                  :source="sceneList"
                  :show-shortcut="true">
                </tree-transfer>
              </div>
              <div class="filter-item mr-3">
                <label>合伙人：</label>
                <tree-transfer
                  :disabled="isListLoading || isChartLoading || isExcelExporting"
                  v-model="agent"
                  :source="agentList"
                  value-consists-of="leaf"
                  :show-shortcut="true">
                </tree-transfer>
              </div>
              <div class="filter-item mr-3">
                <label>铺秤人员：</label>
                <tree-transfer
                  :disabled="isListLoading || isChartLoading || isExcelExporting || isLoadingEmployeeFilter"
                  v-model="employee"
                  :source="employeeList"
                  :show-shortcut="true">
                </tree-transfer>
              </div>
              <div class="filter-item">
                <label>店铺名称：</label>
                <el-input
                  class="filter-input"
                  :disabled="isListLoading || isChartLoading || isExcelExporting"
                  clearable
                  v-model.trim="storeName">
                </el-input>
              </div>
            </div>
          </div>
          <div class="tools">
            <div class="filter-item">
              <el-button :loading="isListLoading || isChartLoading" :disabled="isExcelExporting || isLoadingEmployeeFilter" @click="fetchData" type="primary" style="width: 100px;" icon="el-icon-search">查询</el-button>
            </div>
            <div class="filter-item">
              <el-button :loading="isExcelExporting" :disabled="isListLoading || isChartLoading || isLoadingEmployeeFilter" @click="exportExcel" type="primary" style="width: 100px;" icon="el-icon-download">导出</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="content-wrapper">
      <div class="main-content">
        <div class="indicator-wrapper">
          <indicator-pop
            :disabled="isListLoading || isChartLoading || isExcelExporting"
            v-model="chartIndicators"
            :indicator-group="indicatorGroup"
            :max="1">
          </indicator-pop>
        </div>
        <general-chart v-loading="isChartLoading" :chart-data="chartData" style="height: 290px;"></general-chart>
        <el-table
          ref="table"
          @row-click="handleTableRowClick"
          @sort-change="handleTableSortChange"
          :default-sort="{prop: 'FollowCountSum', order: 'descending'}"
          :data="tableData"
          v-loading="isListLoading"
          :header-cell-class-name="tableHeaderCellClass"
          :cell-style="tableCellStyle"
          border
          fit
          highlight-current-row
          style="width: 100%;"
          :max-height="tableMaxHeight">
          <el-table-column
            type="index"
            label="序号"
            min-width="50">
          </el-table-column>
          <el-table-column
            prop="FollowCountSum"
            label="导粉数"
            :sort-orders="['ascending', 'descending']"
            sortable="custom">
            <template slot-scope="scope">
              <span>{{ scope.row.FollowCountSumText }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="ScaleNo"
            label="设备ID"
            min-width="130">
            <template slot-scope="scope">
              <a @click.stop="showScaleDetail(scope.row.ScaleNo)" class="highlight" href="javascript:;">{{ scope.row.ScaleNo }}</a>
            </template>
          </el-table-column>
          <el-table-column
            prop="StoreName"
            label="店铺名称"
            min-width="180">
          </el-table-column>
          <el-table-column
            v-for="item in indicatorsForTable.filter(item => item.name !== 'FollowCountSum')"
            :key="item.name"
            :prop="item.field"
            :label="item.text"
            :sort-orders="['ascending', 'descending']"
            sortable="custom">
            <template slot-scope="scope">
              <span>{{ scope.row[item.name + 'Text'] }}</span>
            </template>
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
import IndicatorPop from '@/components/report/indicator-pop'
import GeneralChart from '@/components/report/general-chart'
import VueSticky from 'vue-sticky'
import moment from 'moment'
import * as ReportCommonApi from '@/api/report/common'
import * as ScaleAnalysisApi from '@/api/report/scale-analysis'
import swal from 'sweetalert2'
import { deepClone, toPercent, formatNumber } from '@/utils'
import { mapGetters } from 'vuex'
import exportExcel from '@/utils/exportExcel'

export default {
  name: 'scale-analysis',
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
    const indicatorGroup = [
      {
        groupName: '设备指标',
        indicators: [
          {
          //   name: 'OnlineCountRateSum',
          //   text: '设备在线率',
          //   yAxisIndex: 2,
          //   unit: '%'
          // }, {
            name: 'OnlineCountSum',
            text: '在线状态',
            yAxisIndex: 5
          // }, {
          //   name: 'OperateCountSum',
          //   text: '上线运营设备数',
          //   yAxisIndex: 0
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
          // }, {
          //   name: 'UnFollowCountSum',
          //   text: '取关数',
          //   yAxisIndex: 0
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
          // }, {
          //   name: 'H5FollowRateSum',
          //   text: 'H5扫码关注转化率',
          //   yAxisIndex: 2,
          //   unit: '%'
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
          // }, {
          //   name: 'AvgScanCountSum',
          //   text: '设备日均屏幕扫码数',
          //   yAxisIndex: 1
          }
        ]
      }
    ]
    const indicatorsForTable = [
      {
        name: 'FollowCountSum',
        text: '导粉数',
        field: 'FollowCountSum'
      }, {
        name: 'DayAvgFollowCount',
        text: '设备日均导粉数',
        field: 'AvgFollowCountSum'
      }, {
        name: 'WeightCountSum',
        text: '称重数',
        field: 'WeightCountSum'
      }, {
        name: 'DayAvgWeightCount',
        text: '设备日均称重次数',
        field: 'AvgWeightCountSum'
      }, {
        name: 'ScanCountSum',
        text: '屏幕扫码数',
        field: 'ScanCountSum'
      }, {
        name: 'AvgScanCountSum',
        text: '设备日均屏幕扫码数',
        field: 'AvgScanCountSum'
      }, {
        name: 'ScanCountRate',
        text: '屏幕扫码率',
        unit: '%',
        field: 'ScanCountRateSum'
      }, {
        name: 'GzhScanCountSum',
        text: 'H5扫码数',
        field: 'GzhScanCountSum'
      }, {
        name: 'GzhScanCountRate',
        text: 'H5扫码转化率',
        unit: '%',
        field: 'GzhScanCountRateSum'
      }, {
        name: 'H5FollowRateSum',
        text: 'H5扫码关注转化率',
        unit: '%',
        field: 'H5FollowRateSum'
      }, {
        name: 'UnFollowCountSum',
        text: '取关数',
        field: 'UnFollowCountSum'
      }, {
        name: 'WeightCountRate',
        text: '导粉率',
        unit: '%',
        field: 'FollowCountRateSum'
      }, {
        name: 'XcxScanCountSum',
        text: 'H5扫码数（小程序）',
        field: 'XcxScanCountSum'
      }, {
        name: 'XcxScanCountRate',
        text: '导粉率（小程序）',
        unit: '%',
        field: 'XcxScanCountRateSum'
      }
    ]
    const indicatorMap = new Map([].concat(...indicatorGroup.map(item => item.indicators)).map(item => [item.name, item]))
    const indicatorMapForTable = new Map(indicatorsForTable.map(item => [item.name, item]))
    const chartIndicators = [indicatorMap.get('FollowCountSum')]

    const dateType = 1
    const dateRange = [today, today]
    const granularity = 1

    const agent = []
    const scene = []
    const area = []
    const employee = []

    const scaleNo = null
    const storeName = null

    return {
      // 时间 今天：1, 昨天：2, 最近7天：3，最近30天：4
      dateType: dateType,
      // 日期范围，今天/昨天传两个日期相同的数组
      dateRange: dateRange,
      // 时间粒度
      granularity: granularity,
      // 设备ID
      scaleNo: scaleNo,
      // 店铺名称
      storeName: storeName,
      // 已选合伙人
      agent: agent,
      // 已选场景
      scene: scene,
      // 已选地域
      area: area,
      // 已选铺秤人员
      employee: employee,
      // 用于过滤以上四种选项
      filters: {},
      // 加载过滤条件
      isLoadingEmployeeFilter: false,

      // 分组的指标列表对象
      indicatorGroup: indicatorGroup,
      // 表格指标列表
      indicatorsForTable: indicatorsForTable,
      // 表格指标的Map
      indicatorMapForTable: indicatorMapForTable,
      // 指标key与指标对象Map
      indicatorMap: indicatorMap,
      // 图形展示指标
      chartIndicators: chartIndicators,

      // 图表数据加载状态
      isChartLoading: false,
      isListLoading: false,
      // 导出状态
      isExcelExporting: false,
      // 保存之前的请求参数
      query: deepClone({ dateType, dateRange, granularity, agent, scene, area, employee, scaleNo, storeName }),
      // 表格原始数据
      rawListData: [],
      // 图形原始数据
      rawChartData: [],
      // 当前图形对应的秤信息
      scaleInfo: {},
      // 表格当前页
      tableCurrentPage: 1,
      // 表格一页条数可选项
      tablePageSizeOption: [20, 30, 50, 100],
      // 表格一页条数
      tablePageSize: 50,
      // 总条数
      tableTotalSize: 0,
      // 表格当前排序字段
      sortBy: 'FollowCountSum',
      // 表格当前排序方向
      order: 'descending',
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
    // 图形数据
    chartData () {
      const indicator = this.chartIndicators[0]
      return {
        // 横轴类目
        xAxis: {
          data: this.rawChartData.map(item => {
            if (this.query.granularity === 1) {
              return parseInt(item.DateFormat)
            } else {
              return item.DateFormat || '--'
            }
          })
        },
        // tooltip标题
        categoryTooltip: this.rawChartData.map(item => {
          if (this.query.granularity === 1 && !isNaN(item.DateFormat)) {
            return item.DateFormat + ':00-' + item.DateFormat + ':59'
          } else {
            return item.DateFormat || '--'
          }
        }),
        // 数据
        series: [
          {
            name: indicator.text + (this.scaleInfo.ScaleNo ? `（设备ID${this.scaleInfo.ScaleNo}）` : ''),
            data: this.rawChartData.map(item => {
              if (indicator.name === 'OnlineCountSum') {
                return parseFloat(item.Count) === 1 ? '在线' : '离线'
              } else if (indicator.unit === '%') {
                return parseFloat(item.Count) * 100
              } else {
                return parseFloat(item.Count)
              }
            }),
            type: 'line',
            symbolSize: 6,
            smooth: false,
            areaStyle: {},
            yAxisData: ['离线', '在线'],
            yAxisIndex: indicator.yAxisIndex
          }
        ]
      }
    },
    // 表格数据
    tableData () {
      return this.generateTableData(this.rawListData)
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
    chartIndicators: {
      handler: function (val, oldVal) {
        if (this.rawListData.length > 0) {
          this.fetchChartData(this.scaleInfo)
        }
      },
      deep: true
    }
  },
  created () {
    this.$store.dispatch('getAllReportFilters')
    this.getIncomeList()
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
    generateTableData (rawListData) {
      const tableData = []
      rawListData.forEach(item => {
        const data = deepClone(item)
        Object.keys(data).forEach(name => {
          if (this.indicatorMapForTable.has(name)) {
            const unit = this.indicatorMapForTable.get(name).unit
            if (unit) {
              if (unit === '%') {
                data[name + 'Text'] = toPercent(data[name])
              } else {
                data[name + 'Text'] = data[name] + unit
              }
            } else {
              data[name + 'Text'] = formatNumber(data[name])
            }
          }
        })
        tableData.push(data)
      })
      return tableData
    },
    getAssociatedFilters (changedFilter) {
      this.isLoadingEmployeeFilter = true
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
      const { dateType, dateRange, granularity, agent, scene, area, employee, scaleNo, storeName } = this
      this.query = deepClone({ dateType, dateRange, granularity, agent, scene, area, employee, scaleNo, storeName })

      this.tableCurrentPage = 1
      this.tableTotalSize = 0
      this.rawChartData = []
      this.scaleInfo = {}
      this.fetchList().then(() => {
        if (this.rawListData.length > 0) {
          this.fetchChartData(this.rawListData[0])
        }
      })
    },
    fetchList () {
      this.isListLoading = true
      this.rawListData = []

      const { dateRange, agent, scene, area, employee, scaleNo, storeName } = this.query

      const agentId = agent.map(item => item.id).join(',')
      const employeeId = employee.map(item => item.id).join(',')
      const provinceId = area.filter(item => item.raw.Level === '1').map(item => item.id).join(',')
      const cityId = area.filter(item => item.raw.Level === '2').map(item => item.id).join(',')
      const districtId = area.filter(item => item.raw.Level === '3').map(item => item.id).join(',')
      const mainScene = scene.filter(item => item.raw.ParentId === '0').map(item => item.id).join(',')
      const subScene = scene.filter(item => item.raw.ParentId !== '0').map(item => item.id).join(',')

      const postData = {
        FieldTarget: this.sortBy,
        StartDate: dateRange[0],
        EndDate: dateRange[1],
        Page: this.tableCurrentPage,
        Limit: this.tablePageSize
      }
      scaleNo && (postData.ScaleNo = scaleNo)
      storeName && (postData.StoreName = storeName)
      agentId && (postData.AgentId = agentId)
      employeeId && (postData.EmployeeId = employeeId)
      provinceId && (postData.ProvinceId = provinceId)
      cityId && (postData.CityId = cityId)
      districtId && (postData.DistrictId = districtId)
      mainScene && (postData.MainScene = mainScene)
      subScene && (postData.SubScene = subScene)
      this.order && (postData.Sort = this.order === 'ascending' ? 'asc' : 'desc')

      return new Promise((resolve, reject) => {
        ScaleAnalysisApi.getScaleAnalysis(postData).then(({ data }) => {
          this.isListLoading = false
          if (data.Status !== 200) {
            swal({
              text: data.Result.ErrorMsg,
              type: 'error',
              timer: 2000,
              showConfirmButton: false
            })
            return reject(data.Result.ErrorMsg)
          }
          this.rawListData = data.Result.List
          this.tableTotalSize = data.Result.Count
          resolve()
        }).catch(error => {
          this.isListLoading = false
          reject(error)
        })
      })
    },
    tableHeaderCellClass ({ row, column, rowIndex, columnIndex }) {
      return 'font-weight-bold text-dark'
    },
    tableCellStyle ({ row, column, rowIndex, columnIndex }) {
      if (column.property !== 'ScaleNo') {
        return { cursor: 'pointer' }
      }
      return {}
    },
    handleTableSortChange ({ column, prop, order }) {
      if (this.sortBy === prop && this.order === order) return
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
    handleTableRowClick (row, event, column) {
      if (column.property === 'ScaleNo') return
      this.fetchChartData(row)
    },
    // 获取图形数据
    fetchChartData (scaleInfo) {
      this.isChartLoading = true
      this.rawChartData = []
      this.scaleInfo = scaleInfo

      const { dateRange, granularity } = this.query

      let method = 'getHourScaleAnalysisEcharts'
      switch (granularity) {
        case 1:
          method = 'getHourScaleAnalysisEcharts'
          break
        case 2:
          method = 'getDayScaleAnalysisEcharts'
          break
      }

      const postData = {
        FieldTarget: this.chartIndicators[0].name,
        ScaleNo: scaleInfo.ScaleNo,
        StartDate: dateRange[0],
        EndDate: dateRange[1]
      }

      ScaleAnalysisApi[method](postData).then(({ data }) => {
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
        this.scaleInfo = scaleInfo
      }).catch(() => {
        this.isChartLoading = false
      })
    },
    exportExcel () {
      this.isExcelExporting = true
      const { dateRange, agent, scene, area, employee, scaleNo, storeName, indicatorMapForTable } = this
      const fileName = '设备分析_' + moment(dateRange[0]).format('YYYYMMDD') + '-' + moment(dateRange[1]).format('YYYYMMDD')

      const agentId = agent.map(item => item.id).join(',')
      const employeeId = employee.map(item => item.id).join(',')
      const provinceId = area.filter(item => item.raw.Level === '1').map(item => item.id).join(',')
      const cityId = area.filter(item => item.raw.Level === '2').map(item => item.id).join(',')
      const districtId = area.filter(item => item.raw.Level === '3').map(item => item.id).join(',')
      const mainScene = scene.filter(item => item.raw.ParentId === '0').map(item => item.id).join(',')
      const subScene = scene.filter(item => item.raw.ParentId !== '0').map(item => item.id).join(',')

      const postData = {
        FieldTarget: 'FollowCountSum',
        Sort: 'desc',
        StartDate: dateRange[0],
        EndDate: dateRange[1],
        Download: 'excel'
      }
      scaleNo && (postData.ScaleNo = scaleNo)
      storeName && (postData.StoreName = storeName)
      agentId && (postData.AgentId = agentId)
      employeeId && (postData.EmployeeId = employeeId)
      provinceId && (postData.ProvinceId = provinceId)
      cityId && (postData.CityId = cityId)
      districtId && (postData.DistrictId = districtId)
      mainScene && (postData.MainScene = mainScene)
      subScene && (postData.SubScene = subScene)

      ScaleAnalysisApi.getScaleAnalysis(postData).then(({ data }) => {
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
          FollowCountSumText: '导粉数',
          ScaleNo: '设备ID',
          StoreName: '店铺名称'
        }
        indicatorMapForTable.forEach(indicator => {
          if (indicator.name !== 'FollowCountSum') {
            fields[indicator.name + 'Text'] = indicator.text
          }
        })
        exportExcel([{ sheetName: fileName, data: tableData }], fields, fileName)
        this.isExcelExporting = false
      }).catch(() => {
        this.isExcelExporting = false
      })
    },
    // 打开设备详情
    showScaleDetail (scaleNo) {
      this.$router.push({ path: '/scale-detail', query: { scaleno: scaleNo } })
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
  .filter-input {
    width: 200px;
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
    }
  }
}
.highlight {
  color: #409EFF;
  cursor: pointer;
}
</style>
