import faker from 'faker'
import { Request, Response, Router } from 'express'
import { PageableBody } from '../src/types/base'
import { LogSmallDTOData } from '../src/types/log'

let router = Router()

router.get('/user', (req: Request, res: Response<PageableBody<LogSmallDTOData>>) => {
    let datas: LogSmallDTOData[] = []
    for(let i = 0; i < 20; i++) {
        datas.push({
            description: '说明' + i,
            requestIp: faker.internet.ip(),
            time: faker.time.recent(),
            address: faker.address.streetAddress(),
            browser: 'Chrome',
            createTime: faker.date.soon().toUTCString()
        })
    }

    res.json({
        totalElements: 20,
        content: datas
    })
})

export default router;