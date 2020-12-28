import faker from 'faker'
import { Response, Request, Router } from 'express'
import { MenuDtoData, MenuData } from '../src/types/menu'
import { PageableBody } from '../src/types/base'

let router = Router()

router.get('/build', (req: Request, res: Response) => {
    let menus: MenuDtoData[] = [{"alwaysShow":true,"children":[
        {"component":"system/user/Index.vue","meta":{"icon":"peoples","noCache":true,"title":"用户管理","hidden":false},"name":"User","path":"user"},
        {"component":"system/role/Index.vue","meta":{"icon":"role","noCache":true,"title":"角色管理","hidden":false},"name":"Role","path":"role"},
        {"component":"system/menu/Index.vue","meta":{"icon":"menu","noCache":true,"title":"菜单管理","hidden":false},"name":"Menu","path":"menu"},
        {"component":"system/dept/Index.vue","meta":{"icon":"dept","noCache":true,"title":"部门管理","hidden":false},"name":"Dept","path":"dept"},
        {"component":"system/job/Index.vue","meta":{"icon":"Steve-Jobs","noCache":true,"title":"岗位管理","hidden":false},"name":"Job","path":"job"},
        {"component":"system/dict/Index.vue","meta":{"icon":"dictionary","noCache":true,"title":"字典管理","hidden":false},"name":"Dict","path":"dict"},
        {"component":"system/timing/Index.vue","meta":{"icon":"timing","noCache":true,"title":"任务调度","hidden":false},"name":"Timing","path":"timing"}],
        "component":"Layout","meta":{"icon":"system","noCache":true,"title":"系统管理","hidden":false},"name":"系统管理","path":"/system","redirect":"noredirect"},
        {"alwaysShow":true,"children":[{"component":"monitor/online/Index.vue","meta":{"icon":"Steve-Jobs","noCache":true,"title":"在线用户","hidden":false},"name":"OnlineUser","path":"online"},
        {"component":"monitor/log/Index.vue","meta":{"icon":"log","noCache":false,"title":"操作日志","hidden":false},"name":"Log","path":"logs"},
        {"component":"monitor/log/ErrorLog.vue","meta":{"icon":"error","noCache":true,"title":"异常日志","hidden":false},"name":"ErrorLog","path":"errorLog"}],
        "component":"Layout","meta":{"icon":"monitor","noCache":true,"title":"系统监控","hidden":false},"name":"系统监控","path":"/monitor","redirect":"noredirect"},
        {"alwaysShow":true,"children":[{"component":"tools/email/Index.vue","meta":{"icon":"email","noCache":true,"title":"邮件工具","hidden":false},"name":"Email","path":"email"}],
        "component":"Layout","meta":{"icon":"sys-tools","noCache":true,"title":"系统工具","hidden":false},"name":"系统工具","path":"/sys-tools","redirect":"noredirect"},
        {"alwaysShow":true,"children":[{"component":"components/Echarts.vue","meta":{"icon":"chart","noCache":false,"title":"图表库","hidden":false},"name":"Echarts","path":"echarts"},
        {"component":"components/icons/Index.vue","meta":{"icon":"icon","noCache":true,"title":"图标库","hidden":false},"name":"Icons","path":"icon"},
        {"component":"components/Editor.vue","meta":{"icon":"fwb","noCache":true,"title":"富文本","hidden":false},"name":"Editor","path":"tinymce"},
        {"component":"components/MarkDown.vue","meta":{"icon":"markdown","noCache":true,"title":"Markdown","hidden":false},"name":"Markdown","path":"markdown"}],
        "component":"Layout","meta":{"icon":"zujian","noCache":true,"title":"组件管理","hidden":false},"name":"组件管理","path":"/components","redirect":"noredirect"}]
    
    res.json(menus)
})

router.get('/lazy', (req: Request, res: Response<MenuDtoData[]>) => {
    let datas: MenuDtoData[] = [{"cache":false,"createTime":"2018-12-18 15:11:29","hasChildren":true,"hidden":false,"iFrame":false,"icon":"system","id":1,"label":"系统管理","leaf":false,"menuSort":1,"path":"system","subCount":7,"title":"系统管理","type":0},
    {"cache":false,"createTime":"2018-12-18 15:17:48","hasChildren":true,"hidden":false,"iFrame":false,"icon":"monitor","id":6,"label":"系统监控","leaf":false,"menuSort":10,"path":"monitor","subCount":5,"title":"系统监控","type":0},{"cache":false,"createTime":"2018-12-19 13:38:16","hasChildren":true,"hidden":false,"iFrame":false,"icon":"zujian","id":10,"label":"组件管理","leaf":false,"menuSort":50,"path":"components","subCount":5,"title":"组件管理","type":0},
    {"cache":false,"component":"","createTime":"2019-01-04 16:22:03","hasChildren":true,"hidden":false,"iFrame":false,"icon":"menu","id":21,"label":"多级菜单","leaf":false,"menuSort":900,"path":"nested","subCount":2,"title":"多级菜单","type":0,"updateTime":"2020-06-21 17:27:35","updatedBy":"admin"},
    {"cache":false,"component":"","createTime":"2019-03-29 10:57:35","hasChildren":true,"hidden":false,"iFrame":false,"icon":"sys-tools","id":36,"label":"系统工具","leaf":false,"menuSort":30,"path":"sys-tools","subCount":7,"title":"系统工具","type":0},
    {"cache":false,"component":"","componentName":"Mnt","createTime":"2019-11-09 10:31:08","hasChildren":true,"hidden":false,"iFrame":false,"icon":"mnt","id":90,"label":"运维管理","leaf":false,"menuSort":20,"path":"mnt","subCount":5,"title":"运维管理","type":1}]

    res.json(datas)
})

