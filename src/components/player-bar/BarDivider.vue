<template>
  <span :class="[ 'bar-divider', { 'bar-divider--spacer': isSpaced } ]" @click="toggleState"></span>
</template>

<script>
export default {
  name: 'bar-divider',
  data() {
    return {
      isSpaced: true
    }
  },
  methods: {
    toggleState() {
      this.isSpaced = !this.isSpaced
    }
  }
}
</script>

<style lang="scss">
.bar-divider {
  background: var(--x-player-bar-divider-color);
  width: 4px;
  height: 18px;
  margin: 11px 0;
  border-radius: 12px;
  cursor: pointer;

  &--spacer {
    flex: 1;
    opacity: .25;
  }
}
</style>