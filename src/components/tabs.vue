<template>
  <div v-if="tabViews.length > 0" id="main-tabs" class="tabs-wrapper">
    <VuePerfectScrollbar ref="scrollbar" class="scroll-area">
      <b-tabs :value="tabIndex">
        <b-tab v-for="(item, index) in Array.from(tabViews)" :key="item.path" :active="item.path === currentPage" @click="changeContent(index)">
          <template slot="title">
            {{menuUrlMap.get(item.path) || menuUrlMap.get(item.path.substr(1)) || '未知页面'}}
            <a v-if="tabViews.length > 1" @click.stop.prevent="() => closeTab(index)" href="#" class="btn-close">&times;</a>
          </template>
        </b-tab>
      </b-tabs>
    </VuePerfectScrollbar>
  </div>
</template>

<script>
import eventBus from '@/utils/eventBus'
import VuePerfectScrollbar from 'vue-perfect-scrollbar'

export default {
  name: 'tabs',
  components: {
    VuePerfectScrollbar
  },
  data: () => ({
    tabIndex: 0
  }),
  computed: {
    tabViews () {
      return this.$store.state.tagsView.visitedViews
    },
    cachedViews () {
      return this.$store.getters.cachedViews
    },
    currentPage () {
      return this.$store.getters.currentPage
    },
    menuUrlMap () {
      const menu = this.$store.getters.menu || {}
      const map = new Map()
      this.setMenuMap(Object.values(menu), map)
      return map
    }
  },
  watch: {
    $route () {
      this.addViewTags()
    }
  },
  created () {
    this.addViewTags()
    eventBus.$on('addViewTags', this.addViewTags)
    eventBus.$on('addIframeTags', this.addIframeTags)
  },
  mounted () {
    window.addEventListener('resize', this.fitScrollbar, false)
  },
  beforeDestroy () {
    eventBus.$off('addViewTags')
    eventBus.$off('addIframeTags')
    window.removeEventListener('resize', this.fitScrollbar, false)
  },
  methods: {
    fitScrollbar () {
      this.$refs.scrollbar.update()
    },
    setMenuMap (menu, map) {
      menu.forEach(item => {
        if (item.Url) {
          const index = item.Url.indexOf('?')
          if (item.Url.indexOf('.php') === -1 && index > 0) {
            map.set(item.Url.substring(0, index), item.Name)
          } else {
            map.set(item.Url, item.Name)
          }
        }
        item.child && this.setMenuMap(item.child, map)
      })
    },
    generateRoute () {
      if (this.$route.name && this.$route.path !== '/') {
        return this.$route
      }
      return false
    },
    addViewTags () {
      if (this.currentPage.indexOf('.php') === -1 && this.currentPage !== '/') {
        eventBus.$emit('recordScrollPosition')
      }
      const route = this.generateRoute()
      if (!route) {
        return false
      }
      this.$store.dispatch('addVisitedViews', route).then(() => {
        this.tabIndex = this.tabViews.map(item => item.path).indexOf(route.path)
      })
    },
    addIframeTags (iframe) {
      if (this.currentPage.indexOf('.php') === -1 && this.currentPage !== '/') {
        eventBus.$emit('recordScrollPosition')
      }
      this.$store.dispatch('addVisitedIframes', iframe).then(() => {
        this.tabIndex = this.tabViews.map(item => item.path).indexOf(iframe.path)
        if (this.$route.path !== '/') {
          this.$router.push({ path: '/', query: { p: iframe.name } })
        } else if (this.$route.query.p !== iframe.name) {
          if (!this.$route.query.p) {
            this.$router.replace({ path: '/', query: { p: iframe.name } })
          } else {
            this.$router.push({ path: '/', query: { p: iframe.name } })
          }
        }
      })
    },
    changeContent (tabIndex) {
      const currentTabView = this.tabViews[tabIndex]
      if (currentTabView.path.indexOf('.php') > -1) {
        this.addIframeTags(currentTabView)
      } else {
        if (currentTabView && currentTabView.path === this.$route.path) {
          this.addViewTags()
        } else {
          this.$router.push(currentTabView ? currentTabView.fullPath : '/')
        }
      }
    },
    closeTab (index) {
      if (this.currentPage.indexOf('.php') === -1 && this.currentPage !== '/') {
        eventBus.$emit('recordScrollPosition')
      }

      const view = this.tabViews[index]

      let isTabIndexChanged = true
      if (view.path === this.currentPage &&
        index !== this.tabViews.length - 1) {
        isTabIndexChanged = false
      }
      if (view.path.indexOf('.php') > -1) {
        this.$store.dispatch('delVisitedIframes', view).then((views) => {
          !isTabIndexChanged && this.changeContent(index)
        })
      } else {
        this.$store.dispatch('delVisitedViews', view).then((views) => {
          !isTabIndexChanged && this.changeContent(index)
        })
      }
    }
  }
}
</script>

