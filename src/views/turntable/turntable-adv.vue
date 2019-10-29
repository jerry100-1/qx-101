<template>
  <div :class="$style.turntableprize">
    <el-row :class="$style.padding">
      <el-col :span="20">
        <h4>广告列表</h4>
      </el-col>
      <el-col :span="4" style="text-align: right">
        <el-button type="primary" size="medium" @click="handleAdd('add')">新增广告</el-button>
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
          prop="RaffleId"
          label="所属抽奖"
          width="100">
        <template slot-scope="scope">
          {{scope.row.Raffle}}
        </template>
      </el-table-column>
      <el-table-column
          prop="TurnplateId"
          label="所属奖项">
        <template slot-scope="scope">
          {{scope.row.Turnplate}}
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
          prop="PrizeImg"
          label="弹窗图片">
        <template slot-scope="scope">
          <img :src="scope.row.PrizeImg" style="width: 100%">
        </template>
      </el-table-column>
      <el-table-column
          prop="Url"
          label="跳转链接">
      </el-table-column>
      <el-table-column
          prop="Desc"
          label="描述一">
      </el-table-column>
      <el-table-column
          prop="Remark"
          label="描述二">
      </el-table-column>
      <el-table-column
          prop="Reply"
          label="回复关键词">
      </el-table-column>
      <el-table-column
          prop="IsGoods"
          label="是否是实物">
        <template slot-scope="scope">
          {{parseInt(scope.row.IsGoods) === 1 ? '是' : '否'}}
        </template>
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
        <el-form-item label="所属抽奖" :label-width="formLabelWidth" prop="raffle">
          <el-select v-model="raffle.raffle" placeholder="请选择所属抽奖">
            <el-option :label="item" :value="key" :key="key" v-for="(item, key) in raffleAllList"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属奖项" :label-width="formLabelWidth" prop="turnplate">
          <el-select v-model="raffle.turnplate" placeholder="请选择所属奖项">
            <el-option :label="item" :value="key" :key="key" v-for="(item, key) in turnplateAllList"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="广告图片" :label-width="formLabelWidth" prop="img">
          <el-upload
              class="upload-demo"
              action="http://apigx.meite.com/"
              :data="{param: 'img'}"
              :http-request="uploadImg"
              :file-list="filelist.img"
              list-type="picture"
              :limit="1"
              :on-exceed="handleExceed"
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="弹窗图片" :label-width="formLabelWidth" prop="prizeImg">
          <el-upload
              class="upload-demo"
              action="http://apigx.meite.com/"
              :data="{param: 'prizeImg'}"
              :http-request="uploadImg"
              :file-list="filelist.prizeImg"
              list-type="picture"
              :limit="1"
              :on-exceed="handleExceed"
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="跳转地址" :label-width="formLabelWidth" prop="url">
          <el-input v-model="raffle.url" placeholder="请输入跳转地址"></el-input>
        </el-form-item>
        <el-form-item label="描述一" :label-width="formLabelWidth" prop="desc">
          <el-input v-model="raffle.desc" placeholder="请输入描述一"></el-input>
        </el-form-item>
        <el-form-item label="描述二" :label-width="formLabelWidth" prop="remark">
          <el-input v-model="raffle.remark" placeholder="请输入描述一"></el-input>
        </el-form-item>
        <el-form-item label="回复关键词" :label-width="formLabelWidth" prop="reply">
          <el-input v-model="raffle.reply" placeholder="请输入回复关键词"></el-input>
        </el-form-item>
        <el-form-item label="是否是实物" :label-width="formLabelWidth" prop="isGoods">
          <el-switch v-model="raffle.isGoods"></el-switch>
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
      raffleAllList: {},
      turnplateAllList: {},
      raffle: {
        raffle: '',
        turnplate: '',
        img: '',
        prizeImg: '',
        url: '',
        desc: '',
        remark: '',
        reply: '',
        isGoods: false,
        status: true
      },
      rules: {
        raffle: [
          { required: true, message: '请选择所属抽奖', trigger: 'change' }
        ],
        turnplate: [
          { required: true, message: '请选择所属奖项', trigger: 'change' }
        ],
        img: [
          { required: true, message: '请上传广告图片', trigger: 'change', validator: validateNull }
        ],
        prizeImg: [
          { required: true, message: '请上传弹窗图片', trigger: 'change', validator: validateNull }
        ]
      },
      dialogStatus: '',
      textMap: {
        add: '添加广告',
        edit: '修改'
      },
      filelist: {
        img: [],
        prizeImg: []
      },
      tableData: [],
      total: 0
    }
  },
  mounted () {
    this.getList()
    this.raffleAll()
    this.turnplateAll()
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
    // 删除数据
    handleDelete (index, row) {
      this.$confirm('此操作将删除该条数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let { data: { Status, Result } } = await TurnplateApi.delAd({
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
    // 显示dialog弹层
    handleAdd (name, index, row) {
      this.dialogStatus = name
      this.dialogFormVisible = true
      if (name === 'edit') {
        this.filelist.img.push({ url: row.ImgUrl })
        this.filelist.prizeImg.push({ url: row.PrizeImg })
        this.currId = row.Id
        this.raffle = {
          raffle: row.RaffleId,
          turnplate: row.TurnplateId,
          img: row.ImgUrl,
          prizeImg: row.PrizeImg,
          url: row.Url,
          desc: row.Desc,
          remark: row.Remark,
          reply: row.Reply,
          isGoods: parseInt(row.IsGoods) === 1,
          status: parseInt(row.Active) === 1
        }
      }
    },
    // 关闭dialog 弹层
    handleClose () {
      this.filelist.img = []
      this.filelist.prizeImg = []
      this.raffle = {
        raffle: '',
        turnplate: '',
        img: '',
        prizeImg: '',
        url: '',
        desc: '',
        remark: '',
        reply: '',
        isGoods: false,
        status: true
      }
      this.dialogFormVisible = false
      this.$refs['raffle'].clearValidate()
    },
    handleExceed () {
      this.$message.error(`上传失败，请先移除已上传图片~`)
    },
    // 添加广告
    saveRaffle (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let _raffle = { ...this.raffle }
          _raffle.status = _raffle.status ? 1 : 0
          _raffle.isGoods = _raffle.isGoods ? 1 : 0
          let { data: { Status, Result } } = await TurnplateApi.saveAd(_raffle)
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
          _raffle.isGoods = _raffle.isGoods ? 1 : 0
          let obj = Object.assign({}, { id: this.currId }, _raffle)
          let { data: { Status, Result } } = await TurnplateApi.editAd(obj)
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
        e.onSuccess()
      } else {
        this.$message.error(`文件上传失败！`)
        e.onError()
      }
    },
    // 获取列表数据
    async getList () {
      let { data: { Status, Result: { List, Total } } } = await TurnplateApi.getAdList({
        offset: this.offset,
        limit: this.limit
      })
      if (Status === 200) {
        this.tableData = List
        this.total = typeof Total === 'string' ? parseInt(Total) : Total
      } else {
        this.$message.error(`Status = ${Status}`)
      }
    },
    // 获取所有抽奖项
    async raffleAll () {
      let { data: { Result } } = await TurnplateApi.raffleAll()
      this.raffleAllList = Result
    },
    async turnplateAll () {
      let { data: { Result } } = await TurnplateApi.turnplateAll()
      this.turnplateAllList = Result
    }
  }
}
</script>

<style lang="less" module>
  @import "./turntable";
</style>
