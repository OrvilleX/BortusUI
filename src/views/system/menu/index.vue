<template>
  <div class="app-container">
    <div class="head-container">
      <div v-if="props.searchToggle">
        <el-input v-model="query.blurry" clearable size="small" placeholder="模糊搜索"
          style="width: 200px" class="filter-item" @keyup.enter.native="toQuery" />
        <date-range-picker v-model="query.createTime" class="date-item" />
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
            @click="toDelete(selections)"
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
    <!--表单渲染-->
    <el-dialog
      append-to-body
      :close-on-click-modal="false"
      :before-close="cancelCU"
      :visible="status > 0"
      :title="dialogTitle"
      width="580px"
    >
      <el-form
        ref="form"
        :inline="true"
        :model="form"
        :rules="rules"
        size="small"
        label-width="80px"
      >
        <el-form-item label="菜单类型" prop="type">
          <el-radio-group v-model="form.type" size="mini" style="width: 178px">
            <el-radio-button label="0">目录</el-radio-button>
            <el-radio-button label="1">菜单</el-radio-button>
            <el-radio-button label="2">按钮</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-show="form.type.toString() !== '2'"
          label="菜单图标"
          prop="icon"
        >
          <el-popover
            placement="bottom-start"
            width="450"
            trigger="click"
            @show="$refs['iconSelect'].reset()"
          >
            <IconSelect ref="iconSelect" @selected="selected" />
            <el-input
              slot="reference"
              v-model="form.icon"
              style="width: 450px"
              placeholder="点击选择图标"
              readonly
            >
              <svg-icon
                v-if="form.icon"
                slot="prefix"
                :icon-class="form.icon"
                class="el-input__icon"
                style="height: 32px; width: 16px"
              />
              <i v-else slot="prefix" class="el-icon-search el-input__icon" />
            </el-input>
          </el-popover>
        </el-form-item>
        <el-form-item
          v-show="form.type.toString() !== '2'"
          label="外链菜单"
          prop="iframe"
        >
          <el-radio-group v-model="form.iframe" size="mini">
            <el-radio-button label="true">是</el-radio-button>
            <el-radio-button label="false">否</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-show="form.type.toString() === '1'"
          label="菜单缓存"
          prop="cache"
        >
          <el-radio-group v-model="form.cache" size="mini">
            <el-radio-button label="true">是</el-radio-button>
            <el-radio-button label="false">否</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-show="form.type.toString() !== '2'"
          label="菜单可见"
          prop="hidden"
        >
          <el-radio-group v-model="form.hidden" size="mini">
            <el-radio-button label="false">是</el-radio-button>
            <el-radio-button label="true">否</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-if="form.type.toString() !== '2'"
          label="菜单标题"
          prop="title"
        >
          <el-input
            v-model="form.title"
            :style="
              form.type.toString() === '0' ? 'width: 450px' : 'width: 178px'
            "
            placeholder="菜单标题"
          />
        </el-form-item>
        <el-form-item
          v-if="form.type.toString() === '2'"
          label="按钮名称"
          prop="title"
        >
          <el-input
            v-model="form.title"
            placeholder="按钮名称"
            style="width: 178px"
          />
        </el-form-item>
        <el-form-item
          v-show="form.type.toString() !== '0'"
          label="权限标识"
          prop="permission"
        >
          <el-input
            v-model="form.permission"
            :disabled="form.iframe"
            placeholder="权限标识"
            style="width: 178px"
          />
        </el-form-item>
        <el-form-item
          v-if="form.type.toString() !== '2'"
          label="路由地址"
          prop="path"
        >
          <el-input
            v-model="form.path"
            placeholder="路由地址"
            style="width: 178px"
          />
        </el-form-item>
        <el-form-item label="菜单排序" prop="menuSort">
          <el-input-number
            v-model.number="form.menuSort"
            :min="0"
            :max="999"
            controls-position="right"
            style="width: 178px"
          />
        </el-form-item>
        <el-form-item
          v-show="!form.iframe && form.type.toString() === '1'"
          label="组件名称"
          prop="componentName"
        >
          <el-input
            v-model="form.componentName"
            style="width: 178px"
            placeholder="匹配组件内Name字段"
          />
        </el-form-item>
        <el-form-item
          v-show="!form.iframe && form.type.toString() === '1'"
          label="组件路径"
          prop="component"
        >
          <el-input
            v-model="form.component"
            style="width: 178px"
            placeholder="组件路径"
          />
        </el-form-item>
        <el-form-item label="上级类目" prop="pid">
          <treeselect
            v-model="form.pid"
            :options="menus"
            :load-options="loadMenus"
            style="width: 450px"
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
      :load="getMenus"
      :data="data"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      row-key="id"
      @select="selectChange"
      @select-all="selectAllChange"
      @selection-change="selectionChangeHandler"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column
        :show-overflow-tooltip="true"
        label="菜单标题"
        width="125px"
        prop="title"
      />
      <el-table-column prop="icon" label="图标" align="center" width="60px">
        <template slot-scope="scope">
          <svg-icon :icon-class="scope.row.icon ? scope.row.icon : ''" />
        </template>
      </el-table-column>
      <el-table-column prop="menuSort" align="center" label="排序">
        <template slot-scope="scope">
          {{ scope.row.menuSort }}
        </template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="permission"
        label="权限标识"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        prop="component"
        label="组件路径"
      />
      <el-table-column prop="iframe" label="外链" width="75px">
        <template slot-scope="scope">
          <span v-if="scope.row.iframe">是</span>
          <span v-else>否</span>
        </template>
      </el-table-column>
      <el-table-column prop="cache" label="缓存" width="75px">
        <template slot-scope="scope">
          <span v-if="scope.row.cache">是</span>
          <span v-else>否</span>
        </template>
      </el-table-column>
      <el-table-column prop="hidden" label="可见" width="75px">
        <template slot-scope="scope">
          <span v-if="scope.row.hidden">否</span>
          <span v-else>是</span>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建日期" width="135px">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-permission="['admin', 'menu:edit', 'menu:del']"
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
            <el-popover
              v-model="pop"
              v-permission="permission.del"
              placement="top"
              width="180"
              trigger="manual"
            >
              <p>确定删除吗,如果存在下级节点则一并删除，此操作不能撤销！</p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="doCancel"
                  >取消</el-button
                >
                <el-button
                  :loading="dataStatus[getDataId(scope.row)].delete === 2"
                  type="primary"
                  size="mini"
                  @click="doDelete(scope.row)"
                  >确定</el-button
                >
              </div>
              <el-button
                slot="reference"
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="toDelete"
              />
            </el-popover>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import crudMenu from '@/api/system/menu'
