import { initData, download } from '@/api/data'
import { downloadFile } from '@/utils/index'
import { AxiosResponse } from 'axios'
import { ElForm } from 'element-ui/types/form'
import { ElTable } from 'element-ui/types/table'
import { Vue, Watch } from 'vue-property-decorator'
import { Base, CRUD_TYPE, IDataStatus, NOTIFICATION_TYPE } from './base'

interface XTable extends ElTable {
  columns: ITableColumn[]
}

export type ITableColumn = {
  label?: string,
  property: string,
  type?: string,
  visible?: boolean,
  fixed?: boolean | string
}

/**
 * 增删改查请求API
 */
export interface ICurdMethod<T> {
  add?: (form: T) => Promise<AxiosResponse<any>>
  del?: (ids: number[]) => Promise<AxiosResponse<any>>
  edit?: (form: T) => Promise<AxiosResponse<any>>
  get?: (id: number) => Promise<AxiosResponse<any>>
}

export default class CRUD<T extends object, Q, D> extends Base<T> {
  tag = "default"
  idField = "id"
  url = ""
  sort = ['id,desc']
  time = 50
  defaultQuery = {}

  data: D[] = []
  selections: any[] = []
  query!: Q 
  params: any = {}
  form!: T
  defaultForm!: T

  crudMethod: ICurdMethod<T> = {}

  private getQueryParams() {
    Object.keys(this.query).length !== 0 && Object.keys(this.query).forEach(item => {
      if (this.query[item] === null || this.query[item] === '') this.query[item] = undefined
    })
    Object.keys(this.params).length !== 0 && Object.keys(this.params).forEach(item => {
      if (this.params[item] === null || this.params[item] === '') this.params[item] = undefined
    })
    return {
      page: this.page.page - 1,
      size: this.page.size,
      sort: this.sort,
      ...this.query,
      ...this.params
    }
  }

  async refresh() {
    if (!this.beforeRefresh()) {
      return
    }
    this.loading = true
    try {
      let res = await initData<Q, D>(this.url, this.getQueryParams())
      const table = this.getTable()
      if (table && table.lazy) {
        (table as any).store.states.treeData = {};
        (table as any).store.states.lazyTreeNodeMap = {};
      }
      this.page.total = res.data.totalElements
      this.data = res.data.content
      this.resetDataStatus()
      setTimeout(() => {
        this.loading = false
        this.afterRefresh()
      }, this.time)
    } catch (err) {
      this.loading = false
    }
  }

  toAdd() {
    this.resetForm()
    if (!(this.beforeToAdd(this.form) && this.beforeToCU(this.form))) {
      return
    }
    this.addStatus = CRUD_TYPE.PREPARED

    this.afterToAdd(this.form)
    this.afterToCU(this.form)
  }

  toEdit(data: any) {
    this.resetForm(JSON.parse(JSON.stringify(data)))
    if (!(this.beforeToEdit(this.form) && this.beforeToCU(this.form))) {
      return
    }
    this.editStatus = CRUD_TYPE.PREPARED
    this.getDataStatus(this.getDataId(data)).edit = CRUD_TYPE.PREPARED

    this.afterToEdit(this.form)
    this.afterToCU(this.form)
  }

  toDelete(data: any) {
    this.getDataStatus(this.getDataId(data)).delete = CRUD_TYPE.PREPARED
  }

  cancelDelete(data: any) {
    if (!this.beforeDeleteCancel(data)) {
      return
    }
    this.getDataStatus(this.getDataId(data)).delete = CRUD_TYPE.NORMAL
    this.afterDeleteCancel(data)
  }

  private cancelCU() {
    let add_status = this.addStatus
    let edit_status = this.editStatus
    if (add_status === CRUD_TYPE.PREPARED) {
      if (!this.beforeAddCancel(this.form)) {
        return
      }
      this.addStatus = CRUD_TYPE.NORMAL
    }
    if (edit_status === CRUD_TYPE.PREPARED) {
      if (!this.beforeEditCancel(this.form)) {
        return
      }
      this.editStatus = CRUD_TYPE.NORMAL
      this.getDataStatus(this.getDataId(this.form)).edit = CRUD_TYPE.NORMAL
    }
    this.resetForm()

    if (add_status === CRUD_TYPE.PREPARED) {
      this.afterAddCancel(this.form)
    }
    if (edit_status === CRUD_TYPE.PREPARED) {
      this.afterEditCancel(this.form)
    }
    if (this.$refs['form'] as ElForm) {
      (this.$refs['form'] as ElForm).clearValidate()
    }
  }

  private submitCU() {
    if (!this.beforeValidateCU()) {
      return
    }
    (this.$refs['form'] as ElForm).validate(valid => {
      if (!valid) {
        return
      }
      if (!this.afterValidateCU()) {
        return
      }
      if (this.addStatus === CRUD_TYPE.PREPARED) {
        this.doAdd()
      } else if (this.editStatus === CRUD_TYPE.PREPARED) {
        this.doEdit()
      }
    })
  }

