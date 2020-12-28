<template>
  <div :class="className" :style="{height: height,width: width}" />
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import echarts from 'echarts'
import { ResizeObserver } from '@juggle/resize-observer'
require('echarts/theme/macarons')

@Component({
  name: 'Graph'
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
    const axisData = ['周一', '周二', '周三', '很长很长的周四', '周五', '周六', '周日']
    const data = axisData.map(function(item, i) {
      return Math.round(Math.random() * 1000 * (i + 1))
    })
    const links = data.map(function(item, i) {
      return {
        source: i.toString(),
        target: String(i + 1)
      }
    })
    links.pop()
    this.chart.setOption({
      title: {
        text: '笛卡尔坐标系上的 Graph'
      },
      tooltip: {},
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: axisData
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          type: 'graph',
          layout: 'none',
          coordinateSystem: 'cartesian2d',
          symbolSize: 40,
          label: {
            normal: {
              show: true
            }
          },
          edgeSymbol: ['circle', 'arrow'],
          edgeSymbolSize: [4, 10],
          data: data,
          links: links,
          lineStyle: {
            color: '#2f4554'
          }
        }
      ]
    })
  }
}
</script>
