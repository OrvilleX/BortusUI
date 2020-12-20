<template>
  <div :class="className" :style="{height: height, width: width}" />
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import echarts, { EChartOption } from 'echarts'
import ResizeMixin from '@/components/Echarts/mixins/resize'
import { mixins } from 'vue-class-component'
require('echarts/theme/macarons')

export interface LineChartData {
  expectedData: number[]
  actualData: number[]
}

@Component({ name: 'LineChart' })
export default class extends mixins(ResizeMixin) {
  @Prop({ default: 'chart' }) className!: string;
  @Prop({ default: '100%' }) width!: string;
  @Prop({ default: '350px' }) height!: string;
  @Prop({ required: true }) chartData!: LineChartData;

  @Watch('chartData', { deep: true })
  private onChartDataChange(val: LineChartData) {
    this.setOptions(val)
  }

  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  }

  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  }

  private initChart() {
    this.chart = echarts.init(this.$el as HTMLDivElement, 'macarons')
    this.setOptions(this.chartData)
  }

  private setOptions(cdata: { expectedData: any, actualData: any }) {
    if (this.chart) {
      this.chart.setOption({
        xAxis: {
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          boundaryGap: false,
          axisTick: {
            show: false
          }
        },
        grid: {
          left: 10,
          right: 10,
          bottom: 20,
          top: 30,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        yAxis: {
          axisTick: {
            show: false
          }
        },
        legend: {
          data: ['expected', 'actual']
        },
        series: [
          {
            name: 'expected',
            itemStyle: {
              normal: {
                color: '#FF005A',
                lineStyle: {
                  color: '#FF005A',
                  width: 2
                }
              }
            },
            smooth: true,
            type: 'line',
            data: cdata.expectedData,
            animationDuration: 2800,
            animationEasing: 'cubicInOut'
          },
          {
            name: 'actual',
            smooth: true,
            type: 'line',
            itemStyle: {
              normal: {
                color: '#3888fa',
                lineStyle: {
                  color: '#3888fa',
                  width: 2
                },
                areaStyle: {
                  color: '#f3f8ff'
                }
              }
            },
            data: cdata.actualData,
            animationDuration: 2800,
            animationEasing: 'quadraticOut'
          }
        ]
      } as EChartOption<EChartOption.SeriesLine>)
    }
  }
}
</script>
