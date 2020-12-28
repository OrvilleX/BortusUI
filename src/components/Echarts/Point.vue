<template>
  <div :class="className" :style="{height: height,width: width}" />
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import echarts from 'echarts'
import { ResizeObserver } from '@juggle/resize-observer'
require('echarts/theme/macarons')

@Component({
  name: 'Point'
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
      title: {
        text: 'Graph 简单示例'
      },
      tooltip: {},
      animationDurationUpdate: 1500,
      animationEasingUpdate: 'quinticInOut',
      series: [
        {
          type: 'graph',
          layout: 'none',
          symbolSize: 50,
          roam: true,
          label: {
            show: true
          },
          edgeSymbol: ['circle', 'arrow'],
          edgeSymbolSize: [4, 10],
          edgeLabel: {
            fontSize: 20
          },
          data: [{
            name: '节点1',
            x: 100,
            y: 300
          }, {
            name: '节点2',
            x: 1000,
            y: 300
          }, {
            name: '节点3',
            x: 550,
            y: 100
          }, {
            name: '节点4',
            x: 550,
            y: 500
          }],
          links: [{
            source: '0',
            target: '1',
            symbolSize: [5, 20],
            label: {
              show: true
            },
            lineStyle: {
              width: 5,
              curveness: 0.2
            }
          }, {
            source: '节点2',
            target: '节点1',
            label: {
              show: true
            },
            lineStyle: {
              curveness: 0.2
            }
          }, {
            source: '节点1',
            target: '节点3'
          }, {
            source: '节点2',
            target: '节点3'
          }, {
            source: '节点2',
            target: '节点4'
          }, {
            source: '节点1',
            target: '节点4'
          }],
          lineStyle: {
            opacity: 0.9,
            width: 2,
            curveness: 0
          }
        }
      ]
    })
  }
}
</script>
