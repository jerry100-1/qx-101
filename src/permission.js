import router from './router'
import store from './store'
import swal from 'sweetalert2'

function matchMenu (menuArr, path) {
  let key = null
  for (let i = 0; i < menuArr.length; i++) {
    const menu = menuArr[i]
    if (menu.Url === path) {
      key = menu.Key
      break
    }
    if (menu.child) {
      key = matchMenu(menu.child, path)
      if (key) break
    }
  }
  return key
}

// permissiom judge
function hasPermission (path) {
  const user = store.getters.user
  if (user.AdminUserName === 'admin' || path === '/') {
    return true
  }
  const key = matchMenu(Object.values(store.getters.menu), path)
  const auth = user.GroupData.AdminAuth.concat(user.SpecialGroups)
  return key && auth.includes(key)
}

const whiteList = ['/login']// 不重定向白名单

router.beforeEach((to, from, next) => {
  if (store.getters.token) { // 判断是否有token
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      if (!store.getters.user || !store.getters.menu) {
        Promise.all([
          store.dispatch('GetUserInfo'),
          store.dispatch('GetMenu')
        ]).then(() => {
          next({ ...to, replace: true })
        }).catch(() => {
          store.dispatch('FedLogOut').then(() => {
            next({ path: '/login' })
          })
        })
      } else {
        if (hasPermission(to.path)) {
          next()
        } else {
          swal({
            text: '您没有该页面的访问权限',
            type: 'error',
            // toast: true,
            // width: '16rem',
            timer: 2000,
            showConfirmButton: false
          })
          next(false)
        }
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
      next()
    } else {
      next('/login') // 否则全部重定向到登录页
    }
  }
})

router.afterEach(() => {
})
