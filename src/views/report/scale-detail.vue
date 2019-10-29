<template>
  <div class="main">
    <div class="content-wrapper">
      <div class="content">
        <h6 class="content-title">基本信息</h6>
        <div v-loading="isBaseInfoLoading" class="base-info-wrapper">
          <div class="d-flex justify-content-between">
            <div class="base-info-block">
              <ul>
                <li>
                  <div>
                    <span class="info-title">店铺名称：</span>
                    <span>{{ baseInfo.StoreName }}</span>
                  </div>
                </li>
                <li>
                  <div>
                    <span class="info-title">地址：</span>
                    <span>{{ baseInfo.AddressName }}</span>
                  </div>
                </li>
                <li>
                  <div>
                    <span class="info-title">经纬度：</span>
                    <span v-if="baseInfo.Loc">{{ baseInfo.Loc.Longitude }}, {{ baseInfo.Loc.Latitude }}</span>
                  </div>
                </li>
                <li>
                  <div>
                    <span class="info-title">场景：</span>
                    <span>{{ baseInfo.SceneName }}</span>
                  </div>
                </li>
                <li>
                  <div>
                    <span class="info-title">在线时间段：</span>
                    <span>{{ baseInfo.BusinessHours }}</span>
                  </div>
                </li>
                <li>
                  <div>
                    <span class="info-title">联系人姓名：</span>
                    <span>{{ baseInfo.Contact }}</span>
                  </div>
                </li>
                <li>
                  <div>
                    <span class="info-title">联系人手机号：</span>
                    <span>{{ baseInfo.Phone }}</span>
                  </div>
                </li>
                <li>
                  <div>
                    <span class="info-title">联系人微信号：</span>
                    <span>{{ baseInfo.ContactWechat }}</span>
                  </div>
                </li>
              </ul>
            </div>
            <div class="base-info-block text-nowrap">
              <ul>
                <li>
                  <div>
                    <span class="info-title">设备ID：</span>
                    <span>{{ baseInfo._id }}</span>
                  </div>
                </li>
                <li>
                  <div>
                    <span class="info-title">合伙人信息：</span>
                    <span>{{ baseInfo.AgentName }}</span>
                  </div>
                </li>
                <li>
                  <div>
                    <span class="info-title">铺秤人员：</span>
                    <span>{{ baseInfo.EmployeeName }}</span>
                  </div>
                </li>
                <li>
                  <div>
                    <span class="info-title">激活状态：</span>
                    <span>{{ baseInfo.StateName }}</span>
                  </div>
                </li>
                <li>
                  <div>
                    <span class="info-title">维修状态：</span>
                    <span>{{ baseInfo.RepairStateName }}</span>
                  </div>
                </li>
                <li>
                  <div>
                    <span class="info-title">在线状态：</span>
                    <span>{{ baseInfo.LocationStatusName }}</span>
                  </div>
                </li>
                <li>
                  <div>
                    <span class="info-title">APP版本：</span>
                    <span>{{ baseInfo.ScaleAppVersion }}</span>
                  </div>
                </li>
                <li>
                  <div>
                    <span class="info-title">系统版本：</span>
                    <span>{{ baseInfo.ScaleSysVersion }}</span>
                  </div>
                </li>
              </ul>
            </div>
            <div class="base-info-block text-nowrap">
              <ul>
                <li>
                  <div>
                    <span class="info-title">ICCID：</span>
                    <span>{{ baseInfo.Iccid }}</span>
                  </div>
                </li>
                <li>
                  <div>
                    <span class="info-title">发货时间：</span>
                    <span>{{ baseInfo.DeliverOutTime }}</span>
                  </div>
                </li>
                <li>
                  <div>
                    <span class="info-title">添加时间：</span>
                    <span>{{ baseInfo.CreateTime }}</span>
                  </div>
                </li>
                <li>
                  <div>
                    <span class="info-title">收货时间：</span>
                    <span>{{ baseInfo.DeliverInTime }}</span>
                  </div>
                </li>
                <li>
                  <div>
                    <span class="info-title">激活时间：</span>
                    <span>{{ baseInfo.ActiveTime }}</span>
                  </div>
                </li>
                <li>
                  <div>
                    <span class="info-title">称重时间：</span>
                    <span v-if="!isNaN(baseInfo.LastWeightTime)">{{ parseInt(baseInfo.LastWeightTime + '000') | formatDate('YYYY-MM-DD HH:mm:ss') }}</span>
                    <span v-else>--</span>
                  </div>
                </li>
                <li>
                  <div>
                    <span class="info-title">心跳时间：</span>
                    <span v-if="!isNaN(baseInfo.HeartTime)">{{ parseInt(baseInfo.HeartTime + '000') | formatDate('YYYY-MM-DD HH:mm:ss') }}</span>
                    <span v-else>--</span>
                  </div>
                </li>
                <li>
                  <div>
                    <span class="info-title">投放批次：</span>
                    <span>{{ baseInfo.Batch }}</span>
                  </div>
                </li>
              </ul>
            </div>
            <img class="scale-pic" :src="baseInfo.PicUrl" alt="">
          </div>
          <div class="additional-info">
            <div class="info-item">
              <span class="info-title">总称重次数：</span>
              <span>{{ baseInfo.WeightCountSum }}</span>
            </div>
            <div class="info-item">
              <span class="info-title">总导粉：</span>
              <span>{{ baseInfo.FollowCountSum }}</span>
            </div>
            <div class="info-item">
              <span class="info-title">日均称重次数：</span>
              <span>{{ baseInfo.DayAvgWeightCount }}</span>
            </div>
            <div class="info-item">
              <span class="info-title">日均导粉数：</span>
              <span>{{ baseInfo.DayAvgFollowCount }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="content">
        <h6 class="content-title">运营数据</h6>
        <div class="filter-wrapper">
          <div class="filter-container">
            <time-selector
              class="d-inline-block mr-3"
              :disabled="isListLoading || isChartLoading"
              :date-type.sync="dateType"
              :date-range.sync="dateRange"
              :show-date-type="false"
              :show-compare="false"
              :show-granularity="false">
            </time-selector>
            <div class="filter-item">
              <label>指标：</label>
              <indicator-pop
                :disabled="isChartLoading"
                v-model="chartIndicators"
                :indicator-group="indicatorGroup"
                :hide-label="true"
                :max="1">
              </indicator-pop>
            </div>
          </div>
        </div>
        <general-chart v-loading="isChartLoading" :chart-data="chartData" style="height: 350px;"></general-chart>
        <el-table
          ref="table"
          @sort-change="handleTableSortChange"
          :default-sort="{prop: 'Day', order: 'descending'}"
          :data="tableData"
          v-loading="isListLoading"
          :header-cell-class-name="tableHeaderCellClass"
          border
          fit
          highlight-current-row
          style="width: 100%;"
          :max-height="tableMaxHeight">
          <el-table-column
            prop="Day"
            label="日期"
            :sort-orders="['ascending', 'descending']"
            sortable="custom"
            min-width="100">
          </el-table-column>
          <el-table-column
            v-for="item in indicatorsForTable"
            :key="item.name"
            :prop="item.field"
            :label="item.text"
            :sort-orders="['ascending', 'descending']"
            sortable="custom">
            <template slot-scope="scope">
              <span>{{ scope.row[item.name + 'Text'] }}</span>
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
      <div class="content">
        <div class="d-flex">
          <div class="half-content">
            <h6 class="content-title">离线日志</h6>
            <div class="table-wrapper">
              <el-table
                :data="onlineLogList"
                v-loading="isOnlineLogListLoading"
                :header-cell-class-name="tableHeaderCellClass"
                stripe
                border
                fit
                highlight-current-row
                style="width: 100%;">
                <el-table-column
                  prop="Id"
                  label="日志ID"
                  min-width="100">
                </el-table-column>
                <el-table-column
                  prop="CreateTime"
                  label="离线开始时间">
                </el-table-column>
                <el-table-column
                  prop="EndTime"
                  label="离线结束时间">
                </el-table-column>
                <el-table-column
                  prop="OfflineTime"
                  label="离线时长">
                </el-table-column>
              </el-table>
              <div v-show="!isOnlineLogListLoading" class="text-center py-3">
                <el-pagination
                  @current-change="handleOnlineLogCurrentChange"
                  @size-change="handleOnlineLogPageSizeChange"
                  :current-page.sync="onlineLogCurrentPage"
                  :page-sizes="onlineLogPageSizeOption"
                  :page-size="onlineLogPageSize"
                  small
                  layout="total, prev, pager, next, jumper"
                  :total="onlineLogTotal"
                  background>
                </el-pagination>
              </div>
            </div>
          </div>
          <div class="half-content">
            <h6 class="content-title">归属变更日志</h6>
            <div class="table-wrapper">
              <el-table
                :data="changeLogList"
                v-loading="isChangeLogListLoading"
                :header-cell-class-name="tableHeaderCellClass"
                stripe
                border
                fit
                highlight-current-row
                style="width: 100%;">
                <el-table-column
                  prop="Id"
                  label="日志ID"
                  min-width="100">
                </el-table-column>
                <el-table-column
                  prop="TypeName"
                  label="变量类型">
                </el-table-column>
                <el-table-column
                  prop="UpdateName"
                  label="变更记录">
                </el-table-column>
                <el-table-column
                  prop="CreateTime"
                  label="变更时间">
                </el-table-column>
              </el-table>
              <div v-show="!isChangeLogListLoading" class="text-center py-3">
                <el-pagination
                  @current-change="handleChangeLogCurrentChange"
                  @size-change="handleChangeLogPageSizeChange"
                  :current-page.sync="changeLogCurrentPage"
                  :page-sizes="changeLogPageSizeOption"
                  :page-size="changeLogPageSize"
                  small
                  layout="total, prev, pager, next, jumper"
                  :total="changeLogTotal"
                  background>
                </el-pagination>
              </div>
            </div>
          </div>
        </div>
        <div class="d-flex">
          <div class="half-content">
            <h6 class="content-title">导粉广告</h6>
            <div class="table-wrapper">
              <el-table
                :data="followAdvList"
                v-loading="isFollowAdvListLoading"
                :header-cell-class-name="tableHeaderCellClass"
                stripe
                border
                fit
                highlight-current-row
                style="width: 100%;">
                <el-table-column
                  prop="_id"
                  label="广告ID"
                  min-width="100">
                </el-table-column>
                <el-table-column
                  prop="Name"
                  label="广告名称"
                  min-width="200">
                </el-table-column>
              </el-table>
            </div>
          </div>
          <div class="half-content">
            <h6 class="content-title">屏幕广告</h6>
            <div class="table-wrapper">
              <el-table
                :data="screenAdvList"
                v-loading="isScreenAdvListLoading"
                :header-cell-class-name="tableHeaderCellClass"
                stripe
                border
                fit
                highlight-current-row
                style="width: 100%;">
                <el-table-column
                  prop="_id"
                  label="广告ID"
                  min-width="100">
                </el-table-column>
                <el-table-column
                  prop="Name"
                  label="广告名称"
                  min-width="200">
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-button @click="back" class="btn-back" type="primary" title="返回" icon="el-icon-back" circle></el-button>
  </div>
</template>

<script>
import TimeSelector from '@/components/report/time-selector'
import IndicatorPop from '@/components/report/indicator-pop'
import GeneralChart from '@/components/report/general-chart'
import moment from 'moment'
import * as ScaleAnalysisApi from '@/api/report/scale-analysis'
import * as ScaleDetailApi from '@/api/report/scale-detail'
import swal from 'sweetalert2'
import { deepClone, toPercent, formatNumber } from '@/utils'

export default {
  name: 'scale-detail',
  components: {
    TimeSelector,
    IndicatorPop,
    GeneralChart
  },
  data () {
    const indicatorGroup = [
      {
        groupName: '设备指标',
        indicators: [
          {
          //   name: 'OnlineCountRateSum',
          //   text: '设备在线率',
          //   yAxisIndex: 2,
          //   unit: '%'
          // }, {
            name: 'OnlineCountSum',
            text: '在线状态',
            yAxisIndex: 5
          // }, {
          //   name: 'OperateCountSum',
          //   text: '上线运营设备数',
          //   yAxisIndex: 0
          }
        ]
      }, {
        groupName: '基础指标',
        indicators: [
          {
            name: 'WeightCountSum',
            text: '称重数',
            yAxisIndex: 0
          }, {
            name: 'ScanCountSum',
            text: '屏幕扫码数',
            yAxisIndex: 0
          }, {
            name: 'GzhScanCountSum',
            text: 'H5扫码数',
            yAxisIndex: 0
          }, {
            name: 'FollowCountSum',
            text: '导粉数',
            yAxisIndex: 0
          }, {
            name: 'XcxScanCountSum',
            text: 'H5扫码数（小程序）',
            yAxisIndex: 0
          }
        ]
      }, {
        groupName: '转化指标',
        indicators: [
          {
            name: 'ScanCountRateSum',
            text: '屏幕扫码率',
            yAxisIndex: 2,
            unit: '%'
          }, {
            name: 'GzhScanCountRateSum',
            text: 'H5扫码转化率',
            yAxisIndex: 2,
            unit: '%'
          }, {
            name: 'FollowCountRateSum',
            text: '导粉率',
            yAxisIndex: 2,
            unit: '%'
          }, {
            name: 'XcxScanCountRateSum',
            text: '导粉率（小程序）',
            yAxisIndex: 2,
            unit: '%'
          }
        ]
      }, {
        groupName: '设备质量指标',
        indicators: [
          {
            name: 'AvgWeightCountSum',
            text: '设备日均称重次数',
            yAxisIndex: 1
          }, {
            name: 'AvgFollowCountSum',
            text: '设备日均导粉数',
            yAxisIndex: 1
          }
        ]
      }
    ]

    const indicatorsForTable = [
      {
        name: 'WeightCountSum',
        text: '称重数',
        field: 'WeightCountSum'
      }, {
        name: 'ScanCountSum',
        text: '屏幕扫码数',
        field: 'ScanCountSum'
      }, {
        name: 'ScanCountRate',
        text: '屏幕扫码率',
        unit: '%',
        field: 'ScanCountRateSum'
      }, {
        name: 'GzhScanCountSum',
        text: 'H5扫码数',
        field: 'GzhScanCountSum'
      }, {
        name: 'GzhScanCountRate',
        text: 'H5扫码转化率',
        unit: '%',
        field: 'GzhScanCountRateSum'
      }, {
        name: 'FollowCountSum',
        text: '导粉数',
        field: 'FollowCountSum'
      }, {
        name: 'H5FollowRateSum',
        text: 'H5扫码关注转化率',
        unit: '%',
        field: 'H5FollowRateSum'
      }, {
        name: 'CancelFollowRate',
        text: '取关率',
        unit: '%',
        field: 'CancelFollowRateSum'
      }, {
        name: 'WeightCountRate',
        text: '导粉率',
        unit: '%',
        field: 'FollowCountRateSum'
      }, {
        name: 'XcxScanCountSum',
        text: 'H5扫码数（小程序）',
        field: 'XcxScanCountSum'
      }, {
        name: 'XcxScanCountRate',
        text: '导粉率（小程序）',
        unit: '%',
        field: 'XcxScanCountRateSum'
      }
    ]
    const indicatorMap = new Map([].concat(...indicatorGroup.map(item => item.indicators)).map(item => [item.name, item]))
    const indicatorMapForTable = new Map(indicatorsForTable.map(item => [item.name, item]))
    const chartIndicators = [indicatorMap.get('FollowCountSum')]

    const endDate = moment().format('YYYY-MM-DD')
    const startDate = moment(endDate).subtract(29, 'days').format('YYYY-MM-DD')
    const dateRange = [startDate, endDate]

    return {
      dateType: null,
      // 日期范围，今天/昨天传两个日期相同的数组
      dateRange: dateRange,
      // 设备编号
      scaleNo: null,
      // 分组的指标列表对象
      indicatorGroup: indicatorGroup,
      // 指标key与指标对象Map
      indicatorMap: indicatorMap,
      // 表格可展示指标
      indicatorsForTable: indicatorsForTable,
      // 表格可展示指标的Map
      indicatorMapForTable: indicatorMapForTable,
      // 图形展示指标
      chartIndicators: chartIndicators,

      // 基本信息加载状态
      isBaseInfoLoading: false,
      // 导粉广告加载状态
      isFollowAdvListLoading: false,
      // 屏幕广告加载状态
      isScreenAdvListLoading: false,
      // 归属变更日志加载状态
      isChangeLogListLoading: false,
      // 离线日志加载状态
      isOnlineLogListLoading: false,
      // 图形数据加载状态
      isChartLoading: false,
      // 表格数据加载状态
      isListLoading: false,

      // 基本信息
      baseInfo: {},
      // 导粉广告数据
      followAdvList: [],
      // 屏幕广告数据
      screenAdvList: [],
      // 归属变更日志数据
      changeLogList: [],
      // 归属变更日志当前页
      changeLogCurrentPage: 1,
      // 归属变更日志一页条数可选项
      changeLogPageSizeOption: [10, 20, 30],
      // 归属变更日志一页条数
      changeLogPageSize: 10,
      // 归属变更日志总条数
      changeLogTotal: 0,
      // 离线日志数据
      onlineLogList: [],
      // 离线日志当前页
      onlineLogCurrentPage: 1,
      // 离线日志一页条数可选项
      onlineLogPageSizeOption: [10, 20, 30],
      // 离线日志一页条数
      onlineLogPageSize: 10,
      // 离线日志总条数
      onlineLogTotal: 0,
      // 运营表格原始数据
      rawListData: [],
      // 运营表格当前页
      tableCurrentPage: 1,
      // 运营表格一页条数可选项
      tablePageSizeOption: [20, 30, 50, 100],
      // 运营表格一页条数
      tablePageSize: 50,
      // 运营总条数
      tableTotalSize: 0,
      // 运营表格当前排序字段
      sortBy: 'Day',
      // 运营表格当前排序方向
      order: 'descending',
      // 图形原始数据
      rawChartData: [],

      // 路由参数
      routeQuery: {
        scaleno: null
      }
    }
  },
  computed: {
    tableMaxHeight () {
      return Math.max(this.$store.getters.containerHeight - 64, 300)
    },
    // 图形数据
    chartData () {
      const indicator = this.chartIndicators[0]
      return {
        // 横轴类目
        xAxis: {
          data: this.rawChartData.map(item => {
            return item.DateFormat || '--'
          })
        },
        // tooltip标题
        categoryTooltip: this.rawChartData.map(item => {
          return item.DateFormat || '--'
        }),
        // 数据
        series: [
          {
            name: indicator.text,
            data: this.rawChartData.map(item => {
              if (indicator.name === 'OnlineCountSum') {
                return parseFloat(item.Count) === 1 ? '在线' : '离线'
              } else if (indicator.unit === '%') {
                return parseFloat(item.Count) * 100
              } else {
                return parseFloat(item.Count)
              }
            }),
            type: 'line',
            symbolSize: 6,
            smooth: false,
            areaStyle: {},
            yAxisData: ['离线', '在线'],
            yAxisIndex: indicator.yAxisIndex
          }
        ]
      }
    },
    // 表格数据
    tableData () {
      return this.generateTableData(this.rawListData)
    }
  },
  watch: {
    dateRange: {
      handler: function (val, oldVal) {
        this.tableCurrentPage = 1
        this.tableTotalSize = 0
        this.fetchList()
        this.fetchChartData()
      },
      deep: false
    },
    chartIndicators: {
      handler: function (val, oldVal) {
        this.fetchChartData()
      },
      deep: true
    },
    $route (val, oldVal) {
      if (val.path === '/scale-detail') {
        const routeQuery = this.$route.query
        if (routeQuery.scaleno) {
          if (parseInt(this.routeQuery.scaleno) !== parseInt(routeQuery.scaleno)) {
            this.setQueryFormByRouteQuery(routeQuery)
            this.fetchData()
          }
        } else {
          swal({
            text: '参数错误',
            type: 'error',
            timer: 2000,
            showConfirmButton: false
          })
          this.$store.dispatch('delVisitedViews', this.$route).then(() => {
            this.$router.back()
          })
        }
      }
    }
  },
  created () {
    const routeQuery = this.$route.query
    if (!routeQuery.scaleno) {
      swal({
        text: '参数错误',
        type: 'error',
        timer: 2000,
        showConfirmButton: false
      })
      this.$store.dispatch('delVisitedViews', this.$route).then(() => {
        this.$router.back()
      })
      return
    }
    this.setQueryFormByRouteQuery(routeQuery)
    this.fetchData()
  },
  mounted () {

  },
  methods: {
    setQueryFormByRouteQuery (routeQuery) {
      this.scaleNo = this.routeQuery.scaleno = routeQuery.scaleno
    },
    generateTableData (rawListData) {
      const tableData = []
      rawListData.forEach(item => {
        const data = deepClone(item)
        Object.keys(data).forEach(name => {
          if (this.indicatorMapForTable.has(name)) {
            const unit = this.indicatorMapForTable.get(name).unit
            if (unit) {
              if (unit === '%') {
                data[name + 'Text'] = toPercent(data[name])
              } else {
                data[name + 'Text'] = data[name] + unit
              }
            } else {
              data[name + 'Text'] = formatNumber(data[name])
            }
          }
        })
        tableData.push(data)
      })
      return tableData
    },
    fetchData () {
      this.tableCurrentPage = 1
      this.tableTotalSize = 0
      this.changeLogCurrentPage = 1
      this.changeLogTotal = 0
      this.onlineLogCurrentPage = 1
      this.onlineLogTotal = 0
      this.getInfoByScaleNo()
      this.fetchList()
      this.fetchChartData()
      this.getWeChatAdvListByScaleNo()
      this.getAdvListByScaleNo()
      this.getChangeLogListByScaleNo()
      this.getOnlineLogListByScaleNo()
    },
    // 查询运营数据列表
    fetchList () {
      this.isListLoading = true
      this.rawListData = []

      const postData = {
        FieldTarget: this.sortBy,
        StartDate: this.dateRange[0],
        EndDate: this.dateRange[1],
        Group: 'Day',
        ScaleNo: this.scaleNo,
        Page: this.tableCurrentPage,
        Limit: this.tablePageSize
      }
      this.order && (postData.Sort = this.order === 'ascending' ? 'asc' : 'desc')

      ScaleAnalysisApi.getScaleAnalysis(postData).then(({ data }) => {
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
        this.tableTotalSize = data.Result.Count
      }).catch(() => {
        this.isListLoading = false
      })
    },
    tableHeaderCellClass ({ row, column, rowIndex, columnIndex }) {
      return 'font-weight-bold text-dark'
    },
    handleTableSortChange ({ column, prop, order }) {
      if (this.sortBy === prop && this.order === order) return
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
    // 获取图形数据
    fetchChartData () {
      this.isChartLoading = true
      this.rawChartData = []

      const postData = {
        FieldTarget: this.chartIndicators[0].name,
        ScaleNo: this.scaleNo,
        StartDate: this.dateRange[0],
        EndDate: this.dateRange[1]
      }

      ScaleAnalysisApi.getDayScaleAnalysisEcharts(postData).then(({ data }) => {
        this.isChartLoading = false
        if (data.Status !== 200) {
          swal({
            text: data.Result.ErrorMsg,
            type: 'error',
            timer: 2000,
            showConfirmButton: false
          })
          return
        }
        this.rawChartData = data.Result
      }).catch(() => {
        this.isChartLoading = false
      })
    },
    // 获取基本信息数据
    getInfoByScaleNo () {
      this.isBaseInfoLoading = true
      this.baseInfo = {}
      const postData = {
        ScaleNo: this.scaleNo
      }
      ScaleDetailApi.getInfoByScaleNo(postData).then(({ data }) => {
        this.isBaseInfoLoading = false
        if (data.Status !== 200) {
          swal({
            text: data.Result.ErrorMsg,
            type: 'error',
            timer: 2000,
            showConfirmButton: false
          })
          return
        }
        this.baseInfo = data.Result
      }).catch(() => {
        this.isBaseInfoLoading = false
      })
    },
    // 获取导粉广告数据
    getWeChatAdvListByScaleNo () {
      this.isFollowAdvListLoading = true
      this.followAdvList = []
      const postData = {
        ScaleNo: this.scaleNo
      }
      ScaleDetailApi.getWeChatAdvListByScaleNo(postData).then(({ data }) => {
        this.isFollowAdvListLoading = false
        if (data.Status !== 200) {
          swal({
            text: data.Result.ErrorMsg,
            type: 'error',
            timer: 2000,
            showConfirmButton: false
          })
          return
        }
        this.followAdvList = data.Result instanceof Array ? data.Result : []
      }).catch(() => {
        this.isFollowAdvListLoading = false
      })
    },
    // 获取屏幕广告数据
    getAdvListByScaleNo () {
      this.isScreenAdvListLoading = true
      this.screenAdvList = []
      const postData = {
        ScaleNo: this.scaleNo
      }
      ScaleDetailApi.getAdvListByScaleNo(postData).then(({ data }) => {
        this.isScreenAdvListLoading = false
        if (data.Status !== 200) {
          swal({
            text: data.Result.ErrorMsg,
            type: 'error',
            timer: 2000,
            showConfirmButton: false
          })
          return
        }
        this.screenAdvList = data.Result instanceof Array ? data.Result : []
      }).catch(() => {
        this.isScreenAdvListLoading = false
      })
    },
    // 获取归属变更日志数据
    getChangeLogListByScaleNo () {
      this.isChangeLogListLoading = true
      this.changeLogList = []
      const postData = {
        ScaleNo: this.scaleNo,
        Page: this.changeLogCurrentPage,
        Limit: this.changeLogPageSize
      }
      ScaleDetailApi.getChangeLogListByScaleNo(postData).then(({ data }) => {
        this.isChangeLogListLoading = false
        if (data.Status !== 200) {
          swal({
            text: data.Result.ErrorMsg,
            type: 'error',
            timer: 2000,
            showConfirmButton: false
          })
          return
        }
        this.changeLogList = data.Result.List instanceof Array ? data.Result.List : []
        this.changeLogTotal = parseInt(data.Result.Count) || 0
      }).catch(() => {
        this.isChangeLogListLoading = false
      })
    },
    handleChangeLogCurrentChange (value) {
      this.getChangeLogListByScaleNo()
    },
    handleChangeLogPageSizeChange (value) {
      this.changeLogCurrentPage = 1
      this.changeLogPageSize = value
      this.getChangeLogListByScaleNo()
    },
    // 获取离线日志数据
    getOnlineLogListByScaleNo () {
      this.isOnlineLogListLoading = true
      this.onlineLogList = []
      const postData = {
        ScaleNo: this.scaleNo,
        Page: this.onlineLogCurrentPage,
        Limit: this.onlineLogPageSize
      }
      ScaleDetailApi.getOnlineLogListByScaleNo(postData).then(({ data }) => {
        this.isOnlineLogListLoading = false
        if (data.Status !== 200) {
          swal({
            text: data.Result.ErrorMsg,
            type: 'error',
            timer: 2000,
            showConfirmButton: false
          })
          return
        }
        this.onlineLogList = data.Result.List instanceof Array ? data.Result.List : []
        this.onlineLogTotal = parseInt(data.Result.Count) || 0
      }).catch(() => {
        this.isOnlineLogListLoading = false
      })
    },
    handleOnlineLogCurrentChange (value) {
      this.getOnlineLogListByScaleNo()
    },
    handleOnlineLogPageSizeChange (value) {
      this.onlineLogCurrentPage = 1
      this.onlineLogPageSize = value
      this.getOnlineLogListByScaleNo()
    },
    back () {
      this.$router.push('/scale-analysis')
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
  overflow: hidden;
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
  .filter-wrapper {
    padding: 0 20px;
  }
  .content-wrapper {
    padding: 20px;
    .content {
      border: 1px solid #e1e3e4;
      background-color: #fff;
      &:not(:first-child) {
        margin-top: 18px;
      }
      .content-title {
        margin-bottom: 0;
        padding: 20px 20px 10px;
        font-size: 14px;
        font-weight: bold;
      }
    }
  }
}
.base-info-wrapper {
  padding: 0 20px 20px;
  .base-info-block {
    margin-right: 20px;
    word-break: break-word;
    ul {
      margin-bottom: 0;
    }
  }
  .additional-info {
    margin-top: 10px;
    .info-item {
      display: inline-block;
      margin-right: 20px;
    }
  }
  .info-title {
    color: #5d5d61;
  }
  .scale-pic {
    display: block;
    width: 300px;
    height: 170px;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  }
}
.half-content {
  flex-grow: 1;
  flex-shrink: 0;
  width: 50%;
  margin-bottom: 20px;
  .table-wrapper {
    padding: 0 20px;
  }
}
.btn-back {
  position: absolute;
  top: 8px;
  left: 8px;
  opacity: 0.6;
  &:hover {
    opacity: 1;
  }
}
</style>
