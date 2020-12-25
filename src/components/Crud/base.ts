import { Vue, Component } from 'vue-property-decorator'
import { get as getDictDetail } from '@/api/system/dictDetail'

export enum NOTIFICATION_TYPE {
  SUCCESS = 'success',
  WARNING = 'warning',
  INFO = 'info',
  ERROR = 'error'
}

export enum CRUD_TYPE {
  NORMAL = 0,
  PREPARED = 1,
  PROCESSING = 2
}

export interface DataStatus {
    delete: CRUD_TYPE
    edit: CRUD_TYPE
}

@Component({})
export class Base<F> extends Vue {
    title = ''
    dicts: string[] = []
    debug = false
    props: any = {}
    queryOnPresenterCreated = true
    loading = false
    downloadLoading = false
    delAllLoading = false
    dataStatus: Array<DataStatus> = []
    dict: { dict: any, label: any } = {
      dict: {},
      label: {}
    }

    optShow = {
      add: true,
      edit: true,
      del: true,
      download: true,
      reset: true
    }

    msg = {
      submit: '提交成功',
      add: '新增成功',
      edit: '编辑成功',
      del: '删除成功'
    }

    page = {
      page: 0,
      size: 10,
      total: 0
    }

    /**
     * 当前新增、编辑状态
     */
    addStatus = CRUD_TYPE.NORMAL
    editStatus = CRUD_TYPE.NORMAL
    get status() {
      if (this.addStatus === CRUD_TYPE.NORMAL && this.editStatus === CRUD_TYPE.NORMAL) {
        return CRUD_TYPE.NORMAL
      } else if (this.addStatus === CRUD_TYPE.PREPARED || this.editStatus === CRUD_TYPE.PREPARED) {
        return CRUD_TYPE.PREPARED
      } else if (this.addStatus === CRUD_TYPE.PROCESSING || this.editStatus === CRUD_TYPE.PROCESSING) {
        return CRUD_TYPE.PROCESSING
      }
      throw new Error("wrong crud's cu status")
    }

    get dialogTitle() {
      return this.addStatus > CRUD_TYPE.NORMAL ? `新增${this.title}` : this.editStatus > CRUD_TYPE.NORMAL ? `编辑${this.title}` : this.title
    }

    refresh(): void { }

    /** 刷新 - 之前 */
    beforeRefresh(): boolean { return true }

    /** 刷新 - 之后 */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    afterRefresh() { }

    /** 删除 - 之前 */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    beforeDelete(data: any): boolean { return true }

    /** 删除 - 之后 */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    afterDelete(data: any) { }

    /** 删除取消 - 之前 */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    beforeDeleteCancel(data: any): boolean { return true }

    /** 删除取消 - 之后 */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    afterDeleteCancel(data: any) { }

    /** 新建 - 之前 */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    beforeToAdd(form: F): boolean { return true }

    /** 新建 - 之后 */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    afterToAdd(form: F) { }

    /** 编辑 - 之前 */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    beforeToEdit(form: F): boolean { return true }

    /** 编辑 - 之后 */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    afterToEdit(form: F) { }

    /** 开始 "新建/编辑" - 之前 */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    beforeToCU(form: F): boolean { return true }

    /**
     * 开始 "新建/编辑" - 之后
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    afterToCU(form: F) { }

    /**
     * "新建/编辑" 验证 - 之前
     */
    beforeValidateCU(): boolean { return true }

    /**
     * "新建/编辑" 验证 - 之后
     */
    afterValidateCU(): boolean { return true }

    /**
     * 添加取消 - 之前
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    beforeAddCancel(form: F): boolean { return true }

    /**
     * 添加取消 - 之后
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    afterAddCancel(form: F) {}

    /**
     *  编辑取消 - 之前
     * */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    beforeEditCancel(form: F): boolean { return true }

    /** 编辑取消 - 之后 */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    afterEditCancel(form: F) { }

    /** 提交 - 之前 */
    beforeSubmit(): boolean { return true }

    /** 提交 - 之后 */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    afterSubmit() { }
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    afterAddError() { }
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    afterEditError() { }

    created() {
      this.updateProp('searchToggle', true)
      if (this.dicts instanceof Array) {
        const ps: Promise<void>[] = [];
        this.dicts.forEach((n: string) => {
          Vue.set(this.dict.dict, n, {})
          Vue.set(this.dict.label, n, {})
          Vue.set(this.dict, n, [])
          ps.push(getDictDetail({ dictName: n }).then(data => {
            this.dict[n].splice(0, 0, ...data.data.content)
            data.data.content.forEach(d => {
              Vue.set(this.dict.dict[n], d.value!, d)
              Vue.set(this.dict.label[n], d.value!, d.label)
            })
          }))
        })
        Promise.all(ps).then(() => {
          this.$nextTick(() => {
            this.$emit('dictReady')
          })
        })
      }
    }

    /**
     * 通用提示
     */
    protected notify(title: string, type = NOTIFICATION_TYPE.INFO) {
      this.$notify({
        title,
        type,
        message: '',
        duration: 2500
      })
    }

    protected submitSuccessNotify() {
      this.notify(this.msg.submit, NOTIFICATION_TYPE.SUCCESS)
    }

    protected addSuccessNotify() {
      this.notify(this.msg.add, NOTIFICATION_TYPE.SUCCESS)
    }

    protected editSuccessNotify() {
      this.notify(this.msg.edit, NOTIFICATION_TYPE.SUCCESS)
    }

    protected delSuccessNotify() {
      this.notify(this.msg.del, NOTIFICATION_TYPE.SUCCESS)
    }

    public toQuery() {
      this.page.page = 1
      this.refresh()
    }

    protected pageChange(e: number) {
      this.page.page = e
      this.refresh()
    }

    protected sizeChange(e: number) {
      this.page.size = e
      this.page.page = 1
      this.refresh()
    }

    protected getDataStatus(id: number | string) {
      return this.dataStatus[id]
    }

    protected updateProp(name: string | number, value: any) {
      Vue.set(this.props, name, value)
    }
}
