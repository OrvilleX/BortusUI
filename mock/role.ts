import { Response, Request, Router } from 'express'
import { PageableBody } from '../src/types/base'
import { RoleDtoData } from '../src/types/role'

let router = Router()

router.get('/all', (req: Request, res: Response<RoleDtoData[]>) => {
    let datas: RoleDtoData[] = [{ id:1, level:1, name: '超级管理员' }, { id: 2, level: 2, name: '普通用户' }]

    res.json(datas)
})

export default router;