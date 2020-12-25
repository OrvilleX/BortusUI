<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--侧边部门数据-->
      <el-col :xs="9" :sm="6" :md="5" :lg="4" :xl="4">
        <div class="head-container">
          <el-input
            v-model="deptName"
            clearable
            size="small"
            placeholder="输入部门名称搜索"
            prefix-icon="el-icon-search"
            class="filter-item"
            @input="getDeptDatas"
          />
        </div>
        <el-tree
          :data="deptDatas"
          :load="getDeptDatas"
          :props="defaultProps"
          :expand-on-click-node="false"
          lazy
          @node-click="handleNodeClick"
        />
      </el-col>
      <!--用户数据-->
      <el-col :xs="15" :sm="18" :md="19" :lg="20" :xl="20">
        <!--工具栏-->
        <div class="head-container">
          <div v-if="props.searchToggle">
            <!-- 搜索 -->
            <el-input
              v-model="query.blurry"
              clearable
              size="small"
              placeholder="输入名称或者邮箱搜索"
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
              <el-button
                size="mini"
                icon="el-icon-refresh"
                @click="refresh()"
              />
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
          width="570px"
        >
          <el-form
            ref="form"
            :inline="true"
            :model="form"
            :rules="rules"
            size="small"
            label-width="66px"
          >
            <el-form-item label="用户名" prop="username">
              <el-input v-model="form.username" />
            </el-form-item>
            <el-form-item label="电话" prop="phone">
              <el-input v-model.number="form.phone" />
            </el-form-item>
            <el-form-item label="昵称" prop="nickName">
              <el-input v-model="form.nickName" />
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="form.email" />
            </el-form-item>
            <el-form-item label="部门" prop="dept.id">
              <treeselect
                v-model="form.dept.id"
                :options="depts"
                :load-options="loadDepts"
                style="width: 178px"
                placeholder="选择部门"
              />
            </el-form-item>
            <el-form-item label="岗位" prop="jobs">
              <el-select
                v-model="jobDatas"
                style="width: 178px"
                multiple
                placeholder="请选择"
                @remove-tag="deleteTag"
                @change="changeJob"
              >
                <el-option
                  v-for="item in jobs"
                  :key="item.name"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="性别">
              <el-radio-group v-model="form.gender" style="width: 178px">
                <el-radio label="男">男</el-radio>
                <el-radio label="女">女</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="状态">
              <el-radio-group
                v-model="form.enabled"
                :disabled="form.id === user.id"
              >
                <el-radio
                  v-for="item in dict.user_status"
                  :key="item.id"
                  :label="item.value"
                  >{{ item.label }}</el-radio
                >
              </el-radio-group>
            </el-form-item>
            <el-form-item style="margin-bottom: 0" label="角色" prop="roles">
              <el-select
                v-model="roleDatas"
                style="width: 437px"
                multiple
                placeholder="请选择"
                @remove-tag="deleteTag"
                @change="changeRole"
              >
                <el-option
                  v-for="item in roles"
                  :key="item.name"
                  :disabled="level !== 1 && item.level <= level"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
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
          :data="data"
          style="width: 100%"
          @selection-change="selectionChangeHandler"
        >
          <el-table-column
            :selectable="checkboxT"
            type="selection"
            width="55"
          />
          <el-table-column
            :show-overflow-tooltip="true"
            prop="username"
            label="用户名"
          />
          <el-table-column
            :show-overflow-tooltip="true"
            prop="nickName"
            label="昵称"
          />
          <el-table-column prop="gender" label="性别" />
          <el-table-column
            :show-overflow-tooltip="true"
            prop="phone"
            width="100"
            label="电话"
          />
          <el-table-column
            :show-overflow-tooltip="true"
            width="135"
            prop="email"
            label="邮箱"
          />
          <el-table-column
            :show-overflow-tooltip="true"
            prop="dept"
            label="部门"
          >
            <template slot-scope="scope">
              <div>{{ scope.row.dept.name }}</div>
            </template>
          </el-table-column>
          <el-table-column label="状态" align="center" prop="enabled">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.enabled"
                :disabled="user.id === scope.row.id"
                active-color="#409EFF"
                inactive-color="#F56C6C"
                @change="changeEnabled(scope.row, scope.row.enabled)"
              />
            </template>
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            prop="createTime"
            width="135"
            label="创建日期"
          >
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.createTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            v-permission="['admin', 'user:edit', 'user:del']"
            label="操作"
            width="115"
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
                  <p>确定删除本条数据吗？</p>
                  <div style="text-align: right; margin: 0">
                    <el-button size="mini" type="text" @click="doCancelUD(scope.row)"
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
                    @click="toDeleteUD"
                  />
                </el-popover>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <!--分页组件-->
        <el-pagination
          :total="page.total"
          :current-page="page.page + 1"
          style="margin-top: 8px"
          layout="total, prev, pager, next, sizes"
          @size-change="sizeChange"
          @current-change="pageChange"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import { parseTime } from '@/utils/index'
