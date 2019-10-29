<template>
    <div class="packetAllocation">
        <div v-if="isModify">
            <div class="packetAllocation_list">
                <div class="packetAllocation_list_item">
                    <span class="packetAllocation_list_item_name">分组名称:</span>
                    <el-input v-model="groupName" placeholder="请输入内容"></el-input>
                </div>
                <div class="packetAllocation_list_item">
                    <span class="packetAllocation_list_item_name">广告主:</span>
                    <tree-transfer
                            v-model="queryForm"
                            :source="listData"
                            :show-shortcut="true">
                    </tree-transfer>
                </div>
                <div class="packetAllocation_list_item">
                    <span class="packetAllocation_list_item_name">添加时间:</span>
                    <el-date-picker
                            v-model="groupTime"
                            value-format="yyyy-MM-dd"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                    </el-date-picker>
                </div>
                <div class="packetAllocation_list_item">
                    <span class="packetAllocation_list_item_name">状态:</span>
                    <el-select v-model="selectState" placeholder="请选择">
                        <el-option
                                v-for="item in groupState"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </div>
            </div>
            <div class="packetAllocation_select">
                <el-button type="primary" @click="dataQuery">查询</el-button>
                <el-button type="success" @click="resetBtn">重置</el-button>
                <el-button type="warning" @click="newGroup">新增分组</el-button>
            </div>
            <el-table
                    :data="tableData"
                    border
                    style="width: 100%">
                <!--<template slot-scope="scope">
                    <span><el-input v-model="scope.row.name" placeholder="请输入内容"></el-input></span>
                    <span><el-input v-model="date" placeholder="请输入内容"></el-input></span>
                </template>-->
                <el-table-column
                        prop="AdvGroupId"
                        label="分组ID">
                </el-table-column>
                <el-table-column
                        prop="GroupName"
                        label="分组名称">
                </el-table-column>
                <el-table-column
                        prop="RealName"
                        label="广告主">
                </el-table-column>
                <el-table-column
                        label="同组号是否可重复导粉">
                    <template slot-scope="scope">
                        <span>{{scope.row.IsRepeat==1?'可重复': scope.row.IsRepeat== 0 ? '不可重复' : '30天内不可重复'}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="Desc"
                        label="备注">
                    <!--<template slot-scope="scope">
                        <span>{{scope.row.PayType==1?'微信支付':scope.row.PayType==2?'支付宝支付':'余额支付'}}</span>
                        <span><el-input v-model="scope.row.name"></el-input></span>
                    </template>-->
                </el-table-column>
                <el-table-column
                        prop="Sort"
                        label="排序">
                </el-table-column>
                <el-table-column
                        label="状态">
                    <template slot-scope="scope">
                        <span>{{scope.row.State==1?'启用':'禁用'}}</span>
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
                    :page-sizes="[20, 30, 50]"
                    :page-size="limitData"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="tableTotal">
            </el-pagination>
        </div>
        <!-- 修改 -->
        <div class="packetAllocation_modify" v-if="!isModify">
            <div class="packetAllocation_modify_item">
                <div class="packetAllocation_modify_item_name">分组名称:</div>
                <div class="packetAllocation_modify_item_select">
                    <el-input v-model="groupModifyName" placeholder="请输入内容"></el-input>
                </div>
            </div>
            <div class="packetAllocation_modify_item">
                <div class="packetAllocation_modify_item_name">广告主:</div>
                <tree-transfer
                        v-model="queryModifyForm"
                        :source="listData"
                        :show-shortcut="true">
                </tree-transfer>
            </div>
            <div class="packetAllocation_modify_item">
                <div class="packetAllocation_modify_item_name">同组号是否可重复导粉:</div>
                <el-select v-model="isModifyWhether" placeholder="请选择">
                    <el-option
                            v-for="item in isWhetherNum"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div class="packetAllocation_modify_item">
                <div class="packetAllocation_modify_item_name">备注:</div>
                <div class="packetAllocation_modify_item_select">
                    <el-input v-model="groupDesc" placeholder="请输入内容"></el-input>
                </div>
            </div>
            <div class="packetAllocation_modify_item">
                <div class="packetAllocation_modify_item_name">排序:</div>
                <div class="packetAllocation_modify_item_select">
                    <el-input v-model="groupSort" placeholder="请输入内容"></el-input>
                </div>
            </div>
            <div class="packetAllocation_modify_item">
                <div class="packetAllocation_modify_item_name">状态:</div>
                <el-select v-model="selectModifyState" placeholder="请选择">
                    <el-option
                            v-for="item in groupModifyState"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div class="packetAllocation_modify_foot">
                <el-button type="success" plain @click="addGroup">保存</el-button>
                <el-button type="warning" plain>取消</el-button>
            </div>
        </div>
    </div>

</template>
<script>
    import {Select} from 'element-ui'
    import TreeTransfer from '@/components/report/tree-transfer'
    import {groupList , getCustomerList , addGroup} from '@/api/powderAdvertising'


    export default {
        name: 'packetAllocation',
        mixins: ['mixin'],
        data(){
            return {
                isModify: true,                        // 显示修改页

                groupName: '',                          // 分组名称
                queryForm: [],
                dataInfo: [                             // 广告主
                    /*{
                    id: 0,
                    label: '健康大使1',
                    fullLabel: '健康大使1'
                },{
                        id: 1,
                        label: '健康大使2',
                        fullLabel: '健康大使2'
                }*/],
                groupTime: [],                          // 添加时间
                selectState: '',                        // 状态
                groupState:[
                    {
                        value : '',
                        label : '全部',
                    },
                    {
                        value: '1',
                        label: '启用'
                    },
                    {
                        value: '0',
                        label: '禁用'
                    },
                ],
                groupModifyState:[
                    {
                        value: '1',
                        label: '启用'
                    },
                    {
                        value: '0',
                        label: '禁用'
                    },
                ],
                tableData: [/*{
                    date: '2016-05-03',
                    name: '王小虎',
                    province: '上海',
                    city: '普陀区',
                    address: '上海市普陀区金沙江路 1518 弄',
                    zip: 200333
                }*/],
                currentPage: 1,                         // 当前页码
                limitData: 20,                          // 分页条数
                tableTotal: 0,                          // 总条数
                offsetData: 0,

                // 修改页面
                isWhether: '1',                         // 可重复
                isWhetherNum: [{
                    value: '0',
                    label: '不可重复'
                },{
                    value: '1',
                    label: '可重复'
                },{
                  value: '2',
                  label: '30天内不可重复'
                },],

                groupModifyName: '',                    // 修改分组名称
                queryModifyForm: [],                    //
                selectModifyState: '',
                isModifyWhether: '',                    //
                groupDesc: '',                          // 备注
                groupSort: '',                          // 排序
                groupId: '',                            // 修改分组ID
            }
        },
        components :{
            Select,TreeTransfer
        },
        computed:{
            listData:function(){
                return this.dataInfo.map(item => {
                    return {
                        id: item.CustomerId,
                        label: item.RealName,
                        fullLabel: item.RealName,
                        disabled: false,
                        raw: item
                    }
                })
            },
        },
        mounted() {
            this.getCustomerList();
            this.dataQuery()
        },
        methods: {
            // 获取广告主
            getCustomerList(){
                getCustomerList({
                    limit: 1000
                }).then(data => {
                    console.log(data.data.Result.List);
                    this.dataInfo = this.dataInfo.concat(data.data.Result.List)
                })
            },
            // 查询
            dataQuery(){
                this.offsetData = this.limitData * (this.currentPage - 1);
                // console.log(this.queryForm.map(item => {return item.fullLabel}).join(','))
                groupList({
                    groupName: this.groupName,
                    limit: this.limitData,
                    offset: this.offsetData,
                    advertisersId: this.queryForm.map(item => {return item.id}).join(','),
                    state: this.selectState,
                    start: this.groupTime[0],
                    end: this.groupTime[0],
                }).then(data => {
                    console.log(data);
                    this.tableData = data.data.Result.List;
                    this.tableTotal = parseInt(data.data.Result.Total)
                })
            },
            // 新增分组
            newGroup(){
                this.isModify = false;
            },
            // 重置
            resetBtn(){
                this.groupName = '';
                this.queryForm = [];
                this.selectState = '';
                this.groupTime = []
            },
            // 修改
            handleClick(vm){
                this.groupId = vm.AdvGroupId
                this.isModify = false;
                console.log(vm);
                this.groupModifyName = vm.GroupName
                // this.queryForm.push(vm.RealName)
                let childChoice = {}
                childChoice = this.listData.find(item =>{
                    return item.id == vm.AdvertisersId
                })
                console.log(childChoice)
                this.queryModifyForm.push(childChoice)
                this.isModifyWhether = vm.IsRepeat
                this.groupDesc = vm.Desc
                this.groupSort = vm.Sort
                this.selectModifyState = vm.State
            },
            addGroup(){
                addGroup({
                    groupId: this.groupId,
                    groupName: this.groupModifyName,
                    advertisersId: this.queryModifyForm.map(item => {return item.id}).join(','),
                    isRepeat: this.isModifyWhether,
                    desc: this.groupDesc,
                    sort: this.groupSort,
                    state: this.selectModifyState
                }).then(data => {
                    console.log(data);
                    if(data.data.Status == 200){
                        this.$notify({
                            title: '成功',
                            message: data.data.Result.ErrorMsg,
                            type: 'success'
                        });
                        this.dataQuery();
                        this.isModify = true;
                    }
                })
            },
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
                this.limitData = val
                this.dataQuery()

            },
            handleCurrentChange(val) {
                console.log(`当前页: ${val}`);
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
                    min-width: 5em;
                    max-width: 8em;
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
