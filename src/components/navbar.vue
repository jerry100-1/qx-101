<template>
  <b-navbar id="main-navbar" fixed="top" toggleable="md" type="dark">
    <b-navbar-brand href="#">
      <div class="brand-content">
        <img src="../assets/images/brand-logo.png" class="logo">
        <div class="nav-title">
          <span class="brand-name">记账宝</span>
          <span class="system-name">后台管理系统</span>
        </div>
      </div>
    </b-navbar-brand>
    <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
    <VuePerfectScrollbar ref="scrollbar" class="scroll-area">
      <b-collapse is-nav id="nav_collapse" class="flex-nowrap text-nowrap">
        <b-navbar-nav class="flex-nowrap">
          <template v-for="(main, index) in Object.values(menu).sort(sortMenu)" v-if="auth.includes(main.Key)">
            <b-nav-item @click="changeMainMenu(main.AdminMenuId)" :active="main.AdminMenuId === currentMainMenu || currentMainMenu === '' && index === 0 ? true : false" :key="'nav-' + main.AdminMenuId" href="#" class="d-none d-md-block">{{main.Name}}</b-nav-item>
            <b-nav-item-dropdown :key="'nav-dropdown-' + main.AdminMenuId" :text="main.Name" right class="d-block d-md-none">
              <template v-for="sub in [...main.child].sort(sortMenu)" v-if="auth.includes(sub.Key)">
                <b-dropdown-header :key="sub.AdminMenuId">{{sub.Name}}</b-dropdown-header>
                <b-dropdown-item v-for="menu in [...sub.child].sort(sortMenu)" v-if="auth.includes(menu.Key) && menu.DisplayOrder >= 0" :key="menu.AdminMenuId" @click="changeViewPage(menu, main.AdminMenuId)">{{menu.Name}}</b-dropdown-item>
              </template>
            </b-nav-item-dropdown>
          </template>
        </b-navbar-nav>
        <b-navbar-nav class="ml-auto">
          <b-nav-item v-if="user" @click="changeViewPage({Key: 'admin-info', Url: 'admin/userinfo.php'})">{{user.AdminUserName}}</b-nav-item>
          <b-nav-item @click="refreshAuth">刷新权限</b-nav-item>
          <b-nav-item @click="refreshCurrentPage">刷新页面</b-nav-item>
          <b-nav-item @click="logout">退出登录</b-nav-item>
          <b-nav-item @click="changeViewPage({Key: 'admin-message', Url: 'admin/message.php'})">
            <img class="icon-message" src="../assets/images/massage_over.png">
          </b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </VuePerfectScrollbar>

    <iframe @load="refreshCallback" name="refresh-no-redirect" class="d-none border-0" style="width: 0; height: 0;"></iframe>
    <form ref="refresh" :action="refreshUrl" method="get" target="refresh-no-redirect" class="d-none">
      <input type="hidden" name="do" value="refresh" />
    </form>

  </b-navbar>
</template>

<script>
import { refresh } from '@/api/index'
import VuePerfectScrollbar from 'vue-perfect-scrollbar'

export default {
  name: 'navbar',
  components: {
    VuePerfectScrollbar
  },
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      hasBeenRefreshed: false
    }
  },
  computed: {
    currentMainMenu () {
      return this.value
    },
    menu () {
      return this.$store.getters.menu
    },
    user () {
      return this.$store.getters.user
    },
    auth () {
      return this.user ? this.user.GroupData.AdminAuth.concat(this.user.SpecialGroups) : []
    },
    refreshUrl () {
      if (process.env.NODE_ENV === 'development') {
        return `${this.$config.HOST}/admin.php`
      } else {
        return `//${location.host}/admin.php`
      }
    }
  },
  mounted () {
    window.addEventListener('resize', this.fitScrollbar, false)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.fitScrollbar, false)
  },
  methods: {
    fitScrollbar () {
      this.$refs.scrollbar.update()
    },
    changeMainMenu (id) {
      this.$emit('input', id)
    },
    changeViewPage (menu, id) {
      typeof id === 'string' && this.changeMainMenu(id)
      this.$emit('change-view-page', menu)
    },
    sortMenu (a, b) {
      return parseFloat(b.DisplayOrder) - parseFloat(a.DisplayOrder)
    },
    refreshCurrentPage () {
      const view = this.$store.getters.visitedViews.find(item => item.path === this.$store.getters.currentPage)
      const menu = {
        Key: view.name,
        Url: view.fullPath
      }
      this.$emit('change-view-page', menu)
    },
    refreshAuth () {
      refresh().then(res => {
        const data = res.data
        if (data.Status === 200) {
          this.hasBeenRefreshed = true
          this.$refs.refresh.submit()
        }
      })
    },
    refreshCallback () {
      this.hasBeenRefreshed && (location.href = this.$config.BASE_URL)
    },
    logout () {
      this.$store.dispatch('LogOut').then(() => {
        this.$router.push('/login')
      })
    }
  }
}
</script>

