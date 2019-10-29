<template>
  <div class="main">
      <div ref="queryContent" v-sticky="{zIndex: 2001, stickyTop: 0, disabled: false}">
        <div class="header-wrapper">
          <el-form :disabled="isListLoading" :model="queryForm" ref="queryForm" :inline="true" label-width="0" :show-message="false">
            <div class="d-flex justify-content-between">
              <div class="filter-wrapper mr-2">
                <div class="filter-container">
                  <div class="filter-item ml-3">
                    <label>推手ID：</label>
                    <el-form-item prop="inviteKey" class="inline-form-item">
                      <el-input v-model.trim="queryForm.pushingerId" class="filter-input" clearable></el-input>
                    </el-form-item>
                  </div>
                  <div class="filter-item ml-3">
                    <label>推手手机号：</label>
                    <el-form-item prop="inviteKey" class="inline-form-item">
                      <el-input v-model.trim="queryForm.pushingerMobile" class="filter-input" clearable></el-input>
                    </el-form-item>
                  </div>
                  <div class="filter-item ml-3">
                    <label>推手昵称：</label>
                    <el-form-item prop="inviteKey" class="inline-form-item">
                      <el-input v-model.trim="queryForm.pushingerName" class="filter-input" clearable></el-input>
                    </el-form-item>
                  </div>
                  <div class="filter-item ml-3">
                    <label>锁粉Key：</label>
                    <el-form-item prop="inviteKey" class="inline-form-item">
                      <el-input v-model.trim="queryForm.pushingerInviteKey" class="filter-input" clearable></el-input>
                    </el-form-item>
                  </div>
                  <div class="filter-item ml-3">
                    <label>订单号：</label>
                    <el-form-item prop="inviteKey" class="inline-form-item">
                      <el-input v-model.trim="queryForm.orderId" class="filter-input" clearable></el-input>
                    </el-form-item>
                  </div>
                  <div class="filter-item ml-3">
                    <label>用户ID：</label>
                    <el-form-item prop="inviteKey" class="inline-form-item">
                      <el-input v-model.trim="queryForm.userId" class="filter-input" clearable></el-input>
                    </el-form-item>
                  </div>
                  <div class="filter-item ml-3">
                    <label>类型：</label>
                    <el-form-item prop="commType" class="inline-form-item ml-2">
                      <el-select v-model="queryForm.commType" placeholder="请选择">
                        <el-option
                            v-for="item in commTypes"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                      </el-select>
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
                  <el-button :disabled="isExporting" @click="exportExcel" type="warning" class="query-button">导出</el-button>
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
              prop="Id"
              label="ID"
              width="80">
            </el-table-column>
            <el-table-column
                prop="PushingerId"
                label="推手">
              <template slot-scope="scope">
                <div style="display: flex; flex-direction: column;align-items: center;justify-content: center">
                  <span>ID:{{scope.row.PushingerId ? scope.row.PushingerId : '无'}}</span>
                  <span>手机号:{{scope.row.Mobile ? scope.row.Mobile : '无'}}</span>
                  <span>昵称:{{scope.row.PushingerNickname ? scope.row.PushingerNickname : '无'}}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column
                prop="PushingerInviteKey"
                label="锁粉Key"
                width="100">
            </el-table-column>
            <el-table-column
                prop="CommType"
                label="收益类型"
                width="120">
              <template slot-scope="scope">
                <div>{{formatType(scope.row.CommType)}}</div>
              </template>
            </el-table-column>
            <el-table-column
                prop="Fee"
                label="收益"
                width="80">
              <template slot-scope="scope">
                <div>{{scope.row.Fee / 100}}</div>
              </template>
            </el-table-column>
            <el-table-column
              prop="SourceOrderNo"
              label="订单号">
            </el-table-column>
            <el-table-column
                prop="OrderType"
                label="订单类型"
                width="100">
              <template slot-scope="scope">
                <div>{{formatOrderType(scope.row.OrderType)}}</div>
              </template>
            </el-table-column>
            <el-table-column
                prop="UnlockTypeText"
                label="解锁类型文本">
            </el-table-column>
            <el-table-column
                prop="UserId"
                label="购买用户Id"
                width="100">
            </el-table-column>
            <el-table-column
                prop="Nickname"
                label="购买用户昵称">
            </el-table-column>
            <el-table-column
                prop="HeadUrl"
                label="购买用户头像"
                width="120">
              <template slot-scope="scope">
                <img :src="scope.row.HeadUrl" style="height: 100px;width: 100px"/>
              </template>
            </el-table-column>
            <el-table-column
                prop="CreateTime"
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
import RecommendApi from '@/api/recommend'
import swal from 'sweetalert2'
import moment from 'moment'
import exportExcel from '@/utils/exportExcel'

