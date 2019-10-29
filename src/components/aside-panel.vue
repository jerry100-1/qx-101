<template>
  <b-col id="main-aside" class="sidebar d-none d-md-block" :style="{top: top}">
    <VuePerfectScrollbar class="scroll-area">
      <div class="menu-wrapper">
        <div v-for="(main, index) in Object.values(menu).sort(sortMenu)" v-if="auth.includes(main.Key)" :key="main.AdminMenuId" :class="{'d-none': !(main.AdminMenuId === currentMainMenu || currentMainMenu === '' && index === 0)}" class="list-menu">
          <b-navbar-nav v-for="sub in [...main.child].sort(sortMenu)" v-if="auth.includes(sub.Key)" :key="sub.AdminMenuId" class="nav nav-sidebar">
            <b-nav-item @click="toggleMenuExpand(sub.AdminMenuId)" class="menu-title">
              <span>{{sub.Name}}</span>
              <img class="expand-icon" :class="{ collapsed: menuCollapsedStatus[sub.AdminMenuId] === 1 }" src="../assets/images/icon-angle-up.svg">
            </b-nav-item>
            <b-nav-item v-show="!menuCollapsedStatus[sub.AdminMenuId]" v-for="menu in [...sub.child].sort(sortMenu)" v-if="auth.includes(menu.Key) && menu.DisplayOrder >= 0" :key="menu.AdminMenuId" class="menu-link" :class="{active: currentPage === menu.Url}" @click="changeViewPage(menu)">{{menu.Name}}</b-nav-item>
          </b-navbar-nav>
        </div>
      </div>
    </VuePerfectScrollbar>
  </b-col>
</template>

<script>
import VuePerfectScrollbar from 'vue-perfect-scrollbar'

export default {
  name: 'aside-panel',
  components: {
    VuePerfectScrollbar
  },
  props: {
    top: {
      type: [String, Boolean],
      default: false
    },
    currentMainMenu: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      menuCollapsedStatus: {}
    }
  },
  computed: {
    menu () {
      return this.$store.getters.menu
    },
    user () {
      return this.$store.getters.user
    },
    auth () {
      return this.user ? this.user.GroupData.AdminAuth.concat(this.user.SpecialGroups) : []
    },
    currentPage () {
      return this.$store.getters.currentPage
    }
  },
  methods: {
    changeViewPage (menu) {
      this.$emit('change-view-page', menu)
    },
    sortMenu (a, b) {
      return parseFloat(b.DisplayOrder) - parseFloat(a.DisplayOrder)
    },
    toggleMenuExpand (id) {
      this.$set(this.menuCollapsedStatus, id, !this.menuCollapsedStatus[id] & 1)
    }
  }
}
</script>

<style lang="less" scoped>
.sidebar {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 2050;
  display: block;
  padding: 0 5px 0 0;
  overflow-x: hidden;
  overflow-y: auto;
  background: rgba(50, 55, 76, 1);
  .menu-wrapper {
    padding: 0 16px 30px 10px;
    .nav-sidebar {
      .menu-title {
        .nav-link {
          display: flex;
          align-items: center;
          font-family: PingFangSC-Regular;
          font-size: 18px;
          font-weight: 400;
          margin: 26px 0 6px 10px;
          padding: 0;
          color: rgba(255, 255, 255, 0.5);
          outline: none;
          .expand-icon {
            display: block;
            width: 10px;
            height: 20px;
            margin-left: 8px;
            &.collapsed {
              transform: rotate(180deg);
            }
          }
        }
      }
      .menu-link {
        display: flex;
        align-items: center;
        margin-top: 18px;
        cursor: pointer;
        .nav-link {
          font-family: PingFangSC-Regular;
          font-size: 18px;
          font-weight: 400;
          padding: 6px 15px 8px 48px;
          color: rgba(255, 255, 255, 0.5);
          outline: none;
        }
        &:hover {
          .nav-link {
            text-decoration: none;
            color: rgba(255, 255, 255, 1);
          }
        }
        &.active {
          border-radius: 6px;
          background: rgba(23, 24, 32, 1);
          .nav-link {
            color: rgba(255, 136, 45, 1);
          }
        }
      }
    }
  }
}
.scroll-area {
  height: 100%;
}
</style>

<style lang="less">
#main-aside {
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
