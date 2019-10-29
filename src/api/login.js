import config from '@/config'
import qs from 'qs'
import request from '@/utils/request'
import { JSEncrypt } from 'jsencrypt'
import md5 from 'md5'

export function getLoginVcode () {
  return request({
    url: 'Admin/Login/vcode',
    method: 'get'
  })
}

// 登录验证码路径
export function getVerifyImgUrl () {
  const time = parseInt(Date.now() / 1000)
  const hash = process.env.NODE_ENV === 'production' ? md5(config.APPKEY + config.VERSION + 'Admin/Login/verify' + config.APPID + config.DEVICEID + config.CHANNEL + time) : 'test'
  const params = qs.stringify({
    deviceid: config.DEVICEID,
    appid: config.APPID,
    hash: hash,
    channel: config.CHANNEL,
    time: time
  })
  return config.BASE_API + '/' + config.VERSION + '/Admin/Login/verify?' + params
}

// 登录
export function loginByUsername ({ name, pwd }) {
  const pkey = '-----BEGIN PUBLIC KEY-----MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEArab2jhyLLBcsL9wV0XVgUphaF2yzcz51ZSRK+5XI3aq2w59gafx8URXyq4iM1Mh9Oql1nvrlTt2NFFZ1R/OQvvqKXzdd/dL9LUrvUyJiNGzVOPmw0sSAUtG3VDO1oPa1h1+9b9d17C0g74llOdCq6QmvnUFRaGeTmoN3GZ+w/Of0ZN5SXs6fuxXIs1g35lHFhbvvOxOT6zCg8Q0x9SCfc7KMh2znL0rK6TCbBVHExmR5jISqhUKRwGGjQIEOnBK4Kx5dsdB2YpCi7ficKYP3hc6+CdoQFlGqPpXIaBupgA6NJF/UQ8XP5trxod7gWzl9oABbZmzI9K7f/Mi45sWrFwIDAQAB-----END PUBLIC KEY-----'
  const rsa = new JSEncrypt()
  rsa.setPublicKey(pkey)

  const data = {
    name,
    pwd: rsa.encrypt(pwd)
  }
  return request({
    url: 'Admin/Login/login',
    method: 'post',
    data: qs.stringify(data)
  })
}