  private async doAdd() {
    if (!this.beforeSubmit()) {
      return
    }
    this.addStatus = CRUD_TYPE.PROCESSING
    if (this.crudMethod.add) {
      try {
        await this.crudMethod.add(this.form)
        this.addStatus = CRUD_TYPE.NORMAL
        this.resetForm()
        this.addSuccessNotify()
        this.afterSubmit()
        this.toQuery()
      } catch (err) {
        this.addStatus = CRUD_TYPE.PREPARED
        this.afterAddError()
      }
    }
  }

  private async doEdit() {
    if (!this.beforeSubmit()) {
      return
    }
    this.editStatus = CRUD_TYPE.PROCESSING
    if (this.crudMethod.edit) {
      try {
        await this.crudMethod.edit(this.form)
        this.editStatus = CRUD_TYPE.NORMAL
        this.getDataStatus(this.getDataId(this.form)).edit = CRUD_TYPE.NORMAL
        this.editSuccessNotify()
        this.resetForm()
        this.afterSubmit()
        this.refresh()
      } catch (err) {
        this.editStatus = CRUD_TYPE.PREPARED
        this.afterEditError()
      }
    }
  }

  async doDelete(data: any) {
    let delAll = false
    let dataStatus: IDataStatus = {
      delete: CRUD_TYPE.NORMAL,
      edit: CRUD_TYPE.NORMAL
    }
    const ids: number[] = []
    if (data instanceof Array) {
      delAll = true
      data.forEach(val => {
        ids.push(this.getDataId(val))
      })
    } else {
      ids.push(this.getDataId(data))
      dataStatus = this.getDataStatus(this.getDataId(data))
    }
    if (!this.beforeDelete(data)) {
      return
    }
    if (!delAll) {
      dataStatus.delete = CRUD_TYPE.PROCESSING
    }
    if (this.crudMethod.del) {
      try {
        await this.crudMethod.del(ids)
        if (delAll) {
          this.delAllLoading = false
        } else dataStatus.delete = CRUD_TYPE.PREPARED
        this.dleChangePage(1)
        this.delSuccessNotify()
        this.afterDelete(data)
        this.refresh()
      } catch (err) {
        if (delAll) {
          this.delAllLoading = false
        } else dataStatus.delete = CRUD_TYPE.PREPARED
      }
    }
  }

  private async doExport() {
      this.downloadLoading = true
      try {
      let res = await download(this.url + '/download', this.getQueryParams())
      downloadFile(res.data, this.title + '数据', 'xlsx')
        this.downloadLoading = false
      } catch(err) {
        this.downloadLoading = false
      }
  }

  protected dleChangePage(size: number) {
    if (this.data.length === size && this.page.page !== 1) {
      this.page.page -= 1
    }
  }

  private selectionChangeHandler(val: any[]) {
    this.selections = val
  }

  protected resetQuery(toQuery = true) {
    const defaultQuery = JSON.parse(JSON.stringify(this.defaultQuery))
    const query = this.query
    Object.keys(query).forEach(key => {
      query[key] = defaultQuery[key]
    })
    this.params = {}
    if (toQuery) {
      this.toQuery()
    }
  }

  protected resetForm(data?: T) {
    const form = data || (typeof this.defaultForm === 'object' ? JSON.parse(JSON.stringify(this.defaultForm)) : this.defaultForm)
    const crudFrom = this.form
    for (const key in form) {
      if (crudFrom.hasOwnProperty(key)) {
        crudFrom[key] = form[key]
      } else {
        Vue.set(crudFrom, key, form[key])
      }
    }
  }

  resetDataStatus() {
    const dataStatus: IDataStatus[] = []
    let resetStatus = (datas: any) => {
      datas.forEach((e: any) => {
        dataStatus[this.getDataId(e)] = {
          delete: 0,
          edit: 0
        }
        if (e.children) {
          resetStatus(e.children)
        }
      })
    }
    resetStatus(this.data)
    this.dataStatus = dataStatus
  }

  private selectAllChange(selection: any[]) {
    if (selection && selection.length === this.data.length) {
      selection.forEach(val => {
        this.selectChange(selection, val)
      })
    } else {
      this.getTable().clearSelection()
    }
  }

  private selectChange(selection: any[], row: any) {
    if (selection.find(val => { return this.getDataId(val) === this.getDataId(row) })) {
      if (row.children) {
        row.children.forEach((val: any) => {
          this.getTable().toggleRowSelection(val, true)
          selection.push(val)
          if (val.children) {
            this.selectChange(selection, val)
          }
        })
      }
    } else {
      this.toggleRowSelection(selection, row)
    }
  }

