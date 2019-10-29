<template>
  <div :class="$style.turntableprize">
    <el-row :class="$style.padding">
      <el-col :span="20">
        <h4>抽奖设置</h4>
      </el-col>
      <el-col :span="4" style="text-align: right">
        <el-button type="primary" size="medium" @click="handleAdd('add')">新增抽奖</el-button>
      </el-col>
    </el-row>
    <el-table
        :data="tableData"
        stripe
        border
        :class="$style.turntable">
      <el-table-column
          prop="Id"
          label="Id"
          width="80">
      </el-table-column>
      <el-table-column
          prop="Title"
          label="标题"
          width="180">
      </el-table-column>
      <el-table-column
          prop="Type"
          label="分类"
          width="100">
        <template slot-scope="scope">
          {{parseInt(scope.row.Type) === 1 ? 'H5抽奖' : ''}}
        </template>
      </el-table-column>
      <el-table-column
          prop="ImgUrl"
          label="图片">
        <template slot-scope="scope">
          <img :src="scope.row.ImgUrl" style="width: 100%">
        </template>
      </el-table-column>
      <el-table-column
          prop="Url"
          label="跳转链接">
      </el-table-column>
      <el-table-column
          prop="TurnplateUrl"
          label="转盘图片">
        <template slot-scope="scope">
          <img :src="scope.row.TurnplateUrl" style="width: 100%">
        </template>
      </el-table-column>
      <el-table-column
          prop="Time"
          label="每日次数">
      </el-table-column>
      <el-table-column
          prop="Desc"
          label="备注">
      </el-table-column>
      <el-table-column
          prop="Desc"
          label="状态">
        <template slot-scope="scope">
          {{parseInt(scope.row.Active) === 1 ? '开启' : '关闭'}}
        </template>
      </el-table-column>
      <el-table-column
          prop="CreateTime"
          label="创建时间">
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <el-button
              size="mini"
              @click="handleAdd('edit', scope.$index, scope.row)">编辑
          </el-button>
          <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <div :class="$style.pagination">
      <el-pagination
          background
          layout="prev, pager, next"
          :total="total"
          @current-change="handleCurrentChange">
      </el-pagination>
    </div>

    <!-- 弹层 添加 修改 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :before-close="handleBeforeClose">
      <el-form :model="raffle" :rules="rules" ref="raffle">
        <el-form-item label="标题" :label-width="formLabelWidth" prop="title">
          <el-input v-model="raffle.title" placeholder="请输入标题"/>
        </el-form-item>
        <el-form-item label="抽奖类型" :label-width="formLabelWidth" prop="type">
          <el-select v-model="raffle.type" placeholder="请选择抽奖类型">
            <el-option label="H5抽奖" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="抽奖次数" :label-width="formLabelWidth" prop="time">
          <el-input v-model="raffle.time" placeholder="请输入每日抽奖次数" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="抽奖封面" :label-width="formLabelWidth" prop="img">
          <el-upload
              class="upload-demo"
              action="http://apigx.meite.com/"
              :data="{param: 'img'}"
              :http-request="uploadImg"
              :file-list="filelist.img"
              list-type="picture"
              :limit="1"
              :on-exceed="handleExceed">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="转盘图片" :label-width="formLabelWidth" prop="turnplateImg">
          <el-upload
              class="upload-demo"
              action="http://apigx.meite.com/"
              :data="{param: 'turnplateImg'}"
              :http-request="uploadImg"
              :file-list="filelist.turnplateImg"
              list-type="picture"
              :limit="1"
              :on-exceed="handleExceed">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="跳转地址" :label-width="formLabelWidth" prop="url">
          <el-input v-model="raffle.url" placeholder="请输入跳转地址" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth" prop="desc">
          <el-input v-model="raffle.desc" placeholder="请输入备注" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="显示" :label-width="formLabelWidth" prop="status">
          <el-switch v-model="raffle.status"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="dialogStatus === 'add' ? saveRaffle('raffle') : editRaffle('raffle')">确 定
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { TurnplateApi, UploadFile } from '../../api/api'

function validateNull (rule, value, callback) {
  if (value.trim() === '') {
    callback(new Error(rule.message))
  } else {
    callback()
  }
}

