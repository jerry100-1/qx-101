<template>
    <el-dialog
            :show-close="false"
            :visible.sync="dialogVisible"
            style="padding: 0px"
            width="1000px"
            center>
        <div class="accountManagement">
            <div style="display: flex;justify-content: space-between">
                <h6 class="d-inline-block mb-0 mr-2 font-weight-bold">请选择导粉号</h6>
                <el-button type="warning" @click="selectAdv">确认选择</el-button>
            </div>
            <div class="accountManagement_content">
                <div class="accountManagement_head">
                    <div class="accountManagement_head-item">
                        <p>导粉号名称: </p>
                        <el-input
                                placeholder="请输入导粉号名称"
                                v-model="inputName"
                                clearable>
                        </el-input>
                    </div>
                    <div class="accountManagement_head-item">
                        <span>广告主: </span>
                        <el-select v-model="inputQueryForm" filterable placeholder="请选择">
                            <el-option
                                    v-for="item in listData"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="accountManagement_head-item">
                        <span>状态: </span>
                        <el-select v-model="state" placeholder="请选择">
                            <el-option
                                    v-for="item in stateNum"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="accountManagement_head-item">
                        <span>计费类型: </span>
                        <el-select v-model="chargingType" placeholder="请选择计费类型">
                            <el-option
                                    v-for="item in chargingListTypeNum"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="accountManagement_head-item">
                        <span>分组名称: </span>
                        <el-select v-model="groupName" placeholder="请选择">
                            <el-option
                                    v-for="item in groupNameNum"
                                    v-if="item.State == '1'"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="accountManagement_btn">
                        <div style="margin-left: 47px">
                            <el-button type="primary" @click="dataQuery" style="height: 32px;width: 100px">查询
                            </el-button>
                            <el-button type="info" @click="resetBtn" style="height: 32px;width: 100px">重置</el-button>
                        </div>
                    </div>
                </div>
                <el-table
                        ref="multipleTable"
                        :data="tableData"
                        border
                        style="width: 100%"
                        :row-key="getRowKey"
                        @selection-change="handleSelectionChange">
                    <el-table-column
                            :reserve-selection="true"
                            type="selection"
                            width="38">
                    </el-table-column>
                    <el-table-column
                            width="60"
                            prop="Id"
                            label="编号">
                    </el-table-column>
                    <el-table-column
                            prop="WeChatName"
                            label="导粉号名称">
                    </el-table-column>
                    <el-table-column
                            prop="CustomerName"
                            label="广告主"
                            width="100">
                    </el-table-column>
                    <el-table-column
                            prop="GroupName"
                            label="分组名称"
                            width="100">
                    </el-table-column>
                    <el-table-column
                            label="计费类型"
                            width="150">
                        <template slot-scope="scope">
                            {{advTypeFilter(scope.row.AdvType)}}
                        </template>
                    </el-table-column>
                    <el-table-column
                            label="导粉号类型"
                            width="100">
                        <template slot-scope="scope">
                            {{serviceTypeFilter(scope.row.ServiceType)}}
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="AuthType"
                            label="接入方式"
                            width="100">
                        <template slot-scope="scope">
                            {{authTypeFilter(scope.row.AuthType)}}
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="Sorted"
                            label="排序"
                            width="80">
                    </el-table-column>
                    <el-table-column
                            prop="Status"
                            label="状态"
                            width="70">
                        <template slot-scope="scope">
                            {{statusFilter(scope.row.Status)}}
                        </template>
                    </el-table-column>
                </el-table>
                <div style="margin-top: 20px">
                    <el-pagination
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page.sync="currentPage"
                            :page-sizes="[10]"
                            :page-size="limitData"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="tableTotal">
                    </el-pagination>
                </div>
            </div>
        </div>
    </el-dialog>
