<template>
  <div class="app-container">
    <p class="warn-content">
      富文本基于
      <el-link
        type="primary"
        href="https://www.kancloud.cn/wangfupeng/wangeditor3/332599"
        target="_blank"
        >wangEditor</el-link
      >
    </p>
    <el-row :gutter="10">
      <el-col :xs="24" :sm="24" :md="15" :lg="15" :xl="15">
        <div ref="editor" class="text" />
      </el-col>
      <el-col :xs="24" :sm="24" :md="9" :lg="9" :xl="9">
        <div v-html="editorContent" />
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Ref } from "vue-property-decorator";
import { Getter } from "vuex-class";
import { upload } from "@/utils/upload";
import E from "wangeditor";

@Component({ name: "Editor" })
export default class Editor extends Vue {
  editorContent = `
        <ul>
          <li>更多帮助请查看官方文档：<a style="color: #42b983" target="_blank" href="https://www.kancloud.cn/wangfupeng/wangeditor3/332599">wangEditor</a></li>
        </ul>
        `;

  @Getter imagesUploadApi!: string;
  @Getter baseApi!: string;

  mounted() {
    var editor = new E(this.$refs.editor as HTMLElement);
    editor.config.zIndex = 10;
    editor.config.customUploadImg = (files: File[], insert: Function) => {
      files.forEach((image) => {
        upload(this.imagesUploadApi, image).then((res) => {
          const data = res.data;
          const url = this.baseApi + "/file/" + data.type + "/" + data.realName;
          insert(url);
        });
      });
    };
    editor.config.onchange = (html: string) => {
      this.editorContent = html;
    };
    editor.create();
    editor.txt.html(this.editorContent);
  }
}
</script>

<style scoped>
.text {
  text-align: left;
}
::v-deep .w-e-text-container {
  height: 420px !important;
}
</style>
