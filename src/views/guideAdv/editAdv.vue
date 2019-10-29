<template>
  <div class="accountManagement">
    <!-- 修改页 -->
    <div v-loading="isLoading || isSaving" class="accountManagement_modify">
      <!-- 基本信息 -->
      <div class="accountManagement_modify_item">基本信息</div>
      <div class="accountManagement_modify_list">
        <span>导粉号名称：</span>
        <div class="accountManagement_modify_list_right">
          <el-input placeholder="请输入内容" size="small" v-model="newInputName" clearable>
          </el-input>
        </div>
      </div>
      <div class="accountManagement_modify_list">
        <span>广告主：</span>
        <div class="accountManagement_modify_list_right">
          <!--<tree-transfer
                            style="position: relative"
                            v-model="newAdvertisement"
                            :source="listData"
                            :show-shortcut="true">
                    </tree-transfer>-->
          <el-select v-model="newAdvertisement" filterable placeholder="请选择">
            <el-option v-for="item in listData" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="accountManagement_modify_list">
        <span>所属平台：</span>
        <div class="accountManagement_modify_list_right">
          <el-select v-model="PlatformType" filterable placeholder="请选择">
            <el-option v-for="item in platforms" :key="item.key" v-if="item.flag > 0" :label="item.value" :value="item.key">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="accountManagement_modify_list">
        <span>分组名称：</span>
        <div class="accountManagement_modify_list_right">
          <el-select v-model="newGroupName" placeholder="请选择">
            <el-option v-for="item in groupNameNum" v-if=" item.State == '1'" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="accountManagement_modify_list">
        <span>广告计费类型：</span>
        <div class="accountManagement_modify_list_right">
          <el-select v-model="newChargingType" placeholder="请选择计费类型">
            <el-option v-for="item in chargingTypeNum" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="accountManagement_modify_list" v-if="newChargingType != 1">
        <span>付费单价：</span>
        <div class="accountManagement_modify_list_right">
          <el-input placeholder="请输入内容" size="small" v-model="newPaidPrice">
          </el-input>
          <span>(元/粉)</span>
        </div>
      </div>
      <div class="accountManagement_modify_list">
        <span>导粉号类型：</span>
        <div class="accountManagement_modify_list_right">
          <el-select v-model="newImportType" placeholder="请选择" @change="newImportTypeChange">
            <el-option v-for="item in newOptionsType" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="accountManagement_modify_list" v-if="newImportType === '3'">
        <span>是否中断导粉：</span>
        <div class="accountManagement_modify_list_right" style="display: flex;height: 32px;align-items: center">
          <el-switch v-model="isSuspend" style="width: auto;margin-right: 20px" active-color="#13ce66" inactive-color="#ff4949" @change="suspendChange" />
          <el-input type="number" v-model="suspendNum" v-show="isSuspend" />
        </div>
      </div>
      <div class="accountManagement_modify_list flexType">
        <span>导粉号二维码：</span>
        <div class="accountManagement_modify_list_right">
          <div class="accountManagement_modify_list_right_top">
            <input type="file" @change="onUpload($event)" ref="image"><i>替换图片</i>
            <p>图片要求：仅限jpg,jpeg,png格式，最小尺寸100px*100px，大小400KB以内</p>
          </div>
          <div class="accountManagement_modify_list_right_bottom"><img :src="imgUrl" alt=""></div>
        </div>
      </div>
      <div class="accountManagement_modify_list">
        <span>排序：</span>
        <div class="accountManagement_modify_list_right">
          <el-input placeholder="说明：数字越大优先级越高" size="small" v-model="NewSort">
          </el-input>
        </div>
      </div>
      <div class="accountManagement_modify_list">
        <span>状态：</span>
        <div class="accountManagement_modify_list_right">
          <el-select v-model="newState" placeholder="请选择">
            <el-option v-for="item in newStateNum" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div>
      </div>
      <!-- 导粉目标配置 -->
      <div class="accountManagement_modify_item" style="margin-top: 40px;">导粉目标配置</div>
      <div class="accountManagement_modify_list">
        <span>导粉时间：</span>
        <div class="accountManagement_modify_list_right">
          <el-date-picker value-format="yyyy-MM-dd HH:mm:ss" v-model="newDataTime" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']">
          </el-date-picker>
        </div>
      </div>
      <div class="accountManagement_modify_list">
        <span>目标导粉数：</span>
        <div class="accountManagement_modify_list_right">
          <el-input placeholder="请输入导粉目标数" v-model="targetNumber" clearable>
          </el-input>
        </div>
      </div>
      <div class="accountManagement_modify_list">
        <span>实时导粉数：</span>
        <div class="accountManagement_modify_list_right">
          <i>{{realTimeNumber}}</i>
        </div>
      </div>
      <div class="accountManagement_modify_list">
        <span>每日导粉上限：</span>
        <div class="accountManagement_modify_list_right">
          <el-input placeholder="不填表示无上限" v-model="upperLimit" clearable>
          </el-input>
        </div>
        <span>注：到达上限后，今日将不会进行导粉，所以请谨慎处理</span>
      </div>
      <div class="accountManagement_modify_list">
        <span>导粉速度限制：</span>
        <div>
          <el-radio-group v-model="isSpeedLimit">
            <el-radio :label="false">无限制</el-radio>
            <el-radio :label="true">
              限每间隔
              <el-input :disabled="!isSpeedLimit" v-model.trim="SpeedFilter.Time" type="text" style="width: 100px" clearable></el-input>
              分钟导
              <el-input :disabled="!isSpeedLimit" v-model.trim="SpeedFilter.Speed" type="text" style="width: 100px" clearable></el-input>
              个粉
            </el-radio>
          </el-radio-group>
        </div>
      </div>
      <!-- 接入配置 -->
      <div class="accountManagement_modify_item" style="margin-top: 40px;">接入配置</div>
      <div class="accountManagement_modify_list">
        <span>AppId：</span>
        <div class="accountManagement_modify_list_right">
          <i>{{appIdNum}}</i>
        </div>
      </div>
      <div class="accountManagement_modify_list">
        <span>接入方式：</span>
        <div class="accountManagement_modify_list_right">
          <el-select v-model="newAccessMode" placeholder="请选择">
            <el-option v-for="item in newOptionsMode" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div>
      </div>
      <div v-if="newAccessMode == 3">
        <div class="accountManagement_modify_list flexType">
          <span>代网页授权同平台服务号appid：</span>
          <div class="accountManagement_modify_list_right">
            <el-input placeholder="" v-model="webAuthAppId" clearable>
            </el-input>
            <div class="text">
              <i>说明</i>
              <div class="explain">
                <p>1.只获取体重数据的导粉广告填写</p>
                <p>2.所填写的服务号appid必须已授权(该服务号不需导粉的禁用即可)</p>
                <p>3.导粉公众号本身是服务号可以填自己的appid</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="newAccessMode == 2 || newAccessMode == 4 ">
        <div class="accountManagement_modify_list flexType">
          <span>回复关键词提示：</span>
          <div class="accountManagement_modify_list_right">
            <el-input placeholder="非必填，未填写即为默认提示文字" v-model="keyWord" clearable>
            </el-input>
          </div>
        </div>
        <div class="accountManagement_modify_list" v-if="newAccessMode == 2 || newAccessMode == 4">
          <span>关键词导粉回复链接地址：</span>
          <div class="accountManagement_modify_list_right">
            <el-button type="warning" @click="getLinks">获取链接</el-button>
            <span>{{getLinksUrl}}</span>
          </div>
        </div>
        <div class="accountManagement_modify_list flexType" v-if="newAccessMode == 2 || newAccessMode == 4">
          <span>关键词导粉统计链接地址：</span>
          <div class="accountManagement_modify_list_right">
            <div>{{getStatUrl}}</div>
            <div class="text">
              <div class="explain">
                <p>说明：访问即统计数加1，不要随意访问以影响统计</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="accountManagement_modify_list">
        <span>关联推送规则：</span>
        <div class="accountManagement_modify_list_right">
          <el-select v-model="correlationPush" placeholder="请选择">
            <el-option v-for="item in correlationPushNum" v-if="item.state == '1'" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div>
      </div>
      <!-- 导粉筛选条件设置 -->
      <div class="accountManagement_modify_item" style="margin-top: 40px;">导粉筛选条件设置</div>
      <div class="accountManagement_modify_select">
        <!-- 用户端属性筛选 -->
        <div class="accountManagement_modify_select_head">用户端属性筛选</div>
        <div class="accountManagement_modify_select_add" @click="repItem"><span>+</span>筛选条件</div>
        <template v-for="(item,Attr) in Object.keys(UserSide.Attr)">
          <div v-if="Attr > 0" @click="changeWrapSelect(UserSide)" style="height: 100%;
                            margin-right: 10px;
                            width: 30px;
                            background: #ffb412;
                            color: #fff;
                            padding: 6px;
                            box-sizing: border-box;
                            display: flex;
                            cursor: pointer;">{{UserSide.Link == 'and'?'且':'或'}}</div>
          <div class="accountManagement_modify_select_item" v-if="UserSide.Attr.length >= 1">
            <div class="accountManagement_modify_select_item_add" @click="repeatList(UserSide.Attr[item])"><span>+</span>关联筛选条件</div>
            <div class="accountManagement_modify_select_item_content">
              <div class="accountManagement_modify_select_item_content_left" v-if="UserSide.Attr[item].Attr.length > 1" @click="changeType(UserSide.Attr[item])">{{UserSide.Attr[item].Link == 'and'?'且':'或'}}</div>
              <div class="accountManagement_modify_select_item_content_right">
                <div class="accountManagement_modify_select_item_content_right_list" v-for="(list,index) in UserSide.Attr[item].Attr">
                  <el-select v-model="list['Field']">
                    <el-option v-for="item in brandNum" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                  <el-select v-model="list['Op']" v-if="list.Field == 'Weight'">
                    <el-option v-for="item in weightNum" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                  <div class="accountManagement_modify_select_item_content_right_list_weight" v-if="list.Field == 'Weight'">
                    <el-input placeholder="体重数，单位斤" v-model="list['Val'][0]" clearable>
                    </el-input>
                    至
                    <el-input placeholder="体重数，单位斤" v-model="list['Val'][1]" clearable>
                    </el-input>
                  </div>
                  <el-select v-model="list['Op']" v-if="!(list.Field == 'Weight')">
                    <el-option v-for="item in WhetherNum" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                  <tree-transfer placeholder="请选择" v-if="(list.Field == 'Sex')" v-model="list['Val']" :source="userInfo" :show-shortcut="true">
                  </tree-transfer>
                  <tree-transfer placeholder="请选择" v-if="(list.Field == 'Brand')" v-model="list['Val']" :source="phoneBrandNum" :show-shortcut="true">
                  </tree-transfer>
                  <span @click="delList(UserSide.Attr[item],item,index)">-</span>
                </div>
                <div class="accountManagement_modify_select_item_content_right_bottom"></div>
              </div>
            </div>
          </div>
        </template>
        <!-- 共享秤端属性筛选 -->
        <div class="accountManagement_modify_select_head">共享秤端属性筛选</div>
        <div class="accountManagement_modify_select_add" @click="repSharedItem"><span>+</span>筛选条件</div>
        <template v-for="(item,objIndex) in Object.keys(SharedArea.Attr)">
          <div v-if="objIndex > 0" @click="changeWrapSelect(SharedArea)" style="height: 100%;
                            margin-right: 10px;
                            width: 30px;
                            background: #ffb412;
                            color: #fff;
                            padding: 6px;
                            box-sizing: border-box;
                            display: flex;
                            cursor: pointer;">{{SharedArea.Link == 'and'?'且':'或'}}</div>
          <div class="accountManagement_modify_select_item" v-if="SharedArea.Attr.length >= 1">
            <div class="accountManagement_modify_select_item_add" @click="repeatSharedList(SharedArea.Attr[item])"><span>+</span>关联筛选条件</div>
            <div class="accountManagement_modify_select_item_content">
              <div class="accountManagement_modify_select_item_content_left" v-if="SharedArea.Attr[item].Attr.length > 1" @click="
                            changeSharedType(SharedArea.Attr[item])">{{SharedArea.Attr[item].Link == 'and'?'且':'或'}}</div>
              <div class="accountManagement_modify_select_item_content_right">
                <div class="accountManagement_modify_select_item_content_right_list" v-for="(list,index) in SharedArea.Attr[item].Attr">
                  <el-select v-model="list.Field" @change="(value)=>changValueType(list, value)">
                    <el-option v-for="item in selectOneNum" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                  <!-- 激活时间 -->
                  <el-select v-model="list['Op']" v-if="(list.Field == 'ActiveTime')">
                    <el-option v-for="item in selectTwoNum" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                  <el-select v-model="list['Val']" v-if="(list.Field == 'ActiveTime')">
                    <el-option v-for="item in selectThreeNum" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                  <!-- 公司 -->
                  <el-select v-model="list['Op']" v-if="(list.Field == 'Company')">
                    <el-option v-for="item in WhetherNum" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                  <tree-transfer placeholder="请选择" v-if="(list.Field == 'Company')" v-model="list['Val']" :source="userCompany" :show-shortcut="true">
                  </tree-transfer>
                  <!-- 地区 -->
                  <el-select v-model="list['Op']" v-if="(list.Field == 'Region')">
                    <el-option v-for="item in WhetherNum" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                  <tree-transfer placeholder="请选择" v-if="(list.Field == 'Region')" v-model="list['Val']" :source="RegionInfoList" :show-shortcut="true">
                  </tree-transfer>
                  <!-- 场景 -->
                  <el-select v-model="list['Op']" v-if="(list.Field == 'Scene')">
                    <el-option v-for="item in WhetherNum" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                  <tree-transfer placeholder="请选择" v-if="(list.Field == 'Scene')" v-model="list['Val']" :source="ScaneInfoList" :show-shortcut="true">
                  </tree-transfer>
                  <!-- 设备 -->
                  <el-select v-model="list['Op']" v-if="(list.Field == 'Scale')">
                    <el-option v-for="item in WhetherNum" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                  <!-- 合伙人 -->
                  <el-select v-model="list['Op']" v-if="(list.Field == 'Agent')">
                    <el-option v-for="item in WhetherNum" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                  <tree-transfer placeholder="请选择" v-if="(list.Field == 'Agent')" v-model="list['Val']" :source="PartnerInfoList" :show-shortcut="true">
                  </tree-transfer>
                  <!-- 铺称人员 -->
                  <el-select v-model="list['Op']" v-if="(list.Field == 'Employee')">
                    <el-option v-for="item in WhetherNum" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                  <tree-transfer placeholder="请选择" v-if="(list.Field == 'Employee')" v-model="list['Val']" :source="EmployeeInfoList" :show-shortcut="true">
                  </tree-transfer>
                  <el-input v-model="list['Val']" placeholder="输入多个ID，用英文逗号分隔" v-if="(list.Field == 'Scale')"></el-input>
                  <span @click="delSharedList(SharedArea.Attr[item],item,index)">-</span>
                </div>
                <div class="accountManagement_modify_select_item_content_right_bottom"></div>
              </div>
            </div>
          </div>
        </template>
        <!-- 导粉时段筛选 -->
        <div class="accountManagement_modify_select_head">导粉时段筛选</div>
        <!--<template v-for="(item,objIndex) in Object.keys(SharedArea.objList)">-->
        <template v-for="(item,objIndex) in TimeDeleted.Attr">
          <div class="accountManagement_modify_select_add" @click="addList(item)"><span>+</span>筛选条件</div>
          <template v-if="objIndex == 0 && opIndex == 0" v-for="(opItem,opIndex) in item.Attr">
            <div class="accountManagement_modify_select_select">
              <el-radio v-model="opItem.Op" label="in">限以下时段导粉（其余时段不导）</el-radio>
              <el-radio v-model="opItem.Op" label="nin">限以下时段不导粉（其余时段导粉）</el-radio>
            </div>
          </template>
          <div class="accountManagement_modify_select_item">
            <div class="accountManagement_modify_select_item_list" v-for="(childItem, index) in item.Attr">
              <!--<el-time-picker
                                    v-model="childItem.Val[0]"
                                    :picker-options="{
                                        start: '00:00',
                                        step: '01:00',
                                        end: '23:00'
                                      }"
                                    placeholder="选择时间">
                            </el-time-picker>
                            <el-time-picker
                                    v-model="childItem.Val[1]"
                                    :picker-options="{
                                        start: '00:00',
                                        step: '01:00',
                                        end: '23:00'
                                      }"
                                    placeholder="选择时间">
                            </el-time-picker>-->
              <el-time-picker :picker-options="{format:'HH:mm'}" value-format="HH:mm" format="HH:mm" v-model="childItem.Val[0]" placeholder="任意时间点">
              </el-time-picker>
              <el-time-picker :picker-options="{format:'HH:mm'}" value-format="HH:mm" format="HH:mm" v-model="childItem.Val[1]" placeholder="任意时间点">
              </el-time-picker>
              <el-input v-model="childItem.Val[2]" placeholder="导粉上限"></el-input>
              <span @click="delPowderGuideList(item, index)">-</span>
            </div>
          </div>
        </template>
      </div>
      <div class="accountManagement_footer">
        <div class="accountManagement_footer_left" @click="PreservationData">保存</div>
        <div class="accountManagement_footer_right" @click="modifyDetilsReset">重置</div>
        <div class="accountManagement_footer_cancel" @click="cancelEdit">取消</div>
      </div>
    </div>
  </div>
