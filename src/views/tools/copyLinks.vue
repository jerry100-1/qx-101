<template>
  <div class="main">
      <div class="item" style="align-items: baseline">
          <div class="icon">
              <div>添加图片</div>

          </div>
          <!--<div v-for="(item, index) in imgs">-->
              <el-upload style="padding-top: 20px"
                         class="upload-demo"
                         action="https://jsonplaceholder.typicode.com/posts/"
                         :on-preview="handlePreview"
                         :on-remove="handleRemove"
                         :on-change="handleImg"
                         :file-list="uploadImgPath"
                         list-type="picture"
                         :auto-upload="false"
                         multiple
                         ref="img"
              >
                  <el-button size="small" type="primary">点击上传</el-button>
                  <div slot="tip" class="el-upload__tip">图片要求：仅限jpg,jpeg,png格式，最小尺寸{{width}}px*{{height}}px，大小100KB以内</div>
              </el-upload>
          <!--</div>-->
      </div>
      <el-button type="primary" @click="startUploadImg(0)">生成</el-button>


      <div>{{createContent}}</div>
      <div class="item" style="align-items: baseline">
          <div class="icon">
              <div>添加cookie</div>

          </div>
          <el-input v-model="cookie" placeholder="请输入cookie"></el-input>
      </div>
      <div class="item" style="align-items: baseline">
          <div class="icon">
              <div>输入小说ID</div>

          </div>
          <el-input v-model="storyId" placeholder="请输入小说ID"></el-input>
      </div>
      <div class="item" style="align-items: baseline">
          <div class="icon">
              <div>请输入章节Num</div>

          </div>
          <el-input v-model="chapterNum" placeholder="请输入章节Num"></el-input>
      </div>

      <div class="item" style="align-items: baseline">
          <div class="icon">
              <div>请输入宽度</div>

          </div>
          <el-input v-model="targetWidth" placeholder="请输入章节Num"></el-input>
      </div>

      <div style="padding-top: 30px;padding-bottom: 30px"></div>
      <!--<el-input-->
              <!--type="textarea"-->
              <!--placeholder="请输入多个链接，每个链接以半角;分割"-->
              <!--v-model="inputContent">-->
      <!--</el-input>-->
      <el-button style="margin-top: 20px" type="primary" @click="createUrlHtmml">获取html</el-button>

      <div>{{createUrlContent}}</div>


      <div class="item" style="align-items: baseline" v-loading="isLoading">
          <div class="icon">
              <div>输入文章链接</div>

          </div>
          <el-input v-model="url" placeholder="请输入文章链接"></el-input>
      </div>
      <el-button style="margin-top: 20px" type="primary" @click="createStoryUrlHtmml">获取html</el-button>
      <el-button style="margin-top: 20px" type="primary" v-clipboard:success="copyStoryHtml" v-clipboard:copy="storyUrlContent" >拷贝HTML</el-button>
      <div>{{storyUrlContent}}</div>
  </div>
</template>

<script>
import VueSticky from 'vue-sticky'
import { deepClone } from '@/utils'
import AccountApi from '@/api/Account'

