<template>
    <div class="accountManagement" v-loading="isLoading">
        <div class="caseItem">
            <div>● 字典名称</div>
            <div style="width: 100%;background: #ddd;height: 1px;margin-top: 8px"></div>
            <div class="item">
                <el-input style="width: 300px; margin-right: 20px" placeholder="输入数据字典名称" v-model="name" type="text"></el-input>
                <div style="color: red">*只能输入[a-zA-Z]</div>
            </div>
        </div>
        <div class="caseItem">
            <div>● key-value</div>
            <div style="width: 100%;background: #ddd;height: 1px;margin-top: 8px"></div>
            <div class="item">
                <div style="width: 220px">下标</div>
                <div style="width: 220px">键值</div>
                <div style="width: 220px">状态</div>
                <div style="width: 220px">排序（从小到大）</div>
            </div>
            <div class="item" v-for="item, index in contentList">
                <el-input style="width: 200px; margin-right: 20px" placeholder="" v-model="item.key" type="text"></el-input>
                <el-input style="width: 200px; margin-right: 20px" placeholder="" v-model="item.value" type="text"></el-input>
                <el-input style="width: 200px; margin-right: 20px" placeholder="" v-model="item.flag" type="text"></el-input>
                <el-input style="width: 200px; margin-right: 20px" placeholder="" v-model="item.sort" type="text"></el-input>
                <el-button v-if="index == 0" type="primary" icon="el-icon-plus" @click="addContent"></el-button>
                <el-button v-else type="danger" icon="el-icon-minus" @click="deleteContent(index)"></el-button>
            </div>
        </div>
        <div class="caseItem">
            <div>● 备注</div>
            <div style="width: 100%;background: #ddd;height: 1px;margin-top: 8px"></div>
            <div class="item">
                <el-input style="width: 300px; margin-right: 20px" placeholder="输入备注" v-model="remark" type="text"></el-input>
            </div>
        </div>
        <div class="caseItem">
            <div class="item" style="padding-left: 20px;">
                <template>
                    <el-radio v-model="status" label="1">开启</el-radio>
                    <el-radio v-model="status" label="0">禁用</el-radio>
                </template>
            </div>
            <el-button style="margin-top: 20px;width: 100px" @click="add" type="danger">保存</el-button>
            <el-button style="margin-top: 20px;width: 100px" @click="cancel" >取消</el-button>
        </div>
    </div>
