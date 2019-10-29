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
            <div class="filter-item mr-3">
              <label>公众号分组：</label>
              <el-select :disabled="isListLoading || isExcelExporting" v-model="queryForm.group" class="filter-input">
                <el-option label="全部" :value="null"></el-option>
                <el-option
                  v-for="item in wxGroup"
                  :key="item.GroupId"
                  :label="item.GroupName"
                  :value="item.GroupId">
                </el-option>
              </el-select>
            </div>
            <div class="filter-item">
              <label>公众号类型：</label>
              <el-select :disabled="isListLoading || isExcelExporting" v-model="queryForm.gzhType" class="filter-input">
                <el-option label="全部" :value="null"></el-option>
                <el-option
                  v-for="(value, key) in wxAccountTypes"
                  :key="key"
                  :label="value"
                  :value="key">
                </el-option>
              </el-select>
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
            v-if="query.dimension.length > 0"
            label="维度"
            align="center">
            <el-table-column
              v-if="query.dimension.includes(1)"
              prop="Date"
              label="日期"
              align="center"
              min-width="90">
            </el-table-column>
            <el-table-column
              v-if="query.dimension.includes(2)"
              prop="GroupName"
              label="分组"
              align="center"
              min-width="80">
            </el-table-column>
            <el-table-column
              v-if="query.dimension.includes(3)"
              prop="WeChatName"
              label="公众号"
              align="center"
              min-width="100">
            </el-table-column>
          </el-table-column>
          <el-table-column
            label="总计"
            align="center">
            <el-table-column
              prop="TotalMoney"
              label="总收益"
              align="center">
            </el-table-column>
          </el-table-column>
          <el-table-column
            v-if="incomeItemList.length > 0"
            label="公众号各收益项目统计"
            align="center">
            <el-table-column
              v-for="incomeItem in incomeItemList"
              :key="incomeItem.Id"
              :prop="incomeItem.Id"
              :label="incomeItem.Name"
              align="center">
              <template slot-scope="scope">
                <span>{{ scope.row['Data' + incomeItem.Id] }}</span>
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
import VueSticky from 'vue-sticky'
import moment from 'moment'
import * as GzhApi from '@/api/gzh'
import swal from 'sweetalert2'
import { deepClone } from '@/utils'
import { mapGetters } from 'vuex'
import exportExcel from '@/utils/exportExcel'

