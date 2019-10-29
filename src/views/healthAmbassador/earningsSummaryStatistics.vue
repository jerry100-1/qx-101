<template>
    <div class="earningsSummaryStatistics" v-loading="isLoading">
        <div class="filter">
            <div class="filteItem">
                <label>健康大使：</label>
                <tree-transfer
                        :disabled="isListLoading || isExcelExporting"
                        v-model="userList"
                        :source="gzhList"
                        :show-shortcut="true">
                </tree-transfer>
            </div>
            <div class="filteItem">
                <div class="icon">时间</div>
                <el-date-picker
                        v-model="createTime"
                        type="daterange"
                        range-separator="至"
                        :start-placeholder="searchStartTime"
                        :end-placeholder="searchEndTime"
                        @change="changeTime"
                >
                </el-date-picker>
            </div>
            <div class="filteItem">
                <div class="icon">维度</div>
                <el-checkbox-group v-model="checkList" @change="checkBoxChange">
                    <el-checkbox border label="日期"></el-checkbox>
                    <el-checkbox border label="健康大使"></el-checkbox>
                </el-checkbox-group>
            </div>
            <el-button type="primary" @click="search">查询</el-button>
            <el-button @click="reset">重置</el-button>
        </div>
        <div style="display: flex; flex-direction: row;align-items: center;padding-top: 20px">
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
                    prop="dateName"
                    label="日期"
                    width="100"
                    v-if="tableData.length > 0 && tableData[0].dateName"
                    >
            </el-table-column>
            <el-table-column
                    prop="employeeName"
                    label="健康大使手机号&昵称"
                    v-if="tableData.length > 0 && tableData[0].employeeName"
                    >
            </el-table-column>
            <el-table-column
                    prop="totalSum"
                    label="总收益(元)">
            </el-table-column>
            <el-table-column
                    prop="totalfollow"
                    label="广告佣金(元)">
            </el-table-column>
            <el-table-column
                    prop="saledirect"
                    label="设备直销提成(元)">
            </el-table-column>
            <el-table-column
                    prop="salechild"
                    label="设备团队销售提成(元)">
            </el-table-column>
            <el-table-column
                    prop="followone"
                    label="直推广告分润(元)">
            </el-table-column>
            <el-table-column
                    prop="followchild"
                    label="团队广告分润(元)">
            </el-table-column>
        </el-table>
        <div  class="pageFilter">
            <el-pagination

                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="[20]"
                    :page-size="20"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
        </div>
    </div>
