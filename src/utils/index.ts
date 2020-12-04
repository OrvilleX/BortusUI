import defaultSettings from '@/settings';

export const getPageTitle = (pageTitle: string) => {
    if (pageTitle) {
        return `${pageTitle} - ${defaultSettings.title}`
    }
    return `${defaultSettings.title}`
}

export const openWindow = (url: string, title: string, w: number, h: number) => {
    const dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : (screen as any).left
    const dualScreenTop = window.screenTop !== undefined ? window.screenTop : (screen as any).top

    const width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width
    const height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height

    const left = ((width / 2) - (w / 2)) + dualScreenLeft
    const top = ((height / 2) - (h / 2)) + dualScreenTop
    const newWindow = window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=yes, copyhistory=no, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left)

    newWindow?.focus()
}

/**
 * 格式化日期
 * @param time 支持各类格式时间
 * @param cFormat 格式化字符串
 */
export const parseTime = (time: object | string | number, cFormat?: string) => {
    const format = cFormat || "{y}-{m}-{d} {h}:{i}:{s}";
    let date: Date;
    if (typeof time === "undefined" || time === null || time === "null") {
        return "";
    } else if (typeof time === "object") {
        date = time as Date;
    } else {
        if ((typeof time === "string") && (/^[0-9]+$/.test(time))) {
            time = parseInt(time);
        }
        if ((typeof time === "number") && (time.toString().length === 10)) {
            time = time * 1000;
        }
        date = new Date(time);
    }
    const formatObj = new Map([
        ["y", date.getFullYear()],
        ["m", date.getMonth() + 1],
        ["d", date.getDate()],
        ["h", date.getHours()],
        ["i", date.getMinutes()],
        ["s", date.getSeconds()],
        ["a", date.getDay()]
    ]);
    const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key: string) => {
        let value = formatObj.get(key) || 0;
        if (key === "a") {
            return ["日", "一", "二", "三", "四", "五", "六"][value]
        }
        if (result.length > 0 && value < 10) {
            return '0' + value
        }
        return value.toString();
    });
    return time_str;
}

/**
 * 格式化日期
 */
export const formatTime = (time: number, option: string) => {
    if (('' + time).length === 10) {
        time = time * 1000
    } else {
        time = +time
    }
    const d = new Date(time)
    const now = Date.now()

    const diff = (now - d.getTime()) / 1000

    if (diff < 30) {
        return '刚刚'
    } else if (diff < 3600) {
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
            d.getMonth() + 1 + '月' +
            d.getDate() + '日' +
            d.getHours() + '时' +
            d.getMinutes() + '分'
        )
    }
}

/**
 * 通过Url中提取查询字符串部分
 */
export const getQueryObject = (url: string) => {
    url = url == null ? window.location.href : url
    const search = url.substring(url.lastIndexOf('?') + 1)
    const obj = new Map<string, string>();
    const reg = /([^?&=]+)=([^?&=]*)/g
    search.replace(reg, (rs, $1, $2) => {
        const name = decodeURIComponent($1)
        let val = decodeURIComponent($2)
        val = String(val)
        obj.set(name, val);
        return rs
    });
    return obj
}

/**
 * 判断字节长度
 */
export const byteLength = (str: string) => {
    let s = str.length
    for (var i = str.length - 1; i >= 0; i--) {
        const code = str.charCodeAt(i)
        if (code > 0x7f && code <= 0x7ff) s++
        else if (code > 0x7ff && code <= 0xffff) s += 2
        if (code >= 0xDC00 && code <= 0xDFFF) i--
    }
    return s
}

/**
 * 剔除数组中的未定义值
 */
export const cleanArray = (actual: Array<any>) => {
    const newArray = []
    for (let i = 0; i < actual.length; i++) {
        if (actual[i]) {
            newArray.push(actual[i])
        }
    }
    return newArray;
}

/**
 * 将对象拼接为查询字符串
 */
export const param = (json: object) => {
    if (!json) return ''
    return cleanArray(
        Object.keys(json).map(key => {
            if (json[key] === undefined) return ''
            return encodeURIComponent(key) + '=' + encodeURIComponent(json[key])
        })
    ).join('&')
}

/**
 * 将查询字符串转换为对象
 */
