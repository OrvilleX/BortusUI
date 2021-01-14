<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="props.searchToggle">
        <!-- 搜索 -->
        <el-select
          v-model="query.jobGroup"
          clearable
          size="small"
          placeholder="执行器"
          class="filter-item"
          style="width: 90px"
          @change="toQuery"
        >
          <el-option
            v-for="item in jobGroups"
            :key="item.id"
            :label="item.title"
            :value="item.id"
          />
        </el-select>
        <el-input
          v-model="query.executorHandler"
          clearable
          size="small"
          placeholder="输入名称搜索"
          style="width: 200px"
          class="filter-item"
          @keyup.enter.native="toQuery"
        />
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
    <Log ref="log" />
    <!--表单组件-->
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
        inline
        :model="form"
        :rules="rules"
        size="small"
        label-width="80px"
      >
        <el-form-item label="执行器" prop="jobGroup">
          <el-select
            :disabled="addStatus === 0"
            v-model="form.jobGroup"
            clearable
            size="small"
            style="width: 178px"
          >
            <el-option
              v-for="item in jobGroups"
              :key="item.id"
              :label="item.title"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="任务描述" prop="jobDesc">
          <el-input v-model="form.jobDesc" controls-position="right" style="width: 178px" />
        </el-form-item>
        <el-form-item label="路由策略" prop="executorRouteStrategy">
          <el-select v-model="form.executorRouteStrategy" size="small" style="width: 178px">
            <el-option
              v-for="item in dict.route_strategy_type"
              :key="item.id"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Cron" prop="jobCron">
            <el-input v-model="form.jobCron" style="width: 178px" controls-position="right" />
        </el-form-item>
        <el-form-item label="运行模式" prop="glueType">
          <el-select :disabled="addStatus === 0" v-model="form.glueType" size="small" style="width: 178px">
            <el-option
              v-for="item in dict.glue_type"
              :key="item.id"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="处理器" prop="executorHandler">
            <el-input v-model="form.executorHandler" style="width: 178px" controls-position="right" />
        </el-form-item>
        <el-form-item label="阻塞方案" prop="executorBlockStrategy">
          <el-select v-model="form.executorBlockStrategy" size="small" style="width: 178px">
            <el-option
              v-for="item in dict.block_strategy_type"
              :key="item.id"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="子任务ID" prop="childJobId">
            <el-input v-model="form.childJobId" placeholder="多个子任务ID以逗号分隔" style="width: 178px" controls-position="right" />
        </el-form-item>
        <el-form-item label="任务超时时间" prop="executorTimeout">
            <el-input v-model.number="form.executorTimeout" style="width: 178px" />
        </el-form-item>
        <el-form-item label="失败重试次数" prop="executorFailRetryCount">
            <el-input v-model.number="form.executorFailRetryCount" style="width: 178px" controls-position="right" />
        </el-form-item>
        <el-form-item label="负责人" prop="author">
            <el-input v-model="form.author" style="width: 178px" />
        </el-form-item>
        <el-form-item label="报警邮件" prop="alarmEmail">
            <el-input v-model="form.alarmEmail" style="width: 178px" controls-position="right" />
        </el-form-item>
        <el-form-item label="任务参数" prop="executorParam">
            <el-input type="textarea" :rows="5" v-model="form.executorParam" style="width: 370px" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="cancelCU">取消</el-button>
        <el-button :loading="status === 2" type="primary" @click="submitCU"
          >确认</el-button>
      </div>
    </el-dialog>
    <el-table
      ref="table"
      v-loading="loading"
      :data="data"
      row-key="id"
      @selection-change="selectionChangeHandler"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column label="编号" prop="id" />
      <el-table-column label="描述" prop="jobDesc" />
      <el-table-column label="运行模式" align="center" prop="glueType">
        <template slot-scope="scope">
            <span>{{ parseGlueType(scope.row.glueType) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Cron" prop="jobCron" />
      <el-table-column label="负责人" prop="author" />
      <el-table-column label="状态" prop="triggerStatus">
        <template slot-scope="scope">
            <el-tag :type="scope.row.triggerStatus === 0 ? 'warning' : 'success'">
              {{ parseTriggerStatus(scope.row.triggerStatus) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建日期">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-permission="['admin', 'jobGroup:edit', 'jobGroup:del']"
        label="操作"
        width="200px"
        align="center"
        fixed="right"
      >
        <template slot-scope="scope">
          <div>
            <el-button
              v-permission="permission.edit"
              size="mini"
              type="text"
              style="margin-right: 3px"
              @click="toEdit(scope.row)"
            >编辑</el-button>
            <el-button
              size="mini"
              type="text"
              style="margin-left: -2px"
              @click="toStart(scope.row)"
            >启动</el-button>
            <el-button
              type="text"
              size="mini"
              style="margin-left: 3px"
              @click="toStop(scope.row)"
            >停止</el-button>
            <el-button
              type="text"
              size="mini"
              style="margin-left: 3px"
            >代码</el-button>
            <el-button
              type="text"
              size="mini"
              style="margin-left: 3px"
              @click="doLog(scope.row)"
            >日志</el-button>
            <span>
              <el-button
                v-permission="permission.del"
                type="text"
                size="mini"
                @click="toDeleteUD(scope.row)"
              >删除</el-button>
            </span>
          </div>
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
import crudJobInfo from '@/api/job/info'
import crudJobGroup from '@/api/job/group'
import { parseTime } from '@/utils/index'
import CRUD from '@/components/Crud'
import { mixins } from 'vue-class-component'
import { JobInfoQueryData, JobInfoData } from '@/types/jobInfo'
import { JobGroupData } from '@/types/jobGroup'
import { NOTIFICATION_TYPE } from '@/components/Crud/base'
import Log from '../log/Index.vue'

@Component({
  name: 'JobInfo',
  components: {
    Log
  }
})
export default class extends mixins<
  CRUD<JobInfoData, JobInfoQueryData, JobInfoData>
>(CRUD) {
  parseTime = parseTime;
  dicts = ['glue_type', 'route_strategy_type', 'block_strategy_type'];
  jobGroups: JobGroupData[] = []

  private rules = {
    jobGroup: [{ required: true, message: '请选择', trigger: 'blur' }],
    jobDesc: [{ required: true, message: '请输入描述', trigger: 'blur' }],
    executorRouteStrategy: [{ required: true, message: '请选择', trigger: 'blur' }],
    jobCron: [{ required: true, message: '请输入Cron', trigger: 'blur' }],
    glueType: [{ required: true, message: '请选择', trigger: 'blur' }],
    executorBlockStrategy: [{ required: true, message: '请选择', trigger: 'blur' }],
    executorTimeout: [{ required: true, message: '请输入超时时间', trigger: 'blur', type: 'number' }],
    executorFailRetryCount: [{ required: true, message: '请输入重试次数', trigger: 'blur', type: 'number' }],
    author: [{ required: true, message: '请输入负责人', trigger: 'blur' }]
  };

  private permission = {
    add: ['admin', 'jobInfo:add'],
    edit: ['admin', 'jobInfo:edit'],
    del: ['admin', 'jobInfo:del']
  };

  constructor() {
    super()
    this.query = {}
    this.form = {}
  }

  created() {
    this.title = '任务'
    this.url = 'scheduler/info'
    this.crudMethod = { ...crudJobInfo }
    this.defaultForm = {
      id: NaN,
      jobGroup: NaN,
      jobCron: '',
      jobDesc: '',
      author: '',
      alarmEmail: '',
      executorRouteStrategy: '',
      executorHandler: '',
      executorParam: '',
      executorBlockStrategy: '',
      executorTimeout: 0,
      executorFailRetryCount: 0,
      glueType: '',
      glueSource: '',
      glueRemark: '',
      glueUpdatetime: '',
      childJobId: '',
      triggerStatus: NaN,
      triggerLastTime: NaN,
      triggerNextTime: NaN,
      createTime: ''
    }
    this.resetForm()
    if (this.queryOnPresenterCreated) {
      this.toQuery()
    }
    this.getJobGroup()
  }

  private getJobGroup() {
    crudJobGroup.getAll({}).then(res => {
      this.jobGroups = res.data.content
    })
  }

  private parseGlueType(glueType: string) {
    for (let item of (this.dict as any).glue_type) {
      if (item.value === glueType) {
        return item.label
      }
    }
  }

  private parseTriggerStatus(triggerStatus: number) {
    if (triggerStatus === 1) {
      return '运行'
    } else if (triggerStatus === 0) {
      return '停止'
    }
    return '未知'
  }

  private toStart(data: JobInfoData) {
    if (data.id) {
      crudJobInfo.start(data.id).then(res => {
        this.notify('启动成功', NOTIFICATION_TYPE.SUCCESS)
      })
    }
  }

  private toStop(data: JobInfoData) {
    if (data.id) {
      crudJobInfo.pause(data.id).then(res => {
        this.notify('停止成功', NOTIFICATION_TYPE.SUCCESS)
      })
    }
  }

  private doLog(data: JobInfoData) {
    if (data && data.id) {
      (this.$refs.log as Log).jobId = data.id;
    }
    (this.$refs.log as Log).dialog = true;
    (this.$refs.log as Log).doInit()
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .el-input-number .el-input__inner {
  text-align: left;
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
