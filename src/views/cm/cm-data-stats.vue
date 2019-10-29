<template>
  <div class="cm-data-stats main">
    <div ref="queryContent" v-sticky="{zIndex: 2001, stickyTop: 0, disabled: false}">
      <div class="header-wrapper">
        <div class="filter-wrapper">
          <time-selector
            :disabled="isListLoading || isExcelExporting"
            :date-type-options="dateTypeOptions"
            :date-type.sync="queryForm.dateType"
            :date-range.sync="queryForm.dateRange"
            :show-compare="false"
            :show-granularity="false">
          </time-selector>
          <div class="filter-container">
            <div class="filter-item mr-3">
              <label>城市经理：</label>
              <tree-transfer
                :disabled="isListLoading || isExcelExporting"
                v-model="queryForm.agent"
                :source="agentList"
                :show-shortcut="true">
              </tree-transfer>
            </div>
            <div class="filter-item mr-3">
              <label>商务BD：</label>
              <tree-transfer
                :disabled="isListLoading || isExcelExporting || isFilterDisabled"
                v-model="queryForm.employee"
                :source="employeeList"
                :show-shortcut="true">
              </tree-transfer>
            </div>
            <div class="filter-item">
              <label>设备ID：</label>
              <el-input :disabled="isListLoading || isExcelExporting" v-model.trim="queryForm.scaleNo" class="filter-input" style="width: 300px;" placeholder="输入设备ID，用英文逗号分隔"></el-input>
            </div>
          </div>
          <div class="filter-container">
            <div class="filter-item">
              <label>维度：</label>
              <el-checkbox-group :disabled="isListLoading || isExcelExporting" @change="handleDimensionChange" v-model="queryForm.dimension" class="d-inline-block">
                <el-checkbox v-for="item in dimensionOptions" :label="item.id" :key="item.id">{{item.name}}</el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
          <div class="tools">
            <div class="d-flex justify-content-between">
              <div class="filter-item mr-2">
                <el-button :loading="isListLoading" :disabled="isExcelExporting || isFilterDisabled" @click="fetchData" type="primary" class="query-button" icon="el-icon-search">查询</el-button>
                <el-button :disabled="isListLoading || isExcelExporting || isFilterDisabled" @click="resetQueryForm" class="query-button">重置</el-button>
              </div>
              <div class="filter-item flex-shrink-0">
                <el-button :loading="isExcelExporting" :disabled="isListLoading || isFilterDisabled" @click="exportExcel" type="warning" class="query-button">导出Excel</el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="content-wrapper">
      <div class="main-content">
        <el-table
          @sort-change="handleTableSortChange"
          ref="table"
          :data="tableData"
          v-loading="isListLoading"
          border
          fit
          highlight-current-row
          style="width: 100%;"
          :max-height="tableMaxHeight">
          <el-table-column
            v-for="dimension in dimensionOptions"
            v-if="tableData.length > 0 && tableData[0].hasOwnProperty(dimension.prop)"
            :key="dimension.prop"
            :prop="dimension.prop"
            :label="dimension.text"
            align="center"
            :sortable="dimension.sortable ? 'custom' : false"
            :min-width="dimension.minWidth || 'auto'">
            <template slot-scope="scope">
              <a v-if="dimension.prop === 'ScaleNo'" @click.stop="showEquipmentInfo(scope.row.ScaleNo)" class="highlight" href="javascript:;">{{ scope.row.ScaleNo }}</a>
              <span v-else>{{ scope.row[dimension.prop] }}</span>
            </template>
          </el-table-column>
          <el-table-column
            v-for="field in fields"
            v-if="tableData.length > 0 && tableData[0].hasOwnProperty(field.name)"
            :key="field.name"
            :prop="field.name"
            :label="field.text"
            :sortable="field.sortable ? 'custom' : false"
            :min-width="field.minWidth || 'auto'"
            align="center">
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

    <el-dialog
      title="设备基本信息"
      :visible.sync="equipmentInfoDialogVisible"
      custom-class="equipment-info-dialog">
      <iframe v-if="equipmentInfoDialogVisible" :src="host + '/data/modules/scale/scale.php?do=SearchInfo&scaleId=' + scaleId" class="border-0 w-100 h-100"></iframe>
    </el-dialog>

  </div>
