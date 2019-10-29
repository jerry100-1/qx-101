<template>
  <div :class="$style.turntableprize">
    <el-row :class="$style.padding">
      <el-col :span="20">
        <h4>奖项列表</h4>
      </el-col>
      <el-col :span="4" style="text-align: right">
        <el-button type="primary" size="medium" @click="handleAdd('add')">新增奖项</el-button>
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
          prop="No"
          label="编号"
          width="80">
      </el-table-column>
      <el-table-column
          prop="Title"
          label="标题"
          width="180">
      </el-table-column>
      <el-table-column
          prop="RaffleId"
          label="所属抽奖">
        <template slot-scope="scope">
          {{scope.row.Raffle}}
        </template>
      </el-table-column>
      <el-table-column
          prop="Chance"
          label="中奖概率">
        <template slot-scope="scope">
          {{scope.row.Chance + '%'}}
        </template>
      </el-table-column>
      <el-table-column
          prop="Num"
          label="奖品数量">
      </el-table-column>
      <el-table-column
          prop="PrizeImg"
          label="记录图片">
        <template slot-scope="scope">
          <img :src="scope.row.PrizeImg" style="width: 100%">
        </template>
      </el-table-column>
      <el-table-column
          prop="IsRaffle"
          label="是否可以中奖">
        <template slot-scope="scope">
          {{parseInt(scope.row.IsRaffle) === 1 ? '可以' : '不可以'}}
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
        <el-form-item label="奖项序号" :label-width="formLabelWidth" prop="no">
          <el-input v-model="raffle.no" placeholder="请输入奖项序号"/>
        </el-form-item>
        <el-form-item label="所属抽奖" :label-width="formLabelWidth" prop="raffle">
          <el-select v-model="raffle.raffle" placeholder="请选择所属抽奖">
            <el-option :label="item" :value="key" :key="key" v-for="(item, key) in raffleAllList"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="奖项标题" :label-width="formLabelWidth" prop="title">
          <el-input v-model="raffle.title" placeholder="请输入奖项标题" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="中奖概率" :label-width="formLabelWidth" prop="chance">
          <el-input v-model="raffle.chance" placeholder="请输入中奖概率" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="奖品数量" :label-width="formLabelWidth" prop="num">
          <el-input v-model="raffle.num" placeholder="请输入奖品数量" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="奖项图片" :label-width="formLabelWidth" prop="img">
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
        <el-form-item label="是否可以中奖" :label-width="formLabelWidth" prop="isRaffle">
          <el-switch v-model="raffle.isRaffle"></el-switch>
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
      raffle: {
        no: '',
        raffle: '',
        title: '',
        chance: '',
        num: '',
        img: '',
        isRaffle: true,
        status: true
      },
      rules: {
        no: [
          { required: true, message: '请输入奖项序号', trigger: 'blur' }
        ],
        raffle: [
          { required: true, message: '请选择所属抽奖', trigger: 'change' }
        ],
        title: [
          { required: true, message: '请输入奖项标题', trigger: 'blur' }
        ],
        chance: [
          { required: true, message: '请输入中奖概率', trigger: 'blur' }
        ],
        num: [
          { required: true, message: '请输入奖品数量', trigger: 'blur' }
        ],
        img: [
          { required: true, message: '请上传奖项图片', trigger: 'change', validator: validateNull }
        ],
        isRaffle: []
      },
      dialogStatus: '',
      textMap: {
        add: '添加奖项',
        edit: '修改'
      },
      filelist: {
        img: []
      },
      tableData: [],
      total: 0
    }
  },
  mounted () {
    this.getList()
    this.raffleAll()
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
        let { data: { Status, Result } } = await TurnplateApi.delTurnplate({
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
        this.filelist.img.push({ url: row.PrizeImg })
        this.currId = row.Id
        this.raffle = {
          no: row.No,
          raffle: row.RaffleId,
          title: row.Title,
          chance: row.Chance,
          num: row.Num,
          img: row.PrizeImg,
          isRaffle: parseInt(row.IsRaffle) === 1,
          status: parseInt(row.Active) === 1
        }
      }
    },
    // 关闭dialog 弹层
    handleClose () {
      this.filelist.img = []
      this.raffle = {
        no: '',
        raffle: '',
        title: '',
        chance: '',
        num: '',
        img: '',
        isRaffle: true,
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
          let _raffle = { ...this.raffle }
          _raffle.isRaffle = _raffle.isRaffle ? 1 : 0
          _raffle.status = _raffle.status ? 1 : 0
          let { data: { Status, Result } } = await TurnplateApi.saveTurnplate(_raffle)
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
          _raffle.isRaffle = _raffle.isRaffle ? 1 : 0
          let obj = Object.assign({}, { id: this.currId }, _raffle)
          let { data: { Status, Result } } = await TurnplateApi.editTurnplate(obj)
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
      let { data: { Status, Result: { List, Total } } } = await TurnplateApi.getTurnplateList({
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
    }
  }
}
</script>

<style lang="less" module>
  @import "./turntable";
</style>
