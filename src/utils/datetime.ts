const SECOND_MILLS = 1000,
    HOUR_SECS = 3600,
    DAY_SECS = 86400;
const ZONE_HOURS = 8;

Date.prototype.toMidnight = function () {
    this.setHours(0)
    this.setMinutes(0)
    this.setSeconds(0)
    this.setMilliseconds(0)
    return this
}

Date.prototype.daysAgo = function (days, midnight) {
    days = days ? days - 0 : 0
    const date = new Date(this.getTime() - days * 8.64E7)
    return midnight ? date.toMidnight() : date
}

Date.prototype.monthBegin = function (offset = 0) {
    const days = this.getDate() - 1 - offset
    return this.daysAgo(days, true)
}

Date.prototype.quarterBegin = function () {
    const month = this.getMonth() - this.getMonth() % 3
    return new Date(this.getFullYear(), month, 1).toMidnight()
}

Date.prototype.yearBegin = function () {
    return new Date(this.getFullYear(), 0, 1).toMidnight()
}

Date.prototype.strftime = function (format, local) {
    if (!format) {
        const str = new Date(this.getTime() + 2.88E7).toISOString()
        return str.substr(0, 16).replace('T', ' ')
    }
    local = local && local.startsWith('zh') ? 'zh' : 'en'
    const padZero = function (str: string, len: number) {
        const pads = len - str.toString().length
        return (pads && pads > 0 ? '0'.repeat(pads) : '') + str
    }
    format = format.replace('%F', '%Y-%m-%d')
    format = format.replace(/%D|%x/, '%m/%d/%y')
    format = format.replace(/%T|%X/, '%H:%M:%S')
    format = format.replace('%R', '%H:%M')
    format = format.replace('%r', '%H:%M:%S %p')
    format = format.replace('%c', '%a %b %e %H:%M:%S %Y')
    return format.replace(/%[A-Za-z%]/g, (f) => {
        let ans: string | number = f
        switch (f) {
            case '%%':
                ans = '%'
                break

            case '%Y':
            case '%G':
                ans = this.getFullYear()
                break

            case '%y':
                ans = this.getFullYear() % 100
                break

            case '%C':
                ans = this.getFullYear() / 100
                break

            case '%m':
            case '%n':
                ans = this.getMonth() + 1
                break

            case '%B':
                local = local.startsWith('en') ? 'english' : local

            case '%b':
                const m = this.getMonth()
                ans = local_labels.monthes[local][m]
                break

            case '%d':
            case '%e':
                ans = this.getDate()
                break

            case '%j':
                ans = this.getDaysOfYear()
                break

            case '%U':
            case '%W':
                const ws = this.getWeeksOfYear(f === '%W')
                ans = padZero(ws.toString(), 2)
                break

            case '%w':
                ans = this.getDay()

            case '%u':
                ans = ans === 0 ? 7 : ans
                break

            case '%A':
                local = local.startsWith('en') ? 'english' : local

            case '%a':
                const d = this.getDay()
                ans = local_labels.weekdays[local][d]
                break

            case '%H':
            case '%k':
                ans = this.getHours()
                break

            case '%I':
            case '%l':
                ans = this.getHours()
                ans = ans % 12
                break

            case '%M':
                ans = this.getMinutes()
                break

            case '%S':
                ans = this.getSeconds()
                break

            case '%s':
                ans = this.getTime() / 1E3
                break

            case '%f':
                const ms = this.getMilliseconds()
                ans = padZero((ms * 1E3).toString(), 6)
                break

            case '%P':
                local = local.startsWith('en') ? 'english' : local

            case '%p':
                const h = this.getHours()
                ans = local_labels.meridians[local][h < 12 ? 0 : 1]
                break

            case '%z':
                let tzo = this.getTimezoneOffset()
                const sign = tzo < 0 ? '-' : '+'
                tzo = Math.abs(tzo)
                const ho = padZero((tzo / 60).toString(), 2)
                const mo = padZero((tzo % 60).toString(), 2)
                ans = sign + ho + mo
                break

            default:
                break
        }
        if (f === '%C' || f === '%y' || f === '%m' || f === '%d' || f === '%H' || f === '%M' || f === '%S') {
            ans = padZero(ans.toString(), 2)
        }
        return ans.toString()
    })
}

Date.prototype.humanize = function (local) {
    local = local && local.startsWith('zh') ? 'zh' : 'en'
    const result = this.strftime('', local)
    const days = (Date.today() - this.toMidnight().getTime()) / 8.64E7
    if (days <= -10 || days >= 10) {
        return result
    }
    const labels = local_labels.dayagos[local]
    let lbl = ''
    if (days === 0 || days === 1) {
        lbl = labels[days]
    } else if (days === -1) {
        lbl = labels[2]
    } else if (days >= 2) {
        lbl = days + labels[3]
    } else {
        lbl = days + labels[4]
    }
    return lbl + result.substr(10, 6)
}

const local_labels = {
    monthes: {
        english: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        zh: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
    },
    weekdays: {
        english: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        zh: ['日', '一', '二', '三', '四', '五', '六']
    },
    meridians: {
        english: ['a.m.', 'p.m.'],
        en: ['AM', 'PM'],
        zh: ['上午', '下午']
    },
    dayagos: {
        english: ['Today', 'Yesterday', 'Tomorrow', ' days ago', ' days late'],
        en: ['Today', 'Yesterday', 'Tomorrow', ' days ago', ' days late'],
        zh: ['今天', '昨天', '明天', '天前', '天后']
    }
}

Date.prototype.getDaysOfYear = function () {
    let first_day = new Date(this.getFullYear(), 0, 1);
    let micro_secs = this.getTime() - first_day.getTime();
    return micro_secs / DAY_SECS + 1;
}

Date.prototype.getWeeksOfYear = function (start) {
    var offset = this.getDaysOfYear() - 1;
    var remain = offset % 7;
    if (remain > 0) {
        var first_day = new Date(this.getFullYear(), 0, 1);
        if (start) {
            offset += (first_day.getDay() + 6) % 7;
        } else {
            offset += first_day.getDay();
        }
    }
    return offset / 7;
}

Date.today = function () {
    var time = new Date();
    time.toNow().toMidnight();
    return time.getTime();
};

Date.prototype.toNow = function () {
    this.setTime(Date.now());
    return this;
};

export default Date
