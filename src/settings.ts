interface ISettings {
    /**
     * 网站标题
     */
    title: string

    /**
     * 是否显示面包屑
     */
    tagsView: boolean

    /**
     * 是否固定头部
     */
    fixedHeader: boolean

    /**
     * 记住密码状态下的token在Cookie中存储的天数，默认1天
     */
    tokenCookieExpires: number

    /**
     * 记住密码状态下的密码在Cookie中存储的天数，默认1天s
     */
    passCookieExpires: number

    /**
     * 是否只保持一个子菜单的展开
     */
    uniqueOpened: boolean

    /**
     * token存储的标识
     */
    tokenKey: string

    /**
     * 请求超时时间，毫秒（默认2分钟）
     */
    timeout: number

    /**
     * 是否显示logo
     */
    sidebarLogo: boolean

    /**
     * 是否显示设置的底部信息
     */
    showFooter: boolean

    /**
     * 底部文字，支持html语法
     */
    footerTxt: string

    /**
     * 备案号
     */
    caseNumber: string
}

const settings: ISettings = {
    title: "Bortus数据平台",
    tagsView: true,
    fixedHeader: true,
    tokenCookieExpires: 1,
    passCookieExpires: 1,
    uniqueOpened: true,
    tokenKey: "ORVILLEX-TOEKN",
    timeout: 1200000,
    sidebarLogo: true,
    showFooter: true,
    footerTxt: "© 2020 OrvilleX <a href='http://www.orvillex.com' target='_blank'>奥维尔智能物联</a>",
    caseNumber: "苏ICP备2020064536号"
}

export default settings;