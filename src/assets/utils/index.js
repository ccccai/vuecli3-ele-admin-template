/* eslint-disable */

/**
 * 公共基础工具类
 */

// 判断是否为空
export function isNotEmpty(obj) {
  try {
    if (obj == null || obj == undefined) {
      return false
    }
    //判断数字是否是NaN
    if (typeof obj === 'number') {
      if (isNaN(obj)) {
        return false
      } else {
        return true
      }
    }
    //判断参数是否是布尔、函数、日期、正则，是则返回true
    if (
      typeof obj === 'boolean' ||
      typeof obj === 'function' ||
      obj instanceof Date ||
      obj instanceof RegExp
    ) {
      return true
    }
    //判断参数是否是字符串，去空，如果长度为0则返回false
    if (typeof obj === 'string') {
      if (obj.trim().length == 0) {
        return false
      } else {
        return true
      }
    }

    if (typeof obj === 'object') {
      //判断参数是否是数组，数组为空则返回false
      if (obj instanceof Array) {
        if (obj.length == 0) {
          return false
        } else {
          return true
        }
      }

      //判断参数是否是对象，判断是否是空对象，是则返回false
      if (obj instanceof Object) {
        //判断对象属性个数
        if (Object.getOwnPropertyNames(obj).length == 0) {
          return false
        } else {
          return true
        }
      }
    }
  } catch (e) {
    console.log(e)
    return false
  }
}

// 组装菜单
export function formattingPermission(data) {
  let tmpData = []
  const defaultExpanded = []
  if (Object.prototype.toString.call(data) !== '[object Array]') {
    return { defaultExpanded: defaultExpanded, data: tmpData }
  }
  const level1 = [], level2 = [], level3 = []
  // 组装数据，拼接成elementUI树形控件支持的形式
  data.forEach(item => {
    switch (item.level) {
      case 1 :
        level1.push({...item, children: []})
        defaultExpanded.push(item.id) // 默认全部一级菜单是展开状态
        break
      case 2:
        level2.push({...item, children: []})
        break
      case 3:
        level3.push({...item})
        break
    }
  })

  level3.forEach((lastLevelItem, index) => {
    level2.forEach((secondLevelItem, i) => {
      if (secondLevelItem.id === lastLevelItem.parentId) {
        level2[i].children.push({
          ...lastLevelItem
        })
      }
    })
  })

  level2.forEach((secondLevelItem, index) => {
    level1.forEach((firstLevelItem, i) => {
      if (firstLevelItem.id === secondLevelItem.parentId) {
        level1[i].children.push({
          ...secondLevelItem
        })
      }
    })
  })

  tmpData = [...level1]
  return { defaultExpanded: defaultExpanded, data: tmpData }
}

// 将数组装换成字符串类型
export function arrayToString(arr) {
  if (Object.prototype.toString.call(arr) !== '[object Array]') {
    return
  }
  const length = arr.length
  if (length === 0) {
    return ''
  } else {
    return JSON.stringify(arr)
  }
}

export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (('' + time).length === 10) time = parseInt(time) * 1000
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

export function formatTime(time, option) {
  time = +time * 1000
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

export function getUrlParam(name) {
  const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
  const r = window.location.search.substr(1).match(reg)
  if (r !== null) {
    return unescape(r[2])
  }
  return null
}
