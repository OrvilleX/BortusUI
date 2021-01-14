import { Request, Response, Router } from 'express'
import { PageableBody } from '../src/types/base'
import { DictDetailDtoData, DictDetailData, DictDetailQueryData } from '../src/types/dictDetail'

let router = Router()

router.get('/', (req: Request, res: Response<PageableBody<DictDetailDtoData>>) => {
    let query = req.query as DictDetailQueryData
    let datas: DictDetailDtoData[] = []
    if (query.dictName == 'glue_type') {
        datas.push({'dict':{'id':2},'dictSort':1,'id':1,'label':'BEAN','value':'BEAN'})
        datas.push({'dict':{'id':2},'dictSort':1,'id':2,'label':'GLUE(Java)','value':'GLUE_GROOVY'})
        datas.push({'dict':{'id':2},'dictSort':1,'id':3,'label':'GLUE(Shell)','value':'GLUE_SHELL'})
        datas.push({'dict':{'id':2},'dictSort':1,'id':4,'label':'GLUE(Python)','value':'GLUE_PYTHON'})
        datas.push({'dict':{'id':2},'dictSort':1,'id':5,'label':'GLUE(PHP)','value':'GLUE_PHP'})
        datas.push({'dict':{'id':2},'dictSort':1,'id':6,'label':'GLUE(Nodejs)','value':'GLUE_NODEJS'})
        datas.push({'dict':{'id':2},'dictSort':1,'id':7,'label':'GLUE(PowerShell)','value':'GLUE_POWERSHELL'})
    } else if (query.dictName == 'route_strategy_type') {
        datas.push({'dict':{'id':2},'dictSort':1,'id':1,'label':'第一个','value':'FIRST'})
        datas.push({'dict':{'id':2},'dictSort':1,'id':2,'label':'最后一个','value':'LAST'})
        datas.push({'dict':{'id':2},'dictSort':1,'id':3,'label':'轮询','value':'ROUND'})
        datas.push({'dict':{'id':2},'dictSort':1,'id':4,'label':'随机','value':'RANDOM'})
        datas.push({'dict':{'id':2},'dictSort':1,'id':5,'label':'一致性HASH','value':'CONSISTENT_HASH'})
        datas.push({'dict':{'id':2},'dictSort':1,'id':6,'label':'最不经常使用','value':'LEAST_FREQUENTLY_USED'})
        datas.push({'dict':{'id':2},'dictSort':1,'id':7,'label':'最近最久未使用','value':'LEAST_RECENTLY_USED'})
        datas.push({'dict':{'id':2},'dictSort':1,'id':8,'label':'故障转移','value':'FAILOVER'})
        datas.push({'dict':{'id':2},'dictSort':1,'id':9,'label':'忙碌转移','value':'BUSYOVER'})
        datas.push({'dict':{'id':2},'dictSort':1,'id':10,'label':'分片广播','value':'SHARDING_BROADCAST'})
    } else if (query.dictName == 'block_strategy_type') {
        datas.push({'dict':{'id':2},'dictSort':1,'id':1,'label':'Serial execution','value':'SERIAL_EXECUTION'})
        datas.push({'dict':{'id':2},'dictSort':1,'id':2,'label':'Discard Later','value':'DISCARD_LATER'})
        datas.push({'dict':{'id':2},'dictSort':1,'id':3,'label':'Cover Early','value':'COVER_EARLY'})
    } else {
        datas.push({"dict":{"id":1},"dictSort":1,"id":1,"label":"激活","value":"true"})
        datas.push({"dict":{"id":1},"dictSort":2,"id":2,"label":"禁用","value":"false"})
    }

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