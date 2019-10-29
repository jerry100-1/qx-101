<template>
    <div class="accountManagement" v-loading="isLoading">
        <div style="display: flex;flex-direction: row; align-items: center">
            <time-selector
                    :disabled="isLoading"
                    :date-type.sync="dateType"
                    :date-range.sync="dateRange"
                    :showCompare = "false"
                    :showGranularity = "false"
                    style="align-items: center"
                    >
            </time-selector>

            <el-button style="margin-bottom: 15px; margin-left: 20px" type="primary" @click="search">搜索</el-button>
            <el-button style="margin-bottom: 15px; margin-left: 20px" @click="reset">重置</el-button>
        </div>
        <el-table
                :data="tableData"
                border
                stripe
                fit
                style="width: 100%; margin-top: 20px">
            <el-table-column
                    prop="Day"
                    label="时间"
                    >
            </el-table-column>
            <el-table-column
                    prop="AdvCount"
                    label="百度下发广告数"
                    >
            </el-table-column>
            <el-table-column
                    prop="SuccessCount"
                    label="成功数">
            </el-table-column>
            <el-table-column
                    prop="FailCount"
                    label="失败数">
            </el-table-column>
            <el-table-column
                    prop="VirtualCount"
                    label="其他百度广告数"
            >
            </el-table-column>
            <el-table-column
                    prop="VirtualCount"
                    label="总数"
            >
                <template slot-scope="scope">
                    <span>{{scope.row.SuccessCount + parseInt(scope.row.VirtualCount)}}</span>
                </template>
            </el-table-column>
        </el-table>
        <div  class="pageFilter">
            <el-pagination

                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="listQuery.page"
                    :page-sizes="[10, 20, 30,40]"
                    :page-size="listQuery.limit"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
        </div>
    </div>
</template>
<script>
    //百度广告统计
    import AccountApi from '@/api/Account'
    import TimeSelector from '@/components/report/time-selector'
    import moment from 'moment'


    export default {
        name: 'baiduAdStat',
        mixins: ['mixin'],
        data(){
            const yestoday = moment().add(-1, 'days').format('YYYY-MM-DD')
            const dateType = -1
            const dateRange = [yestoday, yestoday]
            return {
                dateType : dateType,
                dateRange :[],
                info : null,
                userLists : [],
                isLoading : false,
                tableData: [],
                total : 0,
                listQuery : {
                    page : 1,
                    limit : 10,
                    startDate : '',
                    endDate : '',
                }
            }
        },
        components :{
            TimeSelector,
        },
        computed : {

        },

        mounted() {
            this.search()
        },
        methods: {
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
                this.listQuery.limit = val
                this.search()
            },
            handleCurrentChange(val) {
                console.log(`当前页: ${val}`);
                this.listQuery.page = val
                this.getList()
            },
            search() {
                console.log(this.dateRange)
                this.listQuery.startDate = this.dateRange[0]
                this.listQuery.endDate = this.dateRange[1]
                this.getList()
            },
            reset() {
                this.dateType = -1;
                this.dateRange = [];
            },
            //获取列表数据
            getList() {
                if (this.isLoading) {
                    return
                }
                this.isLoading = true
                AccountApi.getBaiduAdStat(this.listQuery).then(({data}) => {
                    this.isLoading = false
                    if (data.Status == 200) {
                        this.tableData = data.Result.list
                        this.total = data.Result.count
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
