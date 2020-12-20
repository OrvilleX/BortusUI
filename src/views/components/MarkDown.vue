<template>
  <div class="app-container">
    <p class="warn-content">
      Markdown 基于
      <el-link
        type="primary"
        href="https://github.com/hinesboy/mavonEditor"
        target="_blank"
        >MavonEditor</el-link
      >
    </p>
    <mavon-editor ref="md" :style="'height:' + height" @imgAdd="imgAdd" />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { ApiModule } from '@/store/modules/api'
import { upload } from '@/utils/upload'

@Component
export default class Markdown extends Vue {
  height = document.documentElement.clientHeight - 200 + 'px';

  get imagesUploadApi() {
    return ApiModule.imagesUploadApi
  }

  get baseApi() {
    return ApiModule.baseApi
  }

  mounted() {
    window.onresize = () => {
      this.height = document.documentElement.clientHeight - 200 + 'px'
    }
  }

  async imgAdd(pos: number, $file: File) {
    const res = await upload(this.imagesUploadApi, $file)
    const data = res.data
    const url: string =
      this.baseApi + '/file/' + data.type + '/' + data.realName
    const md = this.$refs.md as any
    md.$img2Url(pos, url)
  }
}
</script>