</template>
<script>
  import {Select} from 'element-ui'
  import TreeTransfer from '@/components/report/tree-transfer'
  import {
    getCompList,
    getCustomerList,
    getList,
    groupList,
    getAllRegion,
    getAllPartner,
    getAllScane,
    getAllEmployee
  } from '@/api/powderAdvertising'

  export default {
    name: 'select-adv-dialog',
    components: {
      TreeTransfer, Select
    },
    computed: {
      listData: function () {
        return this.dataInfo.map(item => {
          return {
            value: item.CustomerId,
            label: item.RealName,
            fullLabel: item.RealName,
            disabled: false,
          }
        })
      },
      phoneBrandNum: function () {
        return this.phoneBrand.map(item => {
          return {
            id: item.value,
            label: item.label,
            fullLabel: item.label,
            disabled: false,
          }
        })
      },
      PartnerInfoList: function () {
        return this.PartnerInfo.map(item => {
          return {
            id: item.AgentId,
            label: item.RealName,
            fullLabel: item.RealName,
            disabled: false,
          }
        })
      },
      //
      EmployeeInfoList() {
        const employee = new Map()
        const size = employee.size
        return this.EmployeeInfo.map(item => {
          return {
            id: item.EmployeeId,
            label: item.RealName,
            fullLabel: item.RealName,
            disabled: size > 0 && !employee.has(item.EmployeeId),
          }
        })
      },
      // 获取场景
      ScaneInfoList() {
        const scene = new Map()
        const size = scene.size
        const map = new Map()
        const sceneList = []
        this.ScaneInfo.forEach(item => {
          if (map.has(item.ParentId)) {
            const parent = map.get(item.ParentId)
            if (!parent.hasOwnProperty('children')) {
              parent.children = []
            }
            var parentId = ''
            if (item.ParentId === 0) {
              parentId = item.SceneId;
            } else {
              parentId = item.ParentId;
            }
            const child = {
              id: item.SceneId,
              label: item.Name,
              parentId: parentId,
              fullLabel: parent.fullLabel + '-' + item.Name,
              disabled: size > 0 && !scene.has(item.SceneId) && !scene.has(item.ParentId)
            }
            parent.children.push(child)
            map.set(item.SceneId, child)
          } else {
            var parentId = ''
            if (item.ParentId === 0) {
              parentId = item.SceneId;
            } else {
              parentId = item.ParentId;
            }
            const obj = {
              id: item.SceneId,
              label: item.Name,
              parentId: parentId,
              fullLabel: item.Name,
              disabled: size > 0 && !scene.has(item.SceneId) && !scene.has(item.ParentId)
            }
            sceneList.push(obj)
            map.set(item.SceneId, obj)
          }
        })
        return sceneList
      },
      // 获取地区`
      RegionInfoList() {
        const area = new Map()
        const size = area.size
        const map = new Map()
        const areaList = []
        this.RegionInfo.forEach(item => {
          if (map.has(item.ParentId)) {
            const parent = map.get(item.ParentId)
            if (!parent.hasOwnProperty('children')) {
              parent.children = []
            }
            var provinceId = '';
            var cityId = '';
            if (item.Level === 2) {
              provinceId = parent.id;
              cityId = item.Id;
            } else if (item.Level === 3) {
              provinceId = parent.provinceId
              cityId = parent.id;
            }
            const child = {
              id: item.Id,
              level: item.Level,
              provinceId: provinceId,
              cityId: cityId,
              label: item.Name,
              fullLabel: parent.fullLabel + '-' + item.Name,
              disabled: size > 0 && !area.has(item.Id) && !area.has(item.ParentId) && !map.has(item.ParentId)
            }
            parent.children.push(child)
            map.set(item.Id, child)
          } else {
            const obj = {
              id: item.Id,
              level: item.Level,
              provinceId: item.Id,
              cityId: item.Id,
              label: item.Name,
              fullLabel: item.Name,
              disabled: size > 0 && !area.has(item.Id) && !area.has(item.ParentId) && !map.has(item.ParentId)
            }
            areaList.push(obj)
            map.set(item.Id, obj)
          }
        })
        return areaList
      },
    },
    watch: {
      visible(val) {
        this.dialogVisible = val
      },
      dialogVisible(val) {
        if (val) {
          this.dataQuery()
        }
        this.$emit('update:visible', val)
      },
      accountIds(val) {
        this.selectDataList = val
      },
      //路由变化关闭弹窗
      $route() {
        this.dialogVisible = false
      }
    },
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      accountIds: {
        type: Array,
        default: []
      }
    },
    data() {
      return {
        selectDataList: [],
        dialogVisible: false,
        PartnerInfo: [],                        // 合伙人信息
        RegionInfo: [],                         // 区域信息
        ScaneInfo: [],                          // 场景信息
        EmployeeInfo: [],                       // 铺称人员
        currentPage: 1,                         // 当前页码
        limitData: 10,                          // 分页条数
        tableTotal: 0,                          // 总条数
        inputName: '',              // 导粉号名称
        inputQueryForm: [],              // 广告住
        dataInfo: [],
        importType: '',
        newOptionsType: [// 导粉号类型
          {
            value: '1',
            label: '订阅号'
          }, {
            value: '2',
            label: '服务号'
          }, {
            value: '3',
            label: '个人号'
          }],
        optionsType: [{                 // 导粉号类型
          value: '0',
          label: '全部'
        }, {
          value: '1',
          label: '订阅号'
        }, {
          value: '2',
          label: '服务号'
        }, {
          value: '3',
          label: '个人号'
        }],
        dataTime: [],               // 添加时间
        accessMode: '0',             // 接入方式
        optionsMode: [{
          value: '0',
          label: '全部'
        }, {
          value: '1',
          label: '授权-无差别推送'
        }, {
          value: '3',
          label: '代网页授权-精准推送'
        }, {
          value: '2',
          label: '未授权-关键词回复推送'
        }, {
          value: '4',
          label: '个人号导粉'
        }],
        sort: '1',                // 排序
        sortNum: [{
          value: '0',
          label: '按添加时间倒序'
        }, {
          value: '1',
          label: '按排序大到小'
        }, {
          value: '2',
          label: '按排序小到大'
        }],
        state: '1',                      // 状态
        stateNum: [{
          value: '0',
          label: '全部'
        }, {
          value: '1',
          label: '启用'
        }, {
          value: '2',
          label: '禁用'
        }],
        newStateNum: [{
          value: '1',
          label: '启用'
        }, {
          value: '0',
          label: '禁用'
        }],
        chargingType: '0',               // 计费类型
        chargingListTypeNum: [{
          value: '0',
          label: '全部'
        }, {
          value: '1',
          label: '自由号免费导粉'
        }, {
          value: '2',
          label: '付费导粉'
        }, {
          value: '3',
          label: '合伙人买秤自导粉'
        },
        ],
        chargingTypeNum: [{
          value: '1',
          label: '自由号免费导粉'
        }, {
          value: '2',
          label: '付费导粉'
        }, {
          value: '3',
          label: '合伙人买秤自导粉'
        },
        ],
        APPID: '',                  // APPID
        authAppId: '',              // 代授权APPID
        groupName: '',              // 分组名称
        groupNameNum: [{
          value: '0',
          label: '全部'
        }, {
          value: '1',
          label: '分组A'
        }, {
          value: '2',
          label: '分组B'
        }],
        tableData: [],
        userCompany: []
      }
    },
    mounted() {
      this.getCustomerList();
      this.groupList();
      this.dataQuery();
      this.getAllPartner();
      this.getAllRegion();
      this.getAllScane();
      this.getAllEmployee();
      this.getCompList()
    },
    methods: {
      //获取公司列表
      getCompList() {
        getCompList().then(data => {
          if (data.data.Status == 200) {
            this.userCompany = data.data.Result
            this.userCompany.forEach(it => {
              it['id'] = it.CompId
              it['label'] = it.CompName
              it['fullLabel'] = it.CompName
            })
          }
        })
      },
      // 获取分组
      groupList() {
        let params = {
          limit: 100,
          state: 1,
        }
        groupList(params).then(data => {
          this.groupNameNum = data.data.Result.List.map(item => {
            return {
              value: item.AdvGroupId,
              label: item.GroupName,
              State: item.State
            }
          })
        })
      },
      dataQuery() {
        this.offsetData = this.limitData * (this.currentPage - 1);
        getList({
          name: this.inputName,
          customer_id: this.inputQueryForm,
          limit: this.limitData,
          offset: this.offsetData,
          start_date: this.dataTime[0],
          end_date: this.dataTime[1],
          type: this.importType,
          wx_appid: this.APPID,
          auth_appid: this.authAppId,
          auth_type: this.accessMode,
          sort: this.sort,
          status: this.state,
          fee_type: this.chargingType,
          group: this.groupName
        }).then(data => {
          const list = data.data.Result.List;
          list.forEach(item => {
            this.selectDataList.forEach(bean => {
              if (item.Id === bean.Id) {
                item.checked = true
              }
            })
          })
          this.tableData = list
          this.tableTotal = parseInt(data.data.Result.Total)
        })
      },
      // 获取广告主
      getCustomerList() {
        getCustomerList({
          limit: 1000
        }).then(data => {
          this.dataInfo = this.dataInfo.concat(data.data.Result.List)
        })
      },
      // 导粉时段筛选
      addList(item) {
        let addList = {
          'Op': '',
          'Field': 'Period',
          'Val': []
        };
        item.Attr.push(addList)
      },
      delPowderGuideList(item, index) {
        item.Attr.splice(index, 1)
      },
      // 修改val类型
      changValueType(list, val) {
        if (val == 'ActiveTime' || val == 'Scale') {
          list.Val = ''
        } else {
          list.Val = []
        }
        if (val == 'ActiveTime') {
          list.Op = 'gte'
        } else {
          list.Op = 'in'
        }
      },
      repeatSharedList(item) {
        if (item.Attr.length >= 2) {
          return
        }
        let repItem = {
          'Op': '',                 // 在范围
          'Field': '',                // 属性
          'Val': [],                  // 属性值
        };
        item.Attr.push(repItem)
      },
      changeType(item) {
        item.Link = item.Link === 'and' ? 'or' : 'and'
      },
      repeatList(item) {
        if (item.Attr.length >= 2) {
          return
        }
        let repItem = {
          'Op': 'in',                 // 在范围
          'Field': '',                // 属性
          'Val': [],                  // 属性值
        };
        item.Attr.push(repItem)
      },
      //获取地区的ID
      getRegionParentId(regin) {
        var provinceId = ''
        var cityId = ''
        this.RegionInfo.forEach(item => {
          if (item.Id === regin.id) {
            if (item.Level === 1) {  //省
              provinceId = item.Id;
              cityId = item.Id;
            } else if (item.Level === 2) {  //市
              provinceId = item.ParentId
              cityId = item.Id;
            } else {  //区
              provinceId = this.getProviceId(item.ParentId)
              cityId = item.ParentId
            }
          }
        })
        regin.provinceId = provinceId;
        regin.cityId = cityId;
      },
      getProviceId(cityId) {
        var provinceId = '';
        this.RegionInfo.forEach(item => {
          if (item.Id === cityId) {
            provinceId = item.ParentId;
          }
        })
        return provinceId;
      },
      //获取场景的父场景ID
      getSceneParentId(sceneId) {
        var parentId = ''
        this.ScaneInfo.forEach(item => {
          if (item.SceneId === sceneId) {
            if (item.ParentId === 0) {
              parentId = item.SceneId;
            } else {
              parentId = item.ParentId;
            }
          }
        })
        return parentId;
      },
      // 重置
      resetBtn() {
        this.inputName = '';
        this.state = '1'
        this.importType = '';
        this.importType = '';
        this.dataTime = [];
        this.inputQueryForm = []
        this.accessMode = '';
        this.sort = '';
        this.chargingType = '';
        this.groupName = '';
        this.APPID = ''
        this.authAppId = ''
      },
      handleSizeChange(val) {
        this.limitData = val
        this.dataQuery()
      },
      handleCurrentChange(val) {
        this.dataQuery()
      },
      advTypeFilter(value) {
        return value === 1 ? '自有号免费导粉' : value === 2 ? '付费导粉' : value === 3 ? '合伙人买秤自导粉' : ''
      },
      serviceTypeFilter(value) {
        return value === 1 ? '订阅号' : value === 2 ? '服务号' : value === 3 ? '个人号' : '小程序'
      },
      authTypeFilter(value) {
        return value === 2 ? '未授权-关键字回复推送' : value === 1 ? '授权-无差别推送' : value === 3 ? '代网页授权-精准推送' : value === 4 ? '个人号导粉' : '全部'
      },
      statusFilter(value) {
        return value === 1 ? '启用' : '禁用'
      },
      // 获取合伙人信息
      getAllPartner() {
        getAllPartner().then(data => {
          if (data.data.Status === 200) {
            this.PartnerInfo = data.data.Result
          }
        })
      },
      // 获取区域列表信息
      getAllRegion() {
        getAllRegion().then(data => {
          if (data.data.Status === 200) {
            this.RegionInfo = Object.values(data.data.Result).sort((a, b) => a.Level - b.Level || a.Id - b.Id)
          }
        })
      },
      // 获取铺称人员
      getAllEmployee() {
        getAllEmployee().then(data => {
          if (data.data.Status === 200) {
            this.EmployeeInfo = Object.values(data.data.Result).sort((a, b) => a.Level - b.Level || a.EmployeeId - b.EmployeeId)
          }
        })
      },
      // 获取场景
      getAllScane() {
        getAllScane().then(data => {
          if (data.data.Status === 200) {
            this.ScaneInfo = Object.values(data.data.Result).sort((a, b) => a.Level - b.Level || a.ParentId - b.ParentId)
          }
        })
      },
      isPositiveIntegerNumber(value) {
        return Number.isInteger(Number(value)) && !/^-?(0\d{1,})?\.\d*$|^-?\d+\.+$|^-?0\d{1,}$/.test(value) && Number(value) > 0
      },
      selectAdv() {
        if (this.selectDataList.length > 0) {
          this.$emit('onSelect', this.selectDataList)
          this.dialogVisible = false
        } else {
          this.$message({
            message: '请至少选择一个公众号',
            type: 'warning'
          });
        }
      },
      handleSelectionChange(val) {
        this.selectDataList = val
        this.selectDataList.forEach(item => {
          item.checked = true
        })
      },
      getRowKey(val) {
        return val.Id
      }
    }
  }