</template>
<script>
    import AccountApi from '@/api/Account'
    import qs from 'qs'
    //新增和编辑数字字典
    export default {
        name: 'addDataZD',
        mixins: ['mixin'],
        data(){
            return {
                contentList : [],
                isLoading : false,
                status : '',
                name : '',
                remark : '',
                id : '',
            }
        },
        components :{
        },
        computed : {


        },

        mounted() {
            this.id = this.$route.query.id;
            console.log(this.id)
            if (this.id) {
                this.getInfo()
            } else {
                this.addContent()
            }
        },
        methods: {
            cancel() {
                const route = this.$route
                this.$router.push({ path: '/dataZDManger', }, () => {
                    this.$store.dispatch('delVisitedViews', route)
                })
            },
            getInfo() {
                let params = {
                    id : this.id,
                }
                AccountApi.getDictionaryInfo(params).then(data => {
                    if (data.data.Status == 200) {
                        this.name = data.data.Result.Name;
                        this.remark = data.data.Result.Remark;
                        this.status = data.data.Result.Status;
                        this.contentList = data.data.Result.Content;
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
            addContent() {
                this.contentList.push({key : '', value : '', flag : '', sort: ''})
            },
            add() {
                if (this.isLoading) {
                    return
                }
                if (this.name.length <= 0) {
                    this.$notify({
                        title: "提示",
                        message: "名称不能为空",
                        type: "failed",
                        duration: 2000
                    });
                    return;
                }
                for (var i=0;i<this.contentList.length;i++) {
                    let item = this.contentList[i]
                    if (item.key.length <= 0 || item.value.length <= 0 || item.flag.length <= 0 || item.sort.length <= 0) {
                        this.$notify({
                            title: "提示",
                            message: "key-value不能为空",
                            type: "failed",
                            duration: 2000
                        });
                        return;
                    }
                }
                // this.contentList.forEach(item => {
                //     if (item.key.length <= 0 || item.value.length <= 0 || item.flag.length <= 0 || item.sort.length <= 0) {
                //         this.$notify({
                //             title: "提示",
                //             message: "key-value不能为空",
                //             type: "failed",
                //             duration: 2000
                //         });
                //         return;
                //     }
                // })
                if (this.remark.length <= 0) {
                    this.$notify({
                        title: "提示",
                        message: "备注不能为空",
                        type: "failed",
                        duration: 2000
                    });
                    return;
                }
                if (this.status.length <= 0) {
                    this.$notify({
                        title: "提示",
                        message: "状态不能为空",
                        type: "failed",
                        duration: 2000
                    });
                    return;
                }

                let reg = /^[a-zA-Z]+$/
                if (!reg.test(this.name)) {
                    this.$notify({
                        title: "提示",
                        message: "您输入的名称不全是字母",
                        type: "failed",
                        duration: 2000
                    });
                    return;
                }
                this.isLoading = true
                let postData = {
                    name : this.name,
                    content : JSON.stringify(this.contentList),
                    remark : this.remark,
                    status : this.status,
                }
                if (this.id) {
                    postData.id = this.id;
                    AccountApi.editDictionary(postData).then(data => {
                        this.isLoading = false
                        if (data.data.Status == 200) {
                            this.$notify({
                                title: "提示",
                                message: this.id ? "修改成功" : "添加成功",
                                type: "success",
                                duration: 2000
                            });
                            const route = this.$route
                            this.$router.push({ path: '/dataZDManger', query : {refresh : 1} }, () => {
                                this.$store.dispatch('delVisitedViews', route)
                            })
                        } else {
                            this.$notify({
                                title: "提示",
                                message: data.data.Result.ErrorMsg,
                                type: "failed",
                                duration: 2000
                            });
                        }
                    })
                } else {
                    AccountApi.addDictionary(postData).then(data => {
                        this.isLoading = false
                        if (data.data.Status == 200) {
                            this.$notify({
                                title: "提示",
                                message: this.id ? "修改成功" : "添加成功",
                                type: "success",
                                duration: 2000
                            });
                            const route = this.$route
                            this.$router.push({ path: '/dataZDManger', query : {refresh : 1} }, () => {
                                this.$store.dispatch('delVisitedViews', route)
                            })
                        } else {
                            this.$notify({
                                title: "提示",
                                message: data.data.Result.ErrorMsg,
                                type: "failed",
                                duration: 2000
                            });
                        }
                    })
                }
            },
            deleteContent(index) {
                console.log('delete', index)
                this.contentList.splice(index, 1)
            },


        }
    }

</script>
<style lang="less" scoped>
    .accountManagement {
        padding: 20px;
        background: #f9f9f9;
        .caseItem {
            background: #fff;
            margin-bottom: 20px;
            padding: 10px;
            .item {
                display: flex;
                flex-direction: row;
                align-items: center;
                padding-top: 30px;
                padding-left: 50px;

                .icon {
                    flex-shrink: 0;
                    padding-right: 12px;
                }
            }
            .adItem {
                border: 1px solid orange;
                border-radius: 5px;
                background: #fff0e7;
                padding: 10px;
                padding-left: 80px;
                display: flex;
                flex-direction: row;
                margin-top: 20px;
                width: 1100px;
            }
            .areaItem {
                border: 1px solid #b7b7b7;
                border-radius: 5px;
                background: #e4e4e4;
                margin-top: 20px;
                height: 50px;
                text-align: center;
                line-height: 50px;
                width: 1100px;
            }
        }

    }
</style>
