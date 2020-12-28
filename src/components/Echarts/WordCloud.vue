<template>
  <div :class="className" :style="{height: height,width: width}" />
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import echarts from 'echarts'
import { ResizeObserver } from '@juggle/resize-observer'
require('echarts-wordcloud')
require('echarts/theme/macarons')

@Component({
  name: 'WordCloud'
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
      name: '花鸟市场',
      value: 1446
    },
    {
      name: '汽车',
      value: 928
    },
    {
      name: '视频',
      value: 906
    },
    {
      name: '电视',
      value: 825
    },
    {
      name: 'Lover Boy',
      value: 514
    },
    {
      name: '动漫',
      value: 486
    },
    {
      name: '音乐',
      value: 53
    },
    {
      name: '直播',
      value: 163
    },
    {
      name: '广播电台',
      value: 86
    },
    {
      name: '戏曲曲艺',
      value: 17
    },
    {
      name: '演出票务',
      value: 6
    },
    {
      name: '给陌生的你听',
      value: 1
    },
    {
      name: '资讯',
      value: 1437
    },
    {
      name: '商业财经',
      value: 422
    },
    {
      name: '娱乐八卦',
      value: 353
    },
    {
      name: '军事',
      value: 331
    },
    {
      name: '科技资讯',
      value: 313
    },
    {
      name: '社会时政',
      value: 307
    },
    {
      name: '时尚',
      value: 43
    },
    {
      name: '网络奇闻',
      value: 15
    },
    {
      name: '旅游出行',
      value: 438
    },
    {
      name: '景点类型',
      value: 957
    },
    {
      name: '国内游',
      value: 927
    },
    {
      name: '远途出行方式',
      value: 908
    },
    {
      name: '酒店',
      value: 693
    },
    {
      name: '关注景点',
      value: 611
    },
    {
      name: '旅游网站偏好',
      value: 512
    },
    {
      name: '出国游',
      value: 382
    }]
    this.chart.setOption({
      backgroundColor: '#fff',
      tooltip: {
        show: false
      },
      series: [{
        type: 'wordCloud',
        left: 'center',
        top: 'center',
        gridSize: 1,
        sizeRange: [12, 55],
        rotationRange: [-45, 0, 45, 90],
        textStyle: {
          normal: {
            color: function() {
              return 'rgb(' +
                  Math.round(Math.random() * 255) +
                   ', ' + Math.round(Math.random() * 255) +
                   ', ' + Math.round(Math.random() * 255) + ')'
            }
          }
        },
        right: null,
        bottom: null,
        data: data
      } as any]
    })
  }
}
</script>
