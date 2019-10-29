<template>
  <div class="main">
    <div ref="queryContent" v-sticky="{zIndex: 2001, stickyTop: 0, disabled: false}">
      <div class="header-wrapper">
        <div class="filter-wrapper">
          <div class="filter-container">
            <div class="filter-item mr-3">
              <label>广告名称：</label>
              <el-input :disabled="isListLoading || isExcelExporting" v-model.trim="queryForm.name" class="filter-input"></el-input>
            </div>
            <div class="filter-item mr-3">
              <label>广告主：</label>
              <el-select :disabled="isListLoading || isExcelExporting" v-model="queryForm.customer" class="filter-input">
                <el-option label="全部" :value="null"></el-option>
                <el-option
                  v-for="item in customerList"
                  :key="item.CustomerId"
                  :label="item.RealName"
                  :value="item.CustomerId">
                </el-option>
              </el-select>
            </div>
            <div class="filter-item">
              <label>时间：</label>
              <el-date-picker
                :disabled="isListLoading || isExcelExporting"
                v-model="queryForm.dateRange"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                format="yyyy/MM/dd"
                value-format="yyyy-MM-dd"
                :editable="false"
                :clearable="false">
              </el-date-picker>
            </div>
          </div>
          <div class="tools">
            <div class="d-flex justify-content-between">
              <div class="filter-item mr-2">
                <el-button :loading="isListLoading" :disabled="isExcelExporting" @click="fetchData" type="primary" class="query-button" icon="el-icon-search">查询</el-button>
                <el-button :disabled="isListLoading || isExcelExporting" @click="resetQueryForm" class="query-button">重置</el-button>
              </div>
              <div class="filter-item flex-shrink-0">
                <el-button :loading="isExcelExporting" :disabled="isListLoading" @click="exportExcel" type="warning" class="query-button">导出Excel</el-button>
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
          :data="rawListData"
          v-loading="isListLoading"
          border
          fit
          highlight-current-row
          style="width: 100%;"
          :max-height="tableMaxHeight">
          <el-table-column
            v-for="field in fields"
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
import VueSticky from 'vue-sticky'
import moment from 'moment'
import * as AdApi from '@/api/ad'
import AccountApi from '@/api/Account'
import swal from 'sweetalert2'
import { deepClone } from '@/utils'
import exportExcel from '@/utils/exportExcel'

export default {
  name: 'daily-h5-adv',
  directives: {
    sticky: VueSticky
  },
  data () {
    const fields = [
      {
        name: 'DateStr',
        text: '日期'
      }, {
        name: 'AdvId',
        text: 'H5广告编号'
      }, {
        name: 'AdvName',
        text: '广告名称'
      }, {
        name: 'CustomerName',
        text: '广告主'
      }, {
        name: 'TotalClicks',
        text: '点击次数'
      }, {
        name: 'TotalPeople',
        text: '点击人数'
      }
    ]
    const fieldMap = new Map(fields.map(item => [item.name, item]))

    const yesterday = moment().subtract(1, 'days').format('YYYY-MM-DD')
    const dateRange = [moment(yesterday).subtract(6, 'days').format('YYYY-MM-DD'), yesterday]
    const name = null
    const customer = null

    return {
      queryForm: {
        dateRange: dateRange,
        name: name,
        customer: customer
      },
      // 广告主选项列表
      customerList: [],

      // 数据字段
      fields: fields,
      fieldMap: fieldMap,

      // 图表数据加载状态
      isListLoading: false,
      // 导出状态
      isExcelExporting: false,
      // 保存之前的请求参数
      query: deepClone({ dateRange, name, customer }),
      // 图表原始数据
      rawListData: [],

      // 表格当前页
      tableCurrentPage: 1,
      // 表格一页条数可选项
      tablePageSizeOption: [20, 30, 50, 100],
      // 表格一页条数
      tablePageSize: 30,
      // 总条数
      tableTotalSize: 0,
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
    }
  },
  created () {
    this.getAdUsers()
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
  methods: {
    // 重置查询
    resetQueryForm () {
      const yesterday = moment().subtract(1, 'days').format('YYYY-MM-DD')
      Object.assign(this.queryForm, {
        dateRange: [moment(yesterday).subtract(6, 'days').format('YYYY-MM-DD'), yesterday],
        name: null,
        customer: null
      })
    },
    getAdUsers () {
      AccountApi.getAdUsers().then(({ data }) => {
        if (data.Status === 200) {
          this.customerList = data.Result
        }
      })
    },
    fetchData () {
      // 克隆当前查询条件
      this.query = deepClone(this.queryForm)
      this.tableCurrentPage = 1
      this.tableTotalSize = 0
      this.sortBy = null
      this.order = null
      this.$refs.table && this.$refs.table.clearSort()
      this.fetchList()
    },
    fetchList () {
      this.isListLoading = true
      this.rawListData = []

      const { dateRange, name, customer } = this.query

      const postData = {
        start_date: dateRange[0],
        end_date: dateRange[1],
        Offset: (this.tableCurrentPage - 1) * this.tablePageSize,
        Limit: this.tablePageSize
      }
      customer && (postData.CustomerId = customer)
      name && (postData.Name = name)

      AdApi.getWeightAdvClickTotalList(postData).then(({ data }) => {
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
        this.rawListData = data.Result.List instanceof Array ? data.Result.List : []
        this.tableTotalSize = parseInt(data.Result.Total)
      }).catch(() => {
        this.isListLoading = false
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
      this.isExcelExporting = true
      const { dateRange, name, customer } = this.queryForm
      const fileName = '每日H5广告_' + moment(dateRange[0]).format('YYYYMMDD') + '-' + moment(dateRange[1]).format('YYYYMMDD')

      const postData = {
        start_date: dateRange[0],
        end_date: dateRange[1],
        Offset: 0,
        isAll: 1
      }
      customer && (postData.CustomerId = customer)
      name && (postData.Name = name)

      AdApi.getWeightAdvClickTotalList(postData).then(({ data }) => {
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
        const rawListData = data.Result.List instanceof Array ? data.Result.List : []

        const fields = {}

        this.fieldMap.forEach((value, key) => {
          fields[key] = value.text
        })

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
</style>
