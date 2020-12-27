<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="props.searchToggle">
        <!-- 搜索 -->
        <el-input
          v-model="query.jobName"
          clearable
          size="small"
          placeholder="输入任务名称搜索"
          style="width: 200px"
          class="filter-item"
          @keyup.enter.native="toQuery"
        />
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
      <!-- 任务日志 -->
      <el-button
        slot="right"
        class="filter-item"
        size="mini"
        type="info"
        icon="el-icon-tickets"
        @click="doLog"
        >日志</el-button
      >
      <Log ref="log" />
    </div>
    <!--Form表单-->
    <el-dialog
      :close-on-click-modal="false"
      :before-close="cancelCU"
      :visible="status > 0"
      :title="dialogTitle"
      append-to-body
      width="730px"
    >
      <el-form
        ref="form"
        :inline="true"
        :model="form"
        :rules="rules"
        size="small"
        label-width="100px"
      >
        <el-form-item label="任务名称" prop="jobName">
          <el-input v-model="form.jobName" style="width: 220px" />
        </el-form-item>
        <el-form-item label="任务描述" prop="description">
          <el-input v-model="form.description" style="width: 220px" />
        </el-form-item>
        <el-form-item label="Bean名称" prop="beanName">
          <el-input v-model="form.beanName" style="width: 220px" />
        </el-form-item>
        <el-form-item label="执行方法" prop="methodName">
          <el-input v-model="form.methodName" style="width: 220px" />
        </el-form-item>
        <el-form-item label="Cron表达式" prop="cronExpression">
          <el-input v-model="form.cronExpression" style="width: 220px" />
        </el-form-item>
        <el-form-item label="子任务ID">
          <el-input
            v-model="form.subTask"
            placeholder="多个用逗号隔开，按顺序执行"
            style="width: 220px"
          />
        </el-form-item>
        <el-form-item label="任务负责人" prop="personInCharge">
          <el-input v-model="form.personInCharge" style="width: 220px" />
        </el-form-item>
        <el-form-item label="告警邮箱" prop="email">
          <el-input
            v-model="form.email"
            placeholder="多个邮箱用逗号隔开"
            style="width: 220px"
          />
        </el-form-item>
        <el-form-item label="失败后暂停">
          <el-radio-group v-model="form.pauseAfterFailure" style="width: 220px">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="任务状态">
          <el-radio-group v-model="form.isPause" style="width: 220px">
            <el-radio :label="false">启用</el-radio>
            <el-radio :label="true">暂停</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="参数内容">
          <el-input
            v-model="form.params"
            style="width: 556px"
            rows="4"
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
    <!--表格渲染-->
    <el-table
      ref="table"
      v-loading="loading"
      :data="data"
      style="width: 100%"
      @selection-change="selectionChangeHandler"
    >
      <el-table-column :selectable="checkboxT" type="selection" width="55" />
      <el-table-column :show-overflow-tooltip="true" prop="id" label="任务ID" />
      <el-table-column
        :show-overflow-tooltip="true"
        prop="jobName"
        label="任务名称"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        prop="beanName"
        label="Bean名称"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        prop="methodName"
        label="执行方法"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        prop="params"
        label="参数"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        prop="cronExpression"
        label="cron表达式"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        prop="isPause"
        width="90px"
        label="状态"
      >
        <template slot-scope="scope">
          <el-tag :type="scope.row.isPause ? 'warning' : 'success'">{{
            scope.row.isPause ? "已暂停" : "运行中"
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="description"
        width="150px"
        label="描述"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        prop="createTime"
        width="136px"
        label="创建日期"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-permission="['admin', 'timing:edit', 'timing:del']"
        label="操作"
        width="170px"
        align="center"
        fixed="right"
      >
        <template slot-scope="scope">
          <el-button
            v-permission="['admin', 'timing:edit']"
            size="mini"
            style="margin-right: 3px"
            type="text"
            @click="toEdit(scope.row)"
            >编辑</el-button
          >
          <el-button
            v-permission="['admin', 'timing:edit']"
            style="margin-left: -2px"
            type="text"
            size="mini"
            @click="execute(scope.row.id)"
            >执行</el-button
          >
          <el-button
            v-permission="['admin', 'timing:edit']"
            style="margin-left: 3px"
            type="text"
            size="mini"
            @click="
              updateStatus(scope.row.id, scope.row.isPause ? '恢复' : '暂停')
            "
          >
            {{ scope.row.isPause ? "恢复" : "暂停" }}
          </el-button>
          <span>
            <el-button :loading="delLoading"
            v-permission="['admin', 'timing:del']"
            type="text"
            size="mini"
            @click="delMethod(scope.row.id)">删除</el-button>
          </span>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <el-pagination
      :page-size.sync="page.size"
      :total="page.total"
      :current-page.sync="page.page"
      style="margin-top: 8px"
      layout="total, prev, pager, next, sizes"
      @size-change="sizeChange($event)"
      @current-change="pageChange"
    />
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import crudJob from '@/api/system/timing'
import Log from './Log.vue'
import CRUD from '@/components/Crud'
import { parseTime } from '@/utils/index'
import DateRangePicker from '@/components/DateRangePicker/Index.vue'
import { JobQueryData, QuartzJobData } from '@/types/timing'
import { mixins } from 'vue-class-component'
import { NOTIFICATION_TYPE } from '@/components/Crud/base'

@Component({
  name: 'Timing',
  components: {
    Log,
    DateRangePicker
  }
})
export default class extends mixins<CRUD<QuartzJobData, JobQueryData, QuartzJobData>>(
  CRUD
) {
  delLoading = false;
  parseTime = parseTime;

  permission = {
    add: ['admin', 'timing:add'],
    edit: ['admin', 'timing:edit'],
    del: ['admin', 'timing:del']
  };

  rules = {
    jobName: [{ required: true, message: '请输入任务名称', trigger: 'blur' }],
    description: [
      { required: true, message: '请输入任务描述', trigger: 'blur' }
    ],
    beanName: [{ required: true, message: '请输入Bean名称', trigger: 'blur' }],
    methodName: [
      { required: true, message: '请输入方法名称', trigger: 'blur' }
    ],
    cronExpression: [
      { required: true, message: '请输入Cron表达式', trigger: 'blur' }
    ],
    personInCharge: [
      { required: true, message: '请输入负责人名称', trigger: 'blur' }
    ]
  };

  constructor() {
    super()
    this.query = {}
    this.form = {}
  }

  created() {
    this.title = '定时任务'
    this.url = 'api/jobs'
    this.crudMethod = { ...crudJob }
    this.defaultForm = {
      id: NaN,
      jobName: '',
      subTask: '',
      beanName: '',
      methodName: '',
      params: '',
      cronExpression: '',
      pauseAfterFailure: true,
      isPause: false,
      personInCharge: '',
      email: '',
      description: ''
    }
    this.resetForm()
    if (this.queryOnPresenterCreated) {
      this.toQuery()
    }
  }

  execute(id: number) {
    crudJob
      .execution(id)
      .then(() => {
        this.notify('执行成功', NOTIFICATION_TYPE.SUCCESS)
      })
      .catch((err) => {
        console.log(err.response.data.message)
      })
  }

  updateStatus(id: number, status: string) {
    if (status === '恢复') {
      this.updateParams(id)
    }
    crudJob
      .updateIsPause(id)
      .then(() => {
        this.toQuery()
        this.notify(status + '成功', NOTIFICATION_TYPE.SUCCESS)
      })
      .catch((err) => {
        console.log(err.response.data.message)
      })
  }

  private updateParams(id: number) {
    console.log(id)
  }

  private delMethod(id: number) {
    this.delLoading = true
    crudJob
      .del([id])
      .then(() => {
        this.delLoading = false;
        (this.$refs[id] as any).doClose()
        this.dleChangePage(1)
        this.delSuccessNotify()
        this.toQuery()
      })
      .catch(() => {
        this.delLoading = false;
        (this.$refs[id] as any).doClose()
      })
  }

  private doLog() {
    (this.$refs.log as Log).dialog = true;
    (this.$refs.log as Log).doInit()
  }

  private checkboxT(row: QuartzJobData) {
    return row.id !== 1
  }
}
</script>

<style lang="scss" scoped>
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