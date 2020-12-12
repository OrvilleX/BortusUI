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
import { Vue, Component, Prop, Ref } from "vue-property-decorator";
import { Getter } from "vuex-class";
import { upload } from "@/utils/upload";

@Component
export default class Markdown extends Vue {
  height = document.documentElement.clientHeight - 200 + "px";

  @Getter imagesUploadApi!: string;
  @Getter baseApi!: string;

  mounted() {
    const that = this;
    window.onresize = function temp() {
      that.height = document.documentElement.clientHeight - 200 + "px";
    };
  }

  async imgAdd(pos: number, $file: File) {
    let res = await upload(this.imagesUploadApi, $file);
    const data = res.data;
    const url: any = this.baseApi + "/file/" + data.type + "/" + data.realName;
    let md = this.$refs.md as any;
    md.$img2Url(pos, url);
  }
}
</script>

<style scoped>
</style>
