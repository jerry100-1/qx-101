<template>
    <div class="accountManagement">
        <div class="filter">
            <!--<div class="filteItem">-->
                <!--<label>广告主：</label>-->
                <!--<el-select v-model="adUser" filterable clearable placeholder="请选择广告主">-->
                    <!--<el-option-->
                            <!--v-for="item in userLists"-->
                            <!--:key="item.CustomerId"-->
                            <!--:label="item.RealName"-->
                            <!--:value="item.CustomerId">-->
                    <!--</el-option>-->
                <!--</el-select>-->
            <!--</div>-->
            <div class="filter">
                <a target="_blank" :href="$config.HOST + '/data/modules/scale/adv.php?do=EditWeightAdvUrl'">
                    <el-button style="margin-left: 10px" type="danger">
                        添加图片广告</el-button>
                </a>
            </div>
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
                    prop="Title"
                    label="页面标题"
                    width="300">
            </el-table-column>
            <el-table-column
                    prop="AdvUrl"
                    label="链接">
                <template slot-scope="scope">
                    <span>{{baseUrl+scope.row.Id}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    prop="address"
                    width="200"
                    label="操作">
                <template slot-scope="scope">
                    <el-button
                            size="mini"
                            @click="handleInfo(scope.$index, scope.row)">修改</el-button>
                    <el-button
                            size="mini"
                            @click="deleteInfo(scope.$index, scope.row)">删除</el-button>
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
    //H5图片广告链接管理
    import TreeTransfer from '@/components/report/tree-transfer'
    import AccountApi from '@/api/Account'
    import Util from '@/utils/index'
    import Config from '@/config/index'

    export default {
        name: 'adPicContentList',
        mixins: ['mixin'],
        data(){
            return {
                info : null,
                adName : "",   //广告名称
                adUser : "",  //广告主列表
                userLists : [],
                status : "",
                isListLoading : false,
                tableData: [],
                currentPage4 : 1,
                total : 0,
                limit : 10,
                baseUrl : "http://mgx.meite.com/myweight/#/h5?id="
            }
        },
        components :{
            TreeTransfer,
        },
        computed : {

        },

        mounted() {
            // this.searchStartTime = Util.formatDaysAgo(7)
            // this.searchEndTime = Util.formatDaysAgo(0)
            // this.createTime=[this.searchStartTime, this.searchEndTime]
            // console.log(this.searchStartTime, this.searchEndTime)
            this.search((this.currentPage4 - 1) * 10)
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
                window.open(Config.HOST + '/data/modules/scale/adv.php?do=EditWeightAdvUrl&Id=' + row.Id)
            },
            deleteInfo(index, row){
                console.log(index, row)
                this.$confirm('此操作将删除该内容, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteReal(row.Id);
                }).catch(() => {

                });
            },
            //删除内容
            deleteReal(id) {
                AccountApi.deleteadH5UrlList({Id : id}).then(({data}) => {
                    if (data.Status == 200) {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.getList()
                    } else {
                        this.$notify({
                            title: "警告",
                            message: data.Result.ErrorMsg,
                            type: "fail",
                            duration: 2000
                        });
                    }
                })
            },
            //获取列表数据
            getList(params) {
                AccountApi.adH5UrlList(params).then(({data}) => {
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
            search(offset) {
                var params = {
                    Limit : this.limit,
                    Offset : offset
                }
                this.getList(params)
            },
            reset() {
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
