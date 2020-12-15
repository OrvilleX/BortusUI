<template>
  <el-dialog
    :visible.sync="dialog"
    :close-on-click-modal="false"
    :before-close="cancel"
    :title="isAdd ? '新增角色' : '编辑角色'"
    append-to-body
    width="500px"
  >
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      size="small"
      label-width="80px"
    >
      <el-form-item label="角色名称" prop="name">
        <el-input v-model="form.name" style="width: 370px" />
      </el-form-item>
      <el-form-item label="角色级别" prop="sort">
        <el-input-number
          v-model.number="form.level"
          :min="1"
          controls-position="right"
          style="width: 370px"
        />
      </el-form-item>
      <el-form-item label="数据范围">
        <el-select
          v-model="form.dataScope"
          style="width: 370px"
          placeholder="请选择数据范围"
          @change="changeScope"
        >
          <el-option
            v-for="item in dateScopes"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-if="form.dataScope === '自定义'" label="数据权限">
        <treeselect
          v-model="deptIds"
          :options="depts"
          multiple
          style="width: 370px"
          placeholder="请选择"
        />
      </el-form-item>
      <el-form-item label="描述信息">
        <el-input
          v-model="form.description"
          style="width: 370px"
          rows="5"
          type="textarea"
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
import { getDepts } from "@/api/system/dept";
import { add, edit } from "@/api/system/role";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { ElForm } from "element-ui/types/form";
import { IDeptDtoData } from "@/types/dept";
import { IRoleData } from "@/types/role";

@Component({
  name: "RoleForm",
  components: {
    Treeselect,
  },
})
export default class extends Vue {
  @Prop({ required: true }) isAdd!: boolean;

  private dateScopes = ["全部", "本级", "自定义"];
  loading = false;
  dialog = false;
  depts: IDeptDtoData[] = [];
  deptIds: number[] = [];
  form: IRoleData = {};
  rules = {
    name: [{ required: true, message: "请输入名称", trigger: "blur" }],
  };

  private cancel() {
    this.resetForm();
  }

  private doSubmit() {
    if (this.form.dataScope === "自定义" && this.deptIds.length === 0) {
      this.$message({
        message: "自定义数据权限不能为空",
        type: "warning",
      });
    } else {
      this.form.depts = [];
      if (this.form.dataScope === "自定义") {
        for (let i = 0; i < this.deptIds.length; i++) {
          this.form.depts.push({
            id: this.deptIds[i],
          });
        }
      }
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
      name: "",
      depts: [],
      description: "",
      dataScope: "本级",
      level: 3,
    };
  }

  async getDepts() {
    let res = await getDepts({ enabled: true });
    this.depts = res.data.content;
  }

  private changeScope() {
    if (this.form.dataScope === "自定义") {
      this.getDepts();
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
/deep/ .el-input-number .el-input__inner {
  text-align: left;
}
</style>
