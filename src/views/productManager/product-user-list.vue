<template>
  <div class="main">
      <div ref="queryContent" v-sticky="{zIndex: 2001, stickyTop: 0, disabled: false}">
        <div class="header-wrapper">
          <el-form :disabled="isListLoading" :model="queryForm" ref="queryForm" :inline="true" label-width="0" :show-message="false">
            <div class="d-flex justify-content-between">
              <div class="filter-wrapper mr-2">
                <div class="filter-container">
                  <div class="filter-item mr-3">
                    <label>用户ID：</label>
                    <el-form-item prop="gzhName" class="inline-form-item">
                      <el-input v-model.trim="queryForm.uid" class="filter-input" clearable></el-input>
                    </el-form-item>
                  </div>
                  <div class="filter-item mr-3">
                    <label>用户昵称：</label>
                    <el-form-item prop="gzhName" class="inline-form-item">
                      <el-input v-model.trim="queryForm.nickname" class="filter-input" clearable></el-input>
                    </el-form-item>
                  </div>
                  <div class="filter-item mr-3">
                    <label>推手ID：</label>
                    <el-form-item prop="gzhName" class="inline-form-item">
                      <el-input v-model.trim="queryForm.recid" class="filter-input" clearable></el-input>
                    </el-form-item>
                  </div>
                  <div class="filter-item mr-3">
                    <label>推手手机号：</label>
                    <el-form-item prop="gzhName" class="inline-form-item">
                      <el-input v-model.trim="queryForm.mobile" class="filter-input" clearable></el-input>
                    </el-form-item>
                  </div>
                  <div class="filter-item mr-3">
                    <label>推手名称：</label>
                    <el-form-item prop="gzhName" class="inline-form-item">
                      <el-input v-model.trim="queryForm.recnick" class="filter-input" clearable></el-input>
                    </el-form-item>
                  </div>
                  <div class="filter-item ml-3">
                    <label>日期：</label>
                    <el-date-picker
                        v-model="queryForm.timeRange"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        align="right"
                        unlink-panels
                        :picker-options="pickerOptions"
                        :clearable="false">
                    </el-date-picker>
                  </div>
                </div>
              </div>
              <div class="tools flex-shrink-0">
                <div class="filter-item">
                  <el-button :loading="isListLoading" @click="fetchData" type="primary" class="query-button" icon="el-icon-search">查询</el-button>
                  <el-button :disabled="isListLoading" @click="resetQueryForm" class="query-button">重置</el-button>
                  <el-button :disabled="isExporting || isListLoading" @click="exportData" type="warning" class="query-button">导出</el-button>
                </div>
              </div>
            </div>
          </el-form>
        </div>
      </div>
      <div class="content-wrapper">
        <div class="main-content">
          <el-table
            ref="table"
            :data="rawListData"
            v-loading="isListLoading"
            border
            fit
            highlight-current-row
            style="width: 100%;">
            <el-table-column
              prop="jfid"
              label="用户ID">
            </el-table-column>
            <el-table-column
              prop="nickname"
              label="昵称">
            </el-table-column>
            <el-table-column
              prop="avatar"
              label="头像">
              <template slot-scope="scope">
                <div style="display: flex; flex-direction: column;align-items: center;justify-content: center">
                  <img v-if='scope.row.avatar' style="width: 100px; height: 100px" :src="scope.row.avatar"/>
                </div>
              </template>
            </el-table-column>
            <el-table-column
                prop="avatar"
                label="推手信息">
              <template slot-scope="scope">
                <div style="display: flex; flex-direction: column;align-items: center;justify-content: center" v-if="scope.row.RecomUser">
                  <span>ID:{{scope.row.RecomUser.Id}}</span>
                  <span>手机号:{{scope.row.RecomUser.Mobile}}</span>
                  <span>昵称:{{scope.row.RecomUser.UserName}}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="paycount"
              label="付费次数">
            </el-table-column>
            <el-table-column
                prop="allpay"
                label="付费金额">
            </el-table-column>
            <el-table-column
                prop="createtime"
                label="创建时间">
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
import ProductApi from '@/api/productApi'
import swal from 'sweetalert2'
import exportExcel from '@/utils/exportExcel'
import moment from 'moment'

