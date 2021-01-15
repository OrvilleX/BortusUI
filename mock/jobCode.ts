import { Request, Response, Router } from 'express'
import { JobLogGlueData, JobLogGlueDtoData } from '../src/types/jobCode'

let router = Router()

router.get('/:id', (req: Request, res: Response<JobLogGlueDtoData>) => {
    res.json({
        jobInfo: {
            id: 2,
            jobGroup: 2,
            author: '123',
            glueType: 'GLUE_PYTHON',
            glueSource: 'from banana import *' +
            '' +
            'class Monkey:' +
            '	# Bananas the monkey can eat.'+
            '	capacity = 10'+
            '	def eat(self, N):'+
            "		'''Make the monkey eat N bananas!'''"+
            '		capacity = capacity - N*banana.size'+
            ''+
            '	def feeding_frenzy(self):'+
            '		eat(9.25)'+
            '		return "Yum yum"'
        }
    })
})

router.put('/', (req: Request, res: Response) => {
    let data = req.body as JobLogGlueData
    if (data.glueSource && data.glueType) {
        res.json({
            'ok': 'ok'
        })
    } else {
        res.json({
            'ok': 'no'
        })
    }
})

export default router;