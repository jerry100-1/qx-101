<template>
  <div class="main">
      <div ref="queryContent" v-sticky="{zIndex: 2001, stickyTop: 0, disabled: false}">
        <div class="header-wrapper">
          <el-form :disabled="isListLoading" :model="queryForm" ref="queryForm" :inline="true" label-width="0" :show-message="false">
            <div class="d-flex justify-content-between">
              <div class="filter-wrapper mr-2">
                <div class="filter-container">
                  <div class="filter-item">
                    <label>状态：</label>
                    <el-form-item prop="status" class="inline-form-item">
                      <el-select v-model="queryForm.status" class="filter-input">
                        <el-option label="全部" :value="null"></el-option>
                        <el-option
                          v-for="item in statusOptions"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </div>
                </div>
              </div>
              <div class="tools flex-shrink-0">
                <div class="filter-item">
                  <el-button :loading="isListLoading" @click="fetchData" type="primary" class="query-button" icon="el-icon-search">查询</el-button>
                  <el-button :disabled="isListLoading" @click="resetQueryForm" class="query-button">重置</el-button>
                </div>
              </div>
            </div>
          </el-form>
        </div>
      </div>
      <div class="content-wrapper">
        <div class="main-content">
          <el-table
            ref="table"
            :data="rawListData"
            v-loading="isListLoading"
            border
            fit
            highlight-current-row
            style="width: 100%;"
            >
            <el-table-column
              prop="id"
              label="测算ID"
              align="center"
              width="50"
            >
            </el-table-column>
            <el-table-column
              prop="body"
              align="center"
              label="测算产品">
            </el-table-column>
            <el-table-column
                prop="name"
                align="center"
                label="测算名称">
            </el-table-column>
            <el-table-column
              prop="description"
              align="center"
              label="简介">
            </el-table-column>
            <el-table-column
              prop="alias"
              align="center"
              label="测算名称-短(用于推荐)">
            </el-table-column>
            <el-table-column
              prop="class"
              label="分类">
            </el-table-column>
            <el-table-column
                prop="IsPayUser"
                align="center"
                label="列表小图"
            >
              <template slot-scope="scope">
                <img :src="scope.row.icon" style="width: 100px; height: 100px"/>
              </template>
            </el-table-column>
            <el-table-column
                prop="CreateTime"
                align="center"
                label="列表大图"
            >
              <template slot-scope="scope">
                <img :src="scope.row.img" style="width: 100px; height: 100px"/>
              </template>
            </el-table-column>
            <el-table-column
                prop="price"
                align="center"
                label="原价(元)">
            </el-table-column>
            <el-table-column
                prop="total_fee"
                align="center"
                label="售价(元)">
            </el-table-column>
            <el-table-column
                prop="real_count"
                align="center"
                label="测算数">
            </el-table-column>
            <el-table-column
                prop="pay_count"
                align="center"
                label="付费测算数">
            </el-table-column>
            <el-table-column
                prop="sort"
                align="center"
                label="优先级">
            </el-table-column>
            <el-table-column
                prop="status"
                align="center"
                label="状态">
              <template slot-scope="scope">
                <el-button type="danger" @click="changeStatus(scope.row)">{{statusMap.get(scope.row.status)}}</el-button>
              </template>
            </el-table-column>
            <el-table-column
                align="center"
                prop="updated_at"
                label="添加时间">
            </el-table-column>
            <el-table-column
                prop="hot"
                align="center"
                label="是否热门">
              <template slot-scope="scope">
                <el-button type="danger" @click="changeHot(scope.row)">{{hotMap.get(scope.row.hot)}}</el-button>
              </template>
            </el-table-column>
            <el-table-column
                prop="hot"
                align="center"
                label="修改">
              <template slot-scope="scope">
                <el-button type="success" @click="change(scope.row)">修改</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div v-show="!isListLoading" class="text-center py-3">
            <el-pagination
              @current-change="handleCurrentChange"
              @size-change="handlePageSizeChange"
              :current-page.sync="tableCurrentPage"
              :page-sizes="tablePageSizeOption"
              :page-size="tablePageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="tableTotalSize"
              background>
            </el-pagination>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
