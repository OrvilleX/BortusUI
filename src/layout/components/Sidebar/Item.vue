<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { RenderContext } from "vue/types/options";
import { VNode } from "vue/types/vnode";
import { CreateElement } from "vue/types/vue";

@Component({ name: "MenuItem" })
export default class extends Vue {
  @Prop({ default: "" }) icon!: string;
  @Prop({ default: "" }) title!: string;

  render(createElement: CreateElement, hack: RenderContext) {
    const { icon, title } = hack.props;
    const vnodes: VNode[] = [];
    if (icon) {
      vnodes.push(createElement(`<svg-icon icon-class=${icon}/>`));
    }

    if (title) {
      vnodes.push(createElement(`<span slot='title'>${title}</span>`));
    }
    return vnodes;
  }
}
</script>
