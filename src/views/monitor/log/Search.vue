<template>
  <div class="head-container">
    <el-input
      v-model="query.blurry"
      clearable
      size="small"
      placeholder="请输入你要搜索的内容"
      style="width: 200px;"
      class="filter-item"
      @keyup.enter.native="toQuery"
    />
    <date-range-picker v-model="query.createTime" class="date-item" />
    <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="$parent.toQuery">搜索</el-button>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import DateRangePicker from '@/components/DateRangePicker/Index.vue'

export interface ILogSearch {
  blurry?: string
  createTime?: string
}

@Component({
  name: 'Search',
  components: {
    DateRangePicker
  }
})
export default class extends Vue{
  @Prop({ required: true }) query: ILogSearch = {}
}
</script>
