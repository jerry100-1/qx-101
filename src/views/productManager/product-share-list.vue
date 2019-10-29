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
                  <div class="filter-item ml-3">
                    <label>测算类型：</label>
                    <el-form-item prop="status" class="inline-form-item">
                      <el-select v-model="queryForm.type" class="filter-input">
                        <el-option label="所有类型" :value="''"></el-option>
                        <el-option
                          v-for="item in typeOptions"
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
                  <el-button :loading="isListLoading" @click="showAddDialog = true" type="warning" class="query-button" icon="el-icon-search">新增</el-button>
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
              prop="Id"
              label="ID"
              width="100">
            </el-table-column>
            <el-table-column
              prop="Title"
              label="标题">
            </el-table-column>
            <el-table-column
              prop="Desc"
              label="描述">
            </el-table-column>
            <el-table-column
              prop="Img"
              label="图片">
              <template slot-scope="scope">
                <img v-if="scope.row.Img" :src="scope.row.Img" style="height: 100px;width: 100px"/>
                <div v-else>无图片，使用默认图</div>
              </template>
            </el-table-column>
            <el-table-column
              prop="Type"
              label="类型">
              <template slot-scope="scope">
                <div>{{formatType(scope.row.Type)}}</div>
              </template>
            </el-table-column>
            <el-table-column
              prop="Unlock"
              label="解锁方式">
              <template slot-scope="scope">
                <div>{{formatUnlock(scope.row.Unlock)}}</div>
              </template>
            </el-table-column>
            <el-table-column
                prop="Status"
                label="状态"
                width="100">
              <template slot-scope="scope">
                <el-tag :type="scope.row.Status === '1' ? 'success' : 'danger'">
                  {{scope.row.Status === '1' ? '启用' : '禁用'}}
                </el-tag>
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
    <el-dialog :visible.sync="showAddDialog" v-loading="isSaving" @close="close">
      <el-form :model="raffle" ref="raffle" :rules="rules">
        <el-form-item label="适用测算" prop="type">
          <el-select v-model="raffle.type" class="filter-input">
            <el-option
                v-for="item in typeOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="使用情况" prop="unlock">
          <el-select v-model="raffle.unlock" class="filter-input">
            <el-option
                v-for="item in unlockOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分享图片" prop="img" style="margin-left: 10px">
          <el-upload
              action=""
              :show-file-list="false"
              :http-request="(args) => uploadImg(args)"
              list-type="picture-card">
            <img v-if="raffle.img" :src="raffle.img" class="avatar"/>
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <el-button style="margin-left: 15px;height: 30px;align-self: center" @click="raffle.img = ''">删除图片</el-button>
          <div style="margin-left: 50px;width: 300px">不上传图片则使用默认图（默认图说明：分享测算详情使用列表小图，分享列表页使用平台logo图）</div>
        </el-form-item>
        <el-form-item label="分享标题" prop="title">
          <el-input v-model="raffle.title" placeholder="请填写标题" style="width: 200px"/>
          <div style="margin-left: 50px">支持配置变量用户昵称和测试名称  如：{nickname}要你一起测{testname}</div>
        </el-form-item>
        <el-form-item label="分享描述" prop="title">
          <el-input v-model="raffle.desc" placeholder="请填写描述" style="width: 200px"/>
          <div style="margin-left: 50px">支持配置变量 {testprofile}测算简介</div>
        </el-form-item>
        <el-form-item label="启用状态" prop="title">
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
        <el-button type="primary" @click="save" v-loading="isSaving">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import VueSticky from 'vue-sticky'
import ProductApi from '../../api/productApi'
import swal from 'sweetalert2'
import { deepClone } from '@/utils'
import AccountApi from '../../api/Account'

