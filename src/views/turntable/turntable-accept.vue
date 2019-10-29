<template>
  <div :class="$style.turntableprize">
    <el-row :class="$style.padding">
      <el-col :span="22">
        <h4>中奖列表</h4>
      </el-col>
      <el-col :span="2" style="text-align: right">
        <el-button type="primary" @click="exportExcel">导出Excel</el-button>
      </el-col>
    </el-row>
    <el-row :class="$style.filtrate" :gutter="10">
      <el-col :span="2" :class="$style.aligncenter">
        <span style="padding-left: 20px;">筛选：</span>
      </el-col>
      <el-col :span="6">
        <el-input v-model="filtrate.keyword" placeholder="请输入收件人昵称、姓名或手机号码"></el-input>
      </el-col>
      <el-col :span="2">
        <el-select v-model="filtrate.status" placeholder="发货状态">
          <el-option label="全部" value=""></el-option>
          <el-option label="未发货" value="1"></el-option>
          <el-option label="已发货" value="2"></el-option>
        </el-select>
      </el-col>
      <el-col :span="6">
        <el-date-picker
            v-model="filtrate.time"
            value-format="yyyy-MM-dd"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
        </el-date-picker>
      </el-col>
      <el-col :span="2">
        <el-select v-model="limitStr" placeholder="条数">
          <el-option label="显示10条" value="10"></el-option>
          <el-option label="显示20条" value="20"></el-option>
          <el-option label="显示50条" value="50"></el-option>
          <el-option label="显示100条" value="100"></el-option>
          <el-option label="显示500条" value="500"></el-option>
        </el-select>
      </el-col>
      <el-col :span="2">
        <el-button type="primary" icon="el-icon-search" @click="searchHandle">搜索</el-button>
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
          prop="UserId"
          label="用户Id">
      </el-table-column>
      <el-table-column
          prop="NickName"
          label="用户昵称"
          width="80">
      </el-table-column>
      <el-table-column
          prop="HeadImg"
          label="头像">
        <template slot-scope="scope">
          <img :src="scope.row.HeadImg" style="width: 100%">
        </template>
      </el-table-column>
      <el-table-column
          prop="Ad"
          label="奖品名称">
        <template slot-scope="scope">
          <img :src="scope.row.Ad" style="width: 100%">
        </template>
      </el-table-column>
      <el-table-column
          prop="Date"
          label="中奖时间">
      </el-table-column>
      <el-table-column
          prop="Name"
          label="收件人">
      </el-table-column>
      <el-table-column
          prop="Phone"
          label="收件人手机号">
      </el-table-column>
      <el-table-column
          prop="Address"
          label="收件地址">
      </el-table-column>
      <el-table-column
          prop="ExpressDate"
          label="发货时间">
      </el-table-column>
      <el-table-column
          prop="Express"
          label="快递名称">
      </el-table-column>
      <el-table-column
          prop="ExpressNo"
          label="快递单号">
      </el-table-column>
      <el-table-column
          prop="IsDeliver"
          label="发货状态"
          :filters="[{ text: '待发货', value: 0 }, { text: '已发货', value: 1 }]"
          :filter-method="filterDeliver"
          filter-placement="bottom-end">
        <template slot-scope="scope">
          <el-tag
              size="medium"
              :type="parseInt(scope.row.IsDeliver) === 1 ? 'success' : 'danger'"
              disable-transitions>{{parseInt(scope.row.IsDeliver) === 1 ? '已发货' : '待发货'}}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
          prop="CreateTime"
          label="创建时间">
      </el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button
              size="mini"
              type="primary"
              v-if="parseInt(scope.row.IsDeliver) !== 1"
              @click="showExpressPop(scope.$index, scope.row)">发货
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
          :current-page.sync="currpage"
          :page-size="filtrate.limit"
          @current-change="handleCurrentChange">
      </el-pagination>
    </div>

    <!-- 弹层 添加 修改 -->
    <el-dialog title="设置发货" :visible.sync="dialogFormVisible" :before-close="handleBeforeClose">
      <el-form :model="fromData" :rules="rules" ref="fromData">
        <el-form-item label="快递名称" :label-width="formLabelWidth" prop="title">
          <el-input v-model="fromData.title" placeholder="请输入快递名称"/>
        </el-form-item>
        <el-form-item label="快递单号" :label-width="formLabelWidth" prop="no">
          <el-input v-model="fromData.no" placeholder="请输入快递单号"/>
        </el-form-item>
        <el-form-item label="发货时间" :label-width="formLabelWidth" prop="date">
          <el-date-picker
              v-model="fromData.date"
              type="datetime"
              placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <!--<el-form-item label="是否发货" :label-width="formLabelWidth" prop="status">-->
          <!--<el-switch v-model="fromData.status"></el-switch>-->
        <!--</el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="setExpress('fromData')">确 定
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { TurnplateApi } from '../../api/api'
import exportExcel from '@/utils/exportExcel'

