import { Response, Request, Router } from 'express'
import { PageableBody } from '../src/types/base'
import { RoleDtoData, RoleData } from '../src/types/role'

let router = Router()

router.get('/all', (req: Request, res: Response<RoleDtoData[]>) => {
    let datas: RoleDtoData[] = [{ id:1, level:1, name: '超级管理员' }, { id: 2, level: 2, name: '普通用户' }]

    res.json(datas)
})

router.get('/level', (req: Request, res: Response) => {
    res.json({
        level: 1
    })
})

router.get('/', (req: Request, res: Response<PageableBody<RoleDtoData>>) => {
    let datas: RoleDtoData[] = [{"createTime":"2018-11-23 11:04:37","dataScope":"全部","depts":[],"description":"-","id":1,"level":1,
      "menus":[{"cache":false,"createBy":"admin","createTime":"2020-09-06 17:12:43","hasChildren":false,"hidden":false,"iFrame":false,"id":120,"label":"1","leaf":true,"menuSort":999,"permission":"1","pid":41,"subCount":0,"title":"1","type":2,"updateTime":"2020-09-06 17:12:43","updatedBy":"admin"},
      {"cache":false,"createTime":"2018-12-18 15:11:29","hasChildren":true,"hidden":false,"iFrame":false,"icon":"system","id":1,"label":"系统管理","leaf":false,"menuSort":1,"path":"system","subCount":7,"title":"系统管理","type":0},
      {"cache":false,"component":"system/user/index","componentName":"User","createTime":"2018-12-18 15:14:44","hasChildren":true,"hidden":false,"iFrame":false,"icon":"peoples","id":2,"label":"用户管理","leaf":false,"menuSort":2,"path":"user","permission":"user:list","pid":1,"subCount":3,"title":"用户管理","type":1,"updateTime":"2020-09-06 17:29:33","updatedBy":"admin"},
      {"cache":false,"component":"system/role/index","componentName":"Role","createTime":"2018-12-18 15:16:07","hasChildren":true,"hidden":false,"iFrame":false,"icon":"role","id":3,"label":"角色管理","leaf":false,"menuSort":3,"path":"role","permission":"roles:list","pid":1,"subCount":3,"title":"角色管理","type":1},
      {"cache":false,"component":"system/menu/index","componentName":"Menu","createTime":"2018-12-18 15:17:28","hasChildren":true,"hidden":false,"iFrame":false,"icon":"menu","id":5,"label":"菜单管理","leaf":false,"menuSort":5,"path":"menu","permission":"menu:list","pid":1,"subCount":3,"title":"菜单管理","type":1},
      {"cache":false,"createTime":"2018-12-18 15:17:48","hasChildren":true,"hidden":false,"iFrame":false,"icon":"monitor","id":6,"label":"系统监控","leaf":false,"menuSort":10,"path":"monitor","subCount":5,"title":"系统监控","type":0},
      {"cache":true,"component":"monitor/log/index","componentName":"Log","createTime":"2018-12-18 15:18:26","hasChildren":false,"hidden":false,"iFrame":false,"icon":"log","id":7,"label":"操作日志","leaf":true,"menuSort":11,"path":"logs","pid":6,"subCount":0,"title":"操作日志","type":1,"updateTime":"2020-06-06 13:11:57","updatedBy":"admin"},
      {"cache":false,"createTime":"2018-12-19 13:38:16","hasChildren":true,"hidden":false,"iFrame":false,"icon":"zujian","id":10,"label":"组件管理","leaf":false,"menuSort":50,"path":"components","subCount":5,"title":"组件管理","type":0},
      {"cache":false,"component":"components/icons/index","componentName":"Icons","createTime":"2018-12-19 13:38:49","hasChildren":false,"hidden":false,"iFrame":false,"icon":"icon","id":11,"label":"图标库","leaf":true,"menuSort":51,"path":"icon","pid":10,"subCount":0,"title":"图标库","type":1},
      {"cache":false,"component":"tools/email/index","componentName":"Email","createTime":"2018-12-27 10:13:09","hasChildren":false,"hidden":false,"iFrame":false,"icon":"email","id":14,"label":"邮件工具","leaf":true,"menuSort":35,"path":"email","pid":36,"subCount":0,"title":"邮件工具","type":1},
      {"cache":false,"component":"components/Editor","componentName":"Editor","createTime":"2018-12-27 11:58:25","hasChildren":false,"hidden":false,"iFrame":false,"icon":"fwb","id":15,"label":"富文本","leaf":true,"menuSort":52,"path":"tinymce","pid":10,"subCount":0,"title":"富文本","type":1},
      {"cache":false,"component":"system/timing/index","componentName":"Timing","createTime":"2019-01-07 20:34:40","hasChildren":true,"hidden":false,"iFrame":false,"icon":"timing","id":28,"label":"任务调度","leaf":false,"menuSort":999,"path":"timing","permission":"timing:list","pid":1,"subCount":3,"title":"任务调度","type":1},
      {"cache":false,"component":"monitor/log/errorLog","componentName":"ErrorLog","createTime":"2019-01-13 13:49:03","hasChildren":false,"hidden":false,"iFrame":false,"icon":"error","id":32,"label":"异常日志","leaf":true,"menuSort":12,"path":"errorLog","pid":6,"subCount":0,"title":"异常日志","type":1},
      {"cache":false,"component":"system/dept/index","componentName":"Dept","createTime":"2019-03-25 09:46:00","hasChildren":true,"hidden":false,"iFrame":false,"icon":"dept","id":35,"label":"部门管理","leaf":false,"menuSort":6,"path":"dept","permission":"dept:list","pid":1,"subCount":3,"title":"部门管理","type":1},
      {"cache":false,"component":"","createTime":"2019-03-29 10:57:35","hasChildren":true,"hidden":false,"iFrame":false,"icon":"sys-tools","id":36,"label":"系统工具","leaf":false,"menuSort":30,"path":"sys-tools","subCount":7,"title":"系统工具","type":0},
      {"cache":false,"component":"system/job/index","componentName":"Job","createTime":"2019-03-29 13:51:18","hasChildren":true,"hidden":false,"iFrame":false,"icon":"Steve-Jobs","id":37,"label":"岗位管理","leaf":false,"menuSort":7,"path":"job","permission":"job:list","pid":1,"subCount":3,"title":"岗位管理","type":1},
      {"cache":false,"component":"system/dict/index","componentName":"Dict","createTime":"2019-04-10 11:49:04","hasChildren":true,"hidden":false,"iFrame":false,"icon":"dictionary","id":39,"label":"字典管理","leaf":false,"menuSort":8,"path":"dict","permission":"dict:list","pid":1,"subCount":3,"title":"字典管理","type":1},
      {"cache":false,"component":"monitor/online/index","componentName":"OnlineUser","createTime":"2019-10-26 22:08:43","hasChildren":true,"hidden":false,"iFrame":false,"icon":"Steve-Jobs","id":41,"label":"在线用户","leaf":false,"menuSort":10,"path":"online","pid":6,"subCount":1,"title":"在线用户","type":1}]}]

      res.json({
          totalElements: datas.length,
          content: datas
      })
})

