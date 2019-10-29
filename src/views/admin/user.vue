<template>
  <b-container fluid>
    <b-row>
      <div class="table-responsive">
        <table class="table table-bordered table-striped text-nowrap">
          <tbody>
            <tr>
              <td colspan="6">添加管理员</td>
            </tr>
            <tr>
              <td class="align-middle">添加</td>
              <td>

                <b-input-group size="sm" class="flex-nowrap" prepend="账号">
                  <b-form-input v-model="userAccount" class="input-field" type="text"></b-form-input>
                </b-input-group>

                <!-- <div class="input-group">
                  <div class="input-group-addon">账号</div>
                  <input type="text" class="form-control" id="user_account" placeholder="">
                </div> -->
              </td>
              <td>
                <b-input-group size="sm" class="flex-nowrap" prepend="密码">
                  <b-form-input v-model="userPassword" class="input-field" type="text"></b-form-input>
                </b-input-group>
              </td>
              <td>
                <b-input-group size="sm" class="flex-nowrap" prepend="姓名">
                  <b-form-input v-model="trueName" class="input-field" type="text"></b-form-input>
                </b-input-group>
              </td>
              <td>
                <b-input-group size="sm" class="flex-nowrap" prepend="管理组">
                  <b-form-input v-model="authGroup" class="input-field" type="text"></b-form-input>
                </b-input-group>
                <!-- <div class="input-group">
                  <div class="input-group-addon">管理组</div>
                  <select id="auth-group" class="form-control">
                    {$groupselect}
                  </select>
                </div> -->
              </td>
              <td colspan="1">
                <b-button class="btn btn-outline-secondary btn-sm">设为管理员</b-button>
              </td>
            </tr>
            <tr>
              <td colspan="6">修改管理员密码</td>
            </tr>
            <tr>
              <td class="align-middle">修改</td>
              <td>
                <b-input-group size="sm" class="flex-nowrap" prepend="账号">
                  <b-form-input v-model="userSearchKey" class="input-field" type="text"></b-form-input>
                </b-input-group>
              </td>
              <td colspan="4">
                <b-button class="btn btn-outline-secondary btn-sm">搜索</b-button>
              </td>
            </tr>
            <tr>
              <td class="align-middle">搜索结果</td>
              <td>
                <b-input-group size="sm" class="flex-nowrap" prepend="用户ID">
                  <b-form-input v-model="userId" class="input-field" type="text" readonly></b-form-input>
                </b-input-group>
              </td>
              <td>
                <b-input-group size="sm" class="flex-nowrap" prepend="用户名">
                  <b-form-input v-model="userName" class="input-field" type="text" readonly></b-form-input>
                </b-input-group>
              </td>
              <td>
                <b-input-group size="sm" class="flex-nowrap" prepend="密码重置">
                  <b-form-input v-model="password" class="input-field" type="text"></b-form-input>
                </b-input-group>
              </td>
              <td colspan="2">
                <b-button class="btn btn-outline-secondary btn-sm">重置</b-button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <h4>管理员列表</h4>
      <div class="table-responsive">
        <table class="table table-bordered table-striped text-nowrap">
          <tbody>
          <tr>
            <td>用户ID</td>
            <td>管理组</td>
            <td>真实姓名</td>
            <td>操作</td>
          </tr>
          <tr v-for="u in user" :key="u.AdminUserId">
            <td class="col-xs-1">{{u.AdminUserId}}</td>
            <td class="col-xs-2">{{u.GroupData.GroupName}}</td>
            <td class="col-xs-2">{{u.AdminUserName}}</td>
            <td>
              <div class="btn-group btn-group-sm" role="group" aria-label="..." style="width:100px">
                <b-button @click="editAdminUser(u.AdminUserId)" type="button" class="btn btn-outline-secondary btn-sm">编辑</b-button>
                <b-button @click="delAdminUser(u.AdminUserId)" type="button" class="btn btn-danger btn-sm">删除</b-button>
              </div>
            </td>
          </tr>
          <tr v-if="pagination">
            <td colspan="4">{{pagination}}</td>
          </tr>
          </tbody>
        </table>
      </div>





      <div class="w-100">
        <h4>编辑管理员-- {$user.AdminUserName}</h4>

        <b-form @submit.prevent="save">
          <b-container fluid class="border mb-3 py-3">
            <b-row>
              <b-col cols="12" sm="6" lg="3" class="mb-2 mb-lg-0">
                <b-input-group size="sm" class="flex-nowrap" prepend="用户ID">
                  <b-form-input :value="adminUserId" type="text" readonly></b-form-input>
                </b-input-group>
              </b-col>

              <b-col cols="12" sm="6" lg="3" class="mb-2 mb-lg-0">
                <b-input-group size="sm" class="flex-nowrap" prepend="用户名">
                  <b-form-input :value="adminUserName" type="text" readonly></b-form-input>
                </b-input-group>
              </b-col>

              <b-col cols="12" sm="6" lg="3" class="mb-2 mb-sm-0">
                <b-input-group size="sm" class="flex-nowrap" prepend="管理组">
                  <b-form-input :v-model="authGroup" type="text"></b-form-input>
                </b-input-group>
              </b-col>

              <b-col cols="12" sm="6" lg="3">
                <b-input-group size="sm" class="flex-nowrap" prepend="真实姓名">
                  <b-form-input :v-model="adminUserName" type="text"></b-form-input>
                </b-input-group>
              </b-col>
            </b-row>
          </b-container>

          <div class="border mb-3">
            <h6 class="mb-0 p-2 border-bottom"><strong>权限设置</strong></h6>
            <div class="bg-light p-2 border-bottom">
              <tree
                ref="menuTree"
                class="menu-tree"
                :data="treeData"
                :options="treeOptions">
                <span slot-scope="{ node }">
                  {{ node.data.name }}
                  <b-badge v-if="auth.includes(node.data.id)" variant="primary" class="mr-1">个人</b-badge>
                  <b-badge v-if="groupAuth.includes(node.data.id)" variant="success">管理组</b-badge>
                </span>
              </tree>
            </div>
            <div class="p-2">
              <b-button type="submit" variant="primary" class="btn-sm mr-1">保存</b-button>
              <b-button onclick="history.back()" type="button" variant="primary" class="btn-sm mr-1">取消</b-button>
              <b-button onclick="location.reload();return false;" type="button" class="btn btn-outline-secondary btn-sm">重置</b-button>
            </div>
          </div>

          <!-- <div class="table-responsive">
            <table class="table table-bordered text-nowrap" align="center">
              <tbody>
                <tr>
                  <td><h5 class="mb-0"><strong>权限设置</strong></h5></td>
                </tr>
                <tr>
                  <td class="bg-light">
                    <tree
                      ref="menuTree"
                      class="menu-tree"
                      :data="treeData"
                      :options="treeOptions">
                      <span slot-scope="{ node }">
                        {{ node.data.name }}
                        <b-badge v-if="auth.includes(node.data.id)" variant="primary" class="mr-1">个人</b-badge>
                        <b-badge v-if="groupAuth.includes(node.data.id)" variant="success">管理组</b-badge>
                      </span>
                    </tree>
                  </td>
                </tr>
                <tr>
                  <td>
                    <b-button type="submit" variant="primary" class="btn-sm mr-1">保存</b-button>
                    <b-button onclick="history.back()" type="button" variant="primary" class="btn-sm mr-1">取消</b-button>
                    <b-button onclick="location.reload();return false;" type="button" class="btn btn-outline-secondary btn-sm">重置</b-button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div> -->
        </b-form>
    
      </div>






    </b-row>
  </b-container>
