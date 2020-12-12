<template>
  <div :class="className" :style="{ height: height, width: width }" />
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import echarts from "echarts";
import { ResizeObserver } from "@juggle/resize-observer";
require("echarts/theme/macarons");

export default class LineChart extends Vue {
  @Prop({ default: "chart" }) className!: string;
  @Prop({ default: "100%" }) width!: string;
  @Prop({ default: "350px" }) height!: string;
  @Prop({ default: true }) autoResize!: boolean;
  @Prop({ required: true }) chartData!: any;

  chart!: echarts.ECharts;
  $_sidebarElm!: Element;
  $_resizeHandler!: ResizeObserver;

  @Watch("chartData", { deep: true })
  hadnler(val: any) {
    this.setOptions(val);
  }

  mounted() {
    this.$_resizeHandler = new ResizeObserver(() => {
      if (this.chart) {
        this.chart.resize();
      }
    });
    this.$_initResizeEvent();

    this.$nextTick(() => {
      this.initChart();
    });
  }

  beforeDestroy() {
    this.$_destroyResizeEvent();
    this.$_destroySidebarResizeEvent();
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
  }

  activated() {
    this.$_initResizeEvent();
    this.$_initSidebarResizeEvent();
  }

  deactivated() {
    this.$_destroyResizeEvent();
    this.$_destroySidebarResizeEvent();
  }

  $_initResizeEvent() {
    this.$_resizeHandler.observe(document.body);
  }

  $_destroyResizeEvent() {
    this.$_resizeHandler.disconnect();
  }

  $_initSidebarResizeEvent() {
    this.$_sidebarElm = document.getElementsByClassName("sidebar-container")[0];
    this.$_sidebarElm &&
      this.$_sidebarElm.addEventListener(
        "transitionend",
        this.$_sidebarResizeHandler
      );
  }

  $_destroySidebarResizeEvent() {
    this.$_sidebarElm &&
      this.$_sidebarElm.removeEventListener(
        "transitionend",
        this.$_sidebarResizeHandler
      );
  }

  $_sidebarResizeHandler(e: any) {
    if (e.propertyName === "width") {
      if (this.chart) {
        this.chart.resize();
      }
    }
  }

  initChart() {
    this.chart = echarts.init(this.$el as HTMLDivElement, "macarons");
    this.setOptions(this.chartData);
  }

  setOptions(cdata: { expectedData: any; actualData: any }) {
    this.chart.setOption({
      xAxis: {
        data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        boundaryGap: false,
        axisTick: {
          show: false,
        },
      },
      grid: {
        left: 10,
        right: 10,
        bottom: 20,
        top: 30,
        containLabel: true,
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross",
        },
        padding: [5, 10],
      },
      yAxis: {
        axisTick: {
          show: false,
        },
      },
      legend: {
        data: ["expected", "actual"],
      },
      series: [
        {
          name: "expected",
          itemStyle: {
            normal: {
              color: "#FF005A",
              lineStyle: {
                color: "#FF005A",
                width: 2,
              },
            },
          },
          smooth: true,
          type: "line",
          data: cdata.expectedData,
          animationDuration: 2800,
          animationEasing: "cubicInOut",
        },
        {
          name: "actual",
          smooth: true,
          type: "line",
          itemStyle: {
            normal: {
              color: "#3888fa",
              lineStyle: {
                color: "#3888fa",
                width: 2,
              },
              areaStyle: {
                color: "#f3f8ff",
              },
            },
          },
          data: cdata.actualData,
          animationDuration: 2800,
          animationEasing: "quadraticOut",
        },
      ],
    });
  }
}
</script>
