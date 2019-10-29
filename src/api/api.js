import TurnplateApi from './turnplate'
import Request from '../utils/request'

// 图片上传共用API
const UploadFile = formData => Request.post('Admin/Turnplate/uploadFile', formData)

export {
  TurnplateApi,
  UploadFile
}
