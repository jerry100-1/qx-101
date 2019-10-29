<template>
    <div class="orderManagement">
        <div class="orderManagement-header">
            <div class="orderItem">
                <span>订单号</span>
                <input v-model.trim="orderNumber" type="text">
            </div>
            <div class="orderItem">
                <span>用户名</span>
                <input v-model.trim="username" type="text">
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
                        end-placeholder="结束日期"
                        :picker-options="pickerOptions2">
                </el-date-picker>
            </div>
            <div class="orderItem">
                <span>订单状态</span>
                <el-select v-model="orderStatus" clearable placeholder="请选择">
                    <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div class="orderItem">
                <span>支付方式</span>
                <el-select v-model="payType" clearable placeholder="请选择">
                    <el-option
                            v-for="item in payTypeOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div class="orderItem">
                <span>支付状态</span>
                <el-select v-model="payStatus" clearable placeholder="请选择">
                    <el-option
                            v-for="item in payStatusOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div class="selectData" @click="dataQuery('a')">查询</div>
            <div class="dataReset" @click="dataReset">重置</div>
        </div>
        <div class="orderManagement-record">
            <div class="recordItem">
                <span>订单记录:</span>
                <i>{{orderInfo.Total}}</i>
            </div>
            <div class="recordItem">
                <span>待付款:</span>
                <i>{{orderInfo.WhiteCount}}</i>
            </div>
            <div class="recordItem">
                <span>已付款:</span>
                <i>{{orderInfo.CheckCount}}</i>
            </div>
            <div class="recordItem">
                <span>待工厂发货:</span>
                <i>{{orderInfo.ExpCount}}</i>
            </div>
            <div class="recordItem">
                <span>待入库:</span>
                <i>{{orderInfo.WhCount}}</i>
            </div>
            <div class="recordItem">
                <span>已完成:</span>
                <i>{{orderInfo.FinishCount}}</i>
            </div>
            <div class="recordItem">
                <span>总计实付总额:</span>
                <i>&yen;{{orderInfo.MoneyCount}}</i>
            </div>
            <el-button :loading="isExporting" type="button" class="exportExcel" @click="exportExcel">导出Excel</el-button>
        </div>
        <div style="height: 40px;"></div>
        <el-table
                :data="tableData"
                border
                style="width: 100%">
            <el-table-column
                    prop="OrderNo"
                    label="订单号">
            </el-table-column>
            <el-table-column
                    prop="EmployeeId"
                    label="用户ID">
            </el-table-column>
            <el-table-column
                    prop="UserFormat"
                    label="用户信息">
                <!--<template slot-scope="scope">
                    <span>{{scope.row.EmployeeName}}{{scope.row.EmployeePhone}}</span>
                </template>-->
            </el-table-column>
            <el-table-column
                    prop="orderType"
                    label="订单类型">
                <!--<template slot-scope="scope">
                    <span>{{scope.row.OrderType==1?'设备+年服务费':'暂无'}}</span>
                </template>-->
            </el-table-column>
            <el-table-column
                    prop="BuyNum"
                    label="购买数量">
            </el-table-column>
            <el-table-column
                    label="商品总价">
                <template slot-scope="scope">
                    <span>{{scope.row.GoodsMoney}}&nbsp;元</span>
                </template>
            </el-table-column>
            <el-table-column
                    prop="DeliverFee"
                    label="配送费用">
                <template slot-scope="scope">
                    <span>{{scope.row.DeliverFee}}&nbsp;元</span>
                </template>
            </el-table-column>
            <el-table-column
                    label="订单总额">
                <template slot-scope="scope">
                    <span>{{scope.row.TotalMoney}}&nbsp;元</span>
                </template>
            </el-table-column>
            <el-table-column
                    label="年服务费">
                <template slot-scope="scope">
                    <span>{{scope.row.YearFee}}&nbsp;元</span>
                </template>
            </el-table-column>
            <el-table-column
                    prop="payType"
                    label="支付方式">
                <!--<template slot-scope="scope">
                    <span>{{scope.row.PayType==1?'微信支付':scope.row.PayType==2?'支付宝支付':'余额支付'}}</span>
                </template>-->
            </el-table-column>
            <el-table-column
                    label="实付金额">
                <template slot-scope="scope">
                    <span>{{scope.row.TrueMoney}}&nbsp;元</span>
                </template>
            </el-table-column>
            <el-table-column
                    prop="OrderTime"
                    label="订单时间">
            </el-table-column>
            <el-table-column
                    prop="addressFormat"
                    label="收货信息"
                    width="180">
                <!--<template slot-scope="scope">
                    <span>{{scope.row.Consignee}}{{scope.row.Mobile}}{{scope.row.Address}}</span>
                </template>-->
            </el-table-column>
            <el-table-column
                    label="订单状态">
                <template slot-scope="scope">
                    <!-- 1：已支付 2：待收货 3：已完成 4：取消订单 6：待入库-->
                    <span :style="scope.row.OrderStatus==1?'color:#008000':scope.row.OrderStatus==10?'color:#FF0000':'color: #333'">{{scope.row.orderStatus}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    fixed="right"
                    label="操作"
                    width="100">
                <template slot-scope="scope">
                    <el-button @click="handleClick(scope.row)" type="text" size="small">查看销售提成</el-button>
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
                    :total="parseInt(orderInfo.Total)">
            </el-pagination>
        </div>
    </div>
</template>
<script>
    import { profitStore ,profitEdit ,profitUpdate, profitIndex, saleOrderIndex} from '@/api/healthAmbassador'
    import exportExcel from '@/utils/exportExcel'
    import swal from 'sweetalert2'

    export default {
        name: 'orderManagement',
        data(){
            return {
                limitData: 20,
                offsetData: 0,
                orderStatus: '',                        // 订单状态
                orderDate: [],                          // 选择的日期
                orderNumber: '',                        // 订单号
                username: '',                           // 用户名
                payType: '',                            // 支付方式
                payStatus: '',                          // 支付状态
                isDataQuery: false,                    //
                isExporting: false,                    // 是否正在导出
                currentPage: 1,                        // 当前页
                orderInfo: [],                         // 订单头信息
                tableDataName: {
                    OrderNo:'订单号',
                    EmployeeId:'用户ID',
                    UserFormat:'用户信息',//EmployeePhoneEmployeeName
                    OrderType:'订单类型',
                    BuyNum:'购买数量',
                    GoodsMoney:'商品总价',
                    DeliverFee:'配送费用',
                    YearFee:'年服务费',
                    TotalMoney:'订单总额',
                    payType:'支付方式',//
                    TrueMoney:'实付金额',
                    OrderTime:'订单时间',
                    addressFormat:'收货信息',//Consignee Mobile Address
                    orderStatus:'订单状态',//
                },
                tableData: [
                    /*{OrderNo: '2323421421',                                                         // 订单号
                    EmployeeId: '2343',                                                                 // 用户ID
                    EmployeeName: '用户昵称 13454354546',                                        // 用户信息
                    EmployeePhone: '',
                    OrderType: '设备+年服务费',                                                     // 订单类型
                    BuyNum: 20,                                                               // 购买数量
                    GoodsMoney: '￥15800',                                                         // 商品总价
                    DeliverFee: '￥10',                                                       // 配送费用
                    TotalMoney: '￥15800',                                                         // 订单总额
                    PayType: '微信支付',                                                     // 支付方式
                    TrueMoney: '￥15800',                                                      // 实付金额
                    orderDate: '2018/10/12  10:38:34',                                             // 订单时间
                    address: '李晓明   234235436 湖南省长沙市XXXXX XXX XXX XXXX XXCXXXX',           // 收货信息
                    orderStatus: 1,                                                                // 订单状态
                }*/
                ],
                options: [{
                    value: '10',
                    label: '待付款'
                }, {
                    value: '1',
                    label: '已付款'
                }, {
                    value: '2',
                    label: '待收货 '
                },{
                    value: '3',
                    label: '已完成'
                }, {
                    value: '5',
                    label: '取消订单'
                }, {
                    value: '6',
                    label: '待入库'
                }],
                payTypeOptions: [{
                    value: '',
                    label: '全部'
                }, {
                    value: '1',
                    label: '微信支付'
                }, {
                    value: '2',
                    label: '支付宝支付'
                }, {
                    value: '3',
                    label: '余额支付'
                }],
                payStatusOptions: [{
                    value: '',
                    label: '全部'
                }, {
                    value: '1',
                    label: '已支付'
                }, {
                    value: '2',
                    label: '未支付'
                }],
                pickerOptions2: {
                    shortcuts: [{
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                },
            }
        },
        mounted(){
            this.dataQuery();
        },
        methods:{
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
                this.limitData = val
                this.dataQuery()
            },
            handleCurrentChange(val) {
                console.log(`当前页: ${val}`);
                this.dataQuery()
            },
            exportExcel () {
                this.isExporting = true
                saleOrderIndex({
                    offset: 0,
                    limit: 2000,
                    orderNo: this.orderNumber,
                    user: this.username,
                    start: this.orderDate && this.orderDate.length > 0 ? this.orderDate[0] : '',
                    end: this.orderDate && this.orderDate.length > 0 ? this.orderDate[1] : '',
                    status: this.orderStatus,
                    orderStatus: this.payStatus,
                    payType: this.payType
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
                    const tableData = data.Result.OrderLis
                    for(const vm of tableData){
                        vm.UserFormat = vm.EmployeeName + vm.EmployeePhone
                        vm.orderType = vm.OrderType == 1?'设备+年服务费':'无';
                        vm.payType = vm.PayType == 1?'微信支付':vm.PayType == 2?'支付宝支付':'余额支付';
                        vm.addressFormat = vm.Consignee + '\n\t' + vm.Mobile + '\n\t' + vm.Address
                        vm.orderStatus = vm.OrderStatus==1?'已付款':vm.OrderStatus==2?'待收货':vm.OrderStatus==3?'已完成':vm.OrderStatus==5?'取消订单':vm.OrderStatus==6?'待入库':vm.OrderStatus==10?'待支付':''
                    }
                    exportExcel([{ sheetName: '订单列表', data: tableData }], this.tableDataName, '订单列表')
                }).catch(() => {
                    this.isExporting = false
                })
            },
            dataQuery(vm){
                // this.isDataQuery = true;
                this.offsetData = this.limitData * (this.currentPage - 1);
                this.tableData = [];
                saleOrderIndex({
                    offset: vm=='a'?0:this.offsetData,
                    limit: this.limitData,
                    orderNo: this.orderNumber,
                    user: this.username,
                    start: this.orderDate && this.orderDate.length > 0 ? this.orderDate[0] : '',
                    end: this.orderDate && this.orderDate.length > 0 ? this.orderDate[1] : '',
                    status: this.orderStatus,
                    orderStatus: this.payStatus,
                    payType: this.payType
                }).then((data) => {
                    console.log(data.data.Result);
                    if(data.data.Status == 200){
                        this.orderInfo = data.data.Result.OrderInfo
                        this.tableData = data.data.Result.OrderLis
                        for(const vm of data.data.Result.OrderLis){
                            console.log(vm)
                            vm.UserFormat = vm.EmployeeName + vm.EmployeePhone
                            vm.orderType = vm.OrderType == 1?'设备+年服务费':'无';
                            vm.payType = vm.PayType == 1?'微信支付':vm.PayType == 2?'支付宝支付':'余额支付';
                            vm.addressFormat = vm.Consignee + '\n\t' + vm.Mobile + '\n\t' + vm.Address
                            vm.orderStatus = vm.OrderStatus==1?'已付款':vm.OrderStatus==2?'待收货':vm.OrderStatus==3?'已完成':vm.OrderStatus==5?'取消订单':vm.OrderStatus==6?'待入库':vm.OrderStatus==10?'待支付':''
                        }
                        // console.log(this.tableData);
                    }
                });
            },
            dataReset(){
                this.orderStatus =  '';
                this.orderDate = [];
                this.orderNumber =  '';
                this.username = '';
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