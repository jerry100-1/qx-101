<template>
  <div class="main">
    <div ref="queryContent" v-sticky="{zIndex: 2001, stickyTop: 0, disabled: false}">
      <div class="header-wrapper">
        <el-form :disabled="isListLoading" :model="queryForm" ref="queryForm" :inline="true" label-width="0" :show-message="false">
          <div class="d-flex justify-content-between">
            <div class="filter-wrapper mr-2">
              <div class="filter-container">
                <div class="filter-item mr-3">
                  <label>数据表：</label>
                  <el-form-item prop="table" class="inline-form-item">
                    <el-select v-model="queryForm.table" placeholder="请选择数据表" class="filter-input">
                      <el-option
                        v-for="item in tableOptions"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </div>
                <div class="filter-item mr-3">
                  <label>公众号：</label>
                  <el-form-item prop="gzh" class="inline-form-item">
                    <el-select v-model="queryForm.gzh" clearable class="filter-input">
                      <el-option
                        v-for="item in gzhData"
                        :key="item.Id"
                        :label="item.Name"
                        :value="item.Id">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </div>
                <div class="filter-item mr-3">
                  <label>开始时间：</label>
                  <el-form-item prop="startTime" class="inline-form-item">
                    <el-date-picker
                      v-model="queryForm.startTime"
                      class="filter-input"
                      type="date"
                      format="yyyy/MM/dd"
                      value-format="yyyy-MM-dd"
                      :editable="false"
                      clearable
                      placeholder="选择日期">
                    </el-date-picker>
                  </el-form-item>
                </div>
                <div class="filter-item">
                  <label>结束时间：</label>
                  <el-form-item prop="endTime" class="inline-form-item">
                    <el-date-picker
                      v-model="queryForm.endTime"
                      class="filter-input"
                      type="date"
                      format="yyyy/MM/dd"
                      value-format="yyyy-MM-dd"
                      :editable="false"
                      clearable
                      placeholder="选择日期">
                    </el-date-picker>
                  </el-form-item>
                </div>
              </div>
            </div>
            <div class="tools flex-shrink-0">
              <div class="filter-item">
                <el-button :loading="isListLoading" :disabled="isSaving || !!currentEditData" @click="fetchData" type="primary" class="query-button" icon="el-icon-search">查询</el-button>
                <el-button :disabled="isListLoading || isSaving || !!currentEditData" @click="resetQueryForm" class="query-button">重置</el-button>
              </div>
            </div>
          </div>
        </el-form>
      </div>
    </div>
    <div v-if="query.table" class="content-wrapper">
      <div class="main-content">
        <div class="button-wrapper d-flex justify-content-between">
          <el-button :disabled="!!currentEditData" @click="add" type="warning" class="tool-button">新增数据记录</el-button>
        </div>

        <el-form v-if="query.table === 1" :key="1" :disabled="isSaving" :rules="rules1" :model="currentEditData" ref="editForm" label-width="0" :show-message="false">
          <el-table
            ref="table"
            :data="tableData"
            v-loading="isListLoading"
            border
            fit
            highlight-current-row
            style="width: 100%;"
            :max-height="tableMaxHeight">
            <el-table-column
              prop="Date"
              label="日期"
              min-width="150">
              <template slot-scope="scope">
                <el-form-item v-if="scope.row.isEditing && !scope.row.exist" prop="Date" class="form-item">
                  <el-date-picker
                    v-model="scope.row.Date"
                    type="date"
                    format="yyyy/MM/dd"
                    value-format="yyyy-MM-dd"
                    :editable="false"
                    :clearable="false"
                    placeholder="选择日期"
                    style="width: auto"
                    class="form-input">
                  </el-date-picker>
                </el-form-item>
                <span v-else>{{ scope.row.Date }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="WeChatId"
              label="公众号名称"
              min-width="120">
              <template slot-scope="scope">
                <el-form-item v-if="scope.row.isEditing && !scope.row.exist" prop="WeChatId" class="form-item">
                  <el-select
                    v-model="scope.row.WeChatId"
                    class="form-input">
                    <el-option
                      v-for="item in gzhData"
                      :key="item.Id"
                      :label="item.Name"
                      :value="item.Id">
                    </el-option>
                  </el-select>
                </el-form-item>
                <span v-else>{{ scope.row.WeChatName }}</span>
              </template>
            </el-table-column>
            <el-table-column
              v-for="incomeItem in incomeItemList"
              :key="incomeItem.Id"
              :prop="incomeItem.Id"
              :label="incomeItem.Name"
              min-width="80">
              <template slot-scope="scope">
                <el-form-item v-if="scope.row.isEditing" :prop="'Data.' + incomeItem.Id" :rules="rules1.money" class="form-item">
                  <el-input
                    v-model.trim="scope.row.Data[incomeItem.Id]"
                    @input="handleNumberInput(scope.row.Data, incomeItem.Id)"
                    :maxlength="15"
                    class="form-input">
                  </el-input>
                </el-form-item>
                <span v-else>{{ scope.row.Data[incomeItem.Id] }}</span>
              </template>
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              width="200">
              <template slot-scope="scope">
                <template v-if="scope.row.isEditing">
                  <el-button :loading="isSaving" @click="save" type="primary" class="oper-button">保存</el-button>
                  <el-button :disabled="isSaving" @click="cancelEdit" class="oper-button">取消</el-button>
                </template>
                <el-button v-else :disabled="!!currentEditData" @click="edit(scope.row)" type="primary" class="oper-button">修改</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form>

        <el-form v-else-if="query.table === 2" :key="2" :disabled="isSaving" :rules="rules2" :model="currentEditData" ref="editForm" label-width="0" :show-message="false">
          <el-table
            ref="table"
            :data="tableData"
            v-loading="isListLoading"
            border
            fit
            highlight-current-row
            style="width: 100%;"
            :max-height="tableMaxHeight">
            <el-table-column
              prop="Date"
              label="日期"
              min-width="150">
              <template slot-scope="scope">
                <el-form-item v-if="scope.row.isEditing && !scope.row.Id" prop="Date" class="form-item">
                  <el-date-picker
                    v-model="scope.row.Date"
                    type="date"
                    format="yyyy/MM/dd"
                    value-format="yyyy-MM-dd"
                    :editable="false"
                    :clearable="false"
                    placeholder="选择日期"
                    style="width: auto"
                    class="form-input">
                  </el-date-picker>
                </el-form-item>
                <span v-else>{{ scope.row.Date }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="WeChatId"
              label="公众号名称"
              min-width="120">
              <template slot-scope="scope">
                <el-form-item v-if="scope.row.isEditing && !scope.row.Id" prop="WeChatId" class="form-item">
                  <el-select
                    v-model="scope.row.WeChatId"
                    class="form-input">
                    <el-option
                      v-for="item in gzhData"
                      :key="item.Id"
                      :label="item.Name"
                      :value="item.Id">
                    </el-option>
                  </el-select>
                </el-form-item>
                <span v-else>{{ scope.row.WeChatName }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="AllFansNum"
              label="累计粉丝数量"
              min-width="80">
              <template slot-scope="scope">
                <el-form-item v-if="scope.row.isEditing" prop="AllFansNum" class="form-item">
                  <el-input
                    v-model.trim="scope.row.AllFansNum"
                    @input="handleNumberInput(scope.row, 'AllFansNum')"
                    :maxlength="15"
                    class="form-input">
                  </el-input>
                </el-form-item>
                <span v-else>{{ scope.row.AllFansNum }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="NewFansNum"
              label="新增粉丝数"
              min-width="80">
              <template slot-scope="scope">
                <el-form-item v-if="scope.row.isEditing" prop="NewFansNum" class="form-item">
                  <el-input
                    v-model.trim="scope.row.NewFansNum"
                    @input="handleNumberInput(scope.row, 'NewFansNum')"
                    :maxlength="15"
                    class="form-input">
                  </el-input>
                </el-form-item>
                <span v-else>{{ scope.row.NewFansNum }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="UnfollowNum"
              label="取关数"
              min-width="80">
              <template slot-scope="scope">
                <el-form-item v-if="scope.row.isEditing" prop="UnfollowNum" class="form-item">
                  <el-input
                    v-model.trim="scope.row.UnfollowNum"
                    @input="handleNumberInput(scope.row, 'UnfollowNum')"
                    :maxlength="15"
                    class="form-input">
                  </el-input>
                </el-form-item>
                <span v-else>{{ scope.row.UnfollowNum }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="NetFansNum"
              label="净增粉丝数"
              min-width="80">
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              width="200">
              <template slot-scope="scope">
                <template v-if="scope.row.isEditing">
                  <el-button :loading="isSaving" @click="save" type="primary" class="oper-button">保存</el-button>
                  <el-button :disabled="isSaving" @click="cancelEdit" class="oper-button">取消</el-button>
                </template>
                <el-button v-else :disabled="!!currentEditData" @click="edit(scope.row)" type="primary" class="oper-button">修改</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form>

        <el-form v-else-if="query.table === 3" :key="3" :disabled="isSaving" :rules="rules3" :model="currentEditData" ref="editForm" label-width="0" :show-message="false">
          <el-table
            ref="table"
            :data="tableData"
            v-loading="isListLoading"
            border
            fit
            highlight-current-row
            style="width: 100%;"
            :max-height="tableMaxHeight">
            <el-table-column
              prop="Date"
              label="日期"
              min-width="150">
              <template slot-scope="scope">
                <el-form-item v-if="scope.row.isEditing && !scope.row.Id" prop="Date" class="form-item">
                  <el-date-picker
                    v-model="scope.row.Date"
                    type="date"
                    format="yyyy/MM/dd"
                    value-format="yyyy-MM-dd"
                    :editable="false"
                    :clearable="false"
                    placeholder="选择日期"
                    style="width: auto"
                    class="form-input">
                  </el-date-picker>
                </el-form-item>
                <span v-else>{{ scope.row.Date }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="WeChatId"
              label="公众号名称"
              min-width="120">
              <template slot-scope="scope">
                <el-form-item v-if="scope.row.isEditing && !scope.row.Id" prop="WeChatId" class="form-item">
                  <el-select
                    v-model="scope.row.WeChatId"
                    class="form-input">
                    <el-option
                      v-for="item in gzhData"
                      :key="item.Id"
                      :label="item.Name"
                      :value="item.Id">
                    </el-option>
                  </el-select>
                </el-form-item>
                <span v-else>{{ scope.row.WeChatName }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="Title"
              label="标题"
              min-width="200">
              <template slot-scope="scope">
                <el-form-item v-if="scope.row.isEditing" prop="Title" class="form-item">
                  <el-input
                    v-model.trim="scope.row.Title"
                    class="form-input">
                  </el-input>
                </el-form-item>
                <span v-else>{{ scope.row.Title }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="Sort"
              label="序号"
              min-width="80">
              <template slot-scope="scope">
                <el-form-item v-if="scope.row.isEditing" prop="Sort" class="form-item">
                  <el-input
                    v-model.trim="scope.row.Sort"
                    @input="handleNumberInput(scope.row, 'Sort')"
                    :maxlength="15"
                    class="form-input">
                  </el-input>
                </el-form-item>
                <span v-else>{{ scope.row.Sort }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="SendPeopleNum"
              label="送达人数"
              min-width="80">
              <template slot-scope="scope">
                <el-form-item v-if="scope.row.isEditing" prop="SendPeopleNum" class="form-item">
                  <el-input
                    v-model.trim="scope.row.SendPeopleNum"
                    @input="handleNumberInput(scope.row, 'SendPeopleNum')"
                    :maxlength="15"
                    class="form-input">
                  </el-input>
                </el-form-item>
                <span v-else>{{ scope.row.SendPeopleNum }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="ReadPeopleNum"
              label="图文阅读人数"
              min-width="80">
              <template slot-scope="scope">
                <el-form-item v-if="scope.row.isEditing" prop="ReadPeopleNum" class="form-item">
                  <el-input
                    v-model.trim="scope.row.ReadPeopleNum"
                    @input="handleNumberInput(scope.row, 'ReadPeopleNum')"
                    :maxlength="15"
                    class="form-input">
                  </el-input>
                </el-form-item>
                <span v-else>{{ scope.row.ReadPeopleNum }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="DialogPeopleNum"
              label="会话阅读人数"
              min-width="80">
              <template slot-scope="scope">
                <el-form-item v-if="scope.row.isEditing" prop="DialogPeopleNum" class="form-item">
                  <el-input
                    v-model.trim="scope.row.DialogPeopleNum"
                    @input="handleNumberInput(scope.row, 'DialogPeopleNum')"
                    :maxlength="15"
                    class="form-input">
                  </el-input>
                </el-form-item>
                <span v-else>{{ scope.row.DialogPeopleNum }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="HistoryReadNum"
              label="历史消息阅读人数"
              min-width="80">
              <template slot-scope="scope">
                <el-form-item v-if="scope.row.isEditing" prop="HistoryReadNum" class="form-item">
                  <el-input
                    v-model.trim="scope.row.HistoryReadNum"
                    @input="handleNumberInput(scope.row, 'HistoryReadNum')"
                    :maxlength="15"
                    class="form-input">
                  </el-input>
                </el-form-item>
                <span v-else>{{ scope.row.HistoryReadNum }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="FriendCircleReadNum"
              label="朋友圈阅读人数"
              min-width="80">
              <template slot-scope="scope">
                <el-form-item v-if="scope.row.isEditing" prop="FriendCircleReadNum" class="form-item">
                  <el-input
                    v-model.trim="scope.row.FriendCircleReadNum"
                    @input="handleNumberInput(scope.row, 'FriendCircleReadNum')"
                    :maxlength="15"
                    class="form-input">
                  </el-input>
                </el-form-item>
                <span v-else>{{ scope.row.FriendCircleReadNum }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="FriendSendReadNum"
              label="好友转发阅读人数"
              min-width="80">
              <template slot-scope="scope">
                <el-form-item v-if="scope.row.isEditing" prop="FriendSendReadNum" class="form-item">
                  <el-input
                    v-model.trim="scope.row.FriendSendReadNum"
                    @input="handleNumberInput(scope.row, 'FriendSendReadNum')"
                    :maxlength="15"
                    class="form-input">
                  </el-input>
                </el-form-item>
                <span v-else>{{ scope.row.FriendSendReadNum }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="OtherReadNum"
              label="其他场景阅读人数"
              min-width="80">
              <template slot-scope="scope">
                <el-form-item v-if="scope.row.isEditing" prop="OtherReadNum" class="form-item">
                  <el-input
                    v-model.trim="scope.row.OtherReadNum"
                    @input="handleNumberInput(scope.row, 'OtherReadNum')"
                    :maxlength="15"
                    class="form-input">
                  </el-input>
                </el-form-item>
                <span v-else>{{ scope.row.OtherReadNum }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="SharePeopleNum"
              label="分享人数"
              min-width="80">
              <template slot-scope="scope">
                <el-form-item v-if="scope.row.isEditing" prop="SharePeopleNum" class="form-item">
                  <el-input
                    v-model.trim="scope.row.SharePeopleNum"
                    @input="handleNumberInput(scope.row, 'SharePeopleNum')"
                    :maxlength="15"
                    class="form-input">
                  </el-input>
                </el-form-item>
                <span v-else>{{ scope.row.SharePeopleNum }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="CollectPeopleNum"
              label="收藏人数"
              min-width="80">
              <template slot-scope="scope">
                <el-form-item v-if="scope.row.isEditing" prop="CollectPeopleNum" class="form-item">
                  <el-input
                    v-model.trim="scope.row.CollectPeopleNum"
                    @input="handleNumberInput(scope.row, 'CollectPeopleNum')"
                    :maxlength="15"
                    class="form-input">
                  </el-input>
                </el-form-item>
                <span v-else>{{ scope.row.CollectPeopleNum }}</span>
              </template>
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              width="200">
              <template slot-scope="scope">
                <template v-if="scope.row.isEditing">
                  <el-button :loading="isSaving" @click="save" type="primary" class="oper-button">保存</el-button>
                  <el-button :disabled="isSaving" @click="cancelEdit" class="oper-button">取消</el-button>
                </template>
                <el-button v-else :disabled="!!currentEditData" @click="edit(scope.row)" type="primary" class="oper-button">修改</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form>

        <el-form v-else-if="query.table === 4" :key="4" :disabled="isSaving" :rules="rules4" :model="currentEditData" ref="editForm" label-width="0" :show-message="false">
          <el-table
            ref="table"
            :data="tableData"
            v-loading="isListLoading"
            border
            fit
            highlight-current-row
            style="width: 100%;"
            :max-height="tableMaxHeight">
            <el-table-column
              prop="Date"
              label="日期"
              min-width="150">
              <template slot-scope="scope">
                <el-form-item v-if="scope.row.isEditing && !scope.row.Id" prop="Date" class="form-item">
                  <el-date-picker
                    v-model="scope.row.Date"
                    type="date"
                    format="yyyy/MM/dd"
                    value-format="yyyy-MM-dd"
                    :editable="false"
                    :clearable="false"
                    placeholder="选择日期"
                    style="width: auto"
                    class="form-input">
                  </el-date-picker>
                </el-form-item>
                <span v-else>{{ scope.row.Date }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="WeChatId"
              label="公众号名称"
              min-width="120">
              <template slot-scope="scope">
                <el-form-item v-if="scope.row.isEditing && !scope.row.Id" prop="WeChatId" class="form-item">
                  <el-select
                    v-model="scope.row.WeChatId"
                    class="form-input">
                    <el-option
                      v-for="item in gzhData"
                      :key="item.Id"
                      :label="item.Name"
                      :value="item.Id">
                    </el-option>
                  </el-select>
                </el-form-item>
                <span v-else>{{ scope.row.WeChatName }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="ReadPeopleNum"
              label="图文总阅读人数"
              min-width="80">
              <template slot-scope="scope">
                <el-form-item v-if="scope.row.isEditing" prop="ReadPeopleNum" class="form-item">
                  <el-input
                    v-model.trim="scope.row.ReadPeopleNum"
                    @input="handleNumberInput(scope.row, 'ReadPeopleNum')"
                    :maxlength="15"
                    class="form-input">
                  </el-input>
                </el-form-item>
                <span v-else>{{ scope.row.ReadPeopleNum }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="ReadNum"
              label="图文总阅读次数"
              min-width="80">
              <template slot-scope="scope">
                <el-form-item v-if="scope.row.isEditing" prop="ReadNum" class="form-item">
                  <el-input
                    v-model.trim="scope.row.ReadNum"
                    @input="handleNumberInput(scope.row, 'ReadNum')"
                    :maxlength="15"
                    class="form-input">
                  </el-input>
                </el-form-item>
                <span v-else>{{ scope.row.ReadNum }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="DialogPeopleNum"
              label="会话阅读人数"
              min-width="80">
              <template slot-scope="scope">
                <el-form-item v-if="scope.row.isEditing" prop="DialogPeopleNum" class="form-item">
                  <el-input
                    v-model.trim="scope.row.DialogPeopleNum"
                    @input="handleNumberInput(scope.row, 'DialogPeopleNum')"
                    :maxlength="15"
                    class="form-input">
                  </el-input>
                </el-form-item>
                <span v-else>{{ scope.row.DialogPeopleNum }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="DialogNum"
              label="会话阅读次数"
              min-width="80">
              <template slot-scope="scope">
                <el-form-item v-if="scope.row.isEditing" prop="DialogNum" class="form-item">
                  <el-input
                    v-model.trim="scope.row.DialogNum"
                    @input="handleNumberInput(scope.row, 'DialogNum')"
                    :maxlength="15"
                    class="form-input">
                  </el-input>
                </el-form-item>
                <span v-else>{{ scope.row.DialogNum }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="FriendCircleReadPeopleNum"
              label="朋友圈阅读人数"
              min-width="80">
              <template slot-scope="scope">
                <el-form-item v-if="scope.row.isEditing" prop="FriendCircleReadPeopleNum" class="form-item">
                  <el-input
                    v-model.trim="scope.row.FriendCircleReadPeopleNum"
                    @input="handleNumberInput(scope.row, 'FriendCircleReadPeopleNum')"
                    :maxlength="15"
                    class="form-input">
                  </el-input>
                </el-form-item>
                <span v-else>{{ scope.row.FriendCircleReadPeopleNum }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="FriendCircleReadNum"
              label="朋友圈阅读次数"
              min-width="80">
              <template slot-scope="scope">
                <el-form-item v-if="scope.row.isEditing" prop="FriendCircleReadNum" class="form-item">
                  <el-input
                    v-model.trim="scope.row.FriendCircleReadNum"
                    @input="handleNumberInput(scope.row, 'FriendCircleReadNum')"
                    :maxlength="15"
                    class="form-input">
                  </el-input>
                </el-form-item>
                <span v-else>{{ scope.row.FriendCircleReadNum }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="SharePeopleNum"
              label="分享转发人数"
              min-width="80">
              <template slot-scope="scope">
                <el-form-item v-if="scope.row.isEditing" prop="SharePeopleNum" class="form-item">
                  <el-input
                    v-model.trim="scope.row.SharePeopleNum"
                    @input="handleNumberInput(scope.row, 'SharePeopleNum')"
                    :maxlength="15"
                    class="form-input">
                  </el-input>
                </el-form-item>
                <span v-else>{{ scope.row.SharePeopleNum }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="ShareNum"
              label="分享转发次数"
              min-width="80">
              <template slot-scope="scope">
                <el-form-item v-if="scope.row.isEditing" prop="ShareNum" class="form-item">
                  <el-input
                    v-model.trim="scope.row.ShareNum"
                    @input="handleNumberInput(scope.row, 'ShareNum')"
                    :maxlength="15"
                    class="form-input">
                  </el-input>
                </el-form-item>
                <span v-else>{{ scope.row.ShareNum }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="CollectPeopleNum"
              label="收藏人数"
              min-width="80">
              <template slot-scope="scope">
                <el-form-item v-if="scope.row.isEditing" prop="CollectPeopleNum" class="form-item">
                  <el-input
                    v-model.trim="scope.row.CollectPeopleNum"
                    @input="handleNumberInput(scope.row, 'CollectPeopleNum')"
                    :maxlength="15"
                    class="form-input">
                  </el-input>
                </el-form-item>
                <span v-else>{{ scope.row.CollectPeopleNum }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="CollectNum"
              label="收藏次数"
              min-width="80">
              <template slot-scope="scope">
                <el-form-item v-if="scope.row.isEditing" prop="CollectNum" class="form-item">
                  <el-input
                    v-model.trim="scope.row.CollectNum"
                    @input="handleNumberInput(scope.row, 'CollectNum')"
                    :maxlength="15"
                    class="form-input">
                  </el-input>
                </el-form-item>
                <span v-else>{{ scope.row.CollectNum }}</span>
              </template>
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              width="200">
              <template slot-scope="scope">
                <template v-if="scope.row.isEditing">
                  <el-button :loading="isSaving" @click="save" type="primary" class="oper-button">保存</el-button>
                  <el-button :disabled="isSaving" @click="cancelEdit" class="oper-button">取消</el-button>
                </template>
                <el-button v-else :disabled="!!currentEditData" @click="edit(scope.row)" type="primary" class="oper-button">修改</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form>

        <el-form v-else-if="query.table === 5" :key="5" :disabled="isSaving" :rules="rules5" :model="currentEditData" ref="editForm" label-width="0" :show-message="false">
          <el-table
            ref="table"
            :data="tableData"
            v-loading="isListLoading"
            border
            fit
            highlight-current-row
            style="width: 100%;"
            :max-height="tableMaxHeight">
            <el-table-column
              prop="Name"
              label="收益项目名称">
              <template slot-scope="scope">
                <el-form-item v-if="scope.row.isEditing" prop="Name" class="form-item">
                  <el-input
                    v-model.trim="scope.row.Name"
                    class="form-input">
                  </el-input>
                </el-form-item>
                <span v-else>{{ scope.row.Name }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="Status"
              label="状态">
              <template slot-scope="scope">
                <el-form-item v-if="scope.row.isEditing" prop="Status" class="form-item">
                  <el-select
                    v-model="scope.row.Status"
                    class="form-input">
                    <el-option
                      v-for="item in statusOptions"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
                <span v-else>{{ statusMap.get(scope.row.Status) }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="Remark"
              label="备注">
              <template slot-scope="scope">
                <el-form-item v-if="scope.row.isEditing" prop="Remark" class="form-item">
                  <el-input
                    v-model.trim="scope.row.Remark"
                    class="form-input">
                  </el-input>
                </el-form-item>
                <span v-else>{{ scope.row.Remark }}</span>
              </template>
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              width="200">
              <template slot-scope="scope">
                <template v-if="scope.row.isEditing">
                  <el-button :loading="isSaving" @click="save" type="primary" class="oper-button">保存</el-button>
                  <el-button :disabled="isSaving" @click="cancelEdit" class="oper-button">取消</el-button>
                </template>
                <el-button v-else :disabled="!!currentEditData" @click="edit(scope.row)" type="primary" class="oper-button">修改</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form>

        <el-form v-else-if="query.table === 6" :key="6" :disabled="isSaving" :rules="rules6" :model="currentEditData" ref="editForm" label-width="0" :show-message="false">
          <el-table
            ref="table"
            :data="tableData"
            v-loading="isListLoading"
            border
            fit
            highlight-current-row
            style="width: 100%;"
            :max-height="tableMaxHeight">
            <el-table-column
              prop="GroupName"
              label="分组名称">
              <template slot-scope="scope">
                <el-form-item v-if="scope.row.isEditing" prop="GroupName" class="form-item">
                  <el-input
                    v-model.trim="scope.row.GroupName"
                    class="form-input">
                  </el-input>
                </el-form-item>
                <span v-else>{{ scope.row.GroupName }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="Status"
              label="状态">
              <template slot-scope="scope">
                <el-form-item v-if="scope.row.isEditing" prop="Status" class="form-item">
                  <el-select
                    v-model="scope.row.Status"
                    class="form-input">
                    <el-option
                      v-for="item in statusOptions"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
                <span v-else>{{ statusMap.get(scope.row.Status) }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="Remark"
              label="备注">
              <template slot-scope="scope">
                <el-form-item v-if="scope.row.isEditing" prop="Remark" class="form-item">
                  <el-input
                    v-model.trim="scope.row.Remark"
                    class="form-input">
                  </el-input>
                </el-form-item>
                <span v-else>{{ scope.row.Remark }}</span>
              </template>
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              width="200">
              <template slot-scope="scope">
                <template v-if="scope.row.isEditing">
                  <el-button :loading="isSaving" @click="save" type="primary" class="oper-button">保存</el-button>
                  <el-button :disabled="isSaving" @click="cancelEdit" class="oper-button">取消</el-button>
                </template>
                <el-button v-else :disabled="!!currentEditData" @click="edit(scope.row)" type="primary" class="oper-button">修改</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form>

        <div v-show="!isListLoading" class="text-center py-3">
          <el-pagination
            :disabled="isSaving || !!currentEditData"
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
import * as GzhApi from '@/api/gzh'
import swal from 'sweetalert2'
import { deepClone } from '@/utils'
import { mapGetters } from 'vuex'

export default {
  name: 'gzh-data-entry',
  components: {
  },
  directives: {
    sticky: VueSticky
  },
  data () {
    const tableOptions = [
      {
        id: 1,
        name: '公众号各收益项明细数据'
      }, {
        id: 2,
        name: '公众号粉丝数据'
      }, {
        id: 3,
        name: '公众号单条图文数据'
      }, {
        id: 4,
        name: '公众号全部图文数据'
      }, {
        id: 5,
        name: '公众号收益项目配置'
      }, {
        id: 6,
        name: '公众号分组配置'
      }
    ]
    const statusOptions = [
      {
        id: '1',
        name: '启用'
      }, {
        id: '0',
        name: '禁用'
      }
    ]

    const table = null
    const gzh = null
    const startTime = null
    const endTime = null

    const checkNumber = (rule, value, callback) => {
      if (value && (isNaN(value) || /^-?(0\d{1,})?\.\d*$|^-?\d+\.+$|^-?0\d{1,}$/.test(value))) {
        callback(new Error('请输入数值'))
      } else {
        callback()
      }
    }

    // const checkNonNegativeNumber = (rule, value, callback) => {
    //   if (value && (isNaN(value) || /^-?(0\d{1,})?\.\d*$|^-?\d+\.+$|^-?0\d{1,}$/.test(value) || Number(value) < 0)) {
    //     callback(new Error('请输入大于或等于0的数值'))
    //   } else {
    //     callback()
    //   }
    // }

    const checkIntegerNumber = (rule, value, callback) => {
      if (value && (!Number.isInteger(Number(value)) || /^-?(0\d{1,})?\.\d*$|^-?\d+\.+$|^-?0\d{1,}$/.test(value))) {
        callback(new Error('请输入整数'))
      } else {
        callback()
      }
    }

    const checkNonNegativeIntegerNumber = (rule, value, callback) => {
      if (value && (!Number.isInteger(Number(value)) || /^-?(0\d{1,})?\.\d*$|^-?\d+\.+$|^-?0\d{1,}$/.test(value) || Number(value) < 0)) {
        callback(new Error('请输入非负整数'))
      } else {
        callback()
      }
    }

    return {
      queryForm: {
        // 数据表
        table: table,
        // 公众号
        gzh: gzh,
        // 开始时间
        startTime: startTime,
        // 结束时间
        endTime: endTime
      },
      // 数据表选项
      tableOptions: tableOptions,
      // 状态选项
      statusOptions: statusOptions,
      statusMap: new Map(statusOptions.map(item => [item.id, item.name])),

      // 图表数据加载状态
      isListLoading: false,
      // 保存之前的请求参数
      query: deepClone({ table, gzh, startTime, endTime }),
      // 图表原始数据
      rawListData: [],
      // 收益项目数据
      incomeItemList: [],

      // 表格当前页
      tableCurrentPage: 1,
      // 表格一页条数可选项
      tablePageSizeOption: [10, 20, 30],
      // 表格一页条数
      tablePageSize: 20,
      // 总条数
      tableTotalSize: 0,
      // 是否正在保存
      isSaving: false,
      // 新增数据
      additionalData: null,
      // 当前编辑的数据
      currentEditData: null,
      // 表单验证规则
      rules1: {
        Date: [{ required: true, trigger: ['blur'] }],
        WeChatId: [{ required: true, trigger: ['change'] }],
        money: [{ validator: checkNumber, trigger: ['change', 'blur'] }]
      },
      rules2: {
        Date: [{ required: true, trigger: ['blur'] }],
        WeChatId: [{ required: true, trigger: ['change'] }],
        AllFansNum: [{ validator: checkNonNegativeIntegerNumber, trigger: ['change', 'blur'] }],
        NewFansNum: [{ validator: checkNonNegativeIntegerNumber, trigger: ['change', 'blur'] }],
        UnfollowNum: [{ validator: checkNonNegativeIntegerNumber, trigger: ['change', 'blur'] }]
      },
      rules3: {
        Date: [{ required: true, trigger: ['blur'] }],
        WeChatId: [{ required: true, trigger: ['change'] }],
        Title: [{ required: true, trigger: ['blur'] }],
        Sort: [{ validator: checkNonNegativeIntegerNumber, trigger: ['change', 'blur'] }],
        SendPeopleNum: [{ validator: checkNonNegativeIntegerNumber, trigger: ['change', 'blur'] }],
        ReadPeopleNum: [{ validator: checkNonNegativeIntegerNumber, trigger: ['change', 'blur'] }],
        DialogPeopleNum: [{ validator: checkNonNegativeIntegerNumber, trigger: ['change', 'blur'] }],
        HistoryReadNum: [{ validator: checkNonNegativeIntegerNumber, trigger: ['change', 'blur'] }],
        FriendCircleReadNum: [{ validator: checkNonNegativeIntegerNumber, trigger: ['change', 'blur'] }],
        FriendSendReadNum: [{ validator: checkNonNegativeIntegerNumber, trigger: ['change', 'blur'] }],
        OtherReadNum: [{ validator: checkNonNegativeIntegerNumber, trigger: ['change', 'blur'] }],
        SharePeopleNum: [{ validator: checkNonNegativeIntegerNumber, trigger: ['change', 'blur'] }],
        CollectPeopleNum: [{ validator: checkNonNegativeIntegerNumber, trigger: ['change', 'blur'] }]
      },
      rules4: {
        Date: [{ required: true, trigger: ['blur'] }],
        WeChatId: [{ required: true, trigger: ['change'] }],
        ReadPeopleNum: [{ validator: checkNonNegativeIntegerNumber, trigger: ['change', 'blur'] }],
        ReadNum: [{ validator: checkNonNegativeIntegerNumber, trigger: ['change', 'blur'] }],
        DialogPeopleNum: [{ validator: checkNonNegativeIntegerNumber, trigger: ['change', 'blur'] }],
        DialogNum: [{ validator: checkNonNegativeIntegerNumber, trigger: ['change', 'blur'] }],
        FriendCircleReadPeopleNum: [{ validator: checkNonNegativeIntegerNumber, trigger: ['change', 'blur'] }],
        FriendCircleReadNum: [{ validator: checkNonNegativeIntegerNumber, trigger: ['change', 'blur'] }],
        SharePeopleNum: [{ validator: checkNonNegativeIntegerNumber, trigger: ['change', 'blur'] }],
        ShareNum: [{ validator: checkNonNegativeIntegerNumber, trigger: ['change', 'blur'] }],
        CollectPeopleNum: [{ validator: checkNonNegativeIntegerNumber, trigger: ['change', 'blur'] }],
        CollectNum: [{ validator: checkNonNegativeIntegerNumber, trigger: ['change', 'blur'] }]
      },
      rules5: {
        Name: [{ required: true, trigger: ['blur'] }]
      },
      rules6: {
        GroupName: [{ required: true, trigger: ['blur'] }]
      },
      // 除表格外内容区域高度
      othersHeight: 0
    }
  },
  computed: {
    tableMaxHeight () {
      return Math.max(this.$store.getters.containerHeight - this.othersHeight, 300)
    },
    ...mapGetters([
      'wxGroup',
      'wxAccountTypes',
      'gzhData'
    ]),
    tableData () {
      if (this.additionalData) {
        return [this.additionalData, ...this.rawListData]
      }
      return this.rawListData
    }
  },
  created () {
    this.$store.dispatch('getAllGzhOptions')
  },
  mounted () {

  },
  updated () {
    this.$nextTick(() => {
      const queryContent = this.$refs.queryContent
      const queryContentHeight = queryContent ? Math.round(queryContent.clientHeight) : 0
      this.othersHeight = queryContentHeight + 41 + 64 + 72
    })
  },
  methods: {
    // 重置查询
    resetQueryForm () {
      this.$refs.queryForm.resetFields()
    },
    fetchData () {
      if (!this.queryForm.table) {
        swal({
          text: '请先选择需要录入的数据表',
          type: 'error',
          timer: 2000,
          showConfirmButton: false
        })
        return
      }

      // 克隆当前查询条件
      this.query = deepClone(this.queryForm)
      this.tableCurrentPage = 1
      this.tableTotalSize = 0
      this.fetchList()
    },
    fetchList () {
      // 获取数据
      this.isListLoading = true
      this.rawListData = []

      const { table, gzh, startTime, endTime } = this.query

      const postData = {
        offset: (this.tableCurrentPage - 1) * this.tablePageSize,
        limit: this.tablePageSize
      }
      let requestArr = [this.$store.dispatch('getAllGzhOptions')]
      switch (table) {
        case 1:
          gzh && (postData.wid = gzh)
          startTime && (postData.start_time = startTime)
          endTime && (postData.end_time = endTime)
          requestArr.push(GzhApi.getAllWXIncomeProjectList(), GzhApi.getWXIncomeDataList(postData))
          break
        case 2:
          gzh && (postData.wid = gzh)
          startTime && (postData.start_time = startTime)
          endTime && (postData.end_time = endTime)
          requestArr.push(Promise.resolve(), GzhApi.getWXFansDataList(postData))
          break
        case 3:
          gzh && (postData.wid = gzh)
          startTime && (postData.start_time = startTime)
          endTime && (postData.end_time = endTime)
          requestArr.push(Promise.resolve(), GzhApi.getWXArticleDataList(postData))
          break
        case 4:
          gzh && (postData.wid = gzh)
          startTime && (postData.start_time = startTime)
          endTime && (postData.end_time = endTime)
          requestArr.push(Promise.resolve(), GzhApi.getWXTotalArticleDataList(postData))
          break
        case 5:
          requestArr.push(Promise.resolve(), GzhApi.getWXIncomeProjectList(postData))
          break
        case 6:
          requestArr.push(Promise.resolve(), GzhApi.getWXGroupList(postData))
          break
      }
      Promise.all(requestArr).then(([res1, incomeItemRes, { data }]) => {
        this.isListLoading = false
        if (incomeItemRes) {
          const incomeItemData = incomeItemRes.data
          if (incomeItemData.Status !== 200) {
            swal({
              text: incomeItemData.Result.ErrorMsg,
              type: 'error',
              timer: 2000,
              showConfirmButton: false
            })
            return
          }
          this.incomeItemList = incomeItemData.Result
        }
        if (data.Status !== 200) {
          swal({
            text: data.Result.ErrorMsg,
            type: 'error',
            timer: 2000,
            showConfirmButton: false
          })
          return
        }
        const rawListData = data.Result.List

        if (table === 1) {
          rawListData.forEach(item => {
            item.exist = true
            item.Data = item.Data.reduce((acc, cur) => {
              acc[cur.ProjectId] = cur.Money
              return acc
            }, {})
            this.incomeItemList.forEach(incomeItem => {
              if (!item.Data.hasOwnProperty(incomeItem.Id)) {
                item.Data[incomeItem.Id] = null
              }
            })
          })
        }
        this.rawListData = rawListData

        this.tableTotalSize = data.Result.Total
      }).catch(() => {
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
    handleNumberInput (data, prop) {
      this.$nextTick(() => {
        const value = data[prop].replace(/[^\d-.]/g, '')
        this.$set(data, prop, value)
      })
    },
    // 新增
    add () {
      const data = {
        isEditing: true
      }
      switch (this.query.table) {
        case 1:
          data.Date = null
          data.WeChatId = null
          data.Data = {}
          this.incomeItemList.forEach(item => {
            data.Data[item.Id] = null
          })
          break
        case 2:
          data.Date = null
          data.WeChatId = null
          data.AllFansNum = null
          data.NewFansNum = null
          data.UnfollowNum = null
          break
        case 3:
          data.Date = null
          data.WeChatId = null
          data.Title = null
          data.Sort = null
          data.SendPeopleNum = null
          data.ReadPeopleNum = null
          data.DialogPeopleNum = null
          data.HistoryReadNum = null
          data.FriendCircleReadNum = null
          data.FriendSendReadNum = null
          data.OtherReadNum = null
          data.SharePeopleNum = null
          data.CollectPeopleNum = null
          break
        case 4:
          data.Date = null
          data.WeChatId = null
          data.ReadPeopleNum = null
          data.ReadNum = null
          data.DialogPeopleNum = null
          data.DialogNum = null
          data.FriendCircleReadPeopleNum = null
          data.FriendCircleReadNum = null
          data.SharePeopleNum = null
          data.ShareNum = null
          data.CollectPeopleNum = null
          data.CollectNum = null
          break
        case 5:
          data.Name = null
          data.Remark = null
          data.Status = null
          break
        case 6:
          data.GroupName = null
          data.Remark = null
          data.Status = null
          break
      }
      this.additionalData = this.currentEditData = data
    },
    // 修改公众号分组
    edit (data) {
      this.$set(data, 'isEditing', true)
      this.currentEditData = data
    },
    // 保存
    save () {
      this.$refs.editForm.validate().then(() => {
        this.isSaving = true

        let method = null
        const postData = {}
        switch (this.query.table) {
          case 1:
            method = 'setWXIncomeData'
            postData.date = this.currentEditData.Date
            postData.wid = this.currentEditData.WeChatId
            const data = {}
            this.incomeItemList.forEach(item => {
              this.currentEditData.Data[item.Id] && (data[item.Id] = this.currentEditData.Data[item.Id])
            })
            postData.data = JSON.stringify(data)
            break
          case 2:
            method = 'setWXFansData'
            postData.date = this.currentEditData.Date
            postData.wid = this.currentEditData.WeChatId
            this.currentEditData.Id && (postData.id = this.currentEditData.Id)
            this.currentEditData.AllFansNum && (postData.all_num = this.currentEditData.AllFansNum)
            this.currentEditData.NewFansNum && (postData.new_num = this.currentEditData.NewFansNum)
            this.currentEditData.UnfollowNum && (postData.un_num = this.currentEditData.UnfollowNum)
            break
          case 3:
            method = 'setWXArticleData'
            postData.date = this.currentEditData.Date
            postData.wid = this.currentEditData.WeChatId
            postData.title = this.currentEditData.Title
            this.currentEditData.Id && (postData.id = this.currentEditData.Id)
            this.currentEditData.Sort && (postData.sort = this.currentEditData.Sort)
            this.currentEditData.SendPeopleNum && (postData.sp_num = this.currentEditData.SendPeopleNum)
            this.currentEditData.ReadPeopleNum && (postData.rp_num = this.currentEditData.ReadPeopleNum)
            this.currentEditData.DialogPeopleNum && (postData.dp_num = this.currentEditData.DialogPeopleNum)
            this.currentEditData.HistoryReadNum && (postData.hr_num = this.currentEditData.HistoryReadNum)
            this.currentEditData.FriendCircleReadNum && (postData.fcr_num = this.currentEditData.FriendCircleReadNum)
            this.currentEditData.FriendSendReadNum && (postData.fsr_num = this.currentEditData.FriendSendReadNum)
            this.currentEditData.OtherReadNum && (postData.or_num = this.currentEditData.OtherReadNum)
            this.currentEditData.SharePeopleNum && (postData.ssp_num = this.currentEditData.SharePeopleNum)
            this.currentEditData.CollectPeopleNum && (postData.cp_num = this.currentEditData.CollectPeopleNum)
            break
          case 4:
            method = 'setWXTotalArticleData'
            postData.date = this.currentEditData.Date
            postData.wid = this.currentEditData.WeChatId
            this.currentEditData.Id && (postData.id = this.currentEditData.Id)
            this.currentEditData.ReadPeopleNum && (postData.rp_num = this.currentEditData.ReadPeopleNum)
            this.currentEditData.ReadNum && (postData.r_num = this.currentEditData.ReadNum)
            this.currentEditData.DialogPeopleNum && (postData.dp_num = this.currentEditData.DialogPeopleNum)
            this.currentEditData.DialogNum && (postData.d_num = this.currentEditData.DialogNum)
            this.currentEditData.FriendCircleReadPeopleNum && (postData.fcrp_num = this.currentEditData.FriendCircleReadPeopleNum)
            this.currentEditData.FriendCircleReadNum && (postData.fcr_num = this.currentEditData.FriendCircleReadNum)
            this.currentEditData.SharePeopleNum && (postData.sp_num = this.currentEditData.SharePeopleNum)
            this.currentEditData.ShareNum && (postData.s_num = this.currentEditData.ShareNum)
            this.currentEditData.CollectPeopleNum && (postData.cp_num = this.currentEditData.CollectPeopleNum)
            this.currentEditData.CollectNum && (postData.c_num = this.currentEditData.CollectNum)
            break
          case 5:
            method = 'setWXIncomeProjectData'
            postData.name = this.currentEditData.Name
            this.currentEditData.Id && (postData.id = this.currentEditData.Id)
            this.currentEditData.Remark && (postData.remark = this.currentEditData.Remark)
            this.currentEditData.Status !== null && (postData.status = this.currentEditData.Status)
            break
          case 6:
            method = 'setWXGroupData'
            postData.name = this.currentEditData.GroupName
            this.currentEditData.GroupId && (postData.id = this.currentEditData.GroupId)
            this.currentEditData.Remark && (postData.remark = this.currentEditData.Remark)
            this.currentEditData.Status !== null && (postData.status = this.currentEditData.Status)
            break
        }

        GzhApi[method](postData).then(({ data }) => {
          this.isSaving = false
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
            text: '保存成功',
            type: 'success',
            timer: 2000,
            showConfirmButton: false
          })
          this.$set(this.currentEditData, 'isEditing', false)
          this.currentEditData = null
          this.additionalData = null
          this.fetchList()
          if (this.query.table === 6) {
            this.$store.dispatch('getAllWXGroup', true)
          }
        }).catch(() => {
          this.isSaving = false
        })
      }).catch(() => {})
    },
    // 取消编辑
    cancelEdit () {
      this.$refs.editForm.resetFields()
      this.$set(this.currentEditData, 'isEditing', false)
      this.currentEditData = null
      this.additionalData = null
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
  .form-item {
    margin: 0;
  }
}
</style>
