<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="props.searchToggle">
        <el-input
          v-model="query.name"
          clearable
          size="small"
          placeholder="输入岗位名称搜索"
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
            v-for="item in dict.dict.job_status"
            :key="item.value"
            :label="item.label"
            :value="item.value"
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
    <!--表格渲染-->
    <el-table
      ref="table"
      v-loading="loading"
      :data="data"
      style="width: 100%"
      @selection-change="selectionChangeHandler"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="jobSort" label="排序">
        <template slot-scope="scope">
          {{ scope.row.jobSort }}
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.enabled"
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
      <!--   编辑与删除   -->
      <el-table-column
        v-permission="['admin', 'job:edit', 'job:del']"
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
              <p>确定删除本条数据吗？</p>
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
    <!--表单渲染-->
    <el-dialog
      append-to-body
      :close-on-click-modal="false"
      :before-close="cancelCU"
      :visible="status.cu > 0"
      :title="status.title"
      width="500px"
    >
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        size="small"
        label-width="80px"
      >
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" style="width: 370px" />
        </el-form-item>
        <el-form-item label="排序" prop="jobSort">
          <el-input-number
            v-model.number="form.jobSort"
            :min="0"
            :max="999"
            controls-position="right"
            style="width: 370px"
          />
        </el-form-item>
        <el-form-item v-if="form.pid !== 0" label="状态" prop="enabled">
          <el-radio
            v-for="item in dict.job_status"
            :key="item.id"
            v-model="form.enabled"
            :label="item.value === 'true'"
          >
            {{ item.label }}
          </el-radio>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="cancelCU"> 取消 </el-button>
        <el-button :loading="status === 2" type="primary" @click="submitCU">
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { mixins } from "vue-class-component";
import crudJob from "@/api/system/job";
import CRUD from "@/components/Crud";
import DateRangePicker from "@/components/DateRangePicker/Index.vue";
import { IJobQueryData, IJobData } from "@/types/job";
import { NOTIFICATION_TYPE } from "@/components/Crud/base";

@Component({
  name: "Job",
  components: {
    DateRangePicker,
  },
})
export default class extends mixins<CRUD<IJobData, IJobQueryData, IJobData>>(
  CRUD
) {
  private dicts = ["job_status"];
  private permission = {
    add: ["admin", "job:add"],
    edit: ["admin", "job:edit"],
    del: ["admin", "job:del"],
  };
  private rules = {
    name: [{ required: true, message: "请输入名称", trigger: "blur" }],
    jobSort: [
      {
        required: true,
        message: "请输入序号",
        trigger: "blur",
        type: "number",
      },
    ],
  };

  created() {
    this.title = "岗位";
    this.url = "api/job";
    this.sort = ["jobSort,asc", "id,desc"];
    this.crudMethod = { ...crudJob };
    this.defaultForm = {
      id: NaN,
      name: "",
      jobSort: 999,
      enabled: true,
    };
  }

  private changeEnabled(data: IJobData, val: string) {
    this.$confirm(
      '此操作将 "' +
        this.dict.label.job_status[val] +
        '" ' +
        data.name +
        "岗位, 是否继续？",
      "提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }
    )
      .then(() => {
        // eslint-disable-next-line no-undef
        crudJob
          .edit(data)
          .then(() => {
            // eslint-disable-next-line no-undef
            this.notify(
              this.dict.label.job_status[val] + "成功",
              NOTIFICATION_TYPE.SUCCESS
            );
          })
          .catch((err) => {
            data.enabled = !data.enabled;
            console.log(err.data.message);
          });
      })
      .catch(() => {
        data.enabled = !data.enabled;
      });
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
