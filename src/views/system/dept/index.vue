<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="props.searchToggle">
        <!-- 搜索 -->
        <el-input
          v-model="query.name"
          clearable
          size="small"
          placeholder="输入部门名称搜索"
          style="width: 200px"
          class="filter-item"
          @keyup.enter.native="toQuery"
        />
        <date-range-picker v-model="query.createTime" class="date-item" />
        <el-select
          v-model="query.enabled"
          clearable
          size="small"
          placeholder="状态"
          class="filter-item"
          style="width: 90px"
          @change="toQuery"
        >
          <el-option
            v-for="item in enabledTypeOptions"
            :key="item.key"
            :label="item.displayName"
            :value="item.key"
          />
        </el-select>
        <span>
          <el-button
            class="filter-item"
            size="mini"
            type="success"
            icon="el-icon-search"
            @click="toQuery"
            >搜索</el-button
          >
          <el-button
            v-if="optShow.reset"
            class="filter-item"
            size="mini"
            type="warning"
            icon="el-icon-refresh-left"
            @click="resetQuery()"
            >重置</el-button
          >
        </span>
      </div>
      <div class="crud-opts">
        <span class="crud-opts-left">
          <!--左侧插槽-->
          <slot name="left" />
          <el-button
            v-if="optShow.add"
            v-permission="permission.add"
            class="filter-item"
            size="mini"
            type="primary"
            icon="el-icon-plus"
            @click="toAdd"
          >
            新增
          </el-button>
          <el-button
            v-if="optShow.edit"
            v-permission="permission.edit"
            class="filter-item"
            size="mini"
            type="success"
            icon="el-icon-edit"
            :disabled="selections.length !== 1"
            @click="toEdit(selections[0])"
          >
            修改
          </el-button>
          <el-button
            v-if="optShow.del"
            slot="reference"
            v-permission="permission.del"
            class="filter-item"
            type="danger"
            icon="el-icon-delete"
            size="mini"
            :loading="delAllLoading"
            :disabled="selections.length === 0"
            @click="toTableDelete(selections)"
          >
            删除
          </el-button>
          <el-button
            v-if="optShow.download"
            :loading="downloadLoading"
            :disabled="!data.length"
            class="filter-item"
            size="mini"
            type="warning"
            icon="el-icon-download"
            @click="doExport"
            >导出</el-button
          >
          <!--右侧-->
          <slot name="right" />
        </span>
        <el-button-group class="crud-opts-right">
          <el-button
            size="mini"
            plain
            type="info"
            icon="el-icon-search"
            @click="toggleSearch()"
          />
          <el-button size="mini" icon="el-icon-refresh" @click="refresh()" />
          <el-popover placement="bottom-end" width="150" trigger="click">
            <el-button slot="reference" size="mini" icon="el-icon-s-grid">
              <i class="fa fa-caret-down" aria-hidden="true" />
            </el-button>
            <el-checkbox
              v-model="allColumnsSelected"
              :indeterminate="allColumnsSelectedIndeterminate"
              @change="handleCheckAllChange"
            >
              全选
            </el-checkbox>
            <el-checkbox
              v-for="item in tableColumns"
              :key="item.property"
              v-model="item.visible"
              @change="handleCheckedTableColumnsChange(item)"
            >
              {{ item.label }}
            </el-checkbox>
          </el-popover>
        </el-button-group>
      </div>
    </div>
    <!--表单组件-->
    <el-dialog
      append-to-body
      :close-on-click-modal="false"
      :before-close="cancelCU"
      :visible="status > 0"
      :title="dialogTitle"
      width="500px"
    >
      <el-form
        ref="form"
        inline
        :model="form"
        :rules="rules"
        size="small"
        label-width="80px"
      >
        <el-form-item label="部门名称" prop="name">
          <el-input v-model="form.name" style="width: 370px" />
        </el-form-item>
        <el-form-item label="部门排序" prop="deptSort">
          <el-input-number
            v-model.number="form.deptSort"
            :min="0"
            :max="999"
            controls-position="right"
            style="width: 370px"
          />
        </el-form-item>
        <el-form-item label="顶级部门">
          <el-radio-group v-model="form.isTop" style="width: 140px">
            <el-radio label="1">是</el-radio>
            <el-radio label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="状态" prop="enabled">
          <el-radio
            v-for="item in dict.dept_status"
            :key="item.id"
            v-model="form.enabled"
            :label="item.value === 'true' ? true : false"
            >{{ item.label }}</el-radio
          >
        </el-form-item>
        <el-form-item
          v-if="form.isTop === '0'"
          style="margin-bottom: 0"
          label="上级部门"
          prop="pid"
        >
          <treeselect
            v-model="form.pid"
            :load-options="loadDepts"
            :options="depts"
            style="width: 370px"
            placeholder="选择上级类目"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="cancelCU">取消</el-button>
        <el-button :loading="status === 2" type="primary" @click="submitCU"
          >确认</el-button
        >
      </div>
    </el-dialog>
    <!--表格渲染-->
    <el-table
      ref="table"
      v-loading="loading"
      lazy
      :load="getDeptDatas"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      :data="data"
      row-key="id"
      @select="selectChange"
      @select-all="selectAllChange"
      @selection-change="selectionChangeHandler"
    >
      <el-table-column :selectable="checkboxT" type="selection" width="55" />
      <el-table-column label="名称" prop="name" />
      <el-table-column label="排序" prop="deptSort" />
      <el-table-column label="状态" align="center" prop="enabled">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.enabled"
            :disabled="scope.row.id === 1"
            active-color="#409EFF"
            inactive-color="#F56C6C"
            @change="changeEnabled(scope.row, scope.row.enabled)"
          />
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建日期">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-permission="['admin', 'dept:edit', 'dept:del']"
        label="操作"
        width="130px"
        align="center"
        fixed="right"
      >
        <template slot-scope="scope">
          <div>
            <el-button
              v-permission="permission.edit"
              :loading="status === 2"
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="toEdit(scope.row)"
            />
            <span>
              <el-button
                :loading="dataStatus[getDataId(scope.row)].delete === 2"
                :disabled="scope.row.id === 1"
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="toDeleteUD(scope.row)"
              />
            </span>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import crudDept from '@/api/system/dept'