//  推手列表
export default {
  name: 'pushinger-income-list',
  directives: {
    sticky: VueSticky
  },
  data () {
    const commTypes = [
      {
        id: '0',
        name: '所有佣金类型'
      },
      {
        id: '1',
        name: '注册佣金'
      },
      {
        id: '2',
        name: '直推佣金'
      },
      {
        id: '3',
        name: '推手订单分佣'
      },
      {
        id: '4',
        name: '邀请推手提成'
      },
      {
        id: '10',
        name: '押金返还'
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
        commType: '0',
        timeRange: [moment().add(-6, 'days'), moment()],
        pushingerId: '',
        pushingerMobile: '',
        pushingerName: '',
        pushingerInviteKey: '',
        orderId: '',
        userId: ''
      },
      // 展示推手名称
      showPushingName: false,
      // 类型选项
      commTypes: commTypes,
      // 图表数据加载状态
      isListLoading: false,
      // 导出数据加载状态
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

  },
  created () {
    this.fetchData()
  },
  activated () {

  },
  methods: {
    // 重置查询
    resetQueryForm () {
      this.queryForm = {
        commType: '0',
        timeRange: [moment().add(-6, 'days'), moment()],
        pushingerId: '',
        pushingerMobile: '',
        pushingerName: '',
        pushingerInviteKey: '',
        orderId: '',
        userId: ''
      }
    },
    fetchData () {
      // 克隆当前查询条件
      console.log(this.queryForm)
      this.tableCurrentPage = 1
      this.tableTotalSize = 0
      this.fetchList()
    },
    fetchList () {
      if (this.queryForm.timeRange.length < 2) {
        return
      }
      // 获取图表数据
      this.isListLoading = true
      this.rawListData = []
      const postData = {
        commType: this.queryForm.commType,
        pushingerId: this.queryForm.pushingerId,
        pushingerName: this.queryForm.pushingerName,
        pushingerMobile: this.queryForm.pushingerMobile,
        pushingerInviteKey: this.queryForm.pushingerInviteKey,
        userId: this.queryForm.userId,
        sourceOrderNo: this.queryForm.orderId,
        startDate: moment(this.queryForm.timeRange[0]).format('YYYY-MM-DD'),
        endDate: moment(this.queryForm.timeRange[1]).format('YYYY-MM-DD'),
        inviteKey: this.queryForm.inviteKey,
        page: this.tableCurrentPage,
        limit: this.tablePageSize
      }
      RecommendApi.getIncomeList(postData).then(({ data }) => {
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
    },
    exportExcel () {
      this.isExporting = true
      const postData = {
        page: 1,
        limit: 100000,
        commType: this.queryForm.commType,
        pushingerId: this.queryForm.pushingerId,
        pushingerName: this.queryForm.pushingerName,
        pushingerMobile: this.queryForm.pushingerMobile,
        pushingerInviteKey: this.queryForm.pushingerInviteKey,
        userId: this.queryForm.userId,
        sourceOrderNo: this.queryForm.orderId,
        startDate: moment(this.queryForm.timeRange[0]).format('YYYY-MM-DD'),
        endDate: moment(this.queryForm.timeRange[1]).format('YYYY-MM-DD'),
        inviteKey: this.queryForm.inviteKey
      }
      RecommendApi.getIncomeList(postData).then(({ data }) => {
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
          Id: '用户ID',
          PushingerId: '推手ID',
          PushingerNickname: '推手昵称',
          Mobile: '推手手机号',
          PushingerInviteKey: '锁粉Key',
          CommType: '收益类型',
          Fee: '收益',
          SourceOrderNo: '订单号',
          OrderType: '订单类型',
          UnlockTypeText: '解锁类型文本',
          UserId: '购买用户Id',
          Nickname: '购买用户昵称',
          CreateTime: '创建时间'
        }
        const tableData = data.Result.data.map(item => {
          console.log('hhh---,item:', item)
          return {
            Id: item.Id,
            PushingerId: item.PushingerId,
            PushingerNickname: item.PushingerNickname,
            Mobile: item.Mobile,
            PushingerInviteKey: item.PushingerInviteKey,
            CommType: this.formatType(item.CommType),
            Fee: item.Fee / 100,
            SourceOrderNo: item.SourceOrderNo,
            OrderType: this.formatOrderType(item.OrderType),
            UnlockTypeText: item.UnlockTypeText,
            UserId: item.UserId,
            Nickname: item.Nickname,
            CreateTime: item.CreateTime,
            raw: item
          }
        })
        exportExcel([{ sheetName: '推手收益明细', data: tableData }], tableDataName, '推手收益明细')
      }).catch(() => {
        this.isExporting = false
      })
    },
    formatType (type) {
      for (let i = 0; i < this.commTypes.length; i++) {
        const item = this.commTypes[i]
        if (item.id === type) {
          console.log('hhh---,return:', item.name)
          return item.name
        }
      }
      return ''
    },
    formatOrderType (type) {
      switch (type) {
        case '1':
          return '八字'
        case '2':
          return '面向'
        case '3':
          return '手相'
        case '4':
          return '塔罗'
        case '10':
          return '注册'
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
