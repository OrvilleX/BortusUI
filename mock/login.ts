import faker from 'faker'
import { Response, Request, Router } from 'express'
import { JwtUserDtoData } from '../src/types/login'

let router = Router()

router.post('/login', (req: Request, res: Response) => {
    const user: JwtUserDtoData = {
        id: 1,
        roles: ['admin'],
        dataScopee: [-1],
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
        dataScopee: [1]
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

export default router;
