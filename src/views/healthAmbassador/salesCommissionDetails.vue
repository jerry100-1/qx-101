<template>
    <!--设备销售提成明细-->
    <div class="salesCommissionDetails">
        <div class="salesCommissionDetails_head">
            <div class="salesCommissionDetails_head_top">
                <div class="salesCommissionDetails_head_item">
                    <div class="salesCommissionDetails_head_item_left">健康大使</div>
                    <div>
                        <tree-transfer
                                v-model="queryForm"
                                :source="listData"
                                :show-shortcut="true">
                        </tree-transfer>
                    </div>
                </div>
                <div class="salesCommissionDetails_head_item">
                    <div class="salesCommissionDetails_head_item_left">时间范围</div>
                    <el-date-picker
                            v-model="createTime"
                            type="daterange"
                            format="yyyy-MM-dd"
                            range-separator="至"
                            :start-placeholder="searchStartTime"
                            :end-placeholder="searchEndTime"
                            @change="changeTime">
                    </el-date-picker>
                </div>
                <div class="salesCommissionDetails_head_item">
                    <div class="salesCommissionDetails_head_item_left">订单号</div>
                    <el-input v-model="input" placeholder="可输入多个订单号，逗号分隔，查询指定订单提成情况"></el-input>
                </div>
            </div>
            <div class="salesCommissionDetails_head_bottom">
                <div class="salesCommissionDetails_head_bottom_left">
                    <div class="salesCommissionDetails_head_bottom_left_left">维度</div>
                    <el-checkbox-group v-model="checkList">
                        <el-checkbox label="日期"></el-checkbox>
                        <el-checkbox label="健康大使"></el-checkbox>
                    </el-checkbox-group>
                </div>
                <div class="salesCommissionDetails_head_bottom_right">
                    <el-button type="primary" @click="dataQuery('a')">查询</el-button><el-button type="info" plain @click="resetBtn">重置</el-button><el-button type="warning" plain @click="exportExcel">导出excel</el-button>
                </div>
            </div>
        </div>
        <div class="salesCommissionDetails_content">
            <el-table
                    :data="tableData"
                    border
                    :empty-text="tableTxt"
                    style="width: 100%">
                <el-table-column
                        v-if="isDateTime"
                        prop="DateTime"
                        label="日期"
                        width="">
                </el-table-column>
                <el-table-column
                        v-if="isEmployeeName"
                        prop="EmployeeName"
                        label="健康大使"
                        width="">
                </el-table-column>
                <el-table-column
                        v-if="isEmployeeName"
                        prop="EmployeeLevel"
                        label="当前等级"
                        width="">
                </el-table-column>
                <el-table-column
                        label="设备销售提成总和"
                        width="">
                    <template slot-scope="scope">
                        <span>{{scope.row.TotalDirect}}&nbsp;元</span>
                    </template>
                </el-table-column>
                <el-table-column
                        label="直销提成"
                        width="">
                    <template slot-scope="scope">
                        <span>{{scope.row.Direct}}&nbsp;元</span>
                    </template>
                </el-table-column>
                <el-table-column
                        label="团队销售提成"
                        width="">
                    <template slot-scope="scope">
                        <span>{{scope.row.DirectTeam}}&nbsp;元</span>
                    </template>
                </el-table-column>
            </el-table>
            <div style="margin-top: 10px;margin-bottom: 100px" v-if="dimensions == ''?false:true && isDisabled">
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
        </div>
    </div>
