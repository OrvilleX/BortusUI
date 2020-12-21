<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="props.searchToggle">
        <!-- 搜索 -->
        <el-input v-model="query.blurry" size="small" clearable placeholder="输入名称或者描述搜索"
        style="width: 200px" class="filter-item" @keyup.enter.native="toQuery" />
        <date-range-picker v-model="query.createTime" class="date-item" />
        <span>
          <el-button class="filter-item" size="mini" type="success" icon="el-icon-search"
            @click="toQuery">搜索</el-button>
          <el-button v-if="optShow.reset" class="filter-item" size="mini" type="warning"
            icon="el-icon-refresh-left" @click="resetQuery()">重置</el-button>
        </span>
      </div>
      <div class="crud-opts">
        <span class="crud-opts-left">
          <!--左侧插槽-->
          <slot name="left" />
          <el-button v-if="optShow.add" v-permission="permission.add" class="filter-item"
            size="mini" type="primary" icon="el-icon-plus" @click="toAdd">新增</el-button>
          <el-button v-if="optShow.edit" v-permission="permission.edit" class="filter-item"
            size="mini" type="success" icon="el-icon-edit" :disabled="selections.length !== 1"
            @click="toEdit(selections[0])">修改</el-button>
          <el-button v-if="optShow.del" slot="reference" v-permission="permission.del"
            class="filter-item" type="danger" icon="el-icon-delete" size="mini"
            :loading="delAllLoading" :disabled="selections.length === 0" @click="toTableDelete(selections)">删除</el-button>
          <el-button v-if="optShow.download" :loading="downloadLoading" :disabled="!data.length"
            class="filter-item" size="mini" type="warning" icon="el-icon-download" @click="doExport">导出</el-button>
          <!--右侧-->
          <slot name="right" />
        </span>
        <el-button-group class="crud-opts-right">
          <el-button size="mini" plain type="info" icon="el-icon-search" @click="toggleSearch()" />
          <el-button size="mini" icon="el-icon-refresh" @click="refresh()" />
          <el-popover placement="bottom-end" width="150" trigger="click">
            <el-button slot="reference" size="mini" icon="el-icon-s-grid">
              <i class="fa fa-caret-down" aria-hidden="true" />
            </el-button>
            <el-checkbox v-model="allColumnsSelected" :indeterminate="allColumnsSelectedIndeterminate"
              @change="handleCheckAllChange">全选</el-checkbox>
            <el-checkbox v-for="item in tableColumns" :key="item.property" v-model="item.visible"
            @change="handleCheckedTableColumnsChange(item)">{{ item.label }}</el-checkbox>
          </el-popover>
        </el-button-group>
      </div>
    </div>
    <!-- 表单渲染 -->
    <el-dialog append-to-body :close-on-click-modal="false" :before-close="cancelCU"
      :visible="status > 0" :title="dialogTitle" width="520px">
      <el-form ref="form" :inline="true" :model="form"
        :rules="rules" size="small" label-width="80px">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="form.name" style="width: 380px" />
        </el-form-item>
        <el-form-item label="角色级别" prop="level">
          <el-input-number v-model.number="form.level"
            :min="1" controls-position="right" style="width: 145px" />
        </el-form-item>
        <el-form-item label="数据范围" prop="dataScope">
          <el-select v-model="form.dataScope"
            style="width: 140px" placeholder="请选择数据范围" @change="changeScope">
            <el-option v-for="item in dateScopes"
              :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="form.dataScope === '自定义'" label="数据权限" prop="depts">
          <treeselect
            v-model="deptDatas"
            :load-options="loadDepts"
            :options="depts"
            multiple
            style="width: 380px"
            placeholder="请选择"
          />
        </el-form-item>
        <el-form-item label="描述信息" prop="description">
          <el-input
            v-model="form.description"
            style="width: 380px"
            rows="5"
            type="textarea"
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
    <el-row :gutter="15">
      <!--角色管理-->
      <el-col
        :xs="24"
        :sm="24"
        :md="16"
        :lg="16"
        :xl="17"
        style="margin-bottom: 10px"
      >
        <el-card class="box-card" shadow="never">
          <div slot="header" class="clearfix">
            <span class="role-span">角色列表</span>
          </div>
          <el-table
            ref="table"
            v-loading="loading"
            highlight-current-row
            style="width: 100%"
            :data="data"
            @selection-change="selectionChangeHandler"
            @current-change="handleCurrentChange"
          >
            <el-table-column
              :selectable="checkboxT"
              type="selection"
              width="55"
            />
            <el-table-column prop="name" label="名称" />
            <el-table-column prop="dataScope" label="数据权限" />
            <el-table-column prop="level" label="角色级别" />
            <el-table-column
              :show-overflow-tooltip="true"
              prop="description"
              label="描述"
            />
            <el-table-column
              :show-overflow-tooltip="true"
              width="135px"
              prop="createTime"
              label="创建日期"
            >
              <template slot-scope="scope">
                <span>{{ parseTime(scope.row.createTime) }}</span>
              </template>
            </el-table-column>
            <el-table-column
              v-permission="['admin', 'roles:edit', 'roles:del']"
              label="操作"
              width="130px"
              align="center"
              fixed="right"
            >
              <template slot-scope="scope">
                <div v-if="scope.row.level >= level">
                  <el-button
                    v-permission="permission.edit"
                    :loading="status === 2"
                    :disabled="disabledEdit"
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
                    <p>{{ msg }}</p>
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
          <!--分页组件-->
            <el-pagination
    :page-size.sync="page.size"
    :total="page.total"
    :current-page.sync="page.page"
    style="margin-top: 8px;"
    layout="total, prev, pager, next, sizes"
    @size-change="sizeChangeHandler($event)"
    @current-change="pageChangeHandler"
  />
        </el-card>
      </el-col>
      <!-- 菜单授权 -->
      <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="7">
        <el-card class="box-card" shadow="never">
          <div slot="header" class="clearfix">
            <el-tooltip
              class="item"
              effect="dark"
              content="选择指定角色分配菜单"
              placement="top"
            >
              <span class="role-span">菜单分配</span>
            </el-tooltip>
            <el-button
              v-permission="['admin', 'roles:edit']"
              :disabled="!showButton"
              :loading="menuLoading"
              icon="el-icon-check"
              size="mini"
              style="float: right; padding: 6px 9px"
              type="primary"
              @click="saveMenu"
              >保存</el-button
            >
          </div>
          <el-tree
            ref="menu"
            lazy
            :data="menus"
            :default-checked-keys="menuIds"
            :load="getMenuDatas"
            :props="defaultProps"
            check-strictly
            accordion
            show-checkbox
            node-key="id"
            @check="menuChange"
          />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import DateRangePicker from '@/components/DateRangePicker/Index.vue'
