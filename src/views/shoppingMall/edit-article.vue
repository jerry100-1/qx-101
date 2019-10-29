<template>
  <div class="main">
    <div class="form-wrapper" v-loading="isSaving">
      <el-form v-loading="isSaving" :rules="rules" :hide-required-asterisk="true" label-width="120px" :model="form" ref="form">
        <el-form-item label="标题：" prop="Title" :show-message="true" class="form-item">
          <el-input v-model.trim="form.Title" class="form-input"></el-input>
        </el-form-item>
        <el-form-item label="链接：" prop="Url" :show-message="true" class="form-item">
          <el-input v-model.trim="form.Url" class="form-input"></el-input>
          <el-button size="small" type="primary" style="margin-left: 20px" v-if="!id && !getUrlMsgSuccess" @click="getUrlContent">点击抓取</el-button>
        </el-form-item>
        <el-form-item label="简介：" prop="Desc" :show-message="true" class="form-item">
          <el-input v-model.trim="form.Desc" class="form-input"></el-input>
        </el-form-item>
        <el-form-item label="样式类型：" class="form-item">
          <el-select v-model="form.Type" placeholder="请选择" @change="typeSelected">
            <el-option
                v-for="item in typeOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="图片：" :show-message="true" prop="uploadImgPath" class="form-item">
          <el-upload style="padding-top: 20px"
                     class="upload-demo"
                     action="https://jsonplaceholder.typicode.com/posts/"
                     :on-preview="handlePreview"
                     :on-remove="handleRemove"
                     :on-change="handleImg"
                     :file-list="form.uploadImgPath"
                     :limit = limitPic
                     list-type="picture"
                     :auto-upload="false"
                     ref="img"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <!--<div slot="tip" class="el-upload__tip">图片要求：仅限jpg,jpeg,png格式，最小尺寸{{width}}px*{{height}}px，大小100KB以内</div>-->
          </el-upload>
        </el-form-item>
        <el-form-item label="排序：" prop="Sort" :show-message="true" class="form-item">
          <el-input v-model.trim="form.Sort" class="form-input" style="width: 150px"></el-input>
          <span style="padding-left: 20px">数值越大优先级越高</span>
        </el-form-item>
        <el-form-item label="状态：" class="form-item">
          <el-select v-model="form.Status" placeholder="请选择">
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
import AccountApi from '@/api/Account'
import * as ArticleApi from '@/api/article'

//  文章列表
export default {
  name: 'edit-article',
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
        name: 'AI面相'
      }, {
        id: '4',
        name: '塔罗'
      }
    ]
    return {
      form: {
        Title: '',
        Url: '',
        Desc: '',
        Type: '1',
        Sort: '',
        Status: '1',
        Id: '',
        uploadImgPath: []
      },
      // 状态选项
      statusOptions: statusOptions,
      typeOptions: typeOptions,
      // 是否正在编辑
      isEditing: false,
      // 是否正在保存
      isSaving: false,
      // 当前编辑的公众号信息
      gzhInfo: null,
      // 表单验证规则
      rules: {
        Title: [{ required: true, message: '请输入标题', trigger: ['blur'] }],
        Url: [{ required: true, message: '请输入链接地址', trigger: ['blur'] }],
        Desc: [{ required: true, message: '请输入简介', trigger: ['blur'] }],
        uploadImgPath: [{ required: true, message: '请上传图片', trigger: ['blur'] }],
        Sort: [{ required: true, message: '请输入排序', trigger: ['blur'] }]
      },
      // 除表格外内容区域高度
      othersHeight: 0,
      id: '',
      limitPic: 1,
      getUrlMsgSuccess: false// 抓取任务成功
    }
  },
  computed: {
  },
  created () {
    this.id = this.$route.query.id
    if (this.id) {
      this.form.Id = this.id
      this.getInfo()
    }
  },
  mounted () {
  },
  updated () {
  },
  methods: {
    getUrlContent () {
      const url = this.form.Url
      if (this.isSaving) {
        return
      }
      this.isSaving = true
      ArticleApi.getUrlMsg({ url: url }).then(({ data }) => {
        this.isSaving = false
        if (data.Status === 200) {
          this.getUrlMsgSuccess = true
          this.form.uploadImgPath = []
          this.form.uploadImgPath.push({ url: data.Result.imgUrl })
          this.form.Title = data.Result.title
          this.form.Desc = data.Result.desc
        } else {
          this.$notify({
            title: '提示',
            message: data.Result.ErrorMsg,
            type: 'failed',
            duration: 2000
          })
        }
      }).catch(() => {
        this.isSaving = false
      })
    },
    getInfo () {
      this.isSaving = true
      ArticleApi.getArticleInfo({ id: this.id }).then(({ data }) => {
        this.isSaving = false
        if (data.Status === 200) {
          this.form.Title = data.Result.Title
          this.form.Url = data.Result.Link
          this.form.Desc = data.Result.Desc
          this.form.Type = data.Result.Type
          this.form.Sort = data.Result.Sort
          this.form.Status = data.Result.Status
          this.form.uploadImgPath.push({ url: data.Result.CoverImg })
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
          this.uploadImg(0)
        } else {
          console.log('error submit!!')
          return false
        }
      })
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
      var imgUrl = ''
      this.form.uploadImgPath.forEach(item => {
        imgUrl += item.url + ','
      })
      imgUrl = imgUrl.substring(0, imgUrl.length - 1)
      // var params = deepClone(this.form)
      const postData = {
        title: this.form.Title,
        type: this.form.Type,
        coverImg: imgUrl,
        desc: this.form.Desc,
        link: this.form.Url,
        sort: this.form.Sort,
        status: this.form.Status
      }
      var method = 'addArticle'
      if (this.id) {
        method = 'editArticle'
        postData['id'] = this.id
      }
      ArticleApi[method](postData).then(({ data }) => {
        this.isSaving = false
        if (data.Status === 200) {
          this.$notify({
            title: '提示',
            message: this.id ? '修改成功' : '添加成功',
            type: 'success',
            duration: 2000
          })
          const route = this.$route
          this.$router.push({ path: '/article-list', query: { refresh: 1 } }, () => {
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
        Url: '',
        Desc: '',
        Type: '1',
        Sort: '',
        Status: '1',
        Id: this.id,
        uploadImgPath: []
      }
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
