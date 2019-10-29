<template>
  <div class="main">
    <!-- <div ref="queryContent" v-sticky="{zIndex: 2001, stickyTop: 0, disabled: false}">
      <div class="header-wrapper">
        <div class="d-flex justify-content-between">
          <div class="filter-wrapper mr-2">
            <div class="filter-container">
              <div class="filter-item mr-3">
                <label>URL：</label>
                <el-input v-model.trim="url" class="filter-input" style="width: 400px;"></el-input>
              </div>
              <div class="filter-item mr-3">
                <label>关联跳转ID：</label>
                <el-input v-model.trim="jumpId" class="filter-input" style="width: 400px;" placeholder="每个ID以英文分号结尾"></el-input>
              </div>
              <div class="filter-item">
                <label>状态：</label>
                <el-select v-model="status" class="filter-input">
                  <el-option label="全部" :value="null"></el-option>
                  <el-option
                    v-for="item in statusOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
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
      </div>
    </div> -->
    <div class="content-wrapper">
      <div class="main-content">
        <div class="button-wrapper">
          <el-button :disabled="isListLoading" @click="add" type="primary" class="tool-button">新增后退链接</el-button>
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
            prop="UrlId"
            label="ID">
          </el-table-column>
          <el-table-column
            prop="Url"
            label="URL">
          </el-table-column>
          <el-table-column
            prop="jumpId"
            label="关联跳转ID">
          </el-table-column>
          <el-table-column
            prop="Del"
            label="状态">
            <template slot-scope="scope">
              <span>{{ scope.row.Del > 0 ? '已启用' : '已禁用' }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="200">
            <template slot-scope="scope">
              <el-button :disabled="isSaving" @click="edit(scope.row)" class="oper-button">修改</el-button>
              <el-button :disabled="isSaving && linkInfo.urlId !== scope.row.UrlId" :loading="isSaving && linkInfo.urlId === scope.row.UrlId" @click="editStatus(scope.row)" class="oper-button" :type="scope.row.Del > 0 ? 'danger' : 'success'">{{ scope.row.Del > 0 ? '禁用' : '启用' }}</el-button>
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
    <el-dialog
      :visible.sync="editDialogVisible"
      center
      @open="handleEditDialogOpen">
      <el-form @submit.native.prevent :disabled="isSaving" :rules="rules" :hide-required-asterisk="true" label-width="110px" :model="linkInfo" ref="editForm">
        <el-form-item label="关联跳转ID" prop="jumpId" :show-message="false">
          <el-input v-model.trim="linkInfo.jumpId" placeholder="每个ID以英文分号结尾"></el-input>
        </el-form-item>
        <el-form-item label="链接地址" prop="url" :show-message="false">
          <el-input v-model.trim="linkInfo.url"></el-input>
        </el-form-item>
        <el-form-item label="是否启用" prop="del" :show-message="false">
          <el-switch
            v-model="linkInfo.del"
            active-color="#67C23A"
            inactive-color="#F56C6C"
            :active-value="1"
            :inactive-value="0"
            active-text="启用"
            inactive-text="禁用">
          </el-switch>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button :loading="isSaving" type="primary" @click="save">保存</el-button>
        <el-button :disabled="isSaving" @click="editDialogVisible = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import VueSticky from 'vue-sticky'
import * as AdApi from '@/api/ad'
import { deepClone } from '@/utils'
import swal from 'sweetalert2'

export default {
  name: 'h5-links',
  directives: {
    sticky: VueSticky
  },
  data () {
    return {
      url: null,
      jumpId: null,
      status: null,
      statusOptions: [
        {
          id: 1,
          name: '已启用'
        }, {
          id: 0,
          name: '已禁用'
        }
      ],

      editDialogVisible: false,

      // 图表数据加载状态
      isListLoading: false,
      // 图表原始数据
      rawListData: [],

      query: {
        url: null,
        jumpId: null,
        status: null
      },

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
      // 当前编辑的链接信息
      linkInfo: {
        urlId: null,
        url: null,
        jumpId: null,
        del: 1
      },
      // 表单验证规则
      rules: {
        jumpId: [{ required: true, trigger: ['blur'] }],
        url: [{ required: true, trigger: ['blur'] }]
      },
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
    resetQueryForm () {
      this.url = null
      this.jumpId = null
      this.status = null
    },
    fetchData () {
      // 克隆当前查询条件
      // const { url, jumpId, status } = this
      // this.query = deepClone({ url, jumpId, status })
      this.tableCurrentPage = 1
      this.tableTotalSize = 0
      this.fetchList()
    },
    fetchList () {
      // 获取图表数据
      this.isListLoading = true
      this.rawListData = []

      // const { url, jumpId, status } = this.query

      const postData = {
        offset: (this.tableCurrentPage - 1) * this.tablePageSize,
        limit: this.tablePageSize
      }

      AdApi.getUrlList(postData).then(({ data }) => {
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
    // 新增链接
    add () {
      this.linkInfo = {
        urlId: null,
        url: null,
        jumpId: null,
        del: 1
      }
      this.editDialogVisible = true
    },
    // 修改链接
    edit (data) {
      this.linkInfo = {
        urlId: data.UrlId,
        url: data.Url,
        jumpId: data.jumpId,
        del: parseInt(data.Del)
      }
      this.editDialogVisible = true
    },
    handleEditDialogOpen () {
      this.$nextTick(() => {
        this.$refs.editForm.clearValidate()
      })
    },
    // 保存
    save () {
      this.$refs.editForm.validate().then(() => {
        this.isSaving = true

        const postData = {
          url: this.linkInfo.url,
          jumpId: this.linkInfo.jumpId,
          delete: this.linkInfo.del
        }
        this.linkInfo.urlId && (postData.urlId = this.linkInfo.urlId)

        AdApi.setUrl(postData).then(({ data }) => {
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
          this.linkInfo = {
            urlId: null,
            url: null,
            jumpId: null,
            del: 1
          }
          this.editDialogVisible = false
          if (postData.urlId) {
            this.fetchList()
          } else {
            this.fetchData()
          }
        }).catch(() => {
          this.isSaving = false
        })
      }).catch(() => {})
    },
    editStatus (data) {
      this.linkInfo = {
        urlId: data.UrlId,
        url: data.Url,
        jumpId: data.jumpId,
        del: data.Del > 0 ? 0 : 1
      }
      const postData = {
        urlId: data.UrlId,
        url: data.Url,
        jumpId: data.jumpId,
        delete: data.Del > 0 ? 0 : 1
      }

      this.$confirm(`确定要${data.Del > 0 ? '禁用' : '启用'}链接${data.Url}？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.isSaving = true
        AdApi.setUrl(postData).then(({ data }) => {
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
          this.linkInfo = {
            urlId: null,
            url: null,
            jumpId: null,
            del: 1
          }
          this.fetchList()
        }).catch(() => {
          this.isSaving = false
        })
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
  background-color: #ffffff;
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
</style>
