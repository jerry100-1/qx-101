<template>
  <div class="main">
    <div ref="queryContent" v-sticky="{zIndex: 2001, stickyTop: 0, disabled: false}">
      <div class="header-wrapper">
        <div class="mb-3">
          <h6 class="d-inline-block mb-0 mr-2 font-weight-bold">导粉流向分析</h6>
        </div>
        <div class="d-flex justify-content-between">
          <div class="filter-wrapper mr-2">
            <time-selector
              :disabled="isListLoading || isSummaryLoading || isExcelExporting"
              :date-type.sync="dateType"
              :date-range.sync="dateRange"
              :show-compare="false"
              :show-granularity="false">
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
                  :show-shortcut="true">
                </tree-transfer>
              </div>
              <div class="filter-item">
                <label>设备ID：</label>
                <el-input
                  style="width: 300px;"
                  :disabled="isListLoading || isSummaryLoading || isExcelExporting"
                  clearable
                  placeholder="可搜索多个设备ID，用英文逗号隔开"
                  v-model.trim="scaleNo">
                </el-input>
              </div>
            </div>
          </div>
          <div class="tools">
            <div class="filter-item">
              <el-button :loading="isListLoading || isSummaryLoading" :disabled="isExcelExporting" @click="fetchData" type="primary" style="width: 100px;" icon="el-icon-search">查询</el-button>
            </div>
            <div class="filter-item">
              <el-button :loading="isExcelExporting" :disabled="isListLoading || isSummaryLoading" @click="exportExcel" type="primary" style="width: 100px;" icon="el-icon-download">导出</el-button>
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
        <el-table
          ref="table"
          @sort-change="handleTableSortChange"
          :data="tableData"
          v-loading="isListLoading"
          :row-class-name="tableRowClass"
          border
          fit
          highlight-current-row
          style="width: 100%;"
          :max-height="tableMaxHeight">
          <el-table-column
            prop="AdvName"
            label="公众号">
          </el-table-column>
          <el-table-column
            v-for="item in indicatorsForTable"
            :key="item.name"
            :prop="item.name"
            :label="item.text"
            :sort-orders="['descending', 'ascending']"
            :sortable="item.sortable ? 'custom' : false">
            <template slot-scope="scope">
              <span>{{ scope.row[item.name + 'Text'] }}</span>
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
import IndicatorSummary from '@/components/report/indicator-summary'
import VueSticky from 'vue-sticky'
import moment from 'moment'
import * as AdApi from '@/api/ad'
import swal from 'sweetalert2'
import { deepClone, toPercent, formatNumber } from '@/utils'
import { mapGetters } from 'vuex'
import exportExcel from '@/utils/exportExcel'

