<template>
  <el-dialog
    :append-to-body="true"
    :close-on-click-modal="false"
    :before-close="cancel"
    :visible.sync="dialog"
    :title="isAdd ? '新增岗位' : '编辑岗位'"
    width="500px"
  >
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      size="small"
      label-width="80px"
    >
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" style="width: 370px" />
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input-number
          v-model.number="form.jobSort"
          :min="0"
          :max="999"
          controls-position="right"
          style="width: 370px"
        />
      </el-form-item>
      <el-form-item v-if="form.pid !== 0" label="状态" prop="enabled">
        <el-radio
          v-for="item in dicts"
          :key="item.id"
          v-model="form.enabled"
          :label="item.value"
          >{{ item.label }}</el-radio
        >
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
import { Vue, Component, Prop } from 'vue-property-decorator'
import { add, edit } from '@/api/system/job'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { IDictDetailDtoData } from '@/types/dictDetail'
import { IJobData } from '@/types/job'
import { ElForm } from 'element-ui/types/form'

@Component({
  name: "JobForm",
  components: {
    Treeselect,
  },
})
export default class extends Vue {
  @Prop({ required: true }) isAdd!: boolean;
  @Prop({ required: true }) dicts!: IDictDetailDtoData;

  loading = false;
  dialog = false;
  form: IJobData = {};
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
  };

  private cancel() {
    this.resetForm();
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
      jobSort: 999,
      enabled: true,
      createTime: "",
    };
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
/deep/ .el-input-number .el-input__inner {
  text-align: left;
}
</style>