export default {
  data () {
    return {
      limit: 10,
      offset: 0,
      dialogFormVisible: false,
      formLabelWidth: '100px',
      currId: null,
      raffle: {
        title: '',
        type: '1',
        time: '',
        img: '',
        turnplateImg: '',
        url: '',
        desc: '',
        status: true
      },
      rules: {
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' }
        ],
        time: [
          { required: true, message: '请输入正确的抽奖次数', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择抽奖类型', trigger: 'change' }
        ],
        img: [
          { required: true, message: '请上传抽奖封面', trigger: 'change', validator: validateNull }
        ],
        turnplateImg: [
          { required: true, message: '请上传转盘图片', trigger: 'change', validator: validateNull }
        ],
        url: [
          { required: true, message: '请输入跳转地址', trigger: 'blur' }
        ],
        desc: []
      },
      dialogStatus: '',
      textMap: {
        add: '添加抽奖',
        edit: '修改'
      },
      filelist: {
        img: [],
        turnplateImg: []
      },
      tableData: [],
      total: 0
    }
  },
  mounted () {
    this.getList()
  },
  methods: {
    handleCurrentChange (val) {
      this.offset = this.limit * (val - 1)
      this.getList()
    },
    handleBeforeClose (done) {
      this.handleClose()
      done()
    },
    handleDelete (index, row) {
      this.$confirm('此操作将删除该条数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let { data: { Status, Result } } = await TurnplateApi.delRaffle({
          id: row.Id
        })
        if (Status === 200) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getList()
        } else {
          this.$message.error(Result.ErrorMsg)
        }
      }).catch(() => {
      })
    },
    handleAdd (name, index, row) {
      this.dialogStatus = name
      this.dialogFormVisible = true
      if (name === 'edit') {
        this.filelist.img.push({ url: row.ImgUrl })
        this.filelist.turnplateImg.push({ url: row.TurnplateUrl })
        this.currId = row.Id
        this.raffle = {
          title: row.Title,
          type: row.Type,
          time: row.Time,
          img: row.ImgUrl,
          turnplateImg: row.TurnplateUrl,
          url: row.Url,
          desc: row.Desc,
          status: parseInt(row.Active) === 1
        }
      }
    },
    handleClose () {
      this.filelist.img = []
      this.filelist.turnplateImg = []
      this.raffle = {
        title: '',
        type: '1',
        time: '',
        img: '',
        turnplateImg: '',
        url: '',
        desc: '',
        status: true
      }
      this.dialogFormVisible = false
      this.$refs['raffle'].clearValidate()
    },
    handleExceed () {
      this.$message.error(`上传失败，请先移除已上传图片~`)
    },
    // 添加奖品
    saveRaffle (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let { data: { Status, Result } } = await TurnplateApi.saveRaffle(this.raffle)
          if (Status === 200) {
            this.$message({
              message: '添加成功！',
              type: 'success'
            })
            this.handleClose()
            this.getList()
          } else {
            this.$message.error(Result.ErrorMsg)
          }
        } else {
          this.$message.error('error submit!!')
          return false
        }
      })
    },
    // 修改
    editRaffle (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let _raffle = { ...this.raffle }
          _raffle.status = _raffle.status ? 1 : 0
          let obj = Object.assign({}, { id: this.currId }, _raffle)
          let { data: { Status, Result } } = await TurnplateApi.editRaffle(obj)
          if (Status === 200) {
            this.$message({
              message: '修改成功！',
              type: 'success'
            })
            this.handleClose()
            this.getList()
          } else {
            this.$message.error(Result.ErrorMsg)
          }
        } else {
          this.$message.error('error submit!!')
          return false
        }
      })
    },
    // 图片上传
    async uploadImg (e) {
      let formData = new FormData()
      formData.append('file', e.file)
      let { data: { Status, Result: { Link } } } = await UploadFile(formData)
      if (Status === 200) {
        this.raffle[e.data.param] = Link
      }
    },
    // 获取列表数据
    async getList () {
      let { data: { Status, Result: { List, Total } } } = await TurnplateApi.getList({
        offset: this.offset,
        limit: this.limit
      })
      if (Status === 200) {
        this.tableData = List
        this.total = typeof Total === 'string' ? parseInt(Total) : Total
      } else {
        this.$message.error(`Status = ${Status}`)
      }
    }
  }
}
</script>

<style lang="less" module>
  @import "./turntable";
</style>
