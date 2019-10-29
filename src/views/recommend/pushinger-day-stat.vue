<template>
  <div class="main">
      <div ref="queryContent" v-sticky="{zIndex: 2001, stickyTop: 0, disabled: false}">
        <div class="header-wrapper">
          <el-form :disabled="isListLoading" :model="queryForm" ref="queryForm" :inline="true" label-width="0" :show-message="false">
            <div class="d-flex justify-content-between">
              <div class="filter-wrapper mr-2">
                <div class="filter-container">
                  <div class="filter-item">
                    <label>维度：</label>
                    <el-form-item prop="status" class="inline-form-item ml-2">
                      <el-checkbox-group
                          :min="1"
                          v-model="queryForm.group">
                        <el-checkbox v-for="item in statusOptions" :label="item.id" :key="item.id">{{item.name}}</el-checkbox>
                      </el-checkbox-group>
                    </el-form-item>
                  </div>
                  <div class="filter-item ml-3">
                    <label>推手名称：</label>
                    <el-form-item prop="gzhName" class="inline-form-item">
                      <el-input v-model.trim="queryForm.pushingerName" class="filter-input" clearable></el-input>
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
              prop="GroupType"
              label="维度">
            </el-table-column>
            <el-table-column
              v-if="showGroupTypeTwo"
              prop="Day"
              label="维度2">
            </el-table-column>
            <el-table-column
              v-if="showPushingName"
              prop="PushingerName"
              label="推手名称">
            </el-table-column>
            <el-table-column
              prop="InviteKeyUserCountSum"
              label="新增锁粉用户数">
            </el-table-column>
            <el-table-column
              prop="UserCountSum"
              label="付费用户数">
            </el-table-column>
            <el-table-column
              prop="UserRateSum"
              label="付费转化率">
            </el-table-column>
            <el-table-column
                prop="DirectOrderCountSum"
                label="付费测算订单数">
            </el-table-column>
            <el-table-column
              prop="OrderTotalCash"
              label="测算订单总额">
              <template slot-scope="scope">
                <div>{{scope.row.OrderTotalCash / 100}}</div>
              </template>
            </el-table-column>
            <el-table-column
                prop="InviteKeyCountSum"
                label="邀请推手数">
            </el-table-column>
            <el-table-column
                prop="DivideTotalCashSum"
                label="分佣总金额">
              <template slot-scope="scope">
                <div>{{scope.row.DivideTotalCashSum / 100}}</div>
              </template>
            </el-table-column>
            <el-table-column
                prop="DivideOrderCountSum"
                label="分佣总订单数">
            </el-table-column>
            <el-table-column
                prop="TotalCashSum"
                label="推手总收益">
              <template slot-scope="scope">
                <div>{{scope.row.TotalCashSum / 100}}</div>
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
import VueSticky from 'vue-sticky'
import RecommendApi from '@/api/recommend'
import swal from 'sweetalert2'
import moment from 'moment'

//  推手列表
export default {
  name: 'pushinger-day-stat',
  directives: {
    sticky: VueSticky
  },
  data () {
    const statusOptions = [
      {
        id: 'Day',
        name: '日期'
      }, {
        id: 'PushingerId',
        name: '推手'
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
        timeRange: [moment().add(-6, 'days'), moment()],
        // 推手名称
        pushingerName: '',
        // 类型
        group: ['Day']
      },
      // 展示第二个维度
      showGroupTypeTwo: false,
      // 展示推手名称
      showPushingName: false,
      // 状态选项
      statusOptions: statusOptions,
      // 图表数据加载状态
      isListLoading: false,
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
      // this.$refs.queryForm.resetFields()
      this.queryForm.timeRange = [moment().add(-6, 'days'), moment()]
      this.queryForm.group = ['Day']
      this.queryForm.pushingerName = ''
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
      let postGroup = ''
      this.queryForm.group.sort().forEach(item => {
        postGroup += item + ','
      })
      postGroup = postGroup.substring(0, postGroup.length - 1)
      const postData = {
        startDate: moment(this.queryForm.timeRange[0]).format('YYYY-MM-DD'),
        endDate: moment(this.queryForm.timeRange[1]).format('YYYY-MM-DD'),
        group: postGroup,
        pushingerName: this.queryForm.pushingerName,
        page: this.tableCurrentPage,
        limit: this.tablePageSize
      }
      RecommendApi.getDayStatList(postData).then(({ data }) => {
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
        this.showGroupTypeTwo = this.queryForm.group.length === 2
        this.showPushingName = this.queryForm.group.indexOf('PushingerId') !== -1
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
