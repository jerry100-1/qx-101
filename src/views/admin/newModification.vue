<template>
    <div style="position: relative">
    <div class="newModification"  v-show="!isDisplay">
        <form action="">
            <table>
                <tr class="patternName">
                    <td>收益结算模式名称</td>
                    <td><input type="text" placeholder="合伙人—默认（按称重）" autofocus v-model="incomeModel"></td>
                </tr>
                <tr class="patternType">
                    <td>合作模式</td>
                    <td>
                        <label for="type-one"><input type="radio" id="type-one" value="1" name="patternType" v-model="cooperationModel"><span>合伙人模式</span></label>
                        <label for="type-two"><input type="radio" id="type-two" value="2" name="patternType" v-model="cooperationModel"><span>商务BD+落地商家模式</span></label>
                    </td>
                </tr>
                <tr class="routineProfit">
                    <td>常规收益</td>
                    <td>
                        <label for="profit-one"><input type="checkbox" :checked="routineProfit.indexOf('1') > -1" id="profit-one" name="routineProfit" value="1" @change="changeValue($event)"><span>直接管理费</span></label>
                        <label for="profit-two"><input type="checkbox" :checked="routineProfit.indexOf('2') > -1" id="profit-two" name="routineProfit" value="2" @change="changeValue($event)"><span>铺设费</span></label>
                        <label for="profit-three"><input type="checkbox" :checked="routineProfit.indexOf('3') > -1" id="profit-three" name="routineProfit" value="3" @change="changeValue($event)"><span>年服务费</span></label>
                        <label for="profit-four"><input type="checkbox" :checked="routineProfit.indexOf('4') > -1" id="profit-four" name="routineProfit" value="4" @change="changeValue($event)"><span>推荐奖励</span></label>
                        <!--<label for="profit-five"><input type="checkbox" id="profit-five" name="routineProfit" value="" @change="changeValue($event)"><span>推荐奖励</span></label>-->
                    </td>
                </tr>
                <tr class="adminConfigure" v-show="routineProfit.indexOf('1') > -1">
                    <td>直接管理费配置</td>
                    <td>
                        <label for="admin-one" @click="checkType($event,'1')"><input type="radio" value="1" v-model="adminConfigureValue" id="admin-one"  name="adminConfigure"><span>按当日称重次数计算</span></label>
                        <label for="admin-three" @click="checkType($event,'3')"><input type="radio" value="3" v-model="adminConfigureValue" id="admin-three" name="adminConfigure"><span>按导粉数计算</span></label>
                        <label for="admin-two" @click="checkType($event,'2')"><input type="radio" value="2" v-model="adminConfigureValue" id="admin-two" name="adminConfigure"><span>单台设备达成目标限额后按导粉数计算</span></label>
                        <div class="checked-one" v-show="checked == 1">
                            <div class="head">有效称重计算范围配置:</div>
                            <div class="checkTxt">
                                <div class="one">导粉率上界限(a)：<input type="text" v-model="upperLimit" @change="changeAdminConfigure($event)"><span>%（直接写数字）</span></div>
                                <div class="two">导粉率下界限(b)：<input type="text" v-model="lowerLimit" @change="changeAdminConfigure($event)"><span>%（直接写数字）</span></div>
                            </div>
                        </div>
                        <div class="checked-three" v-show="checked == 3">
                            <div class="checkTxt">
                                <div class="one">单个粉价格 <input type="text" v-model="singlePrice" @change="changeAdminConfigure($event)"><span>元（直接写数字）</span></div>
                            </div>
                        </div>
                        <div class="checked-two" v-show="checked == 2">
                            <div class="checkTxt">
                                <div class="one">单台设备导粉数未达到 <input type="text" v-model="singleEquipment" @change="changeAdminConfigure($event)"><span> 个前，不计算收益，达到后押金退回；</span></div>
                                <div class="two">超过部分开始按 <input type="text" v-model="overflowNumber" @change="changeAdminConfigure($event)"><span> 元/粉丝计算</span></div>
                            </div>
                        </div>
                    </td>
                </tr>
                <tr class="pavingFee" v-show="routineProfit.indexOf('2') > -1">
                    <td>铺设费</td>
                    <td>
                        <div class="one">任意连续 <input type="text" v-model="pavingFeeDate" @change="changePavingFee()"><span> 天（填写整数）</span></div>
                        <div class="two">日均称重次数大于等于 <input type="text" v-model="pavingFeeTime" @change="changePavingFee()"><span> 次/天</span></div>
                        <div class="three">铺设费 <input type="text" v-model="pavingFeeMoney" @change="changePavingFee()"><span> 元/台</span></div>
                    </td>
                </tr>
                <tr class="serviceCharge" v-show="routineProfit.indexOf('3') > -1">
                    <td>年服务费</td>
                    <td>
                        <div class="checked-one">
                            <div class="checkTxt">
                                <div class="one">满一年 <input type="text" v-model="serviceChargeOne" @change="changeServiceCharge"><span> 元/台</span></div>
                                <div class="two">满两年 <input type="text" v-model="serviceChargeTwo" @change="changeServiceCharge"><span> 元/台</span></div>
                                <div class="three">满三年 <input type="text" v-model="serviceChargeThree" @change="changeServiceCharge"><span> 元/台</span></div>
                            </div>
                        </div>
                    </td>
                </tr>

                <tr class="recommendedAwards" v-show="routineProfit.indexOf('4') > -1">
                    <td>推荐奖励</td>
                    <td>
                        <div class="three"><i>获得推荐资格门槛：</i><label for="three" class="threshold"><input type="radio" id="three" name="thresholdValue" value="1" v-model="threshold" @change="changeCheckedThreshold($event,'a')"><span>无门槛</span></label><label for="four"><input type="radio" id="four" name="thresholdValue" value="2" v-model="threshold" @change="changeCheckedThreshold($event,'b')"><span>设备数达到 </span><input
                                type="text" :disabled="thresholdNumber" v-model="thresholdNumberValue" @change="changeCheckedThreshold($event,'c')"> 台</label></div>
                        <div class="one"><label for="one"><input type="checkbox" id="one" :checked="directAwards" @change="changeChecked($event,'a')"><span>直接分享奖励，直接被分享人直接管理费的 </span><input type="text" v-model="directAwardsValue" :disabled="!directAwards"><span> %（直接写数字）</span></label></div>
                        <div class="two"><label for="two"><input type="checkbox" id="two" :checked="indirectAwards" @change="changeChecked($event,'b')"><span>间接分享奖励，间接被分享人直接管理费的 </span><input
                                type="text" v-model="indirectAwardsValue" :disabled="!indirectAwards"><span> %（直接写数字）</span></label></div>
                    </td>
                </tr>
                <tr class="activityReward">
                    <td>活动奖励</td>
                    <td>
                        <label for="activity-one"><input type="checkbox" :checked="activityReward" id="activity-one" @change="changeActivity($event, 'a')"><span>瓜分20万奖金</span></label>
                        <!--<label for="activity-two"><input type="checkbox" id="activity-two"><span>活动名称2 </span></label>-->
                    </td>
                </tr>
                <tr class="activityReward">
                    <td>线上协议内容</td>
                    <td>
                        <textarea id="editor" rows="10" cols="80"></textarea>
                    </td>
                </tr>
                <tr class="sort">
                    <td>排序</td>
                    <td>
                        <input type="number" min="0" v-model="sort">
                    </td>
                </tr>
                <tr class="state">
                    <td>状态</td>
                    <td>
                        <label for="state-one"><input type="radio" name="state" id="state-one" value="1" v-model="isEnable">启用</label>
                        <label for="state-two"><input type="radio" name="state" id="state-two" value="0" v-model="isEnable">禁用</label>
                    </td>
                </tr>
                <tr class="footBtn">
                    <td></td>
                    <td>
                        <div class="foot">
                            <div class="left" @click="confirmBtn">确认添加</div>
                            <!--<div>重置</div>-->
                            <input class="right" type="reset" value="重置" @click="resetBtn">
                        </div>
                    </td>
                </tr>

            </table>
        </form>

    </div>
    <div class="settlement" v-show="isDisplay">
        <div class="head">
            <div class="btn" @click="goNewDetils()">新增收益模式</div>
        </div>
        <div class="content">
            <table>
                <thead>
                <th>编号</th>
                <th>名称</th>
                <th>合作模式</th>
                <th>直接管理费</th>
                <th>铺设费</th>
                <th>年服务费</th>
                <th>推荐奖励</th>
                <th>活动奖励</th>
                <th>状态</th>
                <th>添加时间</th>
                <th>操作</th>
                </thead>
                <tbody>
                <tr v-for="list in dataList">
                    <td>{{ list.id}}</td>
                    <td>{{list.name}}</td>
                    <td>{{list.type}}</td>
                    <td v-html="list.scaleGain"></td>
                    <td v-html="list.checkPave"></td>
                    <td v-html="list.yearGain"></td>
                    <td v-html="list.agentReward"></td>
                    <td>{{list.activity}}</td>
                    <td>{{list.status == 1?'启用':'禁用'}}</td>
                    <td>{{list.create}}</td>
                    <td><span @click="goToDetils(list.id,list.name)">修改</span></td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
    <div class="loading" v-show="isLoading"><img src="../../assets/loading.gif" alt=""></div>
    </div>
