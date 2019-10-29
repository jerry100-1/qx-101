<template>
  <div class="main">
    <div ref="queryContent" v-sticky="{zIndex: 2001, stickyTop: 0, disabled: false}">
      <div class="header-wrapper">
        <el-form :disabled="isListLoading" :model="queryForm" ref="queryForm" :inline="true" label-width="0" :show-message="false">
          <div class="d-flex justify-content-between">
            <div class="tools flex-shrink-0" style="margin-left: auto">
              <div class="filter-item">
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
              label="ID">
          </el-table-column>
          <el-table-column
              prop="Img"
              label="用户头像">
            <template slot-scope="scope">
              <img :src="scope.row.Img" style="height: 100px;width: 100px"/>
            </template>
          </el-table-column>
          <el-table-column
              prop="Nick"
              label="昵称">
          </el-table-column>
          <el-table-column
              prop="Title"
              label="测算名称">
          </el-table-column>
          <el-table-column
              prop="Type"
              label="测算类型">
            <template slot-scope="scope">
              <span>{{scope.row.Type === '1' ? '八字' : scope.row.Type === '2' ? '看相' : '塔罗牌'}}</span>
            </template>
          </el-table-column>
          <el-table-column
              prop="Price"
              label="支付金额">
          </el-table-column>
          <el-table-column
              prop="CreateTime"
              label="创建时间">
          </el-table-column>
          <el-table-column
              fixed="right"
              label="操作">
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
      <el-form :model="raffle" :rules="rules" ref="raffle">
        <el-form-item label="测算名称" prop="title">
          <el-input v-model="raffle.title" placeholder="请输入测算名称"/>
        </el-form-item>
        <el-form-item label="头像" prop="img">
          <el-upload
              action=""
              :show-file-list="false"
              :http-request="(args) => uploadImg(args)"
              list-type="picture-card">
            <img v-if="raffle.img" :src="raffle.img" class="avatar"/>
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="昵称" prop="nick">
          <el-input v-model="raffle.nick" placeholder="请输入用户昵称" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="raffle.type" class="filter-input">
            <el-option
                v-for="item in typeOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input v-model="raffle.price" placeholder="请输入价格" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="时间" prop="time">
          <div class="block">
            <el-date-picker
                v-model="raffle.time"
                type="datetime"
                placeholder="选择日期时间">
            </el-date-picker>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showAddDialog = false" v-loading="isSaving">取 消</el-button>
        <el-button type="primary" @click="add" v-loading="isSaving">确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import VueSticky from 'vue-sticky'
import ProductApi from '@/api/productApi'
import swal from 'sweetalert2'
import AccountApi from '@/api/Account'
import moment from 'moment'

//  产品端首页图片管理列表
export default {
  name: 'product-fictitious-user-list',
  directives: {
    sticky: VueSticky
  },
  data () {
    const typeOptions = [
      {
        id: '1',
        name: '八字'
      }, {
        id: '2',
        name: '看相'
      }, {
        id: '3',
        name: '塔罗牌'
      }
    ]
    return {
      showAddDialog: false,
      isSaving: false,
      raffle: {
        title: '',
        img: '',
        nick: '',
        type: '',
        price: '',
        time: '',
        id: ''
      },
      rules: {
        title: [
          { required: true, message: '请输入测算名称', trigger: 'blur' }
        ],
        img: [
          { required: true, message: '请上传头像', trigger: 'change' }
        ],
        nick: [
          { required: true, message: '请输入用户昵称', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择测算类型', trigger: 'blur' }
        ],
        price: [
          { required: true, message: '请输入价格', trigger: 'blur' }
        ],
        time: [
          { required: true, message: '请输入创建时间', trigger: 'blur' }
        ]
      },
      queryForm: {
        status: ''
      },
      typeOptions: typeOptions,
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
  filters: {},
  computed: {},
  created () {
    this.fetchData()
  },
  activated () {},
  methods: {
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
    add () {
      console.log('hhh---,add')
      this.$refs.raffle.validate().then(() => {
        this.isSaving = true
        const postData = this.raffle
        postData.time = moment(postData.time).format('YYYY-MM-DD HH:mm:ss')
        ProductApi[this.raffle.id ? 'editVirtualOrder' : 'postVirtualOrder'](postData).then(({ data }) => {
          console.log('hhh---,postBanner:', data)
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
    },
    edit (val) {
      console.log('hhh---,edit:', val)
      this.raffle.title = val.Title
      this.raffle.nick = val.Nick
      this.raffle.type = val.Type
      this.raffle.img = val.Img
      this.raffle.price = val.Price
      this.raffle.time = val.CreateTime
      this.raffle.id = val.Id
      this.showAddDialog = true
    },
    close () {
      this.raffle.title = ''
      this.raffle.nick = ''
      this.raffle.type = ''
      this.raffle.img = ''
      this.raffle.price = ''
      this.raffle.time = ''
      this.raffle.id = ''
    },
    fetchData () {
      // 克隆当前查询条件
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
        page: this.tableCurrentPage,
        limit: this.tablePageSize
      }
      ProductApi.virtualOrderList(postData).then(({ data }) => {
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
