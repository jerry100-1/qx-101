<template>
    <!--广告佣金及分润统计-->
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
                            range-separator="至"
                            :start-placeholder="searchStartTime"
                            :end-placeholder="searchEndTime"
                            @change="changeTime">
                    </el-date-picker>
                </div>
                <div class="salesCommissionDetails_head_item">
                    <div class="salesCommissionDetails_head_item_left">设备ID</div>
                    <el-input v-model="input" placeholder="可输入多个设备ID，逗号分隔"></el-input>
                </div>
            </div>
            <div class="salesCommissionDetails_head_bottom">
                <div class="salesCommissionDetails_head_bottom_left">
                    <div class="salesCommissionDetails_head_bottom_left_left">维度</div>
                    <el-checkbox-group v-model="checkList">
                        <el-checkbox label="日期"></el-checkbox>
                        <el-checkbox label="健康大使"></el-checkbox>
                        <el-checkbox label="设备"></el-checkbox>
                    </el-checkbox-group>
                </div>
                <div class="salesCommissionDetails_head_bottom_right">
                    <el-button type="primary" @click="dataQuery('a')">查询</el-button><el-button type="info" plain @click="resetBtn">重置</el-button><el-button type="warning" plain @click="exportExcel('a')">导出excel</el-button>
                </div>
            </div>
        </div>
        <div class="salesCommissionDetails_content">
            <el-table
                    :data="tableData"
                    border
                    style="width: 100%">
                <!--<el-table-column
                        v-if="checkList.indexOf('日期') > -1"
                        prop="date"
                        label="日期"
                        width="">
                </el-table-column>
                <el-table-column
                        v-if="checkList.indexOf('健康大使') > -1"
                        prop="HealthUser"
                        label="健康大使"
                        width="">
                </el-table-column>
                <el-table-column
                        v-if="checkList.indexOf('设备') > -1"
                        prop="equipmentId"
                        label="设备ID"
                        width="180">
                </el-table-column>-->
                <el-table-column
                        v-if="isDateTime"
                        prop="dateName"
                        label="日期"
                        width="">
                </el-table-column>
                <el-table-column
                        v-if="isEmployeeName"
                        prop="employeeName"
                        label="健康大使"
                        width="">
                </el-table-column>
                <el-table-column
                        v-if="isEquipment"
                        prop="scaleNo"
                        label="设备ID"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="followCount"
                        label="导粉数"
                        width="">
                </el-table-column>
                <el-table-column
                        prop="totalfollow"
                        label="广告佣金"
                        width="">
                </el-table-column>
                <el-table-column
                        prop="followone"
                        label="直推分润"
                        width="">
                </el-table-column>
                <el-table-column
                        prop="followchild"
                        label="团队广告分润"
                        width="">
                </el-table-column>
            </el-table>
            <div style="margin-top: 10px;margin-bottom: 100px" v-if="dimensions == '1'?false:true && hasData">
                <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page.sync="currentPage"
                        :page-sizes="[20, 40]"
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
    import Util from '@/utils/index'
    import { accountAdvlist , list } from '@/api/healthAmbassador'

    export default {
        name: 'salesCommissionDetails',
        components: {
            TreeTransfer
        },
        data() {
            return {
                dimensions: '',
                tableTotal: 0,
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
                dataInfo: [],
                isEquipment: false,
                isDateTime: false,
                isEmployeeName: false,
                hasData: false,
                allDataList: [],
            }
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
        mounted(){
            console.log('测试是否提交')
            this.getList();
            this.dataQuery('a');
            this.searchStartTime = Util.formatDaysAgo(7)
            this.searchEndTime = Util.formatDaysAgo(1)
            this.createTime=[this.searchStartTime, this.searchEndTime]
        },
        methods:{
            dataQuery(vm){
                this.offsetData = this.limitData * (this.currentPage - 1);
                // this.tableData = [];
                // this.queryForm.map(item => { console.log(item); return item.id.join(',')});
                let employeeIds = [];
                for(let i = 0; i < this.queryForm.length; i++){
                    employeeIds.push(this.queryForm[i].id)
                    console.log(this.queryForm[i]);

                }
                this.dimensions = (this.checkList.includes('日期')&&this.checkList.includes('健康大使')&&this.checkList.includes('设备'))?'8':(!this.checkList.includes('日期')&&this.checkList.includes('健康大使')&&this.checkList.includes('设备'))?'7':(this.checkList.includes('日期')&&!this.checkList.includes('健康大使')&&this.checkList.includes('设备'))?'6':(this.checkList.includes('日期')&&this.checkList.includes('健康大使')&&!this.checkList.includes('设备'))?'5':(!this.checkList.includes('日期')&&!this.checkList.includes('健康大使')&&this.checkList.includes('设备'))?'4':(!this.checkList.includes('日期')&&this.checkList.includes('健康大使')&&!this.checkList.includes('设备'))?'3':(this.checkList.includes('日期')&&!this.checkList.includes('健康大使')&&!this.checkList.includes('设备'))?'2':'1';
                console.log(this.dimensions);
                accountAdvlist({
                    /*dateType:1 //1没有 2日期 3健康 4设备  5日期+健康  6日期+设备 7健康+设备  8全部选择
                    *   offset: 可选，偏移量，默认为0
                *   limit: 可选，每页数量, 默认20(最高不超过30)
                *   start_date: 查询条件创建时间开始
                *   end_date: 查询条件创建时间结束
                *   eid: 代理商id
                *   scaleNo: 设备id*/
                    eid:employeeIds.join(','),
                    start_date: this.searchStartTime,
                    end_date: this.searchEndTime,
                    scaleNo: this.input,
                    limit: this.limitData,
                    offset: vm=='a'?0:this.offsetData,
                    dateType: this.dimensions
                }).then((data) => {
                    if(data.status == 200){
                        this.tableTotal = parseInt(data.data.Result.Total)
                        this.tableData = data.data.Result.List
                        this.hasData = data.data.Result.List.length>0?true:false;
                        this.tableData.forEach(item => {
                            if(item.dateName){
                                this.isDateTime = true;
                            }else{
                                this.isDateTime = false;
                            }
                            if(item.employeeName){
                                this.isEmployeeName = true;
                            }else{
                                this.isEmployeeName = false;
                            }
                            if(item.scaleNo){
                                this.isEquipment = true;
                            }else{
                                this.isEquipment = false;
                            }
                        })
                        console.log(this.tableData);
                    }
                });
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
            changeTime(value) {
                console.log(this.createTime)
                this.searchStartTime = this.createTime[0].getFullYear() + "-" + (this.createTime[0].getMonth() + 1) + "-" + this.createTime[0].getDate()
                this.searchEndTime = this.createTime[1].getFullYear() + "-" + (this.createTime[1].getMonth() + 1) + "-" + this.createTime[1].getDate()
                console.log(this.searchStartTime, this.searchEndTime)
            },
            resetBtn(){
                this.queryForm = [];
                this.input = '';
                this.checkList = [];
                this.createTime = [];
                this.hasData = false;
            },
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
                this.limitData = val
                this.currentPage = 1;
                this.dataQuery();

            },
            handleCurrentChange(val) {
                console.log(`当前页: ${val}`);
                this.dataQuery();

            },
            /*accountAdvlistAll(vm){
                let employeeIds = [];
                for(let i = 0; i < this.queryForm.length; i++){
                    employeeIds.push(this.queryForm[i].id)
                    console.log(this.queryForm[i]);

                }
                accountAdvlist({
                    eid:employeeIds.join(','),
                    start_date: this.searchStartTime,
                    end_date: this.searchEndTime,
                    scaleNo: this.input,
                    limit: this.limitData,
                    offset: vm=='a'?0:this.offsetData,
                    dateType: this.dimensions,
                    isAll: 1
                }).then(data =>{
                    console.log(data.data.Result.List);
                    this.allDataList = data.data.Result.List
                    console.log(this.allDataList);
                })
            },*/
            exportExcel (vm) {
                let employeeIds = [];
                for(let i = 0; i < this.queryForm.length; i++){
                    employeeIds.push(this.queryForm[i].id)
                    console.log(this.queryForm[i]);

                }
                accountAdvlist({
                    eid:employeeIds.join(','),
                    start_date: this.searchStartTime,
                    end_date: this.searchEndTime,
                    scaleNo: this.input,
                    limit: this.limitData,
                    offset: vm=='a'?0:this.offsetData,
                    dateType: this.dimensions,
                    isAll: 1
                }).then(data =>{
                    console.log(data.data.Result.List);
                    this.allDataList = data.data.Result.List
                    console.log(this.allDataList);
                    let tableDataName = {followCount:'导粉数',totalfollow:'广告佣金',followone:'直推分润',followchild:'团队广告分润'};
                    if(this.checkList.includes('日期')){
                        // tableDataName.unshift('日期')
                        tableDataName = {dateName:'日期',followCount:'导粉数',totalfollow:'广告佣金',followone:'直推分润',followchild:'团队广告分润'};
                    }
                    if(this.checkList.includes('健康大使')){
                        // tableDataName.unshift('健康大使')
                        tableDataName = {employeeName:'健康大使',followCount:'导粉数',totalfollow:'广告佣金',followone:'直推分润',followchild:'团队广告分润'};
                    }
                    if(this.checkList.includes('设备')){
                        // tableDataName.unshift('设备ID')
                        tableDataName = {scaleNo:'设备ID',followCount:'导粉数',totalfollow:'广告佣金',followone:'直推分润',followchild:'团队广告分润'};
                    }
                    exportExcel([{ sheetName: '广告佣金及分润统计', data: this.allDataList }], tableDataName, '广告佣金及分润统计 ')
                })

            },
            resetBtn(){
                this.queryForm = [];
                this.input = '';
                this.checkList = [];
                this.createTime = [];
                this.tableData = [];
                this.dimensions = '1'
            },
            gzhList () {
                return this.gzhData.map(item => {
                    return {
                        id: item.Id,
                        label: item.Name,
                        fullLabel: item.Name,
                        disabled: false,
                        raw: item
                    }
                })
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