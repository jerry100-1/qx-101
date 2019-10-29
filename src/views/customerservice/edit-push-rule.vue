<template>
  <div class="main">
    <div class="title">{{id ? '修改' : '新增'}}推送规则</div>
    <div class="form-wrapper">
      <el-form v-loading="isSaving || isLoading" :rules="rules" :hide-required-asterisk="true" label-width="120px" :model="form" ref="form">
        <el-form-item label="推送主题：" prop="subject" :show-message="false" class="form-item">
          <el-input v-model.trim="form.subject" class="form-input"></el-input>
        </el-form-item>
        <el-form-item label="公众号：" prop="gzh" :show-message="false" class="form-item">
          <tree-transfer
            v-model="form.gzh"
            :source="gzhList"
            :width="400"
            placeholder=""
            :show-shortcut="true">
          </tree-transfer>
        </el-form-item>
        <el-form-item label="推送对象：" class="form-item">
          <div>全部48小时内活跃粉丝</div>
        </el-form-item>
        <el-form-item label="推送时间：" prop="timeType" :show-message="false" class="form-item">
          <el-select v-model="form.timeType" class="form-input">
            <el-option
              v-for="item in timeTypeOptions"
              :key="item.value"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="form.timeType === 1" prop="time" :show-message="false" class="form-item2">
          触发动作后间隔
          <el-input v-model.trim="form.time" style="width: 150px;"></el-input>
          分钟推送消息给粉丝
        </el-form-item>
        <el-form-item v-else-if="form.timeType === 2" prop="time" :show-message="false" class="form-item2">
          每天
          <el-input v-model.trim="form.time" placeholder="格式08:00" style="width: 300px;"></el-input>
          推送消息给粉丝
        </el-form-item>
        <el-form-item v-else-if="form.timeType === 3" prop="time" :show-message="false" class="form-item2">
          指定时间点
          <el-date-picker
            v-model="form.time"
            type="datetime"
            :editable="false"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="请选择时间点">
          </el-date-picker>
          推送消息给粉丝（示例：<span style="color: #F56C6C;">2019-02-15 19:30:00</span>）
        </el-form-item>
        <el-form-item label="推送图文：" class="form-item">
          <div class="content">
            <el-form-item label="文章标题：" prop="articleTitle" :show-message="false" class="form-item">
              <el-input v-model.trim="form.articleTitle" class="form-input"></el-input>
            </el-form-item>
            <el-form-item label="文章描述：" prop="articleDesc" :show-message="false" class="form-item">
              <el-input v-model.trim="form.articleDesc" class="form-input"></el-input>
            </el-form-item>
            <el-form-item label="跳转地址：" prop="articleUrl" :show-message="false" class="form-item">
              <el-input v-model.trim="form.articleUrl" class="form-input"></el-input>
            </el-form-item>
            <el-form-item label="图片：" :show-message="false" class="form-item">
              <el-upload
                ref="upload"
                class="form-upload"
                accept=".jpg,.jpeg,.png"
                name="ArticleImageUrl"
                action=""
                :http-request="uploadImage"
                :on-change="handleChange"
                :on-exceed="handleExceed"
                :file-list="fileList"
                :auto-upload="false"
                :multiple="false"
                :limit="1"
                list-type="picture">
                <el-button type="success" icon="el-icon-plus" style="width: 150px;">上传图片</el-button>
              </el-upload>
            </el-form-item>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="save" style="width: 200px;">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import VueSticky from 'vue-sticky'
import TreeTransfer from '@/components/report/tree-transfer'
import * as CustomerServiceApi from '@/api/customerservice'
import swal from 'sweetalert2'
import eventBus from '@/utils/eventBus'

