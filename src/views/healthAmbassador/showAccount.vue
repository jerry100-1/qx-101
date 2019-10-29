<template>
    <div class="accountManagement">
        <div class="baseTitle">基本信息</div>
        <div style="display: flex;flex-direction: row">
            <div class="item">
                <div class="title">
                    ID
                </div>
                <div class="value">{{info.EmployeeId}}</div>
            </div>
            <div class="item">
                <div class="title">
                    直销设备
                </div>
                <div class="value">{{info.other_info && info.other_info.DirectSaleCount}}</div>
            </div>
        </div>
        <div style="display: flex;flex-direction: row">
            <div class="item">
                <div class="title">
                    手机号码
                </div>
                <div class="value">{{info.Mobile}}</div>
            </div>
            <div class="item">
                <div class="title">
                    团队销量
                </div>
                <div class="value">{{info.other_info && info.other_info.ChildSaleCount}}</div>
            </div>
        </div>
        <div style="display: flex;flex-direction: row">
            <div class="item">
                <div class="title">
                    昵称
                </div>
                <div class="value">{{info.other_info && info.other_info.NickName}}</div>
            </div>
            <div class="item">
                <div class="title">
                    总收益
                </div>
                <div class="value">￥{{info.other_info && info.other_info.TotalCash / 1000}}</div>
            </div>
        </div>
        <div style="display: flex;flex-direction: row">
            <div class="item">
                <div class="title">
                    当前级别
                </div>
                <div class="value">{{info.other_info && options[info.other_info.Grade]}}</div>
            </div>
            <div class="item">
                <div class="title">
                    已提现金额
                </div>
                <div class="value">￥{{info.other_info && info.other_info.GetCash / 1000}}</div>
            </div>
        </div>
        <div style="display: flex;flex-direction: row">
            <div class="item">
                <div class="title">
                    购买设备数
                </div>
                <div class="value">{{info.other_info && info.other_info.ScaleCount}}</div>
            </div>
            <div class="item">
                <div class="title">
                    冻结金额
                </div>
                <div class="value">￥{{info.other_info && info.other_info.FreezeCash / 1000}}</div>
            </div>
        </div>
        <div style="display: flex;flex-direction: row">
            <div class="item">
                <div class="title">
                    推荐人ID
                </div>
                <div class="value">{{info.other_info && info.other_info.ParentId}}</div>
            </div>
            <div class="item">
                <div class="title">
                    可提现金额
                </div>
                <div class="value">￥{{info.other_info && info.other_info.WithdrawCash / 1000}}</div>
            </div>
        </div>
        <div style="display: flex;flex-direction: row">
            <div class="item">
                <div class="title">
                    添加时间
                </div>
                <div class="value">{{info.other_info && info.other_info.CreateTime}}</div>
            </div>
            <div class="item">
                <div class="title">
                    余额
                </div>
                <div class="value">￥{{info.other_info && info.other_info.Cash / 1000}}</div>
            </div>
        </div>


        <div class="baseTitle next">健康大使升级记录</div>
        <el-table
                :data="info.grade_log"
                border
                stripe
                fit
                style="width: 1200px;">
            <el-table-column
                    prop="CreateTime"
                    label="升级时间"
                    width="200">
            </el-table-column>
            <el-table-column
                    prop="Mobile"
                    label="升级内容"
                    width="1000">
                <template slot-scope="scope">
                    <span>{{options[scope.row.OldGrade]}}级别升级到{{options[scope.row.Grade]}}级别</span>
                </template>
            </el-table-column>
        </el-table>

        <div class="baseTitle next">提现记录</div>
        <el-table
                :data="withdrawList"
                border
                stripe
                fit
                style="width: 1200px;">
            <el-table-column
                    prop="CreateTime"
                    label="提现申请时间"
                    width="300">
            </el-table-column>
            <el-table-column
                    prop="Mobile"
                    label="提现金额"
                    width="600">
                <template slot-scope="scope">
                    <span>{{scope.row.Cash / 100}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    prop="FinishTime"
                    label="打款时间"
                    width="300">
            </el-table-column>
        </el-table>
        <div  class="pageFilter">
            <el-pagination

                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage4"
                    :page-sizes="[10]"
                    :page-size="10"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
        </div>
    </div>
</template>
<script>
    //查看账户信息
    import AccountApi from '@/api/Account'
    export default {
        name: 'addAccount',
        mixins: ['mixin'],
        data(){
            return {
                info : {},
                id : 0,
                options : [],
                withdrawList : [], //提现记录
                currentPage4 : 1,
                total : 0,
            }
        },
        components :{
        },

        mounted() {
            this.id = this.$route.query.id;
            console.log(this.id)
            this.getGradeList()
            this.getInfo()
            this.getWithDrawList(this.currentPage4 + 1)
        },
        methods: {
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
            },
            handleCurrentChange(val) {
                console.log(`当前页: ${val}`);
                this.currentPage4 = val
                this.search()
            },
            //获取提现记录
            getWithDrawList(page) {
                var params = {
                    id : this.id,
                    page : page
                }
                AccountApi.saleWithdrawLog(params).then(({data}) => {
                    if (data.Status == 200) {
                        console.log(data.Result)
                        this.withdrawList = this.withdrawList.concat(data.Result.List)
                        this.total = parseInt(data.Result.Total)
                    }
                })
            },
            getGradeList() {
                AccountApi.allGrade().then(({data}) => {
                    if (data.Status == 200) {
                        console.log(data.Result)
                        this.options = data.Result
                    }
                })
            },
            getInfo() {
                AccountApi.accountInfo({
                    id : this.id
                }).then(({data}) => {
                    if (data.Status == 200) {
                        this.info = data.Result
                    }
                })
            },
        }
    }

</script>
<style lang="less" scoped>
    .accountManagement {
        padding: 30px;
        .pageFilter {
            /*margin-left: auto;*/
            /*margin-right: 0;*/
            padding-top: 20px;
            text-align: right;
            padding-right: 500px;
            /*position: absolute;*/
            /*right: 120px;*/
        }
        .baseTitle {
            height: 39px;
            width: 1200px;
            background: #ffe2d1;
            padding-left: 10px;
            line-height: 39px;
            color: #fd8343;

            &.next {
                margin-top: 50px;
            }
        }
        .item {
            display: flex;
            flex-direction: row;
            align-items: center;
            height: 40px;
            .title {
                border: #ebeef5 1px solid;
                height: 100%;
                padding-left: 10px;
                line-height: 40px;
                background: #f4f6f9;
                width: 200px;
            }
            .value {
                border: #ebeef5 1px solid;
                height: 100%;
                padding-left: 10px;
                width: 400px;
                line-height: 40px;
            }
        }
    }
</style>
