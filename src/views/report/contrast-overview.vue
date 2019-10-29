<template>
  <div class="main">
    <div ref="queryContent" v-sticky="{zIndex: 2001, stickyTop: 0, disabled: false}">
      <div class="header-wrapper">
        <div>
          <div class="filter-container">
            <time-selector
              class="d-inline-block"
              :disabled="isAllLoading"
              :date-type.sync="dateType"
              :date-range.sync="dateRange"
              :compare-checkable="false"
              :compare-date-range.sync="compareDateRange"
              :disabled-date="disabledDate"
              :show-granularity="false"
              :show-compare-shortcut="true">
            </time-selector>
          </div>
          <div class="filter-container">
            <div class="filter-item mr-3">
              <label>主场景：</label>
              <tree-transfer
                :disabled="isAllLoading"
                v-model="mainScene"
                :source="mainSceneList"
                :width="140"
                :show-shortcut="true">
              </tree-transfer>
            </div>
            <div class="filter-item mr-3">
              <label>子场景：</label>
              <tree-transfer
                :disabled="isAllLoading"
                v-model="subScene"
                :source="subSceneList"
                :width="140"
                :show-shortcut="true">
              </tree-transfer>
            </div>
            <div class="filter-item mr-3">
              <label>省份：</label>
              <tree-transfer
                :disabled="isAllLoading"
                v-model="province"
                :source="provinceList"
                :width="140"
                :show-shortcut="true">
              </tree-transfer>
            </div>
            <div class="filter-item mr-3">
              <label>城市：</label>
              <tree-transfer
                :disabled="isAllLoading"
                v-model="city"
                :source="cityList"
                :width="140"
                :show-shortcut="true">
              </tree-transfer>
            </div>
            <div class="filter-item mr-3">
              <label>合伙人：</label>
              <tree-transfer
                :disabled="isAllLoading"
                v-model="agent"
                :source="agentList"
                :width="140"
                value-consists-of="leaf"
                :show-shortcut="true">
              </tree-transfer>
            </div>
            <div class="filter-item">
              <label>铺秤人员：</label>
              <tree-transfer
                :disabled="isAllLoading || isLoadingEmployeeFilter"
                v-model="employee"
                :source="employeeList"
                :width="140"
                :show-shortcut="true">
              </tree-transfer>
            </div>
          </div>
          <div class="filter-container">
            <div class="filter-item mr-4">
              <label>指标：</label>
              <indicator-pop
                :disabled="isAllLoading"
                v-model="indicators"
                :indicator-group="indicatorGroup"
                :hide-label="true"
                :max="1">
              </indicator-pop>
            </div>
            <div class="filter-item">
              <el-button :loading="isAllLoading" :disabled="isLoadingEmployeeFilter" @click="fetchData" type="primary" style="width: 100px;" icon="el-icon-search">查询</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="content-wrapper">
      <div v-for="compareObject in compareObjects" :key="compareObject.name" class="content">
        <div class="d-flex justify-content-between align-items-center table-title">
          <h6 class="mb-0">{{ compareObject.text }}对比</h6>
          <font-awesome-icon @click="viewContrast(compareObject.name)" :icon="icons.faChevronCircleRight" class="link"></font-awesome-icon>
        </div>
        <el-table
          v-if="query.indicators"
          @sort-change="params => handleTableSortChange(params, compareObject.name)"
          :data="_self['tableDataFor' + compareObject.name]"
          v-loading="isListLoading[compareObject.name]"
          :cell-class-name="tableCellClass"
          border
          fit
          highlight-current-row
          style="width: 100%;"
          :max-height="tableMaxHeight">
          <el-table-column
            prop="RealName"
            :label="compareObject.text">
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
        <div v-show="!isListLoading[compareObject.name]" class="text-center py-3">
          <el-pagination
            @size-change="value => handlePageSizeChange(value, compareObject.name)"
            :current-page.sync="tableCurrentPage[compareObject.name]"
            :page-sizes="tablePageSizeOption"
            :page-size="tablePageSize[compareObject.name]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="_self['tableTotalSizeFor' + compareObject.name]"
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
import VueSticky from 'vue-sticky'
import moment from 'moment'
import * as ReportCommonApi from '@/api/report/common'
import * as ContrastApi from '@/api/report/contrast'
import swal from 'sweetalert2'
import { deepClone, toPercent, formatNumber } from '@/utils'
import { mapGetters } from 'vuex'
import { faChevronCircleRight } from '@fortawesome/free-solid-svg-icons'

