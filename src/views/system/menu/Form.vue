<template>
  <el-dialog
    :visible.sync="dialog"
    :close-on-click-modal="false"
    :before-close="cancel"
    :title="isAdd ? '新增菜单' : '编辑菜单'"
    append-to-body
    width="585px"
  >
    <el-form
      ref="form"
      :inline="true"
      :model="form"
      :rules="rules"
      size="small"
      label-width="80px"
    >
      <el-form-item label="菜单图标">
        <el-popover
          placement="bottom-start"
          width="450"
          trigger="click"
          @show="$refs['iconSelect'].reset()"
        >
          <IconSelect ref="iconSelect" @selected="selected" />
          <el-input
            slot="reference"
            v-model="form.icon"
            style="width: 450px"
            placeholder="点击选择图标"
            readonly
          >
            <svg-icon
              v-if="form.icon"
              slot="prefix"
              :icon-class="form.icon"
              class="el-input__icon"
              style="height: 32px; width: 16px"
            />
            <i v-else slot="prefix" class="el-icon-search el-input__icon" />
          </el-input>
        </el-popover>
      </el-form-item>
      <el-form-item label="菜单名称" prop="name">
        <el-input
          v-model="form.title"
          placeholder="名称"
          style="width: 450px"
        />
      </el-form-item>
      <el-form-item label="内部菜单">
        <el-radio-group v-model="form.iframe" size="mini">
          <el-radio-button label="false">是</el-radio-button>
          <el-radio-button label="true">否</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否缓存">
        <el-radio-group v-model="form.cache" size="mini">
          <el-radio-button label="true">是</el-radio-button>
          <el-radio-button label="false">否</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否隐藏">
        <el-radio-group v-model="form.hidden" size="mini">
          <el-radio-button label="true">是</el-radio-button>
          <el-radio-button label="false">否</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="菜单排序" prop="menuSort">
        <el-input-number
          v-model.number="form.menuSort"
          :min="0"
          :max="999"
          controls-position="right"
          style="width: 177px"
        />
      </el-form-item>
      <el-form-item label="链接地址" prop="path">
        <el-input
          v-model="form.path"
          placeholder="链接地址"
          style="width: 177px"
        />
      </el-form-item>
      <el-form-item v-if="form.iFrame === 'false'" label="组件路径">
        <el-input v-model="form.component" placeholder="菜单路径" />
      </el-form-item>
      <el-form-item v-if="form.iFrame === 'false'" label="组件名称">
        <el-input
          v-model="form.componentName"
          placeholder="匹配组件内Name字段"
        />
      </el-form-item>
      <el-form-item label="上级类目">
        <treeselect
          v-model="form.pid"
          :options="menus"
          style="width: 450px"
          placeholder="选择上级类目"
        />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit"
        >确认</el-button
      >
    </div>
  </el-dialog>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { ElForm } from "element-ui/types/form";
import { add, edit, getMenusTree } from "@/api/system/menu";
import Treeselect from "@riophae/vue-treeselect";
import IconSelect from "@/components/IconSelect/Index.vue";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { IMenuDtoData, IMenuData } from "@/types/menu";

@Component({
  name: "MenuForm",
  components: {
    Treeselect,
    IconSelect,
  },
})
export default class extends Vue {
  @Prop({ required: true }) isAdd!: boolean;

  loading = false;
  dialog = false;
  menus: IMenuDtoData[] = [];
  form: IMenuData = {};
  rules = {
    name: [{ required: true, message: "请输入名称", trigger: "blur" }],
    sort: [
      {
        required: true,
        message: "请输入序号",
        trigger: "blur",
        type: "number",
      },
    ],
    path: [{ required: true, message: "请输入地址", trigger: "blur" }],
  };

  private cancel() {
    this.resetForm();
  }

  private doSubmit() {
    (this.$refs["form"] as ElForm).validate((valid) => {
      if (valid) {
        this.loading = true;
        if (this.isAdd) {
          this.doAdd();
        } else this.doEdit();
      } else {
        return false;
      }
    });
  }

  private async doAdd() {
    try {
      await add(this.form);
      this.resetForm();
      this.$notify({
        title: "添加成功",
        type: "success",
        message: "",
        duration: 2500,
      });
      this.loading = false;
      (this.$parent as any).init();
    } catch (err) {
      this.loading = false;
      console.log(err.response.data.message);
    }
  }

  private async doEdit() {
    try {
      await edit(this.form);
      this.resetForm();
      this.$notify({
        title: "修改成功",
        type: "success",
        message: "",
        duration: 2500,
      });
      this.loading = false;
      (this.$parent as any).init();
    } catch (err) {
      this.loading = false;
      console.log(err.response.data.message);
    }
  }

  private resetForm() {
    this.dialog = false;
    (this.$refs["form"] as ElForm).resetFields();
    this.form = {
      title: "",
      menuSort: 999,
      path: "",
      component: "",
      componentName: "",
      iFrame: false,
      pid: 0,
      icon: "",
      cache: false,
      hidden: false,
    };
  }

  private selected(name: string) {
    this.form.icon = name;
  }

  async getMenus() {
    let res = await getMenusTree();
    this.menus = [];
    const menu: IMenuDtoData = { id: 0, title: "顶级类目", children: [] };
    menu.children = res.data;
    this.menus.push(menu);
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
/deep/ .el-input-number .el-input__inner {
  text-align: left;
}
</style>
