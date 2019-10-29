<template>
    <div class="accountManagement">
        <div class="item" style="width: 580px">
            <div style="width: 80px">
                名称：
            </div>
            <el-input placeholder="" v-model="adName" type="text"></el-input>
        </div>
        <div class="item">
            <div style="width: 70px">
                广告主：
            </div>
            <el-select v-model="adUser" filterable placeholder="请选择广告主" @change="adUserChange">
                <el-option
                        v-for="item in userLists"
                        :key="item.CustomerId"
                        :label="item.RealName"
                        :value="item.CustomerId">
                </el-option>
            </el-select>
        </div>
        <div class="item">
            <div class="icon">展示形式:</div>
            <el-select v-model="Adposition" placeholder="请选择广告展示形式" @change="levelChange">
                <el-option
                        v-for="(item, index) in options"
                        :key="index"
                        :label="item"
                        :value="index">
                </el-option>
            </el-select>
        </div>
        <div class="item" style="align-items: baseline">
            <div class="icon">广告图：</div>
            <el-upload style="padding-top: 20px"
                       class="upload-demo"
                       action="https://jsonplaceholder.typicode.com/posts/"
                       :on-preview="handlePreview"
                       :on-remove="handleRemove"
                       :on-change="handleImg"
                       :file-list="uploadImgPath"
                       :limit = '1'
                       list-type="picture"
                       :auto-upload="false"

                       ref="img"
            >
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">图片要求：仅限jpg,jpeg,png格式，最小尺寸{{width}}px*{{height}}px，大小100KB以内</div>
            </el-upload>
        </div>

        <div class="item" style="width: 580px">
            <div style="width: 80px">
                链接：
            </div>
            <el-input placeholder="" v-model="link" type="text"></el-input>
        </div>
        <div class="item" style="width: 580px">
            <div style="width: 70px">
                展示时间：
            </div>
            <el-date-picker
                    v-model="startTime"
                    type="date"
                    placeholder="选择日期"
                    value-format="yyyy-MM-dd"
                >
            </el-date-picker>
            <div style="padding-left: 20px;padding-right: 20px">至</div>
            <el-date-picker
                    v-model="endTime"
                    type="date"
                    placeholder="选择日期"
                    value-format="yyyy-MM-dd"
            >
            </el-date-picker>
        </div>

        <div class="item">
            <div>针对用户性别展示：</div>
            <el-checkbox v-model="checkAllGender" @change="handleCheckAllGenderChange">全部</el-checkbox>
            <el-checkbox-group v-model="checkedGenders" @change="handleCheckedGendersChange">
                <el-checkbox v-for="gender in genders" :label="gender.value" :key="gender.value">{{ gender.name }}</el-checkbox>
            </el-checkbox-group>
        </div>


        <div class="item">
            <div>广告数据：</div>
            <div style="padding-left: 20px">{{info && info.TotalPeople ? info.TotalPeople : 0}}(点击人数)</div>
            <div style="padding-left: 50px">{{info && info.TotalClicks ? info.TotalClicks : 0}}(点击次数)</div>
        </div>
        <div class="item" style="width: 580px">
            <div style="width: 80px">
                排序：
            </div>
            <el-input placeholder="说明：数字越大优先级越高" v-model="sort" type="number"></el-input>
        </div>
        <div class="item">
            <div class="icon" style="width: 70px">状态</div>
            <el-select v-model="status" placeholder="启用" @change="statusChange">
                <el-option
                        v-for="(item, index) in statusOptions"
                        :key="index"
                        :label="item"
                        :value="index">
                </el-option>
            </el-select>
        </div>
        <el-button type="primary" style="margin-top: 50px;" @click="add">保存</el-button>
        <el-button @click="reset">重置</el-button>
        <el-button onclick="history.back()">取消</el-button>
    </div>