//  产品端分享配置列表
export default {
  name: 'product-share-list',
  directives: {
    sticky: VueSticky
  },
  data () {
    const unlockOptions = [
      {
        id: '1',
        name: '通用'
      }, {
        id: '2',
        name: '付费解锁'
      }, {
        id: '3',
        name: '分享解锁'
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
    const typeOptions = [
      {
        id: '1',
        name: '全部'
      }, {
        id: '2',
        name: '首页'
      }, {
        id: '3',
        name: '八字测算'
      }, {
        id: '4',
        name: 'AI看相'
      }, {
        id: '5',
        name: 'AI手相'
      }, {
        id: '6',
        name: '塔罗占卜'
      }
    ]
    return {
      rules: {
        title: [
          { required: true, message: '请输入分享标题', trigger: 'blur' }
        ],
        desc: [
          { required: true, message: '请输入分享描述', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择测算类型', trigger: 'blur' }
        ],
        unlock: [
          { required: true, message: '请选择解锁方式', trigger: 'blur' }
        ]
      },
      showAddDialog: false,
      isSaving: false,
      raffle: {
        id: '',
        type: '1',
        status: '1',
        unlock: '1',
        img: '',
        title: '',
        desc: ''
      },
      queryForm: {
        type: '',
        status: ''
      },
      // 状态选项
      statusOptions: statusOptions,
      // 状态选项
      typeOptions: typeOptions,
      // 状态选项
      unlockOptions: unlockOptions,
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
        type: this.queryForm.type,
        page: this.tableCurrentPage,
        limit: this.tablePageSize
      }
      ProductApi.getShareConfigList(postData).then(({ data }) => {
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
    resetQueryForm () {
      this.queryForm.type = ''
      this.queryForm.status = ''
    },
    handleCurrentChange (value) {
      this.fetchList()
    },
    handlePageSizeChange (value) {
      this.tableCurrentPage = 1
      this.tablePageSize = value
      this.fetchList()
    },
    verifyImg (file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG) {
        this.$message.error('上传图片只能是 JPG、PNG或Gif 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    uploadImg (raw) {
      console.log('hhh---,raw:', raw)
      if (!this.verifyImg(raw.file)) {
        return
      }
      const formData = new FormData()
      formData.append('file', raw.file)
      AccountApi.uploadImage(formData, progressEvent => {
        raw.onProgress({ percent: progressEvent.loaded / progressEvent.total * 100 })
      }).then(({ data }) => {
        if (data.Status === 200) {
          raw.onSuccess(data.Result.Link)
          this.raffle.img = data.Result.Link
        } else {
          this.$message({
            type: 'error',
            message: data.Result.ErrorMsg
          })
          raw.onError(new Error(data.Result.ErrorMsg))
        }
      }).catch(error => {
        raw.onError(error)
      })
    },
    formatType (type) {
      return this.typeOptions.find((element) => (element.id === type)).name
    },
    formatUnlock (type) {
      return this.unlockOptions.find((element) => (element.id === type)).name
    },
    edit (val) {
      this.showAddDialog = true
      this.raffle.id = val.Id
      this.raffle.type = val.Type
      this.raffle.status = val.Status
      this.raffle.unlock = val.Unlock
      this.raffle.img = val.Img
      this.raffle.desc = val.Desc
      this.raffle.title = val.Title
    },
    close () {
      this.raffle.id = ''
      this.raffle.type = ''
      this.raffle.status = ''
      this.raffle.unlock = ''
      this.raffle.img = ''
      this.raffle.desc = ''
      this.raffle.title = ''
    },
    save () {
      this.$refs.raffle.validate().then(() => {
        this.isSaving = true
        ProductApi[this.raffle.id ? 'editShareConfig' : 'addShareConfig'](this.raffle).then(({ data }) => {
          console.log('hhh---,save:', data)
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
  /deep/ .el-form-item__content {
    display: flex;
  }
  /deep/ .el-upload--picture-card {
    width: 100px;
    height: 100px;
    line-height: 100px;
  }
  .avatar-uploader {
    width: 100px;
    height: 100px;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
  }
  .avatar {
    margin-top: -5px;
    width: 98px;
    height: 98px;
    border-radius: 6px;
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
