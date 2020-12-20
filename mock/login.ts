import faker from 'faker'
import { Response, Request, Router } from 'express'
import { JwtUserDtoData } from '../src/types/login'

let router = Router()

router.get('/code', (req: Request, res: Response) => {
    return res.json({
        img: "http://www.demodashi.com/ueditor/jsp/upload/image/20170802/1501642960521048148.jpeg",
        uuid: "123456"
    })
})

export default router;
