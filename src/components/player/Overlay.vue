<template>
  <div class="player__overlay" :style="{ backgroundImage: 'url(' + url + ')' }" />
</template>

<script>
export default {
  name: 'player-overlay',
  props: {
    url: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss">
.player__overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  background-origin: border-box;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  filter: blur(60px);
  opacity: .4;
  z-index: -1;
}
</style>