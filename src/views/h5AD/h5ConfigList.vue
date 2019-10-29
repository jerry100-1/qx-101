<template>
    <div class="accountManagement" v-loading="isLoading">
        <div class="filter" style="padding-top: 20px">
            <el-button type="danger" @click="add">新增H5配置</el-button>
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
                    label="名称"
                    width="100">
            </el-table-column>
            <el-table-column
                    prop="Description"
                    label="配置用途说明">
            </el-table-column>
            <el-table-column
                    prop="ScaleIds"
                    label="适用设备筛选">
                <template slot-scope="scope">
                    <span>{{scope.row.ScaleIds.length <= 0 ? '全部设备' : '设备ID:' + scope.row.ScaleIds}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    prop="Sort"
                    label="排序">
            </el-table-column>
            <el-table-column
                    prop="Status"
                    label="状态">
                <template slot-scope="scope">
                    <span>{{scope.row.Status == 0 ? '启用' : '禁用'}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    prop="CreateTime"
                    label="添加时间">
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
    //H5广告配置管理
    import AccountApi from '@/api/Account'
    import Util from '@/utils/index'

    export default {
        name: 'addAD',
        mixins: ['mixin'],
        data(){
            return {
                info : null,
                userLists : [],
                isLoading : false,
                tableData: [],
                currentPage4 : 1,
                adTypeOptions : ['侧边悬浮广告', '底部悬浮广告', '一列两个广告','一列一个广告'],
                total : 0,
                limit : 10,
            }
        },
        components :{
        },
        computed : {

        },

        mounted() {
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
                this.$store.dispatch('delCachedViews', this.$router.match("/addH5Config")).then(() => {
                    this.$nextTick(() => {
                        this.$router.push("addH5Config?id=" + row.Id)
                    })
                })
            },
            //新增广告
            add() {
                this.$store.dispatch('delCachedViews', this.$router.match("/addH5Config")).then(() => {
                    this.$nextTick(() => {
                        this.$router.push("addH5Config")
                    })

                })
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

                var params = {
                    Offset : (this.currentPage4 - 1) * this.limit,
                    Limit : this.limit,
                }
                console.log(params)
                this.getList(params)
            },
            //获取列表数据
            getList(params) {
                if (this.isLoading) {
                    return
                }
                this.isLoading = true
                AccountApi.adConfigList(params).then(({data}) => {
                    this.isLoading = false
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
