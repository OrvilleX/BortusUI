import { Request, Response, Router } from 'express'
import { EmailConfigData } from '../src/types/email'

let router = Router()

router.get('/', (req: Request, res: Response<EmailConfigData>) => {
    res.json({
        id: 1,
        host: 'smtp.qq.com',
        port: '465',
        user: 'orvillex',
        pass: '123',
        fromUser: 'auto@orvillex.com',
        sslEnable: 'true'
    })
})

router.put('/', (req: Request, res: Response) => {
    let data = req.body as EmailConfigData
    if (data.id && data.fromUser) {
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
    res.json({
        ok: 'ok'
    })
})

export default router;