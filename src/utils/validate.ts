export const isExternal = (path: string) => {
  return /^(https?:|mailto:|tel:)/.test(path)
}

export const validUsername = (str: string) => {
  const validMap = ['admin', 'editor']
  return validMap.indexOf(str.trim()) >= 0
}

export const validURL = (url: string) => {
  const reg = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return reg.test(url)
}

export const validLowerCase = (str: string) => {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

export const validUpperCase = (str: string) => {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

export const validAlphabets = (str: string) => {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

export const validEmail = (email: string) => {
  // eslint-disable-next-line no-useless-escape
  const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return reg.test(email)
}

export const isvalidPhone = (phone: string) => {
  const reg = /^1([38][0-9]|4[014-9]|[59][0-35-9]|6[2567]|7[0-8])\d{8}$/
  return reg.test(phone)
}

export const isString = (str: any) => {
  if (typeof str === 'string' || str instanceof String) {
    return true
  }
  return false
}

export const isArray = (arg: any) => {
  if (typeof Array.isArray === 'undefined') {
    return Object.prototype.toString.call(arg) === '[object Array]'
  }
  return Array.isArray(arg)
}

/**
 * 是否合法IP地址
 */
export const validateIP = (value: string, callback: (err?: Error) => void) => {
  if (value === '' || value === undefined || value == null) {
    callback()
  } else {
    const reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
    if ((!reg.test(value)) && value !== '') {
      callback(new Error('请输入正确的IP地址'))
    } else {
      callback()
    }
  }
}

/**
 * 是否手机号码或者固话
 */
export const validatePhoneTwo = (value: string, callback: (err?: Error) => void) => {
  const reg = /^((0\d{2,3}-\d{7,8})|(1([38][0-9]|4[014-9]|[59][0-35-9]|6[2567]|7[0-8])\d{8}))$/
  if (value === '' || value === undefined || value == null) {
    callback()
  } else {
    if ((!reg.test(value)) && value !== '') {
      callback(new Error('请输入正确的电话号码或者固话号码'))
    } else {
      callback()
    }
  }
}

/**
 * 是否固话
 */
export const validateTelephone = (value: string, callback: (err?: Error) => void) => {
  const reg = /0\d{2}-\d{7,8}/
  if (value === '' || value === undefined || value == null) {
    callback()
  } else {
    if ((!reg.test(value)) && value !== '') {
      callback(new Error('请输入正确的固话（格式：区号+号码,如010-1234567）'))
    } else {
      callback()
    }
  }
}

/**
 * 是否手机号码
 */
export const validatePhone = (value: string, callback: (err?: Error) => void) => {
  const reg = /^1([38][0-9]|4[014-9]|[59][0-35-9]|6[2567]|7[0-8])\d{8}$/
  if (value === '' || value === undefined || value == null) {
    callback()
  } else {
    if ((!reg.test(value)) && value !== '') {
      callback(new Error('请输入正确的电话号码'))
    } else {
      callback()
    }
  }
}

/**
 * 是否身份证号码
 */
export const validateIdNo = (value: string, callback: (err?: Error) => void) => {
  const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
  if (value === '' || value === undefined || value == null) {
    callback()
  } else {
    if ((!reg.test(value)) && value !== '') {
      callback(new Error('请输入正确的身份证号码'))
    } else {
      callback()
    }
  }
}