export default {
  name: 'gzh-channel-income',
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
        key: 'GroupName',
        name: '分组'
      }, {
        id: 3,
        key: 'WeChatName',
        name: '公众号'
      }
    ]

    const dateType = 1
    const dateRange = [yesterday, yesterday]
    const gzh = []
    const gzhType = null
    const group = null
    const dimension = []

    return {
      queryForm: {
        // 时间类别
        dateType: dateType,
        // 日期范围，今天/昨天传两个日期相同的数组
        dateRange: dateRange,
        // 公众号
        gzh: gzh,
        // 公众号类型
        gzhType: gzhType,
        // 分组
        group: group,
        // 维度
        dimension: dimension
      },
      // 日期类别选项
      dateTypeOptions: dateTypeOptions,
      // 维度选项
      dimensionOptions: dimensionOptions,

      // 图表数据加载状态
      isListLoading: false,
      // 导出状态
      isExcelExporting: false,
      // 保存之前的请求参数
      query: deepClone({ dateType, dateRange, gzh, gzhType, group, dimension }),
      // 表格原始数据
      rawListData: [],
      // 收益项目数据
      incomeItemList: [],

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
    ...mapGetters([
      'wxGroup',
      'wxAccountTypes',
      'gzhData'
    ]),
    // 公众号选项数据
    gzhList () {
      return this.gzhData.map(item => {
        return {
          id: item.Id,
          label: item.Name,
          fullLabel: item.Name,
          disabled: false,
          raw: item
        }
      })
    }
  },
  created () {
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
        gzhType: null,
        group: null,
        dimension: []
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

      const { dateRange, gzh, gzhType, group, dimension } = this.query

      const postData = {
        wid: gzh.length > 0 ? gzh.map(item => item.id).join(',') : null,
        gid: group,
        type: gzhType,
        vid: dimension.length > 0 ? dimension.join(',') : null,
        start_time: dateRange[0],
        end_time: dateRange[1],
        offset: (this.tableCurrentPage - 1) * this.tablePageSize,
        limit: this.tablePageSize
      }

      Promise.all([
        this.$store.dispatch('getAllGzhOptions'),
        GzhApi.getAllWXIncomeProjectList(),
        GzhApi.getWXIncomeStatList(postData)
      ]).then(([res1, { data: incomeItemData }, { data }]) => {
        this.isListLoading = false
        if (incomeItemData.Status !== 200) {
          swal({
            text: incomeItemData.Result.ErrorMsg,
            type: 'error',
            timer: 2000,
            showConfirmButton: false
          })
          return
        }
        this.incomeItemList = incomeItemData.Result
        if (data.Status !== 200) {
          swal({
            text: data.Result.ErrorMsg,
            type: 'error',
            timer: 2000,
            showConfirmButton: false
          })
          return
        }
        const rawListData = data.Result.List instanceof Array ? data.Result.List : []

        rawListData.forEach(item => {
          const itemData = item.Data.reduce((acc, cur) => {
            acc['Data' + cur.ProjectId] = cur.Money
            return acc
          }, {})
          Object.assign(item, itemData)
        })
        this.rawListData = rawListData
        this.tableTotalSize = data.Result.Total
      }).catch(error => {
        swal({
          text: error.message,
          type: 'error',
          timer: 2000,
          showConfirmButton: false
        })
        this.isListLoading = false
      })
    },
    tableHeaderCellClass ({ row, column, rowIndex, columnIndex }) {
      const offset = this.query.dimension.length > 0 ? 1 : 0
      if (rowIndex === 0) {
        if (columnIndex === 0 + offset) {
          return 'gzh-channel-income-table bg-purple'
        } else if (columnIndex === 1 + offset) {
          return 'gzh-channel-income-table bg-yellow'
        }
      }
      return ''
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
      const { dateRange, gzh, gzhType, group, dimension } = this.queryForm
      const fileName = '渠道收益分析_' + moment(dateRange[0]).format('YYYYMMDD') + '-' + moment(dateRange[1]).format('YYYYMMDD')

      const postData = {
        wid: gzh.length > 0 ? gzh.map(item => item.id).join(',') : null,
        gid: group,
        type: gzhType,
        vid: dimension.length > 0 ? dimension.join(',') : null,
        start_time: dateRange[0],
        end_time: dateRange[1],
        down: 1
      }

      Promise.all([
        this.$store.dispatch('getAllGzhOptions'),
        GzhApi.getAllWXIncomeProjectList(),
        GzhApi.getWXIncomeStatList(postData)
      ]).then(([res1, { data: incomeItemData }, { data }]) => {
        if (incomeItemData.Status !== 200) {
          swal({
            text: incomeItemData.Result.ErrorMsg,
            type: 'error',
            timer: 2000,
            showConfirmButton: false
          })
          this.isExcelExporting = false
          return
        }
        const incomeItemList = incomeItemData.Result
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

        rawListData.forEach(item => {
          const itemData = item.Data.reduce((acc, cur) => {
            acc['Data' + cur.ProjectId] = cur.Money
            return acc
          }, {})
          Object.assign(item, itemData)
        })

        const fields = {}

        this.dimensionOptions.forEach(item => {
          if (dimension.includes(item.id)) {
            fields[item.key] = item.name
          }
        })

        fields.TotalMoney = '总收益'

        incomeItemList.forEach(incomeItem => {
          fields['Data' + incomeItem.Id] = incomeItem.Name
        })

        exportExcel([{ sheetName: fileName, data: rawListData }], fields, fileName)
        this.isExcelExporting = false
      }).catch(error => {
        swal({
          text: error.message,
          type: 'error',
          timer: 2000,
          showConfirmButton: false
        })
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
.gzh-channel-income-table {
  &.bg-green {
    background-color: #b9dfae !important;
    color: #333333;
  }
  &.bg-purple {
    background-color: #9eb8de !important;
    color: #333333;
  }
  &.bg-yellow {
    background-color: #ffff33 !important;
    color: #333333;
  }
}
</style>
