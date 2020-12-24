import { Response, Request, Router } from 'express'
import { UserData } from '../src/types/user'

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

export default router;