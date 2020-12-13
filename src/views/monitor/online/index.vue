<template>
  <div class="app-container">
    <div class="head-container">
      <el-input
        v-model="query.filter"
        clearable
        size="small"
        placeholder="全表模糊搜索"
        style="width: 200px"
        class="filter-item"
        @keyup.enter.native="toQuery"
      />
      <el-button
        class="filter-item"
        size="mini"
        type="success"
        icon="el-icon-search"
        @click="$parent.toQuery"
        >搜索</el-button
      >
    </div>
    <!--表格渲染-->
    <el-table ref="table" v-loading="loading" :data="data" style="width: 100%">
      <el-table-column type="selection" width="55" />
      <el-table-column prop="userName" label="用户名" />
      <el-table-column prop="nickName" label="用户昵称" />
      <el-table-column prop="dept" label="部门" />
      <el-table-column prop="ip" label="登录IP" />
      <el-table-column
        :show-overflow-tooltip="true"
        prop="address"
        label="登录地点"
      />
      <el-table-column prop="browser" label="浏览器" />
      <el-table-column prop="loginTime" label="登录时间">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.loginTime) }}</span>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <el-pagination
      :total="total"
      :current-page="page + 1"
      style="margin-top: 8px"
      layout="total, prev, pager, next, sizes"
      @size-change="sizeChange"
      @current-change="pageChange"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import InitData from "@/mixins/initData";
import { mixins } from "vue-class-component";
import { IOnlineUserQueryData, IOnlineUserDtoData } from "@/types/online";

interface IOnlineSearchData {
  filter: string;
}

@Component({
  name: "OnlineUser",
})
export default class extends mixins<
  InitData<IOnlineUserQueryData, IOnlineUserDtoData, IOnlineSearchData>
>(InitData) {
  created() {
    this.$nextTick(() => {
      this.init();
    });
  }

  beforeInit() {
    this.url = "api/auth/online";
    const sort = "id,desc";
    this.params = {
      page: this.page,
      size: this.size,
      sort: sort,
      filter: this.query.filter,
    };
    return true;
  }
}
</script>