export default {
  data () {
    return {
      formLabelWidth: '100px',
      currId: null,
      tableData: [],
      total: 0,
      fromData: {
        title: '',
        no: '',
        date: '',
        status: true
      },
      dialogFormVisible: false,
      rules: {
        title: [
          { required: true, message: '请输入快递名称', trigger: 'blur' }
        ],
        no: [
          { required: true, message: '请输入快递单号', trigger: 'blur' }
        ],
        date: [
          { required: true, message: '请选择发货时间', trigger: 'change' }
        ]
      },
      filtrate: {
        keyword: '',
        time: '',
        status: '',
        limit: 10,
        offset: 0
      },
      currpage: 1
    }
  },
  mounted () {
    this.getList()
  },
  computed: {
    limitStr: {
      get () {
        return this.filtrate.limit + ''
      },
      set (newValue) {
        this.filtrate.limit = parseInt(newValue)
      }
    }
  },
  methods: {
    searchHandle () {
      this.filtrate.offset = 0
      this.currpage = 1
      this.getList()
    },
    filterDeliver (value, row) {
      return parseInt(row.IsDeliver) === value
    },
    handleCurrentChange (val) {
      this.filtrate.offset = this.filtrate.limit * (val - 1)
      this.getList()
    },
    // 显示弹层
    showExpressPop (index, row) {
      this.dialogFormVisible = true
      this.currId = row.Id
      this.fromData = {
        title: row.Express,
        no: row.ExpressNo,
        date: row.ExpressDate,
        status: parseInt(row.IsDeliver) === 1
      }
    },
    // 监听关闭弹层
    handleBeforeClose (done) {
      this.handleClose()
      done()
    },
    // 关闭弹层
    handleClose () {
      this.fromData = {
        title: '',
        no: '',
        date: '',
        status: true
      }
      this.dialogFormVisible = false
      this.$refs['fromData'].clearValidate()
    },
    // 获取列表数据
    async getList () {
      let { data: { Status, Result: { List, Total } } } = await TurnplateApi.raffleLog({ ...this.filtrate })
      if (Status === 200) {
        this.tableData = List
        this.total = typeof Total === 'string' ? parseInt(Total) : Total
      } else {
        this.$message.error(`Status = ${Status}`)
      }
    },
    // 设置发货
    async setExpress (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$confirm('请确认快递信息填写是否正确！', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(async () => {
            let _fromData = { ...this.fromData }
            _fromData.status = _fromData.status ? 1 : 0
            _fromData.id = this.currId
            let { data: { Status } } = await TurnplateApi.setExpress(_fromData)
            if (Status === 200) {
              this.$message({
                message: '设置发货成功！',
                type: 'success'
              })
              this.handleClose()
              this.getList()
            } else {
              this.$message.error(`Status = ${Status}`)
            }
          }).catch(() => {})
        } else {
          this.$message.error('error submit!!')
          return false
        }
      })
    },
    // 导出Excel
    exportExcel () {
      let tableDataName = {
        Id: '编号',
        UserId: '用户Id',
        NickName: '用户昵称',
        HeadImg: '用户头像',
        Ad: '奖品名称',
        Date: '中奖时间',
        Name: '收件人',
        Phone: '收件人手机号',
        Address: '收件地址',
        ExpressDate: '发货时间',
        Express: '快递名称',
        ExpressNo: '快递单号',
        IsDeliver: '发货状态',
        CreateTime: '创建时间'
      }
      exportExcel([{ sheetName: '实物中奖纪录', data: this.tableData }], tableDataName, '实物中奖纪录')
    }
  }
}
</script>

<style lang="less" module>
  @import "./turntable";

  .filtrate{
    padding:0 0 20px 0;
  }
  .aligncenter{
    padding-top: 6px;
  }
</style>