import { deepClone } from '@/utils'
//  产品端用户列表
export default {
  name: 'product-user-list',
  directives: {
    sticky: VueSticky
  },
  data () {
    const statusOptions = [
      {
        id: '0',
        name: '未注册'
      }, {
        id: '1',
        name: '已注册'
      }
    ]
    const typeOptions = [
      {
        id: '1',
        name: '黄金推手'
      }, {
        id: '2',
        name: '铂金推手'
      }, {
        id: '3',
        name: '钻石推手'
      }
    ]
    return {
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 6)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      queryForm: {
        uid: '',
        nickname: '',
        recid: '',
        mobile: '',
        recnick: '',
        timeRange: []
      },
      // 状态选项
      statusOptions: statusOptions,
      typeOptions: typeOptions,
      statusMap: new Map(statusOptions.map(item => [item.id, item.name])),
      // 图表数据加载状态
      isListLoading: false,
      // 导出状态
      isExporting: false,
      // 图表原始数据
      rawListData: [],
      // 表格当前页
      tableCurrentPage: 1,
      // 表格一页条数可选项
      tablePageSizeOption: [10, 20, 30],
      // 表格一页条数
      tablePageSize: 20,
      // 总条数
      tableTotalSize: 0
    }
  },
  filters: {

  },
  computed: {
    cachedViews () {
      return this.$store.state.tagsView.cachedViews
    },
    typeMap () {
      return new Map(this.typeOptions.map(item => [item.id, item.name]))
    }
  },
  created () {
    this.fetchData()
  },
  activated () {
    if (this.$route.query.refresh === 1) {
      this.fetchList()
    }
  },
  methods: {
    // 重置查询
    resetQueryForm () {
      this.queryForm = {
        uid: '',
        nickname: '',
        recid: '',
        mobile: '',
        recnick: '',
        timeRange: []
      }
    },
    exportData () {
      this.isExporting = true
      const postData = {
        uid: this.queryForm.uid,
        nickname: this.queryForm.nickname,
        recid: this.queryForm.recid,
        mobile: this.queryForm.mobile,
        recnick: this.queryForm.recnick,
        begin: this.queryForm.timeRange.length > 0 ? moment(this.queryForm.timeRange[0]).format('YYYY-MM-DD') : '',
        end: this.queryForm.timeRange.length > 0 ? moment(this.queryForm.timeRange[1]).format('YYYY-MM-DD') : '',
        offset: 0,
        limit: 100000
      }
      ProductApi.getUserList(postData).then(({ data }) => {
        this.isExporting = false
        if (data.Status !== 200) {
          swal({
            text: data.Result.ErrorMsg,
            type: 'error',
            timer: 2000,
            showConfirmButton: false
          })
          return
        }
        const tableDataName = {
          jfid: '用户ID',
          nickname: '用户昵称',
          paycount: '付费次数',
          allpay: '付费金额',
          recid: '推手Id',
          recusername: '推手昵称',
          mobile: '推手手机号',
          createtime: '创建时间'
        }
        console.log('hhh---,tableDataName:', tableDataName)
        const tableData = data.Result.data.map(item => {
          console.log('hhh---,item:', item)
          return {
            jfid: item.jfid,
            nickname: item.nickname,
            paycount: item.paycount,
            allpay: item.allpay,
            recid: item.RecomUser ? item.RecomUser.Id : '',
            recusername: item.RecomUser ? item.RecomUser.UserName : '',
            mobile: item.RecomUser ? item.RecomUser.Mobile : '',
            createtime: item.createtime,
            raw: item
          }
        })
        console.log('hhh---,tableData:', tableData)
        exportExcel([{ sheetName: '订单列表', data: tableData }], tableDataName, '订单列表')
      }).catch(() => {
        this.isExporting = false
      })
    },
    fetchData () {
      // 克隆当前查询条件
      console.log(this.queryForm)
      this.query = deepClone(this.queryForm)
      this.tableCurrentPage = 1
      this.tableTotalSize = 0
      this.fetchList()
    },
    fetchList () {
      // 获取图表数据
      this.isListLoading = true
      this.rawListData = []
      // queryForm: {
      //   uid: '',
      //     nickname: '',
      //     recid: '',
      //     mobile: '',
      //     recnick: '',
      //     timeRange: []
      // },
      const postData = {
        uid: this.queryForm.uid,
        nickname: this.queryForm.nickname,
        recid: this.queryForm.recid,
        mobile: this.queryForm.mobile,
        recnick: this.queryForm.recnick,
        begin: this.queryForm.timeRange.length > 0 ? moment(this.queryForm.timeRange[0]).format('YYYY-MM-DD') : '',
        end: this.queryForm.timeRange.length > 0 ? moment(this.queryForm.timeRange[1]).format('YYYY-MM-DD') : '',
        offset: (this.tableCurrentPage - 1) * this.tablePageSize,
        limit: this.tablePageSize
      }
      ProductApi.getUserList(postData).then(({ data }) => {
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
        this.rawListData = data.Result.data
        this.tableTotalSize = parseInt(data.Result.count)
      })
    },
    handleCurrentChange (value) {
      this.fetchList()
    },
    handlePageSizeChange (value) {
      this.tableCurrentPage = 1
      this.tablePageSize = value
      this.fetchList()
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
.gzh-info-container {
  width: 100%;
  height: 100%;
  padding: 20px 20px;
  background-color: #fff;
  .gzh-info-form {
    width: 800px;
    .gzh-info-group {
      display: table;
      table-layout: fixed;
      width: 100%;
      border-collapse: collapse;
      background: #f9f9f9;
      .gzh-info {
        display: table-row;
        height: 45px;
        .label, .value {
          display: table-cell;
          padding: 10px 20px;
          text-align: left;
          vertical-align: middle;
          border: 1px solid #dcdfe6;
          word-break: break-word;
        }
        .label {
          width: 30%;
        }
        .value {
          width: 70%;
        }
        .form-input {
          width: 300px;
        }
      }
    }
    .buttons {
      margin-top: 20px;
      text-align: center;
      .form-button {
        width: 80px;
      }
    }
  }
}
</style>