router.get('/', (req: Request, res: Response<PageableBody<MenuDtoData>>) => {
    let datas: MenuDtoData[] = [{"cache":false,"createTime":"2018-12-18 15:11:29","hasChildren":true,"hidden":false,"iFrame":false,"icon":"system","id":1,"label":"系统管理","leaf":false,"menuSort":1,"path":"system","subCount":7,"title":"系统管理","type":0},
    {"cache":false,"createTime":"2018-12-18 15:17:48","hasChildren":true,"hidden":false,"iFrame":false,"icon":"monitor","id":6,"label":"系统监控","leaf":false,"menuSort":10,"path":"monitor","subCount":5,"title":"系统监控","type":0},
    {"cache":false,"component":"","componentName":"Mnt","createTime":"2019-11-09 10:31:08","hasChildren":true,"hidden":false,"iFrame":false,"icon":"mnt","id":90,"label":"运维管理","leaf":false,"menuSort":20,"path":"mnt","subCount":5,"title":"运维管理","type":1},
    {"cache":false,"component":"","createTime":"2019-03-29 10:57:35","hasChildren":true,"hidden":false,"iFrame":false,"icon":"sys-tools","id":36,"label":"系统工具","leaf":false,"menuSort":30,"path":"sys-tools","subCount":7,"title":"系统工具","type":0},
    {"cache":false,"createTime":"2018-12-19 13:38:16","hasChildren":true,"hidden":false,"iFrame":false,"icon":"zujian","id":10,"label":"组件管理","leaf":false,"menuSort":50,"path":"components","subCount":5,"title":"组件管理","type":0},
    {"cache":false,"component":"","createTime":"2019-01-04 16:22:03","hasChildren":true,"hidden":false,"iFrame":false,"icon":"menu","id":21,"label":"多级菜单","leaf":false,"menuSort":900,"path":"nested","subCount":2,"title":"多级菜单","type":0,"updateTime":"2020-06-21 17:27:35","updatedBy":"admin"}]

    res.json({
        totalElements: datas.length,
        content: datas
    })
})

router.post('/', (req: Request, res: Response) => {
    let data = req.body as MenuData
    if (data.cache && data.hidden && data.iFrame && data.icon && data.path && data.title && data.type) {
        res.json({
            ok: 'ok'
        })
    } else {
        res.json({
            ok: 'no'
        })
    }
})

router.post('/superior', (req: Request, res: Response<MenuDtoData[]>) => {
    let ids = req.body as number[]
    
    res.json([{"cache":false,"createTime":"2018-12-18 15:11:29","hasChildren":true,"hidden":false,"iFrame":false,"icon":"system","id":1,"label":"系统管理","leaf":false,"menuSort":1,"path":"system","subCount":7,"title":"系统管理","type":0},
    {"cache":false,"createTime":"2018-12-18 15:17:48","hasChildren":true,"hidden":false,"iFrame":false,"icon":"monitor","id":6,"label":"系统监控","leaf":false,"menuSort":10,"path":"monitor","subCount":5,"title":"系统监控","type":0},
    {"cache":false,"createTime":"2018-12-19 13:38:16","hasChildren":true,"hidden":false,"iFrame":false,"icon":"zujian","id":10,"label":"组件管理","leaf":false,"menuSort":50,"path":"components","subCount":5,"title":"组件管理","type":0},
    {"cache":false,"component":"","createTime":"2019-01-04 16:22:03","hasChildren":true,"hidden":false,"iFrame":false,"icon":"menu","id":21,"label":"多级菜单","leaf":false,"menuSort":900,"path":"nested","subCount":2,"title":"多级菜单","type":0,"updateTime":"2020-06-21 17:27:35","updatedBy":"admin"},
    {"cache":false,"component":"","createTime":"2019-03-29 10:57:35","hasChildren":true,"hidden":false,"iFrame":false,"icon":"sys-tools","id":36,"label":"系统工具","leaf":false,"menuSort":30,"path":"sys-tools","subCount":7,"title":"系统工具","type":0},
    {"cache":false,"component":"","componentName":"Mnt","createTime":"2019-11-09 10:31:08","hasChildren":true,"hidden":false,"iFrame":false,"icon":"mnt","id":90,"label":"运维管理","leaf":false,"menuSort":20,"path":"mnt","subCount":5,"title":"运维管理","type":1}])
})

router.put('/', (req: Request, res: Response) => {
    let data = req.body as MenuData
    if (data.id) {
        res.json({
            ok: 'ok'
        })
    } else {
        res.json({
            ok: 'no'
        })
    }
})

router.delete('/', (req: Request, res: Response) => {
    let ids = req.body as number[]
    if (ids && ids.length > 0) {
        res.json({
            ok: 'ok'
        })
    } else {
        res.json({
            ok: 'no'
        })
    }
})

export default router;