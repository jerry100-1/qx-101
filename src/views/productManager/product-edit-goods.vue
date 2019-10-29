<template>
  <div class="main">
    <div class="form-wrapper" v-loading="isSaving">
      <el-form v-loading="isSaving" :rules="rules" :hide-required-asterisk="true" label-width="120px" :model="form" ref="form">
        <el-form-item label="名称：" prop="title" :show-message="true" class="form-item">
          <el-input v-model.trim="form.title" class="form-input"></el-input>
        </el-form-item>
        <el-form-item label="简称（用于推荐）：" prop="alias" :show-message="true" class="form-item">
          <el-input v-model.trim="form.alias" class="form-input"></el-input>
        </el-form-item>
        <el-form-item label="产品描述：" prop="desc" :show-message="true" class="form-item">
          <el-input v-model.trim="form.desc" class="form-input"></el-input>
        </el-form-item>
        <el-form-item label="分类：" class="form-item">
          <el-select v-model="form.pid" placeholder="请选择" @change="typeSelected">
            <el-option
                v-for="item in productType"
                :key="item.id"
                :label="item.name"
                :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="列表小图：" :show-message="true" prop="uploadIconPath" class="form-item">
          <el-upload style="padding-top: 20px"
                     class="upload-demo"
                     action="https://jsonplaceholder.typicode.com/posts/"
                     :on-preview="handleIconPreview"
                     :on-remove="handleIconRemove"
                     :on-change="handleIcon"
                     :file-list="form.uploadIconPath"
                     :limit=limitPic
                     list-type="picture"
                     :auto-upload="false"
                     ref="iconimg"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <!--<div slot="tip" class="el-upload__tip">图片要求：仅限jpg,jpeg,png格式，最小尺寸{{width}}px*{{height}}px，大小100KB以内</div>-->
          </el-upload>
        </el-form-item>
        <el-form-item label="列表长图：" :show-message="true" prop="uploadImgPath" class="form-item">
          <el-upload style="padding-top: 20px"
                     class="upload-demo"
                     action="https://jsonplaceholder.typicode.com/posts/"
                     :on-preview="handlePreview"
                     :on-remove="handleRemove"
                     :on-change="handleImg"
                     :file-list="form.uploadImgPath"
                     :limit=limitPic
                     list-type="picture"
                     :auto-upload="false"
                     ref="img"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <!--<div slot="tip" class="el-upload__tip">图片要求：仅限jpg,jpeg,png格式，最小尺寸{{width}}px*{{height}}px，大小100KB以内</div>-->
          </el-upload>
        </el-form-item>
        <el-form-item label="原价：" prop="price" :show-message="true" class="form-item">
          <el-input v-model.trim="form.price" class="form-input"></el-input>
          <span style="margin-left: 10px">元</span>
        </el-form-item>
        <el-form-item label="售价：" prop="total_fee" :show-message="true" class="form-item">
          <el-input v-model.trim="form.total_fee" class="form-input"></el-input>
          <span style="margin-left: 10px">元</span>
        </el-form-item>
        <el-form-item label="优先级：" prop="sort" :show-message="true" class="form-item">
          <el-input v-model.trim="form.sort" class="form-input" style="width: 150px"></el-input>
          <span style="padding-left: 20px">数值越大优先级越高</span>
        </el-form-item>
        <el-form-item label="是否热门测算：" prop="Sort" :show-message="true" class="form-item">
          <el-switch
              v-model="form.hot"
              active-color="#13ce66"
              inactive-color="#ff4949">
          </el-switch>
        </el-form-item>
        <el-form-item label="状态：" class="form-item">
          <el-select v-model="form.status" placeholder="请选择">
            <el-option
                v-for="item in statusOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <el-button type="primary" style="margin-top: 20px;margin-left: 50px" @click="submit">保存</el-button>
    <el-button @click="reset">重置</el-button>
    <el-button onclick="history.back()">取消</el-button>
  </div>
</template>

<script>
import VueSticky from 'vue-sticky'
import ProductApi from '@/api/productApi'
import AccountApi from '@/api/Account'
import { deepClone } from '@/utils'

