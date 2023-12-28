<template>
  <span :class="[ 'bar-item', { 'bar-item--disabled': disabled, 'bar-item--active': active }]" :title="title">
    <icon :name="icon + (!disabled ? '-fill' : '-line')" size="18" />
  </span>
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
    }
  }
}
</script>