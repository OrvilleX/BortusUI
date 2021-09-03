import faker from 'faker'
import { Response, Request, Router } from 'express'
import { JwtUserDtoData } from '../src/types/login'
import { PageableBody } from '../src/types/base'
import { OnlineUserDtoData } from '../src/types/online'

let router = Router()

router.post('/login', (req: Request, res: Response) => {
    const user: JwtUserDtoData = {
        id: 1,
        roles: ['admin'],
        dataScopes: [-1],
        user: {
            username: 'admin',
            nickName: 'admin',
            phone: '13300000000',
            email: 'admin@ovrillex.com',
            dept: {
                name: 'admin'
            }
        }
    }
    return res.json({
        token: '123',
        user
    })
})

router.get('/info', (req: Request, res: Response) => {
    const user: JwtUserDtoData = {
        id: 1,
        user: {
            id: 1,
            username: 'admin',
            nickName: 'admin',
            email: 'admin@orvillex.com',
            phone: '123213142',
            gender: '男',
            enabled: true,
            dept: {
                name: 'admin'
            }
        },
        roles: ['admin'],
        dataScopes: [1]
    }
    return res.json(user)
})

router.get('/code', (req: Request, res: Response) => {
    return res.json({
        img: 'http://admin.dlszywz.cn/include/captcha/captcha.php',
        uuid: '123456'
    })
})

router.delete('/logout', (req: Request, res: Response) => {
    return res.json({ message: 'ok' })
})

router.get('/online', (req: Request, res: Response<PageableBody<OnlineUserDtoData>>) => {
    let datas: OnlineUserDtoData[] = [{"address":"中国|浙江省|杭州市|移动","browser":"Chrome 8","dept":"研发部","ip":"112.10.135.64","key":"0B95E","loginTime":"2020-12-27 11:11:51","nickName":"管理员","userName":"admin"},
    {"address":"中国|浙江省|杭州市|电信","browser":"Chrome 8","dept":"研发部","ip":"183.134.216.90","key":"0577","loginTime":"2020-12-27 11:11:11","nickName":"管理员","userName":"admin"},
    {"address":"中国|天津|天津市|联通","browser":"Mobile Safari","dept":"研发部","ip":"117.10.206.245","key":"178F3F","loginTime":"2020-12-27 11:09:57","nickName":"管理员","userName":"admin"},
    {"address":"中国|湖北省|武汉市|电信","browser":"Mobile Safari","dept":"研发部","ip":"221.232.31.25","key":"084F","loginTime":"2020-12-27 11:08:00","nickName":"管理员","userName":"admin"},
    {"address":"中国|江苏省|南京市|联通","browser":"Firefox 8","dept":"研发部","ip":"153.3.2.137","key":"9CB26","loginTime":"2020-12-27 11:07:31","nickName":"管理员","userName":"admin"},
    {"address":"中国|宁夏|银川市|联通","browser":"Chrome","dept":"研发部","ip":"42.63.159.19","key":"D9BD89","loginTime":"2020-12-27 11:05:45","nickName":"管理员","userName":"admin"},
    {"address":"中国|湖南省|永州市|联通","browser":"Chrome 8","dept":"研发部","ip":"220.202.250.159","key":"B04AE4607","loginTime":"2020-12-27 11:05:08","nickName":"管理员","userName":"admin"},
    {"address":"中国|湖南省|长沙市|电信","browser":"Chrome 8","dept":"研发部","ip":"218.76.8.37","key":"BE2FE34","loginTime":"2020-12-27 11:02:12","nickName":"管理员","userName":"admin"},
    {"address":"中国|北京|北京市|联通","browser":"Safari","dept":"研发部","ip":"111.201.50.109","key":"B04AE46","loginTime":"2020-12-27 11:00:00","nickName":"管理员","userName":"admin"},
    {"address":"中国|江苏省|镇江市|电信","browser":"Chrome 8","dept":"研发部","ip":"117.90.72.100","key":"B04AE46","loginTime":"2020-12-27 10:53:38","nickName":"管理员","userName":"admin"}]

    res.json({
        totalElements: 53,
        content: datas
    })
})

router.delete('/online', (req: Request, res: Response) => {
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
