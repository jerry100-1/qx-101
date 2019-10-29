<template>
  <div class="main">
      <div class="item">
          <el-input style="width: 200px; margin-right: 20px" v-model="input" placeholder="请输入导粉广告ID"></el-input>
          <el-button type="danger" @click="clear">清除每日限制操作</el-button>
      </div>
  </div>
</template>

<script>
import VueSticky from 'vue-sticky'
import { deepClone } from '@/utils'
import * as AdApi from '@/api/ad'

export default {
  name: 'copyLinks',
  directives: {
    sticky: VueSticky
  },
  data () {
    return {
        input : '',

  }
  },

  created () {
  },
  mounted () {
  },

  methods: {

        clear() {
            if (this.input.length <= 0) {
                this.$message({
                    showClose: true,
                    message: '请输入导粉广告ID',
                    type: 'info'
                });
                return
            }
            this.$confirm('此操作将清掉每日导粉的日期，导粉将会继续，请慎重, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.clearApi()
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });

        },
      clearApi() {
            console.log("clearApi")
          AdApi.updateDayFollowTimeById({id : this.input}).then(data => {
              if (data.data.Status == 200) {
                  this.$message({
                      type: 'success',
                      message: '操作成功'
                  });
              } else {
                  this.$message({
                      type: 'success',
                      message: data.data.Result.ErrorMsg
                  });
              }
          })
      },
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
