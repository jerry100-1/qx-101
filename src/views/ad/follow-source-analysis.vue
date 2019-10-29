<template>
    <div class="main">
        <div ref="queryContent" v-sticky="{zIndex: 2001, stickyTop: 0, disabled: false}">
            <div class="header-wrapper">
                <div class="mb-3">
                    <h6 class="d-inline-block mb-0 mr-2 font-weight-bold">导粉广告粉丝来源分析</h6>
                </div>
                <div class="d-flex justify-content-between">
                    <div class="filter-wrapper mr-2">
                        <div class="filter-container">
                            <div class="filter-item mr-3">
                                <label>导粉号：</label>
                                <el-input
                                        :readonly="true"
                                        style="width: 300px;"
                                        @focus="advDialogVisible = true"
                                        :disabled="isListLoading || isSummaryLoading || isExcelExporting"
                                        clearable
                                        placeholder="请选择导粉号"
                                        v-model.trim="selectAdvStr">
                                    <el-button
                                            :disabled="isListLoading || isSummaryLoading || isExcelExporting"
                                            @click="advDialogVisible = true"
                                            slot="append"
                                            type="primary"
                                            style="background-color: #409EFF;color: #fff">
                                        选择
                                    </el-button>
                                </el-input>
                            </div>
                            <div class="filter-item mr-3">
                                <time-selector
                                        :disabled="isListLoading || isSummaryLoading || isExcelExporting"
                                        :date-type.sync="dateType"
                                        :date-range.sync="dateRange"
                                        :show-compare="false"
                                        :show-granularity="false">
                                </time-selector>
                            </div>
                            <div class="filter-item mr-3">
                                <div class="filter-container">
                                    <label>分析：</label>
                                    <div class="filter-item mr-2">
                                        <el-radio-group
                                                :disabled="isListLoading || isSummaryLoading || isExcelExporting"
                                                v-model="groupType">
                                            <el-radio-button v-for="item in groupOptions" :key="item.id"
                                                             :label="item.id">{{ item.name }}
                                            </el-radio-button>
                                        </el-radio-group>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="filter-container">
                            <div class="filter-item mr-3">
                                <label>主场景：</label>
                                <tree-transfer
                                        :disabled="isListLoading || isSummaryLoading || isExcelExporting"
                                        v-model="sceneParent"
                                        :source="sceneParentList">
                                </tree-transfer>
                            </div>
                            <div class="filter-item mr-3">
                                <label>子场景：</label>
                                <tree-transfer
                                        :disabled="isListLoading || isSummaryLoading || isExcelExporting"
                                        v-model="sceneChild"
                                        :source="sceneChildList">
                                </tree-transfer>
                            </div>
                            <div class="filter-item mr-3">
                                <label>省份：</label>
                                <tree-transfer
                                        :disabled="isListLoading || isSummaryLoading || isExcelExporting"
                                        v-model="areaParent"
                                        :source="areaParentList">
                                </tree-transfer>
                            </div>
                            <div class="filter-item mr-3">
                                <label>城市：</label>
                                <tree-transfer
                                        :disabled="isListLoading || isSummaryLoading || isExcelExporting"
                                        v-model="areaChild"
                                        :source="areaChildList">
                                </tree-transfer>
                            </div>
                            <div class="filter-item mr-3">
                                <label>合伙人：</label>
                                <tree-transfer
                                        :disabled="isListLoading || isSummaryLoading || isExcelExporting"
                                        v-model="agent"
                                        :source="agentList"
                                        :show-shortcut="true">
                                </tree-transfer>
                            </div>
                        </div>
                    </div>
                    <div class="tools">
                        <div class="filter-item">
                            <el-button :loading="isListLoading || isSummaryLoading" :disabled="isExcelExporting"
                                       @click="query" type="primary" style="width: 100px;" icon="el-icon-search">查询
                            </el-button>
                        </div>
                        <div class="filter-item">
                            <el-button :loading="isExcelExporting" :disabled="isListLoading || isSummaryLoading"
                                       @click="exportExcel" type="primary" style="width: 100px;"
                                       icon="el-icon-download">导出
                            </el-button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="content-wrapper">
            <div class="main-content">
                <el-table
                        ref="table"
                        @sort-change="handleTableSortChange"
                        :data="tableData"
                        v-loading="isListLoading"
                        border
                        fit
                        highlight-current-row
                        style="width: 100%;"
                        :max-height="tableMaxHeight">
                    <el-table-column
                            prop="KeyName"
                            :label="groupStr">
                    </el-table-column>
                    <el-table-column
                            v-for="(item, index) in indicatorsForTable"
                            :key="index"
                            :prop="item.name"
                            :label="item.text">
                        <el-table-column
                                v-for="(child, index) in item.childIndicators"
                                :key="index"
                                :prop="child.name"
                                :label="child.text"
                                :sort-orders="['descending','ascending']"
                                :sortable="child.sortable ? 'custom' : false">
                            <template slot-scope="scope">
                                <span>{{ scope.row[child.name] }}</span>
                            </template>
                        </el-table-column>
                        <template slot-scope="scope">
                            <span>{{ scope.row[item.name] }}</span>
                        </template>
                    </el-table-column>
                </el-table>
                <div v-show="!isListLoading" class="text-center py-3">
                    <el-pagination
                            @current-change="handlePageChange"
                            :current-page.sync="tableCurrentPage"
                            :page-sizes="[10]"
                            :page-size="10"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="tableTotalSize"
                            background>
                    </el-pagination>
                </div>
            </div>
        </div>
        <select-adv-dialog
                :accountIds="selectAdv"
                :visible.sync="advDialogVisible"
                @onSelect="handleChooseAd">
        </select-adv-dialog>
    </div>
