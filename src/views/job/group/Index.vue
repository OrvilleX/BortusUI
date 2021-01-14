<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="props.searchToggle">
        <!-- 搜索 -->
        <el-input
          v-model="query.appName"
          clearable
          size="small"
          placeholder="输入名称搜索"
          style="width: 200px"
          class="filter-item"
          @keyup.enter.native="toQuery"
        />
        <el-input
          v-model="query.title"
          clearable
          size="small"
          placeholder="输入标题搜索"
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
        <el-form-item label="名称" prop="appName">
          <el-input v-model="form.appName" style="width: 370px" />
        </el-form-item>
        <el-form-item label="标题" prop="title">
            <el-input v-model="form.title" style="width: 370px" />
        </el-form-item>
        <el-form-item label="注册方式">
          <el-radio-group v-model="form.addressType" size="mini">
            <el-radio-button label="1">手动注册</el-radio-button>
            <el-radio-button label="0">自动注册</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="机器地址" prop="addressList">
            <el-input type="textarea" :disabled="form.addressType == 1 ? false : true" v-model="form.addressList" :rows="5" style="width: 370px" />
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
      <el-table-column label="名称" prop="appName" />
      <el-table-column label="标题" prop="title" />
      <el-table-column label="注册方式" align="center" prop="addressType">
        <template slot-scope="scope">
            <span>{{ scope.row.addressType === 1 ? '手动注册':'自动注册' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="机器地址" prop="addressList" />
      <el-table-column prop="createTime" label="创建日期">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-permission="['admin', 'jobGroup:edit', 'jobGroup:del']"
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
                v-permission="permission.del"
                :loading="dataStatus[getDataId(scope.row)].delete === 2"
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
import crudJobGroup from '@/api/job/group'
import { parseTime } from '@/utils/index'
import CRUD from '@/components/Crud'
import { mixins } from 'vue-class-component'
import { JobGroupQueryData, JobGroupData } from '@/types/jobGroup'

@Component({
  name: 'JobGroup'
})
export default class extends mixins<
  CRUD<JobGroupData, JobGroupQueryData, JobGroupData>
>(CRUD) {
  parseTime = parseTime;

  private rules = {
    appName: [{ required: true, message: '请输入名称', trigger: 'blur' }],
    title: [{ required: true, message: '请输入标题', trigger: 'blur' }]
  };

  private permission = {
    add: ['admin', 'jobGroup:add'],
    edit: ['admin', 'jobGroup:edit'],
    del: ['admin', 'jobGroup:del']
  };

  constructor() {
    super()
    this.query = {}
    this.form = {}
  }

  created() {
    this.title = '执行器'
    this.url = 'scheduler/group'
    this.crudMethod = { ...crudJobGroup }
    this.defaultForm = {
      id: NaN,
      appName: '',
      title: '',
      addressType: 0,
      addressList: '',
      registryList: []
    }
    this.resetForm()
    if (this.queryOnPresenterCreated) {
      this.toQuery()
    }
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
