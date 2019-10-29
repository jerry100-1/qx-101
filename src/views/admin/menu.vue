<template>
  <b-container fluid>
    <b-row>
      <h4>新增菜单</h4>
      <b-table bordered responsive class="text-nowrap" :fields="fields1" :items="items1">
        <template slot="name" slot-scope="row">
          <b-input v-model="row.item.name" type="text" class="input-add-menu form-control-sm" placeholder="菜单名称"/>
        </template>
        <template slot="key" slot-scope="row">
          <b-input v-model="row.item.key" type="text" class="input-add-menu form-control-sm" placeholder="菜单KEY"/>
        </template>
        <template slot="url" slot-scope="row">
          <b-input v-model="row.item.url" type="text" class="input-add-menu form-control-sm" placeholder="URL"/>
        </template>
        <template slot="pos" slot-scope="row">
          <b-input v-model="row.item.pos" type="text" class="input-add-menu form-control-sm" placeholder="菜单名称"/>
        </template>
        <template slot="order" slot-scope="row">
          <b-input v-model="row.item.order" type="text" class="input-add-menu form-control-sm" placeholder="排序"/>
        </template>
        <template slot="action" slot-scope="row">
          <b-button variant="primary" class="btn-sm">保存</b-button>
        </template>
      </b-table>
      <h4>菜单列表</h4>
      <b-table bordered responsive class="text-nowrap" :fields="fields2" :items="items2" :filter="menuTableFilter">
        <template slot="expand" slot-scope="row">
          <b-button v-if="row.item.level === 1" @click="toggleExpand(row.item.id)" variant="info" class="btn-sm text-center btn-expand">{{expandMenu.includes(row.item.id) ? '-' : '+'}}</b-button>
        </template>
        <template slot="name" slot-scope="row">
          <div class="d-flex align-items-center">
            <span v-if="row.item.level === 2" class="ml-2 mr-1">|--</span>
            <span v-if="row.item.level === 3" class="ml-4 mr-1">|--</span>
            <b-input v-model="row.item.name" type="text" class="flex-grow input-add-menu form-control-sm" placeholder="菜单名称"/>
          </div>
        </template>
        <template slot="key" slot-scope="row">
          <b-input v-model="row.item.key" type="text" class="input-add-menu form-control-sm" placeholder="菜单KEY"/>
        </template>
        <template slot="url" slot-scope="row">
          <b-input v-model="row.item.url" type="text" class="input-add-menu form-control-sm" placeholder="URL"/>
        </template>
        <template slot="pos" slot-scope="row">
          <b-input v-model="row.item.pos" type="text" class="input-add-menu form-control-sm" placeholder="菜单名称"/>
        </template>
        <template slot="order" slot-scope="row">
          <b-input v-model="row.item.order" type="text" class="input-add-menu form-control-sm" placeholder="排序"/>
        </template>
        <template slot="action" slot-scope="row">
          <b-button-group>
            <b-button class="btn btn-outline-secondary btn-sm">保存</b-button>
            <b-button variant="danger" class="btn-sm">删除</b-button>
          </b-button-group>
        </template>
      </b-table>
    </b-row>
  </b-container>
</template>

<script>
export default {
  name: 'menu',
  data () {
    return {
      fields1: [
        { key: 'name', label: '名称' },
        { key: 'key', label: 'KEY' },
        { key: 'url', label: 'URL' },
        { key: 'pos', label: '菜单位置' },
        { key: 'order', label: '排序' },
        { key: 'action', label: '操作' }
      ],
      items1: [
        { name: null, key: null, url: null, pos: null, order: null }
      ],
      fields2: [
        { key: 'expand', label: '' },
        { key: 'name', label: '名称' },
        { key: 'key', label: 'KEY' },
        { key: 'url', label: 'URL' },
        { key: 'pos', label: '菜单位置' },
        { key: 'order', label: '排序' },
        { key: 'action', label: '操作' }
      ],
      items2: [
        { id: 1, pid: 0, topid: 0, level: 1, name: '首页', key: null, url: null, pos: null, order: null },
        { id: 11, pid: 1, topid: 1, level: 2, name: '基本信息', key: null, url: null, pos: null, order: null },
        { id: 111, pid: 11, topid: 1, level: 3, name: '欢迎首页', key: null, url: null, pos: null, order: null },
        { id: 2, pid: 0, topid: 0, level: 1, name: '数据统计', key: null, url: null, pos: null, order: null },
        { id: 22, pid: 2, topid: 2, level: 2, name: '概况', key: null, url: null, pos: null, order: null },
      ],
      expandMenu: []
    }
  },
  methods: {
    // 表格过滤，不显示未展开的二级以上菜单
    menuTableFilter (item) {
      console.log(item)
      if (item.level > 1 && !this.expandMenu.includes(item.topid)) {
        return false
      }
      return true
    },
    // 切换展开指定一级菜单的二级以上菜单
    toggleExpand (id) {
      const index = this.expandMenu.indexOf(id)
      if (index > -1) {
        this.expandMenu.splice(index, 1)
      } else {
        this.expandMenu.push(id)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.input-add-menu {
  min-width: 150px;
}
.btn-expand {
  width: 28px;
}
</style>