export const param2Obj = (url: string) => {
    const search = url.split('?')[1]
    if (!search) {
        return {}
    }
    return JSON.parse(
        '{"' +
        decodeURIComponent(search)
            .replace(/"/g, '\\"')
            .replace(/&/g, '","')
            .replace(/=/g, '":"')
            .replace(/\+/g, ' ') +
        '"}'
    )
}

/**
 * 将html转换为文本
 */
export const html2Text = (val: string) => {
    const div = document.createElement('div')
    div.innerHTML = val
    return div.textContent || div.innerText
}

/**
 * 合并对象
 */
export const objectMerge = (target: object, source: object) => {
    if (typeof target !== 'object') {
        target = {}
    }
    if (Array.isArray(source)) {
        return source.slice()
    }
    Object.keys(source).forEach(property => {
        const sourceProperty = source[property]
        if (typeof sourceProperty === 'object') {
            target[property] = objectMerge(target[property], sourceProperty)
        } else {
            target[property] = sourceProperty
        }
    })
    return target
}

/**
 * 对页面元素附加CSS类
 */
export const toggleClass = (element: Element, className: string) => {
    if (!element || !className) {
        return
    }
    let classString = element.className
    const nameIndex = classString.indexOf(className)
    if (nameIndex === -1) {
        classString += '' + className
    } else {
        classString =
            classString.substr(0, nameIndex) +
            classString.substr(nameIndex + className.length)
    }
    element.className = classString
}

export const getTime = (type: string) => {
    if (type === 'start') {
        return new Date().getTime() - 3600 * 1000 * 24 * 90
    } else {
        return new Date(new Date().toDateString())
    }
}

/**
 * 深度复制
 */
export const deepClone = (source: object) => {
    if (!source && typeof source !== "object") {
        throw new Error("error arguments");
    }
    const targetObj = source.constructor === Array ? [] : {}
    Object.keys(source).forEach(keys => {
        if (source[keys] && typeof source[keys] === 'object') {
            targetObj[keys] = deepClone(source[keys])
        } else {
            targetObj[keys] = source[keys]
        }
    })
    return targetObj
}

/**
 * 去除数组中重复的值
 */
export const uniqueArr = (arr: Array<any>) => {
    return Array.from(new Set(arr))
}

/**
 * 创建随机字符串
 */
export const createUniqueString = () => {
    const timestamp = +new Date() + ''
    const randomNum = (1 + Math.random()) * 65536 + ''
    return (+(randomNum + timestamp)).toString(32)
}

/**
 * 判断元素是否存在对应CSS类
 */
export const hasClass = (ele: Element, cls: string) => {
    return !!ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'))
}

/**
 * 为元素增加CSS类
 */
export const addClass = (ele: Element, cls: string) => {
    if (!hasClass(ele, cls)) ele.className += ' ' + cls
}

/**
 * 从元素中移除CSS类
 */
export const removeClass = (ele: Element, cls: string) => {
    if (hasClass(ele, cls)) {
        const reg = new RegExp('(\\s|^)' + cls + '(\\s|$)')
        ele.className = ele.className.replace(reg, ' ')
    }
}

/**
 * 替换邮箱字符
 */
export const regEmail = (email: string) => {
    let newEmail = null;
    if (String(email).indexOf('@') > 0) {
        const str = email.split('@')
        let _s = ''
        if (str[0].length > 3) {
            for (var i = 0; i < str[0].length - 3; i++) {
                _s += '*'
            }
        }
        newEmail = str[0].substr(0, 3) + _s + '@' + str[1]
    }
    return newEmail
}

/**
 * 替换手机字符
 */
export const regMobile = (mobile: string) => {
    let newMobile = null;
    if (mobile.length > 7) {
        newMobile = mobile.substr(0, 3) + '****' + mobile.substr(7)
    }
    return newMobile
}

// 下载文件
export const downloadFile = (obj: BlobPart, name: String, suffix: string) => {
    const url = window.URL.createObjectURL(new Blob([obj]))
    const link = document.createElement('a')
    link.style.display = 'none'
    link.href = url
    const fileName = parseTime(new Date()) + '-' + name + '.' + suffix
    link.setAttribute('download', fileName)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}