router.put('/menu', (req: Request, res: Response) => {
    let data = req.body as RoleData
    if (data.id && data.menus && data.menus.length > 0) {
        res.json({
            ok: 'ok'
        })
    } else {
        res.json({
            ok: 'no'
        })
    }
})

router.get('/:id', (req: Request, res: Response<RoleDtoData>) => {
    res.json({"createTime":"2018-11-23 11:04:37","dataScope":"全部","depts":[],"description":"-","id":1,"level":1,
    "menus":[{"cache":false,"createBy":"admin","createTime":"2020-09-06 17:12:43","hasChildren":false,"hidden":false,"iFrame":false,"id":120,"label":"1","leaf":true,"menuSort":999,"permission":"1","pid":41,"subCount":0,"title":"1","type":2,"updateTime":"2020-09-06 17:12:43","updatedBy":"admin"},
    {"cache":false,"createTime":"2018-12-18 15:11:29","hasChildren":true,"hidden":false,"iFrame":false,"icon":"system","id":1,"label":"系统管理","leaf":false,"menuSort":1,"path":"system","subCount":7,"title":"系统管理","type":0},
    {"cache":false,"component":"system/user/index","componentName":"User","createTime":"2018-12-18 15:14:44","hasChildren":true,"hidden":false,"iFrame":false,"icon":"peoples","id":2,"label":"用户管理","leaf":false,"menuSort":2,"path":"user","permission":"user:list","pid":1,"subCount":3,"title":"用户管理","type":1,"updateTime":"2020-09-06 17:29:33","updatedBy":"admin"},
    {"cache":false,"component":"system/role/index","componentName":"Role","createTime":"2018-12-18 15:16:07","hasChildren":true,"hidden":false,"iFrame":false,"icon":"role","id":3,"label":"角色管理","leaf":false,"menuSort":3,"path":"role","permission":"roles:list","pid":1,"subCount":3,"title":"角色管理","type":1},
    {"cache":false,"component":"system/menu/index","componentName":"Menu","createTime":"2018-12-18 15:17:28","hasChildren":true,"hidden":false,"iFrame":false,"icon":"menu","id":5,"label":"菜单管理","leaf":false,"menuSort":5,"path":"menu","permission":"menu:list","pid":1,"subCount":3,"title":"菜单管理","type":1},
    {"cache":false,"createTime":"2018-12-18 15:17:48","hasChildren":true,"hidden":false,"iFrame":false,"icon":"monitor","id":6,"label":"系统监控","leaf":false,"menuSort":10,"path":"monitor","subCount":5,"title":"系统监控","type":0},
    {"cache":true,"component":"monitor/log/index","componentName":"Log","createTime":"2018-12-18 15:18:26","hasChildren":false,"hidden":false,"iFrame":false,"icon":"log","id":7,"label":"操作日志","leaf":true,"menuSort":11,"path":"logs","pid":6,"subCount":0,"title":"操作日志","type":1,"updateTime":"2020-06-06 13:11:57","updatedBy":"admin"},
    {"cache":false,"createTime":"2018-12-19 13:38:16","hasChildren":true,"hidden":false,"iFrame":false,"icon":"zujian","id":10,"label":"组件管理","leaf":false,"menuSort":50,"path":"components","subCount":5,"title":"组件管理","type":0},
    {"cache":false,"component":"components/icons/index","componentName":"Icons","createTime":"2018-12-19 13:38:49","hasChildren":false,"hidden":false,"iFrame":false,"icon":"icon","id":11,"label":"图标库","leaf":true,"menuSort":51,"path":"icon","pid":10,"subCount":0,"title":"图标库","type":1},
    {"cache":false,"component":"tools/email/index","componentName":"Email","createTime":"2018-12-27 10:13:09","hasChildren":false,"hidden":false,"iFrame":false,"icon":"email","id":14,"label":"邮件工具","leaf":true,"menuSort":35,"path":"email","pid":36,"subCount":0,"title":"邮件工具","type":1},
    {"cache":false,"component":"components/Editor","componentName":"Editor","createTime":"2018-12-27 11:58:25","hasChildren":false,"hidden":false,"iFrame":false,"icon":"fwb","id":15,"label":"富文本","leaf":true,"menuSort":52,"path":"tinymce","pid":10,"subCount":0,"title":"富文本","type":1},
    {"cache":false,"component":"system/timing/index","componentName":"Timing","createTime":"2019-01-07 20:34:40","hasChildren":true,"hidden":false,"iFrame":false,"icon":"timing","id":28,"label":"任务调度","leaf":false,"menuSort":999,"path":"timing","permission":"timing:list","pid":1,"subCount":3,"title":"任务调度","type":1},
    {"cache":false,"component":"monitor/log/errorLog","componentName":"ErrorLog","createTime":"2019-01-13 13:49:03","hasChildren":false,"hidden":false,"iFrame":false,"icon":"error","id":32,"label":"异常日志","leaf":true,"menuSort":12,"path":"errorLog","pid":6,"subCount":0,"title":"异常日志","type":1},
    {"cache":false,"component":"system/dept/index","componentName":"Dept","createTime":"2019-03-25 09:46:00","hasChildren":true,"hidden":false,"iFrame":false,"icon":"dept","id":35,"label":"部门管理","leaf":false,"menuSort":6,"path":"dept","permission":"dept:list","pid":1,"subCount":3,"title":"部门管理","type":1},
    {"cache":false,"component":"","createTime":"2019-03-29 10:57:35","hasChildren":true,"hidden":false,"iFrame":false,"icon":"sys-tools","id":36,"label":"系统工具","leaf":false,"menuSort":30,"path":"sys-tools","subCount":7,"title":"系统工具","type":0},
    {"cache":false,"component":"system/job/index","componentName":"Job","createTime":"2019-03-29 13:51:18","hasChildren":true,"hidden":false,"iFrame":false,"icon":"Steve-Jobs","id":37,"label":"岗位管理","leaf":false,"menuSort":7,"path":"job","permission":"job:list","pid":1,"subCount":3,"title":"岗位管理","type":1},
    {"cache":false,"component":"system/dict/index","componentName":"Dict","createTime":"2019-04-10 11:49:04","hasChildren":true,"hidden":false,"iFrame":false,"icon":"dictionary","id":39,"label":"字典管理","leaf":false,"menuSort":8,"path":"dict","permission":"dict:list","pid":1,"subCount":3,"title":"字典管理","type":1},
    {"cache":false,"component":"monitor/online/index","componentName":"OnlineUser","createTime":"2019-10-26 22:08:43","hasChildren":true,"hidden":false,"iFrame":false,"icon":"Steve-Jobs","id":41,"label":"在线用户","leaf":false,"menuSort":10,"path":"online","pid":6,"subCount":1,"title":"在线用户","type":1}]})
})

router.put('/', (req: Request, res: Response) => {
    let data = req.body as RoleData
    if (data.id && data.name && data.description) {
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
    let id = req.body as number
    if (id) {
        res.json({
            ok: 'ok'
        })
    } else {
        res.json({
            ok: 'no'
        })
    }
})

router.post('/', (req: Request, res: Response) => {
    let data = req.body as RoleData
    if (data.name && data.description && data.level) {
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