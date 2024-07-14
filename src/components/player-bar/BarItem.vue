<template>
  <component :is="component"  :class="[ 'bar-item', { 'bar-item--disabled': disabled, 'bar-item--active': active }]" :title="title">
    <icon :name="icon + (!disabled ? '-fill' : '-line')" size="18" />
  </component>
</template>

<script>
import { Icon } from '@vue-norma/ui'

export default {
  name: 'bar-item',
  components: { Icon },
  props: {
    title: false,
    icon: '',
    disabled: {
      type: Boolean,
      default: false
    },
    active: {
      type: Boolean,
      default: false
    },
    component: {
      type: String,
      default: 'span'
    },
  }
}
</script>