import { Response, Request, Router } from 'express'
import { PageableBody } from '../src/types/base'
import { JobDtoData, JobData } from '../src/types/job'

let router = Router()

router.get('/', (req: Request, res: Response<PageableBody<JobDtoData>>) => {
    let datas: JobDtoData[] = [{"createTime":"2019-03-29 14:52:28","enabled":true,"id":8,"jobSort":3,"name":"人事专员"},
    {"createTime":"2019-03-29 14:55:51","enabled":true,"id":10,"jobSort":4,"name":"产品经理"},
    {"createTime":"2019-03-31 13:39:30","enabled":true,"id":11,"jobSort":2,"name":"全栈开发","updateTime":"2020-05-05 11:33:43","updatedBy":"admin"},
    {"createTime":"2019-03-31 13:39:43","enabled":true,"id":12,"jobSort":5,"name":"软件测试","updateTime":"2020-05-10 19:56:26","updatedBy":"admin"}]

    res.json({
        totalElements: datas.length,
        content: datas
    })
})

router.post('/', (req: Request, res: Response) => {
    let data = req.body as JobData
    if (data.name && data.jobSort && data.enabled) {
        res.json({
            ok: 'ok'
        })
    } else {
        res.json({
            ok: 'no'
        })
    }
})

router.put('/', (req: Request, res: Response) => {
    let data = req.body as JobData
    if (data.id) {
        res.json({
            ok: 'ok'
        })
    } else {
        res.json({
            ok: 'no'
        })
    }
})

router.delete('/', (req: Request, res: Response) => {
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