import VueSticky from 'vue-sticky'
import ProductApi from '@/api/productApi'
import swal from 'sweetalert2'
import { deepClone } from '@/utils'
//  产品端商品列表
export default {
  name: 'product-goods-list',
  directives: {
    sticky: VueSticky
  },
  data () {
    const statusOptions = [
      {
        id: 'yes',
        name: '显示'
      }, {
        id: 'no',
        name: '隐藏'
      }
    ]
    const hotOptions = [
      {
        id: '1',
        name: '热门'
      }, {
        id: '0',
        name: '非热门'
      }
    ]
    const mobile = null
    const status = null
    const type = null

    return {
      queryForm: {
        // 公众号名称
        mobile: mobile,
        // 类型
        type: type,
        // 状态
        status: status
      },
      // 状态选项
      statusOptions: statusOptions,
      hotOptions: hotOptions,
      hotMap: new Map(hotOptions.map(item => [item.id, item.name])),
      statusMap: new Map(statusOptions.map(item => [item.id, item.name])),

      // 图表数据加载状态
      isListLoading: false,
      // 保存之前的请求参数
      query: deepClone({ mobile, type, status }),
      // 图表原始数据
      rawListData: [],

      // 表格当前页
      tableCurrentPage: 1,
      // 表格一页条数可选项
      tablePageSizeOption: [10, 20, 30],
      // 表格一页条数
      tablePageSize: 20,
      // 总条数
      tableTotalSize: 0
    }
  },
  filters: {

  },
  computed: {
    cachedViews () {
      return this.$store.state.tagsView.cachedViews
    }
  },
  created () {
    this.fetchData()
  },
  activated () {
    if (this.$route.query.refresh === 1) {
      this.fetchList()
    }
  },
  methods: {
    change (item) {
      this.$router.push('/product-edit-goods?id=' + item.id)
    },
    changeStatus (item) {
      const postData = {
        id: item.id,
        status: item.status === 'yes' ? 'no' : 'yes'
      }
      console.log(postData)
      ProductApi.editProduct(postData).then(({ data }) => {
        if (data.Status === 200) {
          item.status = postData.status
        } else {
          swal({
            text: data.Result.ErrorMsg,
            type: 'error',
            timer: 2000,
            showConfirmButton: false
          })
        }
      })
    },
    changeHot (item) {
      const postData = {
        id: item.id,
        hot: item.hot === '0' ? '1' : '0'
      }
      console.log(postData)
      ProductApi.editProduct(postData).then(({ data }) => {
        if (data.Status === 200) {
          item.hot = postData.hot
        } else {
          swal({
            text: data.Result.ErrorMsg,
            type: 'error',
            timer: 2000,
            showConfirmButton: false
          })
        }
      })
    },
    // 重置查询
    resetQueryForm () {
      // this.$refs.queryForm.resetFields()
      this.queryForm.mobile = null
      this.queryForm.type = null
      this.queryForm.status = null
    },
    fetchData () {
      // 克隆当前查询条件
      console.log(this.queryForm)
      this.query = deepClone(this.queryForm)
      this.tableCurrentPage = 1
      this.tableTotalSize = 0

      this.fetchList()
    },
    fetchList () {
      // 获取图表数据
      this.isListLoading = true
      this.rawListData = []
      const postData = {
        offset: (this.tableCurrentPage - 1) * this.tablePageSize,
        limit: this.tablePageSize,
        status: this.queryForm.status
      }
      ProductApi.getProductList(postData).then(({ data }) => {
        this.isListLoading = false
        if (data.Status !== 200) {
          swal({
            text: data.Result.ErrorMsg,
            type: 'error',
            timer: 2000,
            showConfirmButton: false
          })
          return
        }
        this.rawListData = data.Result.List
        this.tableTotalSize = parseInt(data.Result.Total)
      })
    },
    handleCurrentChange (value) {
      this.fetchList()
    },
    handlePageSizeChange (value) {
      this.tableCurrentPage = 1
      this.tablePageSize = value
      this.fetchList()
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
  background-color: #ececec;
  .filter-item {
    margin-bottom: 15px;
  }
  .filter-container {
    .filter-item {
      display: inline-block;
      white-space: nowrap;
    }
  }
  .filter-input {
    width: 200px;
  }
  .query-button {
    width: 100px;
  }
  .tool-button {
    width: 100px;
  }
  .oper-button {
    width: 80px;
  }
  .header-wrapper {
    padding: 14px 20px 0;
    box-shadow: 0 1px 3px rgba(0,0,0,.1);
    background-color: #fff;
  }
  .content-wrapper {
    padding: 20px;
    .main-content {
      border-top: 1px solid #e1e3e4;
      border-left: 1px solid #e1e3e4;
      border-right: 1px solid #e1e3e4;
      background-color: #fff;
      .button-wrapper {
        padding: 20px 20px;
      }
    }
  }
  .inline-form-item {
    display: inline-block;
    margin: 0;
    vertical-align: middle;
  }
}
.gzh-info-container {
  width: 100%;
  height: 100%;
  padding: 20px 20px;
  background-color: #fff;
  .gzh-info-form {
    width: 800px;
    .gzh-info-group {
      display: table;
      table-layout: fixed;
      width: 100%;
      border-collapse: collapse;
      background: #f9f9f9;
      .gzh-info {
        display: table-row;
        height: 45px;
        .label, .value {
          display: table-cell;
          padding: 10px 20px;
          text-align: left;
          vertical-align: middle;
          border: 1px solid #dcdfe6;
          word-break: break-word;
        }
        .label {
          width: 30%;
        }
        .value {
          width: 70%;
        }
        .form-input {
          width: 300px;
        }
      }
    }
    .buttons {
      margin-top: 20px;
      text-align: center;
      .form-button {
        width: 80px;
      }
    }
  }
}
</style>
