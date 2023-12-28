<template>
  <div class="container-fluid">
    <section ref="waterfall" class="waterfall">
      <template v-for="(item, index) in items" :key="`waterfall-item-${index}`">
        <div
          :class="[ 'waterfall-item', {
            'waterfall-item--active': isItemActive(index),
            'waterfall-item--playing': isItemPlaying(index),
          } ]"
          :style="thumbDimensions(item)"
          @click="select(index)"
          @mouseover="startPreviewPlay(index)"
          @mouseout="stopPreviewPlay(index)"
          @mouseleave="stopPreviewPlay(index)"
          ref="item"
        >
          <video ref="item-video" :src="item.url" :poster="item.thumb" muted preload="none"></video>
        </div>
      </template>
    </section>
  </div>
</template>

<script>
export default {
  name: 'waterfall',
  props: {
    items: {
      default: []
    },
    currentIndex: {
      default: 0
    },
    oppened: {
      default: false
    }
  },
  data() {
    return {
      playTimers: [],
      pauseTimers: [],
      currentHovered: false
    }
  },
  computed: {

  },
  methods: {
    hoveredItemVideo(index) {
      return this.$refs[`item-video`][index]
    },

    startPreviewPlay(index) {
      this.currentHovered = index

      let video = this.hoveredItemVideo(index)

      this.playTimers[index] = setTimeout(_ => {
        clearTimeout(this.playTimers[index])
        clearTimeout(this.pauseTimers[index])
        if (video.paused || video.ended) {
          video.play()
        }
      }, 250)
    },
    stopPreviewPlay(index) {
      this.currentHovered = false

      let video = this.hoveredItemVideo(index)

      this.pauseTimers[index] = setTimeout(_ => {
        clearTimeout(this.playTimers[index])
        clearTimeout(this.pauseTimers[index])
        video.pause()
      }, 100)
    },
    select(index) {
      this.$emit('select', index)
    },
    scrollToActiveItem() {
      const e = this.$refs[`item`][index]
      e && (this.$refs.waterfall.scrollTop = e.offsetTop - e.offsetHeight)
    },

    isItemActive(index) {
      return index === this.currentIndex
    },

    isItemPlaying() {
      return true
    },

    thumbDimensions(item, scale = 3) {
      return {
        '--width': item.width / scale,
        '--height': item.height / scale
      }
    }
  }
}
</script>

<style lang="scss">
.waterfall {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: masonry;
  gap: 2rem;
}

.waterfall-item {
  background: #000;
  border-radius: 12px;
  position: relative;
  max-width: 200px;
  max-height: 200px;
  overflow: hidden;
  cursor: pointer;
  width: calc(var(--width) * 1px);
  height: calc(var(--height) * 1px);

  video {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  &--active {
    border: 3px solid red;
  }
}


</style>