<style lang="less">
#main-tabs {
  .nav-tabs {
    flex-wrap: nowrap;
    white-space: nowrap;
    width: fit-content;
    padding: 0 10px;
    border: none;
    outline: none;
    .nav-item {
      margin: 0;
      .nav-link {
        position: relative;
        font-family: PingFangSC-Regular;
        font-size: 16px;
        font-weight: 400;
        padding: 10px 12px;
        border: none;
        border-radius: 8px 8px 0px 0px;
        background: rgba(255, 255, 255, 1);
        color: rgba(50, 55, 76, 1);
        overflow: hidden;
        &:not(.active) {
          background: rgba(229, 229, 229, 1);
          color: #666;
          &:hover {
            background: rgba(255, 255, 255, 0.5);
          }
        }
        &:hover {
          .btn-close {
            display: block;
          }
        }
      }
    }
  }

  @scrollBarColor: rgba(50, 55, 76, 0.1);
  @scrollBarRailColor: none;
  @scrollBarThickness: 6px;
  @scrollBarHoverThickness: 6px;
  @scrollBarRailThickness: 10px;
  .ps {
    &.ps--in-scrolling {
      &.ps--x {
        >.ps__scrollbar-x-rail {
          background: @scrollBarRailColor;
          >.ps__scrollbar-x {
            background: @scrollBarColor;
            height: @scrollBarHoverThickness;
          }
        }
      }
      &.ps--y {
        >.ps__scrollbar-y-rail {
          background: @scrollBarRailColor;
          >.ps__scrollbar-y {
            background: @scrollBarColor;
            width: @scrollBarHoverThickness;
          }
        }
      }
    }
    >.ps__scrollbar-x-rail {
      height: @scrollBarRailThickness;
      >.ps__scrollbar-x {
        background: @scrollBarColor;
        height: @scrollBarThickness;
      }
      &:active, &:hover {
        >.ps__scrollbar-x {
          height: @scrollBarHoverThickness;
        }
      }
    }
    >.ps__scrollbar-y-rail {
      width: @scrollBarRailThickness;
      >.ps__scrollbar-y {
        background: @scrollBarColor;
        width: @scrollBarThickness;
      }
      &:active, &:hover {
        >.ps__scrollbar-y {
          width: @scrollBarHoverThickness;
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
              height: @scrollBarHoverThickness;
            }
          }
        }
        &.ps--y {
          >.ps__scrollbar-y-rail {
            background: @scrollBarRailColor;
            >.ps__scrollbar-y {
              background: @scrollBarColor;
              width: @scrollBarHoverThickness;
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
.tabs-wrapper {
  padding-top: 12px;
  background: rgba(229, 229, 229, 1);
}
.btn-close {
  display: none;
  position: absolute;
  top: 0;
  right: 0;
  width: 30px;
  height: 30px;
  padding-left: 4px;
  transform: translate(50%, -50%);
  font-size: 12px;
  font-weight: 700;
  line-height: 42px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 1);
  color: #FFFFFF;
  opacity: 0.5;
  text-decoration: none;
  &:hover, &:focus {
    opacity: 0.8;
  }
}
.scroll-area {
  width: 100%;
}
</style>