import Treeselect, { LOAD_CHILDREN_OPTIONS } from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { parseTime } from '@/utils/index'
import CRUD from '@/components/Crud'
import DateRangePicker from '@/components/DateRangePicker/Index.vue'
import { mixins } from 'vue-class-component'
import { DeptData, DeptQueryData, DeptDtoData } from '@/types/dept'
import { NOTIFICATION_TYPE } from '@/components/Crud/base'

@Component({
  name: 'Dept',
  components: {
    Treeselect,
    DateRangePicker
  }
})
export default class extends mixins<
  CRUD<DeptData, DeptQueryData, DeptDtoData>
>(CRUD) {
  parseTime = parseTime;
  dicts = ['dept_status'];

  private depts: DeptDtoData[] = [];
  private rules = {
    name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
    deptSort: [
      {
        required: true,
        message: '请输入序号',
        trigger: 'blur',
        type: 'number'
      }
    ]
  };

  private permission = {
    add: ['admin', 'dept:add'],
    edit: ['admin', 'dept:edit'],
    del: ['admin', 'dept:del']
  };

  private enabledTypeOptions = [
    { key: 'true', displayName: '正常' },
    { key: 'false', displayName: '禁用' }
  ];

  constructor() {
    super()
    this.query = {}
    this.form = {}
  }

  created() {
    this.title = '部门'
    this.url = 'api/dept'
    this.crudMethod = { ...crudDept }
    this.defaultForm = {
      id: NaN,
      name: '',
      isTop: '1',
      subCount: 0,
      pid: NaN,
      deptSort: 999,
      enabled: true
    }
    this.resetForm()
    if (this.queryOnPresenterCreated) {
      this.toQuery()
    }
  }

  private getDeptDatas(tree: DeptDtoData, treeNode: any, resolve: Function) {
    const params = { pid: tree.id }
    setTimeout(async() => {
      const res = await crudDept.getDepts(params)
      resolve(res.data.content)
    }, 100)
  }

  afterToCU(form: DeptData) {
    if (form.pid !== null) {
      form.isTop = '0'
    } else if (form.id !== null) {
      form.isTop = '1'
    }
    if (form.id != null) {
      this.getSupDepts(form.id)
    } else {
      this.getDepts()
    }
  }

  private getSupDepts(id: number) {
    crudDept.getDeptSuperior([id]).then((res) => {
      const date = res.data.content
      this.buildDepts(date)
      this.depts = date
    })
  }

  private buildDepts(depts: DeptDtoData[]) {
    depts.forEach((data) => {
      if (data.children) {
        this.buildDepts(data.children)
      }
      if (data.hasChildren && !data.children) {
        data.children = []
      }
    })
  }

  private getDepts() {
    crudDept.getDepts({ enabled: true }).then((res) => {
      this.depts = res.data.content.map((data) => {
        if (data.hasChildren) {
          data.children = []
        }
        return data
      })
    })
  }

  private loadDepts(element: {
    action: any
    parentNode: any
    callback: Function
  }) {
    if (element.action === LOAD_CHILDREN_OPTIONS) {
      crudDept
        .getDepts({ enabled: true, pid: element.parentNode.id })
        .then((res) => {
          element.parentNode.children = res.data.content.map((data) => {
            if (data.hasChildren) {
              data.children = []
            }
            return data
          })
          setTimeout(() => {
            element.callback()
          }, 100)
        })
    }
  }

  afterValidateCU() {
    if (this.form.pid !== null && this.form.pid === this.form.id) {
      this.$message({
        message: '上级部门不能为空',
        type: 'warning'
      })
      return false
    }
    if (this.form.isTop === '1') {
      this.form.pid = NaN
    }
    return true
  }

  private changeEnabled(data: DeptDtoData, val: boolean) {
    this.$confirm(
      '此操作将 "' +
        this.dict.label.dept_status[val ? 'true' : 'false'] +
        '" ' +
        data.name +
        '部门, 是否继续？',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
      .then(() => {
        crudDept
          .edit(data)
          .then(() => {
            this.notify(
              this.dict.label.dept_status[val ? 'true' : 'false'] + '成功',
              NOTIFICATION_TYPE.SUCCESS
            )
          })
          .catch((err) => {
            data.enabled = !data.enabled
            console.log(err.response.data.message)
          })
      })
      .catch(() => {
        data.enabled = !data.enabled
      })
  }

  private checkboxT(row: DeptData) {
    return row.id !== 1
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .vue-treeselect__control,
::v-deep .vue-treeselect__placeholder,
::v-deep .vue-treeselect__single-value {
  height: 30px;
  line-height: 30px;
}
.crud-opts {
  padding: 4px 0;
  display: -webkit-flex;
  display: flex;
  align-items: center;
}
.crud-opts .crud-opts-right {
  margin-left: auto;
}
::v-deep .el-input-number .el-input__inner {
  text-align: left;
}
</style>
