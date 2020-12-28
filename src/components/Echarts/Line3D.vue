<template>
  <div :class="className" :style="{height: height,width: width}" />
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import echarts from 'echarts'
import 'echarts-gl'
import { ResizeObserver } from '@juggle/resize-observer'
require('echarts/theme/macarons')

@Component({
  name: 'Line3D'
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
    const data = []
    for (let t = 0; t < 25; t += 0.001) {
      const x = (1 + 0.25 * Math.cos(75 * t)) * Math.cos(t)
      const y = (1 + 0.25 * Math.cos(75 * t)) * Math.sin(t)
      const z = t + 2.0 * Math.sin(75 * t)
      data.push([x, y, z])
    }
    this.chart.setOption({
      tooltip: {},
      backgroundColor: '#fff',
      visualMap: [{
        show: false,
        dimension: 2,
        min: 0,
        max: 30,
        inRange: {
          color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
        }
      }],
      xAxis3D: {
        type: 'value'
      },
      yAxis3D: {
        type: 'value'
      },
      zAxis3D: {
        type: 'value'
      },
      grid3D: {
        viewControl: {
          projection: 'orthographic'
        }
      },
      series: [{
        type: 'line3D',
        data: data,
        lineStyle: {
          width: 4
        }
      }]
    } as any)
  }
}
</script>
