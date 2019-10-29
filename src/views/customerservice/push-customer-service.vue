<template>
  <div class="main">
    <div ref="queryContent" v-sticky="{zIndex: 2001, stickyTop: 0, disabled: false}">
      <div class="header-wrapper">
        <div class="mb-3">
          <h6 class="d-inline-block mb-0 mr-2 font-weight-bold">48小时主动推送</h6>
          <el-tooltip placement="bottom-start" effect="light">
            <div slot="content">操作提示：<br>1、只有通过微信认证的公众号才能使用本推送功能；推送信息时不占用公众号规定的群发次数。<br>2、只能对48小时内活跃（关注、发送消息、扫二维码、点菜单、微信支付等，满足其中任意一个动作）的粉丝进行不限次数的信息推送。</div>
            <i class="el-icon-warning tip-icon"></i>
          </el-tooltip>
        </div>
        <div class="filter-wrapper">
          <div class="filter-container">
            <div class="filter-item mr-3">
              <label>推送主题：</label>
              <el-input :disabled="isListLoading || isToggling || isRemoving" v-model.trim="name" class="filter-input" style="width: 300px;"></el-input>
            </div>
            <div class="filter-item mr-3">
              <label>公众号：</label>
              <tree-transfer
                :disabled="isListLoading || isToggling || isRemoving"
                v-model="gzh"
                :source="gzhList"
                :show-shortcut="true">
              </tree-transfer>
            </div>
            <div class="filter-item">
              <label>状态：</label>
              <el-select :disabled="isListLoading || isToggling || isRemoving" v-model="status" class="filter-input">
                <el-option label="全部" :value="null"></el-option>
                <el-option
                  v-for="item in statusOptions"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
          </div>
        </div>
        <div class="tools">
          <div class="d-flex justify-content-between">
            <div class="filter-item mr-2">
              <el-button :loading="isListLoading" :disabled="isToggling || isRemoving" @click="fetchData" type="primary" class="query-button" icon="el-icon-search">查询</el-button>
              <el-button :disabled="isListLoading || isToggling || isRemoving" @click="resetQueryForm" class="query-button">重置</el-button>
            </div>
            <div class="filter-item flex-shrink-0">
              <el-button :disabled="isListLoading || isToggling || isRemoving" @click="addPushRule" type="success" class="query-button" icon="el-icon-plus" style="width: 150px;">新增推送规则</el-button>
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
          border
          fit
          highlight-current-row
          style="width: 100%;"
          :max-height="tableMaxHeight">
          <el-table-column
            prop="Id"
            label="ID">
          </el-table-column>
          <el-table-column
            prop="Subject"
            label="推送主题"
            min-width="160">
          </el-table-column>
          <el-table-column
            prop="widName"
            label="公众号"
            min-width="120">
            <template slot-scope="scope">
              <div v-if="scope.row.widName">
                <div v-for="(item, index) in scope.row.widName.split(',')" :key="index">{{item}}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="推送对象"
            min-width="150">
            <template slot-scope="scope">
              <span>全部48小时内活跃粉丝</span>
            </template>
          </el-table-column>
          <el-table-column
            label="推送时间"
            min-width="160">
            <template slot-scope="scope">
              <span v-if="+scope.row.TimeType === 1">触发动作后间隔<span class="highlight-red">{{scope.row.Time}}</span>分钟</span>
              <span v-else-if="+scope.row.TimeType === 2">每天<span class="highlight-red">{{scope.row.Time}}</span></span>
              <span v-else-if="+scope.row.TimeType === 3" class="highlight-red">{{scope.row.Time}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="消息类型">
            <template slot-scope="scope">
              <span>图文</span>
            </template>
          </el-table-column>
          <el-table-column
            label="状态">
            <template slot-scope="scope">
              <span v-if="+scope.row.Status === 0" class="highlight-green">使用中</span>
              <span v-else-if="+scope.row.Status === 1">已停用</span>
            </template>
          </el-table-column>
          <el-table-column
            label="更新时间"
            min-width="140">
            <template slot-scope="scope">
              <span>{{scope.row.UpdateTime || scope.row.CreateTime}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="140">
            <template slot-scope="scope">
              <el-button @click="editPushRule(scope.row)" type="text" class="oper-button edit">编辑</el-button>
              <el-button :disabled="isToggling || isRemoving" @click="toggleActive(scope.row)" type="text" class="oper-button" :class="+scope.row.Status === 0 ? 'deactivate' : 'activate'">{{+scope.row.Status === 0 ? '停用' : '开启'}}</el-button>
              <el-button :disabled="isToggling || isRemoving" @click="remove(scope.row)" type="text" class="oper-button remove">删除</el-button>
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
import TreeTransfer from '@/components/report/tree-transfer'
import * as CustomerServiceApi from '@/api/customerservice'
import { deepClone } from '@/utils'
import swal from 'sweetalert2'
import eventBus from '@/utils/eventBus'

export default {
  name: 'push-customer-service',
  directives: {
    sticky: VueSticky
  },
  components: {
    TreeTransfer
  },
  data () {
    const name = null
    const gzh = []
    const status = null

    return {
      name: name,
      gzh: gzh,
      status: status,
      gzhList: [],
      statusOptions: [
        {
          name: '使用中',
          value: 1
        }, {
          name: '已停用',
          value: 2
        }
      ],
      isToggling: false,
      isRemoving: false,
      // 图表数据加载状态
      isListLoading: false,
      // 图表原始数据
      rawListData: [],

      // 保存之前的请求参数
      query: { name, gzh, status },

      // 表格当前页
      tableCurrentPage: 1,
      // 表格一页条数可选项
      tablePageSizeOption: [20, 30, 50, 100],
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
    }
  },
  created () {
    eventBus.$on('refreshCustomerServiceList', this.refreshCustomerServiceList)
    this.fetchGzhList()
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
  beforeDestroy () {
    eventBus.$off('refreshCustomerServiceList')
  },
  methods: {
    fetchGzhList () {
      CustomerServiceApi.getAppidAndName().then(({ data }) => {
        if (data.Status === 200) {
          this.gzhList = data.Result.List.map(item => ({
            id: item.AppId,
            label: item.WeChatName,
            fullLabel: item.WeChatName,
            disabled: false,
            raw: item
          }))
        }
      })
    },
    resetQueryForm () {
      this.name = null
      this.gzh = []
      this.status = null
    },
    refreshCustomerServiceList (refreshCurrentPage) {
      if (refreshCurrentPage) {
        this.fetchList()
      } else {
        this.fetchData()
      }
    },
    fetchData () {
      // 克隆当前查询条件
      const { name, gzh, status } = this
      this.query = deepClone({ name, gzh, status })
      this.tableCurrentPage = 1
      this.tableTotalSize = 0
      this.fetchList()
    },
    fetchList () {
      // 获取图表数据
      this.isListLoading = true
      this.rawListData = []

      const { name, gzh, status } = this.query
      const postData = {
        Offset: (this.tableCurrentPage - 1) * this.tablePageSize,
        Limit: this.tablePageSize,
        Status: status
      }
      gzh.length > 0 && (postData.wid = gzh.map(item => item.id).join(','))
      name && (postData.Name = name)

      CustomerServiceApi.getWechatNoticeList(postData).then(({ data }) => {
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
    handleCurrentChange (value) {
      this.fetchList()
    },
    handlePageSizeChange (value) {
      this.tableCurrentPage = 1
      this.tablePageSize = value
      this.fetchList()
    },
    addPushRule () {
      this.$store.dispatch('delCachedViews', this.$router.match('/edit-push-rule')).then(() => {
        this.$nextTick(() => {
          this.$router.push('/edit-push-rule')
        })
      })
    },
    editPushRule (data) {
      this.$store.dispatch('delCachedViews', this.$router.match('/edit-push-rule')).then(() => {
        this.$nextTick(() => {
          this.$router.push({
            path: '/edit-push-rule',
            query: {
              id: data.Id
            }
          })
        })
      })
    },
    toggleActive (info) {
      this.$confirm(`确定要${+info.Status === 0 ? '停用' : '开启'}推送主题 [${info.Subject}]？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.isToggling = true
        CustomerServiceApi[+info.Status === 0 ? 'editWechatNoticeOff' : 'editWechatNoticeOn']({ Id: info.Id }).then(({ data }) => {
          this.isToggling = false
          if (data.Status !== 200) {
            swal({
              text: data.Result.ErrorMsg,
              type: 'error',
              timer: 2000,
              showConfirmButton: false
            })
            return
          }
          swal({
            text: (+info.Status === 0 ? '停用' : '开启') + '成功',
            type: 'success',
            timer: 2000,
            showConfirmButton: false
          })
          this.fetchList()
        }).catch(() => {
          this.isToggling = false
        })
      }).catch(() => {})
    },
    remove (info) {
      this.$confirm(`确定要删除推送主题 [${info.Subject}]？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.isRemoving = true
        CustomerServiceApi.deleteWechatNotice({ Id: info.Id }).then(({ data }) => {
          this.isRemoving = false
          if (data.Status !== 200) {
            swal({
              text: data.Result.ErrorMsg,
              type: 'error',
              timer: 2000,
              showConfirmButton: false
            })
            return
          }
          swal({
            text: '删除成功',
            type: 'success',
            timer: 2000,
            showConfirmButton: false
          })
          this.fetchList()
        }).catch(() => {
          this.isRemoving = false
        })
      }).catch(() => {})
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
    width: auto;
    &.edit {
      color: #409EFF;
    }
    &.deactivate {
      color: #F56C6C;
    }
    &.activate {
      color: #67C23A;
    }
    &.remove {
      color: #606266;
    }
  }
  .header-wrapper {
    padding: 14px 20px 0;
    box-shadow: 0 1px 3px rgba(0,0,0,.1);
    background-color: #fff;
  }
  .content-wrapper {
    padding: 20px;
    .main-content {
      background-color: #fff;
      .button-wrapper {
        padding: 20px 20px;
      }
    }
  }
  .tip-icon {
    color: #409EFF;
  }
  .highlight-red {
    color: #F56C6C;
  }
  .highlight-green {
    color: #67C23A;
  }
}
</style>
