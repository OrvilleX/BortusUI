import { Request, Response, Router } from 'express'
import { PageableBody } from '../src/types/base'
import { DictDetailDtoData, DictDetailData } from '../src/types/dictDetail'

let router = Router()

router.get('/', (req: Request, res: Response<PageableBody<DictDetailDtoData>>) => {
    let datas: DictDetailDtoData[] = [
        {"createTime":"2019-10-27 20:31:36","dict":{"id":1},"dictSort":1,"id":1,"label":"激活","value":"true"},
        {"dict":{"id":1},"dictSort":2,"id":2,"label":"禁用","value":"false"}]

    res.json({
        totalElements: datas.length,
        content: datas
    })
})

router.post('/', (req: Request, res: Response) => {
    let data = req.body as DictDetailData
    if (data.value && data.label && data.dictSort && data.dict) {
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
    let data = req.body as DictDetailData
    if (data.id && data.value && data.label) {
        res.json({
            ok: 'ok'
        })
    } else {
        res.json({
            ok: 'no'
        })
    }
})

router.delete('/:id', (req: Request, res: Response) => {
    let id = req.params.id
    if (id) {
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