<template>
  <div class="app-container">
    <div class="head-container">
      <div v-if="props.searchToggle">
        <el-input
          v-model="query.filter"
          clearable
          size="small"
          placeholder="全表模糊搜索"
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
          <el-button
            slot="left"
            class="filter-item"
            type="danger"
            icon="el-icon-delete"
            size="mini"
            :loading="delLoading"
            :disabled="selections.length === 0"
            @click="doDelete(selections)"
          >
            强退
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
      <el-table-column label="操作" width="70px" fixed="right">
        <template slot-scope="scope">
          <el-popover
            :ref="scope.$index"
            v-permission="['admin']"
            placement="top"
            width="180"
          >
            <p>确定强制退出该用户吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button
                size="mini"
                type="text"
                @click="$refs[scope.$index].doClose()"
                >取消</el-button
              >
              <el-button
                :loading="delLoading"
                type="primary"
                size="mini"
                @click="delMethod(scope.row.key, scope.$index)"
                >确定</el-button
              >
            </div>
            <el-button slot="reference" size="mini" type="text">强退</el-button>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
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
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { mixins } from "vue-class-component";
import { IOnlineUserQueryData, IOnlineUserDtoData } from "@/types/online";
import { del } from "@/api/monitor/online";
import CRUD from "@/components/Crud";

interface IOnlineSearchData {
  filter: string;
}

@Component({
  name: "OnlineUser",
})
export default class extends mixins<
  CRUD<IOnlineSearchData, IOnlineUserQueryData, IOnlineUserDtoData>
>(CRUD) {
  private delLoading = false;

  created() {
    this.title = "在线用户";
    this.url = "auth/online";
    this.msg.del = "强退成功！";
    this.optShow = {
      add: false,
      edit: false,
      del: false,
      download: true,
      reset: false,
    };
  }

  async doDelete(datas: number[]) {
    this.$confirm(`确认强退选中的${datas.length}个用户?`, "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
      .then(() => {
        this.delMethod(datas);
      })
      .catch(() => {});
  }

  private delMethod(key: any, index: number = NaN) {
    const ids = [];
    if (key instanceof Array) {
      key.forEach((val) => {
        ids.push(val.key);
      });
    } else ids.push(key);
    this.delLoading = true;
    del(ids)
      .then(() => {
        this.delLoading = false;
        if (this.$refs[index]) {
          (this.$refs[index] as any).doClose();
        }
        this.dleChangePage(1);
        this.delSuccessNotify();
        this.toQuery();
      })
      .catch(() => {
        this.delLoading = false;
        if (this.$refs[index]) {
          (this.$refs[index] as any).doClose();
        }
      });
  }
}
</script>