</template>
<script>
    import AccountApi from '@/api/Account'

    export default {
        name: 'addAD',
        mixins: ['mixin'],
        data(){
            return {
                info : null,
                adName : "",
                adUser : "",
                Adposition : '',
                options : ['侧边悬浮广告', '底部悬浮广告', '一行两个广告','一行一个广告', '底部菜单广告'],
                sizeOptions : [
                    {width : '130', height : '130'},
                    {width : '750', height : '180'},
                    {width : '340', height : '220'},
                    {width : '750', height : '290'},
                    {width : '48', height : '48'},    //侧边悬浮：130*130  底部悬浮：750*180 1排1个：750*290 1排2个：340*220
                ],
                width : '',
                height : '',
                uploadImgPath : [],
                uploadImgRealObject : null,
                link: "",
                startTime : "",
                endTime : "",
                userList : [],
                userLists : [],
                isListLoading : false,
                sort : "",
                status : "",
                statusOptions : ['启用', '禁用'],
                adId : "",
                isUploadImg : false,  //是否要上传图片
                uploadedImgUrl : '',  //已经上传图片地址
                checkAllGender: true,
                checkedGenders: ['1', '2', '0'],
                genders: [
                    { name: '男', value: '1' },
                    { name: '女', value: '2' },
                    { name: '未知', value: '0' }
                ]
            }
        },
        components :{
        },
        computed : {


        },

        mounted() {
            this.adId = this.$route.query.id
            console.log(this.adId)
            this.getAdUsers()
            if (this.adId) {
                this.getAdInfo()
            } else {
                this.isUploadImg = true
            }
        },
        methods: {

            handleCheckAllGenderChange (value) {
                this.checkedGenders = value ? this.genders.map(item => item.value) : []
            },
            handleCheckedGendersChange (value) {
                this.checkAllGender = value.length === this.genders.length
            },
            handleRemove(file, fileList) {
                console.log(file, fileList);
                this.isUploadImg = true
            },
            handlePreview(file) {
                console.log(file);
            },
            getAdInfo() {
                AccountApi.getAdInfo({Id : this.adId}).then(({data}) => {
                    if (data.Status == 200) {
                        this.info = data.Result
                        this.adName = this.info.Name;
                        this.adUser = this.info.CustomerId
                        this.Adposition = this.info.AdvType - 1
                        this.link = this.info.AdvUrl
                        this.startTime = this.info.ShowStartTime
                        this.endTime = this.info.ShowEndTime
                        this.sort = this.info.Sort
                        this.status = parseInt(this.info.Status)
                        if (this.info.Sex) {
                          this.checkedGenders = this.info.Sex.split(',')
                        }
                        // this.checkedGenders = this.info.Sex ? this.info.Sex.split(',') : []
                        this.checkAllGender = this.checkedGenders.length === 3
                        this.uploadImgPath = [{name : '', url : this.info.AdvImg}]
                        this.isUploadImg = false
                        this.levelChange()
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
            statusChange() {

            },
            adUserChange() {
                console.log(this.adUser)
            },
            getAdUsers() {
                AccountApi.getAdUsers().then(({data}) => {
                    if (data.Status == 200) {
                        this.userLists = data.Result
                    }
                })
            },
            handleImg(file, fileList) {
                console.log("handleImg", file, fileList, this.$refs.img)
                this.uploadImgPath = fileList
                if (fileList.length > 0) {
                    this.uploadImgRealObject = file.raw
                } else {
                    this.uploadImgRealObject = null
                }
            },
            selectUser() {
                console.log("selectUser")
            },
            reset() {
                this.adName = ""
                this.adUser = ""
                this.Adposition = ""
                this.isUploadImg = true
                this.uploadImgRealObject = null
                this.link = ""
                this.startTime = ""
                this.endTime  = ""
                this.sort = ""
                this.status = 0
                this.checkAllGender = true
                this.checkedGenders = ['1', '2', '0']
            },
            levelChange() {
                console.log(this.Adposition)
                if (this.Adposition) {
                    this.width = this.sizeOptions[this.Adposition].width
                    this.height = this.sizeOptions[this.Adposition].height
                } else {
                    if (this.Adposition == 0) {
                        this.width = this.sizeOptions[this.Adposition].width
                        this.height = this.sizeOptions[this.Adposition].height
                    } else {
                        this.width = ''
                        this.height = ''
                    }
                }
            },
            add() {
                if (this.adName.trim().length <= 0) {
                    this.$notify({
                        title: "警告",
                        message: "广告名称不能为空",
                        type: "fail",
                        duration: 2000
                    });
                    return
                }

                if (this.adUser.length <= 0) {
                    this.$notify({
                        title: "警告",
                        message: "请选择广告主",
                        type: "fail",
                        duration: 2000
                    });
                    return
                }
                if (this.Adposition.length <= 0) {
                    this.$notify({
                        title: "警告",
                        message: "请选择展示形式",
                        type: "fail",
                        duration: 2000
                    });
                    return
                }

                console.log(this.uploadImgPath)
                if (this.isUploadImg && this.uploadImgRealObject == null) {
                    this.$notify({
                        title: "警告",
                        message: "广告图不能为空",
                        type: "fail",
                        duration: 2000
                    });
                    return
                }

                // if (this.link.length <= 0) {
                //     this.$notify({
                //         title: "警告",
                //         message: "请填写链接",
                //         type: "fail",
                //         duration: 2000
                //     });
                //     return
                // }
                if (this.startTime.length <= 0) {
                    this.$notify({
                        title: "警告",
                        message: "请选择开始时间",
                        type: "fail",
                        duration: 2000
                    });
                    return
                }
                if (this.endTime.length <= 0) {
                    this.$notify({
                        title: "警告",
                        message: "请选择结束时间",
                        type: "fail",
                        duration: 2000
                    });
                    return
                }
                if (this.checkedGenders.length === 0) {
                    this.$notify({
                        title: "警告",
                        message: "请选择针对的用户性别",
                        type: "fail",
                        duration: 2000
                    });
                    return
                }
                if (this.sort.trim().length <= 0) {
                    this.$notify({
                        title: "警告",
                        message: "排序不能为空",
                        type: "fail",
                        duration: 2000
                    });
                    return
                }
                if (this.status.length <= 0) {
                    this.$notify({
                        title: "警告",
                        message: "请选择状态",
                        type: "fail",
                        duration: 2000
                    });
                    return
                }
                if (this.isUploadImg) {
                    this.uploadImg()
                } else {
                    if (this.uploadedImgUrl.length > 0) {
                        this.uploadInfo(this.uploadedImgUrl)
                    } else {
                        this.uploadInfo(this.info.AdvImg)
                    }
                }

            },
            //添加或者修改广告
            uploadInfo(imgUrl) {
                var params = {
                    Id : this.adId,
                    Name : this.adName,
                    AdvType : this.Adposition + 1,
                    CustomerId : this.adUser,
                    AdvImg : imgUrl,
                    AdvUrl : this.link,
                    ShowStartTime : this.startTime,
                    ShowEndTime : this.endTime,
                    Sort : this.sort,
                    Status : this.status,
                    Sex: [...this.checkedGenders].sort().join(',')
                }

                AccountApi.addAd(params).then(({data}) => {
                    if (data.Status == 200) {
                        this.$notify({
                            title: "提示",
                            message: this.adId ? "修改成功" : "添加成功",
                            type: "success",
                            duration: 2000
                        });
                        const route = this.$route
                        this.$router.push({ path: '/adConfigList' }, () => {
                            this.$store.dispatch('delVisitedViews', route)
                        })
                    } else {
                        this.$notify({
                            title: "提示",
                            message: data.Result.ErrorMsg,
                            type: "failed",
                            duration: 2000
                        });
                    }
                })
            },
            uploadImg() {
                var formData = new FormData();
                console.log("video update1", this.uploadImgRealObject)
                //上传视频
                console.log("video update")
                formData.append("pic", this.uploadImgRealObject);
                // formData.append("pic", this.uploadVideoRealObject);
                AccountApi.uploadImage(formData).then(({data}) => {
                    console.log(data)
                    if (data.Status == 200) {
                        this.uploadedImgUrl = data.Result.url
                        this.isUploadImg = true
                        this.uploadInfo(this.uploadedImgUrl)
                    } else {
                        this.$notify({
                            title: "提示",
                            message: data.Result.ErrorMsg,
                            type: "failed",
                            duration: 2000
                        });
                    }
                })
            },
        }
    }

</script>
<style lang="less" scoped>
    .accountManagement {
        padding-left: 50px;

        .item {
            display: flex;
            flex-direction: row;
            align-items: center;
            padding-top: 30px;

            .icon {
                flex-shrink: 0;
                padding-right: 12px;
            }
        }
    }
</style>
