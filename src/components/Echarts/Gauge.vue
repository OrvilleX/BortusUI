<template>
  <div :class="className" :style="{height: height,width: width}" />
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import echarts from 'echarts'
import { ResizeObserver } from '@juggle/resize-observer'
require('echarts/theme/macarons')

@Component({
  name: 'Gauge'
})
export default class extends Vue {
  @Prop({ default: 'chart' }) className!: string;
  @Prop({ default: '100%' }) width!: string;
  @Prop({ default: '300px' }) height!: string;

  chart!: echarts.ECharts;
  resizeHandler!: ResizeObserver

  mounted() {
    this.initChart()
    this.resizeHandler = new ResizeObserver(() => {
      if (this.chart) {
        this.chart.resize()
      }
    })
    this.resizeHandler.observe(document.body)
  }

  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.resizeHandler.disconnect()
    this.chart.dispose()
  }

  initChart() {
    this.chart = echarts.init(this.$el as HTMLDivElement, 'macarons')
    this.chart.setOption({
      tooltip: {
        formatter: '{a} <br/>{b} : {c}%'
      },
      toolbox: {
        feature: {
          restore: {},
          saveAsImage: {}
        }
      },
      series: [
        {
          name: '业务指标',
          type: 'gauge',
          detail: { formatter: '{value}%' },
          data: [{ value: 50, name: '完成率' }]
        }
      ]
    })
  }
}
</script>
