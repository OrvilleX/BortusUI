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
        {"component":"system/job/index.vue","meta":{"icon":"Steve-Jobs","noCache":true,"title":"岗位管理","hidden":false},"name":"Job","path":"job"},
        {"component":"system/dict/index.vue","meta":{"icon":"dictionary","noCache":true,"title":"字典管理","hidden":false},"name":"Dict","path":"dict"},
        {"component":"system/timing/index.vue","meta":{"icon":"timing","noCache":true,"title":"任务调度","hidden":false},"name":"Timing","path":"timing"}],
        "component":"Layout","meta":{"icon":"system","noCache":true,"title":"系统管理","hidden":false},"name":"系统管理","path":"/system","redirect":"noredirect"},
        {"alwaysShow":true,"children":[{"component":"monitor/online/index","meta":{"icon":"Steve-Jobs","noCache":true,"title":"在线用户","hidden":false},"name":"OnlineUser","path":"online"},
        {"component":"monitor/log/index.vue","meta":{"icon":"log","noCache":false,"title":"操作日志","hidden":false},"name":"Log","path":"logs"},
        {"component":"monitor/log/errorLog.vue","meta":{"icon":"error","noCache":true,"title":"异常日志","hidden":false},"name":"ErrorLog","path":"errorLog"},
        {"component":"monitor/server/index.vue","meta":{"icon":"codeConsole","noCache":true,"title":"服务监控","hidden":false},"name":"ServerMonitor","path":"server"},
        {"component":"monitor/sql/index.vue","meta":{"icon":"sqlMonitor","noCache":true,"title":"SQL监控","hidden":true},"name":"Sql","path":"druid"}],
        "component":"Layout","meta":{"icon":"monitor","noCache":true,"title":"系统监控","hidden":false},"name":"系统监控","path":"/monitor","redirect":"noredirect"},
        {"alwaysShow":true,"children":[{"component":"mnt/server/index.vue","meta":{"icon":"server","noCache":true,"title":"服务器","hidden":false},"name":"ServerDeploy","path":"mnt/serverDeploy"},
        {"component":"mnt/app/index.vue","meta":{"icon":"app","noCache":true,"title":"应用管理","hidden":false},"name":"App","path":"mnt/app"},
        {"component":"mnt/deploy/index.vue","meta":{"icon":"deploy","noCache":true,"title":"部署管理","hidden":false},"name":"Deploy","path":"mnt/deploy"},
        {"component":"mnt/deployHistory/index.vue","meta":{"icon":"backup","noCache":true,"title":"部署备份","hidden":false},"name":"DeployHistory","path":"mnt/deployHistory"},
        {"component":"mnt/database/index.vue","meta":{"icon":"database","noCache":true,"title":"数据库管理","hidden":false},"name":"Database","path":"mnt/database"}],
        "component":"Layout","meta":{"icon":"mnt","noCache":true,"title":"运维管理","hidden":false},"name":"Mnt","path":"/mnt","redirect":"noredirect"},
        {"alwaysShow":true,"children":[{"component":"generator/index.vue","meta":{"icon":"dev","noCache":false,"title":"代码生成","hidden":false},"name":"GeneratorIndex","path":"generator"},
        {"component":"generator/config.vue","meta":{"icon":"dev","noCache":false,"title":"生成配置","hidden":true},"name":"GeneratorConfig","path":"generator/config/:tableName"},
        {"component":"tools/storage/index.vue","meta":{"icon":"qiniu","noCache":true,"title":"存储管理","hidden":false},"name":"Storage","path":"storage"},
        {"component":"tools/email/index.vue","meta":{"icon":"email","noCache":true,"title":"邮件工具","hidden":false},"name":"Email","path":"email"},
        {"component":"tools/swagger/index.vue","meta":{"icon":"swagger","noCache":true,"title":"接口文档","hidden":true},"name":"Swagger","path":"swagger2"},
        {"component":"tools/aliPay/index.vue","meta":{"icon":"alipay","noCache":true,"title":"支付宝工具","hidden":false},"name":"AliPay","path":"aliPay"},
        {"component":"generator/preview.vue","meta":{"icon":"java","noCache":false,"title":"生成预览","hidden":true},"name":"Preview","path":"generator/preview/:tableName"}],
        "component":"Layout","meta":{"icon":"sys-tools","noCache":true,"title":"系统工具","hidden":false},"name":"系统工具","path":"/sys-tools","redirect":"noredirect"},
        {"alwaysShow":true,"children":[{"component":"components/Echarts.vue","meta":{"icon":"chart","noCache":false,"title":"图表库","hidden":false},"name":"Echarts","path":"echarts"},
        {"component":"components/icons/index.vue","meta":{"icon":"icon","noCache":true,"title":"图标库","hidden":false},"name":"Icons","path":"icon"},
        {"component":"components/Editor","meta":{"icon":"fwb","noCache":true,"title":"富文本","hidden":false},"name":"Editor","path":"tinymce"},
        {"component":"components/MarkDown","meta":{"icon":"markdown","noCache":true,"title":"Markdown","hidden":false},"name":"Markdown","path":"markdown"},
        {"component":"components/YamlEdit","meta":{"icon":"dev","noCache":true,"title":"Yaml编辑器","hidden":false},"name":"YamlEdit","path":"yaml"}],
        "component":"Layout","meta":{"icon":"zujian","noCache":true,"title":"组件管理","hidden":false},"name":"组件管理","path":"/components","redirect":"noredirect"},
        {"alwaysShow":true,"children":[{"alwaysShow":true,"children":[{"component":"nested/menu1/menu1-1","meta":{"icon":"menu","noCache":false,"title":"三级菜单1","hidden":false},"name":"Test","path":"menu1-1"},
        {"component":"nested/menu1/menu1-2","meta":{"icon":"menu","noCache":true,"title":"三级菜单2","hidden":false},"name":"三级菜单2","path":"menu1-2"}],
        "component":"ParentView","meta":{"icon":"menu","noCache":true,"title":"二级菜单1","hidden":false},"name":"二级菜单1","path":"menu1","redirect":"noredirect"},
        {"component":"nested/menu2/index","meta":{"icon":"menu","noCache":true,"title":"二级菜单2","hidden":false},"name":"二级菜单2","path":"menu2"}],
        "component":"Layout","meta":{"icon":"menu","noCache":true,"title":"多级菜单","hidden":false},"name":"多级菜单","path":"/nested","redirect":"noredirect"}]
    
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