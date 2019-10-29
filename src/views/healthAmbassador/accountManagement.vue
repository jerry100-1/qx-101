<template>
    <div class="accountManagement" v-loading="isLoading">
        <div class="filter">
            <div class="filteItem">
                <div class="icon">健康大使</div>
                <el-input v-model="userName" placeholder="ID/手机号/昵称"></el-input>
            </div>
            <div class="filteItem">
                <div class="icon">创建时间</div>
                <el-date-picker
                        v-model="createTime"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        @change="changeTime"
                >
                </el-date-picker>
            </div>
            <div class="filteItem">
                <div class="icon">推荐人</div>
                <el-input v-model="recommendUserName" placeholder="ID/手机号/昵称"></el-input>
            </div>
            <div class="filteItem">
                <div class="icon">级别</div>
                <el-select v-model="userLevelValue" placeholder="全部" @change="levelChange">
                    <el-option
                            v-for="(item, index) in options"
                            :key="index"
                            :label="item"
                            :value="index">
                    </el-option>
                </el-select>
            </div>
            <el-button type="primary" @click="search">查询</el-button>
            <el-button @click="reset">重置</el-button>
        </div>
        <div style="display: flex; flex-direction: row;align-items: center;padding-top: 20px">
            <div  class="addAccount" >
                <el-button type="primary" size="medium" @click="addAccount">添加账号</el-button>
            </div>
            <div class="outputExcel">
                <el-button  type="success" size="medium" @click="outputExcel">导出Excel</el-button>
            </div>

        </div>
        <el-table
                :data="tableData"
                border
                stripe
                fit
                style="width: 100%; margin-top: 20px">
            <el-table-column
                    prop="EmployeeId"
                    label="ID"
                    width="50">
            </el-table-column>
            <el-table-column
                    prop="Mobile"
                    label="手机号"
                    width="100">
            </el-table-column>
            <el-table-column
                    prop="NickName"
                    label="昵称">
            </el-table-column>
            <el-table-column
                    prop="Grade"
                    label="当前级别">
                <template slot-scope="scope">
                    <span>{{options[scope.row.Grade]}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    prop="ParentId"
                    label="推荐人ID">
            </el-table-column>
            <el-table-column
                    prop="ScaleCount"
                    label="购买设备数">
            </el-table-column>
            <el-table-column
                    prop="DirectSaleCount"
                    label="直销数量">
            </el-table-column>
            <el-table-column
                    prop="ChildSaleCount"
                    label="团队销量(元)">
            </el-table-column>
            <el-table-column
                    prop="TotalCash"
                    label="总收益(元)">
                <template slot-scope="scope">
                    <span>{{scope.row.TotalCash/1000}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    prop="Cash"
                    label="余额(元)">
                <template slot-scope="scope">
                    <span>{{scope.row.Cash/1000}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    prop="CreateTime"
                    width="140"
                    label="创建时间">
            </el-table-column>
            <el-table-column
                    prop="Deleted"
                    label="状态">
                <template slot-scope="scope">
                    <span>{{scope.row.Deleted == 1 ? '禁用' : '启用'}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    prop="address"
                    width="200"
                    label="操作">
                <template slot-scope="scope">
                    <el-button
                            size="mini"
                            @click="handleInfo(scope.$index, scope.row)">查看信息</el-button>
                    <a target="_blank" :href="$config.HOST + '/data/modules/scale/scale.php?EmployeeId=' + scope.row.EmployeeId">
                        <el-button
                                size="mini"
                                type="danger"
                        >
                            设备列表</el-button>
                    </a>
                </template>
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
    import {Select} from 'element-ui'
    import AccountApi from '@/api/Account'
    import exportExcel from '@/utils/exportExcel'
    import moment from 'moment'


    export default {
        name: 'accountManagement',
        mixins: ['mixin'],
        data(){
            return {
                currentPage4 : 1,
                info : null,
                errorMsg : "",
                userName : "",    //健康大使名称搜索
                recommendUserName : "",   //推荐人
                createTime : "",
                searchStartTime : "",
                searchEndTime : "",
                options: [],    //级别筛选
                userLevelValue: '全部',
                tableData: [],
                searchGrade : "",  //级别的搜索条件
                total : 0,
                isExcelExporting : false,
                isLoading : false,
            }
        },
        components :{
            Select,
        },

        mounted() {
            this.isLoading = true
            this.getList({})
            this.getGradeList()
        },
        methods: {
            // userNameInput(value) {
            //     console.log(value)
            // },
            changeTime(value) {
                console.log(this.createTime)
                if (value == null) {
                    this.searchStartTime  =""
                    this.searchEndTime = ""
                } else {
                    this.searchStartTime = this.createTime[0].getFullYear() + "-" + (this.createTime[0].getMonth() + 1) + "-" + this.createTime[0].getDate()
                    this.searchEndTime = this.createTime[1].getFullYear() + "-" + (this.createTime[1].getMonth() + 1) + "-" + this.createTime[1].getDate()
                }
                console.log(this.searchStartTime, this.searchEndTime)
            },
            levelChange(value){
                console.log(value)
                this.searchGrade = value
            },
            getGradeList() {
                AccountApi.allGrade().then(({data}) => {
                    this.isLoading = false
                    if (data.Status == 200) {
                        console.log(data.Result)
                        this.options = data.Result
                    }
                })
            },
            getList(params, needHideLoading = false) {
                this.isLoading = true
                AccountApi.saleAgentUserList(params).then(({data}) => {
                    console.log(data.Result)
                    if (needHideLoading) {
                        this.isLoading = false
                    }
                    if (data.Status == 200) {
                        console.log(data.Result)
                        this.tableData = this.tableData.concat(data.Result.List)
                        this.total = parseInt(data.Result.Total)
                    }
                })
            },
            addAccount() {
                console.log("addAccount")
                this.$router.push("addAccount")
            },
            outputExcel() {
                console.log("outputExcel")
                if (this.isExcelExporting) {
                    return
                }
                this.isLoading = true
                // this.$vux.toast.text("正在导出", "center")
                this.isExcelExporting = true
                const fileName = '健康大使账号数据汇总_' + moment().format('YYYYMMDDHHMMSS')

                const params = {
                    grade : this.searchGrade,
                    // page : this.currentPage4,
                    esearch : this.userName,
                    psearch : this.recommendUserName,
                    starttime : this.searchStartTime,
                    endtime : this.searchEndTime,
                    download : 'excel',

                }

                AccountApi.saleAgentUserList(params).then(({ data }) => {
                    if (data.Status !== 200) {
                        swal({
                            text: data.Result.ErrorMsg,
                            type: 'error',
                            timer: 2000,
                            showConfirmButton: false
                        })
                        this.isExcelExporting = false
                        return
                    }
                    var rawListData = data.Result.List
                    rawListData.forEach(item => {
                        item.Grade = this.options[item.Grade]
                        item.TotalCash = item.TotalCash / 1000
                        item.Cash = item.Cash / 1000
                        item.Deleted = item.Deleted == 1 ? '禁用' : '启用'
                    })
                    const fields = {"EmployeeId":"ID", "Mobile" : "手机号", "NickName" : "昵称",
                        "Grade" : "当前级别", "ParentId" : "推荐人ID", "ScaleCount" : "购买设备数",
                        "DirectSaleCount" : "直销数量", "ChildSaleCount" : "团队销量", "TotalCash" : "总收益",
                        "Cash" : "余额", "CreateTime" : "创建时间", "Deleted" : "状态"
                    }

                    // this.dimensionOptions.forEach(item => {
                    //     if (dimension.includes(item.id)) {
                    //         fields[item.key] = item.name
                    //     }
                    // })
                    //
                    // this.fieldMap.forEach((value, key) => {
                    //     fields[key] = value.text
                    // })

                    exportExcel([{ sheetName: fileName, data: rawListData }], fields, fileName)
                    this.isExcelExporting = false
                    this.isLoading = false
                }).catch(() => {
                    this.isExcelExporting = false
                    this.isLoading = false
                })
            },
            search(page = 1) {
                this.currentPage4 = page
                var params = {
                    grade : this.searchGrade,
                    page : this.currentPage4,
                    esearch : this.userName,
                    psearch : this.recommendUserName,
                    starttime : this.searchStartTime,
                    endtime : this.searchEndTime
                }
                this.tableData = []
                this.getList(params, true)
            },
            reset() {
                this.userLevelValue = "全部"
                this.recommendUserName = ""
                this.createTime = ""
                this.userName = ""

            },
            //查看信息
            handleInfo(index, row) {
                console.log(index, row)
                this.$router.push("showAccount?id=" + row.EmployeeId)
            },
            //设备列表
            handleDeviceList(index, row) {
            },
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
            },
            handleCurrentChange(val) {
                console.log(`当前页: ${val}`);
                this.currentPage4 = val
                this.search(this.currentPage4)
            }
        }
    }

</script>
<style lang="less" scoped>
    .accountManagement {
        padding: 50px;

        .addAccount {
        }
        .outputExcel {
            /*position: absolute;*/
            /*right: 320px;*/
            /*margin-top: 20px;*/
            width: 100%;
            text-align: right;
        }
        .pageFilter {
            /*margin-left: auto;*/
            /*margin-right: 0;*/
            padding-top: 20px;
            text-align: right;
            /*position: absolute;*/
            /*right: 120px;*/
        }

        .filter {
            display: flex;
            flex-direction: row;

            .filteItem {
                margin-right: 30px;
                display: flex;
                flex-direction: row;
                align-items: center;
                .icon {
                    flex-shrink: 0;
                    padding-right: 12px;
                }
            }
        }
    }
</style>
