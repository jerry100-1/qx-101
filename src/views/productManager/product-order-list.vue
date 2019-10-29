<template>
    <div class="orderManagement">
        <div class="orderManagement-header">
            <div class="orderItem">
              <span>用户id</span>
              <el-input v-model.trim="userId" type="text"/>
            </div>
            <div class="orderItem">
                <span>订单号</span>
                <el-input v-model.trim="orderNumber" type="text"/>
            </div>
            <div class="orderItem">
                <span>订单时间</span>
                <el-date-picker
                        v-model="orderDate"
                        type="daterange"
                        format = "yyyy-MM-dd"
                        value-format = "yyyy-MM-dd"
                        align="right"
                        unlink-panels
                        size = "small"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                </el-date-picker>
            </div>
            <div class="orderItem">
              <span>产品分类</span>
              <el-select v-model="typeStatus" clearable placeholder="请选择">
                <el-option
                    v-for="item in typeList"
                    :key="item.Id"
                    :label="item.Title"
                    :value="item.Id">
                </el-option>
              </el-select>
            </div>
            <div class="orderItem">
                <span>订单状态</span>
                <el-select v-model="orderStatus" clearable placeholder="请选择">
                    <el-option
                            v-for="item in payStatusOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <el-button type="primary" class="query-button" icon="el-icon-search" @click="dataQuery('a')">查询</el-button>
            <el-button class="query-button" @click="dataReset">重置</el-button>
            <el-button :disabled="isExporting" @click="exportExcel" type="warning" class="query-button">导出</el-button>
        </div>
        <div style="height: 40px;"></div>
        <el-table
                :data="tableData"
                border
                style="width: 100%">
            <el-table-column
                    prop="id"
                    label="订单号">
            </el-table-column>
            <el-table-column
                prop="uid"
                label="用户ID">
            </el-table-column>
            <el-table-column
                prop="nickname"
                label="用户昵称">
            </el-table-column>
            <el-table-column
                prop="body"
                label="测算名称">
            </el-table-column>
            <el-table-column
                prop="type"
                label="所属产品">
            </el-table-column>
            <el-table-column
                prop="type"
                label="所属推手">
                <template slot-scope="scope">
                    <div style="display: flex;flex-direction: column">
                        <span>ID:{{scope.row.recid ? scope.row.recid : '无'}}</span>
                        <span>昵称:{{scope.row.realname ? scope.row.realname : '无'}}</span>
                        <span>手机号:{{scope.row.mobile ? scope.row.mobile : '无'}}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                    prop="total_fee"
                    label="售价(元)">
                <template slot-scope="scope">
                    <span>{{parseFloat(scope.row.lijian) + parseFloat(scope.row.total_fee)}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    prop="lijian"
                    label="优惠券">
                <template slot-scope="scope">
                    <span>{{parseFloat(scope.row.lijian) > 0 ? '推手全免券' : '无'}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    prop="platform"
                    label="支付方式">
                <!--<template slot-scope="scope">
                    <span>{{scope.row.OrderType==1?'设备+年服务费':'暂无'}}</span>
                </template>-->
            </el-table-column>
            <el-table-column
                    prop="total_fee"
                    label="实付金额">
            </el-table-column>
            <el-table-column
                    prop="pay_status"
                    label="订单状态">
            </el-table-column>
            <el-table-column
                prop="updated_at"
                label="支付时间">
            </el-table-column>
            <el-table-column
                    label="操作"
                    width="100">
                <template slot-scope="scope">
                    <el-button v-if="scope.row.status === 'yes' && scope.row.platform !== 'wap'" @click="handleClick(scope.row)" type="text" size="small">退款</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div style="margin-top: 10px;margin-bottom: 100px">
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page.sync="currentPage"
                    :page-sizes="[20, 30, 50]"
                    :page-size="limitData"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="parseInt(total)">
            </el-pagination>
        </div>
      <el-dialog
          title="退款申请"
          :visible.sync="dialogVisible"
          width="30%"
          v-if="orderInfo"
          >
          <div style="display: flex;flex-direction: column">
            <span>用户昵称：{{orderInfo.nick}}</span>
            <span>测算名称：{{orderInfo.body}}</span>
            <span>支付方式：{{orderInfo.platform}}</span>
            <span>交易单号：{{orderInfo.out_trade_no}}</span>
            <span>退款金额：{{orderInfo.total_fee}}</span>
          </div>
          <span slot="footer" class="dialog-footer">
              <el-button @click="dialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="refundOrder">确 定</el-button>
          </span>
      </el-dialog>
    </div>
</template>
<script>
import ProductApi from '@/api/productApi'
import exportExcel from '@/utils/exportExcel'
import swal from 'sweetalert2'
// 产品的订单管理
export default {
  name: 'product-order-list',
  data () {
    return {
      limitData: 20,
      offsetData: 0,
      orderStatus: '', // 订单状态
      orderDate: [], // 选择的日期
      orderNumber: '', // 订单号
      userId: '', // 用户ID
      username: '', // 用户名
      payType: '', // 支付方式
      payStatus: '', // 支付状态
      isDataQuery: false,
      isExporting: false, // 是否正在导出
      currentPage: 1, // 当前页
      orderInfo: null, // 订单头信息
      dialogVisible: false,
      tableDataName: {
        id: '订单号',
        body: '测试名称',
        type: '所属产品',
        price: '售价',
        lijian: '优惠券',
        total_fee: '实付金额',
        pay_status: '订单状态',
        updated_at: '支付时间'
      },
      tableData: [],
      total: 0,
      options: [{
        value: '10',
        label: '待付款'
      }, {
        value: '1',
        label: '已付款'
      }, {
        value: '2',
        label: '待收货 '
      }, {
        value: '3',
        label: '已完成'
      }, {
        value: '5',
        label: '取消订单'
      }, {
        value: '6',
        label: '待入库'
      }],
      payStatusOptions: [{
        value: '',
        label: '全部'
      }, {
        value: 'yes',
        label: '已支付'
      }, {
        value: 'no',
        label: '未支付'
      }, {
        value: 'close',
        label: '已关闭'
      }, {
        value: 'refund',
        label: '已退款'
      }
      ],
      typeList: [],
      typeStatus: ''
    }
  },
  mounted () {
    this.getTypeList()
    this.dataQuery()
  },
  methods: {
    getTypeList () {
      ProductApi.getOrderTypeList().then(({ data }) => {
        if (data.Status === 200) {
          this.typeList = data.Result
        }
      })
    },
    refundOrder () {
      ProductApi.orderRefund(this.orderInfo.id).then(({ data }) => {
        if (data.Status === 200) {
          this.$message({
            message: '退款成功',
            center: true,
            type: 'success'
          })
          this.dialogVisible = false
          this.dataQuery()
        } else {
          this.$message({
            message: data.Result.ErrorMsg,
            center: true
          })
        }
      })
    },
    handleClick (item) {
      ProductApi.getOrderDetail(item.id).then(({ data }) => {
        if (data.Status === 200) {
          this.orderInfo = data.Result
          this.dialogVisible = true
        } else {
          this.$message({
            message: data.Result.ErrorMsg,
            center: true
          })
        }
      })
    },
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.limitData = val
      this.dataQuery()
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.dataQuery()
    },
    exportExcel () {
      this.isExporting = true
      ProductApi.getOrderList({
        offset: 0,
        limit: 100000,
        type: this.typeStatus,
        status: this.orderStatus,
        begin: this.orderDate && this.orderDate.length > 0 ? this.orderDate[0] : '',
        end: this.orderDate && this.orderDate.length > 0 ? this.orderDate[1] : '',
        id: this.orderNumber,
        uid: this.userId
      }).then(({ data }) => {
        this.isExporting = false
        if (data.Status !== 200) {
          swal({
            text: data.Result.ErrorMsg,
            type: 'error',
            timer: 2000,
            showConfirmButton: false
          })
          return
        }
        const tableData = data.Result.List
        exportExcel([{ sheetName: '订单列表', data: tableData }], this.tableDataName, '订单列表')
      }).catch(() => {
        this.isExporting = false
      })
    },
    dataQuery (vm) {
      this.offsetData = this.limitData * (this.currentPage - 1)
      this.tableData = []
      if (vm === 'a') {
        this.offsetData = 0
        this.currentPage = 1
      }
      ProductApi.getOrderList({
        offset: vm === 'a' ? 0 : this.offsetData,
        limit: this.limitData,
        type: this.typeStatus,
        status: this.orderStatus,
        begin: this.orderDate && this.orderDate.length > 0 ? this.orderDate[0] : '',
        end: this.orderDate && this.orderDate.length > 0 ? this.orderDate[1] : '',
        id: this.orderNumber,
        uid: this.userId
      }).then((data) => {
        console.log(data.data.Result)
        if (data.data.Status === 200) {
          this.tableData = data.data.Result.List
          this.total = data.data.Result.Total
        }
      })
    },
    dataReset () {
      this.orderStatus = ''
      this.orderDate = []
      this.orderNumber = ''
      this.username = ''
      this.payType = ''
      this.payStatus = ''
    }
  }
}

</script>
<style lang="less" scoped>
    .orderManagement{
        font-family: "Microsoft YaHei";
        font-size: 16px;
        color: #333;
        background: #fff;
        padding-top: 20px;
        padding-left: 20px;
        box-sizing: border-box;
        .orderManagement-header{
            border: 1px solid rgb(221,221,221);
            display: flex;
            align-items: center;
            width: 100%;
            padding: 10px;
            background: rgba(245, 245, 245, 1);
            flex-wrap: wrap;
            .orderItem{
                display: flex;
                margin-right: 10px;
                margin-top: 10px;
                word-break: keep-all;
                span{
                    margin-right: 10px;
                }
                input{
                    outline: none;
                    color: #666;
                }
            }
            .selectData{
                width: 100px;
                height: 40px;
                background: #0099ff;
                color: #fff;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 8px;
                margin-top: 10px;
                margin-left: 30px;
                cursor: pointer;
                &.selectData:hover{
                    opacity: .8;
                }
            }
            .dataReset{
                width: 100px;
                height: 40px;
                background: #337ab7;
                color: #fff;
                display: flex;
                align-items: center;
                justify-content: center;
                border: 1px solid #2e6da4;
                border-radius: 8px;
                margin-top: 10px;
                margin-left: 30px;
                cursor: pointer;
                &.dataReset:hover{
                    opacity: .8;
                }
            }
        }
        .orderManagement-record{
            border: 1px solid rgb(221,221,221);
            margin-top: 20px;
            display: flex;
            flex-wrap: wrap;
            padding: 10px;
            background: rgba(245, 245, 245, 1);
            align-items: center;
            .recordItem{
                display: flex;
                margin-right: 40px;
                align-items: center;
                span{
                    margin-right: 8px;
                }
                i{
                    color: #FF6714;
                    font-style: normal;
                }
            }
            .exportExcel{
                font: inherit;
                height: 60px;
                padding: 0 10px;
                background: #81ba6b;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 8px;
                color: rgba(250,250,250,.8);
                margin-left: 80px;
                cursor: pointer;
                outline: none;
                border: none;
                &.exportExcel:hover{
                    opacity: .8;
                }
            }
        }
    }
</style>
