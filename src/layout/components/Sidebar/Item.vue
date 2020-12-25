<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { RenderContext } from 'vue/types/options'
import { VNode } from 'vue/types/vnode'
import { CreateElement } from 'vue/types/vue'

@Component({ name: 'MenuItem' })
export default class extends Vue {
  functional = true
  @Prop({ default: '' }) icon!: string;
  @Prop({ default: '' }) title!: string;

  render(createElement: CreateElement, hack: RenderContext) {
    const vnodes: VNode[] = []
    if (this.icon) {
      vnodes.push(createElement(`<svg-icon icon-class=${this.icon}/>`))
    }

    if (this.title) {
      vnodes.push(createElement(`<span slot='title'>${this.title}</span>`))
    }
    return vnodes
  }
}
</script>
