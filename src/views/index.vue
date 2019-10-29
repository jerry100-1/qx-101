<template>
  <div class="">
    <navbar ref="navbar" v-model="currentMainMenu" @change-view-page="changeViewPage"></navbar>
    <b-container class="main-container" :style="{paddingTop: navbarHeight}" fluid>
      <b-row class="position-relative h-100">
        <aside-panel class="aside-panel" :current-main-menu="currentMainMenu" @change-view-page="changeViewPage"></aside-panel>
        <b-col class="content-layout h-100 d-flex flex-column">
          <b-row class="flex-shrink-0">
            <tabs class="d-none d-md-block w-100"></tabs>
          </b-row>
          <b-row ref="tabContent" class="mt-md-2 flex-grow-1 position-relative overflow-auto">
            <div v-show="currentPage.indexOf('.php') === -1" class="page-wrapper">
              <keep-alive :include="cachedViews">
                <router-view/>
              </keep-alive>
            </div>
            <template v-show="currentPage.indexOf('.php') > -1">
              <iframe onload="recordHistory(this)" v-for="item in cachedIframes" v-show="currentPage === item.path" :key="item.path" :id="'php-' + item.name" class="position-absolute w-100 h-100 border-0" :src="baseModule + item.path"></iframe>
            </template>
          </b-row>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import Navbar from '@/components/navbar'
import AsidePanel from '@/components/aside-panel'
import Tabs from '@/components/tabs'
import eventBus from '@/utils/eventBus'
import { authexpire } from '@/api/index'
import swal from 'sweetalert2'
import store from '@/store'

window.recordHistory = (iframe) => {
  try {
    const url = iframe.contentWindow.location.href
    store.dispatch('recordHistory', { window: iframe.contentWindow, url: url })
  } catch (e) {
  }
}
window.sweetAlert = window.swal = (config, ...restConfig) => {
  if (typeof config === 'string') {
    swal(config, ...restConfig)
  } else if (typeof config === 'object') {
    swal(config).then(res => {
      if (restConfig.length > 0 && typeof restConfig[0] === 'function') {
        const callback = restConfig[0]
        if (!config.showCancelButton || callback.length === 1 || res.value) {
          if (callback.toString().indexOf('index.php') > -1) {
            store.dispatch('LogOut').then(() => {
              location.reload()
            })
          } else if (callback.toString().indexOf('.php') === -1 && (callback.toString().indexOf('history.go') > -1 || callback.toString().indexOf('history.back') > -1)) {
            const iframeWindow = restConfig[1]
            if (iframeWindow) {
              const historyMap = store.getters.history
              const historyArr = historyMap.get(iframeWindow)
              if (historyArr && historyArr.length >= 2) {
                historyArr.pop()
                const url = historyArr.pop()
                iframeWindow.history.replaceState({}, '', url)
                iframeWindow.location.href = url
              }
            }
          } else {
            callback(res.value)
          }
        }
      }
    })
  }
}
window.__confirm = (msg, desc, url, obj) => {
  swal({
    title: msg,
    text: desc,
    type: 'warning',
    showCancelButton: true,
    cancelButtonText: '取消',
    confirmButtonColor: '#DD6B55',
    confirmButtonText: '确定',
    closeOnConfirm: true
  }).then(res => {
    if (res.value && obj && obj !== window) {
      setTimeout(() => {
        obj.location.href = url
      }, 100)
    }
  })
}

