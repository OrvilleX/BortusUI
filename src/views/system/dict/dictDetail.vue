<template>
  <div>
    <div v-if="query.dictName === ''">
      <div class="my-code">点击字典查看详情</div>
    </div>
    <div v-else>
      <!--工具栏-->
      <div class="head-container">
        <div v-if="crud.props.searchToggle">
          <!-- 搜索 -->
          <el-input
            v-model="query.label"
            clearable
            size="small"
            placeholder="输入字典标签查询"
            style="width: 200px"
            class="filter-item"
            @keyup.enter.native="toQuery"
          />
          <rrOperation />
        </div>
      </div>
      <!--表单组件-->
      <el-dialog
        append-to-body
        :close-on-click-modal="false"
        :before-close="crud.cancelCU"
        :visible="crud.status.cu > 0"
        :title="crud.status.title"
        width="500px"
      >
        <el-form
          ref="form"
          :model="form"
          :rules="rules"
          size="small"
          label-width="80px"
        >
          <el-form-item label="字典标签" prop="label">
            <el-input v-model="form.label" style="width: 370px" />
          </el-form-item>
          <el-form-item label="字典值" prop="value">
            <el-input v-model="form.value" style="width: 370px" />
          </el-form-item>
          <el-form-item label="排序" prop="dictSort">
            <el-input-number
              v-model.number="form.dictSort"
              :min="0"
              :max="999"
              controls-position="right"
              style="width: 370px"
            />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button
            :loading="crud.status.cu === 2"
            type="primary"
            @click="crud.submitCU"
            >确认</el-button
          >
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table
        ref="table"
        v-loading="crud.loading"
        :data="crud.data"
        highlight-current-row
        style="width: 100%"
        @selection-change="crud.selectionChangeHandler"
      >
        <el-table-column label="所属字典">
          {{ query.dictName }}
        </el-table-column>
        <el-table-column prop="label" label="字典标签" />
        <el-table-column prop="value" label="字典值" />
        <el-table-column prop="dictSort" label="排序" />
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
                  :disabled="disabledDle"
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
        style="margin-top: 8px"
        layout="total, prev, pager, next, sizes"
        @size-change="sizeChangeHandler($event)"
        @current-change="pageChangeHandler"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import crudDictDetail from "@/api/system/dictDetail";
import CRUD from "@/components/Crud";
import { mixins } from "vue-class-component";
import {
  IDictDetailQueryData,
  IDictDetailDtoData,
  IDictDetailData,
} from "@/types/dictDetail";

@Component({
  name: "dictDetail"
})
export default class extends mixins<
  CRUD<IDictDetailData, IDictDetailQueryData, IDictDetailDtoData>
>(CRUD) {
  public dictId: number = NaN;
  private rules = {
    label: [{ required: true, message: "请输入字典标签", trigger: "blur" }],
    value: [{ required: true, message: "请输入字典值", trigger: "blur" }],
    dictSort: [
      {
        required: true,
        message: "请输入序号",
        trigger: "blur",
        type: "number",
      },
    ],
  };
  private permission = {
    add: ["admin", "dict:add"],
    edit: ["admin", "dict:edit"],
    del: ["admin", "dict:del"],
  };

  created() {
    this.title = "字典详情";
    this.url = "api/dictDetail";
    this.query = {
      dictName: "",
    };
    this.sort = ["dictSort,asc", "id,desc"];
    this.crudMethod = { ...crudDictDetail };
    this.optShow = {
      add: true,
      edit: true,
      del: true,
      reset: false,
      download: false,
    };
    this.queryOnPresenterCreated = false;
    this.defaultForm = {
      id: this.dictId,
      label: "",
      value: "",
      dictSort: 999,
    };
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .el-input-number .el-input__inner {
  text-align: left;
}
</style>
