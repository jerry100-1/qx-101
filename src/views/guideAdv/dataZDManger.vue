<template>
    <div class="packetAllocation">
        <div>
            <div class="packetAllocation_list">
                <div class="packetAllocation_list_item">
                    <span class="packetAllocation_list_item_name">数据字典名称:</span>
                    <el-input v-model="name" style="flex: 1" clearable placeholder="请输入字典名称"></el-input>
                </div>
                <div class="packetAllocation_list_item">
                    <span class="packetAllocation_list_item_name">备注:</span>
                    <el-input v-model="remark" style="flex: 1" clearable placeholder="请输入备注"></el-input>
                </div>
                <el-button type="primary" @click="dataQuery">查询</el-button>
                <el-button type="warning" @click="newGroup">新增数据字典</el-button>
            </div>
            <div class="packetAllocation_select">

            </div>
            <el-table
                    :data="tableData"
                    border
                    style="width: 100%">
                <el-table-column
                        prop="Name"
                        label="名称">
                </el-table-column>
                <el-table-column
                        prop="Remark"
                        label="备注">
                </el-table-column>
                <el-table-column
                        label="状态">
                    <template slot-scope="scope">
                        <span>{{scope.row.Status==1?'启用':'禁用'}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="CreateTime"
                        label="添加时间">
                </el-table-column>
                <el-table-column
                        fixed="right"
                        label="操作">
                    <template slot-scope="scope">
                        <el-button @click="handleClick(scope.row)" type="text" size="small">修改</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page.sync="currentPage"
                    :page-sizes="[2,20, 30, 50]"
                    :page-size="limitData"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="tableTotal">
            </el-pagination>
        </div>
    </div>

</template>
<script>
    import {Select} from 'element-ui'
    import TreeTransfer from '@/components/report/tree-transfer'
    import AccountApi from '@/api/Account'

    //数据字典
    export default {
        name: 'dataZDManger',
        mixins: ['mixin'],
        data(){
            return {
                name: '',                          // 分组名称
                remark : '',
                tableData: [],
                currentPage: 1,                         // 当前页码
                limitData: 20,                          // 分页条数
                tableTotal: 0,                          // 总条数
            }
        },
        components :{
            Select,TreeTransfer
        },
        computed:{

        },
        activated() {
            console.log(this.$route.query)
            if (this.$route.query.refresh == 1) {
                this.dataQuery()
            }
        },
        mounted() {
            this.dataQuery()
        },
        methods: {
            // 查询
            dataQuery(){
                let params = {
                    name : this.name,
                    page : this.currentPage,
                    limit : this.limitData,
                    remark : this.remark,
                }
                AccountApi.getDictionaryList(params).then(data => {
                    if (data.data.Status == 200) {
                        this.tableData = data.data.Result.data;
                        this.tableTotal = parseInt(data.data.Result.count)
                    } else {
                        this.$notify({
                            title: "提示",
                            message: data.data.Result.ErrorMsg,
                            type: "failed",
                            duration: 2000
                        });
                    }
                })

            },
            // 新增分组
            newGroup(){
                this.$store.dispatch('delCachedViews', this.$router.match("/addDataZD")).then(() => {
                    this.$nextTick(() => {
                        this.$router.push("addDataZD")
                    })

                })
            },
            // 修改
            handleClick(vm){
                console.log(vm);
                this.$store.dispatch('delCachedViews', this.$router.match("/addDataZD")).then(() => {
                    this.$nextTick(() => {
                        this.$router.push("/addDataZD?id=" + vm.Id)
                    })
                })
            },
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
                this.limitData = val
                this.dataQuery()

            },
            handleCurrentChange(val) {
                console.log(`当前页: ${val}`);
                this.currentPage = val;
                this.dataQuery()
            },
        }
    }

</script>
<style lang="less" scoped>
    .packetAllocation {
        display: flex;
        box-sizing: border-box;
        flex-direction: column;
        .packetAllocation_modify{
            padding: 0 50px;
            margin-top: 30px;
            display: flex;
            flex-direction: column;
            .packetAllocation_modify_item{
                display: flex;
                flex-direction: row;
                width: 400px;
                margin-bottom: 20px;
                .packetAllocation_modify_item_name{
                    width: 150px;
                    text-align: right;
                    margin-right: 20px;
                }
                .packetAllocation_modify_item_select{
                    width: 200px;
                }
            }
            .packetAllocation_modify_foot{
                display: flex;
                margin-top: 20px;
                justify-content: center;
                button{
                    width: 140px;
                    height: 40px;
                }
            }
        }
        .packetAllocation_list{
            padding: 0 20px;
            margin-top: 30px;
            display: flex;
            flex-direction: row;
            .packetAllocation_list_item{
                display: flex;
                flex-direction: row;
                align-items: center;
                margin-right: 10px;
                .packetAllocation_list_item_name{
                    text-align: right;
                    width: auto;
                    min-width: 5rem;
                    max-width: 8rem;
                    margin-right: 10px;
                }
            }
        }
        .packetAllocation_select{
            padding: 0 20px;
            display: flex;
            margin: 20px 0;
        }
    }
</style>