//  修改商品
export default {
  name: 'edit-goods',
  directives: {
    sticky: VueSticky
  },
  data () {
    const statusOptions = [
      {
        id: 'no',
        name: '禁用'
      }, {
        id: 'yes',
        name: '启用'
      }
    ]
    return {
      form: {
        desc: '',
        title: '',
        alias: '',
        price: '',
        total_fee: '',
        pid: '',
        sort: '',
        status: '',
        hot: '',
        id: '',
        uploadImgPath: [],
        uploadIconPath: []

      },
      // 状态选项
      statusOptions: statusOptions,
      // 是否正在编辑
      isEditing: false,
      // 是否正在保存
      isSaving: false,
      // 当前编辑的公众号信息
      productInfo: null,
      // 表单验证规则
      rules: {
        title: [{ required: true, message: '请输入名称', trigger: ['blur'] }],
        desc: [{ required: true, message: '请输入描述', trigger: ['blur'] }],
        alias: [{ required: true, message: '请输入简称', trigger: ['blur'] }],

        price: [{ required: true, message: '请输入原价', trigger: ['blur'] }],
        total_fee: [{ required: true, message: '请输入售价', trigger: ['blur'] }],
        uploadImgPath: [{ required: true, message: '请上传图片', trigger: ['blur'] }],
        uploadIconPath: [{ required: true, message: '请上传图片', trigger: ['blur'] }],
        sort: [{ required: true, message: '请输入排序', trigger: ['blur'] }]
      },
      // 除表格外内容区域高度
      othersHeight: 0,
      id: '',
      limitPic: 1,
      getUrlMsgSuccess: false, // 抓取任务成功
      productType: [] // 产品分类
    }
  },
  computed: {
  },
  created () {
    this.id = this.$route.query.id
    if (this.id) {
      this.form.id = this.id
      this.getProductType()
      this.getInfo()
    }
  },
  mounted () {
  },
  updated () {
  },
  methods: {
    getProductType () {
      ProductApi.getProductType().then(({ data }) => {
        if (data.Status === 200) {
          this.productType = data.Result
        }
      })
    },
    getInfo () {
      this.isSaving = true
      ProductApi.getProductInfo({ id: this.id }).then(({ data }) => {
        this.isSaving = false
        if (data.Status === 200) {
          this.productInfo = data.Result
          this.form.desc = data.Result.description
          this.form.alias = data.Result.alias
          this.form.title = data.Result.name
          this.form.price = data.Result.price
          this.form.total_fee = data.Result.total_fee
          this.form.pid = parseInt(data.Result.pid)
          this.form.sort = data.Result.sort
          this.form.status = data.Result.status
          this.form.hot = data.Result.hot !== '0'
          this.form.uploadImgPath.push({ url: data.Result.img })
          this.form.uploadIconPath.push({ url: data.Result.icon })
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
    submit () {
      console.log('submit')
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.isSaving = true
          this.uploadIcon(0)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    uploadIcon (index) {
      if (index >= this.form.uploadIconPath.length) {
        this.uploadImg(0)
      } else {
        if (this.form.uploadIconPath[index].status === 'success') {
          this.uploadIcon(index + 1)
        } else {
          var formData = new FormData()
          console.log('video update1', this.form.uploadIconPath)
          // 上传视频
          console.log('video update')
          formData.append('file', this.form.uploadIconPath[index].raw)
          AccountApi.uploadImage(formData).then(({ data }) => {
            console.log(data)
            if (data.Status === 200) {
              this.form.uploadIconPath[index].url = data.Result.Link
              this.uploadIcon(index + 1)
            } else {
              this.isSaving = false
              this.$notify({
                title: '提示',
                message: data.Result.ErrorMsg,
                type: 'failed',
                duration: 2000
              })
            }
          })
        }
      }
    },
    uploadImg (index) {
      if (index >= this.form.uploadImgPath.length) {
        this.uploadInfo()
      } else {
        if (this.form.uploadImgPath[index].status === 'success') {
          this.uploadImg(index + 1)
        } else {
          var formData = new FormData()
          console.log('video update1', this.form.uploadImgPath)
          // 上传视频
          console.log('video update')
          formData.append('file', this.form.uploadImgPath[index].raw)
          AccountApi.uploadImage(formData).then(({ data }) => {
            console.log(data)
            if (data.Status === 200) {
              this.form.uploadImgPath[index].url = data.Result.Link
              this.uploadImg(index + 1)
            } else {
              this.isSaving = false
              this.$notify({
                title: '提示',
                message: data.Result.ErrorMsg,
                type: 'failed',
                duration: 2000
              })
            }
          })
        }
      }
    },
    uploadInfo () {
      var params = deepClone(this.form)
      // description: '',
      //   name: '',
      //   price: '',
      //   total_fee: '',
      //   pid: '',
      //   sort: '',
      //   status: '',
      //   hot: '',
      //   id: '',
      params.status = params.status === 'yes' ? '1' : '0'
      params.hot = params.hot ? '1' : '0'
      params.thumb = params.uploadImgPath[0].url
      params.icon = params.uploadIconPath[0].url
      delete params.uploadIconPath
      delete params.uploadImgPath
      ProductApi.editProduct(params).then(({ data }) => {
        this.isSaving = false
        if (data.Status === 200) {
          this.$notify({
            title: '提示',
            message: this.id ? '修改成功' : '添加成功',
            type: 'success',
            duration: 2000
          })
          const route = this.$route
          this.$router.push({ path: '/product-goods-list', query: { refresh: 1 } }, () => {
            this.$store.dispatch('delVisitedViews', route)
          })
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
    reset () {
      this.form = {
        Title: '',
        Desc: '',
        Type: '1',
        Sort: '',
        Status: '1',
        Id: this.id,
        uploadImgPath: [],
        uploadIconPath: []
      }
    },
    handleIconRemove (file, fileList) {
      console.log(file, fileList)
    },
    handleIconPreview (file) {
      console.log(file)
    },
    handleRemove (file, fileList) {
      console.log(file, fileList)
    },
    handlePreview (file) {
      console.log(file)
    },
    handleImg (file, fileList) {
      console.log('handleImg', file, fileList, this.$refs.img)
      this.form.uploadImgPath = fileList
    },
    handleIcon (file, fileList) {
      console.log('handleImg', file, fileList, this.$refs.iconimg)
      this.form.uploadIconPath = fileList
    },
    typeSelected (value) {
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
  padding-bottom: 20px;
  background-color: #fff;
  .form-wrapper {
    .form-item {
      padding-top: 18px;
      &:not(:first-child) {
        border-top: 1px solid #F1F1F1;
      }
    }
    .form-item2 {
    }
    .form-input {
      width: 400px;
    }
    .form-upload {
      width: 400px;
    }
    .content {
      padding: 0 10px;
      border: 1px solid #e4e4e4;
    }
  }
}
</style>
