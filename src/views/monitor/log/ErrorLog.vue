<template>
  <div class="app-container">
    <div class="head-container">
      <div v-if="props.searchToggle">
        <el-input
          v-model="query.blurry"
          clearable
          size="small"
          placeholder="请输入你要搜索的内容"
          style="width: 200px"
          class="filter-item"
          @keyup.enter.native="toQuery"
        />
        <date-range-picker v-model="query.createTime" class="date-item" />
        <el-button
          class="filter-item"
          size="mini"
          type="success"
          icon="el-icon-search"
          @click="toQuery"
          >搜索</el-button
        >
      </div>
      <div class="crud-opts">
        <span class="crud-opts-left">
          <el-button
            slot="left"
            class="filter-item"
            type="danger"
            icon="el-icon-delete"
            size="mini"
            :loading="delAllLoading"
            @click="confirmDelAll()"
          >
            清空
          </el-button>
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
    <!--表格渲染-->
    <el-table
      ref="table"
      v-loading="loading"
      :data="data"
      style="width: 100%"
      @selection-change="selectionChangeHandler"
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="请求方法">
              <span>{{ props.row.method }}</span>
            </el-form-item>
            <el-form-item label="请求参数">
              <span>{{ props.row.params }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column prop="username" label="用户名" />
      <el-table-column prop="requestIp" label="IP" />
      <el-table-column
        :show-overflow-tooltip="true"
        prop="address"
        label="IP来源"
      />
      <el-table-column prop="description" label="描述" />
      <el-table-column prop="browser" label="浏览器" />
      <el-table-column prop="createTime" label="创建日期">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="异常详情" width="100px">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="info(scope.row.id)"
            >查看详情</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      :visible.sync="dialog"
      title="异常详情"
      append-to-body
      top="30px"
      width="85%"
    >
      <pre v-highlightjs="errorInfo"><code class="java" /></pre>
    </el-dialog>
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
import { getErrDetail, delAllError } from '@/api/monitor/log'
import CRUD from '@/components/Crud'
import { parseTime } from '@/utils/index'
import { mixins } from 'vue-class-component'
import { LogQueryData, LogErrorDTOData } from '@/types/log'
import DateRangePicker from '@/components/DateRangePicker/Index.vue'

interface LogSearch {
  blurry?: string
  createTime?: string
}

@Component({
  name: 'ErrorLog',
  components: {
    DateRangePicker
  }
})
export default class extends mixins<
  CRUD<LogSearch, LogQueryData, LogErrorDTOData>
>(CRUD) {
  private errorInfo = '';
  private dialog = false;
  private parseTime = parseTime;

  constructor() {
    super()
    this.query = {}
  }

  created() {
    this.title = '异常日志'
    this.url = 'api/logs/error'
    this.optShow = {
      add: false,
      edit: false,
      del: false,
      download: true,
      reset: false
    }
    if (this.queryOnPresenterCreated) {
      this.toQuery()
    }
  }

  private info(id: number) {
    this.dialog = true
    getErrDetail(id).then(res => {
      this.errorInfo = res.data.exception
    })
  }

  private confirmDelAll() {
    this.$confirm('确认清空所有异常日志吗?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        this.delAllLoading = true
        delAllError()
          .then(() => {
            this.delAllLoading = false
            this.dleChangePage(1)
            this.delSuccessNotify()
            this.toQuery()
          })
          .catch(err => {
            this.delAllLoading = false
            console.log(err.response.data.message)
          })
      })
  }
}
</script>

<style scoped>
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 70px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 100%;
}
.demo-table-expand .el-form-item__content {
  font-size: 12px;
}

.el-dialog__body {
  padding: 0 20px 10px 20px !important;
}
.java.hljs {
  color: #444;
  background: #ffffff !important;
  height: 630px !important;
}
</style>
