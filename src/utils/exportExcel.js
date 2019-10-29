import fs from 'file-saver'
import XLSX from 'xlsx'

export default (sheetsData, fields, filename = 'Sheet1') => {
  const wb = XLSX.utils.book_new() // 工作簿对象包含一SheetNames数组，以及一个表对象映射表名称到表对象。XLSX.utils.book_new实用函数创建一个新的工作簿对象。
  const header = Object.values(fields)
  sheetsData.forEach((sheetData, index) => {
    const sheetName = sheetData.sheetName || 'Sheet' + (index + 1)
    const data = sheetData.data.map(item => {
      const row = {}
      const keys = Object.keys(fields)
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i]
        row[fields[key]] = item[key]
      }
      return row
    })
    const ws = XLSX.utils.json_to_sheet(data, { header: header }) // 将JS对象数组转换为工作表。
    wb.SheetNames.push(sheetName)
    wb.Sheets[sheetName] = ws
  })
  // const defaultCellStyle = { font: { name: "Verdana", sz: 13, color: "FF00FF88" }, fill: { fgColor: { rgb: "FFFFAA00" } } }; //设置表格的样式
  // let wopts = { bookType: 'xlsx', bookSST: false, type: 'binary', cellStyles: true, defaultCellStyle: defaultCellStyle, showGridLines: false } //写入的样式
  const wopts = { bookType: 'xlsx', bookSST: false, type: 'binary' }
  const wbout = XLSX.write(wb, wopts)
  const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' })
  fs.saveAs(blob, filename + '.xlsx')
}

const s2ab = s => {
  if (typeof ArrayBuffer !== 'undefined') {
    const buf = new ArrayBuffer(s.length)
    const view = new Uint8Array(buf)
    for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xff
    return buf
  } else {
    const buf = new Array(s.length)
    for (let i = 0; i !== s.length; ++i) buf[i] = s.charCodeAt(i) & 0xFF
    return buf
  }
}
