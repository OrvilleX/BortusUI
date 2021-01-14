import { Request, Response, Router } from 'express'
import { PageableBody } from '../src/types/base'
import { JobLogData, JobLogQueryData, LogResultData } from '../src/types/jobLog'

let router = Router()

router.get('/', (req: Request, res: Response<PageableBody<JobLogData>>) => {
    let datas: JobLogData[] = [
        {id:1,jobGroup:1,jobId:1,executorAddress:'2.3.2.1',executorHandler:'handler1',executorParam:'param1',executorShardingParam:'',executorFailRetryCount:1,
        triggerTime:'2021-01-14 15:45:32',triggerCode:0,triggerMsg:'ok',handleTime:'2021-01-14 15:56:23', handleCode:0, handleMsg:'handle'},
        {id:2,jobGroup:2,jobId:2,executorAddress:'2.3.2.1',executorHandler:'handler2',executorParam:'param2',executorShardingParam:'',executorFailRetryCount:1,
        triggerTime:'2021-01-14 15:45:32',triggerCode:0,triggerMsg:'ok',handleTime:'2021-01-14 15:56:23', handleCode:0, handleMsg:'handle'}        
    ]
    res.json({
        totalElements: 32,
        content: datas
    })
})

router.get('/executor', (req: Request, res: Response<LogResultData>) => {
    let data: LogResultData = {
        fromLineNum: 0,
        toLineNum: 10,
        logContent: '123123123123213',
        isEnd: true
    }
    res.json(data)
})

router.get('/:id', (req: Request, res: Response<JobLogData>) => {
    let data: JobLogData = {
        id:1,jobGroup:1,jobId:1,
        executorAddress:'2.3.2.1',
        executorHandler:'handler1',
        executorParam:'param1',
        executorShardingParam:'',
        executorFailRetryCount:1,
        triggerTime:'2021-01-14 15:45:32',
        triggerCode:0,triggerMsg:'ok',
        handleTime:'2021-01-14 15:56:23', 
        handleCode:0, handleMsg:'handle'}
    res.json(data)
})

export default router