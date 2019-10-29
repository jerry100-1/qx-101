<template>
    <div class="accountManagement" v-loading="isLoading">
        <div class="caseItem">
            <div>● 基本信息设置</div>
            <div style="width: 100%;background: #ddd;height: 1px;margin-top: 8px"></div>
            <div class="item" style="width: 580px">
                <div style="width: 80px">
                    名称：
                </div>
                <el-input placeholder="" v-model="adName" type="text"></el-input>
            </div>
            <div class="item" style="width: 580px">
                <div style="width: 80px">
                    配置用途说明：
                </div>
                <el-input
                        type="textarea"
                        :autosize="{ minRows: 2, maxRows: 4}"
                        placeholder="请输入配置用途说明"
                        v-model="mark">
                </el-input>
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
        </div>
        <div class="caseItem">
            <div>● 适用设备筛选</div>
            <div style="width: 100%;background: #ddd;height: 1px;margin-top: 8px"></div>
            <div class="item" style="padding-left: 120px;">
                <template style="padding-top: 10px">
                    <el-radio v-model="deviceSelectType" label="1">全部设备</el-radio>
                    <el-radio v-model="deviceSelectType" label="2">指定设备ID</el-radio>
                </template>
            </div>
            <div style="padding-left: 120px;width: 500px;padding-top: 20px">
                <el-input v-if="deviceSelectType == 2"
                          type="textarea"
                          :autosize="{ minRows: 2, maxRows: 4}"
                          placeholder="填写设备ID，多个使用英文;分割,末尾一定要有;号"
                          v-model="deviceIds">
                </el-input>
            </div>

        </div>
        <div class="caseItem">
            <div>● 关注公众号页面配置</div>
            <div style="width: 100%;background: #ddd;height: 1px;margin-top: 8px"></div>
            <div class="item" style="align-items: baseline">
                <div class="icon">广告图：</div>
                <el-upload style="padding-top: 20px;padding-left: 70px"
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
                    <div slot="tip" class="el-upload__tip">图片要求：仅限jpg,jpeg,png格式，最小尺寸750px*1306px，大小400KB以内,重新提交图片，请删掉后再上传</div>
                </el-upload>
            </div>
            <div class="item" style="align-items: baseline">
                <div class="icon">公众号下方提示语：</div>
                <el-input
                          type="textarea"
                          :autosize="{ minRows: 2, maxRows: 4}"
                          placeholder=""
                          v-model="wxdownContent">
                </el-input>
            </div>
            <div style="padding-left: 200px">(插入&lt;br&gt;换行）</div>
            <div class="item" style="align-items: baseline; padding-left: 90px">
                <div class="icon">底部提示语：</div>
                <el-input
                        type="text"
                        placeholder=""
                        v-model="wxbottomContent">
                </el-input>
            </div>
        </div>
        <div class="caseItem">
            <div>● 关注公众号页面配置</div>
            <div style="width: 100%;background: #ddd;height: 1px;margin-top: 8px"></div>
            <div class="item" style="align-items: baseline">
                <div class="icon" style="width: 130px;text-align: right">添加广告：</div>
                <el-button type="danger" plain @click="addBoradAd">侧边悬浮广告</el-button>
                <el-button type="danger" plain @click="addBottomAd">底部悬浮广告(限1个)</el-button>
                <el-button type="danger" plain @click="addCircleAd">轮播广告</el-button>
                <el-button type="danger" plain @click="addListAd">列表广告</el-button>
                <el-button type="danger" plain @click="addTabbarAd">底部菜单广告</el-button>
            </div>

            <div class="adItem"  v-for="(item, index) in SusAdv">
                <div v-if="item.type == 2 || item.type == 1" style="display: flex; flex-direction: row">
                    <div class="icon" style="width: 128px;">侧边悬浮广告：</div>
                    <el-select style="width: 100px" v-model="item.type" placeholder="item.type == 1 ? '左侧': '右侧'" @change="boradAdvChange(item, index)">
                        <el-option
                                v-for="(item, index) in positionOptions"
                                :key="index"
                                :label="item"
                                :value="index + 1">
                        </el-option>
                    </el-select>
                    <el-select style="padding-left: 50px; width: 300px" v-model="item.adv[0]" filterable placeholder="广告名称（单选）" @change="adUserChange">
                        <el-option
                                v-for="item in boradAdList"
                                :key="item.Id"
                                :label="item.Name"
                                :value="item.Id">
                        </el-option>
                    </el-select>
                    <el-button style="margin-left: 50px" type="danger" icon="el-icon-delete" circle @click="deleteBorderAd(index)"></el-button>
                </div>
                <div v-if="item.type == 3" style="display: flex; flex-direction: row">
                    <div class="icon" style="width: 128px;">底部悬浮广告：</div>
                    <el-select style="width: 400px" v-model="item.adv[0]" filterable placeholder="广告名称（单选）">
                        <el-option
                                v-for="item in bottomAdList"
                                :key="item.Id"
                                :label="item.Name"
                                :value="item.Id">
                        </el-option>
                    </el-select>
                    <el-select style="width: 150px;padding-left: 50px" v-model="item.off" placeholder="不可关闭">
                        <el-option
                                v-for="(item, index) in closeOptions"
                                :key="index"
                                :label="item"
                                :value="index">
                        </el-option>
                    </el-select>
                    <el-button style="margin-left: 50px" type="danger" icon="el-icon-delete" circle @click="deleteBottomAd(index)"></el-button>
                </div>
            </div>
            <div class="areaItem">
                称重结果展示区域
            </div>
            <div class="adItem" style="flex-direction: column" v-for="(item, index) in ResultAdv">
                <div style="display: flex;flex-direction: row">
                    <div class="icon" style="width: 128px; padding-right: 30px">{{item.label}}：</div>
                    <el-input style="width: 250px;" placeholder="栏目名称，非必填，未填写不显示" v-model="item.name" type="text"></el-input>
                    <div style="padding-left: 50px;padding-top: 6px" v-if="item.type > 4">一排显示：</div>
                    <el-select style="width: 150px;padding-left: 50px"
                               v-model="item.type" placeholder="1个" v-if="item.type > 4" @change="numChange(index, TYPE_RESULT)">
                        <el-option
                                v-for="(item, index) in numOptions"
                                :key="index"
                                :label="item"
                                :value="index + 5">
                        </el-option>
                    </el-select>
                    <el-button style="margin-left: 200px" type="danger" icon="el-icon-delete" circle @click="deleteTrendAd(index, TYPE_RESULT)"></el-button>
                    <el-button style="margin-left: 20px" type="danger" icon="el-icon-arrow-up" circle @click="upTrendAd(index, TYPE_RESULT)"></el-button>
                    <el-button style="margin-left: 20px" type="danger" icon="el-icon-arrow-down" circle @click="downTrendAd(index, TYPE_RESULT)"></el-button>
                </div>
                <el-button style="width: 100px;margin-top: 20px;margin-left: 128px" type="primary" plain icon="el-icon-plus" @click="addCircleAdItem(index, TYPE_RESULT)">增加广告</el-button>
                <div v-for="(adItem, adIndex) in item.adv" style="padding-left: 128px">
                    <el-select style="width: 400px; padding-top: 20px" v-model="ResultAdv[index].adv[adIndex]" filterable placeholder="广告名称（单选）">
                        <el-option
                                v-for="item in (item.type == 6 ? twoRowAdList : oneRowAdList)"
                                :key="item.Id"
                                :label="item.Name"
                                :value="item.Id">
                        </el-option>
                    </el-select>
                    <el-button style="margin-left: 50px" type="danger" icon="el-icon-delete" circle @click="deleteTrendAdItem(index, adIndex, TYPE_RESULT)"></el-button>
                    <el-button style="margin-left: 20px" type="danger" icon="el-icon-arrow-up" circle @click="upTrendAdItem(index, adIndex, TYPE_RESULT)"></el-button>
                    <el-button style="margin-left: 20px" type="danger" icon="el-icon-arrow-down" circle @click="downTrendAdItem(index, adIndex, TYPE_RESULT)"></el-button>
                </div>
            </div>
            <div class="areaItem">
                体重趋势展示区域
            </div>
            <div class="adItem" style="flex-direction: column" v-for="(item, index) in trendAdv">
                <div style="display: flex;flex-direction: row">
                    <div class="icon" style="width: 128px; padding-right: 30px">{{item.label}}：</div>
                    <el-input style="width: 250px;" placeholder="栏目名称，非必填，未填写不显示" v-model="item.name" type="text"></el-input>
                    <div style="padding-left: 50px;padding-top: 6px" v-if="item.type > 4">一排显示：</div>
                    <el-select style="width: 150px;padding-left: 50px"
                               v-model="item.type" placeholder="1个" v-if="item.type > 4" @change="numChange(index, TYPE_TREND)">
                        <el-option
                                v-for="(item, index) in numOptions"
                                :key="index"
                                :label="item"
                                :value="index + 5">
                        </el-option>
                    </el-select>
                    <el-button style="margin-left: 200px" type="danger" icon="el-icon-delete" circle @click="deleteTrendAd(index, TYPE_TREND)"></el-button>
                    <el-button style="margin-left: 20px" type="danger" icon="el-icon-arrow-up" circle @click="upTrendAd(index, TYPE_TREND)"></el-button>
                    <el-button style="margin-left: 20px" type="danger" icon="el-icon-arrow-down" circle @click="downTrendAd(index, TYPE_TREND)"></el-button>
                </div>
                <el-button style="width: 100px;margin-top: 20px;margin-left: 128px" type="primary" plain icon="el-icon-plus" @click="addCircleAdItem(index, TYPE_TREND)">增加广告</el-button>
                <div v-for="(adItem, adIndex) in item.adv" style="padding-left: 128px">
                    <el-select style="width: 400px; padding-top: 20px" v-model="trendAdv[index].adv[adIndex]" filterable placeholder="广告名称（单选）">
                        <el-option
                                v-for="item in (item.type == 6 ? twoRowAdList : oneRowAdList)"
                                :key="item.Id"
                                :label="item.Name"
                                :value="item.Id">
                        </el-option>
                    </el-select>
                    <el-button style="margin-left: 50px" type="danger" icon="el-icon-delete" circle @click="deleteTrendAdItem(index, adIndex, TYPE_TREND)"></el-button>
                    <el-button style="margin-left: 20px" type="danger" icon="el-icon-arrow-up" circle @click="upTrendAdItem(index, adIndex, TYPE_TREND)"></el-button>
                    <el-button style="margin-left: 20px" type="danger" icon="el-icon-arrow-down" circle @click="downTrendAdItem(index, adIndex, TYPE_TREND)"></el-button>
                </div>
            </div>

            <div v-if="tabbarAdv" class="adItem" style="flex-direction: column">
                <div style="display: flex;flex-direction: row">
                    <div class="icon" style="width: 128px; padding-right: 30px">{{tabbarAdv.label}}：</div>
                    <div>
                        <span>当前菜单中第</span>
                        <el-select
                            v-model="tabbarAdv.name"
                            style="width: 100px; margin: 0 10px">
                            <el-option
                                    v-for="item in 5"
                                    v-if="item <= tabbarAdv.adv.length"
                                    :key="item"
                                    :label="item"
                                    :value="item">
                            </el-option>
                        </el-select>
                        <span>个图标为当前页面默认选中图标</span>
                    </div>
                    <el-button style="margin-left: 50px" type="danger" icon="el-icon-delete" circle @click="deleteTabbarAdv"></el-button>
                </div>
                <el-button style="width: 100px;margin-top: 20px;margin-left: 128px" type="primary" plain icon="el-icon-plus" @click="addTabbarAdItem">增加广告</el-button>
                <div v-for="(adItem, adIndex) in tabbarAdv.adv" :key="adIndex" style="padding-left: 128px">
                    <el-select style="width: 400px; padding-top: 20px" v-model="tabbarAdv.adv[adIndex]" filterable placeholder="广告名称（单选）">
                        <el-option
                                v-for="item in tabbarAdList"
                                :key="item.Id"
                                :label="item.Name"
                                :value="item.Id">
                        </el-option>
                    </el-select>
                    <el-button style="margin-left: 50px" type="danger" icon="el-icon-delete" circle @click="deleteTabbarAdItem(adIndex)"></el-button>
                    <el-button style="margin-left: 20px" type="danger" icon="el-icon-arrow-up" circle @click="upTabbarAdItem(adIndex)"></el-button>
                    <el-button style="margin-left: 20px" type="danger" icon="el-icon-arrow-down" circle @click="downTabbarAdItem(adIndex)"></el-button>
                </div>
                <span style="color: red;padding-top: 10px">注：请确保底部菜单的性别筛选相同个数达到2个以上</span>
            </div>
        </div>

        <el-button style="margin-top: 50px;width: 100px" @click="add" type="danger">保存</el-button>
        <el-button style="margin-left:50px;width: 100px" @click="reset">重置</el-button>
        <el-button style="margin-left:50px;width: 100px" onclick="history.back()">取消</el-button>
    </div>
</template>
<script>
    import AccountApi from '@/api/Account'
    import qs from 'qs'

    export default {
        name: 'addAD',
        mixins: ['mixin'],
        data(){
            return {
                isLoading : false,
                info : null,
                adName : "",
                mark : "",
                Adposition : "",
                options : ['侧边悬浮广告', '底部悬浮广告', '一列两个广告','一列一个广告'],
                deviceSelectType : '',
                deviceIds : '',
                uploadImgPath : [],
                uploadImgRealObject : null,
                wxdownContent : "",  //公众号下方提示语
                wxbottomContent : "",  //底部提示语
                link: "",
                startTime : "",
                endTime : "",
                userList : [],
                isListLoading : false,
                sort : "",
                status : "",
                positionOptions : ['左侧', '右侧'],
                closeOptions : ['不可关闭', '可关闭'],
                numOptions : ['1个', '2个'],
                statusOptions : ['启用', '禁用'],
                adId : "",
                isUploadImg : false,  //是否要上传图片
                SusAdv : [],    //悬浮广告
                ResultAdv : [],  //称重结果
                trendAdv : [],   //体重趋势
                tabbarAdv: null,   // 底部菜单广告

                boradAdList : [],  //侧边广告列表
                bottomAdList : [],  //底部广告列表
                twoRowAdList : [],   //一行2个广告列表
                oneRowAdList : [], //一行1个广告列表
                tabbarAdList: [], // 底部菜单广告
                TYPE_RESULT : 1,   //体重结果类型
                TYPE_TREND : 2,    //体重区域类型
            }
        },
        components :{
        },
        computed : {


        },

        mounted() {
            this.adId = this.$route.query.id
            console.log(this.adId)
            if (this.adId) {
                this.getAdInfo()
            } else {
                this.isUploadImg = true
            }
            this.getAdListWithType(1)
            this.getAdListWithType(2)
            this.getAdListWithType(3)
            this.getAdListWithType(4)
            this.getAdListWithType(5)
        },
        methods: {
            //数组移动位置  index是当前元素下标，tindex是拖动到的位置下标。
            changePosition(arr,index,tindex){
                //如果当前元素在拖动目标位置的下方，先将当前元素从数组拿出，数组长度-1，我们直接给数组拖动目标位置的地方新增一个和当前元素值一样的元素，
                //我们再把数组之前的那个拖动的元素删除掉，所以要len+1
                if(index>tindex){
                    arr.splice(tindex,0,arr[index]);
                    arr.splice(index+1,1)
                }
                else{
                    //如果当前元素在拖动目标位置的上方，先将当前元素从数组拿出，数组长度-1，我们直接给数组拖动目标位置+1的地方新增一个和当前元素值一样的元素，
                    //这时，数组len不变，我们再把数组之前的那个拖动的元素删除掉，下标还是index
                    arr.splice(tindex+1,0,arr[index]);
                    arr.splice(index,1)
                }
            },

            //排列个数变化的时候   type : 1(体重结果)  2（体重区域）
            numChange(index, type) {
                console.log(index)
                if (type == this.TYPE_TREND) {
                    var hasAd = false
                    for (var i = 0; i < this.trendAdv[index].adv.length; i++) {
                        if (this.trendAdv[index].adv[i].length > 0) {
                            hasAd = true
                            break
                        }
                    }
                    if (hasAd) {
                        this.trendAdv[index].type = this.trendAdv[index].type == 5 ? 6 : 5
                    }
                } else {
                    var hasAd = false
                    for (var i = 0; i < this.ResultAdv[index].adv.length; i++) {
                        if (this.ResultAdv[index].adv[i].length > 0) {
                            hasAd = true
                            break
                        }
                    }
                    if (hasAd) {
                        this.ResultAdv[index].type = this.ResultAdv[index].type == 5 ? 6 : 5
                    }
                }


            },
            //添加列表广告
            addListAd() {
                if (this.oneRowAdList.length <= 0 && this.twoRowAdList.length <= 0) {
                    this.$notify({
                        title: "警告",
                        message: "无启用的列表类型的广告，请先增加广告",
                        type: "fail",
                        duration: 2000
                    });
                    return
                }
                var adItem = {
                    type : 5,    //1 左侧边 2，右侧边 3底部 4，轮播广告 5一行一个列表 6 一行两个列表
                    off : 0,
                    name : "",
                    adv : [''],
                    label : '列表广告',

                }
                this.trendAdv.push(adItem)
            },

            //体重趋势广告块 上移
            upTrendAd(index, type) {
                if (type == this.TYPE_RESULT) {
                    if (index == 0) {
                        //
                        return
                    }
                    this.changePosition(this.ResultAdv, index, index - 1)
                } else {
                    if (index == 0) {
                        //要移动到体重结果区域去
                        this.ResultAdv.push(this.trendAdv.splice(index, 1)[0])
                    } else {
                        this.changePosition(this.trendAdv, index, index - 1)
                    }
                }


            },
            //体重趋势广告块 下移
            downTrendAd(index, type) {
                if (type == this.TYPE_RESULT) {
                    if (index == this.ResultAdv.length - 1) {
                        this.trendAdv.unshift(this.ResultAdv.splice(index, 1)[0])
                    } else {
                        this.changePosition(this.ResultAdv, index, index + 1)
                    }
                } else {
                    if (index >= this.trendAdv.length) {
                        return
                    }
                    this.changePosition(this.trendAdv, index, index + 1)
                }


            },
            //体重趋势单个广告下移
            downTrendAdItem(index, adItemIndex, type) {
                if (type == this.TYPE_TREND) {
                    if (adItemIndex >= this.trendAdv[index].adv.length) {
                        return
                    }
                    this.changePosition(this.trendAdv[index].adv, adItemIndex, adItemIndex + 1)
                } else {
                    if (adItemIndex >= this.ResultAdv[index].adv.length) {
                        return
                    }
                    this.changePosition(this.ResultAdv[index].adv, adItemIndex, adItemIndex + 1)
                }
                console.log("upTrendAdItem", index, adItemIndex)

            },
            //体重趋势单个广告上移
            upTrendAdItem(index, adItemIndex, type) {
                console.log("upTrendAdItem", index, adItemIndex)
                if (adItemIndex == 0) {
                    return
                }
                if (type == this.TYPE_TREND) {
                    this.changePosition(this.trendAdv[index].adv, adItemIndex, adItemIndex - 1)
                } else {
                    this.changePosition(this.ResultAdv[index].adv, adItemIndex, adItemIndex - 1)
                }

            },
            //删除体重趋势广告中广告ID
            deleteTrendAdItem(index, adItemIndex, type) {
                // if (this.trendAdv[index].adv.length <= 1) {
                //     this.$notify({
                //         title: "警告",
                //         message: "至少要有一个广告",
                //         type: "fail",
                //         duration: 2000
                //     });
                //     return
                // }
                if (type == this.TYPE_TREND) {
                    this.trendAdv[index].adv.splice(adItemIndex, 1)
                } else {
                    this.ResultAdv[index].adv.splice(adItemIndex, 1)
                }

            },
            //删除体重趋势广告块
            deleteTrendAd(index, type) {
                if (type == this.TYPE_TREND) {
                    this.trendAdv.splice(index, 1)
                } else {
                    this.ResultAdv.splice(index, 1)
                }

            },
            addCircleAdItem(index, type) {
                console.log("addCircleAdItem", index)
                if (type == this.TYPE_TREND) {
                    this.trendAdv[index].adv.push("")
                } else {
                    this.ResultAdv[index].adv.push("")
                }

            },
            //添加轮播广告
            addCircleAd() {
                if (this.oneRowAdList.length <= 0) {
                    this.$notify({
                        title: "警告",
                        message: "无启用的一行1一个类型的广告，请先增加广告",
                        type: "fail",
                        duration: 2000
                    });
                    return
                }
                var adItem = {
                    type : 4,
                    off : 0,
                    name : "",
                    adv : [''],
                    label : '轮播广告',

                }
                this.trendAdv.push(adItem)
            },
            //删掉底部悬浮广告
            deleteBottomAd(index) {
                this.SusAdv.splice(index, 1)
            },
            //添加底部悬浮广告
            addBottomAd() {
                if (this.bottomAdList.length <= 0) {
                    this.$notify({
                        title: "警告",
                        message: "无启用的底部悬浮广告，请先增加广告",
                        type: "fail",
                        duration: 2000
                    });
                    return
                }
                var hasBottomAdv = false
                for (var i = 0; i < this.SusAdv.length; i++) {
                    if (this.SusAdv[i].type == 3) {
                        hasBottomAdv = true
                        break
                    }
                }
                if (hasBottomAdv) {
                    this.$notify({
                        title: "警告",
                        message: "只能添加一个底部悬浮广告",
                        type: "fail",
                        duration: 2000
                    });
                    return
                }
                var adItem = {
                    type : 3,
                    off : 0,
                    name : "",
                    adv : [''],
                    label : '底部悬浮广告'

                }
                this.SusAdv.push(adItem)

            },
            //删除侧边广告
            deleteBorderAd(index) {
                this.SusAdv.splice(index, 1)
            },
            //左侧和右侧的选择修改时调用
            boradAdvChange(item, index) {
                console.log(index)
                for (var i = 0; i < this.SusAdv.length; i++) {
                    if (i != index && this.SusAdv[i].type != 3) {
                        this.SusAdv[i].type = (item.type == 1 ? 2 : 1)
                    }
                }
            },
            //添加侧边广告
            addBoradAd() {
                if (this.boradAdList.length <= 0) {
                    this.$notify({
                        title: "警告",
                        message: "无启用的侧边广告，请先增加广告",
                        type: "fail",
                        duration: 2000
                    });
                    return
                }
                var hasLeft = false
                var hasRight = false
                for (var i = 0; i < this.SusAdv.length; i++) {
                    var item = this.SusAdv[i]
                    if (item.type == 1) {
                        hasLeft = true
                    } else if (item.type == 2) {
                        hasRight = true
                    }
                }
                if (hasLeft && hasRight) {
                    this.$notify({
                        title: "警告",
                        message: "不能添加三个侧边广告",
                        type: "fail",
                        duration: 2000
                    });
                    return
                }

                var adItem = {
                    type : hasLeft ? 2 : 1,
                    off : 0,
                    name : "",
                    adv : [''],
                    label : '侧边悬浮广告',

                }
                this.SusAdv.push(adItem)
            },

            addTabbarAdItem() {
                if (this.tabbarAdv.adv.length >= 5) {
                    this.$notify({
                        title: '警告',
                        message: '最多五个广告',
                        type: 'fail',
                        duration: 2000
                    })
                    return
                }
                this.tabbarAdv.adv.push('')
            },
            // 添加底部菜单广告
            addTabbarAd() {
                if (this.tabbarAdv) {
                    this.$notify({
                        title: '警告',
                        message: '只能添加一个底部菜单广告',
                        type: 'fail',
                        duration: 2000
                    })
                    return
                }
                if (this.tabbarAdList.length === 0) {
                    this.$notify({
                        title: '警告',
                        message: '无启用的底部菜单类型的广告，请先增加广告',
                        type: 'fail',
                        duration: 2000
                    })
                    return
                }
                var adItem = {
                    type: 7,
                    off: 0,
                    name: 1, // 当前菜单
                    adv: ['', ''],
                    label: '底部菜单广告'
                }
                this.tabbarAdv = adItem
            },
            deleteTabbarAdv() {
                this.tabbarAdv = null
            },
            downTabbarAdItem(adItemIndex) {
                if (adItemIndex >= this.tabbarAdv.adv.length) {
                    return
                }
                this.changePosition(this.tabbarAdv.adv, adItemIndex, adItemIndex + 1)
            },
            upTabbarAdItem(adItemIndex) {
                if (adItemIndex === 0) {
                    return
                }
                this.changePosition(this.tabbarAdv.adv, adItemIndex, adItemIndex - 1)
            },
            deleteTabbarAdItem(adItemIndex) {
                if (this.tabbarAdv.adv.length <= 2) {
                    this.$notify({
                        title: '警告',
                        message: '至少要有两个广告',
                        type: 'fail',
                        duration: 2000
                    })
                    return
                }
                this.tabbarAdv.adv.splice(adItemIndex, 1)
                if (this.tabbarAdv.name > this.tabbarAdv.adv.length) {
                    this.tabbarAdv.name = this.tabbarAdv.adv.length
                }
            },

            handleRemove(file, fileList) {
                console.log(file, fileList);
                this.isUploadImg = true
            },
            handlePreview(file) {
                console.log(file);
            },
            getAdInfo() {
                if (this.isLoading) {
                    return
                }
                this.isLoading = true
                AccountApi.getAdConfigInfo({Id : this.adId}).then(({data}) => {
                    this.isLoading = false
                    if (data.Status == 200) {
                        this.info = data.Result
                        this.adName = this.info.Name;
                        this.mark = this.info.Description
                        this.deviceIds = this.info.ScaleIds
                        this.wxdownContent = this.info.WeChatInfo
                        this.wxbottomContent = this.info.BottomInfo
                        this.sort = this.info.Sort
                        this.status = parseInt(this.info.Status)
                        this.uploadImgPath = [{name : '', url : this.info.WeChatBg}]
                        this.isUploadImg = false
                        this.SusAdv = JSON.parse(this.info.AdvInfo.SusAdv)
                        this.ResultAdv = JSON.parse(this.info.AdvInfo.ResultAdv)
                        this.trendAdv = JSON.parse(this.info.AdvInfo.TrendAdv).filter(item => item.type !== 7)
                        this.tabbarAdv = JSON.parse(this.info.AdvInfo.TrendAdv).find(item => item.type === 7) || null

                        if (this.deviceIds.length > 0) {
                            this.deviceSelectType = '2'
                        } else {
                            this.deviceSelectType = '1'
                        }
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

            getAdListWithType(type) {
                var params = {
                    type : type,
                }
                AccountApi.getAdListWithType(params).then(({data}) => {
                    if (data.Status == 200) {
                        switch (type) {
                            case 1:
                                this.boradAdList = data.Result.List
                                break
                            case 2:
                                this.bottomAdList = data.Result.List
                                break
                            case 3:
                                this.twoRowAdList = data.Result.List
                                break
                            case 4:
                                this.oneRowAdList = data.Result.List
                                break
                            case 5:
                                this.tabbarAdList = data.Result.List
                        }
                    }
                })
            },
            statusChange() {

            },
            adUserChange() {
                console.log(this.adUser)
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
                this.mark = ""
                this.status = ""
                this.deviceSelectType = "1"
                this.deviceIds = ""
                this.isUploadImg = true
                this.uploadImgRealObject = null
                this.wxdownContent = ""
                this.wxbottomContent = ""
                this.SusAdv = []
                this.ResultAdv = []
                this.trendAdv = []
                this.tabbarAdv = null
            },
            levelChange() {

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

                if (this.mark.length <= 0) {
                    this.$notify({
                        title: "警告",
                        message: "配置用途说明不能为空",
                        type: "fail",
                        duration: 2000
                    });
                    return
                }
                if (this.sort.length <= 0) {
                    this.$notify({
                        title: "警告",
                        message: "排序不能为空",
                        type: "fail",
                        duration: 2000
                    });
                    return
                }
                if (this.deviceSelectType == 2 && this.deviceIds.length <= 0) {
                    this.$notify({
                        title: "警告",
                        message: "指定设备ID不能为空",
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

                if (this.wxdownContent.length <= 0) {
                    this.$notify({
                        title: "警告",
                        message: "公众号下方提示语不能为空",
                        type: "fail",
                        duration: 2000
                    });
                    return
                }
                if (this.wxbottomContent.length <= 0) {
                    this.$notify({
                        title: "警告",
                        message: "底部提示语不能为空",
                        type: "fail",
                        duration: 2000
                    });
                    return
                }
                var self = this
                var advNotEmpty = true
                if (this.SusAdv.length > 0) {
                    this.SusAdv.forEach(function (item) {
                        item.adv.forEach(function (advItem) {
                            if (advItem.length <= 0) {
                                advNotEmpty = false
                                self.$notify({
                                    title: "警告",
                                    message: "广告名称不能为空",
                                    type: "fail",
                                    duration: 2000
                                });
                                return
                            }
                        })
                    })
                }
                if (!advNotEmpty) {
                    return
                }

                if (this.ResultAdv.length > 0) {
                    this.ResultAdv.forEach(function (item) {
                        item.adv.forEach(function (advItem) {
                            if (advItem.length <= 0) {
                                advNotEmpty = false
                                self.$notify({
                                    title: "警告",
                                    message: "广告名称不能为空",
                                    type: "fail",
                                    duration: 2000
                                });
                                return
                            }
                        })
                    })
                }
                if (!advNotEmpty) {
                    return
                }
                if (this.trendAdv.length > 0) {
                    this.trendAdv.forEach(function (item) {
                        item.adv.forEach(function (advItem) {
                            if (advItem.length <= 0) {
                                advNotEmpty = false
                                self.$notify({
                                    title: "警告",
                                    message: "广告名称不能为空",
                                    type: "fail",
                                    duration: 2000
                                });
                                return
                            }
                        })
                    })
                }
                if (!advNotEmpty) {
                    return
                }

                if (this.tabbarAdv) {
                    this.tabbarAdv.adv.forEach(advItem => {
                        if (!advItem) {
                            advNotEmpty = false
                            self.$notify({
                                title: '警告',
                                message: '广告名称不能为空',
                                type: 'fail',
                                duration: 2000
                            })
                        }
                    })
                }
                if (!advNotEmpty) {
                    return
                }


                if (this.isLoading) {
                    return
                }
                this.isLoading = true
                if (this.isUploadImg) {
                    this.uploadImg()
                } else {
                    this.uploadInfo(this.info.WeChatBg)
                }

            },

            //添加或者修改广告
            uploadInfo(imgUrl) {
                // console.log(this.SusAdv)
                // console.log(JSON.stringify(this.SusAdv))
                // console.log(this.ResultAdv)
                // console.log(JSON.stringify(this.ResultAdv))
                // console.log(this.trendAdv)
                // console.log(JSON.stringify(this.trendAdv))
                var params = {
                    Id : this.adId,
                    Name : this.adName,
                    Description : this.mark,
                    ScaleIds : this.deviceSelectType == 1 ? '' : this.deviceIds,
                    WeChatBg : imgUrl,
                    WeChatInfo : this.wxdownContent,
                    BottomInfo : this.wxbottomContent,
                    Sort : this.sort,
                    Status : this.status,
                    SusAdv : JSON.stringify(this.SusAdv),
                    ResultAdv : JSON.stringify(this.ResultAdv),
                    TrendAdv : JSON.stringify(this.trendAdv.concat(this.tabbarAdv ? this.tabbarAdv : [])),
                }

                AccountApi.addAdConfig(params).then(({data}) => {
                    this.isLoading = false
                    if (data.Status == 200) {
                        this.$notify({
                            title: "提示",
                            message: this.adId ? '修改成功' : '添加成功',
                            type: "success",
                            duration: 2000
                        });
                        const route = this.$route
                        this.$router.push({ path: '/h5ConfigList' }, () => {
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
                        this.uploadInfo(data.Result.url)
                    } else {
                        this.isLoading = false
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
