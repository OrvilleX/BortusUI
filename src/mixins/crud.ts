import { initData, download } from '@/api/data'
import { parseTime, downloadFile } from '@/utils/index'
import { checkPermission } from '@/utils/permission'
import { AxiosResponse } from 'axios'
import { ElForm } from 'element-ui/types/form'
import { MessageType } from 'element-ui/types/message'
import { Vue, Component } from 'vue-property-decorator'

interface CurdMethod<T> {
    add?: (form: T) => Promise<AxiosResponse<any>>
    del?: (ids: number[]) => Promise<AxiosResponse<any>>
    edit?: (form: T) => Promise<AxiosResponse<any>>
    get?: (id: number) => Promise<AxiosResponse<any>>
    delAll?: (ids: number[]) => Promise<AxiosResponse<any>>
}

@Component({
  name: 'CRUD'
})
export default class CRUD<T extends object, Q, D> extends Vue {
    data: D[] = []
    sort = ['id,desc']
    path = 0
    page = 0
    size = 10
    url = ''
    total = 0
    query!: Q
    form!: T
    resetForm!: T
    params: any = {}
    time = 50
    isAdd = false
    downloadLoading = false
    loading = true
    delLoading = false
    delAllLoading = false
    dialog = false
    title = ''
    crudMethod: CurdMethod<T> = {}

    parseTime = parseTime
    downloadFile = downloadFile
    checkPermission = checkPermission

    async init() {
      if (!await this.beforeInit()) {
        return
      }
      return new Promise((resolve, reject) => {
        this.loading = true
        // 请求数据
        initData<Q, D>(this.url, this.getQueryParame()).then(data => {
          this.total = data.data.totalElements
          this.data = data.data.content
          setTimeout(() => {
            this.loading = false
          }, this.time)
          resolve(data)
        }).catch(err => {
          this.loading = false
          reject(err)
        })
      })
    }

    beforeInit() {
      return true
    }

    getQueryParame() {
      return {
        page: this.page,
        size: this.size,
        sort: this.sort,
        ...this.query,
        ...this.params
      }
    }

    pageChange(e: number) {
      this.page = e - 1
      this.init()
    }

    sizeChange(e: number) {
      this.page = 0
      this.size = e
      this.init()
    }

    dleChangePage(size?: number) {
      if (size === undefined) {
        size = 1
      }
      if (this.data.length === size && this.page !== 0) {
        this.page = this.page - 1
      }
    }

    toQuery() {
      this.page = 0
      this.init()
    }

    submitSuccessNotify() {
      this.$notify({
        title: '提交成功',
        type: 'success',
        message: '',
        duration: 2500
      })
    }

    addSuccessNotify() {
      this.$notify({
        title: '新增成功',
        type: 'success',
        message: '',
        duration: 2500
      })
    }

    editSuccessNotify() {
      this.$notify({
        title: '编辑成功',
        type: 'success',
        message: '',
        duration: 2500
      })
    }

    delSuccessNotify() {
      this.$notify({
        title: '删除成功',
        type: 'success',
        message: '',
        duration: 2500
      })
    }

    notify(title: string, type: MessageType) {
      this.$notify({
        title: title,
        type: type,
        message: '',
        duration: 2500
      })
    }

    /**
     * 删除前可以调用 beforeDelMethod 做一些操作
     */
    beforeDelMethod() {
      return true
    }

    /**
     * 通用的删除
     */
    delMethod(id: number) {
      if (!this.beforeDelMethod()) {
        return
      }
      this.delLoading = true
      if (this.crudMethod.del) {
        this.crudMethod.del([id]).then(() => {
          this.delLoading = false;
          (this.$refs[id] as any).doClose()
          this.dleChangePage()
          this.delSuccessNotify()
          this.afterDelMethod()
          this.init()
        }).catch(() => {
          this.delLoading = false;
          (this.$refs[id] as any).doClose()
        })
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    afterDelMethod() { }

    /**
     * 多选删除提示
     */
    beforeDelAllMethod() {
      this.$confirm('你确定删除选中的数据吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.delAllMethod()
      })
    }

    /**
     * 多选删除
     */
    delAllMethod() {
      this.delAllLoading = true
      const data = (this.$refs.table as any).selection
      const ids: number[] = []
      for (let i = 0; i < data.length; i++) {
        ids.push(data[i].id)
      }
      if (this.crudMethod.delAll) {
        this.crudMethod.delAll(ids).then(() => {
          this.delAllLoading = false
          this.dleChangePage(ids.length)
          this.init()
          this.$notify({
            title: '删除成功',
            type: 'success',
            message: '',
            duration: 2500
          })
        }).catch(() => {
          this.delAllLoading = false
        })
      }
    }

    /**
     * 显示新增弹窗前可以调用该方法
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    beforeShowAddForm() { }

    /**
     * 显示新增弹窗
     */
    showAddFormDialog() {
      this.isAdd = true
      this.resetForm = JSON.parse(JSON.stringify(this.form))
      this.beforeShowAddForm()
      this.dialog = true
    }

    /**
     * 显示编辑弹窗前可以调用该方法
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    beforeShowEditForm(data = '') { }

    /**
     * 显示编辑弹窗
     */
    showEditFormDialog(data = '') {
      this.isAdd = false
      if (data) {
        this.resetForm = JSON.parse(JSON.stringify(this.form))
        this.form = JSON.parse(JSON.stringify(data))
      }
      this.beforeShowEditForm(data)
      this.dialog = true
    }

    /**
     * 新增方法
     */
    addMethod() {
      if (this.crudMethod.add) {
        this.crudMethod.add(this.form).then(() => {
          this.addSuccessNotify()
          this.loading = false
          this.afterAddMethod()
          this.cancel()
          this.init()
        }).catch(() => {
          this.loading = false
          this.afterAddErrorMethod()
        })
      }
    }

    /**
     * 新增后可以调用该方法
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    afterAddMethod() { }

    /**
     * 新增失败后调用该方法
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    afterAddErrorMethod() { }

    /**
     * 通用的编辑方法
     */
    editMethod() {
      if (this.crudMethod.edit) {
        this.crudMethod.edit(this.form).then(() => {
          this.editSuccessNotify()
          this.loading = false
          this.afterEditMethod()
          this.cancel()
          this.init()
        }).catch(() => {
          this.loading = false
        })
      }
    }

    /**
     * 编辑后可以调用该方法
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    afterEditMethod() { }

    /**
     * 提交前可以调用该方法
     */
    beforeSubmitMethod() {
      return true
    }

    /**
     * 提交
     */
    submitMethod() {
      if (!this.beforeSubmitMethod()) {
        return
      }
      if (this.$refs.form) {
        (this.$refs.form as ElForm).validate((valid) => {
          if (valid) {
            this.loading = true
            if (this.isAdd) {
              this.addMethod()
            } else this.editMethod()
          }
        })
      }
    }

    /**
     * 隐藏弹窗
     */
    cancel() {
      this.dialog = false
      if (this.$refs.form) {
        (this.$refs.form as ElForm).clearValidate()
        this.form = this.resetForm
      }
    }

    /**
     * 获取弹窗的标题
     */
    getFormTitle() {
      return this.isAdd ? `新增${this.title}` : `编辑${this.title}`
    }

    /**
     * 通用导出
     */
    downloadMethod() {
      this.beforeInit()
      this.downloadLoading = true
      download(this.url + '/download', this.params).then(result => {
        this.downloadFile(result.data, this.title + '数据', 'xlsx')
        this.downloadLoading = false
      }).catch(() => {
        this.downloadLoading = false
      })
    }
}
