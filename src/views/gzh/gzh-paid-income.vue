<template>
  <div class="main">
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
              <label>公众号：</label>
              <tree-transfer
                :disabled="isListLoading || isExcelExporting"
                v-model="queryForm.gzh"
                :source="gzhList"
                :show-shortcut="true">
              </tree-transfer>
            </div>
            <div class="filter-item">
              <label>广告主：</label>
              <tree-transfer
                :disabled="isListLoading || isExcelExporting"
                v-model="queryForm.advertiser"
                :source="advertiserList"
                :show-shortcut="true">
              </tree-transfer>
            </div>
          </div>
          <div class="filter-container">
            <div class="filter-item">
              <label>维度：</label>
              <el-checkbox-group :disabled="isListLoading || isExcelExporting" v-model="queryForm.dimension" class="d-inline-block">
                <el-checkbox v-for="item in dimensionOptions" :label="item.id" :key="item.id">{{item.name}}</el-checkbox>
              </el-checkbox-group>
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
          v-if="!(query.dimension.includes(2) || query.dimension.includes(3))"
          :key="1"
          ref="table"
          :data="rawListData"
          v-loading="isListLoading"
          :header-cell-class-name="tableHeaderCellClass"
          border
          fit
          highlight-current-row
          style="width: 100%;"
          :max-height="tableMaxHeight">
          <el-table-column
            v-if="query.dimension.includes(1)"
            prop="Date"
            label="日期"
            min-width="90">
          </el-table-column>
          <el-table-column
            v-for="field in fields"
            :key="field.name"
            :prop="field.name"
            :label="field.text">
          </el-table-column>
        </el-table>

        <el-table
          v-else
          :key="2"
          ref="table"
          :data="rawListData"
          v-loading="isListLoading"
          :header-cell-class-name="tableHeaderCellClass"
          border
          fit
          highlight-current-row
          style="width: 100%;"
          :max-height="tableMaxHeight">
          <el-table-column
            v-if="query.dimension.includes(1)"
            prop="Date"
            label="日期"
            min-width="90">
          </el-table-column>
          <el-table-column
            v-if="query.dimension.includes(2)"
            prop="CustomerName"
            label="广告主">
          </el-table-column>
          <el-table-column
            v-if="query.dimension.includes(3)"
            prop="WeChatName"
            label="公众号">
          </el-table-column>
          <el-table-column
            v-for="field in fields2"
            :key="field.name"
            :prop="field.name"
            :label="field.text">
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
import VueSticky from 'vue-sticky'
import moment from 'moment'
import * as GzhApi from '@/api/gzh'
import swal from 'sweetalert2'
import { deepClone } from '@/utils'
import exportExcel from '@/utils/exportExcel'

