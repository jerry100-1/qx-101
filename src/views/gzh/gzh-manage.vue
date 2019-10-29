<template>
  <div class="main">
    <template v-if="!gzhInfo">
      <div ref="queryContent" v-sticky="{zIndex: 2001, stickyTop: 0, disabled: false}">
        <div class="header-wrapper">
          <el-form :disabled="isListLoading" :model="queryForm" ref="queryForm" :inline="true" label-width="0" :show-message="false">
            <div class="d-flex justify-content-between">
              <div class="filter-wrapper mr-2">
                <div class="filter-container">
                  <div class="filter-item mr-3">
                    <label>公众号名称：</label>
                    <el-form-item prop="gzhName" class="inline-form-item">
                      <el-input v-model.trim="queryForm.gzhName" class="filter-input"></el-input>
                    </el-form-item>
                  </div>
                  <div class="filter-item mr-3">
                    <label>公众号类型：</label>
                    <el-form-item prop="gzhType" class="inline-form-item">
                      <el-select v-model="queryForm.gzhType" class="filter-input">
                        <el-option label="全部" :value="null"></el-option>
                        <el-option
                          v-for="(value, key) in wxAccountTypes"
                          :key="key"
                          :label="value"
                          :value="key">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </div>
                  <div class="filter-item mr-3">
                    <label>分组：</label>
                    <el-form-item prop="group" class="inline-form-item">
                      <el-select v-model="queryForm.group" class="filter-input">
                        <el-option label="全部" :value="null"></el-option>
                        <el-option
                          v-for="item in wxGroup"
                          :key="item.GroupId"
                          :label="item.GroupName"
                          :value="item.GroupId">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </div>
                  <div class="filter-item">
                    <label>状态：</label>
                    <el-form-item prop="status" class="inline-form-item">
                      <el-select v-model="queryForm.status" class="filter-input">
                        <el-option label="全部" :value="null"></el-option>
                        <el-option
                          v-for="item in statusOptions"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id">
                        </el-option>
                      </el-select>
                    </el-form-item>
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
          <div class="button-wrapper d-flex justify-content-between">
            <el-button :disabled="isListLoading" @click="add" type="primary" class="tool-button">新增公众号</el-button>
            <el-button @click="inputData" type="warning" class="tool-button">录入数据</el-button>
          </div>
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
              prop="Name"
              label="公众号名称">
            </el-table-column>
            <el-table-column
              prop="Type"
              label="公众号类型">
              <template slot-scope="scope">
                <span>{{ wxAccountTypes[scope.row.Type] }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="GroupName"
              label="分组">
            </el-table-column>
            <el-table-column
              prop="AppId"
              label="AppId">
            </el-table-column>
            <el-table-column
              prop="CreateTime"
              label="添加时间">
            </el-table-column>
            <el-table-column
              prop="Status"
              label="状态">
              <template slot-scope="scope">
                <span>{{ statusMap.get(scope.row.Status) }}</span>
              </template>
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              width="200">
              <template slot-scope="scope">
                <el-button @click="edit(scope.row)" class="oper-button">修改</el-button>
                <el-button @click="viewData(scope.row)" type="primary" class="oper-button">查看数据</el-button>
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
    </template>

    <div v-else class="gzh-info-container">
      <el-form :rules="rules" :model="gzhInfo" ref="editForm" label-width="0" :show-message="false" class="gzh-info-form">
        <div v-loading="isSaving" class="gzh-info-group">
          <div class="gzh-info">
            <span class="label">公众号名称</span>
            <el-form-item prop="Name" class="mb-0 value">
              <el-input v-model.trim="gzhInfo.Name" class="form-input"></el-input>
            </el-form-item>
          </div>
          <div class="gzh-info">
            <span class="label">公众号类型</span>
            <el-form-item prop="Type" class="mb-0 value">
              <el-select v-model="gzhInfo.Type" class="form-input">
                <el-option
                  v-for="(value, key) in wxAccountTypes"
                  :key="key"
                  :label="value"
                  :value="key">
                </el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="gzh-info">
            <span class="label">分组</span>
            <el-form-item prop="GroupId" class="mb-0 value">
              <el-select v-model="gzhInfo.GroupId" class="form-input">
                <el-option
                  v-for="item in wxGroup"
                  :key="item.GroupId"
                  :label="item.GroupName"
                  :value="item.GroupId">
                </el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="gzh-info">
            <span class="label">AppId</span>
            <el-form-item prop="AppId" class="mb-0 value">
              <el-input v-model.trim="gzhInfo.AppId" class="form-input"></el-input>
            </el-form-item>
          </div>
          <div class="gzh-info">
            <span class="label">AppSecret</span>
            <el-form-item prop="AppSecret" class="mb-0 value">
              <el-input v-model.trim="gzhInfo.AppSecret" class="form-input"></el-input>
            </el-form-item>
          </div>
          <div class="gzh-info">
            <span class="label">Token（非必填）</span>
            <el-form-item prop="Token" class="mb-0 value">
              <el-input v-model.trim="gzhInfo.Token" class="form-input"></el-input>
            </el-form-item>
          </div>
          <div class="gzh-info">
            <span class="label">状态</span>
            <el-form-item prop="Status" class="mb-0 value">
              <el-select v-model="gzhInfo.Status" class="form-input">
                <el-option
                  v-for="item in statusOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </div>
        </div>
        <div class="buttons">
          <el-button :loading="isSaving" @click="save" type="primary" class="form-button">保存</el-button>
          <el-button :disabled="isSaving" @click="resetGzhInfo" class="form-button">重置</el-button>
          <el-button :disabled="isSaving" @click="cancelEdit" class="form-button">取消</el-button>
        </div>
      </el-form>
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
  name: 'gzh-manage',
  directives: {
    sticky: VueSticky
  },
  data () {
    const statusOptions = [
      {
        id: '1',
        name: '启用'
      }, {
        id: '0',
        name: '禁用'
      }
    ]
    const gzhName = null
    const gzhType = null
    const group = null
    const status = null

    return {
      queryForm: {
        // 公众号名称
        gzhName: gzhName,
        // 公众号类型
        gzhType: gzhType,
        // 分组
        group: group,
        // 状态
        status: status
      },
      // 状态选项
      statusOptions: statusOptions,
      statusMap: new Map(statusOptions.map(item => [item.id, item.name])),

      // 图表数据加载状态
      isListLoading: false,
      // 保存之前的请求参数
      query: deepClone({ gzhName, gzhType, group, status }),
      // 图表原始数据
      rawListData: [],

      // 表格当前页
      tableCurrentPage: 1,
      // 表格一页条数可选项
      tablePageSizeOption: [10, 20, 30],
      // 表格一页条数
      tablePageSize: 20,
      // 总条数
      tableTotalSize: 0,

      // 是否正在编辑
      isEditing: false,
      // 是否正在保存
      isSaving: false,
      // 当前编辑的公众号信息
      gzhInfo: null,
      // 表单验证规则
      rules: {
        Name: [{ required: true, trigger: ['blur'] }],
        GroupId: [{ required: true, trigger: ['change'] }],
        AppId: [{ required: true, trigger: ['blur'] }],
        AppSecret: [{ required: true, trigger: ['blur'] }]
      },
      // 除表格外内容区域高度
      othersHeight: 0
    }
  },
  computed: {
    tableMaxHeight () {
      return Math.max(this.$store.getters.containerHeight - this.othersHeight, 300)
    },
    cachedViews () {
      return this.$store.state.tagsView.cachedViews
    },
    ...mapGetters([
      'wxGroup',
      'wxAccountTypes'
    ])
  },
  created () {
    this.fetchData()
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
      // 克隆当前查询条件
      this.query = deepClone(this.queryForm)
      this.tableCurrentPage = 1
      this.tableTotalSize = 0

      this.fetchList()
    },
    fetchList () {
      // 获取图表数据
      this.isListLoading = true
      this.rawListData = []

      const { gzhName, gzhType, group, status } = this.query

      const postData = {
        type: gzhType,
        group_id: group,
        status: status,
        offset: (this.tableCurrentPage - 1) * this.tablePageSize,
        limit: this.tablePageSize
      }
      gzhName && (postData.name = gzhName)

      Promise.all([
        this.$store.dispatch('getAllGzhOptions'),
        GzhApi.getWXAccountList(postData)
      ]).then(([res1, { data }]) => {
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
        this.tableTotalSize = data.Result.Total
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
    // 新增公众号
    add () {
      this.$refs.editForm && this.$refs.editForm.clearValidate()
      this.gzhInfo = {
        AppId: null,
        AppSecret: null,
        GroupId: null,
        Name: null,
        Status: null,
        Token: null,
        Type: null
      }
    },
    // 修改公众号
    edit (info) {
      this.$refs.editForm && this.$refs.editForm.clearValidate()
      this.gzhInfo = deepClone(info)
    },
    // 查看数据
    viewData (data) {
      if (this.cachedViews.includes('gzh-data-summary')) {
        this.$router.push({ path: '/gzh-data-summary' }, () => {
          this.$nextTick(() => {
            this.$router.replace({ path: '/gzh-data-summary', query: { gzh: data.Id, group: data.GroupId, type: data.Type } })
          })
        })
      } else {
        this.$router.push({ path: '/gzh-data-summary', query: { gzh: data.Id, group: data.GroupId, type: data.Type } })
      }
    },
    // 录入数据
    inputData () {
      this.$router.push({ path: '/gzh-data-entry' })
    },
    // 保存
    save () {
      this.$refs.editForm.validate().then(() => {
        this.isSaving = true

        const postData = {
          name: this.gzhInfo.Name,
          group_id: this.gzhInfo.GroupId,
          app_id: this.gzhInfo.AppId,
          app_secret: this.gzhInfo.AppSecret
        }
        this.gzhInfo.Id && (postData.id = this.gzhInfo.Id)
        this.gzhInfo.Type !== null && (postData.type = this.gzhInfo.Type)
        this.gzhInfo.Token && (postData.token = this.gzhInfo.Token)
        this.gzhInfo.Status !== null && (postData.status = this.gzhInfo.Status)

        GzhApi.setWXAccountData(postData).then(({ data }) => {
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
          this.gzhInfo = null
          this.fetchList()
          this.$store.dispatch('getAllGzhOptions', { isForceUpdateGzh: true })
        }).catch(() => {
          this.isSaving = false
        })
      }).catch(() => {})
    },
    // 重置编辑信息
    resetGzhInfo () {
      this.$refs.editForm.resetFields()
    },
    // 取消编辑
    cancelEdit () {
      this.gzhInfo = null
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