export default {
  name: 'index',
  components: {
    Navbar,
    AsidePanel,
    Tabs
  },
  computed: {
    baseModule () {
      if (process.env.NODE_ENV === 'development') {
        return `${this.$config.HOST}/data/modules/`
      } else {
        return `//${location.host}/data/modules/`
      }
    },
    cachedViews () {
      return this.$store.state.tagsView.cachedViews
    },
    cachedIframes () {
      return this.$store.state.tagsView.cachedIframes
    },
    currentPage () {
      return this.$store.getters.currentPage
    },
    scrollPosition () {
      return this.$store.getters.scrollPosition
    },
    menuMap () {
      return this.generateMenuMap(Object.values(this.$store.getters.menu))
    }
  },
  data () {
    return {
      navbarHeight: false,
      currentMainMenu: ''
    }
  },
  watch: {
    $route () {
      this.loadIframeByRouteQuery()
    }
  },
  created () {
    eventBus.$on('recordScrollPosition', this.recordScrollPosition)
  },
  mounted () {
    this.loadIframeByRouteQuery()
    this.fitNavbar()
    window.addEventListener('resize', this.fitNavbar, false)
    window.addEventListener('resize', this.setContainerHeight, false)
  },
  updated () {
    this.setContainerHeight()
    if (this.currentPage.indexOf('.php') === -1 && this.currentPage !== '/') {
      const tabContent = this.$refs.tabContent
      const pos = this.scrollPosition[this.currentPage]
      if (pos) {
        tabContent.scrollLeft = pos.x
        tabContent.scrollTop = pos.y
      } else {
        tabContent.scrollLeft = 0
        tabContent.scrollTop = 0
      }
    }
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.fitNavbar)
    window.removeEventListener('resize', this.setContainerHeight)
    eventBus.$off('recordScrollPosition')
  },
  methods: {
    generateMenuMap (menu) {
      let map = new Map()
      menu.forEach(item => {
        if (item.Url) {
          map.set(item.Key, item)
        }
        if (item.child) {
          map = new Map([...map, ...this.generateMenuMap(item.child)])
        }
      })
      return map
    },
    loadIframeByRouteQuery () {
      if (this.$route.path === '/') {
        const page = this.$route.query.p

        if (page) {
          if (this.menuMap.has(page)) {
            const menu = this.menuMap.get(page)
            this.changeViewPage(menu, this.cachedIframes.findIndex(item => item.name === menu.Key) === -1)
          } else {
            this.$router.back()
          }
        } else if (page === undefined) {
          this.changeViewPage({
            Key: 'welcome',
            Url: '../main.php'
          })
        }
      }
    },
    fitNavbar () {
      this.navbarHeight = this.$refs.navbar.$el.offsetHeight + 'px'
    },
    setContainerHeight () {
      const container = this.$refs.tabContent
      container && this.$store.dispatch('setContainerHeight', container.clientHeight)
    },
    recordScrollPosition () {
      const tabContent = this.$refs.tabContent
      this.$store.dispatch('setScrollPosition', { page: this.currentPage, pos: { x: tabContent.scrollLeft, y: tabContent.scrollTop } })
    },
    changeViewPage (menu, refresh = this.$config.REFRESH) {
      if (menu.Url.indexOf('.php') > -1) {
        // 点击菜单始终刷新
        if (refresh) {
          authexpire().then(res => {
            const data = res.data
            if (data.Status === 200) {
              const view = {
                name: menu.Key,
                path: menu.Url,
                fullPath: menu.Url
              }
              this.$store.dispatch('delCachedIframes', view).then(() => {
                eventBus.$emit('addIframeTags', view)
              })
            }
          }).catch(() => {})
        } else { // 点击菜单不刷新
          const index = this.$store.getters.cachedIframes.findIndex(item => item.name === menu.Key)
          if (index > -1) {
            eventBus.$emit('addIframeTags', {
              name: menu.Key,
              path: menu.Url,
              fullPath: menu.Url
            })
          } else {
            authexpire().then(res => {
              const data = res.data
              if (data.Status === 200) {
                eventBus.$emit('addIframeTags', {
                  name: menu.Key,
                  path: menu.Url,
                  fullPath: menu.Url
                })
              }
            }).catch(() => {})
          }
        }
      } else {
        if (menu.Url === this.$route.path) {
          // 点击菜单始终刷新
          if (refresh) {
            this.$store.dispatch('delCachedViews', this.$router.match(menu.Url)).then(() => {
              this.$router.replace({ path: '/', query: { p: '' } }, () => {
                this.$nextTick(() => {
                  this.$router.replace(menu.Url)
                })
              })
            })
          } else { // 点击菜单不刷新
            eventBus.$emit('addViewTags')
          }
        } else {
          // 点击菜单始终刷新
          if (refresh) {
            this.$store.dispatch('delCachedViews', this.$router.match(menu.Url)).then(() => {
              this.$nextTick(() => {
                this.$router.push(menu.Url)
              })
            })
          } else { // 点击菜单不刷新
            this.$router.push(menu.Url)
          }
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.main-container {
  height: 100vh;
  padding-top: 56px;
  box-sizing: border-box;
  .aside-panel {
    width: 250px;
  }
}
@media (min-width: 768px) {
  .main-container {
    .content-layout {
      width: 100%;
      overflow: hidden;
      margin-left: 250px;
    }
  }
}
.overflow-auto {
  overflow: auto;
}
.page-wrapper {
  min-width: 100%;
}
</style>