import IconSelect from '@/components/IconSelect/Index.vue'
import Treeselect, { LOAD_CHILDREN_OPTIONS } from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

import CRUD from '@/components/Crud'
import DateRangePicker from '@/components/DateRangePicker/Index.vue'
import { mixins } from 'vue-class-component'
import { MenuQueryData, MenuDtoData, MenuData } from '@/types/menu'

@Component({
  name: 'Menu',
  components: {
    Treeselect,
    IconSelect,
    DateRangePicker
  }
})
export default class extends mixins<
  CRUD<MenuData, MenuQueryData, MenuDtoData>
>(CRUD) {
  private menus: MenuDtoData[] = [];
  defaultForm = {
    id: NaN,
    title: '',
    menuSort: 999,
    path: '',
    component: '',
    componentName: '',
    iFrame: false,
    roles: [],
    pid: 0,
    icon: '',
    cache: false,
    hidden: false,
    type: 0,
    permission: ''
  };

  permission = {
    add: ['admin', 'menu:add'],
    edit: ['admin', 'menu:edit'],
    del: ['admin', 'menu:del']
  };

  rules = {
    title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
    path: [{ required: true, message: '请输入地址', trigger: 'blur' }]
  };

  created() {
    this.title = '菜单'
    this.url = 'api/menus'
    this.crudMethod = { ...crudMenu }
  }

  afterToCU(form: MenuData) {
    this.menus = []
    if (form.id != null) {
      if (form.pid === null) {
        form.pid = 0
      }
      this.getSupDepts(form.id)
    } else {
      this.menus.push({ id: 0, label: '顶级类目', children: [] })
    }
  }

  private getMenus(tree: any, treeNode: any, resolve: Function) {
    const params = { pid: tree.id }
    setTimeout(() => {
      crudMenu.getMenus(params).then((res) => {
        resolve(res.data.content)
      })
    }, 100)
  }

  private getSupDepts(id: number) {
    crudMenu.getMenuSuperior([id]).then((res) => {
      const children = res.data.map((obj) => {
        if (!obj.leaf && !obj.children) {
          obj.children = []
        }
        return obj
      })
      this.menus = [{ id: 0, label: '顶级类目', children: children }]
    })
  }

  private loadMenus(e: { action: any, parentNode: any, callback: Function }) {
    if (e.action === LOAD_CHILDREN_OPTIONS) {
      crudMenu.getMenusTree(e.parentNode.id).then((res) => {
        e.parentNode.children = res.data.map((obj) => {
          if (!obj.leaf) {
            obj.children = []
          }
          return obj
        })
        setTimeout(() => {
          e.callback()
        }, 100)
      })
    }
  }

  private selected(name: string) {
    this.form.icon = name
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .el-input-number .el-input__inner {
  text-align: left;
}

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
</style>
