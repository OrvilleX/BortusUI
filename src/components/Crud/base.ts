
import { Vue } from "vue-property-decorator";

export interface IDataStatus {
    delete: CRUD_TYPE
    edit: CRUD_TYPE
}

export abstract class Base<F> extends Vue {
    title = ""
    debug = false
    queryOnPresenterCreated = true
    loading = false
    downloadLoading = false
    delAllLoading = false
    dataStatus: Array<IDataStatus> = []

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
        throw new Error("wrong crud\'s cu status")
    }

    get dialogTitle() {
        return this.addStatus > CRUD_TYPE.NORMAL ? `新增${this.title}` : this.editStatus > CRUD_TYPE.NORMAL ? `编辑${this.title}` : this.title
    }

    abstract refresh(): Promise<void>

    /** 刷新 - 之前 */
    beforeRefresh(): boolean { return true }

    /** 刷新 - 之后 */
    afterRefresh() { }

    /** 删除 - 之前 */
    beforeDelete(data: any): boolean { return true }

    /** 删除 - 之后 */
    afterDelete(data: any) { }

    /** 删除取消 - 之前 */
    beforeDeleteCancel(data: any): boolean { return true }

    /** 删除取消 - 之后 */
    afterDeleteCancel(data: any) { }

    /** 新建 - 之前 */
    beforeToAdd(form: F): boolean { return true }

    /** 新建 - 之后 */
    afterToAdd(form: F) { }

    /** 编辑 - 之前 */
    beforeToEdit(form: F): boolean { return true }

    /** 编辑 - 之后 */
    afterToEdit(form: F) { }

    /** 开始 "新建/编辑" - 之前 */
    beforeToCU(form: F): boolean { return true }

    /** 开始 "新建/编辑" - 之后 */
    afterToCU(form: F) { }

    /** "新建/编辑" 验证 - 之前 */
    beforeValidateCU(): boolean { return true }

    /** "新建/编辑" 验证 - 之后 */
    afterValidateCU(): boolean { return true }

    /** 添加取消 - 之前 */
    beforeAddCancel(form: F): boolean { return true }

    /** 添加取消 - 之后 */
    afterAddCancel(form: F) { }

    /** 编辑取消 - 之前 */
    beforeEditCancel(form: F): boolean { return true }

    /** 编辑取消 - 之后 */
    afterEditCancel(form: F) { }

    /** 提交 - 之前 */
    beforeSubmit(): boolean { return true }

    /** 提交 - 之后 */
    afterSubmit() { }
    afterAddError() { }
    afterEditError() { }

    /**
     * 通用提示
     */
    protected notify(title: string, type = NOTIFICATION_TYPE.INFO) {
        this.$notify({
            title,
            type,
            message: "",
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

    protected toQuery() {
        this.page.page = 1
        this.refresh()
    }

    protected pageChangeHandler(e: number) {
        this.page.page = e
        this.refresh()
    }

    protected sizeChangeHandler(e: number) {
      this.page.size = e
      this.page.page = 1
      this.refresh()
    }
    
    protected getDataStatus(id: number | string) {
        return this.dataStatus[id]
    }
}

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