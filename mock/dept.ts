import faker from 'faker'
import { Request, Response, Router } from 'express'
import { PageableBody } from '../src/types/base'
import { DeptDtoData, DeptData } from '../src/types/dept'

let router = Router()

router.get('/', (req: Request, res:Response<PageableBody<DeptDtoData>>) => {
    let datas: DeptDtoData[] = [
        {"createBy":"admin","createTime":"2019-03-25 11:04:50","deptSort":0,"enabled":true,"hasChildren":true,"id":7,"label":"华南分部","leaf":false,"name":"华南分部","subCount":2,"updateTime":"2020-06-08 12:08:56","updatedBy":"admin"},
        {"createBy":"admin","createTime":"2019-03-25 11:04:53","deptSort":1,"enabled":true,"hasChildren":true,"id":8,"label":"华北分部","leaf":false,"name":"华北分部","subCount":2,"updateTime":"2020-05-14 12:54:00","updatedBy":"admin"}]
    res.json({
        totalElements: datas.length,
        content: datas
    })
})

router.post('/superior', (req: Request, res: Response<PageableBody<DeptDtoData>>) => {
    let datas: DeptDtoData[] = [{"children":[{"createBy":"admin","createTime":"2019-03-25 09:15:32","deptSort":3,"enabled":true,"hasChildren":true,"id":2,"label":"研发部","leaf":false,"name":"研发部","pid":7,"subCount":1,"updateTime":"2020-08-02 14:48:47","updatedBy":"admin"},
    {"createBy":"admin","createTime":"2019-03-25 09:20:44","deptSort":4,"enabled":true,"hasChildren":false,"id":5,"label":"运维部","leaf":true,"name":"运维部","pid":7,"subCount":0,"updateTime":"2020-05-17 14:27:27","updatedBy":"admin"}],
    "createBy":"admin","createTime":"2019-03-25 11:04:50","deptSort":0,"enabled":true,"hasChildren":true,"id":7,"label":"华南分部","leaf":false,"name":"华南分部","subCount":2,"updateTime":"2020-06-08 12:08:56","updatedBy":"admin"},
    {"createBy":"admin","createTime":"2019-03-25 11:04:53","deptSort":1,"enabled":true,"hasChildren":true,"id":8,"label":"华北分部","leaf":false,"name":"华北分部","subCount":2,"updateTime":"2020-05-14 12:54:00","updatedBy":"admin"}]

    res.json({
        totalElements: datas.length,
        content: datas
    })
})

router.post('/', (req: Request, res: Response) => {
    let data = req.body as DeptData
    if (data.name && data.enabled && data.isTop) {
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
    let data = req.body as DeptData
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