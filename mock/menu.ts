import faker from 'faker'
import { Response, Request, Router } from 'express'
import { MenuDtoData } from '../src/types/menu'

let router = Router()

router.get('/build', (req: Request, res: Response) => {
    let menus: MenuDtoData[] = [{"alwaysShow":true,"children":[
        {"component":"system/user/Index.vue","meta":{"icon":"peoples","noCache":true,"title":"用户管理","hidden":false},"name":"User","path":"user"},
        {"component":"system/role/index","meta":{"icon":"role","noCache":true,"title":"角色管理","hidden":false},"name":"Role","path":"role"},
        {"component":"system/menu/index","meta":{"icon":"menu","noCache":true,"title":"菜单管理","hidden":false},"name":"Menu","path":"menu"},
        {"component":"system/dept/index","meta":{"icon":"dept","noCache":true,"title":"部门管理","hidden":false},"name":"Dept","path":"dept"},
        {"component":"system/job/index","meta":{"icon":"Steve-Jobs","noCache":true,"title":"岗位管理","hidden":false},"name":"Job","path":"job"},
        {"component":"system/dict/index","meta":{"icon":"dictionary","noCache":true,"title":"字典管理","hidden":false},"name":"Dict","path":"dict"},
        {"component":"system/timing/index","meta":{"icon":"timing","noCache":true,"title":"任务调度","hidden":false},"name":"Timing","path":"timing"}],
        "component":"Layout","meta":{"icon":"system","noCache":true,"title":"系统管理","hidden":false},"name":"系统管理","path":"/system","redirect":"noredirect"},
        {"alwaysShow":true,"children":[{"component":"monitor/online/index","meta":{"icon":"Steve-Jobs","noCache":true,"title":"在线用户","hidden":false},"name":"OnlineUser","path":"online"},
        {"component":"monitor/log/index","meta":{"icon":"log","noCache":false,"title":"操作日志","hidden":false},"name":"Log","path":"logs"},
        {"component":"monitor/log/errorLog","meta":{"icon":"error","noCache":true,"title":"异常日志","hidden":false},"name":"ErrorLog","path":"errorLog"},
        {"component":"monitor/server/index","meta":{"icon":"codeConsole","noCache":true,"title":"服务监控","hidden":false},"name":"ServerMonitor","path":"server"},
        {"component":"monitor/sql/index","meta":{"icon":"sqlMonitor","noCache":true,"title":"SQL监控","hidden":true},"name":"Sql","path":"druid"}],
        "component":"Layout","meta":{"icon":"monitor","noCache":true,"title":"系统监控","hidden":false},"name":"系统监控","path":"/monitor","redirect":"noredirect"},
        {"alwaysShow":true,"children":[{"component":"mnt/server/index","meta":{"icon":"server","noCache":true,"title":"服务器","hidden":false},"name":"ServerDeploy","path":"mnt/serverDeploy"},
        {"component":"mnt/app/index","meta":{"icon":"app","noCache":true,"title":"应用管理","hidden":false},"name":"App","path":"mnt/app"},
        {"component":"mnt/deploy/index","meta":{"icon":"deploy","noCache":true,"title":"部署管理","hidden":false},"name":"Deploy","path":"mnt/deploy"},
        {"component":"mnt/deployHistory/index","meta":{"icon":"backup","noCache":true,"title":"部署备份","hidden":false},"name":"DeployHistory","path":"mnt/deployHistory"},
        {"component":"mnt/database/index","meta":{"icon":"database","noCache":true,"title":"数据库管理","hidden":false},"name":"Database","path":"mnt/database"}],
        "component":"Layout","meta":{"icon":"mnt","noCache":true,"title":"运维管理","hidden":false},"name":"Mnt","path":"/mnt","redirect":"noredirect"},
        {"alwaysShow":true,"children":[{"component":"generator/index","meta":{"icon":"dev","noCache":false,"title":"代码生成","hidden":false},"name":"GeneratorIndex","path":"generator"},
        {"component":"generator/config","meta":{"icon":"dev","noCache":false,"title":"生成配置","hidden":true},"name":"GeneratorConfig","path":"generator/config/:tableName"},
        {"component":"tools/storage/index","meta":{"icon":"qiniu","noCache":true,"title":"存储管理","hidden":false},"name":"Storage","path":"storage"},
        {"component":"tools/email/index","meta":{"icon":"email","noCache":true,"title":"邮件工具","hidden":false},"name":"Email","path":"email"},
        {"component":"tools/swagger/index","meta":{"icon":"swagger","noCache":true,"title":"接口文档","hidden":true},"name":"Swagger","path":"swagger2"},
        {"component":"tools/aliPay/index","meta":{"icon":"alipay","noCache":true,"title":"支付宝工具","hidden":false},"name":"AliPay","path":"aliPay"},
        {"component":"generator/preview","meta":{"icon":"java","noCache":false,"title":"生成预览","hidden":true},"name":"Preview","path":"generator/preview/:tableName"}],
        "component":"Layout","meta":{"icon":"sys-tools","noCache":true,"title":"系统工具","hidden":false},"name":"系统工具","path":"/sys-tools","redirect":"noredirect"},
        {"alwaysShow":true,"children":[{"component":"components/Echarts","meta":{"icon":"chart","noCache":false,"title":"图表库","hidden":false},"name":"Echarts","path":"echarts"},
        {"component":"components/icons/index","meta":{"icon":"icon","noCache":true,"title":"图标库","hidden":false},"name":"Icons","path":"icon"},
        {"component":"components/Editor","meta":{"icon":"fwb","noCache":true,"title":"富文本","hidden":false},"name":"Editor","path":"tinymce"},
        {"component":"components/MarkDown","meta":{"icon":"markdown","noCache":true,"title":"Markdown","hidden":false},"name":"Markdown","path":"markdown"},
        {"component":"components/YamlEdit","meta":{"icon":"dev","noCache":true,"title":"Yaml编辑器","hidden":false},"name":"YamlEdit","path":"yaml"}],
        "component":"Layout","meta":{"icon":"zujian","noCache":true,"title":"组件管理","hidden":false},"name":"组件管理","path":"/components","redirect":"noredirect"},
        {"alwaysShow":true,"children":[{"alwaysShow":true,"children":[{"component":"nested/menu1/menu1-1","meta":{"icon":"menu","noCache":false,"title":"三级菜单1","hidden":false},"name":"Test","path":"menu1-1"},
        {"component":"nested/menu1/menu1-2","meta":{"icon":"menu","noCache":true,"title":"三级菜单2","hidden":false},"name":"三级菜单2","path":"menu1-2"}],
        "component":"ParentView","meta":{"icon":"menu","noCache":true,"title":"二级菜单1","hidden":false},"name":"二级菜单1","path":"menu1","redirect":"noredirect"},
        {"component":"nested/menu2/index","meta":{"icon":"menu","noCache":true,"title":"二级菜单2","hidden":false},"name":"二级菜单2","path":"menu2"}],
        "component":"Layout","meta":{"icon":"menu","noCache":true,"title":"多级菜单","hidden":false},"name":"多级菜单","path":"/nested","redirect":"noredirect"}]
    return res.json(menus)
})

export default router;