</template>

<script>
import TreeTransfer from '@/components/report/tree-transfer'
import { getCompList, getCustomerList, groupList, getInfo, pushList, updateInfo, getAllRegion, getAllPartner, getAllScane, getAllEmployee, uploadAdvUrl } from '@/api/powderAdvertising'
import AccountApi from '@/api/Account'

export default {
  name: 'editAdv',
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
    phoneBrandNum: function() {
      return this.phoneBrand.map(item => {
        return {
          id: item.value,
          label: item.label,
          fullLabel: item.label,
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
    }
  },
  data() {
    return {
      id : '',
      isLoading: false,
      isSaving: false,
      // 新增/修改页数据
      PartnerInfo: [], // 合伙人信息
      RegionInfo: [], // 区域信息
      ScaneInfo: [], // 场景信息
      EmployeeInfo: [], // 铺称人员
      platforms: [], // 平台列表

      dataInfo: [],
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
      isSuspend: false, // 是否中断导粉
      suspendNum: 0, // 中断导粉数量
      newStateNum: [
        {
          value: '1',
          label: '启用'
        }, {
          value: '0',
          label: '禁用'
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

      // 修改页数据
      newImgUrl: '', // 原二维码
      modifyId: '', // 修改信息传入ID
      newInputName: '', // 修改名称
      newAdvertisement: '', // 广告主
      PlatformType: 'meite', // 平台
      newGroupName: '', // 分组名称
      newChargingType: '', // 广告计费类型
      newImportType: '', // 导粉类型,
      NewSort: '', // 排序
      newState: '', // 状态
      newDataTime: [], // 导粉时间
      dataDetalis: null, // 修改详情数据
      newPaidPrice: '', // 付费单价
      advertisement: [], //
      imgUrl: '',
      imgUrlObject: '', // 传送到后台地址图片
      imgData: {
        accept: 'image/jpg, image/jpeg, image/png',
      },
      targetNumber: '', // 导粉目标数
      realTimeNumber: '', // 实时导粉数
      upperLimit: '', // 每日导粉上限
      isSpeedLimit: false, // 是否限制导粉速度
      SpeedFilter: { // 导粉速度限制
        Time: null, // 时间，单位分钟
        Speed: null // 导粉个数
      },
      appIdNum: '', // AppId
      newAccessMode: '1', // 接入方式
      webAuthAppId: '', // 代网页授权服务号appid
      newOptionsMode: [
        {
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
          label: '微流个人号导粉'
        }
      ],
      keyWord: '', // 关键词回复
      getLinksUrl: '', // 关键字统计地址
      getStatUrl: '', // 关键字回复地址
      isShowUrl: false, // 显示链接地址
      correlationPush: '', // 关联推送规则
      correlationPushNum: [],

      // 用户端属性筛选
      brandNum: [
        {
          value: 'Sex',
          label: '用户性别'
        }, {
          value: 'Weight',
          label: '用户本次称重'
        }, {
          value: 'Brand',
          label: '用户手机系统及品牌型号'
        }
      ],
      weightNum: [
        {
          value: 'in',
          label: '在此范围'
        }, {
          value: 'nin',
          label: '不在此范围'
        }
      ],
      /*
       * 0:未知 1:iphone 101:安卓其他 102:华为 103:oppo 104:vivo 105:三星 106:小米 107:一加 108:美图 109:锤子 110:联想 111:TCL 112:中兴
       * */
      phoneBrand: [ // 手机品牌
        {
          value: '0',
          label: '未知'
        }, {
          value: '1',
          label: 'iphone'
        }, {
          value: '101',
          label: '安卓其他'
        }, {
          value: '102',
          label: '华为'
        }, {
          value: '103',
          label: 'oppo'
        }, {
          value: '104',
          label: 'vivo'
        }, {
          value: '105',
          label: '三星'
        }, {
          value: '106',
          label: '小米'
        }, {
          value: '107',
          label: '一加'
        }, {
          value: '108',
          label: '美图'
        }, {
          value: '109',
          label: '锤子'
        }, {
          value: '110',
          label: '联想'
        }, {
          value: '111',
          label: 'TCL'
        }, {
          value: '112',
          label: '中兴'
        }
      ],
      WhetherNum: [
        {
          value: 'in',
          label: '是'
        }, {
          value: 'nin',
          label: '非'
        }
      ],
      userInfo: [ // 性别
        {
          id: '0',
          label: '未知',
          fullLabel: '未知'
        }, {
          id: '1',
          label: '男',
          fullLabel: '男'
        }, {
          id: '2',
          label: '女',
          fullLabel: '女'
        }
      ],
      // 用户端删选条件集合
      UserSide: {
        Link: 'and', // 区分外部条件的 且 或
        /* objList:{
            '1':
                {
                    idType: 'and',                      // 区分内部选择的且 或
                    list:[{
                        'brand': '',                //
                        'weight': '',               // 选择按体重
                        'weightLower': '',         // 体重下限
                        'weightUpper': '',          // 体重上限
                        'Whether': '',
                        'queryForm': [],
                    }]
                },
        } */
        Attr: [
          /* {
              Link: 'and',                      // 区分内部选择的且 或
              Attr:[/!*{
                  'Op': 'in',                 // 在范围
                  'Field': '',                // 属性
                  'Val': [],                  // 属性值
              }*!/]
          }, */
        ]
      },

      // 共享秤端属性筛选 - 导粉筛选条件设置
      // selectOne: '',                          // 删选条件one
      SharedArea: { // 共享秤端删选条件集合
        Link: 'and', // 区分外部条件的 且 或
        Attr: [
          /* {
              Link: 'and',                      // 区分内部选择的且 或
              Attr:[/!*{
                  'Op': '',                 // 在范围
                  'Field': '',                // 属性
                  'Val': null,                  // 属性值
              }*!/]
          }, */
        ]
      },
      userCompany: [ // 所属公司
        {
          id: '2',
          label: '美特',
          fullLabel: '美特'
        }, {
          id: '3',
          label: '聚鼎',
          fullLabel: '聚鼎'
        }, {
          id: '4',
          label: '测试',
          fullLabel: '测试'
        }, {
          id: '5',
          label: '有点准',
          fullLabel: '有点准'
        }, {
          id: '6',
          label: '亲信',
          fullLabel: '亲信'
        }
      ],
      selectOneNum: [
        {
          value: 'ActiveTime',
          label: '设备激活时间'
        }, {
          value: 'Company',
          label: '设备所属公司'
        }, {
          value: 'Scene',
          label: '设备场景'
        }, {
          value: 'Region',
          label: '设备省市区'
        }, {
          value: 'Agent',
          label: '设备合伙人'
        }, {
          value: 'Employee',
          label: '设备铺称人员'
        }, {
          value: 'Scale',
          label: '设备ID'
        }
      ],
      selectTwoNum: [
        {
          value: 'gte',
          label: '大于等于'
        }, {
          value: 'gt',
          label: '大于'
        }, {
          value: 'lte',
          label: '小于等于'
        }, {
          value: 'lt',
          label: '小于'
        }
      ],
      selectThreeNum: [
        {
          value: '15',
          label: '15天'
        }, {
          value: '10',
          label: '10天'
        }, {
          value: '7',
          label: '7天'
        }
      ],

      // 导粉时段筛选
      TimeDeleted: {
        'Link': 'and',
        'Attr': [{
          'Link': 'ro',
          'Attr': [
            /* {
                                            'Op': '',
                                            'Field': 'Period',
                                            'Val': []
                                        }, */
          ]
        }]
      }
    }
  },
  mounted() {
    const { query: { id, newAccessMode } } = this.$route

    this.getCustomerList();
    this.groupList();
    this.getAllPartner();
    this.getAllRegion();
    this.getAllScane();
    this.getAllEmployee();
    this.pushList();
    this.getCompList()
    this.getPlatforms()
    this.id = id;
    // id && this.getInfo(id)
    newAccessMode && (this.newAccessMode = newAccessMode)


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
    // 获取公司列表
    getCompList() {
      getCompList().then(data => {
        if (data.data.Status == 200) {
          const userCompany = data.data.Result
          userCompany.forEach(it => {
            // id: '2',
            // label: '美特',
            //     fullLabel: '美特'
            it['id'] = it.CompId
            it['label'] = it.CompName
            it['fullLabel'] = it.CompName
          })
          this.userCompany = userCompany
        }
      })
    },
    // 获取链接弹框
    getLinks() {
      /* this.getLinksUrl = this.dataDetalis.ReplyUrl
       this.getStatUrl = this.dataDetalis.StatUrl */
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
    // 获取广告主
    getCustomerList() {
      getCustomerList({
        limit: 1000
      }).then(data => {
        this.dataInfo = data.data.Result.List
      })
    },
    // 导粉时段筛选
    addList(item) {
      let addList = {
        'Op': '',
        'Field': 'Period',
        'Val': []
      };
      // this.$set(item.Attr,Math.max(...Object.keys(item.Attr)) + 1, addList);
      item.Attr.push(addList)
    },
    delPowderGuideList(item, index) {
      /* if(item.Attr.length <= 1){
          return ;
      } */
      item.Attr.splice(index, 1)
    },
    suspendChange() {
      this.suspendNum = 0
    },
    newImportTypeChange() {
      this.isSuspend = false
    },
    changeWrapSelect(UserSide) {
      UserSide.Link = UserSide.Link == 'and' ? 'or' : 'and';
    },
    // 共享称端删选
    delSharedList(objItem, item, index) {
      /* if(index <= 0){
          return
      } */
      objItem.Attr.splice(index, 1);
      if (objItem.Attr.length == 0) {
        this.SharedArea.Attr.splice(item, 1)
      }
    },
    repSharedItem() {
      let repItem = {
        Link: 'and',
        Attr: [{
          'Op': 'in', // 在范围
          'Field': '', // 属性
          'Val': [], // 属性值
        }]
      }
      // this.UserSide.objList[Math.max(...Object.keys(this.UserSide.objList)) + 1] =  repItem
      // this.$set(this.SharedArea.Attr,Math.max(...Object.keys(this.SharedArea.Attr)) + 1,repItem)
      /* let totalNum = 0
      for(let i=0; i<this.SharedArea.Attr.length; i++){
          console.log(this.SharedArea.Attr[i].Attr.length)
          totalNum += this.SharedArea.Attr[i].Attr.length
      }
      console.log(totalNum)
      if(totalNum < 7){
          this.SharedArea.Attr.push(repItem)
      }else{
          return
      } */
      this.SharedArea.Attr.push(repItem)
    },
    changeSharedType(item) {
      item.Link = item.Link == 'and' ? 'or' : 'and';
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
        'Op': '', // 在范围
        'Field': '', // 属性
        'Val': [], // 属性值
      };
      /* let totalNum = 0
      for(let i=0; i<this.SharedArea.Attr.length; i++){
          console.log(this.SharedArea.Attr[i].Attr.length)
          totalNum += this.SharedArea.Attr[i].Attr.length
      }
      console.log(totalNum)
      if(totalNum < 7){
          item.Attr.push(repItem)
      }else{
          return
      } */
      item.Attr.push(repItem)
    },

    // 用户端筛选
    delList(objItem, item, index) {
      /* if(index <= 0){
          return;
      } */
      objItem.Attr.splice(index, 1);
      if (objItem.Attr.length == 0) {
        this.UserSide.Attr.splice(item, 1)
      }
    },
    repItem() {
      let repItem = {
        Link: 'and',
        Attr: [{
          'Op': 'in', // 在范围
          'Field': '', // 属性
          'Val': [], // 属性值
        }]
      }
      // this.UserSide.objList[Math.max(...Object.keys(this.UserSide.objList)) + 1] =  repItem
      // this.$set(this.UserSide.Attr,Math.max(...Object.keys(this.UserSide.Attr)) + 1,repItem)
      // this.UserSide = {...this.UserSide}
      /* let totalNum = 0
      for(let i=0; i<this.UserSide.Attr.length; i++){
          console.log(this.UserSide.Attr[i].Attr.length)
          totalNum += this.UserSide.Attr[i].Attr.length
      }
      console.log(totalNum)
      if(totalNum < 3){
          this.UserSide.Attr.push(repItem)
      }else{
          return
      } */
      this.UserSide.Attr.push(repItem)
    },
    changeType(item) {
      item.Link = item.Link == 'and' ? 'or' : 'and';
    },
    repeatList(item) {
      if (item.Attr.length >= 2) {
        return
      }
      let repItem = {
        'Op': 'in', // 在范围
        'Field': '', // 属性
        'Val': [], // 属性值
      };
      /* let totalNum = 0
      for(let i=0; i<this.UserSide.Attr.length; i++){
          console.log(this.UserSide.Attr[i].Attr.length)
          totalNum += this.UserSide.Attr[i].Attr.length
      }
      console.log(totalNum)
      if(totalNum < 3){
          item.Attr.push(repItem)
      }else{
          return
      } */
      item.Attr.push(repItem)
    },
    // 图片上传
    uploadAdvUrl() {
      var formData = new FormData();
      // 上传图片
      formData.append("adv_url", this.imgUrlObject);
      uploadAdvUrl(formData).then(data => {
        if (data.data.Status == 200) {
          this.imgUrlObject = data.data.Result.AdvUrl
        }
      })
    },
    onUpload(event) {
      const fileObj = this.$refs.image.files[0];
      this.imgUrlObject = fileObj
      const windowURL = window.URL || window.webkitURL;
      if (fileObj) {
        const dataURl = windowURL.createObjectURL(fileObj);
        this.imgUrl = dataURl;
        // this.confirmSubmitEnable()
      }
      this.uploadAdvUrl();
    },
    cancelEdit() {
      const route = this.$route
      this.$router.push({ path: '/advManager' }, () => {
        setTimeout(() => {
          this.$store.dispatch('delVisitedViews', route)
        }, 200)
      })
    },
    // 修改页重置
    modifyDetilsReset() {
      this.newAdvertisement = ''
      this.PlatformType = 'meite'
      this.newGroupName = ''
      this.newInputName = ''
      this.newChargingType = ''
      this.newPaidPrice = ''
      this.newImportType = ''
      this.suspendNum = 0
      this.isSuspend = false
      this.imgUrl = ''
      this.NewSort = ''
      this.newState = ''
      this.newDataTime = []
      this.targetNumber = ''
      this.realTimeNumber = ''
      this.upperLimit = ''
      this.isSpeedLimit = false
      this.SpeedFilter = {
        Time: null,
        Speed: null
      }
      this.appIdNum = ''
      this.newAccessMode = ''
      this.keyWord = ''
      this.webAuthAppId = ''
      this.correlationPush = ''
      // this.TimeDeleted.Attr = []
      this.SharedArea.Attr = []
      this.UserSide.Attr = []
      this.TimeDeleted.Attr.forEach(item => {
        item.Attr = []
      })
      /* this.SharedArea.Attr.forEach(item => {
          item.Attr = []
      })
      this.UserSide.Attr.forEach(item => {
          item.Attr = []
      }) */
    },
    // 保存信息提交
    PreservationData() {
      this.updateInfo()
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
    // 获取列表详情
    getInfo(varV) {
      if (this.isLoading) {
        return;
      }
      this.modifyId = varV
      this.isLoading = true
      let _this = this
      getInfo({
        id: varV
      }).then(data => {
        this.isLoading = false
        if (data.data.Status == 200) {
          this.dataDetalis = data.data.Result
          this.getLinksUrl = this.dataDetalis.ReplyUrl
          this.getStatUrl = this.dataDetalis.StatUrl
          // this.groupNameNum.forEach(item => {
          //     if(item.State == '1' && item.value == this.dataDetalis.Group){
          //         this.newGroupName = this.dataDetalis.Group + ''
          //     }else{
          //         this.newGroupName = ''
          //     }
          // })
          this.newGroupName = this.dataDetalis.Group + ''

          this.newInputName = this.dataDetalis.WeChatName
          this.newChargingType = this.dataDetalis.AdvType + ''
          this.newPaidPrice = this.dataDetalis.Price
          this.newImportType = this.dataDetalis.ServiceType + '';
          this.newImportType === '3' ? this.dataDetalis.PersonalControl > 0 ? this.isSuspend = true : this.isSuspend = false : this.isSuspend = false
          this.suspendNum = this.dataDetalis.PersonalControl
          this.imgUrl = this.dataDetalis.AdvUrl
          this.newImgUrl = this.dataDetalis.AdvUrl
          this.NewSort = this.dataDetalis.Sorted
          this.newState = this.dataDetalis.Status + ''
          /* this.$set(this.newDataTime,  0,  this.dataDetalis.StartTime?this.dataDetalis.StartTime:[]);
          this.$set(this.newDataTime,  1,  this.dataDetalis.EndTime?this.dataDetalis.EndTime:[]); */
          /* this.newDataTime[0] = this.dataDetalis.StartTime?this.dataDetalis.StartTime:''
          this.newDataTime[1] = this.dataDetalis.EndTime?this.dataDetalis.EndTime:'' */
          this.targetNumber = this.dataDetalis.TotalFollowCount
          this.realTimeNumber = this.dataDetalis.FollowCount
          this.upperLimit = this.dataDetalis.DayFollowCount

          if (this.dataDetalis.SpeedFilter && !(this.dataDetalis.SpeedFilter instanceof Array)) {
            this.isSpeedLimit = true
            this.SpeedFilter = {
              Time: Math.round(this.dataDetalis.SpeedFilter.Time / 60),
              Speed: this.dataDetalis.SpeedFilter.Speed
            }
          } else {
            this.isSpeedLimit = false
            this.SpeedFilter = {
              Time: null,
              Speed: null
            }
          }

          this.appIdNum = this.dataDetalis.AppId
          this.newAccessMode = this.dataDetalis.AuthType + ''
          this.keyWord = this.dataDetalis.ReplyKeywords
          this.webAuthAppId = this.dataDetalis.WebAuthAppId
          // this.correlationPushNum.forEach(item => {
          //     if(item.state == '1' && item.value == (this.dataDetalis.correlationPush + '')){
          //         this.correlationPush = this.dataDetalis.PushRule + ''
          //     }else{
          //         this.correlationPush = ''
          //     }
          // })
          this.correlationPush = this.dataDetalis.PushRule + ''
          if (this.dataDetalis.StartTime == '' && this.dataDetalis.EndTime == '') {
            this.newDataTime = []
          } else {
            this.newDataTime = [this.dataDetalis.StartTime, this.dataDetalis.EndTime]
          }
          // 基本信息
          // 广告主
          // this.listData.forEach(item => {
          //   if (item.value == this.dataDetalis.CustomerId) {
          //     this.newAdvertisement = item.value
          //   }
          // })
          this.newAdvertisement = this.dataDetalis.CustomerId ? this.dataDetalis.CustomerId + '' : ''
          this.PlatformType = this.dataDetalis.PlatformType
          // 分组
          /* this.groupNameNum.forEach(item => {
              if(item.value == this.dataDetalis.Group){
                  this.newGroupName = item.value
              }
          }) */

          // 用户筛选属性

          // this.UserSide = this.dataDetalis.UserFilter
          if (!(data.data.Result.UserFilter instanceof Array)) {
            if (data.data.Result.UserFilter.Attr) {
              data.data.Result.UserFilter.Attr.forEach(item => {
                if (item.Attr) {
                  item.Attr.forEach(childItem => {
                    if (childItem.Val) {
                      this.UserSide = this.dataDetalis.UserFilter
                    }
                  })
                }
              })
            }
          }

          // 共享端

          // this.SharedArea = this.dataDetalis.ScaleFilter
          if (!(data.data.Result.ScaleFilter instanceof Array)) {
            if (data.data.Result.ScaleFilter.Attr) {
              data.data.Result.ScaleFilter.Attr.forEach(item => {
                if (item.Attr) {
                  item.Attr.forEach(childItem => {
                    if (childItem.Val) {
                      this.SharedArea = this.dataDetalis.ScaleFilter
                    }
                    // 修复场景
                    if (childItem.Field == 'Scene') {
                      childItem.Val.forEach(sceneItem => {
                        sceneItem.parentId = this.getSceneParentId(sceneItem.id)
                      })
                    }
                    // 修复省市区
                    if (childItem.Field == 'Region') {
                      childItem.Val.forEach(sceneItem => {
                        this.getRegionParentId(sceneItem)
                      })
                    }
                  })
                }
              })
            }
          }

          // 导粉时段筛选
          // this.TimeDeleted = this.dataDetalis.TimeFilter
          if (!(data.data.Result.TimeFilter instanceof Array)) {
            if (data.data.Result.TimeFilter.Attr[0].Attr) {
              data.data.Result.TimeFilter.Attr.forEach(item => {
                item.Attr.forEach(childItem => {
                  if (childItem.Val) {
                    this.TimeDeleted = this.dataDetalis.TimeFilter
                  }
                })
              })
            }
          }
        }
      }).catch(() => {
        this.isLoading = false
      })
    },
    // 获取地区的ID
    getRegionParentId(regin) {
      var provinceId = ''
      var cityId = ''
      console.log('getRegionParentId', regin, this.RegionInfo)
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

          if (this.ScaneInfo && this.ScaneInfo.length > 0) {
            this.id && this.getInfo(this.id)
          }
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
          if (this.RegionInfo && this.RegionInfo.length > 0) {
            this.id && this.getInfo(this.id)
          }
        }
      })
    },
    isPositiveIntegerNumber(value) {
      return Number.isInteger(Number(value)) && !/^-?(0\d{1,})?\.\d*$|^-?\d+\.+$|^-?0\d{1,}$/.test(value) && Number(value) > 0
    },
    // 导粉广告-新增/修改
    updateInfo() {
      if (!this.PlatformType) {
        this.$message({
          showClose: true,
          message: '所属平台不能为空',
          type: 'error'
        })
        return
      }

      if (this.newDataTime == null) {
        this.$message({
          showClose: true,
          message: '导粉时间不能为空',
          type: 'error'
        })
        return
      }

      if (this.isSpeedLimit) {
        if (!this.SpeedFilter.Time) {
          this.$message({
            showClose: true,
            message: '导粉速度限制-间隔时间不能为空',
            type: 'error'
          })
          return
        }
        if (!this.isPositiveIntegerNumber(this.SpeedFilter.Time)) {
          this.$message({
            showClose: true,
            message: '导粉速度限制-间隔时间必须为正整数',
            type: 'error'
          })
          return
        }
        if (!this.SpeedFilter.Speed) {
          this.$message({
            showClose: true,
            message: '导粉速度限制-导粉个数不能为空',
            type: 'error'
          })
          return
        }
        if (!this.isPositiveIntegerNumber(this.SpeedFilter.Speed)) {
          this.$message({
            showClose: true,
            message: '导粉速度限制-导粉个数必须为正整数',
            type: 'error'
          })
          return
        }
      }

      if (this.TimeDeleted.Attr[0] != undefined) {
        this.TimeDeleted.Attr[0].Attr.forEach(item => {
          item.Op = this.TimeDeleted.Attr[0].Attr[0].Op
        })

      }
      if (this.UserSide.Attr[0] != undefined) {
        /* this.UserSide.Attr.forEach().Attr.forEach(item => {

        }) */
        for (let i = 0; i < this.UserSide.Attr.length; i++) {
          for (let j = 0; j < this.UserSide.Attr[i].Attr.length; j++) {
            if (!this.UserSide.Attr[i].Attr[j].Field || (!this.UserSide.Attr[i].Attr[j].Val || this.UserSide.Attr[i].Attr[j].Val.length == 0)) {
              this.$message({
                showClose: true,
                message: '用户端有未删选筛选属性为空，',
                type: 'error'
              })
              return
            } else if (this.UserSide.Attr[i].Attr[j].Field == 'Weight') {
              for (let k = 0; k < this.UserSide.Attr[i].Attr[j].Val.length; k++) {
                if (this.UserSide.Attr[i].Attr[j].Val[k] == '') {
                  this.$message({
                    showClose: true,
                    message: '用户端有未删选筛选属性为空，',
                    type: 'error'
                  })
                  return
                }
              }
            }
          }
        }
      }
      for (let i = 0; i < this.SharedArea.Attr.length; i++) {
        for (let j = 0; j < this.SharedArea.Attr[i].Attr.length; j++) {
          if (!this.SharedArea.Attr[i].Attr[j].Field || (!this.SharedArea.Attr[i].Attr[j].Val || this.SharedArea.Attr[i].Attr[j].Val.length == 0)) {
            this.$message({
              showClose: true,
              message: '共享秤端有未删选筛选属性为空，',
              type: 'error'
            })
            return
          }
        }
      }
      for (let i = 0; i < this.TimeDeleted.Attr.length; i++) {
        for (let j = 0; j < this.TimeDeleted.Attr[i].Attr.length; j++) {
          if (!this.TimeDeleted.Attr[i].Attr[j].Field || (!this.TimeDeleted.Attr[i].Attr[j].Val || this.TimeDeleted.Attr[i].Attr[j].Val.length != 3)) {
            this.$message({
              showClose: true,
              message: '导粉时段筛选有未删选筛选属性为空，',
              type: 'error'
            })
            return
          } else {
            for (let k = 0; k < this.TimeDeleted.Attr[i].Attr[j].Val.length; k++) {
              if (this.TimeDeleted.Attr[i].Attr[j].Val[k] == '') {
                this.$message({
                  showClose: true,
                  message: '用户端有未删选筛选属性为空，',
                  type: 'error'
                })
                return
              }
            }
          }
        }
      }
      this.SharedArea.Attr.forEach(item => {
        item.Attr.forEach(childItem => {
          if (childItem.Field == 'Region') {
            childItem.Val.forEach(childItemList => {
              delete childItemList.children
            })
          }
        })
      })
      this.SharedArea.Attr.forEach(item => {
        item.Attr.forEach(childItem => {
          if (childItem.Field == 'Scene') {
            childItem.Val.forEach(childItemList => {
              delete childItemList.children
            })
          }
        })
      })
      let follow = {
        Id: this.modifyId,
        WeChatName: this.newInputName,
        CustomerId: this.newAdvertisement,
        PlatformType: this.PlatformType,
        Group: this.newGroupName,
        AdvType: this.newChargingType,
        Price: this.newPaidPrice,
        ServiceType: this.newImportType,
        PersonalControl: this.newImportType === '3' ? this.suspendNum > 0 ? this.suspendNum : 0 : 0,
        AdvUrl: this.imgUrlObject ? this.imgUrlObject : this.newImgUrl,
        Sorted: this.NewSort,
        Status: this.newState == '1' ? '1' : this.newState == '2' ? '0' : '',
        StartTime: this.newDataTime[0],
        EndTime: this.newDataTime[1],
        TotalFollowCount: this.targetNumber,
        DayFollowCount: this.upperLimit,
        SpeedFilter: this.isSpeedLimit ? {
          Time: this.SpeedFilter.Time * 60,
          Speed: this.SpeedFilter.Speed
        } : '',
        AuthType: this.newAccessMode,
        ReplyKeywords: this.keyWord,
        WebAuthAppId: this.webAuthAppId,
        PushRule: this.correlationPush,
        UserFilter: this.UserSide, // 用户端 ok
        ScaleFilter: this.SharedArea, // 共享端 ok
        TimeFilter: this.TimeDeleted, // 时间删选 ok
      }

      const route = this.$route
      this.isSaving = true
      updateInfo({
        follow: follow
      }).then(data => {
        this.isSaving = false
        if (data.data.Status == 200) {
          this.modifyDetilsReset()
          this.getLinksUrl = ''
          this.getStatUrl = ''
          this.imgUrl = ''
          this.imgUrlObject = ''
          this.$message({
            showClose: true,
            message: '保存成功！',
            type: 'success'
          });
          this.$router.push({ path: '/advManager', query: { refresh: !this.modifyId ? '1' : '2' } }, () => {
            setTimeout(() => {
              this.$store.dispatch('delVisitedViews', route)
            }, 200)
          })
        } else {
          if (data.data.Status == 253) {
            this.$message({
              showClose: true,
              message: '导粉号名称不可重复添加',
              type: 'error'
            });
          } else {
            this.$message({
              showClose: true,
              message: data.data.Result.ErrorMsg,
              type: 'error'
            });
          }
        }
      }).catch(() => {
        this.isSaving = false
      })
    }
  }
}
</script>

<style lang="less" scoped>
.accountManagement {
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