</template>
<script>
    import TreeTransfer from '@/components/report/tree-transfer'
    import exportExcel from '@/utils/exportExcel'
    import { commissionSubsidiary , list } from '@/api/healthAmbassador'
    import Util from '@/utils/index'

    export default {
        name: 'salesCommissionDetails',
        components: {
            TreeTransfer
        },
        data() {
            return {
                tableTxt: '数据正在加载中.....',
                isDisabled: true,
                dimensions: '',
                tableTotal: 0,
                isDateTime: false,
                isEmployeeName: false,
                limitData: 20,
                offsetData: 0,
                currentPage: 1,                        // 当前页
                checkList: [],
                input: '',
                createTime : [],
                searchStartTime : "",
                searchEndTime : "",
                tableData: [],
                queryForm: [],
                dataInfo: [
                    /*{
                        id: 0,
                        label: '健康大使1',
                    },
                    {
                        id: 1,
                        label: '健康大使1',
                    }*/
                ]
            }
        },
        mounted(){
            console.log('测试是否提交')
            this.getList();
            this.searchStartTime = Util.formatDaysAgo(7)
            this.searchEndTime = Util.formatDaysAgo(1)
            this.createTime=[this.searchStartTime, this.searchEndTime];
            this.dataQuery('a');
        },
        computed:{
            listData:function(){
                console.log(this.dataInfo);
                return this.dataInfo.map(item => {
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
        methods:{
            changeTime(value) {
                console.log(this.createTime)
                this.searchStartTime = this.createTime[0].getFullYear() + "-" + (this.createTime[0].getMonth() + 1) + "-" + (this.createTime[0].getDate()>=10?this.createTime[0].getDate():'0'+this.createTime[0].getDate())
                this.searchEndTime = this.createTime[1].getFullYear() + "-" + (this.createTime[1].getMonth() + 1) + "-" + (this.createTime[1].getDate()>=10?this.createTime[1].getDate():'0'+this.createTime[1].getDate())
                console.log(this.searchStartTime, this.searchEndTime)
            },
            getList(){
                list({
                    limit: 1000
                }).then(data => {
                    console.log(data.data.Result.List)
                    this.dataInfo= data.data.Result.List
                    console.log(this.dataInfo)
                })
            },
            dataQuery(vm){
                this.tableData = [];
                // this.isDisabled = true;
                if(!this.isDisabled){
                    return;
                }
                this.isDisabled = false;
                this.isDateTime = false;
                this.isEmployeeName = false;
                // this.isDataQuery = true;
                this.offsetData = this.limitData * (this.currentPage - 1);
                this.tableData = [];
                // this.queryForm.map(item => { console.log(item); return item.id.join(',')});
                let employeeIds = [];
                for(let i = 0; i < this.queryForm.length; i++){
                    employeeIds.push(this.queryForm[i].id)
                    console.log(this.queryForm[i]);

                }
                this.dimensions = (this.checkList.includes('日期')&&this.checkList.includes('健康大使'))?'1,2':this.checkList.includes('日期')?'1':this.checkList.includes('健康大使')?'2':'';
                console.log(this.dimensions);
                commissionSubsidiary({
                   /* employeeId  :         可选   (多选,隔开)
                    *      startTime   :         可选  (开始时间)
                *      endTime     :         可选  (结束时间)
                *      scaleNo     :         可选  (订单号)
                *      dimension   :         可选  (维度)  1日期 2健康大使
                *      limit       ：        可选  (数据数量)默认10
                *      offset      :         可选  (偏移量)默认0*/
                    employeeId:employeeIds.join(','),
                    startTime: this.searchStartTime,
                    endTime: this.searchEndTime,
                    scaleNo: this.input,
                    limit: this.limitData,
                    offset: vm=='a'?0:this.offsetData,
                    dimension: this.dimensions
                }).then((data) => {
                    if(data.status == 200){
                        this.tableTotal = isNaN(parseInt(data.data.Result.Total))?0:parseInt(data.data.Result.Total);
                        if(JSON.stringify(data.data.Result) == '{}'){
                            this.tableTxt = '暂无数据';
                            this.isDisabled = true;
                            this.dimensions = '';
                            return;
                        }
                        this.tableData = data.data.Result.List
                        this.isDisabled = true
                        this.tableData.forEach(item => {
                            if(item.DateTime){
                                this.isDateTime = true;
                            }
                            if(item.EmployeeName){
                                this.isEmployeeName = true;
                            }
                        })
                        console.log(this.tableData);
                    }
                });
            },
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
                this.limitData = val;
                this.currentPage = 1;
                this.dataQuery()

            },
            handleCurrentChange(val) {
                console.log(`当前页: ${val}`);
                this.dataQuery()
            },
            exportExcel () {
                let tableDataName = {TotalDirect:'设备销售提成总和',Direct:'直销提成',DirectTeam:'团队销售提成',YesMoney:'可提现的提成金额',NoMoney:'冻结状态提成金额'};
                if(this.isDateTime){
                    // tableDataName.unshift(DateTime:'日期')
                    tableDataName = {DateTime:'日期',TotalDirect:'设备销售提成总和',Direct:'直销提成',DirectTeam:'团队销售提成',YesMoney:'可提现的提成金额',NoMoney:'冻结状态提成金额'};
                }
                if(this.isEmployeeName){
                    /*tableDataName.unshift(EmployeeLevel:'当前等级');
                    tableDataName.unshift(EmployeeName:'健康大使');*/
                    tableDataName = {DateTime:'日期',EmployeeName:'健康大使',EmployeeLevel:'当前等级',TotalDirect:'设备销售提成总和',Direct:'直销提成',DirectTeam:'团队销售提成',YesMoney:'可提现的提成金额',NoMoney:'冻结状态提成金额'};
                }
                exportExcel([{ sheetName: '设备销售提成明细', data: this.tableData }], tableDataName, '设备销售提成明细')
            },
            resetBtn(){
                this.currentPage = 1;
                this.dimensions = '';
                this.tableTxt = '暂无数据';
                this.isDisabled = true;
                this.queryForm = [];
                this.input = '';
                this.checkList = [];
                this.createTime = [];
                this.tableData = [];
            },

        },
        watch:{
            queryForm(newV,oldV){
                console.log(newV);
            }
        }
    }

</script>
<style lang="less" scoped>
    .salesCommissionDetails{
        font-size: 14px;
        font-family: "Microsoft YaHei";
        color: #333;
        .salesCommissionDetails_head{
            display: flex;
            flex-direction: column;
            padding: 20px;
            box-sizing: border-box;
            .salesCommissionDetails_head_top{
                display: flex;
                flex-direction: row;
                flex-wrap: wrap;
                .salesCommissionDetails_head_item{
                    display: flex;
                    flex-direction: row;
                    margin-right: 60px;
                    margin-bottom: 20px;
                    align-items: center;
                    .salesCommissionDetails_head_item_left{
                        width: 80px;
                    }
                    input{
                        width: 200px;
                        height: 40px;
                    }
                }
            }
            .salesCommissionDetails_head_bottom{
                display: flex;
                flex-direction: row;
                align-items: center;
                .salesCommissionDetails_head_bottom_left{
                    display: flex;
                    flex-direction: row;
                    margin-right: 60px;
                    align-items: center;
                    .salesCommissionDetails_head_bottom_left_left{
                        margin-right: 20px;
                    }
                }
                .salesCommissionDetails_head_bottom_right{
                    button{
                        margin-right: 20px;
                    }
                }
            }

        }
        .salesCommissionDetails_content{
            box-sizing: border-box;
            padding-left: 20px;
            font-size: 18px;
        }
    }
</style>