import faker from 'faker'
import { Request, Response, Router } from 'express'
import { PageableBody } from '../src/types/base'
import { LogSmallDTOData, LogData, LogErrorDTOData } from '../src/types/log'

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

router.get('/', (req: Request, res: Response<PageableBody<LogData>>) => {
    let datas: LogData[] = []
    for (let i = 0; i < 10; i++) {
        datas.push({
            id: faker.random.number(),
            username: faker.name.findName(),
            description: faker.random.words(),
            method: '请求',
            params: faker.random.words(),
            logType: 'info',
            requestIp: faker.internet.ip(),
            address: faker.address.city(),
            browser: 'Chrome',
            time: faker.time.recent(),
            exceptionDetail: faker.random.words(),
            createTime: faker.date.soon().toUTCString()
        })
    }

    res.json({
        totalElements: 32,
        content: datas
    })
})

router.delete('/del/info', (req: Request, res: Response) => {
    res.json({
        ok: 'ok'
    })
})

router.get('/error', (req: Request, res: Response<PageableBody<LogErrorDTOData>>) => {
    let datas: LogErrorDTOData[] = []
    for (let i = 0; i < 10; i++) {
        datas.push({
            id: faker.random.number(),
            username: faker.name.findName(),
            description: faker.random.words(),
            method: '请求',
            params: faker.random.words(),
            browser: 'Chrome',
            requestIp: faker.internet.ip(),
            address: faker.address.city(),
            createTime: faker.date.soon().toUTCString()
        })
    }

    res.json({
        totalElements: 23,
        content: datas
    })
})

router.get('/error/:id', (req: Request, res: Response) => {
    res.json({
        exception: faker.random.words()
    })
})

router.delete('/del/error', (req: Request, res: Response) => {
    res.json({
        ok: 'ok'
    })
})

export default router;