import { mixins } from 'vue-class-component'
import crudUser from '@/api/system/user'
import { isvalidPhone } from '@/utils/validate'
import { getDepts, getDeptSuperior } from '@/api/system/dept'
import { getAll, getLevel } from '@/api/system/role'
import { getAllJob } from '@/api/system/job'
import CRUD from '@/components/Crud'
import DateRangePicker from '@/components/DateRangePicker/Index.vue'
import Treeselect, { LOAD_CHILDREN_OPTIONS } from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

import { UserData, UserQueryData, UserDtoData } from '@/types/user'
import { DeptDtoData } from '@/types/dept'
import { JobData } from '@/types/job'
import { RoleData, RoleDtoData } from '@/types/role'
import { UserModule } from '@/store/modules/user'
import { NOTIFICATION_TYPE } from '@/components/Crud/base'

let userRoles: RoleData[] = []
let userJobs: JobData[] = []

@Component({
  name: 'User',
  components: {
    Treeselect,
    DateRangePicker
  }
})
export default class extends mixins<CRUD<UserData, UserQueryData, UserDtoData>>(
  CRUD
) {
  dicts = ['user_status'];
  height = document.documentElement.clientHeight - 180 + 'px;';
  deptName = '';
  depts: DeptDtoData[] = [];
  deptDatas: DeptDtoData[] = [];
  jobs: JobData[] = [];
  level = 3;
  roles: RoleDtoData[] = [];
  jobDatas: number[] = [];
  roleDatas: number[] = [];
  parseTime = parseTime;
  defaultProps = { children: 'children', label: 'name', isLeaf: 'leaf' };
  permission = {
    add: ['admin', 'user:add'],
    edit: ['admin', 'user:edit'],
    del: ['admin', 'user:del']
  };

  user = UserModule.user;

  enabledTypeOptions = [
    { key: 'true', displayName: '激活' },
    { key: 'false', displayName: '锁定' }
  ];

  rules = {
    username: [
      { required: true, message: '请输入用户名', trigger: 'blur' },
      { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
    ],
    nickName: [
      { required: true, message: '请输入用户昵称', trigger: 'blur' },
      { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
    ],
    email: [
      { required: true, message: '请输入邮箱地址', trigger: 'blur' },
      { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
    ],
    phone: [{ required: true, trigger: 'blur', validator: this.validPhone }]
  };

  created() {
    this.title = '用户'
    this.url = 'api/users'
    this.crudMethod = { ...crudUser }
    this.msg.add = '新增成功，默认密码：123456'
    this.defaultForm = {
      id: NaN,
      userName: '',
      nickName: '',
      gender: '男',
      email: '',
      enabled: false,
      roles: [],
      jobs: [],
      dept: { id: NaN },
      phone: ''
    }
    this.query = {}
    this.form = {}
    this.resetForm()
    if (this.queryOnPresenterCreated) {
      this.toQuery()
    }
  }

  private validPhone(rule: string, value: string, callback: Function) {
    if (!value) {
      callback(new Error('请输入电话号码'))
    } else if (!isvalidPhone(value)) {
      callback(new Error('请输入正确的11位手机号码'))
    } else {
      callback()
    }
  }

  mounted() {
    window.onresize = () => {
      this.height = document.documentElement.clientHeight - 180 + 'px;'
    }
  }

  private changeRole(value: number[]) {
    userRoles = []
    value.forEach((data) => {
      const role = { id: data }
      userRoles.push(role)
    })
  }

  private changeJob(value: number[]) {
    userJobs = []
    value.forEach((data) => {
      const job = { id: data }
      userJobs.push(job)
    })
  }

  private deleteTag(value: number) {
    userRoles.forEach(function(data, index) {
      if (data.id === value) {
        userRoles.splice(index, value)
      }
    })
  }

  afterToCU(form: UserData) {
    this.getRoles()
    if (form.id == null) {
      this.getDepts()
    } else {
      if (form.dept?.id) this.getSupDepts(form.dept.id)
    }
    this.getRoleLevel()
    this.getJobs()
  }

  beforeToAdd() {
    this.jobDatas = []
    this.roleDatas = []
    return true
  }

  beforeToEdit(form: UserData) {
    this.getJobs()
    this.jobDatas = []
    this.roleDatas = []
    userRoles = []
    userJobs = []

    if (form.roles) {
      form.roles.forEach((role) => {
        if (role.id) this.roleDatas.push(role.id)
        const rol = { id: role.id }
        userRoles.push(rol)
      })
    }

    if (form.jobs) {
      form.jobs.forEach((job) => {
        if (job.id) this.jobDatas.push(job.id)
        const data = { id: job.id }
        userJobs.push(data)
      })
    }

    return true
  }

  afterValidateCU() {
    if (!this.form.dept?.id) {
      this.$message({
        message: '部门不能为空',
        type: 'warning'
      })
      return false
    } else if (this.jobDatas.length === 0) {
      this.$message({
        message: '岗位不能为空',
        type: 'warning'
      })
      return false
    } else if (this.roleDatas.length === 0) {
      this.$message({
        message: '角色不能为空',
        type: 'warning'
      })
      return false
    }
    this.form.roles = userRoles
    this.form.jobs = userJobs
    return true
  }

  private getDeptDatas(node: any, resolve: Function) {
    const sort = 'id,desc'
    const params = { name: '', sort: sort, pid: 0 }
    if (typeof node !== 'object') {
      if (node) {
        params.name = node
      }
    } else if (node.level !== 0) {
      params.pid = node.data.id
    }
    setTimeout(() => {
      getDepts(params).then((res) => {
        if (resolve) {
          resolve(res.data.content)
        } else {
          this.deptDatas = res.data.content
        }
      })
    }, 100)
  }

  private getDepts() {
    getDepts({ enabled: true }).then((res) => {
      this.depts = res.data.content.map((obj) => {
        if (obj.hasChildren) {
          obj.children = []
        }
        return obj
      })
    })
  }

  private getSupDepts(deptId: number) {
    getDeptSuperior([deptId]).then((res) => {
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

  private handleNodeClick(data: DeptDtoData) {
    if (data.pid === 0) {
      this.query.deptId = NaN
    } else {
      this.query.deptId = data.id
    }
    this.toQuery()
  }

  // 改变状态
  private changeEnabled(data: UserData, val: string) {
    this.$confirm(
      '此操作将 "' +
        this.dict.label.user_status[val] +
        '" ' +
        data.userName +
        ', 是否继续？',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
      .then(() => {
        crudUser
          .edit(data)
          .then(() => {
            this.notify(
              this.dict.label.user_status[val] + '成功',
              NOTIFICATION_TYPE.SUCCESS
            )
          })
          .catch(() => {
            data.enabled = !data.enabled
          })
      })
      .catch(() => {
        data.enabled = !data.enabled
      })
  }

  private getRoles() {
    getAll().then((res) => {
      this.roles = res.data
    })
  }

  private getJobs() {
    getAllJob().then((res) => {
      this.jobs = res.data.content
    })
  }

  private getRoleLevel() {
    getLevel().then((res) => {
      this.level = res.data.level
    })
  }

  private checkboxT(row: UserData) {
    return row.id !== UserModule.user.id
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
</style>
