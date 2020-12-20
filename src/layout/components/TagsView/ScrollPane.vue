<template>
  <el-scrollbar
    ref="scrollContainer"
    :vertical="false"
    class="scroll-container"
    @wheel.native.prevent="handleScroll"
  >
    <slot />
  </el-scrollbar>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

const tagAndTagSpacing = 4

@Component({ name: 'ScrollPane' })
export default class extends Vue {
  left = 0;

  get scrollWrapper() {
    return (this.$refs.scrollContainer as Vue).$refs.wrap as HTMLElement
  }

  handleScroll(e: WheelEvent) {
    const eventDelta = (e as any).wheelDelta || -e.deltaY * 40
    const $scrollWrapper = this.scrollWrapper
    $scrollWrapper.scrollLeft = $scrollWrapper.scrollLeft + eventDelta / 4
  }

  moveToTarget(currentTag: HTMLElement) {
    const $container = (this.$refs.scrollContainer as Vue).$el as HTMLElement
    const $containerWidth = $container.offsetWidth
    const $scrollWrapper = this.scrollWrapper
    const tagList = this.$parent.$refs.tag as any[]

    let firstTag = null
    let lastTag = null

    if (tagList.length > 0) {
      firstTag = tagList[0]
      lastTag = tagList[tagList.length - 1]
    }

    if (firstTag === currentTag) {
      $scrollWrapper.scrollLeft = 0
    } else if (lastTag === currentTag) {
      $scrollWrapper.scrollLeft = $scrollWrapper.scrollWidth - $containerWidth
    } else {
      const currentIndex = tagList.findIndex((item) => item === currentTag)
      const prevTag = tagList[currentIndex - 1]
      const nextTag = tagList[currentIndex + 1]

      const afterNextTagOffsetLeft =
        nextTag.$el.offsetLeft + nextTag.$el.offsetWidth + tagAndTagSpacing

      const beforePrevTagOffsetLeft = prevTag.$el.offsetLeft - tagAndTagSpacing

      if (
        afterNextTagOffsetLeft >
        $scrollWrapper.scrollLeft + $containerWidth
      ) {
        $scrollWrapper.scrollLeft = afterNextTagOffsetLeft - $containerWidth
      } else if (beforePrevTagOffsetLeft < $scrollWrapper.scrollLeft) {
        $scrollWrapper.scrollLeft = beforePrevTagOffsetLeft
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.scroll-container {
  white-space: nowrap;
  position: relative;
  overflow: hidden;
  width: 100%;
  ::v-deep {
    .el-scrollbar__bar {
      bottom: 0px;
    }
    .el-scrollbar__wrap {
      height: 49px;
    }
  }
}
</style>