</template>

<script>
import LiquorTree from 'liquor-tree'

export default {
  name: 'user',
  data () {
    return {
      user: [
        {
          AdminUserId: 1,
          GroupData: {
            GroupName: '管理员'
          },
          AdminUserName: 'admin'
        }, {
          AdminUserId: 666,
          GroupData: {
            GroupName: '管理员'
          },
          AdminUserName: '美特超级管理员'
        }, {
          AdminUserId: 881749,
          GroupData: {
            GroupName: '管理员'
          },
          AdminUserName: '文德胜'
        }, {
          AdminUserId: 1,
          GroupData: {
            GroupName: '管理员'
          },
          AdminUserName: 'admin'
        }, {
          AdminUserId: 1,
          GroupData: {
            GroupName: '管理员'
          },
          AdminUserName: 'admin'
        }, {
          AdminUserId: 1,
          GroupData: {
            GroupName: '管理员'
          },
          AdminUserName: 'admin'
        }
      ],
      pagination: null,

      treeData: [
        {
          text: '首页',
          data: {
            id: 1,
            name: '首页',
          },
          state: {
            checked: true,
            expanded: true
          },
          children: [
            {
              text: '基本信息',
              data: {
                id: 11,
                name: '基本信息',
              },
              state: { checked: true, expanded: true },
              children: [
                { text: '欢迎首页', data: { id: 111, name: '欢迎首页    padding: .75rem;    pa' }, state: { checked: true } },
                { text: '消息管理', data: { id: 112, name: '消息管理' }, state: { checked: true } },
                { text: '账号信息', data: { id: 113, name: '账号信息' }, state: { checked: true } },
              ]
            },
          ]
        },
        {
          text: '数据统计',
          data: {
            id: 2,
            name: '数据统计',
          },
          state: {
            checked: true,
            expanded: true
          },
          children: [
            {
              text: '概况',
              data: {
                id: 22,
                name: '概况',
              },
              state: { checked: true, expanded: true },
              children: [
                { text: '整体趋势', data: { id: 222, name: '整体趋势' }, state: { checked: true } },
                { text: '今日实时', data: { id: 223, name: '今日实时' }, state: { checked: true } },
              ]
            },
            {
              text: '设备数据',
              data: {
                id: 33,
                name: '设备数据',
              },
              state: { expanded: true },
              children: [
                { text: '全国地图数据', data: { id: 333, name: '全国地图数据' } },
                { text: '数据简报', data: { id: 334, name: '数据简报' } },
              ]
            },
          ]
        },
        { text: '秤管理', data: { id: 4, name: '秤管理' } }
      ],
      treeOptions: {
        checkbox: true,
        // propertyNames: {
        //   text: 'name',
        //   children: 'children'
        // }
      },
      auth: [1, 11, 111, 2, 33, 333, 334],
      groupAuth: [2, 22, 222, 33, 333, 334],
    }
  },
  components: {
    Tree: LiquorTree
  },
  methods: {
    save () {
      const checkedMenu = this.$refs.menuTree.checked()
      console.log(checkedMenu)
    }
  }
}
</script>

<style lang="less">
.menu-tree {
  .tree-anchor {
    font-size: 16px;
    text-decoration: none;
    &:hover {
      color: inherit;
      text-decoration: none;
    }
  }
}
</style>

<style lang="less" scoped>
.input-field {
  min-width: 150px;
}
.input-fixed-width {
  // width: 150px;
}
</style>
