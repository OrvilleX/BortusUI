<template>
  <el-dropdown trigger="click" @command="handleSetSize">
    <div>
      <svg-icon class-name="size-icon" icon-class="size" />
    </div>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item
        v-for="item of sizeOptions"
        :key="item.value"
        :disabled="size === item.value"
        :command="item.value">
        {{ item.label }}
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { AppModule } from "@/store/modules/app";
import { TagsViewModule } from "@/store/modules/tagsView";

@Component({
  name: "SizeSelect",
})
export default class extends Vue {
  private sizeOptions = [
    { label: "Default", value: "default" },
    { label: "Medium", value: "medium" },
    { label: "Small", value: "small" },
    { label: "Mini", value: "mini" },
  ];

  get size() {
    return AppModule.size;
  }

  private handleSetSize(size: string) {
    (this as any).$ELEMENT.size = size;
    AppModule.setSize(size);
    this.refreshView();
    this.$message({
      message: "布局设置成功",
      type: "success",
    });
  }

  refreshView() {
    TagsViewModule.delAllCachedViews();
    const { fullPath } = this.$route;
    this.$nextTick(() => {
      this.$router.replace({
        path: "/redirect" + fullPath,
      });
    });
  }
}
</script>
