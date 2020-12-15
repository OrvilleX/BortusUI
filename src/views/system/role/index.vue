<template>
  <div class="app-container">
    <!--表单组件-->
    <eForm ref="form" :is-add="isAdd" />
    <!--工具栏-->
    <div class="head-container">
      <!-- 搜索 -->
      <el-input v-model="query.value" clearable placeholder="输入名称或者描述搜索" style="width: 200px" class="filter-item" @keyup.enter.native="toQuery" />
      <date-range-picker v-model="query.createTime" class="date-item" />
      <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery" >搜索</el-button>
      <!-- 新增 -->
      <div v-permission="['ADMIN', 'ROLES_ALL', 'ROLES_CREATE']" style="display: inline-block; margin: 0px 2px" >
        <el-button class="filter-item" size="mini" type="primary" icon="el-icon-plus" @click="add" >新增</el-button>
      </div>
    </div>
    <el-row :gutter="15">
      <!--角色管理-->
      <el-col
        :xs="24"
        :sm="24"
        :md="16"
        :lg="16"
        :xl="17"
        style="margin-bottom: 10px"
      >
        <el-card class="box-card" shadow="never">
          <div slot="header" class="clearfix">
            <span class="role-span">角色列表</span>
            <div id="opt" style="float: right">
              <el-radio-group v-model="opt" size="mini">
                <el-radio-button label="菜单分配" />
                <el-radio-button label="权限分配" />
              </el-radio-group>
            </div>
          </div>
          <el-table
            v-loading="loading"
            :data="data"
            highlight-current-row
            size="small"
            style="width: 100%"
            @current-change="handleCurrentChange"
          >
            <el-table-column prop="name" label="名称" />
            <el-table-column prop="dataScope" label="数据权限" />
            <el-table-column prop="level" label="角色级别" />
            <el-table-column
              :show-overflow-tooltip="true"
              prop="remark"
              label="描述"
            />
            <el-table-column
              :show-overflow-tooltip="true"
              prop="createTime"
              label="创建日期"
            >
              <template slot-scope="scope">
                <span>{{ parseTime(scope.row.createTime) }}</span>
              </template>
            </el-table-column>
            <el-table-column
              v-if="
                checkPermission([
                  'ADMIN',
                  'ROLES_ALL',
                  'ROLES_EDIT',
                  'ROLES_DELETE',
                ])
              "
              label="操作"
              width="130px"
              align="center"
              fixed="right"
            >
              <template slot-scope="scope">
                <el-button
                  v-permission="['ADMIN', 'ROLES_ALL', 'ROLES_EDIT']"
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="edit(scope.row)"
                />
                <el-popover
                  v-permission="['ADMIN', 'ROLES_ALL', 'ROLES_DELETE']"
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
                    type="danger"
                    icon="el-icon-delete"
                    size="mini"
                  />
                </el-popover>
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
        </el-card>
      </el-col>
      <!-- 授权 -->
      <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="7">
        <el-card v-show="opt === '菜单分配'" class="box-card" shadow="never">
          <div slot="header" class="clearfix">
            <el-tooltip
              class="item"
              effect="dark"
              content="选择指定角色分配菜单"
              placement="top"
            >
              <span class="role-span">菜单分配</span>
            </el-tooltip>
            <el-button
              v-permission="['ADMIN', 'ROLES_ALL', 'ROLES_EDIT']"
              :disabled="!showButton"
              :loading="menuLoading"
              icon="el-icon-check"
              size="mini"
              style="float: right; padding: 6px 9px"
              type="primary"
              @click="saveMenu"
              >保存</el-button
            >
          </div>
          <el-tree
            ref="menu"
            :data="menus"
            :default-checked-keys="menuIds"
            :props="defaultProps"
            accordion
            show-checkbox
            node-key="id"
          />
        </el-card>
        <el-card v-show="opt === '权限分配'" class="box-card" shadow="never">
          <div slot="header" class="clearfix">
            <el-tooltip
              class="item"
              effect="dark"
              content="选择指定角色分配权限"
              placement="top"
            >
              <span class="role-span">权限分配</span>
            </el-tooltip>
            <el-button
              v-permission="['ADMIN', 'ROLES_ALL', 'ROLES_EDIT']"
              :disabled="!showButton"
              :loading="permissionLoading"
              icon="el-icon-check"
              size="mini"
              style="float: right; padding: 6px 9px"
              type="primary"
              @click="savePermission"
              >保存</el-button
            >
          </div>
          <el-tree
            ref="permission"
            :data="permissions"
            :default-checked-keys="permissionIds"
            :props="defaultProps"
            show-checkbox
            accordion
            node-key="id"
          />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { checkPermission } from "@/utils/permission";