  private toggleRowSelection(selection: any[], data: any) {
    if (data.children) {
      data.children.forEach((val: any) => {
        this.getTable().toggleRowSelection(val, false)
        if (val.children) {
          this.toggleRowSelection(selection, val)
        }
      })
    }
  }

  getDataId(data: any) {
    return data[this.idField]
  }

  attchTable() {
    const table = this.getTable()
    this.updateProp('table', table)
    const that = this
    table.$on('expand-change', (row: any, expanded: any) => {
      if (!expanded) {
        return
      }
      const lazyTreeNodeMap = (table as any).store.states.lazyTreeNodeMap
      row.children = lazyTreeNodeMap[this.getDataId(row)]
      if (row.children) {
        row.children.forEach((ele: any) => {
          const id = this.getDataId(ele)
          if (that.dataStatus[id] === undefined) {
            that.dataStatus[id] = {
              delete: 0,
              edit: 0
            }
          }
        })
      }
    })
  }

      /**
     * CRUD通用功能
     */
    private hiddenColumns:string[] = []
    private ignoreColumns:string[] = []
    private tableColumns:ITableColumn[] = []
    private allColumnsSelected = false
    private allColumnsSelectedIndeterminate = false
    private ignoreNextTableColumnsChange = false

    private sortWithRef(src: any, ref: any) {
        const result = Object.assign([], ref)
        let cursor = -1
        src.forEach((e: any) => {
          const idx = result.indexOf(e)
          if (idx === -1) {
            cursor += 1
            result.splice(cursor, 0, e)
          } else {
            cursor = idx
          }
        })
        return result
    }

    @Watch("$refs.table")
    private onTableChange() {
        this.updateTableColumns()
        this.tableColumns.forEach(column => {
          if (this.hiddenColumns.indexOf(column.property) !== -1) {
            column.visible = false
            this.updateColumnVisible(column)
          }
        })
    }

    @Watch("$refs.table.store.states.columns")
    private onTableStoreColumnsChange() {
        this.updateTableColumns()
    }

    private updateTableColumns() {
        const table = this.getTable()
        if (!table) {
          this.tableColumns = []
          return
        }
        let cols = null
        const columnFilter = (e: ITableColumn) => e && e.type === 'default' && e.property && this.ignoreColumns.indexOf(e.property) === -1
        const refCols = table.columns.filter(columnFilter)
        if (this.ignoreNextTableColumnsChange) {
          this.ignoreNextTableColumnsChange = false
          return
        }
        this.ignoreNextTableColumnsChange = false
        const columns: ITableColumn[] = []
        const fullTableColumns = table.$children.map((e: any) => e.columnConfig).filter(columnFilter)
        cols = this.sortWithRef(fullTableColumns, refCols)
        cols.forEach((config: any) => {
          const column = {
            property: config.property,
            label: config.label,
            visible: refCols.indexOf(config) !== -1
          }
          columns.push(column)
        })
        this.tableColumns = columns
      }

      private toTableDelete(datas: any) {
        this.$confirm(`确认删除选中的${datas.length}条数据?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.delAllLoading = true
          this.doDelete(datas)
        }).catch(() => {
        })
      }

      private handleCheckAllChange(val: boolean) {
        if (val === false) {
          this.allColumnsSelected = true
          return
        }
        this.tableColumns.forEach(column => {
          if (!column.visible) {
            column.visible = true
            this.updateColumnVisible(column)
          }
        })
        this.allColumnsSelected = val
        this.allColumnsSelectedIndeterminate = false
      }

      private handleCheckedTableColumnsChange(item: ITableColumn) {
        let totalCount = 0
        let selectedCount = 0
        this.tableColumns.forEach(column => {
          ++totalCount
          selectedCount += column.visible ? 1 : 0
        })
        if (selectedCount === 0) {
          this.notify('请至少选择一列', NOTIFICATION_TYPE.WARNING)
          this.$nextTick(function() {
            item.visible = true
          })
          return
        }
        this.allColumnsSelected = selectedCount === totalCount
        this.allColumnsSelectedIndeterminate = selectedCount !== totalCount && selectedCount !== 0
        this.updateColumnVisible(item)
      }

      protected getTable() {
        return this.$refs.table as XTable
      }

      private updateColumnVisible(item: ITableColumn) {
        const table = this.getTable()
        const vm = table.$children.find((e: any) => e.prop === item.property) as any
        const columnConfig = vm.columnConfig
        if (item.visible) {
          const columnIndex = this.tableColumns.indexOf(item)
          vm.owner.store.commit('insertColumn', columnConfig, columnIndex + 1, null)
        } else {
          vm.owner.store.commit('removeColumn', columnConfig, null)
        }
        this.ignoreNextTableColumnsChange = true
      }

      private toggleSearch() {
        this.props.searchToggle = !this.props.searchToggle
      }
}