</template>

<script>
  import TimeSelector from '@/components/report/time-selector'
  import TreeTransfer from '@/components/report/tree-transfer'
  import VueSticky from 'vue-sticky'
  import moment from 'moment'
  import * as AdApi from '@/api/ad'
  import swal from 'sweetalert2'
  import {deepClone, toPercent, formatNumber} from '@/utils'
  import {mapGetters} from 'vuex'
  import exportExcel from '@/utils/exportExcel'
  import SelectAdvDialog from '@/components/dialog/select-adv-dialog'

  export default {
    name: 'follow-source-analysis',
    components: {
      TimeSelector,
      TreeTransfer,
      SelectAdvDialog
    },
    directives: {
      sticky: VueSticky
    },
    data() {
      const today = moment().format('YYYY-MM-DD')
      const indicatorsForTable = [
        {
          text: '基本指标',
          unit: '%',
          childIndicators: [
            {
              name: 'FollowCountSum',
              text: '导粉数',
              sortable: true
            },
            {
              name: 'UnFollowCountSum',
              text: '取关数',
              sortable: false
            },
            {
              name: 'UnFollowCountRate',
              text: '取关率',
              unit: '%',
              sortable: false
            }
          ]
        },
        {
          text: '导粉占比',
          childIndicators: [
            {
              name: 'TotalCountSum',
              text: '总导粉数',
              sortable: false
            },
            {
              name: 'TotalCountRate',
              text: '当前公众号占比',
              unit: '%',
              sortable: false
            }
          ]
        },
        {
          text: '性别占比',
          childIndicators: [
            {
              name: 'WomanRate',
              text: '女粉占比',
              unit: '%',
              sortable: false
            },
            {
              name: 'ManRate',
              text: '男粉占比',
              unit: '%',
              sortable: false
            },
            {
              name: 'OtherRate',
              text: '性别未知占比',
              unit: '%',
              sortable: false
            }
          ]
        }
      ]
      const tableCurrentPage = 1
      const dateType = 1
      const dateRange = [today, today]
      const selectAdv = []
      const agent = []
      const sceneParent = []
      const sceneChild = []
      const areaParent = []
      const areaChild = []
      const groupType = 'MainScene'
      const groupOptions = [{
        id: 'MainScene',
        name: '主场景'
      }, {
        id: 'SubScene',
        name: '子场景'
      }, {
        id: 'ProvinceId',
        name: '省份'
      }, {
        id: 'CityId',
        name: '城市'
      }, {
        id: 'AgentId',
        name: '合伙人'
      }]
      return {
        advDialogVisible: false,
        selectAdv: selectAdv,
        selectAdvStr: '',
        groupOptions: groupOptions,
        //当前选中维度
        groupType: groupType,
        groupStr: '主场景',
        // 时间 今天：1, 昨天：2, 最近7天：3，最近30天：4
        dateType: dateType,
        // 日期范围，今天/昨天传两个日期相同的数组
        dateRange: dateRange,
        // 已选合伙人
        agent: agent,
        // 已选主场景
        sceneParent: sceneParent,
        // 已选子场景
        sceneChild: sceneChild,
        // 已选省份
        areaParent: areaParent,
        // 已选市
        areaChild: areaChild,
        // 用于过滤以上选项
        filters: {},
        // 指标列表对象
        indicatorsForTable: indicatorsForTable,
        // 图表数据加载状态
        isListLoading: false,
        // 汇总数据加载状态
        isSummaryLoading: false,
        // 导出状态
        isExcelExporting: false,
        // 图表原始数据
        rawListData: [],
        // 表格当前页
        tableCurrentPage: tableCurrentPage,
        tableTotalSize: 0,
        // 表格当前排序字段
        sort: 2,
        // 除表格外内容区域高度
        othersHeight: 0
      }
    },
    computed: {
      tableMaxHeight() {
        return Math.max(this.$store.getters.containerHeight - this.othersHeight, 300)
      },
      // 过滤条件选项原始数据
      ...mapGetters([
        'agentRawData',
        'sceneRawData',
        'areaRawData'
      ]),
      // 合伙人选项数据
      agentList() {
        const agent = this.filters.agent || new Map()
        const size = agent.size
        return this.agentRawData.map(item => {
          return {
            id: item.AgentId,
            label: item.RealName,
            fullLabel: item.RealName,
            disabled: size > 0 && !agent.has(item.AgentId),
            raw: item
          }
        })
      },
      // 主场景选项数据
      sceneParentList() {
        const scene = this.filters.sceneParent || new Map()
        const size = scene.size
        const map = new Map()
        const sceneList = []
        this.sceneRawData.forEach(item => {
          //过滤出主场景
          if (item.ParentId === '0') {
            const obj = {
              id: item.SceneId,
              label: item.Name,
              fullLabel: item.Name,
              raw: item,
              disabled: size > 0 && !scene.has(item.SceneId) && !scene.has(item.ParentId) && !map.has(item.ParentId)
            }
            sceneList.push(obj)
            map.set(item.Id, obj)
          }
        })
        return sceneList
      },
      // 子场景选项数据
      sceneChildList() {
        if (this.sceneParent.length === 0) {
          return []
        }
        const scene = this.filters.sceneChild || new Map()
        const size = scene.size
        const map = new Map()
        const sceneList = []
        this.sceneParent.forEach(parent => {
          this.sceneRawData.forEach(item => {
            //过滤出子场景
            if (item.ParentId === parent.raw.SceneId) {
              const obj = {
                id: item.SceneId,
                label: parent.fullLabel + '-' + item.Name,
                fullLabel: parent.fullLabel + '-' + item.Name,
                raw: item,
                disabled: size > 0 && !scene.has(item.SceneId) && !scene.has(item.ParentId) && !map.has(item.ParentId)
              }
              sceneList.push(obj)
              map.set(item.Id, obj)
            }
          })
        })
        return sceneList
      },
      // 省选项数据
      areaParentList() {
        const area = this.filters.areaParent || new Map()
        const size = area.size
        const map = new Map()
        const areaList = []
        this.areaRawData.forEach(item => {
          //过滤出省
          if (item.Level === '1') {
            const obj = {
              id: item.Id,
              label: item.Name,
              fullLabel: item.Name,
              raw: item,
              disabled: size > 0 && !area.has(item.Id) && !area.has(item.ParentId) && !map.has(item.ParentId)
            }
            areaList.push(obj)
            map.set(item.Id, obj)
          }
        })
        return areaList
      },
      // 市选项数据
      areaChildList() {
        if (this.areaParent.length === 0) {
          return []
        }
        const area = this.filters.areaChild || new Map()
        const size = area.size
        const map = new Map()
        const areaList = []
        this.areaParent.forEach(parent => {
          this.areaRawData.forEach(item => {
            //过滤出市
            if (item.ParentId === parent.raw.Id) {
              const obj = {
                id: item.Id,
                label: parent.fullLabel + '-' + item.Name,
                fullLabel: parent.fullLabel + '-' + item.Name,
                raw: item,
                disabled: size > 0 && !area.has(item.Id) && !area.has(item.ParentId) && !map.has(item.ParentId)
              }
              areaList.push(obj)
              map.set(item.Id, obj)
            }
          })
        })
        return areaList
      },
      tableData() {
        if (this.rawListData.length === 0) return []
        return this.generateTableData(this.rawListData)
      }
    },
    created() {
      this.$store.dispatch('getAllReportFilters')
      // this.fetchData()
    },
    mounted() {

    },
    updated() {
      this.$nextTick(() => {
        const queryContent = this.$refs.queryContent
        const queryContentHeight = queryContent ? Math.round(queryContent.clientHeight) : 0
        this.othersHeight = queryContentHeight + 20 + 64
      })
    },
    methods: {
      generateTableData(list) {
        let indicatorsMap = new Map()
        this.indicatorsForTable.forEach(item => {
          item.childIndicators.forEach(child => {
            indicatorsMap.set(child.name, child)
          })
        })
        const tableData = []
        for (let i = 0; i < list.length; i++) {
          const data = deepClone(list[i])
          Object.keys(data).forEach(key => {
            const indicator = indicatorsMap.get(key)
            if (indicator) {
              if (indicator.unit) {
                if (indicator.unit === '%') {
                  data[key] = toPercent(data[key])
                } else {
                  data[key] = data[key] + indicator.unit
                }
              } else {
                data[key] = formatNumber(data[key])
              }
            }
          })
          tableData.push(data)
        }
        return tableData
      },
      print(e) {
        console.log('hhh---,print:', e)
      },
      handlePageChange() {
        this.fetchData()
      },
      query() {
        this.tableCurrentPage = 1
        this.fetchData()
      },
      fetchData() {
        if (this.selectAdv.length > 0) {
          this.groupOptions.forEach(item => {
            if (item.id === this.groupType) {
              this.groupStr = item.name
            }
          })
          this.getWeChatList()
        } else {
          swal({
            text: '请至少选中一个广告',
            type: 'error',
            timer: 2000,
            showConfirmButton: false
          })
        }
      },
      // 获取表格数据
      getWeChatList() {
        this.isListLoading = true
        this.rawListData = []
        const agentId = this.agent.map(item => item.id).join(',')
        const advId = this.selectAdv.map(item => item.Id).join(',')
        const provinceId = this.areaParent.filter(item => item.raw.Level === '1').map(item => item.id).join(',')
        const cityId = this.areaChild.filter(item => item.raw.Level === '2').map(item => item.id).join(',')
        const mainScene = this.sceneParent.filter(item => item.raw.ParentId === '0').map(item => item.id).join(',')
        const subScene = this.sceneChild.filter(item => item.raw.ParentId !== '0').map(item => item.id).join(',')
        const postData = {
          StartDate: this.dateRange[0],
          EndDate: this.dateRange[1]
        }
        advId && (postData.AdvId = advId)
        agentId && (postData.AgentId = agentId)
        this.groupType && (postData.Group = this.groupType)
        provinceId && (postData.ProvinceId = provinceId)
        cityId && (postData.CityId = cityId)
        mainScene && (postData.MainScene = mainScene)
        subScene && (postData.SubScene = subScene)
        this.tableCurrentPage && (postData.Page = this.tableCurrentPage)
        this.sort && (postData.Sort = this.sort)
        AdApi.getSourceStat(postData).then(({data}) => {
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
      exportExcel() {
        this.isExcelExporting = true
        const fileName = '导粉来源分析_' + moment(this.dateRange[0]).format('YYYYMMDD') + '-' + moment(this.dateRange[1]).format('YYYYMMDD')
        const advId = this.selectAdv.map(item => item.Id).join(',')
        const agentId = this.agent.map(item => item.id).join(',')
        const provinceId = this.areaParent.filter(item => item.raw.Level === '1').map(item => item.id).join(',')
        const cityId = this.areaChild.filter(item => item.raw.Level === '2').map(item => item.id).join(',')
        const mainScene = this.sceneParent.filter(item => item.raw.ParentId === '0').map(item => item.id).join(',')
        const subScene = this.sceneChild.filter(item => item.raw.ParentId !== '0').map(item => item.id).join(',')
        const postData = {
          StartDate: this.dateRange[0],
          EndDate: this.dateRange[1]
        }
        advId && (postData.AdvId = advId)
        agentId && (postData.AgentId = agentId)
        this.groupType && (postData.Group = this.groupType)
        provinceId && (postData.ProvinceId = provinceId)
        cityId && (postData.CityId = cityId)
        mainScene && (postData.MainScene = mainScene)
        subScene && (postData.SubScene = subScene)
        postData.All = '1'
        AdApi.getSourceStat(postData).then(({data}) => {
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
          const exportData = this.generateTableData(rawListData)
          const fields = {
            KeyName: this.groupStr
          }
          let indicatorsMap = new Map()
          this.indicatorsForTable.forEach(item => {
            item.childIndicators.forEach(child => {
              indicatorsMap.set(child.name, child)
            })
          })
          indicatorsMap.forEach((value, key) => {
            fields[key] = value.text
          })
          exportExcel([{sheetName: fileName, data: exportData}], fields, fileName)
          this.isExcelExporting = false
        }).catch(() => {
          this.isExcelExporting = false
        })
      },
      handleTableSortChange({order}) {
        this.tableCurrentPage = 1
        this.sort = order === 'ascending' ? 1 : 2
        if (this.selectAdv.length > 0) {
          this.fetchData()
        }
      },
      handleChooseAd(val) {
        this.print(val)
        this.selectAdv = val
        let name = ''
        this.selectAdv.forEach(item => {
          name += (item.WeChatName += ',')
        })
        this.selectAdvStr = name.substring(0, name.length - 1)
      }
    }
  }
</script>

<style lang="less" scoped>
    .main {
        display: table;
        table-layout: fixed;
        min-width: 1400px;
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

        .header-wrapper {
            padding: 14px 20px 0;
            box-shadow: 0 1px 3px rgba(0, 0, 0, .1);
            background-color: #fff;
        }

        .content-wrapper {
            padding: 20px;

            .main-content {
                border-top: 1px solid #e1e3e4;
                border-left: 1px solid #e1e3e4;
                border-right: 1px solid #e1e3e4;
                background-color: #fff;
            }
        }
    }
</style>
