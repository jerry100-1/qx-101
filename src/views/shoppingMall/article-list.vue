<template>
  <div class="main">
      <div ref="queryContent" v-sticky="{zIndex: 2001, stickyTop: 0, disabled: false}">
        <div class="header-wrapper">
          <el-form :disabled="isListLoading" :model="queryForm" ref="queryForm" :inline="true" label-width="0" :show-message="false">
            <div class="d-flex justify-content-between">
              <div class="filter-wrapper mr-2">
                <div class="filter-container">
                  <div class="filter-item mr-3">
                    <label>标题：</label>
                    <el-form-item prop="gzhName" class="inline-form-item">
                      <el-input v-model.trim="queryForm.title" class="filter-input" clearable></el-input>
                    </el-form-item>
                  </div>
                  <div class="filter-item mr-3">
                    <label>类型：</label>
                    <el-form-item prop="group" class="inline-form-item">
                      <el-select v-model="queryForm.type" class="filter-input">
                        <el-option label="全部" :value="null"></el-option>
                        <el-option
                          v-for="item in typeOptions"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id">
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
            <el-button :disabled="isListLoading" @click="add" type="primary" class="tool-button">新增文章</el-button>
          </div>
          <el-table
            ref="table"
            :data="rawListData"
            v-loading="isListLoading"
            border
            fit
            highlight-current-row
            style="width: 100%;"
            >
            <el-table-column
              prop="Id"
              label="ID"
              width="50"
            >
            </el-table-column>
            <el-table-column
              prop="Title"
              label="文章标题">
            </el-table-column>
            <el-table-column
              prop="Type"
              width="80"
              label="类型">
              <template slot-scope="scope">
                <span>{{ formatType(scope.row.Type) }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="Desc"
              label="简介">
            </el-table-column>
            <el-table-column
              prop="CreateTime"
              label="添加时间">
            </el-table-column>
            <el-table-column
                prop="Sort"
                label="排序"
                width="80"
            >
            </el-table-column>
            <el-table-column
              prop="Status"
              label="状态"
              width="100"
            >
              <template slot-scope="scope">
                <span>{{ scope.row.Status == 0 ? '禁用' : '启用' }}</span>
              </template>
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              width="200">
              <template slot-scope="scope">
                <el-button @click="edit(scope.row)" class="oper-button">修改</el-button>
                <el-button @click="updateArticleStatus(scope.row)" type="primary" class="oper-button">{{scope.row.Status == 0 ? '启用' : '禁用'}}</el-button>
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
import * as ArticleApi from '@/api/article'
import swal from 'sweetalert2'
import { deepClone } from '@/utils'
//  文章列表
export default {
  name: 'article-list',
  directives: {
    sticky: VueSticky
  },
  data () {
    const statusOptions = [
      {
        id: '0',
        name: '禁用'
      }, {
        id: '1',
        name: '启用'
      }
    ]
    const typeOptions = [
      {
        id: '1',
        name: '八字测算'
      }, {
        id: '2',
        name: 'AI看相'
      }, {
        id: '4',
        name: '塔罗'
      }
    ]
    const title = null
    const status = null
    const type = null

    return {
      queryForm: {
        // 公众号名称
        title: title,
        // 类型
        type: type,
        // 状态
        status: status
      },
      // 状态选项
      statusOptions: statusOptions,
      typeOptions: typeOptions,
      statusMap: new Map(statusOptions.map(item => [item.id, item.name])),

      // 图表数据加载状态
      isListLoading: false,
      // 保存之前的请求参数
      query: deepClone({ title, type, status }),
      // 图表原始数据
      rawListData: [],

      // 表格当前页
      tableCurrentPage: 1,
      // 表格一页条数可选项
      tablePageSizeOption: [10, 20, 30],
      // 表格一页条数
      tablePageSize: 20,
      // 总条数
      tableTotalSize: 0
    }
  },
  filters: {

  },
  computed: {
    cachedViews () {
      return this.$store.state.tagsView.cachedViews
    }
  },
  created () {
    this.fetchData()
  },
  activated () {
    if (this.$route.query.refresh === 1) {
      this.fetchList()
    }
  },
  methods: {
    updateArticleStatus (info) {
      this.isListLoading = true
      let postData = {
        id: info.Id,
        status: parseInt(info.Status) === 1 ? 0 : 1
      }
      ArticleApi.updateArticleStatus(postData).then(({ data }) => {
        this.isListLoading = false
        if (data.Status === 200) {
          info.Status = postData.status
        } else {
          this.$notify({
            title: '提示',
            message: data.Result.ErrorMsg,
            type: 'failed',
            duration: 2000
          })
        }
      })
    },
    formatType (type) {
      var typeStr = ''
      this.typeOptions.forEach(item => {
        if (item.id === type) {
          typeStr = item.name
        }
      })
      return typeStr
    },
    // 重置查询
    resetQueryForm () {
      // this.$refs.queryForm.resetFields()
      this.queryForm.title = null
      this.queryForm.type = null
      this.queryForm.status = null
    },
    fetchData () {
      // 克隆当前查询条件
      console.log(this.queryForm)
      this.query = deepClone(this.queryForm)
      this.tableCurrentPage = 1
      this.tableTotalSize = 0

      this.fetchList()
    },
    fetchList () {
      // 获取图表数据
      this.isListLoading = true
      this.rawListData = []
      console.log(this.query)
      const { type, title, status } = this.query

      const postData = {
        type: type,
        title: title,
        status: status,
        page: this.tableCurrentPage,
        limit: this.tablePageSize
      }
      ArticleApi.getArticleList(postData).then(({ data }) => {
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
        this.rawListData = data.Result.data
        this.tableTotalSize = parseInt(data.Result.count)
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
    // 新增文章
    add () {
      this.$store.dispatch('delCachedViews', this.$router.match('/edit-article')).then(() => {
        this.$nextTick(() => {
          this.$router.push('edit-article')
        })
      })
    },
    // 修复文章
    edit (info) {
      this.$store.dispatch('delCachedViews', this.$router.match('/edit-article')).then(() => {
        this.$nextTick(() => {
          this.$router.push({ path: 'edit-article', query: { id: info.Id } })
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
