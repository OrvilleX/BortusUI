<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!-- 搜索 -->
      <el-input
        v-model="query.value"
        clearable
        placeholder="模糊搜索"
        style="width: 200px"
        class="filter-item"
        @keyup.enter.native="toQuery"
      />
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
        v-permission="['ADMIN', 'MENU_ALL', 'MENU_CREATE']"
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
          @click="changExpand"
          >{{ expand ? "折叠" : "展开" }}</el-button
        >
        <eForm ref="form" :is-add="true" />
      </div>
    </div>
    <!--表单组件-->
    <eForm ref="form" :is-add="isAdd" />
    <!--表格渲染-->
    <el-table
      ref="table"
      v-loading="loading"
      lazy
      :data="data"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      :columns="columns"
      row-key="id"
      :height="height"
      size="small"
    >
      <el-table-column prop="icon" label="图标" align="center" width="60px">
        <template slot-scope="scope">
          <svg-icon :icon-class="scope.row.icon" />
        </template>
      </el-table-column>
      <el-table-column prop="sort" align="center" label="排序">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.sort }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="path"
        label="链接地址"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        prop="componentName"
        label="组件名称"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        prop="component"
        label="组件路径"
        width="130px"
      />
      <el-table-column prop="iframe" label="内部菜单">
        <template slot-scope="scope">
          <span v-if="!scope.row.iframe">是</span>
          <span v-else>否</span>
        </template>
      </el-table-column>
      <el-table-column prop="iframe" label="是否缓存">
        <template slot-scope="scope">
          <span v-if="scope.row.cache">是</span>
          <span v-else>否</span>
        </template>
      </el-table-column>
      <el-table-column prop="iframe" label="是否隐藏">
        <template slot-scope="scope">
          <span v-if="scope.row.hidden">是</span>
          <span v-else>否</span>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建日期" width="135px">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="
          checkPermission(['ADMIN', 'MENU_ALL', 'MENU_EDIT', 'MENU_DELETE'])
        "
        label="操作"
        width="130px"
        align="center"
        fixed="right"
      >
        <template slot-scope="scope">
          <el-button
            v-permission="['ADMIN', 'MENU_ALL', 'MENU_EDIT']"
            size="mini"
            type="primary"
            icon="el-icon-edit"
            @click="edit(scope.row)"
          />
          <el-popover
            v-permission="['ADMIN', 'MENU_ALL', 'MENU_DELETE']"
            :ref="scope.row.id"
            placement="top"
            width="200"
          >
            <p>确定删除吗,如果存在下级节点则一并删除，此操作不能撤销！</p>
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
import { Vue, Component } from "vue-property-decorator";
import { checkPermission } from "@/utils/permission";
import initData from "@/mixins/initData";
import { del } from "@/api/system/menu";
import { parseTime } from "@/utils/index";
import eForm from "./Form.vue";
import { mixins } from "vue-class-component";
import { IMenuQueryData, IMenuDtoData } from "@/types/menu";

interface IMenuSearch {
  value?: string;
}

@Component({
  name: "Menu",
  components: {
    eForm,
  },
})
export default class extends mixins<
  initData<IMenuQueryData, IMenuDtoData, IMenuSearch>
>(initData) {
  delLoading = false;
  expand = true;
  height = 625;
  parseTime = parseTime;
  checkPermission = checkPermission;
  columns = [
    {
      text: "名称",
      value: "name",
      width: 140,
    },
  ];

  created() {
    this.$nextTick(() => {
      this.height = document.documentElement.clientHeight - 200;
      this.init();
    });
  }

  beforeInit() {
    this.url = "api/menus";
    const sort = "id,desc";
    const query = this.query;
    const value = query.value;
    this.params = { page: this.page, size: this.size, sort: sort };
    if (value) {
      this.params["blurry"] = value;
    }
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
    await (this.$refs.form as eForm).getMenus();
    (this.$refs.form as eForm).dialog = true;
  }

  private async edit(data: IMenuDtoData) {
    this.isAdd = false;
    const menuForm = this.$refs.form as eForm;
    await menuForm.getMenus();
    menuForm.form = {
      id: data.id,
      component: data.component,
      componentName: data.componentName,
      title: data.title,
      menuSort: data.menuSort,
      pid: data.pid,
      path: data.path,
      iFrame: data.iFrame,
      icon: data.icon,
      cache: data.cache,
      hidden: data.hidden,
    };
    menuForm.dialog = true;
  }

  private changExpand() {
    this.expand = !this.expand;
    this.init();
  }
}
</script>

<style scoped>
</style>
