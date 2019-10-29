<template>
  <div class="accountManagement">
    <div class="accountManagement_content">
      <div class="accountManagement_head">
        <div class="accountManagement_head-item">
          <p>导粉号名称: </p>
          <el-input placeholder="请输入导粉号名称" v-model="inputName" clearable>
          </el-input>
        </div>
        <div class="accountManagement_head-item">
          <span>广告主: </span>
          <!--<tree-transfer
                            v-model="inputQueryForm"
                            :source="listData"
                            :show-shortcut="true">
                    </tree-transfer>-->
          <el-select v-model="inputQueryForm" filterable clearable placeholder="请选择">
            <el-option v-for="item in listData" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="accountManagement_head-item">
          <span>导粉号类型: </span>
          <el-select v-model="importType" placeholder="请选择">
            <el-option v-for="item in optionsType" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="accountManagement_head-item">
          <span>APPID: </span>
          <el-input placeholder="请输入APPID" v-model="APPID" clearable>
          </el-input>
        </div>
        <div class="accountManagement_head-item">
          <span>代授权APPID: </span>
          <el-input placeholder="请输入代授权APPID" v-model="authAppId" clearable>
          </el-input>
        </div>
        <div class="accountManagement_head-item">
          <span>添加时间: </span>
          <el-date-picker value-format="yyyy-MM-dd" v-model="dataTime" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
          </el-date-picker>
        </div>
        <div class="accountManagement_head-item">
          <span>接入方式: </span>
          <el-select v-model="accessMode" placeholder="请选择">
            <el-option v-for="item in optionsMode" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="accountManagement_head-item">
          <span>排序: </span>
          <el-select v-model="sort" placeholder="请选择">
            <el-option v-for="item in sortNum" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="accountManagement_head-item">
          <span>状态: </span>
          <el-select v-model="state" placeholder="请选择">
            <el-option v-for="item in stateNum" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="accountManagement_head-item">
          <span>计费类型: </span>
          <el-select v-model="chargingType" placeholder="请选择计费类型">
            <el-option v-for="item in chargingListTypeNum" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="accountManagement_head-item">
          <span>分组名称: </span>
          <el-select v-model="groupName" placeholder="请选择">
            <el-option v-for="item in groupNameNum" v-if="item.State == '1'" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="accountManagement_btn">
        <div class="accountManagement_btn_left">
          <el-button type="primary" @click="fetchData">查询</el-button>
          <el-button type="info" @click="resetBtn">重置</el-button>
        </div>
        <div class="accountManagement_btn_right">
          <el-button type="warning" @click="exportExcel">导出excel</el-button>
          <el-button type="danger" @click="addNewImport">新增导粉广告</el-button>
        </div>
      </div>
      <div class="accountManagement_content">
        <el-table v-loading="isLoading" :data="tableData" border style="width: 100%">
          <el-table-column prop="Id" label="编号">
          </el-table-column>
          <el-table-column prop="WeChatName" label="导粉号名称" width="90">
          </el-table-column>
          <el-table-column prop="CustomerName" label="广告主">
          </el-table-column>
          <el-table-column label="所属平台">
            <template slot-scope="scope">
              {{ platformMap.get(scope.row.PlatformType) || scope.row.PlatformType }}
            </template>
          </el-table-column>
          <el-table-column prop="GroupName" label="分组名称">
          </el-table-column>
          <el-table-column label="计费类型">
            <template slot-scope="scope">
              {{advTypeFilter(scope.row.AdvType)}}
            </template>
          </el-table-column>
          <el-table-column label="导粉号类型" width="">
            <template slot-scope="scope">
              {{serviceTypeFilter(scope.row.ServiceType)}}
            </template>
          </el-table-column>
          <el-table-column prop="AuthType" label="接入方式">
            <template slot-scope="scope">
              {{authTypeFilter(scope.row.AuthType)}}
            </template>
          </el-table-column>
          <el-table-column label="二维码" width="120">
            <template slot-scope="scope">
              <img :src="scope.row.AdvUrl" alt="" style="width: 100px;height:100px">
            </template>
          </el-table-column>
          <el-table-column label="开始结束时间" width="148">
            <template slot-scope="scope">
              {{scope.row.StartTime}}至{{scope.row.EndTime}}
            </template>
          </el-table-column>
          <el-table-column prop="FollowCount" label="实时数据">
          </el-table-column>
          <el-table-column prop="RealFollowTotal" label="实时关注数">
          </el-table-column>
          <el-table-column prop="TotalFollowCount" label="目标数据">
          </el-table-column>
          <el-table-column prop="Sorted" label="排序">
          </el-table-column>
          <el-table-column prop="CreateTime" label="添加时间" min-width="135">
          </el-table-column>
          <el-table-column prop="Status" label="状态">
            <template slot-scope="scope">
              {{statusFilter(scope.row.Status)}}
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="100">
            <template slot-scope="scope">
              <button class="btnSpan" @click="editAdv(scope.row.Id)">修改</button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-sizes="[20, 30, 50]" :page-size="limitData" layout="total, sizes, prev, pager, next, jumper" :total="tableTotal">
        </el-pagination>
      </div>
    </div>
    <!-- 授权页面 -->
    <div v-if="isAuthorization" class="Authorization">
      <div class="Authorization_wrap">
        <i class="el-icon-close closeBtn" @click="closeBtn"></i>
        <div class="Authorization_wrap_title">新增导粉广告</div>
        <div class="Authorization_wrap_head">导粉号接入方式说明</div>
        <div class="Authorization_wrap_item">
          <div class="Authorization_wrap_item_list">
            <div class="Authorization_wrap_item_list_top">
              <div class="Authorization_wrap_item_list_title">授权-无差别推送</div>
              <p class="txtP"> step1 ： 提供公众号授权链接给广告主 公众号授权网址：
                <span style="color:#336699">{{Authorization}}</span></p>
              <p>step2 ： 广告主使用公众平台绑定的管理员个人微信号扫描，完成授权</p>
              <p>step3 ： 运营后台完成广告配置，并启用</p>
            </div>
            <div class="Authorization_wrap_item_list_btn"><span v-clipboard:success="onCopy" v-clipboard:copy="Authorization">复制授权链接</span></div>
          </div>
          <div class="Authorization_wrap_item_list">
            <div class="Authorization_wrap_item_list_top">
              <div class="Authorization_wrap_item_list_title">代网页授权-精确推送</div>
              <p> step1：准备服务号和订阅号，服务号和订阅号绑定到一个开放平台上</p>
              <p>step2：提供公众号授权链接给广告主</p>
              <p>step3：广告主服务号和订阅号完成授权</p>
              <p>step4：后台完成广告配置</p>
              <p>step5：广告配置中添加“代网页授权同平台服务号appid”，将服务号的APPID加上</p>
              <p>step6：启用导粉即可。</p>
            </div>
            <div class="Authorization_wrap_item_list_btn"><span v-clipboard:success="onCopy" v-clipboard:copy="Authorization">复制授权链接</span></div>
          </div>
          <div class="Authorization_wrap_item_list">
            <div class="Authorization_wrap_item_list_top">
              <div class="Authorization_wrap_item_list_title">未授权-关键词回复推送</div>
              <p> step1：后台添加关键词导粉广告，完成配置并禁用后，系统自动生成带参数的链接</p>
              <p>step2：将链接提供给广告主，并指导在微信公众号后台完成关键词自动回复配置</p>
              <p>step3：导粉号回复关键词8测试是否能正常推送、链接是否错误</p>
              <p>step4：确认无误后，运营后台完善广告配置，并启用。</p>
            </div>
            <div class="Authorization_wrap_item_list_btn"><span @click="PowderGuide('a')">添加关键词导粉广告</span></div>
          </div>
          <div class="Authorization_wrap_item_list">
            <div class="Authorization_wrap_item_list_top">
              <div class="Authorization_wrap_item_list_title">个人号导粉</div>
              <p style="color:#FF0000"> 注：不同公司支持流程可能不一致，现仅与微流完成对接，其他加入需求请与研发人员沟通确认具体接入方法！</p>
            </div>
            <div class="Authorization_wrap_item_list_btn"><span @click="PowderGuide('b')">添加个人号导粉广告</span></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TreeTransfer from '@/components/report/tree-transfer'
