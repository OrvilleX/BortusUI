
<template>
  <!-- eslint-disable vue/require-component-is -->
  <component v-bind="linkProps(to)">
    <slot />
  </component>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { isExternal } from '@/utils/validate'

@Component
export default class extends Vue {
  @Prop({ required: true }) to!: string;

  linkProps(url: string) {
    if (isExternal(url)) {
      return {
        is: 'a',
        href: url,
        target: '_blank',
        rel: 'noopener'
      }
    }
    return {
      is: 'router-link',
      to: url
    }
  }
}
</script>
