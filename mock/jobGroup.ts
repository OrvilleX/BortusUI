import { Request, Response, Router } from 'express'
import { PageableBody } from '../src/types/base'
import { JobGroupData, JobGroupQueryData } from '../src/types/jobGroup'

let router = Router()

router.get('/', (req: Request, res:Response<PageableBody<JobGroupData>>) => {
    let datas: JobGroupData[] = [
        {id: 1,appName: 'bortus1-jobgroup', title: '执行器1', addressType: 0, addressList: '10.10.10.1,10.12.1.2', createTime: '2019-03-25 11:04:50'},
        {id: 2,appName: 'bortus2-jobgroup', title: '执行器2', addressType: 1, addressList: '23.32.32.3,321.3.23.2', createTime: '2019-03-25 11:04:50'}]
    res.json({
        totalElements: 21,
        content: datas
    })
})

router.get('/:id', (req: Request, res: Response<JobGroupData>) => {
    res.json({
        id: 1,
        appName: 'bortus1-jobgroup',
        title: '执行器1',
        addressType: 0,
        addressList: '23.32.32.32,323.32.32.3'
    })
})

router.post('/', (req: Request, res: Response) => {
    let data = req.body as JobGroupData
    if (data.appName && data.title) {
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
    let data = req.body as JobGroupData
    if (data.id && data.appName && data.title) {
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