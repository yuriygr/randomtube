<template>
  <span :class="[ 'bar-item', { 'bar-item--disabled': disabled || loading, 'bar-item--liked': liked } ]">
    <icon :name="icon" size="18" />
  </span>
</template>

<script>
import { Icon } from '@vue-norma/ui'

export default {
  name: 'bar-item-reaction',
  components: { Icon },
  props: {
    type: {
      type: String
    },
    liked: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    icon() {
      return this.liked ? 'heart-fill' : 'heart-line'
    }
  }
}
</script>

<style lang="scss">

</style>