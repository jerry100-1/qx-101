<template>
    <div class="accountManagement">
        <div class="filter">
            <div class="filteItem">
                <div class="icon">广告名称:</div>
                <el-input v-model="adName" placeholder=""></el-input>
            </div>
            <div class="filteItem">
                <label>广告主：</label>
                <el-select v-model="adUser" filterable clearable placeholder="请选择广告主">
                    <el-option
                            v-for="item in userLists"
                            :key="item.CustomerId"
                            :label="item.RealName"
                            :value="item.CustomerId">
                    </el-option>
                </el-select>
            </div>
            <div class="filteItem">
                <div class="icon">添加时间</div>
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
                <div class="icon">状态</div>
                <el-select v-model="status" placeholder="全部" clearable @change="levelChange">
                    <el-option
                            v-for="(item, index) in options"
                            :key="index"
                            :label="item"
                            :value="(index + 1)">
                    </el-option>
                </el-select>
            </div>

        </div>
        <div class="filter" style="padding-top: 20px">
            <el-button type="primary" @click="search">查询</el-button>
            <el-button @click="reset">重置</el-button>
            <div style="width: 1000px"></div>
            <el-button type="danger" @click="add">新增广告</el-button>
        </div>


        <el-table
                :data="tableData"
                border
                stripe
                fit
                style="width: 100%; margin-top: 20px">
            <el-table-column
                    prop="Id"
                    label="ID"
                    width="50">
            </el-table-column>
            <el-table-column
                    prop="Name"
                    label="广告名称"
                    width="100">
            </el-table-column>
            <el-table-column
                    prop="CustomerName"
                    label="广告主">
            </el-table-column>
            <el-table-column
                    prop="AdvType"
                    label="展示形式">
                <template slot-scope="scope">
                    <span>{{adTypeOptions[scope.row.AdvType - 1]}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    prop="AdvImg"
                    label="广告图">
                <template slot-scope="scope">
                    <img style="width: 100px;height: 100px" :src="scope.row.AdvImg">
                </template>
            </el-table-column>
            <el-table-column
                    prop="AdvUrl"
                    label="链接">
            </el-table-column>
            <el-table-column
                label="针对的用户性别">
                <template slot-scope="scope">
                    <span>{{ scope.row.Sex | genderFilter(genderMap) }}</span>
                </template>
            </el-table-column>
            <el-table-column
                    prop="Sort"
                    label="排序">
            </el-table-column>
            <el-table-column
                    prop="ChildSaleCount"
                    label="状态">
                <template slot-scope="scope">
                    <span>{{scope.row.Status == 0 ? '启用' : '禁用'}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    prop="CreateTime"
                    label="添加时间"
                    width="140">
            </el-table-column>
            <el-table-column
                    prop="TotalClicks"
                    label="总点击次数">
            </el-table-column>
            <el-table-column
                    prop="TotalPeople"
                    width="140"
                    label="总点击人数">
            </el-table-column>
            <el-table-column
                    prop="address"
                    width="200"
                    label="操作">
                <template slot-scope="scope">
                    <el-button
                            size="mini"
                            @click="handleInfo(scope.$index, scope.row)">修改</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div  class="pageFilter">
            <el-pagination

                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage4"
                    :page-sizes="[limit]"
                    :page-size="limit"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
        </div>
    </div>
</template>
<script>
    //H5广告管理
    import TreeTransfer from '@/components/report/tree-transfer'
    import AccountApi from '@/api/Account'
    import Util from '@/utils/index'

    export default {
        name: 'addAD',
        mixins: ['mixin'],
        data(){
            return {
                info : null,
                adName : "",   //广告名称
                adUser : "",  //广告主列表
                userLists : [],
                createTime : [],
                searchStartTime : "",
                searchEndTime : "",
                status : "",
                options : ["启用", "禁用"],
                isListLoading : false,
                tableData: [],
                currentPage4 : 1,
                adTypeOptions : ['侧边悬浮广告', '底部悬浮广告', '一列两个广告','一列一个广告', '底部菜单广告'],
                total : 0,
                limit : 10,
                genderMap: new Map([['1', '男'], ['2', '女'], ['0', '未知']])
            }
        },
        components :{
            TreeTransfer,
        },
        computed : {

        },
        filters: {
          genderFilter: function (value, genderMap) {
            if (!value) return ''
            const genderArr = value.split(',')
            if (genderArr.length === genderMap.size) {
              return '全部'
            } else {
              return genderArr.map(item => genderMap.get(item)).join(',')
            }
          }
        },
        mounted() {
            // this.searchStartTime = Util.formatDaysAgo(7)
            // this.searchEndTime = Util.formatDaysAgo(0)
            // this.createTime=[this.searchStartTime, this.searchEndTime]
            // console.log(this.searchStartTime, this.searchEndTime)
            this.getAccountList()
            this.search()
        },
        methods: {
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
            },
            handleCurrentChange(val) {
                console.log(`当前页: ${val}`);
                this.currentPage4 = val
                this.search((this.currentPage4 - 1) * 10)
            },
            handleInfo(index, row) {
                console.log(index, row)
                this.$store.dispatch('delCachedViews', this.$router.match("/addAD")).then(() => {
                    this.$nextTick(() => {
                        this.$router.push("addAD?id=" + row.Id)
                    })

                })
            },
            //新增广告
            add() {
                this.$store.dispatch('delCachedViews', this.$router.match("/addAD")).then(() => {
                    this.$nextTick(() => {
                        this.$router.push("addAD")
                    })

                })
            },
            getAccountList() {
                AccountApi.getAdUsers().then(({data}) => {
                    console.log(data.Result)
                    if (data.Status == 200) {
                        console.log(data.Result)
                        this.userLists = data.Result
                    }
                })
            },
            //获取列表数据
            getList(params) {

                AccountApi.adList(params).then(({data}) => {
                    if (data.Status == 200) {
                        this.tableData = data.Result.List
                        this.total = parseInt(data.Result.Total)
                    } else {
                        this.$notify({
                            title: "警告",
                            message: data.Result.ErrorMsg,
                            type: "fail",
                            duration: 2000
                        });
                        return
                    }
                })

            },
            levelChange() {

            },
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
            search() {
                // this.currentPage4 = page
                // console.log(this.status.length)
                // var s = 0
                // var statusInt = parseInt(this.status)
                // if (this.status.isNaN) {
                // } else {
                //     s = statusInt + 1
                // }

                // var s = this.status < 0 ? "" : this.status + 1
                console.log(this.status, isNaN(this.status))
                var params = {
                    Offset : (this.currentPage4 - 1) * this.limit,
                    Limit : this.limit,
                    start_date : this.searchStartTime,
                    end_date : this.searchEndTime,
                    Status : isNaN(this.status) ? "" : this.status,
                    CustomerId : this.adUser,
                    Name : this.adName,
                }
                console.log(params)
                this.getList(params)
            },
            reset() {
                this.searchStartTime = Util.formatDaysAgo(7)
                this.searchEndTime = Util.formatDaysAgo(0)
                this.createTime=[this.searchStartTime, this.searchEndTime]
                this.adName = ""
                this.adUser = ""
            },
        }
    }

</script>
<style lang="less" scoped>
    .accountManagement {
        padding: 50px;

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