</template>
<script>
    import TreeTransfer from '@/components/report/tree-transfer'
    import Util from '@/utils/index'
    import AccountApi from '@/api/Account'
    import exportExcel from '@/utils/exportExcel'
    import moment from 'moment'

    //收益汇总统计
    export default {
        name: 'earningsSummaryStatistics',
        components: {
            TreeTransfer
        },
        data() {
           return {
               userList : [],
               userLists : [],
               isListLoading : false,
               isExcelExporting : false,
               createTime : [],
               searchStartTime : "",
               searchEndTime : "",
               checkList : [],
               tableData : [],
               currentPage : 1,
               total : 0,
               dimensionType : 1,   //维度 1, 没有任何选择 ，2 选择健康大使 3,选择日期，4 全部选择
               employeeIds : "",
               isLoading : false,
           }
        },
        computed : {
            gzhList () {
                return this.userLists.map(item => {
                    return {
                        id: item.EmployeeId,
                        label: item.NickName,
                        fullLabel: item.NickName,
                        disabled: false,
                        raw: item
                    }
                })
            },

        },
        mounted() {
            this.searchStartTime = Util.formatDaysAgo(7)
            this.searchEndTime = Util.formatDaysAgo(1)
            this.createTime=[this.searchStartTime, this.searchEndTime]
            console.log(this.searchStartTime, this.searchEndTime)
            this.getAccountList()
            this.getList()
        },
        methods: {
            checkBoxChange(value) {
                console.log(value)
                let size = value.length
                switch (size) {
                    case 0:
                        this.dimensionType = 1
                        break
                    case 1:
                        if (value[0] == '日期') {
                            this.dimensionType = 3
                        } else {
                            this.dimensionType = 2
                        }
                        break
                    case 2:
                        this.dimensionType = 4
                        break
                }
                console.log(this.dimensionType)
            },
            outputExcel() {
                console.log("outputExcel")
                if (this.isExcelExporting) {
                    return
                }
                this.isLoading = true
                // this.$vux.toast.text("正在导出", "center")
                this.isExcelExporting = true
                const fileName = '健康大使收益数据汇总_' + moment().format('YYYYMMDDHHMMSS')

                let params = {
                    dateType : this.dimensionType,
                    start_date : this.searchStartTime,
                    end_date : this.searchEndTime,
                    eid : this.employeeIds,
                    isAll : 1,
                }
                AccountApi.earningList(params).then(({ data }) => {
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
                    // rawListData.forEach(item => {
                    //     item.Grade = this.options[item.Grade]
                    //     item.TotalCash = item.TotalCash / 1000
                    //     item.Cash = item.Cash / 1000
                    //     item.Deleted = item.Deleted == 1 ? '禁用' : '启用'
                    // })
                    let fields = {}
                    switch (this.dimensionType) {
                        case 2:
                            fields["employeeName"] = "健康大使手机号&昵称"
                            break
                        case 3:
                            fields["dateName"] = "日期"
                            break
                        case 4:
                            fields["dateName"] = "日期"
                            fields["employeeName"] = "健康大使手机号&昵称"
                            break
                    }
                    fields['totalSum'] = "总收益"
                    fields['totalfollow'] = "广告佣金"
                    fields['saledirect'] = "设备直销提成"
                    fields['salechild'] = "设备团队销售提成"
                    fields['followone'] = "直推广告分润"
                    fields['followchild'] = "团队广告分润"
                    // const fields = {"EmployeeId":"ID", "Mobile" : "手机号", "NickName" : "昵称",
                    //     "Grade" : "当前级别", "ParentId" : "推荐人ID", "ScaleCount" : "购买设备数",
                    //     "DirectSaleCount" : "直销数量", "ChildSaleCount" : "团队销量", "TotalCash" : "总收益",
                    //     "Cash" : "余额", "CreateTime" : "创建时间", "Deleted" : "状态"
                    // }

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
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
            },
            handleCurrentChange(val) {
                console.log(`当前页: ${val}`);
                this.currentPage = val
                this.getList()
            },
            search() {
                console.log(this.userList)
                if (this.userList.length > 0) {
                    this.employeeIds = this.userList.map(item => item.id).join(",")
                    console.log(this.employeeIds)
                } else {
                    this.employeeIds = ""
                }
                this.currentPage = 1
                this.getList()
            },
            reset() {
                this.userList = [];
                this.searchStartTime = Util.formatDaysAgo(7)
                this.searchEndTime = Util.formatDaysAgo(1)
                this.createTime=[this.searchStartTime, this.searchEndTime]
                this.checkList = [];
            },
            getAccountList() {
                let params = {
                    download : 'excel',
                }
                AccountApi.saleAgentUserList(params).then(({data}) => {
                    console.log(data.Result)
                    if (data.Status == 200) {
                        console.log(data.Result)
                        this.userLists = data.Result.List
                    }
                })
            },
            getList() {
                if (this.isLoading) {
                    return
                }
                this.isLoading = true
                let params = {
                    dateType : this.dimensionType,
                    start_date : this.searchStartTime,
                    end_date : this.searchEndTime,
                    offset : (this.currentPage - 1) * 20,
                    eid : this.employeeIds,
                }
                console.log(params)
                AccountApi.earningList(params).then(({data}) => {
                    this.isLoading = false
                    if (data.Status == 200) {
                        this.tableData = data.Result.List
                        this.total = data.Result.Total
                        console.log(this.tableData)
                    }
                })
            },
            changeTime(value) {
                console.log(this.createTime)
                if (value == null) {
                    this.createTime = ""
                    this.searchStartTime = ""
                    this.searchEndTime = ""
                } else {
                    this.searchStartTime = this.createTime[0].getFullYear() + "-" + (this.createTime[0].getMonth() + 1) + "-" + this.createTime[0].getDate()
                    this.searchEndTime = this.createTime[1].getFullYear() + "-" + (this.createTime[1].getMonth() + 1) + "-" + this.createTime[1].getDate()
                }
                console.log(this.searchStartTime, this.searchEndTime)
            },
        },
    }


</script>
<style lang="less" scoped>
    .earningsSummaryStatistics {

        padding: 50px;

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