const checkMultipleNumber = (rule, value, callback) => {
  if (value && !/^([1-9]\d*)(\|[1-9]\d*)*$/.test(value)) {
    callback(new Error('格式不正确'))
  } else {
    callback()
  }
}
const checkMultipleTime = (rule, value, callback) => {
  if (value && !/^([0-1][0-9]|2[0-3]):([0-5][0-9])(\|([0-1][0-9]|2[0-3]):([0-5][0-9]))*$/.test(value)) {
    callback(new Error('格式不正确'))
  } else {
    callback()
  }
}

export default {
  name: 'edit-push-rule',
  directives: {
    sticky: VueSticky
  },
  components: {
    TreeTransfer
  },
  data () {
    return {
      id: null,
      gzhList: [],
      timeTypeOptions: [
        {
          name: '按时间间隔推送',
          value: 1
        }, {
          name: '定时每天推送',
          value: 2
        }, {
          name: '定时单次推送',
          value: 3
        }
      ],
      form: {
        subject: null,
        gzh: [],
        timeType: null,
        time: null,
        articleTitle: null,
        articleDesc: null,
        articleUrl: null
      },
      fileList: [],

      isLoading: false,
      // 是否正在保存
      isSaving: false,
      // 表单验证规则
      rules: {
        subject: [{ required: true, trigger: ['blur', 'change'] }],
        gzh: [{ required: true, trigger: ['blur', 'change'] }],
        timeType: [{ required: true, trigger: ['blur', 'change'] }],
        time: [{ required: false, trigger: ['blur', 'change'] }],
        articleTitle: [{ required: true, trigger: ['blur', 'change'] }],
        articleDesc: [{ required: true, trigger: ['blur', 'change'] }],
        articleUrl: [{ required: true, trigger: ['blur', 'change'] }]
      }
    }
  },
  computed: {
  },
  watch: {
    'form.timeType': function (val, oldVal) {
      if (val === 1) {
        this.$set(this.rules, 'time', [{ required: true, trigger: ['blur', 'change'] }, { validator: checkMultipleNumber, trigger: ['blur', 'change'] }])
      } else if (val === 2) {
        this.$set(this.rules, 'time', [{ required: true, trigger: ['blur', 'change'] }, { validator: checkMultipleTime, trigger: ['blur', 'change'] }])
      } else if (val === 3) {
        this.$set(this.rules, 'time', [{ required: true, trigger: ['blur', 'change'] }])
      } else {
        this.$set(this.rules, 'time', [{ required: false, trigger: ['blur', 'change'] }])
      }
      this.$set(this.form, 'time', null)
    }
  },
  created () {
    this.id = this.$route.query.id
    this.loadData()
  },
  mounted () {
  },
  methods: {
    loadData () {
      this.isLoading = true
      Promise.all([
        CustomerServiceApi.getAppidAndName(),
        this.id ? CustomerServiceApi.getWechatNoticeById({ Id: this.id }) : Promise.resolve({})
      ]).then(([{ data: gzhData }, { data }]) => {
        this.isLoading = false
        if (gzhData.Status === 200) {
          this.gzhList = gzhData.Result.List.map(item => ({
            id: item.AppId,
            label: item.WeChatName,
            fullLabel: item.WeChatName,
            disabled: false,
            raw: item
          }))
        }
        if (data) {
          if (data.Status !== 200) {
            swal({
              text: data.Result.ErrorMsg,
              type: 'error',
              timer: 2000,
              showConfirmButton: false
            })
            return
          }
          const gzhArr = data.Result.GzhIds.split(',')
          this.$set(this.form, 'subject', data.Result.Subject)
          this.$set(this.form, 'gzh', this.gzhList.filter(item => gzhArr.indexOf(item.id) > -1))
          this.$set(this.form, 'timeType', +data.Result.TimeType)
          this.$nextTick(() => {
            this.$set(this.form, 'time', data.Result.Time)
          })
          try {
            const content = JSON.parse(data.Result.Content)
            this.$set(this.form, 'articleTitle', content.title)
            this.$set(this.form, 'articleDesc', content.Desc)
            this.$set(this.form, 'articleUrl', content.Url)
            this.fileList.push({ url: content.ImageUrl })
          } catch (e) {}
        }
      }).catch(error => {
        swal({
          text: error.message,
          type: 'error',
          timer: 2000,
          showConfirmButton: false
        })
        this.isLoading = false
      })
    },
    handleChange (file, fileList) {
      const fileTypeAllowable = ['image/jpeg', 'image/png'].indexOf(file.raw.type) !== -1
      if (!fileTypeAllowable) {
        this.$message({
          message: '仅允许上传jpg/png文件',
          type: 'error'
        })
        this.$refs.upload.clearFiles()
      }
    },
    handleExceed (files, fileList) {
      const fileArray = []
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const fileTypeAllowable = ['image/jpeg', 'image/png'].indexOf(file.type) !== -1
        if (!fileTypeAllowable) {
          this.$message({
            message: '仅允许上传jpg/png文件',
            type: 'error'
          })
          continue
        }
        file.uid = Date.now()
        fileArray.push({
          name: file.name,
          percentage: 0,
          raw: file,
          size: file.size,
          status: 'ready',
          uid: file.uid,
          url: URL.createObjectURL(file)
        })
      }
      if (fileArray.length > 0) {
        this.$refs.upload.clearFiles()
        this.$nextTick(() => {
          this.$refs.upload.uploadFiles.push(...fileArray)
        })
      }
    },
    // 保存
    save () {
      this.$refs.form.validate().then(() => {
        if (this.$refs.upload.uploadFiles.length === 0) {
          swal({
            text: '未上传图片',
            type: 'error',
            timer: 2000,
            showConfirmButton: false
          })
          return
        }
        if (this.$refs.upload.uploadFiles.filter(item => item.status === 'ready').length > 0) {
          this.$refs.upload.submit()
        } else {
          this.uploadImage({})
        }
      }).catch(() => {})
    },
    uploadImage ({ file }) {
      this.isSaving = true
      const formData = new FormData()
      formData.append('Subject', this.form.subject)
      formData.append('GzhIds', this.form.gzh.map(item => item.id).join(','))
      formData.append('TimeType', this.form.timeType)
      formData.append('Time', this.form.time)
      formData.append('ArticleTitle', this.form.articleTitle)
      formData.append('ArticleDesc', this.form.articleDesc)
      formData.append('ArticleUrl', this.form.articleUrl)
      if (file) {
        formData.append('ArticleImageUrl', file)
      } else {
        formData.append('ImageUrl', this.fileList[0].url)
      }
      this.id && formData.append('Id', this.id)

      CustomerServiceApi[this.id ? 'editWechatNotice' : 'addWechatNotice'](formData).then(({ data }) => {
        this.isSaving = false
        if (data.Status !== 200) {
          this.$refs.upload.uploadFiles.map(item => {
            item.status = 'ready'
          })
          swal({
            text: data.Result.ErrorMsg,
            type: 'error',
            timer: 2000,
            showConfirmButton: false
          })
          return false
        }
        swal({
          text: '保存成功',
          type: 'success',
          timer: 2000,
          showConfirmButton: false
        })
        const route = this.$route
        this.$router.push({ path: '/push-customer-service' }, () => {
          if (this.id) {
            eventBus.$emit('refreshCustomerServiceList', true)
          } else {
            eventBus.$emit('refreshCustomerServiceList', false)
          }
          this.$store.dispatch('delVisitedViews', route)
        })
      }).catch(error => {
        this.isSaving = false
        swal({
          text: error.message,
          type: 'error',
          timer: 2000,
          showConfirmButton: false
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
.main {
  width: 100%;
  height: 100%;
  padding: 20px;
  background-color: #ffffff;
  .title {
    font-size: 16px;
    font-weight: bold;
    padding-bottom: 20px;
    border-bottom: 1px solid #e4e4e4;
  }
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