</template>

<script>
    import { profitStore ,profitEdit ,profitUpdate, profitIndex} from '@/api/profit'
    import swal from 'sweetalert2'
    export default{
        name: 'newModification',
        data(){
            return{
                isLoading: true,
                incomeModel: '',                // 收益结算模式
                cooperationModel: '',           // 合作模式
                routineProfit: [],              // 常规收益

                weighingConfiguration: [],      // 直接管理费配置内容值
                adminConfigureValue: '',        // 直接管理费配置
                upperLimit: '',                 // 导粉率上界限
                lowerLimit: '',                 // 导粉率下界限
                singlePrice: '',
                singleEquipment: '',             // 单台设备导粉数
                overflowNumber: '',                // 超过部分

                pavingFeeData: [],               // 铺设费数据集合
                pavingFeeDate: '',              // 铺设费任意连续天数
                pavingFeeTime: '',              // 铺设费日均称重次数
                pavingFeeMoney: '',             // 铺设费

                serviceChargeData: [],          // 年服务费集合
                serviceChargeOne: '',           // 一年服务费
                serviceChargeTwo: '',           // 一年服务费
                serviceChargeThree: '',         // 一年服务费

                directAwards: false,            // 直接奖励选项
                directAwardsValue: '',          //  直接奖励值
                indirectAwards: false,          // 间接奖励选项
                indirectAwardsValue: '',          //  间接奖励值
                threshold: '',                     // 门槛
                thresholdNumber: true,             //
                thresholdNumberValue: '',           // 门槛数值

                activityReward: false,             // 活动奖励

                sort: '',                           // 排序值

                isEnable: 1,                        // 启用/禁用 默认为启用（1）

                checked: 1,                     // 直接管理费配置选项
                cheditorTxt: '',                // 编辑内容


                profitId: '',                   // 修改传送的ID
                profitData: '',                 // 修改的原数据


                dataList: '',                   // 列表页数据
                isDisplay: true,                // 显示列表与详情页
                vName: '',                      //
            }
        },
        mounted(){
            window.CKEDITOR.replace("editor", {height: "300px", width: "100%", toolbar: "Full"});
            // var editor = window.CKEDITOR.instances.editor2;
            console.log(editor);
            // this.profitStore();

            // try{
            //     console.log(this.$route.query.key);
            //     this.profitId = this.$route.query.key;
            //     // debugger;
            //     if(this.profitId){
            //         this.profitEdit();
            //     }
            // }catch (err){
            //     console.log(err);
            // }
            this.profitIndex();

        },
        methods:{
            goToDetils(v,vN){
                console.log(v);
                this.profitId = v;
                this.vName = vN;
                this.profitIndex();
                this.profitEdit();
                this.isDisplay = !this.isDisplay;
                this.isLoading = true;
            },
            goNewDetils(){
                // debugger;
                this.incomeModel = '';
                this.cooperationModel = '';
                this.sort = '';
                this.resetBtn();
                this.isDisplay = !this.isDisplay;
            },
            profitIndex(){
                this.dataList = [];
                profitIndex().then( ({data}) => {
                    console.log(data);
                    this.dataList = data.Result;
                    console.log(this.dataList)
                    this.isLoading = false
                });
            },
            profitEdit(){
                profitEdit({
                    id: this.profitId
                }).then(data =>{
                    if(data.status == 200){
                        console.log(data.data.Result);
                        this.profitData = data.data.Result;
                        this.detilsData();
                        this.isLoading = false
                    }
                });
            },
            detilsData(){
                this.incomeModel = this.profitData.name;
                this.activityReward = this.profitData['activity-first']?true:false;
                window.CKEDITOR.instances.editor.setData(this.profitData.agreement);
                // this.cheditorTxt = this.profitData.agreement;
                this.sort = this.profitData.sort;
                this.isEnable = this.profitData.status;
                this.cooperationModel = this.profitData.type;
                // this.cooperationModel = this.profitData.checkPave
                if(this.profitData.checkPave){
                    this.routineProfit.push('2');
                    this.pavingFeeDate = this.profitData.checkPave.first.continuous;
                    this.pavingFeeTime = this.profitData.checkPave.first.weight;
                    this.pavingFeeMoney = this.profitData.checkPave.first.count;
                }
                if(this.profitData.yearGain){
                    this.routineProfit.push('3');
                    this.serviceChargeOne = this.profitData.yearGain.first.one;
                    this.serviceChargeTwo = this.profitData.yearGain.first.tow;
                    this.serviceChargeThree = this.profitData.yearGain.first.three;
                }
                if(this.profitData.scaleGain){
                    this.routineProfit.push('1');
                    if(this.profitData.scaleGain.follow){
                        this.adminConfigureValue = 3;
                        this.checked = 3;
                        this.singlePrice = this.profitData.scaleGain.follow.one;
                    }else if(this.profitData.scaleGain.weight){
                        this.adminConfigureValue = 1;
                        this.checked = 1;
                        this.upperLimit = this.profitData.scaleGain.weight.top;
                        this.lowerLimit = this.profitData.scaleGain.weight.down;
                    }else if(this.profitData.scaleGain.deposit){
                        this.adminConfigureValue = 2;
                        this.checked = 2;
                        this.singleEquipment = this.profitData.scaleGain.deposit.one;
                        this.overflowNumber = this.profitData.scaleGain.deposit.tow;
                    }
                }
                if(this.profitData.agentReward){
                    this.routineProfit.push('4');
                    if(this.profitData.agentReward.first){
                        this.directAwards = true;
                        this.directAwardsValue = this.profitData.agentReward.first.first;
                        this.indirectAwards = true;
                        this.indirectAwardsValue = this.profitData.agentReward.first.second
                    }
                    if(this.profitData.agentReward.two){
                        this.thresholdNumber = false;
                        this.threshold = 2;
                        this.thresholdNumberValue = this.profitData.agentReward.two.first;
                    }
                }
            },
            profitStore(){
                var self = this;
                profitStore({
                    name: this.incomeModel,
                    type: this.cooperationModel,
                    scaleGain: this.routineProfit.indexOf('1') > -1?'true':'false',
                    'scaleGain-weight': this.checked == 1?'true':'false',
                    'scaleGain-weight-top': this.upperLimit,
                    'scaleGain-weight-down': this.lowerLimit,
                    'scaleGain-deposit': this.checked == 2?'true':'false',
                    'scaleGain-deposit-one': this.singleEquipment,
                    'scaleGain-deposit-tow': this.overflowNumber,
                    'scaleGain-follow': this.checked == 3?'true':'false',
                    'scaleGain-follow-one': this.singlePrice,
                    checkPave: this.routineProfit.indexOf('2') > -1?'true':'false',
                    'checkPave-first': true,
                    'checkPave-first-continuous': this.pavingFeeDate,
                    'checkPave-first-weight': this.pavingFeeTime,
                    'checkPave-first-count': this.pavingFeeMoney,
                    yearGain: this.routineProfit.indexOf('3') > -1?'true':'false',
                    'yearGain-first': true,
                    'yearGain-first-one': this.serviceChargeOne,
                    'yearGain-first-tow': this.serviceChargeTwo,
                    'yearGain-first-three': this.serviceChargeThree,
                    agentReward: this.routineProfit.indexOf('4') > -1?'true':'false',
                    'agentReward-first': true,
                    'agentReward-first-first': this.directAwards?this.directAwardsValue:'',
                    'agentReward-first-second': this.indirectAwards?this.indirectAwardsValue:'',
                    'agentReward-two':this.threshold == '1'?'false':'true',
                    'agentReward-two-first':this.thresholdNumberValue,
                    activity: this.activityReward?this.activityReward:'false',
                    'activity-first': this.activityReward?this.activityReward:'false',
                    agreement: this.cheditorTxt,
                    sort: this.sort,
                    status: this.isEnable,
                }).then( (data) => {
                    console.log(data.data);
                    if(data.data.Status == 200){
                        swal({
                            title: data.data.Result.ErrorMsg,
                        });
                        self.isDisplay = !self.isDisplay;
                        self.profitIndex();
                    }
                });
            },
            profitUpdate(){
                var self = this;
                profitUpdate({
                    id: this.profitId,
                    name: this.incomeModel,
                    type: this.cooperationModel,
                    scaleGain: this.routineProfit.indexOf('1') > -1?'true':'false',
                    'scaleGain-weight': this.checked == 1?'true':'false',
                    'scaleGain-weight-top': this.upperLimit,
                    'scaleGain-weight-down': this.lowerLimit,
                    'scaleGain-deposit': this.checked == 2?'true':'false',
                    'scaleGain-deposit-one': this.singleEquipment,
                    'scaleGain-deposit-tow': this.overflowNumber,
                    'scaleGain-follow': this.checked == 3?'true':'false',
                    'scaleGain-follow-one': this.singlePrice,
                    checkPave: this.routineProfit.indexOf('2') > -1?'true':'false',
                    'checkPave-first': true,
                    'checkPave-first-continuous': this.pavingFeeDate,
                    'checkPave-first-weight': this.pavingFeeTime,
                    'checkPave-first-count': this.pavingFeeMoney,
                    yearGain: this.routineProfit.indexOf('3') > -1?'true':'false',
                    'yearGain-first': true,
                    'yearGain-first-one': this.serviceChargeOne,
                    'yearGain-first-tow': this.serviceChargeTwo,
                    'yearGain-first-three': this.serviceChargeThree,
                    agentReward: this.routineProfit.indexOf('4') > -1?'true':'false',
                    'agentReward-first': true,
                    'agentReward-first-first': this.directAwards?this.directAwardsValue:'',
                    'agentReward-first-second': this.indirectAwards?this.indirectAwardsValue:'',
                    'agentReward-two':this.threshold == '1'?'false':'true',
                    'agentReward-two-first':this.thresholdNumberValue,
                    activity: this.activityReward?this.activityReward:'false',
                    'activity-first': this.activityReward?this.activityReward:'false',
                    agreement: this.cheditorTxt,
                    sort: this.sort,
                    status: this.isEnable,
                }).then( data => {
                    console.log(data.Status);
                    swal({
                        title: data.data.Result.ErrorMsg,
                    });
                    self.isDisplay = !self.isDisplay;
                    self.profitIndex();
                });
            },
            changeActivity(e, v){
                if(v == 'a'){
                    // console.log(e.currentTarget.checked);
                    this.activityReward = e.currentTarget.checked;
                    console.log(this.activityReward)
                }
            },
            changeCheckedThreshold(e,v){
                console.log(this.thresholdNumberValue);
                console.log(v);
                console.log(this.thresholdNumber);
                console.log(this.threshold);
                if(v == 'b'){
                    // this.threshold = v;
                    this.thresholdNumber = false;
                }
                if(v == 'a'){
                    // this.threshold = v;
                    this.thresholdNumber = true;
                    this.thresholdNumberValue = '';
                }
            },
            changeChecked(e,v){
                if(v == 'a'){
                    console.log(11)
                    this.directAwards = e.currentTarget.checked;
                    console.log(e.currentTarget.checked);
                }else if(v == 'b'){
                    console.log(222)
                    this.indirectAwards = e.currentTarget.checked;
                    console.log(e.currentTarget.checked);
                }

            },
            changeServiceCharge(){

            },
            changePavingFee(){
                this.pavingFeeData = [];
                this.pavingFeeData.push(this.pavingFeeDate);
                this.pavingFeeData.push(this.pavingFeeTime);
                this.pavingFeeData.push(this.pavingFeeMoney);
                console.log(this.pavingFeeData)
            },
            changeAdminConfigure(){
                this.weighingConfiguration = [];
                if(this.adminConfigureValue == '1'){
                    this.weighingConfiguration.push(this.upperLimit);
                    this.weighingConfiguration.push(this.lowerLimit);
                }else if(this.adminConfigureValue == '2'){
                    this.weighingConfiguration.push(this.weighingIncome);
                }else if(this.adminConfigureValue == '3'){
                    this.weighingConfiguration.push(this.singlePrice);
                }
                console.log(this.weighingConfiguration);
            },
            changeValue(e){
               if(e.currentTarget.checked && (e.currentTarget.name == 'routineProfit')){
                    this.routineProfit.push(e.currentTarget.value);
                }else{
                    var index = this.routineProfit.indexOf(e.currentTarget.value)>0?this.routineProfit.indexOf(e.currentTarget.value):'true';
                    if(index){
                        this.routineProfit.splice(index, 1);
                    }
                }
                console.log(this.routineProfit);
            },
            checkType(e,v){
                // console.log(e);
                console.log(v);
                this.checked = v;
            },
            confirmBtn(){
                console.log(this.cooperationModel);
                console.log(this.activityReward);
                var content = window.CKEDITOR.instances.editor.getData();
                this.cheditorTxt = content;
                console.log(this.profitId);

                var showTxt = '';
                if(this.incomeModel == ''){
                    showTxt = '收益结算模式名称不得为空';
                }else if(this.cooperationModel == ''){
                    showTxt = '合作模式不得为空';
                }else if(this.cheditorTxt == ''){
                    showTxt = '线上协议内容不得为空';
                }else if(this.sort == ''){
                    showTxt = '排序值不得为空';
                }
                swal({
                    title: '提示',
                    text: showTxt
                });
                if(this.vName){
                    this.profitUpdate();
                }else{
                    this.profitStore();
                }
            },
            resetBtn(){
               window.CKEDITOR.instances.editor.setData(' ');
               this.routineProfit = [];
            },
        },
    }
