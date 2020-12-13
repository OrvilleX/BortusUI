<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!-- 搜索 -->
      <el-input
        v-model="query.value"
        clearable
        placeholder="输入部门名称搜索"
        style="width: 200px"
        class="filter-item"
        @keyup.enter.native="toQuery"
      />
      <el-select
        v-model="query.enabled"
        clearable
        placeholder="状态"
        class="filter-item"
        style="width: 90px"
        @change="toQuery"
      >
        <el-option
          v-for="item in enabledTypeOptions"
          :key="item.key"
          :label="item.display_name"
          :value="item.key"
        />
      </el-select>
      <el-button
        class="filter-item"
        size="mini"
        type="success"
        icon="el-icon-search"
        @click="toQuery"
        >搜索</el-button
      >
      <!-- 新增 -->
      <div
        v-permission="['ADMIN', 'DEPT_ALL', 'DEPT_CREATE']"
        style="display: inline-block; margin: 0px 2px"
      >
        <el-button
          class="filter-item"
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="add"
          >新增</el-button
        >
      </div>
      <div style="display: inline-block">
        <el-button
          class="filter-item"
          size="mini"
          type="warning"
          icon="el-icon-more"
          @click="changeExpand"
          >{{ expand ? "折叠" : "展开" }}</el-button
        >
        <eForm ref="form" :is-add="true" :dicts="dicts" />
      </div>
    </div>
    <!--表单组件-->
    <eForm ref="form" :is-add="isAdd" :dicts="dicts" />
    <!--表格渲染-->
    <el-table
      ref="table"
      v-loading="loading"
      lazy
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      :data="data"
      row-key="id"
    >
      <el-table-column label="名称" prop="name" />
      <el-table-column label="排序" prop="deptSort" />
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <div v-for="item in dicts" :key="item.id">
            <el-tag
              v-if="scope.row.enabled.toString() === item.value"
              :type="scope.row.enabled ? '' : 'info'"
              >{{ item.label }}</el-tag
            >
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建日期">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="
          checkPermission(['ADMIN', 'DEPT_ALL', 'DEPT_EDIT', 'DEPT_DELETE'])
        "
        label="操作"
        width="130px"
        align="center"
        fixed="right"
      >
        <template slot-scope="scope">
          <el-button
            v-permission="['ADMIN', 'DEPT_ALL', 'DEPT_EDIT']"
            size="mini"
            type="primary"
            icon="el-icon-edit"
            @click="edit(scope.row)"
          />
          <el-popover
            v-permission="['ADMIN', 'DEPT_ALL', 'DEPT_DELETE']"
            :ref="scope.row.id"
            placement="top"
            width="180"
          >
            <p>确定删除本条数据吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button
                size="mini"
                type="text"
                @click="$refs[scope.row.id].doClose()"
                >取消</el-button
              >
              <el-button
                :loading="delLoading"
                type="primary"
                size="mini"
                @click="subDelete(scope.row.id)"
                >确定</el-button
              >
            </div>
            <el-button
              slot="reference"
              :disabled="scope.row.id === 1"
              type="danger"
              icon="el-icon-delete"
              size="mini"
            />
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { checkPermission } from "@/utils/permission";
import initData from "@/mixins/initData";
import initDict from "@/mixins/initDict";
import { del } from "@/api/system/dept";
import { parseTime } from "@/utils/index";
import eForm from "./Form.vue";
import { mixins } from "vue-class-component";
import { IDeptQueryData, IDeptDtoData } from "@/types/dept";

interface IDeptSearch {
  value?: string;
  enabled?: boolean;
}

@Component({
  name: "Dept",
  components: {
    eForm,
  },
})
export default class extends mixins<
  initData<IDeptQueryData, IDeptDtoData, IDeptSearch>,
  initDict
>(initData, initDict) {
  private enabledTypeOptions = [
    { key: "true", display_name: "正常" },
    { key: "false", display_name: "禁用" },
  ];
  private delLoading = false;
  private expand = true;
  parseTime = parseTime;
  checkPermission = checkPermission;

  created() {
    this.$nextTick(() => {
      this.init();
      this.getDict("dept_status");
    });
  }

  beforeInit() {
    this.url = "api/dept";
    const sort = "id,desc";
    this.params = {
      page: this.page,
      size: this.size,
      sort: sort,
      name: this.query.value,
      enabled: this.query.enabled,
    };
    return true;
  }

  private async subDelete(id: number) {
    this.delLoading = true;
    try {
      await del([id]);
      this.delLoading = false;
      (this.$refs[id] as any).doClose();
      this.init();
      this.$notify({
        title: "删除成功",
        type: "success",
        message: "",
        duration: 2500,
      });
    } catch (err) {
      this.delLoading = false;
      (this.$refs[id] as any).doClose();
      console.log(err.response.data.message);
    }
  }

  private async add() {
    this.isAdd = true;
    const deptForm = this.$refs.form as eForm;
    await deptForm.getDepts();
    deptForm.dialog = true;
  }

  private changeExpand() {
    this.expand = !this.expand;
    this.init();
  }

  private async edit(data: IDeptDtoData) {
    this.isAdd = false;
    const deptForm = this.$refs.form as eForm;
    await deptForm.getDepts();
    deptForm.form = {
      id: data.id,
      name: data.name,
      pid: data.pid,
      createTime: data.createTime,
      enabled: data.enabled,
    };
    deptForm.dialog = true;
  }
}
</script>
