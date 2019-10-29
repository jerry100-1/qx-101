<template>
    <div class="packetAllocation">
        <div v-if="isPushModify">
            <div class="packetAllocation_list">
                <div class="packetAllocation_list_item">
                    <span class="packetAllocation_list_item_name">规则名称:</span>
                    <el-input v-model="groupName" placeholder="请输入内容"></el-input>
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
                    <el-select v-model="selectState" :clearable="true" placeholder="请选择">
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
                <el-button type="warning" @click="PushModify">新增推送规则</el-button>
            </div>
            <el-table
                    :data="tableData"
                    border
                    style="width: 100%">
                <el-table-column
                        prop="PushId"
                        label="规则ID">
                </el-table-column>
                <el-table-column
                        prop="PushName"
                        label="推送规则名称">
                </el-table-column>
                <el-table-column
                        label="所属公司">
                    <template slot-scope="scope">
                        <span>{{scope.row.CompId == '1'?'超级组':scope.row.CompId == '2'?'美特':scope.row.CompId == '3'?'聚鼎':scope.row.CompId == '4'?'亲信':'亚太'}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        label="查看体重结果">
                    <template slot-scope="scope">
                        <span>{{pushType}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        label="加推信息">
                    <template slot-scope="scope">
                        <div v-for="item in scope.row.PushMsg">{{item}}</div>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="Sort"
                        label="排序">
                </el-table-column>
                <el-table-column
                        label="状态">
                    <template slot-scope="scope">
                        <span>{{scope.row.State == '0'?'禁用':'启用'}}</span>
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
                        <el-button @click="handleClick(scope.row.PushId)" type="text" size="small">修改</el-button>
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
        <!-- 修改/新增推送规则 -->
        <div v-if="!isPushModify">
            <div class="ruleModification">
                <!-- 基本信息设置 -->
                <div class="ruleModification_head">基本信息设置</div>
                <div class="ruleModification_list">
                    <span>推送规则名称：</span>
                    <el-input v-model="groupModifyName" placeholder="请输入内容"></el-input>
                </div>
                <div class="ruleModification_list">
                    <span>所属公司：</span>
                    <el-select style="width: 100%" v-model="groupModifyCompany" placeholder="请选择">
                        <el-option
                                v-for="item in groupModifyCompNum"
                                :key="item.CompId"
                                :label="item.CompName"
                                :value="item.CompId">
                        </el-option>
                    </el-select>
                </div>
                <div class="ruleModification_list">
                    <span>排序：</span>
                    <el-input v-model="PushModifySort" placeholder="说明：数字越大优先级越高"></el-input>
                </div>
                <div class="ruleModification_list">
                    <span>状态：</span>
                    <el-select style="width: 100%" v-model="selectModifyState" placeholder="请选择">
                        <el-option
                                v-for="item in modifygroupState"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </div>
                <!-- 查看称重结果 -->
                <!--<div class="ruleModification_head">查看称重结果</div>
                <div class="ruleModification_list">
                    <span>消息类型：</span>
                    <el-select style="width: 100%" v-model="messageType" placeholder="请选择">
                        <el-option
                                v-for="item in messageTypeNum"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </div>
                &lt;!&ndash; 选择H5链接时显示 &ndash;&gt;
                <div v-if="messageType == '1'">
                    <div class="ruleModification_list">
                        <span>推送标题：</span>
                        <el-input v-model="pushTitle" placeholder="请输入内容"></el-input>
                    </div>
                    <div class="ruleModification_list">
                        <span>推送描述：</span>
                        <el-input v-model="pushDescribe" placeholder="请输入内容"></el-input>
                    </div>
                </div>
                &lt;!&ndash; 选择小程序卡片时显示 &ndash;&gt;
                <div v-if="messageType == '2'">
                    <div class="ruleModification_list">
                        <span>小程序：</span>
                        <el-select style="width: 100%" v-model="smallProgram" placeholder="请选择小程序卡片来源">
                            <el-option
                                    v-for="item in smallProgramNum"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="ruleModification_list">
                        <span>推送标题：</span>
                        <el-input v-model="pushTitle" placeholder="请输入内容"></el-input>
                    </div>
                </div>
                <div class="ruleModification_list ruleModification_other">
                    <span>{{messageType == '2'?'卡片图：':'链接配图：'}}</span>
                    <div class="ruleModification_list_right ruleModification_list">
                        <div class="ruleModification_list_right_cont">
                            <input type="file" @change="getImgBase($event, 'b', 0)" ref="image">
                            <div class="ruleModification_list_right_upload">上传图片</div>
                            <p>图片要求：仅限jpg,jpeg,png格式，最小尺寸900px*383px，大小100KB以内</p>
                        </div>
                        <div class="ruleModification_list_right_img">
                            <img :src="uploadImagePath">
                        </div>
                    </div>
                </div>
                <div class="ruleModification_list ruleModification_other">
                    <span style="margin-top: 6px;">图片是否显示体重：</span>
                    <div class="ruleModification_list_right">
                        <el-select style="width: 100%" v-model="showWeight" placeholder="请选择">
                            <el-option
                                    v-for="item in showWeightNum"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                        <div>说明：限代网页授权-精准推送接入方式下图片可设置显示体重</div>
                    </div>
                </div>-->
                <!-- 加推信息 -->
                <div class="ruleModification_head">加推信息</div>
                <div class="ruleModification_addPush" @click="AddPushData"><span>+</span>增加推送</div>
                <template v-for="(item,index) in pushData">
                    <div class="ruleModification_list">
                        <span>消息类型：</span>
                        <el-select style="width: 100%" v-model="item.pushType" placeholder="请选择">
                            <el-option
                                    v-for="item in pushMsgTypeNum"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                        <div class="ruleModification_list_del" @click="delAddPush(item, index)"><img src="../../assets/delete.png" alt=""></div>
                        <div class="ruleModification_list_up" @click="upAddPush(pushData,index,pushData.length)"><img src="../../assets/up.png" alt=""></div>
                        <div class="ruleModification_list_down" @click="downAddPush(pushData,index,pushData.length)"><img src="../../assets/down.png" alt=""></div>
                    </div>
                    <div v-if="item.pushType == 1" style="border-bottom: 2px solid #ddd;margin-bottom: 20px">
                        <div class="ruleModification_list">
                            <span>标题：</span>
                            <el-input v-model="item.addPushTitle" placeholder="请输入内容"></el-input>
                        </div>
                        <div class="ruleModification_list">
                            <span>描述：</span>
                            <el-input v-model="item.desc" placeholder="请输入内容"></el-input>
                        </div>
                        <div class="ruleModification_list">
                            <span>链接地址：</span>
                            <el-input v-model="item.programId" placeholder="请输入链接地址"></el-input>
                        </div>
                        <div class="ruleModification_list ruleModification_other">
                            <span>链接配图：</span>
                            <div class="ruleModification_list_right ruleModification_list">
                                <div class="ruleModification_list_right_cont">
                                    <input type="file" @change="getImgBase($event,'a', index)" ref="images">
                                    <div class="ruleModification_list_right_upload">上传图片</div>
                                    <p>图片要求：仅限jpg,jpeg,png格式，最小尺寸900px*383px，大小100KB以内</p>
                                </div>
                                <div class="ruleModification_list_right_img" v-if="item.picUrL">
                                    <img :src="item.picUrL">
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-if="item.pushType == 2" style="border-bottom: 2px solid #ddd;margin-bottom: 20px">
                        <div class="ruleModification_list">
                            <span>推送标题：</span>
                            <el-input v-model="item.addPushTitle" placeholder="请输入内容"></el-input>
                        </div>
                        <div class="ruleModification_list">
                            <span>跳转路径：</span>
                            <el-input v-model="item.desc" placeholder="请输入内容"></el-input>
                        </div>
                        <div class="ruleModification_list">
                            <span>小程序原始ID：</span>
                            <el-input v-model="item.programId" placeholder="请输入内容"></el-input>
                        </div>
                        <div class="ruleModification_list ruleModification_other">
                            <span>链接配图：</span>
                            <div class="ruleModification_list_right ruleModification_list">
                                <div class="ruleModification_list_right_cont">
                                    <input type="file" @change="getImgBase($event,'a', index)" ref="images">
                                    <div class="ruleModification_list_right_upload">上传图片</div>
                                    <p>图片要求：仅限jpg,jpeg,png格式，最小尺寸900px*383px，大小100KB以内</p>
                                </div>
                                <div class="ruleModification_list_right_img" v-if="item.picUrL">
                                    <img :src="item.picUrL">
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-if="item.pushType == 3" style="border-bottom: 2px solid #ddd;margin-bottom: 20px">
                        <div class="ruleModification_list ruleModification_other">
                            <span>图片：</span>
                            <div class="ruleModification_list_right ruleModification_list">
                                <div class="ruleModification_list_right_cont">
                                    <input type="file" @change="getImgBase($event,'a', index)" ref="images">
                                    <div class="ruleModification_list_right_upload">上传图片</div>
                                    <p>图片要求：仅限jpg,jpeg,png格式，最小尺寸900px*383px，大小100KB以内</p>
                                </div>
                                <div class="ruleModification_list_right_img" v-if="item.picUrL">
                                    <img :src="item.picUrL">
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-if="item.pushType == 4" style="border-bottom: 2px solid #ddd;margin-bottom: 20px">
                        <div class="ruleModification_list">
                            <span>文本内容：</span>
                            <el-input v-model="item.desc" placeholder="请输入内容"></el-input>
                        </div>
                    </div>
                </template>
            </div>
            <div class="packetAllocation_foot">
                <el-button type="primary" @click="addPushSet">保存</el-button>
                <el-button type="warning" @click="resetBtnPush">重置</el-button>
            </div>
        </div>
    </div>
</template>
<script>
    import {Select} from 'element-ui'
    import TreeTransfer from '@/components/report/tree-transfer'
    import {pushList,addPushSet,addPushPage,uploadPic, getCompList} from '@/api/powderAdvertising'
    import AccountApi from '@/api/Account'
    import exportExcel from '@/utils/exportExcel'
    import moment from 'moment'


    export default {
        name: 'packetAllocation',
        mixins: ['mixin'],
        data(){
            return {
                isPushModify: true,                     // 显示修改页
                groupName: '',                          // 规则名称
                groupTime: [],                          // 添加时间
                selectState: '1',                        // 状态
                groupState:[
                    {
                        value : '',
                        label : '全部',
                    },
                    {
                    value: '1',
                    label: '启用'
                }, {
                    value: '0',
                    label: '禁用'
                }],
                modifygroupState:[
                    {
                        value: '1',
                        label: '启用'
                    }, {
                        value: '0',
                        label: '禁用'
                    }],
                tableData: [/*{
                    date: '2016-05-03',
                    name: '王小虎',
                    province: '上海',
                    city: '普陀区',
                    address: '上海市普陀区金沙江路 1518 弄',
                    zip: 200333
                }*/],
                pushType: [],                          // 加推类型
                currentPage: 1,                         // 当前页码
                limitData: 20,                          // 分页条数
                tableTotal: 0,                          // 总条数


            //  修改页
                pushId: '',                                 // 修改页传送ID
                groupModifyName: '',                        // 修改页分组名称
                groupModifyCompany: null,                        // 修改页-所属公司
                groupModifyCompNum: [{
                    CompId: '2',
                    CompName: '美特'
                },{
                    CompId: '3',
                    CompName: '聚鼎'
                },{
                    CompId: '4',
                    CompName: '亲信'
                },{
                    CompId: '5',
                    CompName: '亚太'
                },],
                PushModifySort: null,                       //  排序
                selectModifyState: '',                      //  状态
                messageType: '1',                            //  消息类型
                messageTypeNum: [{
                    value: '1',
                    label: 'H5链接'
                }, {
                    value: '2',
                    label: '小程序卡片'
                }],
                pushTitle: '',                              // 推送标题
                pushDescribe: '',                           // 推送描述
                uploadImagePath: null,                                //存储img base64的值将值传给后端处理

                showWeight: '',                             // 是否显示体重
                showWeightNum: [{
                    value: '0',
                    label: '否'
                }, {
                    value: '1',
                    label: '是'
                }],

                smallProgram: '',                          // 小程序
                smallProgramNum: [{
                    value: '2',
                    label: '美特健康'
                },{
                    value: '1',
                    label: '步数礼'
                },],

               //     加推信息
                pushData: [                                             //

                    // {
                    //    /* sort: '',                               // 排序值
                    //     addPushType: '0',                               // 信息类型
                    //     addPushTitle: '',                               // 标题
                    //     desc: '',                               // 描述
                    //     picUrL: require('../../assets/images/massage_unread.png'),  // 链接配图默认图片
                    //     programId: '',                               // 原始ID*/
                    //
                    //     pushType: '',                               // 信息类型
                    //     programId: '',                         // 原始ID*   链接字段
                    //     addPushTitle: '',                          // H5，小程序标题
                    //     desc: '',                                   // 文本，小程序跳转路径
                    //     picUrL: '',                           // 资源路径
                    // },
                ],

                pushMsgTypeNum: [{
                    value: '1',
                    label: 'H5链接'
                },{
                    value: '2',
                    label: '小程序卡片'
                },{
                    value: '3',
                    label: '图片'
                },{
                    value: '4',
                    label: '文本'
                },{
                    value: '5',
                    label: '语音（暂不支持）'
                },],

                isImgUpload: false,                         // 全部图片上传成功，再提交修改/新增

                uploadImageRealObject: null,


            }
        },
        components :{
            Select,TreeTransfer
        },
        computed:{

        },
        mounted() {
            this.dataQuery();
            this.getCompList()
        },
        methods: {
            // 重置-修改页
            resetBtnPush(){
                this.groupModifyName = ""
                this.groupModifyCompany = ""
                this.PushModifySort = ''
                this.selectModifyState = ''
                this.pushData = []

            },

            getCompList() {
                getCompList().then(data => {
                    if (data.data.Status == 200) {
                        this.groupModifyCompNum = data.data.Result
                    }
                })
            },
            // 修改页-保存
            addPushSet(){
                if(!this.isImgUpload){
                    this.uploadPicUrl()
                    return
                }

                for (var i = 0; i < this.pushData.length; i++) {
                    if (this.pushData[i].pushType != '4' && !this.pushData[i].isImgUpload) {
                        this.uploadPicUrlWithArray(i)
                        return
                    }
                }
                console.log(this.messageType, this.pushDescribe, this.smallProgram)
                addPushSet({
                    pushId: this.pushId,
                    pushName: this.groupModifyName,
                    sort: this.PushModifySort,
                    State: this.selectModifyState,
                    pushType: this.messageType,
                    pushDesc: this.messageType == 1 ? this.pushDescribe : this.smallProgram,
                    pushTitle: this.pushTitle,
                    resourcesUrl: this.uploadImagePath,
                    isWeight: this.showWeight,
                    compId: this.groupModifyCompany,
                    addPushData: this.pushData
                }).then(data => {
                    if(data.data.Status == 200){
                        this.isPushModify = !this.isPushModify
                        this.resetBtnPush()
                        this.dataQuery();
                    } else {
                        this.$notify({
                            title: "提示",
                            message: data.data.Result.ErrorMsg,
                            type: "failed",
                            duration: 2000
                        });
                        return
                    }

                })
            },
            // 数组改变位置
            swapArray(arr, index1, index2) {
                arr[index1] = arr.splice(index2, 1, arr[index1])[0];
                return arr;
            },
            // 下移
            downAddPush(arr,index,len){
                if(index+1 != len){
                    this.swapArray(arr, index, index+1);
                }else{
                    console.log('已经处于置顶，无法上移');
                }
                console.log(this.pushData)
            },
            // 上移
            upAddPush(arr,index,len){
                if(index!= 0){
                    this.swapArray(arr, index, index-1);
                }else{
                    console.log('已经处于置底，无法下移');
                }
                console.log(this.pushData)
            },
            // 删除加推信息
            delAddPush(item,index){
                if(this.pushData.length <= 1){
                    return ;
                }
                this.pushData.splice(index,1)
            },
            // 加推信息
            AddPushData(){
                let vmData = {
                    /*addPushType: '0',                               // 信息类型
                    addPushTitle: '',                               // 标题
                    desc: '',                               // 描述
                    ResourcesUrl: require('../../assets/images/massage_unread.png'),  // 链接配图
                    programId: '',*/
                    pushType: '4',                               // 信息类型
                    programId: '',                         // 原始ID*
                    addPushTitle: '',                          // H5，小程序标题
                    desc: '',                                   // 文本，小程序跳转路径
                    picUrL: '',
                }
                this.pushData.push(vmData);
            },
            // 图片上传接口
            uploadPicUrl(){
                var formData = new FormData();
                console.log("video update1", this.uploadImageRealObject)
                //上传图片
                console.log("video update")
                formData.append("pic", this.uploadImageRealObject);
                uploadPic(formData).then(data => {
                    console.log(data);
                    if(data.data.Status == 200){
                        this.isImgUpload = true;
                        this.uploadImagePath = data.data.Result.Url
                        this.addPushSet()
                    } else {
                        this.$notify({
                            title: "提示",
                            message: data.data.Result.ErrorMsg,
                            type: "failed",
                            duration: 2000
                        });
                        return
                    }
                })
            },
            // 图片上传接口
            uploadPicUrlWithArray(index){
                var formData = new FormData();
                console.log("video update1", this.pushData[index].realUploadObj)
                //上传图片
                console.log("video update")
                formData.append("pic", this.pushData[index].realUploadObj);
                uploadPic(formData).then(data => {
                    console.log(data);
                    if(data.data.Status == 200){
                        this.pushData[index].isImgUpload = true
                        this.pushData[index].picUrL = data.data.Result.Url
                        this.addPushSet()
                    }
                })
            },
            //获取实际的在files中的下标
            getRealIndex(index) {
                var num = 0
                for (var i = 0; i < index; i++) {
                    console.log(this.pushData[i])
                    if (this.pushData[i].pushType == '4') {
                        console.log(this.pushData[i].pushType)
                        num++
                    }
                }
                console.log(num)
                return index - num
            },
            // 图片上传
            getImgBase(e,varVal, index){
                /*console.log(e)
                console.log(this.$refs)
                console.log(e.target.value)*/
                console.log("getImgBase", index)
                let _this = this
                if(varVal == 'a'){

                    console.log(this.pushData)
                    console.log(this.$refs.images)
                    let pushDataImg = []
                    var realIndex = this.getRealIndex(index)
                    console.log("realIndex", realIndex)

                    const fileObj = this.$refs.images[realIndex].files[0];
                    this.pushData[index].realUploadObj = fileObj
                    this.pushData[index].isImgUpload = false
                    const windowURL = window.URL || window.webkitURL;
                    if (fileObj) {
                        const dataURl = windowURL.createObjectURL(fileObj);
                        this.pushData[index].picUrL = dataURl;
                        console.log(dataURl)
                        // this.confirmSubmitEnable()
                    }
                    // this.$refs.image.forEach(item => {
                    //     console.log(item.files[0]);
                    //     pushDataImg.push(item.files[0]);
                    //     const windowURL = window.URL || window.webkitURL;
                    //     /*if (pushDataImg.length > 0) {
                    //         const dataURl = windowURL.createObjectURL(pushDataImg);
                    //         this.uploadImagePath = dataURl;
                    //         console.log(dataURl)
                    //         // this.confirmSubmitEnable()
                    //     }
                    //     _this.uploadImageRealObject.push(item.files[0]);*/
                    // })

                }else{
                    const fileObj = this.$refs.image.files[0];
                    this.uploadImageRealObject = fileObj
                    console.log(this.uploadImageRealObject)
                    const windowURL = window.URL || window.webkitURL;
                    if (fileObj) {
                        const dataURl = windowURL.createObjectURL(fileObj);
                        this.uploadImagePath = dataURl;
                        console.log(dataURl)
                        // this.confirmSubmitEnable()
                    }
                    this.isImgUpload = false
                }
            },
            // 列表页-重置
            resetBtn(){
                this.groupName = '';
                this.groupTime = [];
                this.selectState = '';
            },
            // 查询
            dataQuery(){
                this.offsetData = this.limitData * (this.currentPage - 1);
                pushList({
                    limit: this.limitData,
                    offset: this.offsetData,
                    pushName: this.groupName,
                    start: this.groupTime[0],
                    end: this.groupTime[1],
                    state: this.selectState,
                }).then(data => {
                    this.tableTotal = parseInt(data.data.Result.Count)
                    this.tableData = data.data.Result.List
                    this.tableData.forEach( (item) => {
                        let childItemV = [];
                        if(item.AddType){
                            item.AddType.forEach( childItem => {
                                if(childItem == 1){
                                    childItemV.push('H5链接')
                                }else if(childItem == 2){
                                    childItemV.push('小程序卡片')
                                }else  if(childItem == 3){
                                    childItemV.push('图片')
                                }else  if(childItem == 4){
                                    childItemV.push('文本')
                                }else if(childItem == 5){
                                    childItemV.push('语音')
                                }
                            })
                        }
                        item.PushMsg = childItemV;
                        if(item.PushType == '2'){
                            if(item.PushDesc == '1'){
                                this.pushType = '步数礼'
                            }else if(item.PushDesc == '2'){
                                this.pushType = '美特健康'
                            }
                        }else{
                            this.pushType = 'H5链接'
                        }

                    })
                })
            },
            // 新增-显示修改页
            PushModify(){
                this.isPushModify = !this.isPushModify
                this.isImgUpload = true //新增默认不需要上传图片
            },
            // 修改-赋值
            addPushPageVa(vm){
                console.log(vm)
                addPushPage({
                    pushId: vm,
                }).then(data => {
                    console.log(data);
                    this.pushId = data.data.Result.Info.PushId
                    this.groupModifyName = data.data.Result.Info.PushName
                    this.PushModifySort = data.data.Result.Info.Sort
                    this.selectModifyState = data.data.Result.Info.State
                    this.messageType = data.data.Result.Info.PushType
                    if (this.messageType == 2) {
                        this.smallProgram = data.data.Result.Info.PushDesc
                    } else {
                        this.pushDescribe = data.data.Result.Info.PushDesc
                    }

                    this.pushTitle = data.data.Result.Info.PushTitle
                    this.showWeight = data.data.Result.Info.IsWeight
                    this.uploadImagePath = data.data.Result.Info.ResourcesUrl
                    this.groupModifyCompany = data.data.Result.Info.CompId
                    this.isImgUpload = true
                    // 所属公司
                    this.groupModifyCompNum = data.data.Result.CompList
                    /*
                    * pushType: '',                               // 信息类型
                    smallProgramId: '',                         // 原始ID*
                    pushTitleInfo: '',                          // H5，小程序标题
                    desc: '',                                   // 文本，小程序跳转路径
                    resourcesUrl: require('../../assets/images/massage_unread.png'),
                    * */
                    // 加推信息
                    this.pushData = data.data.Result.AddList.map(item => {
                        return {
                            pushType: item.PushType == '0'?'1':item.PushType,
                            programId: item.SmallProgramId,
                            addPushTitle: item.PushTitleInfo,
                            desc: item.Desc,
                            picUrL: item.ResourcesUrl,
                            isImgUpload : true,
                        }
                    })
                })
            },
            handleClick(vm){
                this.isPushModify = !this.isPushModify
                console.log(vm);
                this.addPushPageVa(vm);
                /*this.isPushModify = !this.isPushModify
                this.groupModifyName = vm.PushName
                this.groupModifyComp = vm.CompId
                this.PushModifySort = vm.Sort
                this.selectModifyState = vm.State
                this.messageType = vm.PushType
                this.pushTitle = vm.PushTitle
                this.pushDescribe = vm.PushDesc
                this.showWeight = vm.IsWeight
                this.smallProgram = vm.PushType
                this.pushId = vm.PushId*/

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
            .packetAllocation_foot{
                display: flex;
                justify-content: center;
                margin-bottom: 100px;
                button{
                    width: 140px;
                    height: 40px;
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
                        max-width: 13em;
                        margin-right: 10px;
                    }
                }
            }
            .packetAllocation_select{
                padding: 0 20px;
                display: flex;
                margin: 20px 0;
            }
            .ruleModification{
                display: flex;
                flex-direction: column;
                margin-top: 20px;
                .ruleModification_head{
                    font-size: 18px;
                    font-weight: bold;
                    box-sizing: border-box;
                    padding: 20px;
                }
                .ruleModification_addPush{
                    padding-left: 50px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    font-size: 16px;
                    color: #FE872F;
                    span{
                        font-size: 24px;
                        margin-right: 4px;
                    }
                }
                .ruleModification_list{
                    width: 500px;
                    display: flex;
                    flex-direction: row;
                    box-sizing: border-box;
                    padding-left:50px;
                    align-items: center;
                    margin-bottom: 20px;
                    position: relative;
                    i{
                        font-size: 20px;
                    }
                    i:nth-child(1){
                        position: absolute;
                        top: 6px;
                        right: -30px;
                    }
                    i:nth-child(2){
                        position: absolute;
                        top: 6px;
                        right: -40px;
                    }
                    .ruleModification_list_del{
                        cursor: pointer;
                        position: absolute;
                        top: 3px;
                        right: -22px;
                        width: 20px;
                        height: 20px;
                        border-radius: 50%;
                        background: #cccccc;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        img{
                            width: 14px;
                            height: 14px;
                        }
                    }
                    .ruleModification_list_del:hover{
                        background: red;
                    }
                    .ruleModification_list_up{
                        cursor: pointer;
                        position: absolute;
                        top: 3px;
                        right: -46px;
                        border-radius: 50%;
                        background: #cccccc;
                        width: 20px;
                        height: 20px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        img{
                            width: 14px;
                            height: 14px;
                        }
                    }
                    .ruleModification_list_up:hover{
                        background: #e6a23c;
                    }
                    .ruleModification_list_down:hover{
                        background: #e6a23c;
                    }
                    .ruleModification_list_down{
                        cursor: pointer;
                        position: absolute;
                        top: 3px;
                        right: -70px;
                        border-radius: 50%;
                        background: #cccccc;
                        width: 20px;
                        height: 20px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        img{
                            width: 14px;
                            height: 14px;
                        }
                    }
                    &.ruleModification_other{
                        align-items: flex-start;

                    }
                    .ruleModification_list_right{
                        width: 100%;
                        display: flex;
                        flex-direction: column;
                        position: relative;
                        padding: 0;
                        .ruleModification_list_right_cont{
                            display: flex;
                            flex-direction: row;
                            .ruleModification_list_right_upload{
                                position: relative;
                                width: 230px;
                                height: 30px;
                                background: #fe872f;
                                color: #fff;
                                border-radius: 4px;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                z-index: 1;
                                cursor: pointer;
                            }
                            input{
                                opacity: 0;
                                position: absolute;
                                left: 0;
                                top: 0;
                                z-index: 10;
                                width: 100px;
                                height: 30px;
                                cursor: pointer;
                                margin-right: 10px;
                            }
                        }
                        .ruleModification_list_right_img{
                            display: flex;
                            position: relative;
                            width: 100%;
                            justify-content: flex-start;
                            .cancel-btn{
                                position: absolute;
                                top: 0;
                                left: 100px;
                            }
                            img{
                                width: 100px;
                                height: 100px;
                            }
                        }
                    }
                    span{
                        text-align: right;
                        margin-right: 10px;
                        width: 13em;
                    }
                }
            }

    }
</style>
