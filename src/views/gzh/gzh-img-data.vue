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
              <label>数据表：</label>
              <el-radio-group :disabled="isListLoading || isExcelExporting" v-model="queryForm.tableType">
                <el-radio-button v-for="item in tableTypeOptions" :key="item.id" :label="item.id">{{ item.name }}</el-radio-button>
              </el-radio-group>
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
          v-if="query.tableType === 1"
          :key="1"
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
            label-class-name="no-ascending-arrow"
            :sort-orders="['descending', null]"
            :sortable="field.sortable ? 'custom' : false"
            :min-width="field.minWidth || 'auto'">
          </el-table-column>
        </el-table>

        <el-table
          v-else
          :key="2"
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
            v-for="field in fields2"
            :key="field.name"
            :prop="field.name"
            :label="field.text"
            label-class-name="no-ascending-arrow"
            :sort-orders="['descending', null]"
            :sortable="field.sortable ? 'custom' : false"
            :min-width="field.minWidth || 'auto'">
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
  name: 'gzh-img-data',
  components: {
    TimeSelector,
    TreeTransfer
  },
  directives: {
    sticky: VueSticky
  },
  data () {
    const tableTypeOptions = [
      {
        id: 1,
        name: '单篇图文'
      }, {
        id: 2,
        name: '全部图文'
      }
    ]
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

    const fields = [
      {
        name: 'Date',
        text: '日期',
        minWidth: 90,
        sortable: true
      }, {
        name: 'WeChatName',
        text: '公众号名称',
        minWidth: 100
      }, {
        name: 'GroupName',
        text: '分组'
      }, {
        name: 'TypeName',
        text: '类型',
        minWidth: 100
      }, {
        name: 'Title',
        text: '标题',
        minWidth: 200
      }, {
        name: 'Sort',
        text: '序号',
        sortable: true
      }, {
        name: 'SendPeopleNum',
        text: '送达人数',
        minWidth: 100,
        sortable: true
      }, {
        name: 'ReadPeopleNum',
        text: '图文阅读人数',
        minWidth: 120,
        sortable: true
      }, {
        name: 'ReadPeopleRate',
        text: '图文阅读比例',
        minWidth: 120,
        sortable: true
      }, {
        name: 'DialogPeopleNum',
        text: '会话阅读人数',
        minWidth: 120,
        sortable: true
      }, {
        name: 'DialogPeopleRate',
        text: '会话阅读比例',
        minWidth: 120,
        sortable: true
      }, {
        name: 'HistoryReadNum',
        text: '历史消息阅读人数',
        minWidth: 150,
        sortable: true
      }, {
        name: 'HistoryReadRate',
        text: '历史消息阅读比例',
        minWidth: 150,
        sortable: true
      }, {
        name: 'FriendCircleReadNum',
        text: '朋友圈阅读人数',
        minWidth: 130,
        sortable: true
      }, {
        name: 'FriendCircleReadRate',
        text: '朋友圈阅读比例',
        minWidth: 130,
        sortable: true
      }, {
        name: 'FriendSendReadNum',
        text: '好友转发阅读人数',
        minWidth: 150,
        sortable: true
      }, {
        name: 'FriendSendReadRate',
        text: '好友转发阅读比例',
        minWidth: 150,
        sortable: true
      }, {
        name: 'OtherReadNum',
        text: '其他场景阅读人数',
        minWidth: 150,
        sortable: true
      }, {
        name: 'OtherReadRate',
        text: '其他场景阅读比例',
        minWidth: 150,
        sortable: true
      }, {
        name: 'SharePeopleNum',
        text: '分享人数',
        minWidth: 100,
        sortable: true
      }, {
        name: 'SharePeopleRate',
        text: '分享比例',
        minWidth: 100,
        sortable: true
      }, {
        name: 'CollectPeopleNum',
        text: '收藏人数',
        minWidth: 100,
        sortable: true
      }, {
        name: 'CollectPeopleRate',
        text: '收藏比例',
        minWidth: 100,
        sortable: true
      }
    ]
    const fields2 = [
      {
        name: 'Date',
        text: '日期',
        minWidth: 90
      }, {
        name: 'WeChatName',
        text: '公众号名称',
        minWidth: 100
      }, {
        name: 'GroupName',
        text: '分组'
      }, {
        name: 'TypeName',
        text: '类型',
        minWidth: 100
      }, {
        name: 'ReadPeopleNum',
        text: '图文总阅读人数'
      }, {
        name: 'ReadNum',
        text: '图文总阅读次数'
      }, {
        name: 'DialogPeopleNum',
        text: '会话阅读人数'
      }, {
        name: 'DialogNum',
        text: '会话次数'
      }, {
        name: 'FriendCircleReadPeopleNum',
        text: '朋友圈阅读人数'
      }, {
        name: 'FriendCircleReadNum',
        text: '朋友圈阅读次数'
      }, {
        name: 'SharePeopleNum',
        text: '分享转发人数'
      }, {
        name: 'ShareNum',
        text: '分享转发次数'
      }, {
        name: 'CollectPeopleNum',
        text: '收藏人数'
      }, {
        name: 'CollectNum',
        text: '收藏次数'
      }
    ]
    const fieldMap = new Map(fields.map(item => [item.name, item]))
    const fieldMap2 = new Map(fields2.map(item => [item.name, item]))

    const dateType = 1
    const dateRange = [yesterday, yesterday]
    const gzh = []
    const gzhType = null
    const group = null
    const tableType = 1

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
        // 数据表类别
        tableType: tableType
      },
      // 日期类别选项
      dateTypeOptions: dateTypeOptions,
      // 数据表
      tableTypeOptions: tableTypeOptions,
      // 数据字段
      fields: fields,
      fields2: fields2,
      fieldMap: fieldMap,
      fieldMap2: fieldMap2,

      // 表格数据加载状态
      isListLoading: false,
      // 导出状态
      isExcelExporting: false,
      // 保存之前的请求参数
      query: deepClone({ dateType, dateRange, gzh, gzhType, group, tableType }),
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
        tableType: 1
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

      const { dateRange, gzh, gzhType, group, tableType } = this.query

      const postData = {
        wid: gzh.length > 0 ? gzh.map(item => item.id).join(',') : null,
        type: gzhType,
        gid: group,
        start_time: dateRange[0],
        end_time: dateRange[1],
        sort: this.sortBy,
        offset: (this.tableCurrentPage - 1) * this.tablePageSize,
        limit: this.tablePageSize
      }

      Promise.all([
        this.$store.dispatch('getAllGzhOptions'),
        tableType === 1 ? GzhApi.getWXArticleDataStat(postData) : GzhApi.getWXTotalArticleData(postData)
      ]).then(([res1, { data }]) => {
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
      const { dateRange, gzh, gzhType, group, tableType } = this.queryForm
      const fileName = '图文数据_' + moment(dateRange[0]).format('YYYYMMDD') + '-' + moment(dateRange[1]).format('YYYYMMDD')

      const postData = {
        wid: gzh.length > 0 ? gzh.map(item => item.id).join(',') : null,
        type: gzhType,
        gid: group,
        start_time: dateRange[0],
        end_time: dateRange[1],
        down: 1
      }

      Promise.all([
        this.$store.dispatch('getAllGzhOptions'),
        tableType === 1 ? GzhApi.getWXArticleDataStat(postData) : GzhApi.getWXTotalArticleData(postData)
      ]).then(([res1, { data: listData }]) => {
        if (listData.Status !== 200) {
          swal({
            text: listData.Result.ErrorMsg,
            type: 'error',
            timer: 2000,
            showConfirmButton: false
          })
          this.isExcelExporting = false
          return
        }

        const rawListData = listData.Result.List instanceof Array ? listData.Result.List : []

        // 生成表格字段
        const fields = {}

        if (tableType === 1) {
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
}
</style>

<style lang="less">
.el-table {
  .no-ascending-arrow {
    .sort-caret {
      &.ascending {
        display: none !important;
      }
      &.descending {
        bottom: 11px !important;
      }
    }
  }
}
</style>