</script>
<style lang="less" scoped>
    .accountManagement {
        .Authorization {
            position: fixed;
            top: 0;
            left: 130px;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, .5);
            z-index: 100;

            .Authorization_wrap {
                width: 56%;
                height: 60%;
                background: #fff;
                box-sizing: border-box;
                padding: 10px;
                display: flex;
                flex-direction: column;
                position: relative;

                .closeBtn {
                    position: absolute;
                    right: 10px;
                    top: 10px;
                    font-size: 20px;
                    cursor: pointer;
                }

                .Authorization_wrap_title {
                    font-size: 20px;
                    font-weight: bold;
                    color: #000;
                }

                .Authorization_wrap_head {
                    display: flex;
                    justify-content: center;
                    padding: 10px 0;
                    box-sizing: border-box;
                    font-size: 18px;
                }

                .Authorization_wrap_item {
                    width: 100%;
                    display: flex;
                    flex-direction: row;

                    .Authorization_wrap_item_list {
                        border: 1px solid #ddd;
                        border-radius: 8px;
                        margin-right: 4px;
                        box-sizing: border-box;
                        padding: 8px;
                        display: flex;
                        flex-direction: column;
                        justify-content: space-between;
                        width: 25%;

                        .Authorization_wrap_item_list_top {
                            display: flex;
                            flex-direction: column;
                            justify-content: space-between;

                            .Authorization_wrap_item_list_title {
                                font-size: 18px;
                                text-align: center;
                                margin-bottom: 20px;
                            }
                        }

                        .Authorization_wrap_item_list_btn {
                            display: flex;
                            flex-direction: row;
                            justify-content: center;
                            margin-top: 20px;

                            span {
                                display: flex;
                                padding: 4px 5px;
                                color: #fff;
                                background: #ff6b01;
                                align-items: center;
                                justify-content: center;
                                border-radius: 4px;
                                cursor: pointer;
                            }
                        }
                    }

                    .Authorization_wrap_item_list:hover {
                        background: rgba(255, 107, 1, .2);
                        border-color: rgb(255, 107, 1);
                    }

                }
            }
        }

        .accountManagement_content {
            margin-top: 10px;
            padding: 10px;
            box-sizing: border-box;
            flex-direction: column;

            .accountManagement_head {
                display: flex;
                flex-direction: row;
                flex-wrap: wrap;
                /*justify-content: space-between;*/

                .accountManagement_head-item {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    margin-bottom: 20px;
                    margin-right: 30px;

                    p {
                        flex-shrink: 0;
                        margin-bottom: 0;
                        margin-right: 4px;
                    }

                    span {
                        flex-shrink: 0;
                        min-width: 3em;
                        margin-right: 4px;
                    }

                    .el-select,
                    .el-input {
                        width: 220px;
                    }
                }
            }

            .accountManagement_btn {
                display: flex;
                justify-content: space-between;
                box-sizing: border-box;

                button {
                    width: 120px;
                    height: 40px;
                }
            }

            .accountManagement_content {
                .btnSpan {
                    cursor: pointer;
                    color: #FF6B01;
                    border: 1px solid #FF6B01;
                    background: #fff;
                    width: 60px;
                    height: 30px;
                    border-radius: 4px;
                }
            }
        }

        .accountManagement_modify {
            display: flex;
            flex-direction: column;
            box-sizing: border-box;
            padding: 10px 40px;

            .accountManagement_modify_item {
                font-size: 18px;
                font-weight: bold;
            }

            .accountManagement_modify_select {
                display: flex;
                flex-direction: column;
                margin-left: 30px;

                .accountManagement_modify_select_head {
                    font-size: 14px;
                    font-weight: bold;
                    padding: 10px 0;
                }

                .accountManagement_modify_select_add {
                    width: 100px;
                    height: 30px;
                    background: #ffb432;
                    color: #fff;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 4px;
                    cursor: pointer;

                    span {
                        margin-right: 4px;
                        font-size: 20px;
                    }
                }

                .accountManagement_modify_select_select {
                    display: flex;
                    flex-direction: row;
                    padding: 10px 0;
                }

                .accountManagement_modify_select_item {
                    box-sizing: border-box;
                    padding: 8px 0;
                    border: 1px solid #efefef;
                    margin-top: 4px;
                    margin-bottom: 10px;
                    display: flex;
                    flex-direction: column;

                    .accountManagement_modify_select_item_add {
                        width: 120px;
                        height: 30px;
                        background: #ffb464;
                        color: #fff;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        border-radius: 4px;
                        cursor: pointer;

                        span {
                            margin-right: 4px;
                            font-size: 20px;
                        }
                    }

                    .accountManagement_modify_select_item_list {
                        display: flex;
                        flex-direction: row;
                        align-items: center;

                        span {
                            color: firebrick;
                            font-size: 30px;
                            margin-left: 10px;
                            cursor: pointer;
                        }

                        div {
                            width: 300px;
                        }

                        div:first-child {
                            margin-right: 20px;
                        }
                    }

                    .accountManagement_modify_select_item_content {
                        display: flex;
                        flex-direction: row;
                        align-items: center;
                        padding: 6px 0;

                        .accountManagement_modify_select_item_content_left {
                            height: 100%;
                            margin-right: 10px;
                            margin-left: 20px;
                            background: #3a8ee6;
                            color: #fff;
                            padding: 6px;
                            box-sizing: border-box;
                            display: flex;
                            cursor: pointer;
                        }

                        .accountManagement_modify_select_item_content_right {
                            display: flex;
                            flex-direction: column;

                            .accountManagement_modify_select_item_content_right_list {
                                display: flex;
                                flex-direction: row;
                                align-items: center;

                                .accountManagement_modify_select_item_content_right_list_weight {
                                    display: flex;
                                    flex-direction: row;
                                    align-items: center;
                                }

                                div {
                                    margin-right: 8px;
                                }

                                span {
                                    color: firebrick;
                                    font-size: 30px;
                                    margin-left: 10px;
                                    cursor: pointer;
                                }
                            }
                        }
                    }
                }
            }

            .accountManagement_footer {
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: center;
                padding: 20px 0;

                div {
                    cursor: pointer;
                    width: 120px;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .accountManagement_footer_left {
                    background: #fe872f;
                    color: #fff;
                    margin-right: 10px;
                }

                .accountManagement_footer_right {
                    background: #fff;
                    color: #666;
                    border: 1px solid #aaa;
                }

                .accountManagement_footer_cancel {
                    background: #fff;
                    color: #666;
                    border: 1px solid #aaa;
                    margin-left: 10px;
                }
            }

            .accountManagement_modify_list {
                display: flex;
                flex-direction: row;
                align-items: center;
                padding: 10px 0;

                &.flexType {
                    align-items: flex-start;
                }

                span {
                    width: 180px;
                    text-align: right;
                    margin-right: 10px;
                }

                .accountManagement_modify_list_right {
                    width: 300px;
                    position: relative;

                    div {
                        width: 100%;
                    }

                    span {
                        position: absolute;
                        right: 0px;
                        top: 5px;
                        color: #666;
                    }

                    .text {
                        display: flex;
                        flex-direction: row;
                        background: #efefef;

                        i {
                            width: 3em;
                        }

                        .explain {
                            p {
                                padding: 0;
                                margin: 0;
                            }
                        }
                    }

                    .accountManagement_modify_list_right_top {
                        display: flex;
                        position: relative;
                        flex-direction: row;

                        input {
                            width: 100px;
                            height: 30px;
                            margin-right: 10px;
                            /*visibility: hidden;*/
                            opacity: 0;
                            position: relative;
                            z-index: 1;
                            cursor: pointer;
                        }

                        i {
                            position: absolute;
                            left: 0;
                            top: 0;
                            background: #fe872f;
                            color: #fff;
                            width: 100px;
                            height: 30px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            cursor: pointer;
                        }
                    }

                    .accountManagement_modify_list_right_bottom {
                        img {
                            width: 100px;
                            height: 100px;
                        }
                    }
                }
            }
        }
    }
</style>
