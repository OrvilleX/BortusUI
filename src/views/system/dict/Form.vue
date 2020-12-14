<template>
  <el-dialog
    :append-to-body="true"
    :close-on-click-modal="false"
    :before-close="cancel"
    :visible.sync="dialog"
    :title="isAdd ? '新增字典' : '编辑字典'"
    width="500px"
  >
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      size="small"
      label-width="80px"
    >
      <el-form-item label="字典名称" prop="name">
        <el-input v-model="form.name" style="width: 370px" />
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="form.description" style="width: 370px" />
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
import { add, edit } from "@/api/system/dict";
import { IDictData } from "@/types/dict";

@Component({
  name: "Form",
})
export default class extends Vue {
  @Prop({ required: true }) isAdd!: boolean;

  loading = false;
  dialog = false;
  form: IDictData = {};
  private rules = {
    name: [{ required: true, message: "请输入名称", trigger: "blur" }],
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
      id: NaN,
      name: "",
      description: "",
    };
  }
}
</script>