import initData from "@/mixins/initData";
import { del } from "@/api/system/role";
import { getMenusTree } from "@/api/system/menu";
import { parseTime } from "@/utils/index";
import eForm from "./Form.vue";
import { edit, editMenu, get } from "@/api/system/role";
import { mixins } from "vue-class-component";
import { IRoleQueryData, IRoleDtoData, IRoleData } from "@/types/role";
import { IMenuDtoData } from "@/types/menu";
import { getDepts, getDeptSuperior } from "@/api/system/dept";
import { ElTree } from "element-ui/types/tree";

interface IRoleSearch {
  value?: string;
}

@Component({
  name: "Role",
  components: {
    eForm,
  },
})
export default class extends mixins<
  initData<IRoleQueryData, IRoleDtoData, IRoleSearch>
>(initData) {
  currentId = 0;
  menuLoading = false;
  showButton = false;
  opt = "菜单分配";
  delLoading = false;
  menus: IMenuDtoData[] = [];
  menuIds: number[] = [];
  parseTime = parseTime;
  checkPermission = checkPermission;
  defaultProps = {
    children: "children",
    label: "label",
  };
  permission = {
    add: ["admin", "roles:add"],
    edit: ["admin", "roles:edit"],
    del: ["admin", "roles:del"],
  };

  created() {
    this.getMenus();
    this.$nextTick(() => {
      this.init();
    });
  }

  beforeInit() {
    this.showButton = false;
    this.url = "api/roles";
    const sort = "level,asc";
    const query = this.query;
    const value = query.value;
    this.params = { page: this.page, size: this.size, sort: sort };
    if (value) {
      this.params["blurry"] = value;
    }
    // 清空权限与菜单的选中
    this.$refs.permission.setCheckedKeys([]);
    this.$refs.menu.setCheckedKeys([]);
    return true;
  }

  subDelete(id) {
    this.delLoading = true;
    del(id)
      .then((res) => {
        this.delLoading = false;
        this.$refs[id].doClose();
        this.dleChangePage();
        this.init();
        this.$notify({
          title: "删除成功",
          type: "success",
          duration: 2500,
        });
      })
      .catch((err) => {
        this.delLoading = false;
        this.$refs[id].doClose();
        console.log(err.response.data.message);
      });
  }

  getPermissions() {
    getPermissionTree().then((res) => {
      this.permissions = res;
    });
  }

  getMenus() {
    getMenusTree().then((res) => {
      this.menus = res;
    });
  }

  private handleCurrentChange(val: IRoleData) {
    if (val) {
      const _this = this;
      (this.$refs.menu as any).setCheckedKeys([]);
      if (val.id) {
      this.currentId = val.id;
      }
      this.showButton = true;
      this.menuIds = [];
      if (val.menus)
      {
      val.menus.forEach((data: any, index: number) => {
        let add = true;
        if (val.menus) {
        for (let i = 0; i < val.menus.length; i++) {
          if (data.id === (val.menus[i] as any).pid) {
            add = false;
            break;
          }
        }
        }
        if (add) {
          _this.menuIds.push(data.id);
        }
      })
      }
      // 处理权限数据
      val.permissions.forEach(function (data, index) {
        _this.menuIds.push(data.id);
      });
    }
  }

    private menuChange(menu: any) {
      const index = this.menuIds.indexOf(menu.id)
      if (index !== -1) {
        this.menuIds.splice(index, 1)
      } else {
        this.menuIds.push(menu.id)
      }
    }

  private async saveMenu() {
      this.menuLoading = true
      const role: IRoleData = { id: this.currentId, menus: [] }
      this.menuIds.forEach(function(id) {
        const menu = { id: id }
        if (role.menus) {
        role.menus.push(menu)
        }
      })
      try {
    await editMenu(role)
        this.$notify({
          title: "保存成功",
          type: "success",
          message: "",
          duration: 2500,
        });
        this.menuLoading = false;
        this.update();
      } catch(err) {
        this.menuLoading = false;
        console.log(err.response.data.message);
      });
  }

  private async update() {
    let res = await get(this.currentId)
      for (let i = 0; i < this.data.length; i++) {
        if (res.data.id === this.data[i].id) {
          this.data[i] = res.data
          break;
        }
      }
    }

  private add() {
    this.isAdd = true;
    (this.$refs.form as eForm).dialog = true;
  }

  private edit(data: IRoleDtoData) {
    this.isAdd = false;
    const roleForm = this.$refs.form as eForm
    roleForm.deptIds = [];
    roleForm.form = {
      id: data.id,
      name: data.name,
      description: data.description,
      depts: data.depts,
      dataScope: data.dataScope,
      level: data.level,
    };
    if (roleForm.form.dataScope === "自定义") {
      roleForm.getDepts();
    }
    roleForm.dialog = true;
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.role-span {
  font-weight: bold;
  color: #303133;
  font-size: 15px;
}
</style>

<style scoped>
/deep/ .el-tree-node__label {
  margin-left: 5px;
}
</style>