</template>

<script>
import TimeSelector from '@/components/report/time-selector'
import TreeTransfer from '@/components/report/tree-transfer'
import VueSticky from 'vue-sticky'
import moment from 'moment'
import * as CMApi from '@/api/cm'
import swal from 'sweetalert2'
import { deepClone } from '@/utils'
import exportExcel from '@/utils/exportExcel'

export default {
  name: 'cm-data-stats',
  components: {
    TimeSelector,
    TreeTransfer
  },
  directives: {
    sticky: VueSticky
  },
  data () {
    const dateTypeOptions = [
      {
        id: 1,
        name: '本月',
        dateRange: () => {
          const date = moment()
          const endDate = date.subtract(date.date() === 1 ? 0 : 1, 'days').format('YYYY-MM-DD')
          const startDate = date.date(1).format('YYYY-MM-DD')
          return [startDate, endDate]
        }
      }, {
        id: 2,
        name: '上月',
        dateRange: () => {
          const date = moment()
          const endDate = date.subtract(1, 'months').date(date.daysInMonth()).format('YYYY-MM-DD')
          const startDate = date.date(1).format('YYYY-MM-DD')
          return [startDate, endDate]
        }
      }, {
        id: 3,
        name: '近3月',
        dateRange: () => {
          const date = moment()
          const endDate = date.subtract(date.date() === 1 ? 0 : 1, 'days').format('YYYY-MM-DD')
          const startDate = date.subtract(2, 'months').date(1).format('YYYY-MM-DD')
          return [startDate, endDate]
        }
      }
    ]
    const dimensionOptions = [
      {
        id: 1,
        key: 'Month',
        name: '按月',
        prop: 'Month',
        text: '月份',
        minWidth: 90,
        sortable: true
      }, {
        id: 2,
        key: 'Day',
        name: '按日',
        prop: 'Day',
        text: '日期',
        minWidth: 90,
        sortable: true
      }, {
        id: 3,
        key: 'AgentId',
        name: '城市经理',
        prop: 'AgentName',
        text: '城市经理',
        minWidth: 130,
        sortable: true
      }, {
        id: 4,
        key: 'EmployeeId',
        name: '商务BD',
        prop: 'EmployeeName',
        text: '商务BD',
        minWidth: 130,
        sortable: true
      }, {
        id: 5,
        key: 'ScaleNo',
        name: '设备',
        prop: 'ScaleNo',
        text: '设备ID',
        minWidth: 130,
        sortable: false
      }
    ]

    const fields = [
      {
        name: 'ScaleCount',
        text: '累计投放设备',
        minWidth: 120,
        sortable: true
      }, {
        name: 'NewScaleCount',
        text: '新增设备投放数',
        minWidth: 140,
        sortable: true
      }, {
        name: 'ActiveTime',
        text: '上线运营时间',
        minWidth: 140,
        sortable: true
      }, {
        name: 'FollowCountSum',
        text: '导粉数',
        minWidth: 90,
        sortable: true
      }, {
        name: 'OnLineListRate',
        text: '在线率',
        minWidth: 90,
        sortable: true
      }, {
        name: 'AvgFollowCountSum',
        text: '设备日均导粉数',
        minWidth: 140,
        sortable: true
      }, {
        name: 'OffLineCountSum',
        text: '不在线天数',
        minWidth: 110,
        sortable: true
      }, {
        name: 'MonthOffLineCountSum',
        text: '不在线超过5天设备数',
        minWidth: 170,
        sortable: true
      }, {
        name: 'OnlineStateName',
        text: '是否在线',
        minWidth: 100,
        sortable: true
      }
    ]
    const fieldMap = new Map(fields.map(item => [item.name, item]))

    const dateType = 1
    const dateRange = dateTypeOptions[0].dateRange()
    const agent = []
    const employee = []
    const scaleNo = null
    const dimension = []

    return {
      queryForm: {
        // 时间类别
        dateType: dateType,
        // 日期范围，今天/昨天传两个日期相同的数组
        dateRange: dateRange,
        // 城市经理
        agent: agent,
        // 商务BD
        employee: employee,
        // 设备ID
        scaleNo: scaleNo,
        // 维度
        dimension: dimension,
        // 上次选择的维度
        oldDimension: dimension
      },
      agentRawData: [],
      employeeRawData: [],
      isFilterDisabled: false,

      // 设备信息对话框显示
      equipmentInfoDialogVisible: false,
      // 当前查看设备信息的设备ID
      scaleId: 0,

      // 日期类别选项
      dateTypeOptions: dateTypeOptions,
      // 维度选项
      dimensionOptions: dimensionOptions,
      // 数据字段
      fields: fields,
      fieldMap: fieldMap,

      // 图表数据加载状态
      isListLoading: false,
      // 导出状态
      isExcelExporting: false,
      // 保存之前的请求参数
      query: deepClone({ dateType, dateRange, agent, employee, scaleNo, dimension }),
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
    host () {
      if (process.env.NODE_ENV === 'development') {
        return `${this.$config.HOST}`
      } else {
        return `//${location.host}`
      }
    },
    tableMaxHeight () {
      return Math.max(this.$store.getters.containerHeight - this.othersHeight, 300)
    },
    // 城市经理选项数据
    agentList () {
      const agent = new Map()
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
    // 商务BD选项数据
    employeeList () {
      const employee = new Map()
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
    tableTotalSize () {
      return this.rawListData.length
    },
    tableData () {
      if (this.rawListData.length === 0) return []
      let sortBy = this.sortBy
      const order = this.order

      if (sortBy === 'AgentName') {
        sortBy = 'AgentId'
      } else if (sortBy === 'EmployeeName') {
        sortBy = 'EmployeeId'
      }

      let rawListData = [...this.rawListData]
      if (sortBy) {
        rawListData.sort((a, b) => {
          if (sortBy === 'Day' || sortBy === 'Month') {
            const dateRegExp = /((\d{4}[-/])?\d{2}[-/]\d{2})?\D*(\d{2}:\d{2}(:\d{2})?)?/g
            const resultA = dateRegExp.exec(a[sortBy])
            dateRegExp.lastIndex = 0
            const resultB = dateRegExp.exec(b[sortBy])
            if (resultA[0] && resultB[0]) {
              return moment(resultA[0], ['YYYY-MM-DD HH:mm:ss', 'YYYY-MM-DD', 'YYYY-MM', 'YYYY_MM', 'MM-DD', 'HH:mm:ss']).diff(moment(resultB[0], ['YYYY-MM-DD HH:mm:ss', 'YYYY-MM-DD', 'YYYY-MM', 'YYYY_MM', 'MM-DD', 'HH:mm:ss'])) * (order === 'ascending' ? 1 : -1)
            } else {
              return 0
            }
          } else if (sortBy === 'OnlineStateName') {
            const sortArr = ['在线', '不在线']
            const indexA = sortArr.indexOf(a[sortBy])
            const indexB = sortArr.indexOf(b[sortBy])
            return (indexA - indexB) * (order === 'ascending' ? 1 : -1)
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
      }

      const startIndex = (this.tableCurrentPage - 1) * this.tablePageSize
      const length = Math.min(this.tableCurrentPage * this.tablePageSize, this.tableTotalSize)
      return rawListData.slice(startIndex, length)
    }
  },
  watch: {
    'queryForm.agent': {
      handler: function (val, oldVal) {
        this.getBusinessList()
      },
      deep: false
    },
    employeeList: {
      handler: function (val, oldVal) {
        const employee = []
        this.queryForm.employee.forEach(item => {
          if (val.findIndex(i => i.id === item.id && !i.disabled) > -1) {
            employee.push(item)
          }
        })
        this.$set(this.queryForm, 'employee', employee)
      },
      deep: false
    }
  },
  created () {
    this.getCityManagerList()
    this.getBusinessList()
    this.fetchData()
  },
  mounted () {
  },
  updated () {
    this.$nextTick(() => {
      const queryContent = this.$refs.queryContent
      const queryContentHeight = queryContent ? Math.round(queryContent.clientHeight) : 0
      this.othersHeight = queryContentHeight + 41 + 64
    })
  },
  deactivated () {
    this.equipmentInfoDialogVisible = false
  },
  methods: {
    showEquipmentInfo (scaleId) {
      this.scaleId = scaleId
      this.equipmentInfoDialogVisible = true
    },
    handleDimensionChange (val) {
      const oldDimension = this.queryForm.oldDimension
      // 按月和按日不能同时选择
      if (val.includes(1) && oldDimension.includes(2)) {
        const index = val.findIndex(item => item === 2)
        val.splice(index, 1)
      } else if (val.includes(2) && oldDimension.includes(1)) {
        const index = val.findIndex(item => item === 1)
        val.splice(index, 1)
      }
      this.queryForm.oldDimension = val
    },
    // 重置查询
    resetQueryForm () {
      Object.assign(this.queryForm, {
        dateType: 1,
        agent: [],
        employee: [],
        scaleNo: null,
        dimension: []
      })
    },
    getCityManagerList () {
      CMApi.getCityManagerList().then(({ data }) => {
        if (data.Status === 200) {
          this.agentRawData = data.Result instanceof Array ? data.Result : []
        }
      })
    },
    getBusinessList () {
      this.isFilterDisabled = true
      const postData = {}
      const agentId = this.queryForm.agent.map(item => item.id).join(',')
      agentId && (postData.AgentId = agentId)

      CMApi.getBusinessList(postData).then(({ data }) => {
        this.isFilterDisabled = false
        if (data.Status === 200) {
          this.employeeRawData = data.Result instanceof Array ? data.Result : []
        }
      }).catch(() => {
        this.isFilterDisabled = false
      })
    },
    fetchData () {
      // 克隆当前查询条件
      this.query = deepClone(this.queryForm)
      this.tableCurrentPage = 1
      this.sortBy = null
      this.order = null
      this.$refs.table && this.$refs.table.clearSort()
      this.fetchList()
    },
    fetchList () {
      this.isListLoading = true
      this.rawListData = []

      const { dateRange, agent, employee, scaleNo, dimension } = this.query

      const agentId = agent.map(item => item.id).join(',')
      const employeeId = employee.map(item => item.id).join(',')

      const postData = {
        StartDate: dateRange[0],
        EndDate: dateRange[1]
      }
      dimension.length > 0 && (postData.Group = this.dimensionOptions.filter(item => dimension.includes(item.id)).map(item => item.key).join(','))
      agentId && (postData.AgentId = agentId)
      employeeId && (postData.EmployeeId = employeeId)
      scaleNo && (postData.ScaleNo = scaleNo)

      CMApi.getCityManagerStat(postData).then(({ data }) => {
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
      const { dateRange, agent, employee, scaleNo, dimension } = this.queryForm
      const fileName = '数据指标统计_' + moment(dateRange[0]).format('YYYYMMDD') + '-' + moment(dateRange[1]).format('YYYYMMDD')

      const agentId = agent.map(item => item.id).join(',')
      const employeeId = employee.map(item => item.id).join(',')

      const postData = {
        StartDate: dateRange[0],
        EndDate: dateRange[1]
      }
      dimension.length > 0 && (postData.Group = this.dimensionOptions.filter(item => dimension.includes(item.id)).map(item => item.key).join(','))
      agentId && (postData.AgentId = agentId)
      employeeId && (postData.EmployeeId = employeeId)
      scaleNo && (postData.ScaleNo = scaleNo)

      CMApi.getCityManagerStat(postData).then(({ data }) => {
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
        const rawListData = data.Result instanceof Array ? data.Result : []

        const fields = {}

        if (rawListData.length > 0) {
          this.dimensionOptions.forEach(item => {
            if (dimension.includes(item.id) && rawListData[0].hasOwnProperty(item.prop)) {
              fields[item.prop] = item.text
            }
          })
          this.fieldMap.forEach((value, key) => {
            if (rawListData[0].hasOwnProperty(key)) {
              fields[key] = value.text
            }
          })
        }

        exportExcel([{ sheetName: fileName, data: rawListData }], fields, fileName)
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
  .filter-input {
    width: 200px;
  }
  .query-button {
    width: 100px;
  }
  .tool-button {
    width: 100px;
  }
  .oper-button {
    width: 80px;
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
      .button-wrapper {
        padding: 20px 20px;
      }
    }
  }
}
.highlight {
  color: #409EFF;
  cursor: pointer;
}
</style>

<style lang="less">
.cm-data-stats {
  .equipment-info-dialog {
    width: 800px;
    height: 750px;
    .el-dialog__body {
      height: 696px;
      padding: 0;
    }
  }
}
</style>