import { getCustomerList, getList, groupList, pushList, getAllRegion, getAllPartner, getAllScane, getAllEmployee } from '@/api/powderAdvertising'
import AccountApi from '@/api/Account'
import exportExcel from '@/utils/exportExcel'

export default {
  name: 'advManager',
  mixins: ['mixin'],
  components: {
    TreeTransfer
  },
  computed: {
    listData: function() {
      return this.dataInfo.map(item => {
        return {
          value: item.CustomerId,
          label: item.RealName,
          fullLabel: item.RealName,
          disabled: false,
        }
      })
    },
    PartnerInfoList: function() {
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
          if (item.ParentId == 0) {
            parentId = item.SceneId;
          } else {
            parentId = item.ParentId;
          }
          const child = { id: item.SceneId, label: item.Name, parentId: parentId, fullLabel: parent.fullLabel + '-' + item.Name, disabled: size > 0 && !scene.has(item.SceneId) && !scene.has(item.ParentId) }
          parent.children.push(child)
          map.set(item.SceneId, child)
        } else {
          var parentId = ''
          if (item.ParentId == 0) {
            parentId = item.SceneId;
          } else {
            parentId = item.ParentId;
          }
          const obj = { id: item.SceneId, label: item.Name, parentId: parentId, fullLabel: item.Name, disabled: size > 0 && !scene.has(item.SceneId) && !scene.has(item.ParentId) }
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
          if (item.Level == 2) {
            provinceId = parent.id;
            cityId = item.Id;
          } else if (item.Level == 3) {
            provinceId = parent.provinceId
            cityId = parent.id;
          }
          const child = { id: item.Id, level: item.Level, provinceId: provinceId, cityId: cityId, label: item.Name, fullLabel: parent.fullLabel + '-' + item.Name, disabled: size > 0 && !area.has(item.Id) && !area.has(item.ParentId) && !map.has(item.ParentId) }
          parent.children.push(child)
          map.set(item.Id, child)
        } else {
          const obj = { id: item.Id, level: item.Level, provinceId: item.Id, cityId: item.Id, label: item.Name, fullLabel: item.Name, disabled: size > 0 && !area.has(item.Id) && !area.has(item.ParentId) && !map.has(item.ParentId) }
          areaList.push(obj)
          map.set(item.Id, obj)
        }
      })
      return areaList
    },
    platformMap () {
      return new Map(this.platforms.map(item => [item.key, item.value]))
    }
  },
  data() {
    return {
      isLoading: false,
      // 授权信息
      isAuthorization: false, // 是否显示授权页面
      Authorization: 'http://thirdgx.meite.com/wx/index.php', // 复制链接
      // 新增/修改页数据
      isModify: false,
      PartnerInfo: [], // 合伙人信息
      RegionInfo: [], // 区域信息
      ScaneInfo: [], // 场景信息
      EmployeeInfo: [], // 铺称人员
      platforms: [],

      currentPage: 1, // 当前页码
      limitData: 20, // 分页条数
      tableTotal: 0, // 总条数

      inputName: '', // 导粉号名称
      inputQueryForm: '', // 广告住
      dataInfo: [],
      importType: '',
      newOptionsType: [ // 导粉号类型
        {
          value: '1',
          label: '订阅号'
        }, {
          value: '2',
          label: '服务号'
        }, {
          value: '3',
          label: '个人号'
        }
      ],
      optionsType: [ // 导粉号类型
        {
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
        // }, {
        //   value: '4',
        //   label: '小程序'
        }
      ],
      isSuspend: false, // 是否中断导粉
      suspendNum: 0, // 中断导粉数量
      dataTime: [], // 添加时间
      accessMode: '0', // 接入方式
      optionsMode: [
        {
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
        }
      ],
      sort: '1', // 排序
      sortNum: [
        {
          value: '0',
          label: '按添加时间倒序'
        }, {
          value: '1',
          label: '按排序大到小'
        }, {
          value: '2',
          label: '按排序小到大'
        }
      ],
      state: '1', // 状态
      stateNum: [
        {
          value: '0',
          label: '全部'
        }, {
          value: '1',
          label: '启用'
        }, {
          value: '2',
          label: '禁用'
        }
      ],
      newStateNum: [
        {
          value: '1',
          label: '启用'
        }, {
          value: '0',
          label: '禁用'
        }
      ],
      chargingType: '0', // 计费类型
      chargingListTypeNum: [
        {
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
        }
      ],
      chargingTypeNum: [
        {
          value: '1',
          label: '自由号免费导粉'
        }, {
          value: '2',
          label: '付费导粉'
        }, {
          value: '3',
          label: '合伙人买秤自导粉'
        }
      ],
      APPID: '', // APPID
      authAppId: '', // 代授权APPID
      groupName: '', // 分组名称
      groupNameNum: [
        {
          value: '0',
          label: '全部'
        }, {
          value: '1',
          label: '分组A'
        }, {
          value: '2',
          label: '分组B'
        }
      ],
      tableData: [],
      typeMode: '', // 状态

      correlationPushNum: [],

      // 共享秤端属性筛选 - 导粉筛选条件设置
      // selectOne: '',                          // 删选条件one
    }
  },
  mounted() {
    this.fetchData()
    this.getCustomerList()
    this.groupList()
    this.getAllPartner()
    this.getAllRegion()
    this.getAllScane()
    this.getAllEmployee()
    this.pushList()
    this.getPlatforms()
    const { path, query } = this.$route
    const { refresh, ...otherQuery } = query
    if (refresh) {
      query.refresh = false
      this.$nextTick(() => {
        this.$router.replace({
          path: path,
          query: otherQuery
        })
      })
    }
  },
  activated() {
    const { path, query } = this.$route
    const { refresh, ...otherQuery } = query
    if (refresh) {
      if (refresh === '1') { // 新增后刷新第一页
        this.resetBtn()
        this.sort = '0'
        this.state = '0'
        this.fetchData()
      } else if (refresh === '2') { // 修改后刷新当前页
        this.dataQuery()
      }
      this.getCustomerList()
      this.groupList()
      this.getAllPartner()
      this.getAllRegion()
      this.getAllScane()
      this.getAllEmployee()
      this.pushList()
      this.getPlatforms()
      this.$router.replace({
        path: path,
        query: otherQuery
      })
    }
  },
  methods: {
    // 获取平台列表
    getPlatforms () {
      AccountApi.getInfoByName({ name: 'followAdvPlatform' }).then(({ data }) => {
        if (data.Status === 200) {
          this.platforms = data.Result instanceof Array ? data.Result : []
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
    fetchData() {
      this.currentPage = 1
      this.tableTotal = 0
      this.dataQuery()
    },
    dataQuery() {
      this.isLoading = true
      this.tableData = [];
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
        this.isLoading = false
        this.tableData = data.data.Result.List;
        this.tableTotal = parseInt(data.data.Result.Total)
      }).catch(() => {
        this.isLoading = false
      })
    },
    // 获取广告主
    getCustomerList() {
      getCustomerList({
        limit: 1000
      }).then(data => {
        this.dataInfo = data.data.Result.List
      })
    },
    // 关闭新增弹窗
    closeBtn() {
      this.isAuthorization = false
    },
    // 新增页面，添加导粉类型
    PowderGuide(val) {
      if (val == 'a') {
        this.editAdv(null, '2')
      } else if (val == 'b') {
        this.editAdv(null, '4')
      }
      this.isAuthorization = false
    },
    // 新增页面，复制链接
    onCopy(val) {
      if (val) {
        this.$message({
          message: '复制链接成功！',
          type: 'success'
        });
      }
    },
    // 编辑广告
    editAdv(id, newAccessMode) {
      this.$store.dispatch('delCachedViews', this.$router.match('/editAdv')).then(() => {
        this.$nextTick(() => {
          this.$router.push({
            path: '/editAdv',
            query: {
              id: id,
              newAccessMode: newAccessMode
            }
          })
        })
      })
    },
    // 关联推送规则
    pushList() {
      pushList({
        limit: 1000
      }).then(data => {
        this.correlationPushNum = data.data.Result.List.map(item => {
          return {
            value: item.PushId,
            label: item.PushName,
            state: item.State
          }
        })
      })
    },
    // 获取地区的ID
    getRegionParentId(regin) {
      var provinceId = ''
      var cityId = ''
      this.RegionInfo.forEach(item => {
        if (item.Id == regin.id) {
          if (item.Level == 1) { //省
            provinceId = item.Id;
            cityId = item.Id;
          } else if (item.Level == 2) { //市
            provinceId = item.ParentId
            cityId = item.Id;
          } else { //区
            provinceId = this.getProviceId(item.ParentId)
            cityId = item.ParentId
          }
        }
      })
      regin.provinceId = provinceId;
      regin.cityId = cityId;
      // return regin;
    },

    getProviceId(cityId) {
      var provinceId = '';
      this.RegionInfo.forEach(item => {
        if (item.Id == cityId) {
          provinceId = item.ParentId;
        }
      })
      return provinceId;
    },
    // 获取场景的父场景ID
    getSceneParentId(sceneId) {
      var parentId = ''
      this.ScaneInfo.forEach(item => {
        if (item.SceneId === sceneId) {
          if (item.ParentId == 0) {
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
      this.dataTime = [];
      this.inputQueryForm = ''
      this.accessMode = '0';
      this.sort = '1';
      this.chargingType = '0';
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
    // 导出
    exportExcel() {
      this.getAllList();
    },
    getAllList() {
      getList({
        name: this.inputName,
        customer_id: this.inputQueryForm,
        limit: 5000,
        offset: 0,
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
          item.AdvType = this.advTypeFilter(item.AdvType)
          item.ServiceType = this.serviceTypeFilter(item.ServiceType)
          item.Status = this.authTypeFilter(item.Status)
          item.StartEndTime = item.StartTime + ' - ' + item.EndTime
          item.AuthType = this.statusFilter(item.AuthType)
        })
        let tableDataName = {
          Id: '编号',
          WeChatName: '导粉号名称',
          CustomerName: '广告主',
          GroupName: '分组名称',
          AdvType: '计费类型',
          ServiceType: '导粉号类型',
          AuthType: '接入方式',
          AdvUrl: '二维码',
          StartEndTime: '开始结束时间',
          FollowCount: '实时数据',
          RealFollowTotal: '实时关注数',
          TotalFollowCount: '目标数据',
          Sorted: '排序',
          CreateTime: '添加时间',
          Status: '状态'
        }
        exportExcel([{ sheetName: '导粉广告', data: list }], tableDataName, '导粉广告')
      })
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
        if (data.data.Status == 200) {
          this.PartnerInfo = data.data.Result
        }
      })
    },
    // 获取区域列表信息
    getAllRegion() {
      getAllRegion().then(data => {
        if (data.data.Status == 200) {
          this.RegionInfo = Object.values(data.data.Result).sort((a, b) => a.Level - b.Level || a.Id - b.Id)
        }
      })
    },
    // 获取铺称人员
    getAllEmployee() {
      getAllEmployee().then(data => {
        if (data.data.Status == 200) {
          this.EmployeeInfo = Object.values(data.data.Result).sort((a, b) => a.Level - b.Level || a.EmployeeId - b.EmployeeId)
        }
      })
    },
    // 获取场景
    getAllScane() {
      getAllScane().then(data => {
        if (data.data.Status == 200) {
          this.ScaneInfo = Object.values(data.data.Result).sort((a, b) => a.Level - b.Level || a.ParentId - b.ParentId)
        }
      })
    },
    // 新增导粉广告
    addNewImport() {
      // this.isModify = true;
      this.isAuthorization = true;
    },
    isPositiveIntegerNumber(value) {
      return Number.isInteger(Number(value)) && !/^-?(0\d{1,})?\.\d*$|^-?\d+\.+$|^-?0\d{1,}$/.test(value) && Number(value) > 0
    },
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
      margin-top: 40px;
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
}
</style>
