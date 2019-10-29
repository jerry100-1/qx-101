<template>
  <div class="main">
    <div ref="queryContent" v-sticky="{zIndex: 2001, stickyTop: 0, disabled: false}">
      <div class="header-wrapper">
        <div class="mb-3">
          <h6 class="d-inline-block mb-0 mr-2 font-weight-bold">优质异常设备管理</h6>
        </div>
        <div>
          <div class="filter-container">
            <div class="filter-item mr-5">
              <label>设备等级：</label>
              <checkbox-group :disabled="isListLoading || isExcelExporting" v-model="checkedLevels" :options="levels" class="d-inline-block"></checkbox-group>
            </div>
            <div class="filter-item mr-5">
              <label>当前状态：</label>
              <checkbox-group :disabled="isListLoading || isExcelExporting" v-model="checkedStatuses" :options="statuses" class="d-inline-block"></checkbox-group>
            </div>
            <div class="filter-item mr-5">
              <label>处理状态：</label>
              <checkbox-group :disabled="isListLoading || isExcelExporting" v-model="checkedProcessingStatuses" :options="processingStatuses" class="d-inline-block"></checkbox-group>
            </div>
            <div class="filter-item mr-5">
              <label>异常类型：</label>
              <checkbox-group :disabled="isListLoading || isExcelExporting" v-model="checkedTypes" :options="types" class="d-inline-block"></checkbox-group>
            </div>
            <div class="filter-item mr-5">
              <label>合伙人：</label>
              <tree-transfer
                :disabled="isListLoading || isExcelExporting || isAgentDisabled"
                v-model="agent"
                :source="agentList"
                value-consists-of="leaf"
                :show-shortcut="true">
              </tree-transfer>
            </div>
            <div class="filter-item">
              <el-button :loading="isListLoading" :disabled="isExcelExporting" @click="fetchData" type="primary" style="width: 100px;" icon="el-icon-search">查询</el-button>
              <el-button :loading="isExcelExporting" :disabled="isListLoading" @click="exportExcel" type="primary" style="width: 100px;" icon="el-icon-download">导出</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="content-wrapper">
      <div class="main-content">

        <div v-if="handleTotal && Object.keys(handleTotal).length > 0" class="table-filter-wrapper">
          <span>未处理：{{ handleTotal.WaitTotal }}</span>
          <span class="ml-3">已跟进：{{ handleTotal.FollowUpTotal }}</span>
          <span class="ml-3">已处理：{{ handleTotal.CompleteTotal }}</span>
        </div>

        <el-table
          ref="table"
          @sort-change="handleTableSortChange"
          :default-sort="{prop: 'AvgFollowCount', order: 'descending'}"
          :data="rawListData"
          v-loading="isListLoading"
          border
          fit
          highlight-current-row
          style="width: 100%;"
          :max-height="tableMaxHeight">
          <el-table-column
            fixed
            prop="ScaleNo"
            label="设备ID"
            min-width="130">
            <template slot-scope="scope">
              <a @click.stop="showEquipmentInfo(scope.row.ScaleNo)" class="highlight" href="javascript:;">{{ scope.row.ScaleNo }}</a>
            </template>
          </el-table-column>
          <el-table-column
            fixed
            prop="StoreName"
            label="门店名称"
            min-width="180">
          </el-table-column>
          <el-table-column
            label="设备状态">
            <el-table-column
              prop="HandleLevel"
              label="设备等级"
              min-width="100"
              sortable="custom">
              <template slot-scope="scope">
                <span>{{ scope.row.HandleLevelText }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="RealTimeStatus"
              label="当前状态"
              min-width="100"
              sortable="custom">
              <template slot-scope="scope">
                <span>{{ scope.row.RealTimeStatusText }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="Status"
              label="告警类型"
              min-width="100"
              sortable="custom">
              <template slot-scope="scope">
                <span>{{ scope.row.StatusText }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="QualityTimes"
              label="告警次数"
              min-width="100"
              sortable="custom">
            </el-table-column>
            <el-table-column
              prop="WarningTime"
              label="最后告警时间"
              min-width="120"
              sortable="custom">
              <template slot-scope="scope">
                <span>{{ scope.row.WarningTimeText }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="HandleStatus"
              label="处理状态"
              min-width="100"
              sortable="custom">
              <template slot-scope="scope">
                <span>{{ scope.row.HandleStatusText }}</span>
                <i @click.stop="showStatusEditDialog(scope.row)" class="icon-edit el-icon-edit-outline ml-1" title="修改"></i>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column
            label="设备数据">
            <el-table-column
              prop="AvgWeightCount"
              label="近7次日均称重"
              min-width="130"
              sortable="custom">
            </el-table-column>
            <el-table-column
              prop="AvgFollowCount"
              label="近7次日均导粉"
              min-width="130"
              sortable="custom">
            </el-table-column>
            <el-table-column
              prop="AvgCurWeightCount"
              label="近7日此时称重"
              min-width="130"
              sortable="custom">
            </el-table-column>
            <el-table-column
              prop="AvgCurFollowCount"
              label="近7日此时导粉数"
              min-width="140"
              sortable="custom">
            </el-table-column>
            <el-table-column
              prop="WeightCount"
              label="今日称重数"
              min-width="110"
              sortable="custom">
            </el-table-column>
            <el-table-column
              prop="FollowCount"
              label="今日导粉数"
              min-width="110"
              sortable="custom">
            </el-table-column>
            <el-table-column
              prop="PreOnceFollowCount"
              label="近7日小时导粉均值"
              min-width="150"
              sortable="custom">
            </el-table-column>
            <el-table-column
              prop="PreHourFollowCount"
              label="小时导粉数"
              min-width="110"
              sortable="custom">
            </el-table-column>
            <el-table-column
              prop="PreHourScanCount"
              label="小时扫码数"
              min-width="110"
              sortable="custom">
            </el-table-column>
          </el-table-column>
          <el-table-column
            label="设备信息">
            <el-table-column
              prop="AgentId"
              label="合伙人"
              min-width="130"
              sortable="custom">
              <template slot-scope="scope">
                <span>{{ scope.row.AgentName }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="AgentPhone"
              label="合伙人手机号"
              min-width="120"
              sortable="custom">
            </el-table-column>
            <el-table-column
              prop="EmployeeId"
              label="铺秤人员"
              min-width="100"
              sortable="custom">
              <template slot-scope="scope">
                <span>{{ scope.row.EmployeeName }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="ProvinceName"
              label="省份"
              min-width="100"
              sortable="custom">
            </el-table-column>
            <el-table-column
              prop="CityName"
              label="城市"
              min-width="100"
              sortable="custom">
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

    <el-dialog
      title="设备基本信息"
      :visible.sync="equipmentInfoDialogVisible"
      custom-class="quality-abnormal-equipment equipment-info-dialog">
      <iframe v-if="equipmentInfoDialogVisible" :src="host + '/data/modules/scale/scale.php?do=SearchInfo&scaleId=' + scaleId" class="border-0 w-100 h-100"></iframe>
    </el-dialog>

    <el-dialog
      :visible.sync="statusEditDialogVisible"
      center
      custom-class="quality-abnormal-equipment status-edit-dialog"
      :show-close="false"
      @open="handleEditDialogOpen"
      @close="handleEditDialogClose">
      <div v-loading="isUpdating">
        <el-form :model="equipmentInfo" ref="statusEditForm" label-width="0" class="w-100">
          <div class="status-edit-title">设备状态修改</div>
          <div class="equipment-info-group">
            <div class="equipment-info">
              <span class="label">设备ID：</span>
              <span class="value">{{ equipmentInfo.ScaleNo }}</span>
            </div>
            <div class="equipment-info">
              <span class="label">异常类型：</span>
              <span class="value">{{ equipmentInfo.StatusText }}</span>
            </div>
            <div class="equipment-info">
              <span class="label">合伙人：</span>
              <span class="value">{{ equipmentInfo.AgentName }}</span>
            </div>
            <div class="equipment-info">
              <span class="label">处理状态：</span>
              <el-form-item
                prop="HandleStatus"
                :rules="[
                  { required: true, trigger: ['change'], message: '必选'}
                ]"
                :inline-message="true"
                class="value">
                <el-radio-group v-model="equipmentInfo.HandleStatus">
                  <el-radio-button v-for="status in processingStatuses" :label="status.id" :key="status.id">{{status.name}}</el-radio-button>
                </el-radio-group>
              </el-form-item>
            </div>
          </div>
          <div class="status-edit-title">跟进记录</div>
          <div class="record-wrapper">
            <template v-if="!isRecordEditing">
              <span>{{ equipmentInfo.HandleTime }}</span>
              <span class="ml-1">{{ equipmentInfo.HandleRemark }}</span>
              <i @click="editRecord" class="icon-edit el-icon-edit-outline ml-1" title="修改"></i>
            </template>
            <el-form-item v-else prop="HandleRemark" :show-message="false" :inline-message="true" class="mb-0">
              <el-input v-model.trim="equipmentInfo.HandleRemark" placeholder="请输入"></el-input>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button :loading="isUpdating" type="primary" @click="saveStatus">保存</el-button>
        <el-button :disabled="isUpdating" @click="statusEditDialogVisible = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import TreeTransfer from '@/components/report/tree-transfer'
import CheckboxGroup from '@/components/report/checkbox-group'
import VueSticky from 'vue-sticky'
import moment from 'moment'
import * as ReportCommonApi from '@/api/report/common'
import * as QualityApi from '@/api/report/quality-abnormal-equipment'
import swal from 'sweetalert2'
import { deepClone } from '@/utils'
import { mapGetters } from 'vuex'
import exportExcel from '@/utils/exportExcel'

export default {
  name: 'quality-abnormal-equipment',
  components: {
    TreeTransfer,
    CheckboxGroup
  },
  directives: {
    sticky: VueSticky
  },
  data () {
    const levels = [
      {
        id: 1,
        name: '特级'
      }, {
        id: 2,
        name: '一级'
      }, {
        id: 3,
        name: '二级'
      }
    ]
    const statuses = [
      {
        id: 1,
        name: '在线'
      }, {
        id: 0,
        name: '离线'
      }
    ]
    const types = [
      {
        id: 4,
        name: '离线'
      }, {
        id: 1,
        name: '在线无称重'
      }, {
        id: 2,
        name: '有称重无扫码'
      }, {
        id: 3,
        name: '导粉不达标'
      }
    ]
    const processingStatuses = [
      {
        id: 0,
        name: '待处理'
      }, {
        id: 2,
        name: '已跟进'
      }, {
        id: 1,
        name: '已处理'
      }
    ]
    const checkedLevels = [1, 2, 3]
    const checkedStatuses = [0]
    const checkedTypes = [1, 2, 3, 4]
    const checkedProcessingStatuses = [0]
    const agent = []

    return {
      // 设备等级
      levels: levels,
      levelMap: new Map(levels.map(item => [item.id, item.name])),
      checkedLevels: checkedLevels,

      // 当前状态
      statuses: statuses,
      statusMap: new Map(statuses.map(item => [item.id, item.name])),
      checkedStatuses: checkedStatuses,

      // 异常类型
      types: types,
      typeMap: new Map(types.map(item => [item.id, item.name])),
      checkedTypes: checkedTypes,

      // 处理状态
      processingStatuses: processingStatuses,
      processingStatusMap: new Map(processingStatuses.map(item => [item.id, item.name])),
      checkedProcessingStatuses: checkedProcessingStatuses,

      // 已选合伙人
      agent: agent,
      // 用于过滤以上四种选项
      filters: {},

      // 设备信息对话框显示
      equipmentInfoDialogVisible: false,
      // 当前查看设备信息的设备ID
      scaleId: 0,
      // 状态修改对话框显示
      statusEditDialogVisible: false,
      // 状态修改时设备信息原始数据
      originEquipmentInfo: {},
      // 状态修改时的设备信息
      equipmentInfo: {},
      // 是否在编辑跟进记录
      isRecordEditing: false,
      // 是否禁用筛选条件
      isAgentDisabled: false,
      // 图表数据加载状态
      isListLoading: false,
      // 导出状态
      isExcelExporting: false,
      // 更新设备状态
      isUpdating: false,
      // 保存之前的请求参数
      query: deepClone({ checkedLevels, checkedStatuses, checkedTypes, checkedProcessingStatuses, agent }),
      // 图表原始数据
      rawListData: [],
      // 统计数据
      handleTotal: {},
      // 表格当前页
      tableCurrentPage: 1,
      // 表格一页条数可选项
      tablePageSizeOption: [20, 30, 50, 100],
      // 表格一页条数
      tablePageSize: 50,
      // 总条数
      tableTotalSize: 0,
      // 表格当前排序字段
      sortBy: 'AvgFollowCount',
      // 表格当前排序方向
      order: 'descending',
      // 除表格外内容区域高度
      othersHeight: 0,
      // 合伙人收益模式列表
      agentGainList: []
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
    // 过滤条件选项原始数据
    ...mapGetters([
      'agentRawData'
    ]),
    // 合伙人收益模式map
    agentGainMap () {
      return new Map(this.agentGainList.map(item => [item.id, item.name]))
    },
    // 合伙人选项数据
    agentList () {
      const agent = this.filters.agent || new Map()
      const size = agent.size
      const agentGroupMap = {}

      this.agentRawData.forEach(item => {
        const group = agentGroupMap[item.AgentGainId]
        if (group) {
          group.children.push({
            id: item.AgentId,
            label: item.RealName,
            fullLabel: item.RealName,
            disabled: size > 0 && !agent.has(item.AgentId),
            raw: item
          })
        } else {
          const newGroup = {
            id: 'gain' + item.AgentGainId,
            label: this.agentGainMap.get(+item.AgentGainId) || '未知收益模式',
            fullLabel: this.agentGainMap.get(+item.AgentGainId) || '未知收益模式',
            disabled: false,
            children: [{
              id: item.AgentId,
              label: item.RealName,
              fullLabel: item.RealName,
              disabled: size > 0 && !agent.has(item.AgentId),
              raw: item
            }]
          }
          agentGroupMap[item.AgentGainId] = newGroup
        }
      })
      return Object.values(agentGroupMap)
    },
    tableMaxHeight () {
      return Math.max(this.$store.getters.containerHeight - this.othersHeight, 300)
    }
  },
  watch: {
    checkedStatuses: {
      handler: function (val, oldVal) {
        if (val.length === 1 && val[0] === 1) {
          this.$set(this.types[0], 'disabled', true)
        } else {
          this.$set(this.types[0], 'disabled', false)
        }
      },
      deep: true
    }
  },
  created () {
    this.$store.dispatch('getAllReportFilters')
    this.getIncomeList()
  },
  updated () {
    this.$nextTick(() => {
      const queryContent = this.$refs.queryContent
      const queryContentHeight = queryContent ? Math.round(queryContent.clientHeight) : 0
      this.othersHeight = queryContentHeight + 41 + 51 + 64
    })
  },
  deactivated () {
    this.equipmentInfoDialogVisible = false
    this.statusEditDialogVisible = false
  },
  methods: {
    getIncomeList () {
      ReportCommonApi.getIncomeList().then(({ data }) => {
        if (data.Status === 200) {
          this.agentGainList = data.Result instanceof Array ? data.Result : []
        }
      })
    },
    showEquipmentInfo (scaleId) {
      this.scaleId = scaleId
      this.equipmentInfoDialogVisible = true
    },
    showStatusEditDialog (equipmentInfo) {
      this.originEquipmentInfo = equipmentInfo
      this.equipmentInfo = deepClone(equipmentInfo)
      this.statusEditDialogVisible = true
    },
    editRecord () {
      this.isRecordEditing = true
    },
    handleEditDialogOpen () {
      this.$nextTick(() => {
        this.$refs.statusEditForm.clearValidate()
      })
    },
    handleEditDialogClose () {
      this.isRecordEditing = false
    },
    saveStatus () {
      this.$refs.statusEditForm.validate().then(() => {
        this.isUpdating = true

        const postData = {
          ScaleNo: this.equipmentInfo.ScaleNo,
          HandleStatus: this.equipmentInfo.HandleStatus
        }

        // 跟进记录不相同时才更新
        if (this.equipmentInfo.HandleRemark && this.originEquipmentInfo.HandleRemark !== this.equipmentInfo.HandleRemark) {
          postData.HandleRemark = this.equipmentInfo.HandleRemark
        }

        QualityApi.updateHandleInfo(postData).then(({ data }) => {
          this.isUpdating = false
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
            text: '修改设备状态成功',
            type: 'success',
            timer: 2000,
            showConfirmButton: false
          })
          this.statusEditDialogVisible = false
          this.fetchList()
        }).catch(() => {
          this.isUpdating = false
        })
      }).catch(() => {})
    },
    fetchData () {
      // 克隆当前查询条件
      const { checkedLevels, checkedStatuses, checkedTypes, checkedProcessingStatuses, agent } = this
      this.query = deepClone({ checkedLevels, checkedStatuses, checkedTypes, checkedProcessingStatuses, agent })
      this.tableCurrentPage = 1
      this.tableTotalSize = 0
      this.handleTotal = {}
      this.fetchList()
    },
    fetchList () {
      // 获取图表数据
      this.isListLoading = true
      this.rawListData = []

      const postData = {
        Page: this.tableCurrentPage,
        Limit: this.tablePageSize
      }

      const { checkedLevels, checkedStatuses, checkedTypes, checkedProcessingStatuses, agent } = this.query

      checkedLevels.length > 0 && (postData.HandleLevel = checkedLevels.join(','))
      checkedStatuses.length > 0 && (postData.RealTimeStatus = checkedStatuses.join(','))
      checkedTypes.length > 0 && (postData.Status = checkedTypes.join(','))
      checkedProcessingStatuses.length > 0 && (postData.HandleStatus = checkedProcessingStatuses.join(','))
      agent.length > 0 && (postData.AgentId = agent.map(item => item.id).join(','))

      this.sortBy && (postData.SortField = this.sortBy)
      this.order && (postData.Sort = this.order === 'ascending' ? 'asc' : 'desc')

      QualityApi.getHourQualityList(postData).then(({ data }) => {
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
        const rawListData = data.Result.List instanceof Array ? data.Result.List : []
        rawListData.forEach(item => {
          item.HandleLevelText = this.levelMap.get(item.HandleLevel)
          item.RealTimeStatusText = this.statusMap.get(item.RealTimeStatus)
          item.StatusText = item.RealTimeStatus === 1 && item.Status === 4 ? '-' : this.typeMap.get(item.Status)
          item.WarningTimeText = moment(item.WarningTime).format('H点')
          item.HandleStatusText = this.processingStatusMap.get(item.HandleStatus)
        })
        this.rawListData = rawListData
        this.tableTotalSize = data.Result.total
        this.handleTotal = data.Result.handleTotal
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
      const fileName = '优质异常设备管理_' + moment().format('YYYYMMDD')
      this.isExcelExporting = true

      const postData = {
        SortField: 'AvgFollowCount',
        Sort: 'desc',
        Download: 'excel'
      }

      const { checkedLevels, checkedStatuses, checkedTypes, checkedProcessingStatuses, agent } = this

      checkedLevels.length > 0 && (postData.HandleLevel = checkedLevels.join(','))
      checkedStatuses.length > 0 && (postData.RealTimeStatus = checkedStatuses.join(','))
      checkedTypes.length > 0 && (postData.Status = checkedTypes.join(','))
      checkedProcessingStatuses.length > 0 && (postData.HandleStatus = checkedProcessingStatuses.join(','))
      agent.length > 0 && (postData.AgentId = agent.map(item => item.id).join(','))

      QualityApi.getHourQualityList(postData).then(({ data }) => {
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
          item.HandleLevelText = this.levelMap.get(item.HandleLevel)
          item.RealTimeStatusText = this.statusMap.get(item.RealTimeStatus)
          item.StatusText = item.RealTimeStatus === 1 && item.Status === 4 ? '-' : this.typeMap.get(item.Status)
          item.WarningTimeText = moment(item.WarningTime).format('H点')
          item.HandleStatusText = this.processingStatusMap.get(item.HandleStatus)
        })

        const fields = {
          ScaleNo: '设备ID',
          StoreName: '门店名称',
          StoreContract: '门店联系人',
          StorePhone: '门店电话',
          HandleLevelText: '设备等级',
          RealTimeStatusText: '当前状态',
          StatusText: '告警类型',
          QualityTimes: '告警次数',
          WarningTimeText: '最后告警时间',
          HandleStatusText: '处理状态',
          HandleRemark: '跟进记录',
          AvgWeightCount: '近7次日均称重',
          AvgFollowCount: '近7次日均导粉',
          AvgCurWeightCount: '近7日此时称重',
          AvgCurFollowCount: '近7日此时导粉数',
          WeightCount: '今日称重数',
          FollowCount: '今日导粉数',
          PreOnceFollowCount: '近7日小时导粉均值',
          PreHourFollowCount: '小时导粉数',
          PreHourScanCount: '小时扫码数',
          AgentName: '合伙人',
          AgentPhone: '合伙人手机号',
          EmployeeName: '铺秤人员',
          ProvinceName: '省份',
          CityName: '城市',
          DistrictName: '区县'
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
      .indicator-wrapper {
        padding: 20px 0 15px 20px;
      }
      .chart-sort {
        padding: 20px 20px 0;
        text-align: right;
      }
      .chart-compare {
        margin-bottom: 16px;
        text-align: center;
      }
      .table-filter-wrapper {
        padding: 20px 20px 10px;
      }
    }
  }
}
.index-column {
  width: 24px;
  margin-right: 14px;
}
.legend-wrapper {
  margin-top: 15px;
  text-align: center;
  .legend {
    display: inline-block;
    margin: 0 10px;
    vertical-align: middle;
    cursor: pointer;
    user-select: none;
    .legend-icon {
      display: inline-block;
      width: 25px;
      height: 14px;
      border-radius: 3px;
      vertical-align: middle;
    }
    .legend-name {
      font: 12px 'Microsoft YaHei';
      margin-left: 5px;
    }
    .caret-wrapper {
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      height: 34px;
      width: 24px;
      margin-left: 5px;
      vertical-align: middle;
      cursor: pointer;
      overflow: initial;
      position: relative;
      .sort-caret {
        width: 0;
        height: 0;
        border: 5px solid transparent;
        position: absolute;
        left: 7px;
        &.ascending {
          border-bottom-color: #c0c4cc;
          top: 5px;
        }
        &.descending {
          border-top-color: #c0c4cc;
          bottom: 7px;
        }
      }
      &.ascending {
        .ascending {
          border-bottom-color: #409EFF;
        }
      }
      &.descending {
        .descending {
          border-top-color: #409EFF;
        }
      }
    }
    &.inactive {
      .legend-icon {
        background-color: #ccc !important;
      }
      .legend-name {
        color: #ccc !important;
      }
    }
    &:hover {
      .legend-icon {
        opacity: 0.7;
      }
    }
  }
}

.highlight {
  color: #409EFF;
  cursor: pointer;
}
.icon-edit {
  font-size: 16px;
  cursor: pointer;
}

.status-edit-title {
  font-size: 16px;
  padding: 10px 0;
  text-align: center;
}
.equipment-info-group {
  display: table;
  table-layout: fixed;
  width: 100%;
  border-collapse: collapse;
  background: #f9f9f9;
  .equipment-info {
    display: table-row;
    height: 45px;
    .label, .value {
      display: table-cell;
      width: 50%;
      padding: 5px 10px;
      text-align: center;
      vertical-align: middle;
      border: 1px solid #dcdfe6;
      word-break: break-word;
    }
  }
}
.record-wrapper {
  padding: 10px 20px;
  border: 1px solid #dcdfe6;
  background: #f9f9f9;
  text-align: center;
  word-break: break-word;
}
</style>

<style lang="less">
.quality-abnormal-equipment {
  &.equipment-info-dialog {
    width: 800px;
    height: 750px;
    .el-dialog__body {
      height: 696px;
      padding: 0;
    }
  }
  &.status-edit-dialog {
    width: 650px;
    .el-dialog__header {
      display: none;
    }
  }
}
</style>
