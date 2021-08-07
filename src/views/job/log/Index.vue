<template>
  <div class="app-container">
    <!-- 搜索 -->
    <div class="head-container">
      <el-select
        v-model="query.jobId"
        clearable
        size="small"
        placeholder="任务"
        class="filter-item"
        style="width: 120px"
        @change="toQuery"
      >
        <el-option
          v-for="item in jobInfos"
          :key="item.id"
          :label="item.jobDesc"
          :value="item.id"
        />
      </el-select>
      <date-range-picker v-model="query.triggerTime" class="date-item" />
      <el-button
        class="filter-item"
        size="mini"
        type="success"
        icon="el-icon-search"
        @click="toQuery"
        >搜索</el-button
      >
      <!-- 导出 -->
      <div style="display: inline-block">
        <el-button
          :loading="downloadLoading"
          size="mini"
          class="filter-item"
          type="warning"
          icon="el-icon-download"
          @click="downloadMethod"
          >导出</el-button
        >
      </div>
    </div>
    <!--表格渲染-->
    <el-table
      v-loading="loading"
      :data="data"
      style="width: 100%; margin-top: -10px"
    >
      <el-table-column
        :show-overflow-tooltip="true"
        prop="triggerTime"
        label="调度时间"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        prop="triggerCode"
        label="调度结果"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        prop="triggerMsg"
        label="调度备注"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        prop="executorAddress"
        width="120px"
        label="执行器地址"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        prop="executorParam"
        label="任务参数"
      />
      <el-table-column prop="createTime" label="异常详情" width="110px">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            @click="info(scope.row)"
            >查看详情</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      :visible.sync="errorDialog"
      append-to-body
      title="异常详情"
      width="85%"
    >
      <pre v-highlightjs="errorInfo"><code class="java" /></pre>
    </el-dialog>
    <!--分页组件-->
    <el-pagination
      :total="total"
      :current-page="page + 1"
      :page-size="6"
      style="margin-top: 8px"
      layout="total, prev, pager, next"
      @size-change="sizeChange"
      @current-change="pageChange"
    />
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import crud from '@/mixins/crud'
import DateRangePicker from '@/components/DateRangePicker/Index.vue'
import { JobLogQueryData, JobLogData } from '@/types/jobLog'
import crudJobInfo from '@/api/job/info'
import crudJobLog from '@/api/job/log'
import { mixins } from 'vue-class-component'
import { JobInfoData } from '@/types/jobInfo'

@Component({
  name: 'JobLog',
  components: {
    DateRangePicker
  }
})
export default class extends mixins<crud<JobLogData, JobLogQueryData, JobLogData>>(
  crud
) {
  errorInfo = '';
  errorDialog = false;
  jobId = 0;
  jobInfos: JobInfoData[] = []

  constructor() {
    super()
    this.query = {}
    this.form = {}
  }

  created() {
    this.title = '任务日志'
    this.getJobInfo()
    if (this.$route.query.jobId) {
      this.query.jobId = Number.parseInt(this.$route.query.jobId.toString())
    }
    this.init()
  }

  private getJobInfo() {
    crudJobInfo.getAll({}).then(res => {
      this.jobInfos = res.data.content
    })
  }

  beforeInit() {
    this.url = 'scheduler/log'
    this.size = 6
    return true
  }

  info(log: JobLogData) {
    crudJobLog.getFromExecutor(log.executorAddress, log.triggerTime, log.id, 0).then(res => {
      this.errorInfo = res.data.logContent
      this.errorDialog = true
    })
  }
}
</script>

<style rel="stylesheet/scss" scoped>
.java.hljs {
  color: #444;
  background: #ffffff !important;
}
::v-deep .el-dialog__body {
  padding: 0 20px 10px 20px !important;
}
</style>