export default {
  name: 'follow-flow-analysis',
  components: {
    TimeSelector,
    TreeTransfer,
    IndicatorSummary
  },
  directives: {
    sticky: VueSticky
  },
  data () {
    const today = moment().format('YYYY-MM-DD')
    const indicatorList = [
      {
        name: 'FollowCountSum',
        text: '导粉数（公众号）',
        desc: '用户关注公众号的次数，<br>一个用户多次关注不同公众号，导粉次数累计'
      }, {
        name: 'UnFollowCountSum',
        text: '当日取关数',
        desc: '当日关注后当日取消关注的粉丝数量'
      }, {
        name: 'UnFollowCountRate',
        text: '当日取关率',
        desc: '取关数与导粉数的比值',
        unit: '%'
      }, {
        name: 'WomanRate',
        text: '女性粉丝占比',
        unit: '%'
      }, {
        name: 'ManRate',
        text: '男性粉丝占比',
        unit: '%'
      }, {
        name: 'OtherRate',
        text: '性别未知粉丝占比',
        desc: '根据导粉页授权获取到的粉丝微信性别计算比例',
        unit: '%'
      }
    ]
    const indicatorsForTable = [
      {
        name: 'FollowCountSum',
        text: '导粉数',
        sortable: true
      }, {
        name: 'FollowCountRate',
        text: '导粉占比',
        unit: '%',
        sortable: true
      }, {
        name: 'UnFollowCountSum',
        text: '当日取关数',
        sortable: true
      }, {
        name: 'UnFollowCountRate',
        text: '当日取关率',
        unit: '%',
        sortable: true
      }, {
        name: 'WomanRate',
        text: '女性粉丝占比',
        unit: '%',
        sortable: true
      }, {
        name: 'ManRate',
        text: '男性粉丝占比',
        unit: '%',
        sortable: true
      }, {
        name: 'OtherRate',
        text: '性别未知粉丝占比',
        unit: '%',
        sortable: true
      }
    ]
    const indicatorMap = new Map(indicatorsForTable.map(item => [item.name, item]))

    const dateType = 1
    const dateRange = [today, today]

    const agent = []
    const scene = []
    const area = []

    const scaleNo = null

    return {
      // 时间 今天：1, 昨天：2, 最近7天：3，最近30天：4
      dateType: dateType,
      // 日期范围，今天/昨天传两个日期相同的数组
      dateRange: dateRange,
      // 设备ID
      scaleNo: scaleNo,
      // 已选合伙人
      agent: agent,
      // 已选场景
      scene: scene,
      // 已选地域
      area: area,
      // 用于过滤以上选项
      filters: {},

      // 汇总指标列表
      indicatorList: indicatorList,
      // 汇总指标数据
      summaryData: {},

      // 指标列表对象
      indicatorsForTable: indicatorsForTable,
      // 指标key与指标对象Map
      indicatorMap: indicatorMap,

      // 图表数据加载状态
      isListLoading: false,
      // 汇总数据加载状态
      isSummaryLoading: false,
      // 导出状态
      isExcelExporting: false,
      // 保存之前的请求参数
      query: deepClone({ dateType, dateRange, agent, scene, area, scaleNo }),
      // 图表原始数据
      rawListData: [],

      // 表格当前页
      tableCurrentPage: 1,
      // 表格一页条数可选项
      tablePageSizeOption: [20, 30, 50, 100],
      // 表格一页条数
      tablePageSize: 30,
      // 表格当前排序字段
      sortBy: null,
      // 表格当前排序方向
      order: null,
      // 除表格外内容区域高度
      othersHeight: 0
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
      'areaRawData'
    ]),
    // 合伙人选项数据
    agentList () {
      const agent = this.filters.agent || new Map()
      const size = agent.size
      return this.agentRawData.map(item => {
        return {
          id: item.AgentId,
          label: item.RealName,
          fullLabel: item.RealName,
          disabled: size > 0 && !agent.has(item.AgentId),
          raw: item
        }
      })
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
    tableTotalSize () {
      return this.rawListData.length
    },
    tableData () {
      if (this.rawListData.length === 0) return []
      const sortBy = this.sortBy
      const order = this.order
      let rawListData = [...this.rawListData]
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

      const startIndex = (this.tableCurrentPage - 1) * this.tablePageSize
      const length = Math.min(this.tableCurrentPage * this.tablePageSize, this.tableTotalSize)
      return this.generateTableData(rawListData, startIndex, length)
    }
  },
  created () {
    this.$store.dispatch('getAllReportFilters')
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
    generateTableData (rawListData, startIndex, length) {
      const tableData = []
      for (let i = startIndex; i < length; i++) {
        const data = deepClone(rawListData[i])
        Object.keys(data).forEach(key => {
          const indicator = this.indicatorMap.get(key)
          if (indicator) {
            if (indicator.unit) {
              if (indicator.unit === '%') {
                data[key + 'Text'] = toPercent(data[key])
              } else {
                data[key + 'Text'] = data[key] + indicator.unit
              }
            } else {
              data[key + 'Text'] = formatNumber(data[key])
            }
          }
        })
        tableData.push(data)
      }
      return tableData
    },
    fetchData () {
      // 克隆当前查询条件
      const { dateType, dateRange, agent, scene, area, scaleNo } = this
      this.query = deepClone({ dateType, dateRange, agent, scene, area, scaleNo })
      this.getDiversionStat()
      this.getWeChatList()
    },
    // 获取统计数据
    getDiversionStat () {
      this.isSummaryLoading = true
      this.summaryData = {}

      const { dateRange, agent, scene, area, scaleNo } = this.query

      const agentId = agent.map(item => item.id).join(',')
      const provinceId = area.filter(item => item.raw.Level === '1').map(item => item.id).join(',')
      const cityId = area.filter(item => item.raw.Level === '2').map(item => item.id).join(',')
      const districtId = area.filter(item => item.raw.Level === '3').map(item => item.id).join(',')
      const mainScene = scene.filter(item => item.raw.ParentId === '0').map(item => item.id).join(',')
      const subScene = scene.filter(item => item.raw.ParentId !== '0').map(item => item.id).join(',')
      const postData = {
        StartDate: dateRange[0],
        EndDate: dateRange[1]
      }
      agentId && (postData.AgentId = agentId)
      provinceId && (postData.ProvinceId = provinceId)
      cityId && (postData.CityId = cityId)
      districtId && (postData.DistrictId = districtId)
      mainScene && (postData.MainScene = mainScene)
      subScene && (postData.SubScene = subScene)
      scaleNo && (postData.ScaleNo = scaleNo)

      AdApi.getDiversionStat(postData).then(({ data }) => {
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
    // 获取表格数据
    getWeChatList () {
      this.isListLoading = true
      this.rawListData = []

      const { dateRange, agent, scene, area, scaleNo } = this.query

      const agentId = agent.map(item => item.id).join(',')
      const provinceId = area.filter(item => item.raw.Level === '1').map(item => item.id).join(',')
      const cityId = area.filter(item => item.raw.Level === '2').map(item => item.id).join(',')
      const districtId = area.filter(item => item.raw.Level === '3').map(item => item.id).join(',')
      const mainScene = scene.filter(item => item.raw.ParentId === '0').map(item => item.id).join(',')
      const subScene = scene.filter(item => item.raw.ParentId !== '0').map(item => item.id).join(',')
      const postData = {
        StartDate: dateRange[0],
        EndDate: dateRange[1]
      }
      agentId && (postData.AgentId = agentId)
      provinceId && (postData.ProvinceId = provinceId)
      cityId && (postData.CityId = cityId)
      districtId && (postData.DistrictId = districtId)
      mainScene && (postData.MainScene = mainScene)
      subScene && (postData.SubScene = subScene)
      scaleNo && (postData.ScaleNo = scaleNo)

      AdApi.getWeChatList(postData).then(({ data }) => {
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
        this.rawListData = data.Result.List
      }).catch(() => {
        this.isListLoading = false
      })
    },
    tableRowClass ({ row, rowIndex }) {
      const numA = parseFloat(row.UnFollowCountRate)
      const numB = parseFloat(this.summaryData.UnFollowCountRate)
      if (!isNaN(numA) && !isNaN(numB) && numA > numB) {
        return 'text-danger'
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
      const { dateRange, agent, area, scene, scaleNo } = this
      const fileName = '导粉流向分析_' + moment(dateRange[0]).format('YYYYMMDD') + '-' + moment(dateRange[1]).format('YYYYMMDD')

      const agentId = agent.map(item => item.id).join(',')
      const provinceId = area.filter(item => item.raw.Level === '1').map(item => item.id).join(',')
      const cityId = area.filter(item => item.raw.Level === '2').map(item => item.id).join(',')
      const districtId = area.filter(item => item.raw.Level === '3').map(item => item.id).join(',')
      const mainScene = scene.filter(item => item.raw.ParentId === '0').map(item => item.id).join(',')
      const subScene = scene.filter(item => item.raw.ParentId !== '0').map(item => item.id).join(',')
      const postData = {
        StartDate: dateRange[0],
        EndDate: dateRange[1]
      }
      agentId && (postData.AgentId = agentId)
      provinceId && (postData.ProvinceId = provinceId)
      cityId && (postData.CityId = cityId)
      districtId && (postData.DistrictId = districtId)
      mainScene && (postData.MainScene = mainScene)
      subScene && (postData.SubScene = subScene)
      scaleNo && (postData.ScaleNo = scaleNo)

      AdApi.getWeChatList(postData).then(({ data }) => {
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
        const exportData = this.generateTableData(rawListData, 0, rawListData.length)
        const fields = {
          AdvName: '公众号'
        }
        this.indicatorMap.forEach((value, key) => {
          fields[key + 'Text'] = value.text
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
    }
  }
}
</style>
