<template>
    <div class="filter">
        <div class="filteItem">
            <div class="icon">微信图文链接:   </div>
            <el-input style="width: 500px" v-model="wxUrl" placeholder="微信的图文链接"></el-input>
        </div>
        <div class="filteItem">
            <div class="icon">设备激活绑定流程:</div>
            <el-input style="width: 500px" type="textarea" autosize v-model="text" placeholder="设备激活绑定流程"></el-input>
        </div>

        <el-button class="submitBtn" type="primary" @click="submitTxt">提交</el-button>

        <div class="video">
            <div style="padding-bottom: 20px">上传教学视频：</div>
            <input class="inputVideo" type="file" accept="video/*" ref="video" @change="inputVideo($event)"/>
            <video v-if="uploadVideoPath" class="video" :src="uploadVideoPath" controls="controls"/>
        </div>
        <el-button class="submitBtn" type="primary" @click="uploadVideo">上传视频</el-button>
    </div>

</template>
<script>
    import AccountApi from '../../api/Account'
    export default {
        name: 'otherConfiguration',
        data() {
            return {
                wxUrl : "",
                text : "",
                uploadVideoRealObject: null,
                uploadVideoPath : null,
                uploadUrl: "",
            }
        },
        mounted() {
            // this.uploadUrl =
            this.getInfo()
        },
        methods : {
            inputVideo(e) {
                console.log(e)
                console.log(this.$refs)
                console.log(e.target.value)
                const fileObj = this.$refs.video.files[0];
                this.uploadVideoRealObject = fileObj
                const windowURL = window.URL || window.webkitURL;
                if (fileObj) {
                    const dataURl = windowURL.createObjectURL(fileObj);
                    this.uploadVideoPath = dataURl;
                    console.log(dataURl)
                    // this.confirmSubmitEnable()
                }

            },
            uploadVideo() {
                if (this.uploadVideoPath.length <= 0) {
                    this.$notify({
                        title: "提示",
                        message: "视频不能为空",
                        type: "failed",
                        duration: 2000
                    });
                    return
                } else {
                    if (this.uploadVideoRealObject != null) {
                        var formData = new FormData();
                        console.log("video update1", this.uploadVideoRealObject)
                        //上传视频
                        console.log("video update")
                        formData.append("pic", this.uploadVideoRealObject);
                        // formData.append("pic", this.uploadVideoRealObject);
                        AccountApi.uploadVideo(formData).then(({data}) => {
                            console.log(data)
                            if (data.Status == 200) {
                                this.$notify({
                                    title: "提示",
                                    message: "修改成功",
                                    type: "success",
                                    duration: 2000
                                });
                            } else {
                                this.$notify({
                                    title: "提示",
                                    message: data.Result.ErrorMsg,
                                    type: "failed",
                                    duration: 2000
                                });
                            }
                        })
                    }
                }


            },
            getInfo() {
                AccountApi.showConfig().then(({data}) => {
                    if (data.Status == 200) {
                        this.wxUrl = data.Result.wxUrl
                        this.text = data.Result.text
                        if (data.Result.url.length > 0) {
                            this.uploadVideoPath = data.Result.url
                        }
                    }
                })
            },
            submitTxt() {
                if (this.wxUrl.length <= 0) {
                    this.$notify({
                        title: "提示",
                        message: "微信图文链接不能为空",
                        type: "failed",
                        duration: 2000
                    });
                    return
                }
                if (this.text.length <= 0) {
                    this.$notify({
                        title: "提示",
                        message: "设备激活绑定流程文案不能为空",
                        type: "failed",
                        duration: 2000
                    });
                    return
                }
                var params = {
                    text : this.text,
                    wxUrl : this.wxUrl,
                }
                AccountApi.setConfig(params).then(({data}) => {
                    if (data.Status == 200) {
                        this.$notify({
                            title: "提示",
                            message: "修改成功",
                            type: "success",
                            duration: 2000
                        });
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
        },
    }

</script>
<style lang="less" scoped>
    .filter {
        display: flex;
        flex-direction: column;
        padding: 50px;

        .video {
            margin-top: 50px;
        }
        .submitBtn {
            width: 100px;
            margin-top: 50px;
        }
        .filteItem {
            margin-right: 30px;
            margin-top: 30px;
            display: flex;
            flex-direction: row;
            align-items: center;
            .icon {
                flex-shrink: 0;
                padding-right: 12px;
            }
        }
    }
</style>
