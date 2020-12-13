<template>
  <div class="app-container">
    <div class="head-container">
      <Search :query="query" />
    </div>
    <!--表格渲染-->
    <el-table
      ref="table"
      v-loading="loading"
      :data="data"
      style="width: 100%"
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
      <el-table-column prop="time" label="请求耗时" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.time <= 300">{{ scope.row.time }}ms</el-tag>
          <el-tag v-else-if="scope.row.time <= 1000" type="warning"
            >{{ scope.row.time }}ms</el-tag
          >
          <el-tag v-else type="danger">{{ scope.row.time }}ms</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建日期" width="180px">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
    </el-table>
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
import { mixins } from "vue-class-component";
import Search, { ILogSearch } from './Search.vue'
import { ILogQueryData, ILogData } from '@/types/log'
import InitData from "@/mixins/initData";
import { parseTime } from "@/utils";

@Component({
  name: 'Log',
  components: {
    Search
  }
})
export default class extends mixins<InitData<ILogQueryData, ILogData, ILogSearch>>(InitData) {
  parseTime = parseTime

  created() {
    this.$nextTick(() => {
      this.init()
    })
  }

  beforeInit() {
      this.url = 'api/logs'
      const sort = 'id,desc'
      this.params = { 
        page: this.page, 
        size: this.size, 
        sort: sort,
        blurry: this.query.blurry,
        createTime: this.query.createTime
      }
      return true
  }
} 
</script>

<style>
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
</style>
