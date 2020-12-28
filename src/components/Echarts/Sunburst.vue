<template>
  <div :class="className" :style="{height: height,width: width}" />
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import echarts from 'echarts'
import { ResizeObserver } from '@juggle/resize-observer'
require('echarts/theme/macarons')

@Component({
  name: 'Sunburst'
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
    const data = [{
      name: 'Grandpa',
      children: [{
        name: 'Uncle Leo',
        value: 15,
        children: [{
          name: 'Cousin Jack',
          value: 2
        }, {
          name: 'Cousin Mary',
          value: 5,
          children: [{
            name: 'Jackson',
            value: 2
          }]
        }, {
          name: 'Cousin Ben',
          value: 4
        }]
      }, {
        name: 'Father',
        value: 10,
        children: [{
          name: 'Me',
          value: 5
        }, {
          name: 'Brother Peter',
          value: 1
        }]
      }]
    }, {
      name: 'Nancy',
      children: [{
        name: 'Uncle Nike',
        children: [{
          name: 'Cousin Betty',
          value: 1
        }, {
          name: 'Cousin Jenny',
          value: 2
        }]
      }]
    }]
    this.chart.setOption({
      series: [{
        type: 'sunburst',
        data: data,
        radius: [0, '90%'],
        label: {
          rotate: 'radial'
        }
      }]
    })
  }
}
</script>