</script>

<style lang="less" scoped>
    .loading{
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #fff;
    }
    .settlement{
        margin-left: 3rem;
        margin-top: 1rem;
        font-size: .14rem;
        font-family: 'microsoft yahei';
        color: #333;
        min-width: 1210px;
        padding-bottom: 3rem;
        .head{
            padding-left: 2rem;
            .btn{
                background: #169bd5;
                color: #fff;
            }
        }
        .content{
            margin-top: 2rem;
            table{
                border: 1px solid #ddd;
                text-align: center;
                th{
                    border: 1px solid #ddd;
                    background: #eee;
                    height: 3rem;
                    vertical-align: middle;
                    font-size: .9rem;
                }
                td{
                    width: 12rem;
                    height: 6rem;
                    border: 1px solid #ddd;
                    vertical-align: middle;
                    text-align: center;
                    code{
                        font-style: normal;
                        color: red;
                    }
                    span{
                        padding: .6rem 3rem;
                        background: #169bd5;
                        cursor: pointer;
                        border-radius: .4rem;
                        color: #fff;
                    }
                }
                tr:nth-child(2n){
                    background: #efefef;
                }
                tr:hover{
                    background: #f0f0f0;
                }
            }
        }
    }


    .newModification{
        min-width: 600px;
        box-sizing: border-box;
        font-family: 'microsoft yahei';
        color: #333;
        padding: 2rem 2rem 4rem 0 ;
        table{
            width: 100%;
            border: 1px solid #ddd;
            font-size: .14rem;
            td{
                height: 4rem;
                vertical-align: middle;
                font-size: .8rem;
                box-sizing: border-box;
                border: 1px solid #ddd;
                label{
                    cursor: pointer;
                    span{
                        vertical-align: text-bottom;
                        margin-left: .1rem;
                    }
                }
            }
            td:first-child{
                width: 10%;
                text-align: right;
                padding-right: 1rem;
            }
            td:last-child{
                width: 80%;
                padding: .8rem;
            }
            .patternName{
                td{
                    border: 1px solid #ddd;
                    input{
                        border: none;
                        width: 100%;
                        height: 80%;
                        outline: none;
                    }
                }
            }
            .patternType{
                td{
                    label:last-child{
                        margin-left: 2rem;
                    }

                }
            }
            .routineProfit{
                td{
                    label{
                        margin-right: 1rem;
                    }
                }
            }
            .adminConfigure{
                td:last-child{
                    height: 11rem;
                    vertical-align: top;
                }
                td{
                    label{
                        margin-right: 2rem;
                        margin-top: 0;
                    }
                    .checked-one{
                        .head{
                            padding: .8rem 0;
                        }
                        .checkTxt{
                            .two{
                                margin-top: 1rem;
                                margin-bottom: .6rem;
                            }
                        }
                    }
                    .checked-two{
                        .checkTxt{
                            margin-top: 1.8rem;
                            margin-bottom: .8rem;
                            .two{
                                margin-top: 1rem;
                                margin-bottom: .6rem;
                            }
                        }
                    }
                    .checked-three{
                        .checkTxt{
                            margin-top: 1.8rem;
                            margin-bottom: .8rem;
                        }
                    }
                }
            }
            .pavingFee{
                td:last-child{
                    .two{
                        padding: 1rem 0;
                    }
                }
            }
            .serviceCharge{
                td:last-child{
                    padding: .8rem;
                    .two{
                        padding: .8rem 0;
                    }
                }
            }
            .recommendedAwards{
                td:last-child{
                    .one{
                        margin-bottom: .4rem;
                    }
                    .three{
                        margin-bottom: .4rem;
                        i{
                            font-style: normal;
                            font-weight: bold;
                        }
                        .threshold{
                            margin-right: .7rem;
                        }
                    }
                }
            }
            .activityReward{
                label:first-child{
                    margin-right: 2rem;
                }
            }
            .sort{
                td:last-child{
                    input{
                        width: 30%;
                    }
                }
            }
            .state{
                td:last-child{
                    label:first-child{
                        margin-right: 3rem;
                    }
                }
            }
            .footBtn{
                td{
                    border: none;
                }
                .foot{
                    padding: 2rem 0;
                    display: flex;
                    justify-content: center;
                    div{
                        border-radius: .2rem;
                    }
                    .left{
                        padding: .8rem 4rem;
                        background: #169bd5;
                        color: #fff;
                        margin-right: 6rem;
                        cursor: pointer;
                    }
                    .right{
                        padding: .8rem 4rem;
                        background: #fff;
                        color: #000;
                        border: 1px solid #ddd;
                        cursor: pointer;
                    }
                }
            }
        }

    }
</style>