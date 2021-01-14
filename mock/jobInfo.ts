import { Request, Response, Router } from 'express'
import { PageableBody } from '../src/types/base'
import { JobInfoData } from '../src/types/jobInfo'

let router = Router()

router.get('/', (req: Request, res: Response<PageableBody<JobInfoData>>) => {
    let datas: JobInfoData[] = [
        {id:1, jobGroup: 1, jobCron: '* * * 2 /', jobDesc: '测试任务1', author: 'admin', alarmEmail: 'fe1@qq.com', executorRouteStrategy: 'ROUND',
        executorParam: 'fe1', executorBlockStrategy: 'DISCARD_LATER', executorTimeout: 20, executorFailRetryCount: 0, glueType: 'BEAN', triggerStatus: 1, createTime: '2019-03-25 11:04:50'},
        {id:2, jobGroup: 2, jobCron: '* * * 2 /', jobDesc: '测试任务2', author: 'admin', alarmEmail: 'fe2@qq.com', executorRouteStrategy: 'LEAST_FREQUENTLY_USED',
        executorParam: 'fe2', executorBlockStrategy: 'SERIAL_EXECUTION', executorTimeout: 20, executorFailRetryCount: 0, glueType: 'GLUE_NODEJS', triggerStatus: 1, createTime: '2019-03-25 11:04:50'}
    ]

    res.json({
        totalElements: 21,
        content: datas
    })
})

router.post('/', (req: Request, res: Response) => {
    let data = req.body as JobInfoData
    if (data.executorBlockStrategy && data.executorRouteStrategy && data.author) {
        res.json({
            'ok': 'ok'
        })
    } else {
        res.json({
            'ok': 'no'
        })
    }
})

router.delete('/', (req: Request, res: Response) => {
    let ids = req.body as number[]
    if (ids && ids.length > 0) {
        res.json({
            'ok': 'ok'
        })
    } else {
        res.json({
            'ok': 'no'
        })
    }
})

router.put('/', (req: Request, res: Response) => {
    let data = req.body as JobInfoData
    if (data.id && data.executorBlockStrategy && data.executorRouteStrategy && data.author) {
        res.json({
            'ok': 'ok'
        })
    } else {
        res.json({
            'ok': 'no'
        })
    }
})

router.get('/:id', (req: Request, res: Response) => {
    let data: JobInfoData = {
        id:1, jobGroup: 1, 
        jobCron: '* * * 2 /', 
        jobDesc: '测试任务1', 
        author: 'admin', 
        alarmEmail: 'fe1@qq.com', 
        executorRouteStrategy: 'ROUND',
        executorParam: 'fe1', 
        executorBlockStrategy: 'DISCARD_LATER', 
        executorTimeout: 20, 
        executorFailRetryCount: 0, 
        glueType: 'BEAN', triggerStatus: 1, 
        createTime: '2019-03-25 11:04:50'
    }
    res.json(data)
})

router.put('/pause/:id', (req: Request, res: Response) => {
    let id = req.params.id
    if (id) {
        res.json({
            'ok': 'ok'
        })
    } else {
        res.json({
            'ok': 'no'
        })
    }
})

router.put('/start/:id', (req: Request, res: Response) => {
    let id = req.params.id
    if (id) {
        res.json({
            'ok': 'ok'
        })
    } else {
        res.json({
            'ok': 'no'
        })
    }
})

router.put('/trigger', (req: Request, res: Response) => {
    if (req.query.id && req.query.executorParam && req.query.addressList) {
        res.json({
            'ok': 'ok'
        })
    } else {
        res.json({
            'ok': 'no'
        })
    }
})

router.get('/nextTriggerTime', (req: Request, res: Response) => {
    if (req.query.cron) {
        res.json([
            'fe',
            'fef'
        ])
    } else {
        res.json([
            'no',
            'no'
        ])
    }
})

router.get('/group/:group', (req: Request, res: Response) => {
    if (req.params.group) {
        res.json([
            {id:2, jobGroup: 1, jobCron: '* * * 2 /', jobDesc: '测试任务2', author: 'admin', alarmEmail: 'fe2@qq.com', executorRouteStrategy: 'LEAST_FREQUENTLY_USED',
            executorParam: 'fe2', executorBlockStrategy: 'SERIAL_EXECUTION', executorTimeout: 20, executorFailRetryCount: 0, glueType: 'GLUE_NODEJS', triggerStatus: 1, createTime: '2019-03-25 11:04:50'}
        ])
    } else {
        res.json([])
    }
})

export default router