export default {
  name: 'contrast-overview',
  components: {
    TimeSelector,
    TreeTransfer,
    IndicatorPop
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

      // 汇总指标数据
      summaryData: compareObjects.reduce((acc, cur) => {
        acc[cur.name] = {}
        return acc
      }, {}),

      // 分组的指标列表对象
      indicatorGroup: indicatorGroup,
      // 指标key与指标对象Map
      indicatorMap: indicatorMap,
      // 展示指标
      indicators: indicators,

      // 图表数据加载状态
      isListLoading: compareObjects.reduce((acc, cur) => {
        acc[cur.name] = false
        return acc
      }, {}),
      // 保存之前的请求参数
      query: deepClone({ dateType, dateRange, compareDateRange, indicators, agent, mainScene, subScene, province, city, employee }),
      // 图表原始数据
      rawListData: compareObjects.reduce((acc, cur) => {
        acc[cur.name] = []
        return acc
      }, {}),

      // 表格当前页
      tableCurrentPage: compareObjects.reduce((acc, cur) => {
        acc[cur.name] = 1
        return acc
      }, {}),
      // 表格一页条数可选项
      tablePageSizeOption: [20, 30, 50, 100],
      // 表格一页条数
      tablePageSize: compareObjects.reduce((acc, cur) => {
        acc[cur.name] = 20
        return acc
      }, {}),
      // 表格当前排序字段
      sortBy: compareObjects.reduce((acc, cur) => {
        acc[cur.name] = null
        return acc
      }, {}),
      // 表格当前排序方向
      order: compareObjects.reduce((acc, cur) => {
        acc[cur.name] = null
        return acc
      }, {}),
      icons: {
        faChevronCircleRight
      },
      requestCount: 0,
      // 除表格外内容区域高度
      othersHeight: 0,
      // 合伙人收益模式列表
      agentGainList: []
    }
  },
  computed: {
    cachedViews () {
      return this.$store.state.tagsView.cachedViews
    },
    isAllLoading () {
      return Object.values(this.isListLoading).includes(true)
    },
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
    tableTotalSizeForMainScene () {
      return this.rawListData['MainScene'].length
    },
    tableTotalSizeForSubScene () {
      return this.rawListData['SubScene'].length
    },
    tableTotalSizeForProvinceId () {
      return this.rawListData['ProvinceId'].length
    },
    tableTotalSizeForCityId () {
      return this.rawListData['CityId'].length
    },
    tableTotalSizeForAgentId () {
      return this.rawListData['AgentId'].length
    },
    tableTotalSizeForEmployeeId () {
      return this.rawListData['EmployeeId'].length
    },
    tableDataForMainScene () {
      const compareObject = 'MainScene'
      return this.getTableData(this.summaryData[compareObject], this.rawListData[compareObject], this.sortBy[compareObject], this.order[compareObject], this.tableCurrentPage[compareObject], this.tablePageSize[compareObject])
    },
    tableDataForSubScene () {
      const compareObject = 'SubScene'
      return this.getTableData(this.summaryData[compareObject], this.rawListData[compareObject], this.sortBy[compareObject], this.order[compareObject], this.tableCurrentPage[compareObject], this.tablePageSize[compareObject])
    },
    tableDataForProvinceId () {
      const compareObject = 'ProvinceId'
      return this.getTableData(this.summaryData[compareObject], this.rawListData[compareObject], this.sortBy[compareObject], this.order[compareObject], this.tableCurrentPage[compareObject], this.tablePageSize[compareObject])
    },
    tableDataForCityId () {
      const compareObject = 'CityId'
      return this.getTableData(this.summaryData[compareObject], this.rawListData[compareObject], this.sortBy[compareObject], this.order[compareObject], this.tableCurrentPage[compareObject], this.tablePageSize[compareObject])
    },
    tableDataForAgentId () {
      const compareObject = 'AgentId'
      return this.getTableData(this.summaryData[compareObject], this.rawListData[compareObject], this.sortBy[compareObject], this.order[compareObject], this.tableCurrentPage[compareObject], this.tablePageSize[compareObject])
    },
    tableDataForEmployeeId () {
      const compareObject = 'EmployeeId'
      return this.getTableData(this.summaryData[compareObject], this.rawListData[compareObject], this.sortBy[compareObject], this.order[compareObject], this.tableCurrentPage[compareObject], this.tablePageSize[compareObject])
    }
  },
  watch: {
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
    }
  },
  created () {

  },
  mounted () {
    this.$store.dispatch('getAllReportFilters')
    this.getIncomeList()
    this.fetchData()
  },
  updated () {
    this.$nextTick(() => {
      const queryContent = this.$refs.queryContent
      const queryContentHeight = queryContent ? Math.round(queryContent.clientHeight) : 0
      this.othersHeight = queryContentHeight + 41 + 64 + 50
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
    getDateText (dateArr, pattern, separator = '~') {
      return dateArr[0] === dateArr[1] ? moment(dateArr[0]).format(pattern) : moment(dateArr[0]).format(pattern) + separator + moment(dateArr[1]).format(pattern)
    },
    getTableData (summaryData, rawListData, sortBy, order, tableCurrentPage, tablePageSize) {
      rawListData = [...rawListData]
      if (rawListData.length === 0) return []

      if (sortBy) {
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

      const startIndex = (tableCurrentPage - 1) * tablePageSize
      const length = Math.min(tableCurrentPage * tablePageSize, rawListData.length)
      return this.generateTableData(summaryData, rawListData, startIndex, length, this.query.indicators, true, true)
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
      const { dateType, dateRange, compareDateRange, indicators, agent, mainScene, subScene, province, city, employee } = this
      this.query = deepClone({ dateType, dateRange, compareDateRange, indicators, agent, mainScene, subScene, province, city, employee })

      this.requestCount = 0
      this.compareObjects.forEach((item, index) => {
        const compareObject = item.name
        if (index === 0) {
          this.fetchList(compareObject)
        } else if (index === 1) {
          setTimeout(() => {
            this.fetchList(compareObject)
          }, 300)
        } else {
          setTimeout(() => {
            this.fetchList(compareObject)
          }, 1000)
        }
      })
    },
    fetchList (compareObject) {
      this.requestCount++
      this.isListLoading[compareObject] = true
      this.summaryData[compareObject] = {}
      this.rawListData[compareObject] = []

      const { dateRange, compareDateRange, indicators, agent, mainScene, subScene, province, city, employee } = this.query

      const agentId = agent.map(item => item.id).join(',')
      const employeeId = employee.map(item => item.id).join(',')
      const provinceId = province.map(item => item.id).join(',')
      const cityId = city.map(item => item.id).join(',')
      const mainSceneId = mainScene.map(item => item.id).join(',')
      const subSceneId = subScene.map(item => item.id).join(',')

      const postData = {
        Group: compareObject,
        FieldTarget: indicators[0].name,
        StartDate: dateRange[0],
        EndDate: dateRange[1],
        CompareStatus: 1,
        CompareStartDate: compareDateRange[0],
        CompareEndDate: compareDateRange[1]
      }

      agentId && (postData.AgentId = agentId)
      employeeId && (postData.EmployeeId = employeeId)
      provinceId && (postData.ProvinceId = provinceId)
      cityId && (postData.CityId = cityId)
      mainSceneId && (postData.MainScene = mainSceneId)
      subSceneId && (postData.SubScene = subSceneId)

      ContrastApi.getIndexCompareList(postData).then(({ data }) => {
        this.isListLoading[compareObject] = false
        if (data.Status !== 200) {
          if (this.requestCount === 1) {
            swal({
              text: data.Result.ErrorMsg,
              type: 'error',
              timer: 2000,
              showConfirmButton: false
            })
          }
          return
        }
        const summaryData = data.Result.countSumResult
        const rawListData = data.Result.List instanceof Array ? data.Result.List : []

        const unit = indicators[0].unit

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
        this.summaryData[compareObject] = summaryData

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
        this.rawListData[compareObject] = rawListData
      }).catch(() => {
        this.isListLoading[compareObject] = false
      })
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
    handleTableSortChange ({ column, prop, order }, compareObject) {
      this.tableCurrentPage[compareObject] = 1
      this.sortBy[compareObject] = prop
      this.order[compareObject] = order
    },
    handlePageSizeChange (value, compareObject) {
      this.tableCurrentPage[compareObject] = 1
      this.tablePageSize[compareObject] = value
    },
    // 查看指标对比分析
    viewContrast (compareObject) {
      const { indicators } = this.query
      if (this.cachedViews.includes('contrast')) {
        this.$router.push({ path: '/contrast' }, () => {
          this.$nextTick(() => {
            this.$router.replace({ path: '/contrast', query: { compare: compareObject, indicator: indicators[0].name, dt: '1' } })
          })
        })
      } else {
        this.$router.push({ path: '/contrast', query: { compare: compareObject, indicator: indicators[0].name, dt: '1' } })
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
</style>