export default {
  name: 'copyLinks',
  directives: {
    sticky: VueSticky
  },
  data () {
    return {
        imgs : [],
        uploadImgPath : [],
        // uploadImgObject : [],
        createContent : '',
        inputContent : '',
        inputContents : '',

        cookie: '',
        storyId : '',
        chapterNum : '',
        createUrlContent : '',
        targetWidth : 320,
        url : '',
        storyUrlContent : '',
        isLoading : false,

  }
  },
  computed: {
    tableMaxHeight () {
      return Math.max(this.$store.getters.containerHeight - this.othersHeight, 300)
    }
  },
  created () {
        this.cookie = localStorage.getItem('toolsCookie')
  },
  mounted () {
  },
  updated () {
    this.$nextTick(() => {
      const queryContent = this.$refs.queryContent
      const queryContentHeight = queryContent ? Math.round(queryContent.clientHeight) : 0
      this.othersHeight = queryContentHeight + 41 + 64 + 72
    })
  },
  methods: {
      handleRemove(file, fileList) {
          console.log(file, fileList);
      },
      handlePreview(file) {
          console.log(file);
      },
      handleImg(file, fileList) {
          console.log("handleImg", file, fileList, this.$refs.img)
          this.uploadImgPath = fileList
          // if (fileList.length > 0) {
          //     this.uploadImgObject = file.raw
          // } else {
          //     this.uploadImgRealObject = null
          // }
      },
      copyStoryHtml() {
          this.$message({
              type: 'success',
              message: '复制成功!'
          });
      },
      startUploadImg(index = 0) {
          if (index >= this.uploadImgPath.length) {
              console.log("video update1", this.uploadImgPath)
              //已经全部上传完了
              this.createHtml()
              return
          }
          var formData = new FormData();
          console.log("video update1", this.uploadImgPath, index)
          //上传视频
          console.log("video update", this.uploadImgPath[index])
          formData.append("pic", this.uploadImgPath[index].raw);
          // formData.append("pic", this.uploadVideoRealObject);
          AccountApi.uploadImage(formData).then(({data}) => {
              console.log(data)
              if (data.Status == 200) {
                  this.uploadImgPath[index].romateUrl = data.Result.url
                  this.startUploadImg(index + 1)
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
      createUrlHtmml() {
          this.createUrlContent = '';
          this.getImgUrls() ;
          //  this.inputContents = this.inputContent.split(";");
          // this.createOneHtmml(0)
      },
      createStoryUrlHtmml() {
          this.storyUrlContent = '';
          this.getImgStoryUrl();
      },
      getImgStoryUrl() {
          if (this.isLoading) {
              return;
          }
          this.isLoading = true;
          var params = {
              url : this.url
          }

          AccountApi.getStoryImgsUrlTools(params).then(data => {
              this.isLoading = false;
              if (data.data.Status == 200) {
                  this.inputContents = data.data.Result;
                  this.createStoryOneHtmml(0)
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

      async createStoryOneHtmml(index) {
          console.log(index)
          if (index >= this.inputContents.length) {
              return
          }
          console.log(index, this.inputContents)
          let remoteUrl = this.inputContents[index];
          let localContent = "<section style=\"max-width: 100%;width: {width}px;height: {height}px;background: url(&quot;{replaceImgUrl}&quot;) center center no-repeat;background-size: 320px auto;margin: 0 auto;box-sizing: border-box !important;word-wrap: break-word !important;\"></section>";
          var content = "";
          content = localContent.replace("{replaceImgUrl}", remoteUrl)
          //
          // let remoteUrl = this.inputContents[index];
          // let img = new Image();
          // console.log(index)
          // img.onload = ()=> {
          //     console.log(index, img.height, img.width)
          //     var content1 = localContent.replace("{replaceImgUrl}", remoteUrl)
          //     var height = "" + img.height;
          //     content += content1.replace("{height}", height)
          //     console.log(content)
          //     if (index == (this.inputContents.length - 1)) {
          //         console.log(content)
          //         this.createUrlContent = content;
          //     }
          //     this.createOneHtmml(index + 1)
          // }
          // img.src = remoteUrl;
          const data = await this.updateKinds(index, remoteUrl)
          console.log(index, data)
          var targetHeight = data.height * this.targetWidth / data.width;
          var content1 = content.replace("{width}", this.targetWidth);
          this.storyUrlContent += content1.replace("{height}", targetHeight);
          this.createStoryOneHtmml(index + 1)
      },

      getImgUrls() {
          localStorage.setItem('toolsCookie', this.cookie);
          var params = {
              cok : this.cookie,
              id : this.storyId,
              num : this.chapterNum,
          }
          AccountApi.getImgsUrlTools(params).then(({data})=> {
                if (data.Status == 200) {
                    this.inputContents = data.Result.array;
                    this.createOneHtmml(0)
                } else {
                    this.$message({
                        showClose: true,
                        message: data.Result.ErrorMsg,
                        type: 'success'
                    });
                }
          })
      },

      async createOneHtmml(index) {
          console.log(index)
          if (index >= this.inputContents.length) {
              return
          }
          console.log(index, this.inputContents)
          let remoteUrl = this.inputContents[index];
          let localContent = "<section style=\"max-width: 100%;width: {width}px;height: {height}px;background: url(&quot;{replaceImgUrl}&quot;) center center no-repeat;background-size: 320px auto;margin: 0 auto;box-sizing: border-box !important;word-wrap: break-word !important;\"></section>";
          var content = "";
          content = localContent.replace("{replaceImgUrl}", remoteUrl)
          //
          // let remoteUrl = this.inputContents[index];
          // let img = new Image();
          // console.log(index)
          // img.onload = ()=> {
          //     console.log(index, img.height, img.width)
          //     var content1 = localContent.replace("{replaceImgUrl}", remoteUrl)
          //     var height = "" + img.height;
          //     content += content1.replace("{height}", height)
          //     console.log(content)
          //     if (index == (this.inputContents.length - 1)) {
          //         console.log(content)
          //         this.createUrlContent = content;
          //     }
          //     this.createOneHtmml(index + 1)
          // }
          // img.src = remoteUrl;
          const data = await this.updateKinds(index, remoteUrl)
          console.log(index, data)
          var targetHeight = data.height * this.targetWidth / data.width;
          var content1 = content.replace("{width}", this.targetWidth);
          this.createUrlContent += content1.replace("{height}", targetHeight);
          this.createOneHtmml(index + 1)
      },



      updateKinds (index, imgurl) {
          return new Promise(function (resolve, reject) {
              console.log(index, imgurl)
              let img = new Image();
              img.onload = ()=> {
                  console.log(index, img.height, img.width)
                  // var content1 = this.localContent.replace("{replaceImgUrl}", imgurl)
                  // var height = "" + img.height;
                  // this.createUrlContent += content1.replace("{height}", height)
                  // console.log(this.createUrlContent)
                  // if (index == (this.inputContents.length - 1)) {
                  //     console.log(content)
                  //     this.createUrlContent = content;
                  // }
                  // this.createOneHtmml(index + 1)
                  var data = {
                      height : img.height,
                      width : img.width,
                  }
                  resolve(data)
              }
              img.src = imgurl;

          })
      },
      createHtml() {
          let localContent = "<section style=\"max-width: 100%;width: 542.984px;height: 596.5px;background: url(&quot;{replaceImgUrl}&quot;) center center / contain no-repeat;box-sizing: border-box !important;word-wrap: break-word !important;\"></section>";
          var content = "";
          for(var i = 0; i < this.uploadImgPath.length; i++) {
              let remoteUrl = this.uploadImgPath[i].romateUrl
              content += localContent.replace("{replaceImgUrl}", remoteUrl)
          }

          console.log(content)
          this.createContent = content;
      }

  }
}
</script>

<style lang="less" scoped>
.main {
  display: table;
  table-layout: fixed;
  min-width: 1300px;
  width: 100%;
  height: 100%;
  background-color: #ffffff;
    padding-left: 50px;
    .item {
        display: flex;
        flex-direction: row;
        align-items: center;
        padding-top: 30px;

        .icon {
            flex-shrink: 0;
            padding-right: 22px;
            display: flex;
            flex-direction: column;
        }
    }
}
</style>
