import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'

export function getToken () {
  return Cookies.get(TokenKey)
}

export function setToken (token) {
  // return Cookies.set(TokenKey, token)
  // token 有效期为1天
  return Cookies.set(TokenKey, token, { expires: 1 })
}

export function removeToken () {
  return Cookies.remove(TokenKey)
}
