import faker from 'faker'
import { Response, Request, Router } from 'express'
import { JwtUserDtoData } from '../src/types/login'

let router = Router()

router.post('/login', (req: Request, res: Response) => {
    const user: JwtUserDtoData = {
        id: 1,
        roles: ['admin'],
        dataScopee: [-1]
    }
    return res.json({
        token: '123',
        user
    })
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
