<template>
    <div class="accountManagement">
        <div class="item" style="width: 580px">
            <div style="width: 380px">
                手机号码*
            </div>
            <el-input placeholder="请输入手机号码，必填" v-model="mobile" maxlength="11" type="number"></el-input>
        </div>
        <div class="item" style="width: 580px">
            <div style="width: 380px">
                密码*<br/>(字母和数字组合，长度6-12个字符)
            </div>
            <el-input placeholder="请输入密码，必填" v-model="password" maxlength="12" minlength="6"></el-input>
        </div>
        <div class="item" style="width: 580px">
            <div style="width: 380px">
                重复密码*<br/>(字母和数字组合，长度6-12个字符)
            </div>
            <el-input placeholder="请输入密码，必填" v-model="again_password" maxlength="12" minlength="6"></el-input>
        </div>
        <div class="item" style="width: 580px">
            <div style="width: 380px">
                推荐人ID
            </div>
            <el-input placeholder="请输入推荐人ID，必填" v-model="recommendId" type="number"></el-input>
        </div>

        <el-button type="primary" style="margin-top: 50px;" @click="add">添加账号</el-button>

    </div>
</template>
<script>
    import AccountApi from '@/api/Account'
    export default {
        name: 'addAccount',
        mixins: ['mixin'],
        data(){
            return {
                info : null,
                mobile : "",
                password : "",
                recommendId : "",
                errorMsg: "",
                again_password : "",
            }
        },
        components :{
        },

        mounted() {

        },
        methods: {
            add() {

                if (this.mobile.length <= 0 || this.mobile.length > 11) {
                    this.$notify({
                        title: "警告",
                        message: "手机号码不符合规则",
                        type: "fail",
                        duration: 2000
                    });
                    return
                }
                console.log("addAcccount")
                if (this.password.length <= 0 || this.again_password.length <= 0) {
                    this.$notify({
                        title: "警告",
                        message: "密码不能为空",
                        type: "fail",
                        duration: 2000
                    });
                    return
                }
                if (this.recommendId.length <= 0) {
                    this.$notify({
                        title: "警告",
                        message: "推荐人ID不能为空",
                        type: "fail",
                        duration: 2000
                    });
                    return
                }
                var params = {
                    mobile : this.mobile,
                    password : this.password,
                    again_password : this.again_password,
                    parent_id : this.recommendId
                }
                AccountApi.addAccount(params).then(({data}) => {
                    if (data.Status == 200) {
                        // this.$vux.toast.text(data.Result.ErrogMsg, "center")
                        this.$notify({
                            title: "提示",
                            message: "添加成功",
                            type: "success",
                            duration: 2000
                        });
                        const route = this.$route
                        this.$router.push({ path: '/accountManagement' }, () => {
                            this.$store.dispatch('delVisitedViews', route)
                        })
                    } else {
                        this.$notify({
                            title: "警告",
                            message: data.Result.ErrorMsg,
                            type: "fail",
                            duration: 2000
                        });
                    }
                })
            }
        }
    }

</script>
<style lang="less" scoped>
    .accountManagement {
        padding: 50px;

        .item {
            display: flex;
            flex-direction: row;
            align-items: center;
            padding-top: 20px;
        }
    }
</style>
