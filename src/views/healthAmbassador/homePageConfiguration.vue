<template>
    <!-- 首页配置 -->
    <div class="homePageConfiguration">
        <div class="homePageConfiguration_wrap" v-if="isShowModify">
            <div class="homePageConfiguration_head">
                <div class="homePageConfiguration_head_txt" @click="showModify('a')">新增banner</div>
            </div>
            <table border="1">
                <thead>
                <tr>
                    <th>编号</th>
                    <th>名称</th>
                    <th>图片</th>
                    <th>链接地址</th>
                    <th>排序</th>
                    <th>状态</th>
                    <th>添加时间</th>
                    <th>操作</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>123456</td>
                    <td>买一送一</td>
                    <td><img src="../../assets/images/logo.png" alt=""></td>
                    <td>www.runoob.com</td>
                    <td>2</td>
                    <td>启用</td>
                    <td>2018-10-18  10:35</td>
                    <td><span @click="showModify('b')">修改</span></td>
                </tr>
                </tbody>
            </table>
        </div>
        <div class="homePageConfiguration_modify" v-if="!isShowModify">
            <div class="homePageConfiguration_modify_item">
                <div class="homePageConfiguration_modify_item_left">名称：<i>*</i></div>
                <div class="homePageConfiguration_modify_item_right"><input type="text" v-model="activityName"></div>
            </div>
            <div class="homePageConfiguration_modify_item">
                <div class="homePageConfiguration_modify_item_left">图片：<i>*</i></div>
                <div class="homePageConfiguration_modify_item_right"><div class="txt">上传banner图片</div><input class="fromData" @change='add_img'  type="file"><span>{{imgTxt?imgTxt:'图片尺寸要求：720px*360px,大小：100KB左右'}}</span></div>
            </div>
            <div class="homePageConfiguration_modify_item">
                <div class="homePageConfiguration_modify_item_left">链接：</div>
                <div class="homePageConfiguration_modify_item_right"><input type="text" v-model="linkAddress"></div>
            </div>
            <div class="homePageConfiguration_modify_item">
                <div class="homePageConfiguration_modify_item_left">排序：<i>*</i></div>
                <div class="homePageConfiguration_modify_item_right"><input type="text" v-model="sortNum"></div>
            </div>
            <div class="homePageConfiguration_modify_item">
                <div class="homePageConfiguration_modify_item_left">状态：<i>*</i></div>
                <div class="homePageConfiguration_modify_item_right">
                    <select name="" id="" v-model="selectV">
                        <option value="1">启用</option>
                        <option value="2">禁用</option>
                    </select>
                </div>
            </div>
            <div class="homePageConfiguration_modify_footer">
                <span @click="Preservation">保存</span>
                <span @click="resetData">重置</span>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'homePageConfiguration',
        data(){
            return {
                isShowModify: true,                // 显示修改页面
                imgData: { accept: 'image/gif, image/jpeg, image/png, image/jpg'},
                imgTxt: '',

                activityName: '',                   // 名称
                linkAddress: '',                    // 链接地址
                sortNum: '',                        // 排序
                selectV: 1,                        //  状态
            }
        },
        mounted(){

        },
        methods:{
            Preservation(){

            },
            resetData(){
                this.activityName = '';
                this.linkAddress = '';
                this.sortNum = '';
                this.selectV = 1;
                this.imgTxt = '';
            },
            showModify(vm){
                this.isShowModify = false;
                if(vm == 'a'){

                }
                if(vm == 'b'){}
            },
            add_img(event){
                let reader =new FileReader();
                let img1=event.target.files[0];
                let type=img1.type;//文件的类型，判断是否是图片
                let size=img1.size;//文件的大小，判断图片的大小
                this.imgTxt = img1.name;
                if(this.imgData.accept.indexOf(type) == -1){
                    alert('请选择我们支持的图片格式！');
                    return false;
                }
                if(size>3145728){
                    alert('请选择3M以内的图片！');
                    return false;
                }
                var uri = ''
                let form = new FormData();
                form.append('file',img1,img1.name);
                /*this.$http.post('/file/upload',form,{
                    headers:{'Content-Type':'multipart/form-data'}
                }).then(response => {
                    // console.log(response.data)
                    // uri = response.data.url
                    // reader.readAsDataURL(img1);
                    // var that=this;
                    // reader.onloadend=function(){
                    //     that.imgs.push(uri);
                    // }
                }).catch(error => {
                    alert('上传图片出错！');
                })*/
            }
        }
    }

</script>
<style lang="less" scoped>
    .homePageConfiguration{
        font-size: 16px;
        font-family: "Microsoft YaHei";
        color: #333;
        display: flex;
        flex-direction: row;
        justify-content: center;
        .homePageConfiguration_wrap{
            width: 98%;
            display: flex;
            flex-direction: column;
            .homePageConfiguration_head{
                display: flex;
                box-sizing: border-box;
                .homePageConfiguration_head_txt{
                    width: 120px;
                    height: 80px;
                    background: #3a8ee6;
                    color: #fff;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 4px;
                    cursor: pointer;
                }
            }
            table{
                width: 100%;
                margin-top: 30px;
                thead{
                    tr{
                        th{
                            border: 1px solid #ddd;
                            text-align: center;
                            font-weight: bold;
                            padding: 10px 0;
                        }
                    }
                }
                tbody{
                    tr{
                        td{
                            border: 1px solid #ddd;
                            text-align: center;
                            box-sizing: border-box;
                            padding: 8px;
                            span{
                                display: flex;
                                justify-content: center;
                                align-items: center;
                                width: 100px;
                                height: 40px;
                                border: 1px solid #FF6B01;
                                border-radius: 4px;
                                text-align: center;
                                margin: 0 auto;
                                cursor: pointer;
                                color: #FF6B01;
                            }
                        }
                    }
                }
            }
        }
        .homePageConfiguration_modify{
            display: flex;
            flex-direction: column;
            width: 100%;
            box-sizing: border-box;
            padding-left: 100px;
            .homePageConfiguration_modify_item{
                display: flex;
                flex-direction: row;
                padding: 10px 0;

                .homePageConfiguration_modify_item_left{
                    margin-right: 20px;
                    width: 100px;
                    i{
                        font-style: normal;
                        color: rgba(255, 107, 1, 1);
                    }
                }
                .homePageConfiguration_modify_item_right{
                    position: relative;
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    .txt{
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        border-radius: 4px;
                        width: 140px;
                        height: 40px;
                        background: rgba(22, 155, 213, 1);
                        color: #fff;
                        margin-right: 20px;
                    }
                    input{
                        outline: none;
                        width: 400px;
                        height: 30px;
                    }
                    .fromData{
                        width: 140px;
                        height: 40px;
                        opacity: 0;
                        position: absolute;
                        top: 0;
                        left: 0;
                    }
                }
            }
            .homePageConfiguration_modify_footer{
                display: flex;
                flex-direction: row;
                margin-top: 40px;
                span{
                    width: 140px;
                    height: 50px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 4px;
                    cursor: pointer;
                }
                span:first-child{
                    background: rgba(255, 107, 1, 1);
                    color: #fff;
                    margin-right: 20px;
                }
                span:last-child{
                    border: 1px solid rgba(228, 228, 228, 1);
                }
            }
        }
    }
</style>