<template>
  <div class="main">
      <div ref="queryContent" v-sticky="{zIndex: 2001, stickyTop: 0, disabled: false}">
        <div class="header-wrapper">
          <el-form :disabled="isListLoading" :model="queryForm" ref="queryForm" :inline="true" label-width="0" :show-message="false">
            <div class="d-flex justify-content-between">
              <div class="filter-wrapper mr-2">
                <div class="filter-container">
                  <div class="filter-item">
                    <label>状态：</label>
                    <el-form-item prop="status" class="inline-form-item">
                      <el-select v-model="queryForm.status" class="filter-input">
                        <el-option label="全部" :value="''"></el-option>
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
                </div>
              </div>
            </div>
          </el-form>
        </div>
      </div>
      <div class="content-wrapper">
        <div class="main-content">
          <el-table
            ref="table"
            :data="rawListData"
            v-loading="isListLoading"
            border
            fit
            highlight-current-row
            style="width: 100%;">
            <el-table-column
              prop="MasterId"
              label="ID"
              width="100">
            </el-table-column>
            <el-table-column
              prop="Name"
              label="联系人"
              width="100">
            </el-table-column>
            <el-table-column
              prop="Mobile"
              label="联系电话"
              width="200">
            </el-table-column>
            <el-table-column
              prop="Type"
              label="入驻类型"
              width="100">
              <template slot-scope="scope">
                <span>{{formatType(scope.row.Type)}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="Desc"
              label="资质简介">
            </el-table-column>
            <el-table-column
                prop="Status"
                label="状态"
                width="100">
              <template slot-scope="scope">
                <el-tag :type="scope.row.Status === '1' ? 'warning' : scope.row.Status === '2' ? 'success' : 'danger'">
                  {{formatStatus(scope.row.Status)}}</el-tag>
              </template>
            </el-table-column>
            <el-table-column
                prop="CreateTime"
                label="创建时间"
                width="200">
            </el-table-column>
            <el-table-column
                fixed="right"
                label="操作"
                width="100">
              <template slot-scope="scope">
                <el-button @click="edit(scope.row)" type="text">编辑</el-button>
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
    <!-- 弹层 添加 修改 -->
    <el-dialog :visible.sync="showAddDialog" v-loading="isSaving">
      <el-form :model="raffle" ref="raffle">
        <el-form-item label="类型" prop="type">
          <el-select v-model="raffle.status" class="filter-input">
            <el-option
                v-for="item in statusOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showAddDialog = false" v-loading="isSaving">取 消</el-button>
        <el-button type="primary" @click="saveStatus" v-loading="isSaving">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import VueSticky from 'vue-sticky'
import ProductApi from '../../api/productApi'
import swal from 'sweetalert2'
import { deepClone } from '@/utils'
//  产品端大师列表
export default {
  name: 'product-master-list',
  directives: {
    sticky: VueSticky
  },
  data () {
    const statusOptions = [
      {
        id: '1',
        name: '待审核'
      }, {
        id: '2',
        name: '审核通过'
      }, {
        id: '3',
        name: '已拒绝'
      }
    ]
    return {
      showAddDialog: false,
      isSaving: false,
      raffle: {
        id: '',
        status: ''
      },
      queryForm: {
        status: ''
      },
      // 状态选项
      statusOptions: statusOptions,
      // 图表数据加载状态
      isListLoading: false,
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
  },
  created () {
    this.fetchData()
  },
  activated () {
  },
  methods: {
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

      const postData = {
        status: this.queryForm.status,
        page: this.tableCurrentPage,
        limit: this.tablePageSize
      }
      ProductApi.getMasterList(postData).then(({ data }) => {
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
        this.tableTotalSize = parseInt(data.Result.Total)
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
    formatType (type) {
      switch (type) {
        case '1':
          return '面相'
        case '2':
          return '手相'
        case '3':
          return '八字'
        case '4':
          return '风水'
        case '5':
          return '星座塔罗'
      }
    },
    formatStatus (type) {
      switch (type) {
        case '1':
          return '待审核'
        case '2':
          return '审核通过'
        case '3':
          return '已拒绝'
      }
    },
    edit (val) {
      this.showAddDialog = true
      this.raffle.id = val.MasterId
      this.raffle.status = val.Status
    },
    saveStatus () {
      console.log('hhh---,add')
      this.$refs.raffle.validate().then(() => {
        this.isSaving = true
        ProductApi.editMasterStatus(this.raffle).then(({ data }) => {
          console.log('hhh---,saveStatus:', data)
          if (data.Status !== 200) {
            swal({
              text: data.Result.ErrorMsg,
              type: 'error',
              timer: 2000,
              showConfirmButton: false
            })
          } else {
            this.showAddDialog = false
            this.fetchData()
          }
          this.isSaving = false
        }).catch(() => {
          this.isSaving = true
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
