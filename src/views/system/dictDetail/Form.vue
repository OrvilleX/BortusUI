<template>
  <el-dialog
    :append-to-body="true"
    :close-on-click-modal="false"
    :before-close="cancel"
    :visible.sync="dialog"
    :title="isAdd ? '新增字典详情' : '编辑字典详情'"
    width="500px"
  >
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      size="small"
      label-width="80px"
    >
      <el-form-item label="字典标签" prop="label">
        <el-input v-model="form.label" style="width: 370px" />
      </el-form-item>
      <el-form-item label="字典值">
        <el-input v-model="form.value" style="width: 370px" />
      </el-form-item>
      <el-form-item label="排序" prop="dictSort">
        <el-input-number
          v-model.number="form.dictSort"
          :min="0"
          :max="999"
          controls-position="right"
          style="width: 370px"
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
import { add, edit } from "@/api/system/dictDetail";
import { IDictDetailData } from "@/types/dictDetail";

@Component({
  name: "dictDetailForm",
})
export default class extends Vue {
  @Prop({ required: true }) isAdd!: boolean;
  @Prop({ required: true }) dictId!: number;

  loading = false;
  dialog = false;
  form: IDictDetailData = {};
  rules = {
    label: [{ required: true, message: "请输入字典标签", trigger: "blur" }],
    sort: [
      {
        required: true,
        message: "请输入序号",
        trigger: "blur",
        type: "number",
      },
    ],
  };

  private cancel() {
    this.resetForm();
  }

  private doSubmit() {
    this.form["dict"] = { id: this.dictId };
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
    (this.$refs["form"] as any).resetFields();
    this.form = {
      id: NaN,
      label: "",
      value: "",
      dictSort: 999,
    };
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
/deep/ .el-input-number .el-input__inner {
  text-align: left;
}
</style>
