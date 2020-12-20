<template>
  <div>
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      style="margin-top: 6px"
      size="small"
      label-width="100px"
    >
      <el-form-item label="邮件标题" prop="subject">
        <el-input v-model="form.subject" style="width: 646px" />
      </el-form-item>
      <el-form-item
        v-for="(domain, index) in tos"
        :key="domain.key"
        :label="'收件邮箱' + (index === 0 ? '' : index)"
      >
        <el-input v-model="domain.value" style="width: 550px" />
        <el-button icon="el-icon-plus" @click="addDomain" />
        <el-button
          style="margin-left: 0"
          icon="el-icon-minus"
          @click.prevent="removeDomain(domain)"
        />
      </el-form-item>
      <div ref="editor" class="editor" />
      <el-button
        :loading="loading"
        style="margin-left: 1.6%"
        size="medium"
        type="primary"
        @click="doSubmit"
        >发送邮件</el-button
      >
    </el-form>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { send } from '@/api/tools/email'
import { upload } from '@/utils/upload'
import { validEmail } from '@/utils/validate'
import { ApiModule } from '@/store/modules/api'
import E from 'wangeditor'
import { ElForm } from 'element-ui/types/form'

@Component({
  name: 'Index'
})
export default class extends Vue {
  loading = false;
  form: { subject: string, tos: string[], content: string } = {
    subject: '',
    tos: [],
    content: ''
  };

  tos = [{ value: '', key: NaN }];
  rules = {
    subject: [{ required: true, message: '标题不能为空', trigger: 'blur' }]
  };

  get imagesUploadApi() {
    return ApiModule.imagesUploadApi
  }

  mounted() {
    const editor = new E(this.$refs.editor as HTMLElement)
    editor.config.zIndex = 10
    editor.config.customUploadImg = (files: File[], insert: Function) => {
      files.forEach((image) => {
        upload(this.imagesUploadApi, image).then((data) => {
          insert(data.data.url)
        })
      })
    }
    editor.config.onchange = (html: string) => {
      this.form.content = html
    }
    editor.create()
  }

  removeDomain(item: { value: string, key: number }) {
    const index = this.tos.indexOf(item)
    if (index !== -1 && this.tos.length !== 1) {
      this.tos.splice(index, 1)
    } else {
      this.$message({
        message: '请至少保留一位联系人',
        type: 'warning'
      })
    }
  }

  addDomain() {
    this.tos.push({
      value: '',
      key: Date.now()
    })
  }

  doSubmit() {
    (this.$refs.form as ElForm).validate((valid) => {
      this.form.tos = []
      if (valid) {
        let sub = false
        this.tos.forEach((data) => {
          if (data.value === '') {
            this.$message({
              message: '收件邮箱不能为空',
              type: 'warning'
            })
            sub = true
          } else if (validEmail(data.value)) {
            this.form.tos.push(data.value)
          } else {
            this.$message({
              message: '收件邮箱格式错误',
              type: 'warning'
            })
            sub = true
          }
        })
        if (sub) {
          return false
        }
        this.loading = true
        send(this.form)
          .then(() => {
            this.$notify({
              title: '发送成功',
              type: 'success',
              message: '',
              duration: 2500
            })
            this.loading = false
          })
          .catch((err) => {
            this.loading = false
            console.log(err.response.data.message)
          })
      } else {
        return false
      }
    })
  }
}
</script>

<style scoped>
.editor {
  text-align: left;
  margin: 20px;
  width: 730px;
}
::v-deep .w-e-text-container {
  height: 360px !important;
}
</style>