export default {
  name: 'gzh-paid-income',
  components: {
    TimeSelector,
    TreeTransfer
  },
  directives: {
    sticky: VueSticky
  },
  data () {
    const yesterday = moment().subtract(1, 'days').format('YYYY-MM-DD')
    const dateTypeOptions = [
      {
        id: 1,
        interval: 0,
        offset: -1,
        name: '昨天'
      }, {
        id: 2,
        interval: 6,
        offset: -1,
        name: '近7天'
      }, {
        id: 3,
        interval: 29,
        offset: -1,
        name: '近30天'
      }, {
        id: 4,
        interval: 89,
        offset: -1,
        name: '近90天'
      }
    ]
    const dimensionOptions = [
      {
        id: 1,
        key: 'Date',
        name: '日期'
      }, {
        id: 2,
        key: 'CustomerName',
        name: '广告主'
      }, {
        id: 3,
        key: 'WeChatName',
        name: '公众号'
      }
    ]

    const fields = [
      {
        name: 'FeesFansNum',
        text: '付费导粉数'
      }, {
        name: 'TotalFansNum',
        text: '共享秤总导粉数'
      }, {
        name: 'FeesFansRate',
        text: '付费导粉占比率'
      }, {
        name: 'FeesFansRelIncome',
        text: '付费导粉实际收益'
      }, {
        name: 'PaveScaleExpend',
        text: '铺秤支出'
      }, {
        name: 'ProfitGap',
        text: '利润差'
      }, {
        name: 'ProspectIncome',
        text: '预估导粉收益'
      }, {
        name: 'IncomeGap',
        text: '实际-预估收入差'
      }
    ]
    const fields2 = [
      {
        name: 'FeesFansNum',
        text: '付费导粉数'
      }, {
        name: 'FeesFansRelIncome',
        text: '实际收益'
      }
    ]
    const fieldMap = new Map(fields.map(item => [item.name, item]))
    const fieldMap2 = new Map(fields2.map(item => [item.name, item]))

    const dateType = 1
    const dateRange = [yesterday, yesterday]
    const gzh = []
    const advertiser = []
    const dimension = []

    return {
      queryForm: {
        // 时间类别
        dateType: dateType,
        // 日期范围，今天/昨天传两个日期相同的数组
        dateRange: dateRange,
        // 公众号
        gzh: gzh,
        // 广告主
        advertiser: advertiser,
        // 维度
        dimension: dimension
      },
      // 日期类别选项
      dateTypeOptions: dateTypeOptions,
      // 维度选项
      dimensionOptions: dimensionOptions,
      // 公众号数据
      gzhData: [],
      // 广告主数据
      advertiserData: [],
      // 数据字段
      fields: fields,
      fields2: fields2,
      fieldMap: fieldMap,
      fieldMap2: fieldMap2,

      // 图表数据加载状态
      isListLoading: false,
      // 导出状态
      isExcelExporting: false,
      // 保存之前的请求参数
      query: deepClone({ dateType, dateRange, gzh, advertiser, dimension }),
      // 表格原始数据
      rawListData: [],

      // 表格当前页
      tableCurrentPage: 1,
      // 表格一页条数可选项
      tablePageSizeOption: [10, 20, 30],
      // 表格一页条数
      tablePageSize: 20,
      // 总条数
      tableTotalSize: 0,
      // 除表格外内容区域高度
      othersHeight: 0
    }
  },
  computed: {
    tableMaxHeight () {
      return Math.max(this.$store.getters.containerHeight - this.othersHeight, 300)
    },
    // 公众号选项数据
    gzhList () {
      return this.gzhData.map(item => {
        return {
          id: item.Id,
          label: item.WeChatName,
          fullLabel: item.WeChatName,
          disabled: false,
          raw: item
        }
      })
    },
    // 广告主选项数据
    advertiserList () {
      return this.advertiserData.map(item => {
        return {
          id: item.CustomerId,
          label: item.RealName,
          fullLabel: item.RealName,
          disabled: false,
          raw: item
        }
      })
    }
  },
  created () {
    this.getAllAdvs()
    this.getAllCustomer()
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
      Object.assign(this.queryForm, {
        dateType: 1,
        gzh: [],
        advertiser: [],
        dimension: []
      })
    },
    // 查询公众号数据
    getAllAdvs () {
      GzhApi.getAllAdvs().then(({ data }) => {
        if (data.Status === 200) {
          this.gzhData = data.Result
        }
      })
    },
    // 查询广告主数据
    getAllCustomer () {
      GzhApi.getAllCustomer().then(({ data }) => {
        if (data.Status === 200) {
          this.advertiserData = data.Result
        }
      })
    },
    fetchData () {
      // 克隆当前查询条件
      this.query = deepClone(this.queryForm)
      this.tableCurrentPage = 1
      this.tableTotalSize = 0
      this.fetchList()
    },
    fetchList () {
      this.isListLoading = true
      this.rawListData = []

      const { dateRange, gzh, advertiser, dimension } = this.query

      let method = 'getStatFeesFansIncomeTotalList'
      if (!(dimension.includes(2) || dimension.includes(3))) {
        method = 'getStatFeesFansIncomeTotalList'
      } else {
        method = 'getStatFeesFansIncomeList'
      }

      const postData = {
        aid: gzh.length > 0 ? gzh.map(item => item.id).join(',') : null,
        cid: advertiser.length > 0 ? advertiser.map(item => item.id).join(',') : null,
        vid: dimension.length > 0 ? dimension.join(',') : null,
        start_time: dateRange[0],
        end_time: dateRange[1],
        offset: (this.tableCurrentPage - 1) * this.tablePageSize,
        limit: this.tablePageSize
      }

      GzhApi[method](postData).then(({ data }) => {
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
        this.tableTotalSize = data.Result.Total
      }).catch(() => {
        this.isListLoading = false
      })
    },
    tableHeaderCellClass ({ row, column, rowIndex, columnIndex }) {
      if (!(this.query.dimension.includes(2) || this.query.dimension.includes(3))) {
        return 'gzh-paid-income-table bg-purple'
      } else {
        return 'gzh-paid-income-table bg-green'
      }
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
      const { dateRange, gzh, advertiser, dimension } = this.queryForm
      const fileName = '付费导粉收益_' + moment(dateRange[0]).format('YYYYMMDD') + '-' + moment(dateRange[1]).format('YYYYMMDD')

      let method = 'getStatFeesFansIncomeTotalList'
      if (!(dimension.includes(2) || dimension.includes(3))) {
        method = 'getStatFeesFansIncomeTotalList'
      } else {
        method = 'getStatFeesFansIncomeList'
      }

      const postData = {
        aid: gzh.length > 0 ? gzh.map(item => item.id).join(',') : null,
        cid: advertiser.length > 0 ? advertiser.map(item => item.id).join(',') : null,
        vid: dimension.length > 0 ? dimension.join(',') : null,
        start_time: dateRange[0],
        end_time: dateRange[1],
        down: 1
      }

      GzhApi[method](postData).then(({ data }) => {
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
        const fields = {}

        this.dimensionOptions.forEach(item => {
          if (dimension.includes(item.id)) {
            fields[item.key] = item.name
          }
        })
        if (!(dimension.includes(2) || dimension.includes(3))) {
          this.fieldMap.forEach((value, key) => {
            fields[key] = value.text
          })
        } else {
          this.fieldMap2.forEach((value, key) => {
            fields[key] = value.text
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
  .inline-form-item {
    display: inline-block;
    margin: 0;
    vertical-align: middle;
  }
}
</style>

<style lang="less">
.gzh-paid-income-table {
  &.bg-green {
    background-color: #65CBCB !important;
    color: #333333;
  }
  &.bg-purple {
    background-color: #9EB8DD !important;
    color: #333333;
  }
}
</style>