import crudRoles from '@/api/system/role'
import { getDepts, getDeptSuperior } from '@/api/system/dept'
import { getMenusTree } from '@/api/system/menu'
import CRUD from '@/components/Crud'
import Treeselect, { LOAD_CHILDREN_OPTIONS } from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

import { RoleQueryData, RoleData, RoleDtoData } from '@/types/role'
import { MenuDtoData } from '@/types/menu'
import { DeptData, DeptDtoData } from '@/types/dept'
import { ElTree, TreeData } from 'element-ui/types/tree'
import { NOTIFICATION_TYPE } from '@/components/Crud/base'

@Component({
  name: 'Role',
  components: {
    Treeselect,
    DateRangePicker
  }
})
export default class extends mixins<
  CRUD<RoleData, RoleQueryData, RoleDtoData>
>(CRUD) {
  private defaultProps = {
    children: 'children',
    label: 'label',
    isLeaf: 'leaf'
  };

  private dateScopes = ['全部', '本级', '自定义'];
  private level = 3;
  private currentId = 0;
  private menuLoading = false;
  private showButton = false;
  private menus: MenuDtoData[] = [];
  private menuIds: number[] = [];
  private depts: DeptDtoData[] = [];
  private deptDatas: number[] = [];

  private permission = {
    add: ['admin', 'roles:add'],
    edit: ['admin', 'roles:edit'],
    del: ['admin', 'roles:del']
  };

  private rules = {
    name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
    permission: [{ required: true, message: '请输入权限', trigger: 'blur' }]
  };

  created() {
    this.title = '角色'
    this.url = 'api/roles'
    this.sort = ['level,asc']
    this.crudMethod = { ...crudRoles }
    this.defaultForm = {
      id: NaN,
      name: '',
      depts: [],
      description: '',
      dataScope: '全部',
      level: 3
    }
    crudRoles.getLevel().then((res) => {
      this.level = res.data.level
    })
  }

  getMenuDatas(node: TreeData, resolve: Function) {
    setTimeout(() => {
      getMenusTree(node.id ? node.id : 0).then((res) => {
        resolve(res)
      })
    }, 100)
  }

  afterRefresh() {
    (this.$refs.menu as ElTree<any, any>).setCheckedKeys([])
  }

  beforeToAdd() {
    this.deptDatas = []
    return true
  }

  beforeToEdit(form: RoleData) {
    this.deptDatas = []
    if (form.dataScope === '自定义') {
      if (form.depts) this.getSupDepts(form.depts)
    }
    if (form.depts) {
      form.depts.forEach((dept) => {
        if (dept.id) this.deptDatas.push(dept.id)
      })
    }
    return true
  }

  afterValidateCU() {
    if (this.form.dataScope === '自定义' && this.deptDatas.length === 0) {
      this.$message({
        message: '自定义数据权限不能为空',
        type: 'warning'
      })
      return false
    } else if (this.form.dataScope === '自定义') {
      const depts: { id: number }[] = []
      this.deptDatas.forEach(function(data) {
        const dept = { id: data }
        depts.push(dept)
      })
      this.form.depts = depts
    } else {
      this.form.depts = []
    }
    return true
  }

  private handleCurrentChange(val: RoleDtoData) {
    if (val) {
      (this.$refs.menu as ElTree<any, any>).setCheckedKeys([])
      if (val.id) this.currentId = val.id
      this.menuIds = []
      if (val.menus) {
        val.menus.forEach((data) => {
          if (data.id)
            this.menuIds.push(data.id)
        })
      }
      this.showButton = true
    }
  }

  private menuChange(menu: any) {
    const index = this.menuIds.indexOf(menu.id)
    if (index !== -1) {
      this.menuIds.splice(index, 1)
    } else {
      this.menuIds.push(menu.id)
    }
  }

  private async saveMenu() {
    this.menuLoading = true
    const role: RoleData = { id: this.currentId, menus: [] }
    // 得到已选中的 key 值
    this.menuIds.forEach((id) => {
      const menu = { id: id }
      // eslint-disable-next-line no-unused-expressions
      role.menus?.push(menu)
    })

    try {
      await crudRoles.editMenu(role)
      this.notify('保存成功', NOTIFICATION_TYPE.SUCCESS)
      this.menuLoading = false
      this.update()
    } catch (err) {
      this.menuLoading = false
      console.log(err.response.data.message)
    }
  }

  private async update() {
    const res = await crudRoles.get(this.currentId)
    for (let i = 0; i < this.data.length; i++) {
      if (res.data.id === this.data[i].id) {
        this.data[i] = res.data
        break
      }
    }
  }

  private async getDepts() {
    const res = await getDepts({ enabled: true })
    this.depts = res.data.content.map((obj) => {
      if (obj.hasChildren) {
        obj.children = []
      }
      return obj
    })
  }

  private async getSupDepts(depts: DeptData[]) {
    const ids: number[] = []
    depts.forEach((dept) => {
      if (dept.id) ids.push(dept.id)
    })
    const res = await getDeptSuperior(ids)
    this.buildDepts(res.data)
    this.depts = res.data
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

  private loadDepts(e: { action: any, parentNode: any, callback: Function }) {
    if (e.action === LOAD_CHILDREN_OPTIONS) {
      getDepts({ enabled: true, pid: e.parentNode.id }).then((res) => {
        e.parentNode.children = res.data.content.map((obj) => {
          if (obj.hasChildren) {
            obj.children = []
          }
          return obj
        })
        setTimeout(() => {
          e.callback()
        }, 200)
      })
    }
  }

  private changeScope() {
    if (this.form.dataScope === '自定义') {
      this.getDepts()
    }
  }

  private checkboxT(row: RoleDtoData) {
    const level = row.level ? row.level : 0
    return level >= this.level
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.role-span {
  font-weight: bold;
  color: #303133;
  font-size: 15px;
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .el-input-number .el-input__inner {
  text-align: left;
}
::v-deep .vue-treeselect__multi-value {
  margin-bottom: 0;
}
::v-deep .vue-treeselect__multi-value-item {
  border: 0;
  padding: 0;
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
