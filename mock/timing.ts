import { Request, Response, Router } from 'express'
import { PageableBody } from '../src/types/base'
import { QuartzJobData, QuartzLogData } from '../src/types/timing'

let router = Router()

router.get('/', (req: Request, res: Response<PageableBody<QuartzJobData>>) => {
    let datas: QuartzJobData[] = [{"beanName":"testTask","createBy":"admin","createTime":"2020-05-05 20:35:41","cronExpression":"0/5 * * * * ?","description":"测试3","email":"","id":6,"isPause":true,"jobName":"测试3","methodName":"run2","pauseAfterFailure":true,"personInCharge":"Zheng Jie","updateTime":"2020-05-05 20:36:07","updatedBy":"admin"},
    {"beanName":"Test","createBy":"admin","createTime":"2020-05-05 20:32:41","cronExpression":"0/5 * * * * ?","description":"测试","email":"","id":5,"isPause":true,"jobName":"任务告警测试","methodName":"run","pauseAfterFailure":true,"personInCharge":"test","updateTime":"2020-05-05 20:36:13","updatedBy":"admin"},
    {"beanName":"testTask","createTime":"2019-09-26 16:44:39","cronExpression":"0/5 * * * * ?","description":"不带参测试","email":"","id":3,"isPause":true,"jobName":"测试","methodName":"run","params":"","pauseAfterFailure":true,"personInCharge":"Zheng Jie","subTask":"5,6","updateTime":"2020-05-24 14:48:12","updatedBy":"admin"},
    {"beanName":"testTask","createTime":"2019-08-22 14:08:29","cronExpression":"0/5 * * * * ?","description":"带参测试，多参使用json","id":2,"isPause":true,"jobName":"测试1","methodName":"run1","params":"test","personInCharge":"测试","updateTime":"2020-05-24 13:58:33","updatedBy":"admin"}]

    res.json({
        totalElements: datas.length,
        content: datas
    })
})

router.get('/logs', (req: Request, res: Response<PageableBody<QuartzLogData>>) => {
    let datas: QuartzLogData[] = [{"beanName":"Test","createTime":"2020-12-26 15:35:50","cronExpression":"0/5 * * * * ?","exceptionDetail":"org.springframework.beans.factory.NoSuchBeanDefinitionException: No bean named 'Test' available\n\tat org.springframework.beans.factory.support.DefaultListableBeanFactory.getBeanDefinition(DefaultListableBeanFactory.java:772)\n\tat org.springframework.beans.factory.support.AbstractBeanFactory.getMergedLocalBeanDefinition(AbstractBeanFactory.java:1212)\n\tat org.springframework.beans.factory.support.AbstractBeanFactory.doGetBean(AbstractBeanFactory.java:294)\n\tat org.springframework.beans.factory.support.AbstractBeanFactory.getBean(AbstractBeanFactory.java:199)\n\tat org.springframework.context.support.AbstractApplicationContext.getBean(AbstractApplicationContext.java:1083)\n\tat me.zhengjie.utils.SpringContextHolder.getBean(SpringContextHolder.java:59)\n\tat me.zhengjie.modules.quartz.utils.QuartzRunnable.<init>(QuartzRunnable.java:38)\n\tat me.zhengjie.modules.quartz.utils.ExecutionJob.executeInternal(ExecutionJob.java:73)\n\tat org.springframework.scheduling.quartz.QuartzJobBean.execute(QuartzJobBean.java:75)\n\tat org.quartz.core.JobRunShell.run(JobRunShell.java:202)\n\tat org.quartz.simpl.SimpleThreadPool$WorkerThread.run(SimpleThreadPool.java:573)\n","id":426,"isSuccess":false,"jobName":"任务告警测试","methodName":"run","time":1},
    {"beanName":"testTask","createTime":"2020-12-26 15:35:50","cronExpression":"0/5 * * * * ?","id":425,"isSuccess":true,"jobName":"测试","methodName":"run","params":"","time":1},{"beanName":"testTask","createTime":"2020-12-26 15:35:50","cronExpression":"0/5 * * * * ?","id":424,"isSuccess":true,"jobName":"测试3","methodName":"run2","time":1},{"beanName":"testTask","createTime":"2020-12-26 15:35:50","cronExpression":"0/5 * * * * ?","id":423,"isSuccess":true,"jobName":"测试1","methodName":"run1","params":"test","time":3},{"beanName":"Test","createTime":"2020-12-26 15:35:45","cronExpression":"0/5 * * * * ?","exceptionDetail":"org.springframework.beans.factory.NoSuchBeanDefinitionException: No bean named 'Test' available\n\tat org.springframework.beans.factory.support.DefaultListableBeanFactory.getBeanDefinition(DefaultListableBeanFactory.java:772)\n\tat org.springframework.beans.factory.support.AbstractBeanFactory.getMergedLocalBeanDefinition(AbstractBeanFactory.java:1212)\n\tat org.springframework.beans.factory.support.AbstractBeanFactory.doGetBean(AbstractBeanFactory.java:294)\n\tat org.springframework.beans.factory.support.AbstractBeanFactory.getBean(AbstractBeanFactory.java:199)\n\tat org.springframework.context.support.AbstractApplicationContext.getBean(AbstractApplicationContext.java:1083)\n\tat me.zhengjie.utils.SpringContextHolder.getBean(SpringContextHolder.java:59)\n\tat me.zhengjie.modules.quartz.utils.QuartzRunnable.<init>(QuartzRunnable.java:38)\n\tat me.zhengjie.modules.quartz.utils.ExecutionJob.executeInternal(ExecutionJob.java:73)\n\tat org.springframework.scheduling.quartz.QuartzJobBean.execute(QuartzJobBean.java:75)\n\tat org.quartz.core.JobRunShell.run(JobRunShell.java:202)\n\tat org.quartz.simpl.SimpleThreadPool$WorkerThread.run(SimpleThreadPool.java:573)\n","id":422,"isSuccess":false,"jobName":"任务告警测试","methodName":"run","time":0},
    {"beanName":"testTask","createTime":"2020-12-26 15:35:45","cronExpression":"0/5 * * * * ?","id":421,"isSuccess":true,"jobName":"测试1","methodName":"run1","params":"test","time":1}]

    res.json({
        totalElements: 35,
        content: datas
    })
})

router.post('/', (req: Request, res: Response) => {
    let data = req.body as QuartzJobData
    if (data.description && data.jobName && data.beanName && data.methodName) {
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
    let data = req.body as QuartzJobData
    if (data.id && data.description && data.jobName && data.beanName && data.methodName) {
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

router.put('/exec/:id', (req: Request, res: Response) => {
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

router.put('/:id', (req: Request, res: Response) => {
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