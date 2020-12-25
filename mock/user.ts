import { Response, Request, Router } from 'express'
import { PageableBody } from '../src/types/base'
import { UserData, UserDtoData } from '../src/types/user'

let router = Router()

router.put('/center', (req: Request, res: Response) => {
    let data = req.body as UserData
    if(data.id && data.nickName && data.gender && data.phone) {
        res.json({
            ok: 'ok'
        })
    } else {
        res.status(500)
    }
})

router.get('/', (req: Request, res: Response<PageableBody<UserDtoData>>) => {
    let datas: UserDtoData[] = [{"createBy":"admin","createTime":"2020-12-25 13:36:50","dept":{"id":7,"name":"华南分部"},"email":"test@13.com","enabled":true,"gender":"男","id":3,"jobs":[{"id":11,"name":"全栈开发"}],"nickName":"test","phone":"18723437876","roles":[{"dataScope":"自定义","id":2,"level":2,"name":"普通用户"}],"updateTime":"2020-12-25 13:36:50","updatedBy":"admin","username":"tzt"},
    {"avatarName":"avatar.jpeg","avatarPath":"/home/eladmin/avatar/avatar.jpeg","createTime":"2018-08-23 09:11:56","dept":{"id":2,"name":"研发部"},"email":"admin@el-admin.vip","enabled":true,"gender":"男","id":1,"jobs":[{"id":11,"name":"全栈开发"}],"nickName":"管理员","phone":"18888888888","pwdResetTime":"2020-05-03 16:38:31","roles":[{"dataScope":"全部","id":1,"level":1,"name":"超级管理员"}],"updateTime":"2020-09-05 10:43:31","updatedBy":"admin","username":"admin"}]

    res.json({
        totalElements: datas.length,
        content: datas
    })
})

export default router;