<style lang="less">
#main-navbar {
  .dropdown-menu {
    @bgColor: #262a2d;
    @color: rgba(255, 255, 255, .5);
    background-color: @bgColor;
    .dropdown-item {
      color: @color;
      &:focus {
        color: @color;
        background-color: @bgColor;
        outline: none;
      }
      &:hover {
        color: @color;
        background-color: #1b1d1f;
        outline: none;
      }
      &.active {
        color: #fff;
        background-color: #007bff;
      }
    }
  }
  .navbar-collapse {
    max-height: 340px;
  }

  @scrollBarColor: rgba(255, 255, 255, 0.2);
  @scrollBarRailColor: none;
  .ps {
    &.ps--in-scrolling {
      &.ps--x {
        >.ps__scrollbar-x-rail {
          background: @scrollBarRailColor;
          >.ps__scrollbar-x {
            background: @scrollBarColor;
            height: 11px;
          }
        }
      }
      &.ps--y {
        >.ps__scrollbar-y-rail {
          background: @scrollBarRailColor;
          >.ps__scrollbar-y {
            background: @scrollBarColor;
            width: 11px;
          }
        }
      }
    }
    >.ps__scrollbar-x-rail {
      height: 15px;
      >.ps__scrollbar-x {
        background: @scrollBarColor;
        height: 6px;
      }
      &:active, &:hover {
        >.ps__scrollbar-x {
          height: 11px;
        }
      }
    }
    >.ps__scrollbar-y-rail {
      width: 15px;
      >.ps__scrollbar-y {
        background: @scrollBarColor;
        width: 6px;
      }
      &:active, &:hover {
        >.ps__scrollbar-y {
          width: 11px;
        }
      }
    }
    &:hover {
      &.ps--in-scrolling {
        &.ps--x {
          >.ps__scrollbar-x-rail {
            background: @scrollBarRailColor;
            >.ps__scrollbar-x {
              background: @scrollBarColor;
              height: 11px;
            }
          }
        }
        &.ps--y {
          >.ps__scrollbar-y-rail {
            background: @scrollBarRailColor;
            >.ps__scrollbar-y {
              background: @scrollBarColor;
              width: 11px;
            }
          }
        }
      }
      >.ps__scrollbar-x-rail {
        &:hover {
          background: @scrollBarRailColor;
          >.ps__scrollbar-x {
            background: @scrollBarColor;
          }
        }
      }
      >.ps__scrollbar-y-rail {
        &:hover {
          background: @scrollBarRailColor;
          >.ps__scrollbar-y {
            background: @scrollBarColor;
          }
        }
      }
    }
  }
}
</style>

<style lang="less" scoped>
.navbar-brand {
  font-size: inherit;
  margin-right: 0;
  padding: 0;
  .brand-content {
    display: flex;
    align-items: center;
    width: 250px;
    height: 70px;
    .logo {
      display: block;
      width: 44px;
      height: 44px;
      margin-left: 26px;
    }
    .nav-title {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      margin-left: 26px;
      .brand-name {
        font-family: PingFangSC-Regular;
        font-size: 16px;
        font-weight: 400;
        line-height: 24px;
        color: rgba(255, 255, 255, 0.5);
      }
      .system-name {
        font-size: 16px;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        line-height: 24px;
        color: rgba(255, 255, 255, 0.5);
      }
    }
  }
}

.icon-message {
  display: block;
  width: 21px;
  height: 21px;
}

.navbar {
  background: rgba(50, 55, 76, 1);
  .navbar-collapse:not(.show) {
    .navbar-nav {
      .nav-item {
        .nav-link {
          display: flex;
          align-items: center;
          font-family: PingFangSC-Regular;
          font-size: 16px;
          font-weight: 400;
          height: 70px;
          padding: 0 10px;
          color: rgba(255, 255, 255, 0.5);
          &.active {
            background: rgba(23, 24, 32, 1);
            color: rgba(255, 136, 45, 1);
          }
        }
      }
    }
  }
}
.scroll-area {
  width: 100%;
}

@media (min-width: 768px) {
  .navbar {
    padding: 0;
    .navbar-brand {
      .brand-content {
        background: rgba(41, 44, 63, 1);
      }
    }
  }
}
</style>
