<template>
  <div class="app-container">
    <div class="head-container">
      <Search :query="query" />
    </div>
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" style="width: 100%">
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
import { getErrDetail, delAllError } from "@/api/monitor/log";
import { parseTime } from "@/utils/index";
import Search, { ILogSearch } from "./Search.vue";
import { mixins } from "vue-class-component";
import { ILogQueryData, ILogErrorDTOData } from "@/types/log";

@Component({
  name: "ErrorLog",
  components: {
    Search,
  },
})
export default class extends mixins<
  InitData<ILogQueryData, ILogErrorDTOData, ILogSearch>
>(InitData) {
  private errorInfo = "";
  private dialog = false;

  created() {
    this.$nextTick(() => {
      this.init()
    })
  }

  private parseTime = parseTime;

  private async info(id: number) {
    this.dialog = true;
    let res = await getErrDetail(id);
    this.errorInfo = res.data.exception;
  }

  beforeInit() {
    this.url = "api/logs/error"
    const sort = "id,desc"
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
