import { initData, download } from '@/api/data'
import { parseTime, downloadFile } from '@/utils/index'
import { AxiosResponse } from 'axios'
import { ElForm } from 'element-ui/types/form'
import Vue from 'vue'
import { Base, CRUD_TYPE, IDataStatus } from './base'

/**
 * 增删改查请求API
 */
export interface ICurdMethod<T> {
  add?: (form: T) => Promise<AxiosResponse<any>>
  del?: (id: number | number[]) => Promise<AxiosResponse<any>>
  edit?: (form: T) => Promise<AxiosResponse<any>>
  get?: (id: number) => Promise<AxiosResponse<any>>
}

export default class CRUD<F, Q, D> extends Base<F> {
  tag = "default"
  idField = "id"
  url = ""
  sort = ['id,desc']
  time = 50

  props = {}

  data: D[] = []
  selections: any[] = []
  query: any = {}
  params: any = {}
  form: any = {}
  crudMethod: ICurdMethod<F> = {}

  defaultForm() {
  }

  /**
   * 获取查询对象
   */
  private getQueryParams() {
    // 清除参数无值的情况
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

  protected async refresh() {
    if (!this.beforeRefresh()) {
      return
    }
    this.loading = true
    try {
      let res = await initData<Q, D>(this.url, this.getQueryParams())
      const table = this.getTable()
      if (table && table.lazy) {
        table.store.states.treeData = {}
        table.store.states.lazyTreeNodeMap = {}
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
    if (this.addStatus === CRUD_TYPE.PREPARED) {
      if (!this.beforeAddCancel(this.form)) {
        return
      }
      this.addStatus = CRUD_TYPE.NORMAL
    }
    if (this.editStatus === CRUD_TYPE.PREPARED) {
      if (!this.beforeEditCancel(this.form)) {
        return
      }
      this.editStatus = CRUD_TYPE.NORMAL
      this.getDataStatus(this.getDataId(this.form)).edit = CRUD_TYPE.NORMAL
    }
    this.resetForm()

    if (this.addStatus === CRUD_TYPE.PREPARED) {
      this.afterAddCancel(this.form)
    }
    if (this.editStatus === CRUD_TYPE.PREPARED) {
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

  private async doDelete(data: any) {
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

  private dleChangePage(size: number) {
    if (this.data.length === size && this.page.page !== 1) {
      this.page.page -= 1
    }
  }


}

/**
 * 通用CRUD组件
 */
function CRUDs(options) {

  const methods = {
    // 选择改变
    selectionChangeHandler(val) {
      crud.selections = val
    },
    /**
     * 重置查询参数
     * @param {Boolean} toQuery 重置后进行查询操作
     */
    resetQuery(toQuery = true) {
      const defaultQuery = JSON.parse(JSON.stringify(crud.defaultQuery))
      const query = crud.query
      Object.keys(query).forEach(key => {
        query[key] = defaultQuery[key]
      })
      // 重置参数
      this.params = {}
      if (toQuery) {
        crud.toQuery()
      }
    },
    /**
     * 重置表单
     * @param {Array} data 数据
     */
    resetForm(data) {
      const form = data || (typeof crud.defaultForm === 'object' ? JSON.parse(JSON.stringify(crud.defaultForm)) : crud.defaultForm.apply(crud.findVM('form')))
      const crudFrom = crud.form
      for (const key in form) {
        if (crudFrom.hasOwnProperty(key)) {
          crudFrom[key] = form[key]
        } else {
          Vue.set(crudFrom, key, form[key])
        }
      }
    },
    /**
     * 重置数据状态
     */
    resetDataStatus() {
      const dataStatus = {}
      function resetStatus(datas) {
        datas.forEach(e => {
          dataStatus[crud.getDataId(e)] = {
            delete: 0,
            edit: 0
          }
          if (e.children) {
            resetStatus(e.children)
          }
        })
      }
      resetStatus(crud.data)
      crud.dataStatus = dataStatus
    },
    /**
     * 获取数据状态
     * @param {Number | String} id 数据项id
     */
    getDataStatus(id) {
      return crud.dataStatus[id]
    },
    /**
     * 用于树形表格多选, 选中所有
     * @param selection
     */
    selectAllChange(selection) {
      // 如果选中的数目与请求到的数目相同就选中子节点，否则就清空选中
      if (selection && selection.length === crud.data.length) {
        selection.forEach(val => {
          crud.selectChange(selection, val)
        })
      } else {
        crud.getTable().clearSelection()
      }
    },
    /**
     * 用于树形表格多选，单选的封装
     * @param selection
     * @param row
     */
    selectChange(selection, row) {
      // 如果selection中存在row代表是选中，否则是取消选中
      if (selection.find(val => { return crud.getDataId(val) === crud.getDataId(row) })) {
        if (row.children) {
          row.children.forEach(val => {
            crud.getTable().toggleRowSelection(val, true)
            selection.push(val)
            if (val.children) {
              crud.selectChange(selection, val)
            }
          })
        }
      } else {
        crud.toggleRowSelection(selection, row)
      }
    },
    /**
     * 切换选中状态
     * @param selection
     * @param data
     */
    toggleRowSelection(selection, data) {
      if (data.children) {
        data.children.forEach(val => {
          crud.getTable().toggleRowSelection(val, false)
          if (val.children) {
            crud.toggleRowSelection(selection, val)
          }
        })
      }
    },
    findVM(type) {
      return crud.vms.find(vm => vm && vm.type === type).vm
    },
    updateProp(name, value) {
      Vue.set(crud.props, name, value)
    },
    getDataId(data) {
      return data[this.idField]
    },
    getTable() {
      return this.findVM('presenter').$refs.table
    },
    attchTable() {
      const table = this.getTable()
      this.updateProp('table', table)
      const that = this
      table.$on('expand-change', (row, expanded) => {
        if (!expanded) {
          return
        }
        const lazyTreeNodeMap = table.store.states.lazyTreeNodeMap
        row.children = lazyTreeNodeMap[crud.getDataId(row)]
        if (row.children) {
          row.children.forEach(ele => {
            const id = crud.getDataId(ele)
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
  }
  const crud = Object.assign({}, data)
  // 可观测化
  Vue.observable(crud)
  // 附加方法
  Object.assign(crud, methods)
  // 记录初始默认的查询参数，后续重置查询时使用
  Object.assign(crud, {
    defaultQuery: JSON.parse(JSON.stringify(data.query)),
    // 预留4位存储：组件 主页、头部、分页、表单，调试查看也方便找
    vms: Array(4),
    /**
     * 注册组件实例
     * @param {String} type 类型
     * @param {*} vm 组件实例
     * @param {Number} index 该参数内部使用
     */
    registerVM(type, vm, index = -1) {
      const vmObj = {
        type,
        vm: vm
      }
      if (index < 0) {
        this.vms.push(vmObj)
        return
      }
      if (index < 4) { // 内置预留vm数
        this.vms[index] = vmObj
        return
      }
      this.vms.length = Math.max(this.vms.length, index)
      this.vms.splice(index, 1, vmObj)
    },
    /**
     * 取消注册组件实例
     * @param {*} vm 组件实例
     */
    unregisterVM(type, vm) {
      for (let i = this.vms.length - 1; i >= 0; i--) {
        if (this.vms[i] === undefined) {
          continue
        }
        if (this.vms[i].type === type && this.vms[i].vm === vm) {
          if (i < 4) { // 内置预留vm数
            this.vms[i] = undefined
          } else {
            this.vms.splice(i, 1)
          }
          break
        }
      }
    }
  })
  // 冻结处理，需要扩展数据的话，使用crud.updateProp(name, value)，以crud.props.name形式访问，这个是响应式的，可以做数据绑定
  Object.freeze(crud)
  return crud
}

// hook VM
function callVmHook(crud, hook) {
  if (crud.debug) {
    console.log('callVmHook: ' + hook)
  }
  const tagHook = crud.tag ? hook + '$' + crud.tag : null
  let ret = true
  const nargs = [crud]
  for (let i = 2; i < arguments.length; ++i) {
    nargs.push(arguments[i])
  }
  // 有些组件扮演了多个角色，调用钩子时，需要去重
  const vmSet = new Set()
  crud.vms.forEach(vm => vm && vmSet.add(vm.vm))
  vmSet.forEach(vm => {
    if (vm[hook]) {
      ret = vm[hook].apply(vm, nargs) !== false && ret
    }
    if (tagHook && vm[tagHook]) {
      ret = vm[tagHook].apply(vm, nargs) !== false && ret
    }
  })
  return ret
}

function mergeOptions(src, opts) {
  const optsRet = {
    ...src
  }
  for (const key in src) {
    if (opts.hasOwnProperty(key)) {
      optsRet[key] = opts[key]
    }
  }
  return optsRet
}

/**
 * 查找crud
 * @param {*} vm
 * @param {string} tag
 */
function lookupCrud(vm, tag) {
  tag = tag || vm.$attrs['crud-tag'] || 'default'
  // function lookupCrud(vm, tag) {
  if (vm.$crud) {
    const ret = vm.$crud[tag]
    if (ret) {
      return ret
    }
  }
  return vm.$parent ? lookupCrud(vm.$parent, tag) : undefined
}

/**
 * crud主页
 */
function presenter(crud) {
  if (crud) {
    console.warn('[CRUD warn]: ' + 'please use $options.cruds() { return CRUD(...) or [CRUD(...), ...] }')
  }
  return {
    data() {
      // 在data中返回crud，是为了将crud与当前实例关联，组件观测crud相关属性变化
      return {
        crud: this.crud
      }
    },
    beforeCreate() {
      this.$crud = this.$crud || {}
      let cruds = this.$options.cruds instanceof Function ? this.$options.cruds() : crud
      if (!(cruds instanceof Array)) {
        cruds = [cruds]
      }
      cruds.forEach(ele => {
        if (this.$crud[ele.tag]) {
          console.error('[CRUD error]: ' + 'crud with tag [' + ele.tag + ' is already exist')
        }
        this.$crud[ele.tag] = ele
        ele.registerVM('presenter', this, 0)
      })
      this.crud = this.$crud['defalut'] || cruds[0]
    },
    methods: {
      parseTime
    },
    created() {
      for (const k in this.$crud) {
        if (this.$crud[k].queryOnPresenterCreated) {
          this.$crud[k].toQuery()
        }
      }
    },
    destroyed() {
      for (const k in this.$crud) {
        this.$crud[k].unregisterVM('presenter', this)
      }
    },
    mounted() {
      // 如果table未实例化（例如使用了v-if），请稍后在适当时机crud.attchTable刷新table信息
      if (this.$refs.table !== undefined) {
        this.crud.attchTable()
      }
    }
  }
}

/**
 * 头部
 */
function header() {
  return {
    data() {
      return {
        crud: this.crud,
        query: this.crud.query
      }
    },
    beforeCreate() {
      this.crud = lookupCrud(this)
      this.crud.registerVM('header', this, 1)
    },
    destroyed() {
      this.crud.unregisterVM('header', this)
    }
  }
}

/**
 * 分页
 */
function pagination() {
  return {
    data() {
      return {
        crud: this.crud,
        page: this.crud.page
      }
    },
    beforeCreate() {
      this.crud = lookupCrud(this)
      this.crud.registerVM('pagination', this, 2)
    },
    destroyed() {
      this.crud.unregisterVM('pagination', this)
    }
  }
}

/**
 * 表单
 */
function form(defaultForm) {
  return {
    data() {
      return {
        crud: this.crud,
        form: this.crud.form
      }
    },
    beforeCreate() {
      this.crud = lookupCrud(this)
      this.crud.registerVM('form', this, 3)
    },
    created() {
      this.crud.defaultForm = defaultForm
      this.crud.resetForm()
    },
    destroyed() {
      this.crud.unregisterVM('form', this)
    }
  }
}

/**
 * crud
 */
function crud(options = {}) {
  const defaultOptions = {
    type: undefined
  }
  options = mergeOptions(defaultOptions, options)
  return {
    data() {
      return {
        crud: this.crud
      }
    },
    beforeCreate() {
      this.crud = lookupCrud(this)
      this.crud.registerVM(options.type, this)
    },
    destroyed() {
      this.crud.unregisterVM(options.type, this)
    }
  }
}

export {
  presenter,
  header,
  form,
  pagination,
  crud
}
