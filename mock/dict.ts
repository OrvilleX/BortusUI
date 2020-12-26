import { Response, Request, Router } from 'express'
import { DictDtoData, DictData } from '../src/types/dict'
import { PageableBody } from '../src/types/base'

let router = Router()

router.get('/', (req: Request, res: Response<PageableBody<DictDtoData>>) => {
    let dicts: DictDtoData[] = [{"createTime":"2019-10-27 20:31:36","description":"岗位状态","dictDetails":[{"dict":{"id":5},"dictSort":1,"id":5,"label":"启用","value":"true"},
    {"createTime":"2019-10-27 20:31:36","dict":{"id":5},"dictSort":2,"id":6,"label":"停用","value":"false"}],"id":5,"name":"job_status"},
    {"createTime":"2019-10-27 20:31:36","description":"部门状态","dictDetails":[{"dict":{"id":4},"dictSort":1,"id":3,"label":"启用","value":"true"},
    {"createTime":"2019-10-27 20:31:36","dict":{"id":4},"dictSort":2,"id":4,"label":"停用","value":"false"}],"id":4,"name":"dept_status"},
    {"createTime":"2019-10-27 20:31:36","description":"用户状态","dictDetails":[{"createTime":"2019-10-27 20:31:36","dict":{"id":1},"dictSort":1,"id":1,"label":"激活","value":"true"},
    {"dict":{"id":1},"dictSort":2,"id":2,"label":"禁用","value":"false"}],"id":1,"name":"user_status"}]

    res.json({
        totalElements: dicts.length,
        content: dicts
    })
})

router.post('/', (req: Request, res: Response) => {
    let data = req.body as DictData
    if (data.description && data.name) {
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

router.put('/', (req: Request, res: Response) => {
    let data = req.body as DictData
    if (data.id && data.description && data.name && data.dictDetails) {
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