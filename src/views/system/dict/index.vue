<template>
  <div class="app-container">
    <!--表单组件-->
    <el-dialog append-to-body :close-on-click-modal="false" :before-close="cancelCU" :visible="status > 0"
      :title="dialogTitle" width="500px">
      <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
        <el-form-item label="字典名称" prop="name">
          <el-input v-model="form.name" style="width: 370px" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.description" style="width: 370px" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="cancelCU">取消</el-button>
        <el-button :loading="status === 2" type="primary" @click="submitCU"
          >确认</el-button
        >
      </div>
    </el-dialog>
    <el-row :gutter="10">
      <el-col
        :xs="24"
        :sm="24"
        :md="10"
        :lg="11"
        :xl="11"
        style="margin-bottom: 10px"
      >
        <el-card class="box-card">
          <div class="head-container">
            <div v-if="props.searchToggle">
              <!-- 搜索 -->
              <el-input
                v-model="query.blurry"
                clearable
                size="small"
                placeholder="输入名称或者描述搜索"
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
          <!--表格渲染-->
          <el-table
            ref="table"
            v-loading="loading"
            :data="data"
            highlight-current-row
            style="width: 100%"
            @selection-change="selectionChangeHandler"
            @current-change="handleCurrentChange"
          >
            <el-table-column type="selection" width="55" />
            <el-table-column
              :show-overflow-tooltip="true"
              prop="name"
              label="名称"
            />
            <el-table-column
              :show-overflow-tooltip="true"
              prop="description"
              label="描述"
            />
            <el-table-column
              v-permission="['admin', 'dict:edit', 'dict:del']"
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
            style="margin-top: 8px;"
            layout="total, prev, pager, next, sizes"
            @size-change="sizeChange($event)"
            @current-change="pageChange"
          />
        </el-card>
      </el-col>
      <!-- 字典详情列表 -->
      <el-col :xs="24" :sm="24" :md="14" :lg="13" :xl="13">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>字典详情</span>
            <el-button
              v-if="
                checkPermission(['admin', 'dict:add']) &&
                this.$refs.dictDetail &&
                this.$refs.dictDetail.query.dictName
              "
              class="filter-item"
              size="mini"
              style="float: right; padding: 4px 10px"
              type="primary"
              icon="el-icon-plus"
              @click="$refs.dictDetail && $refs.dictDetail.toAdd()"
              >新增</el-button
            >
          </div>
          <dictDetail ref="dictDetail" :permission="permission" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import { checkPermission } from '@/utils/permission'
import dictDetail from './dictDetail.vue'
import crudDict from '@/api/system/dict'
import { parseTime } from '@/utils/index'
import CRUD from '@/components/Crud'
import { mixins } from 'vue-class-component'
import { DictQueryData, DictDtoData, DictData } from '@/types/dict'

@Component({
  name: 'Dict',
  components: {
    dictDetail
  }
})
export default class extends mixins<
  CRUD<DictData, DictQueryData, DictDtoData>
>(CRUD) {
  private checkPermission = checkPermission;
  private queryTypeOptions = [
    { key: 'name', displayName: '字典名称' },
    { key: 'description', displayName: '描述' }
  ];
  parseTime = parseTime;

  private rules = {
    name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
  };

  private permission = {
    add: ['admin', 'dict:add'],
    edit: ['admin', 'dict:edit'],
    del: ['admin', 'dict:del']
  };

  constructor() {
    super()
    this.query = {}
    this.form = {}
  }

  created() {
    this.title = '字典'
    this.url = 'api/dict'
    this.crudMethod = { ...crudDict }
    this.defaultForm = {
      id: NaN,
      name: '',
      description: '',
      dictDetails: []
    }
    this.resetForm()
    if (this.queryOnPresenterCreated) {
      this.toQuery()
    }
  }

  beforeRefresh() {
    if (this.$refs.dictDetail) {
      (this.$refs.dictDetail as dictDetail).query.dictName = ''
    }
    return true
  }

  handleCurrentChange(val: DictDtoData) {
    if (val) {
      (this.$refs.dictDetail as dictDetail).query.dictName = val.name;
      (this.$refs.dictDetail as dictDetail).dictId = val.id;
      (this.$refs.dictDetail as dictDetail).toQuery()
    }
  }
}
</script>

<style scoped>
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
