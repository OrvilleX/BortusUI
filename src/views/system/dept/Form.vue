<template>
  <el-dialog
    :append-to-body="true"
    :close-on-click-modal="false"
    :before-close="cancel"
    :visible.sync="dialog"
    :title="isAdd ? '新增部门' : '编辑部门'"
    width="500px"
  >
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      size="small"
      label-width="80px"
    >
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="form.name" style="width: 370px" />
      </el-form-item>
      <el-form-item label="部门排序" prop="deptSort">
          <el-input-number
            v-model.number="form.deptSort"
            :min="0"
            :max="999"
            controls-position="right"
            style="width: 370px"
          />
      <el-form-item v-if="form.pid !== 0" label="状态" prop="enabled">
        <el-radio
          v-for="item in dicts"
          :key="item.id"
          v-model="form.enabled"
          :label="item.value"
          >{{ item.label }}</el-radio
        >
      </el-form-item>
      <el-form-item
        v-if="form.pid !== '0'"
        style="margin-bottom: 0px"
        label="上级部门"
        prop="pid"
      >
        <treeselect
          v-model="form.pid"
          :options="depts"
          style="width: 370px"
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
import { add, edit, getDepts } from "@/api/system/dept";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { IDictDetailDtoData } from "@/types/dictDetail";
import { IDeptDtoData, IDeptData } from "@/types/dept";
import { ElForm } from "element-ui/types/form";

@Component({
  name: "Form",
  components: {
    Treeselect,
  },
})
export default class extends Vue {
  @Prop({ required: true }) isAdd!: boolean;
  @Prop({ required: true }) dicts!: IDictDetailDtoData[];

  loading = false;
  dialog = false;
  depts: IDeptDtoData[] = [];
  form: IDeptData = {};
  rules = {
    name: [{ required: true, message: "请输入名称", trigger: "blur" }],
  };

  private cancel() {
    this.resetForm();
  }

  private doSubmit() {
    (this.$refs["form"] as ElForm).validate((valid) => {
      if (valid) {
        if (this.form.pid !== undefined) {
          this.loading = true;
          if (this.isAdd) {
            this.doAdd();
          } else this.doEdit();
        } else {
          this.$message({
            message: "上级部门不能为空",
            type: "warning",
          });
        }
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
      pid: 1,
      enabled: true,
    };
  }

   async getDepts() {
    let res = await getDepts({ enabled: true });
    this.depts = res.data.content;
  }
}
</script>
