<template>
  <div :class="className" :style="{height: height,width: width}" />
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import echarts from 'echarts'
import { ResizeObserver } from '@juggle/resize-observer'
require('echarts/theme/macarons')

@Component({
  name: 'Sankey'
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
      series: [{
        type: 'sankey',
        layout: 'none',
        focusNodeAdjacency: true,
        data: [{
          name: 'a'
        }, {
          name: 'b'
        }, {
          name: 'a1'
        }, {
          name: 'a2'
        }, {
          name: 'b1'
        }, {
          name: 'c'
        }],
        links: [{
          source: 'a',
          target: 'a1',
          value: 5
        }, {
          source: 'a',
          target: 'a2',
          value: 3
        }, {
          source: 'b',
          target: 'b1',
          value: 8
        }, {
          source: 'a',
          target: 'b1',
          value: 3
        }, {
          source: 'b1',
          target: 'a1',
          value: 1
        }, {
          source: 'b1',
          target: 'c',
          value: 2
        }]
      }]
    })
  }
}
</script>
