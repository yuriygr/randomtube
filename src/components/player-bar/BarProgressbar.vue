<template>
  <div ref="progressbar"
    :class="[ 'bar-progressbar' , { 'bar-progressbar--disabled': disabled } ]"
    @click.exact="skipAhead"
    @mousemove="updateTimeBubble"
    @mouseenter="showTimeBubble"
    @mouseleave="hideTimeBubble"
  >
    <div class="time-bubble" :style="{ '--left': bubble.position, 'visibility': this.bubble.hidden ? 'hidden' : 'initial'  }">{{ bubble.time }}</div>
    <div class="knob" :style="{ '--left': knobPosition }"><div class="knob__inner"></div></div>
    <div class="bar-progressbar__inner" ref="progressbarInner">
      <div class="progress progress--current" :style="{ '--width': progressBarWidth('current') }"></div>
      <div class="progress progress--buffered" :style="{ '--width': progressBarWidth('buffered') }"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'bar-progressbar',
  props: {
    disabled: false,
    progressBar: {
      type: Object,
      default(rawProps) {
        return {
          duration: 0,
          current: 0,
          buffered: 0
        }
      },
      required: true
    }
  },
  data() {
    return {
      bubble: {
        position: 0,
        time: '0:00',
        hidden: true
      }
    }
  },
  computed: {
    knobPosition() {
      return ((this.progressBar.current / this.progressBar.duration) * 100).toFixed(2) + '%'
    }
  },
  methods: {
    // formatTime takes a time length in seconds and returns the time in
    // minutes and seconds
    formatTime(timeInSeconds) {
      const result = new Date(timeInSeconds * 1000).toISOString().substr(11, 8);

      return {
        minutes: result.substr(3, 2),
        seconds: result.substr(6, 2),
      }
    },
    // skipAhead jumps to a different point in the video when
    // the progress bar is clicked
    skipAhead(event) {
      if (this.disabled) return
      let progress = this.$refs.progressbarInner

      // Честно, я до сих пор не понял что тут написал. Если у вас есть возможность улучшить - прошу, сделайте это
      let math = (event.pageX - progress.offsetLeft - progress.offsetParent.offsetLeft) / progress.offsetWidth

      this.$emit('skipAhead', math * this.progressBar.duration)
    },
    // updateTimeBubble uses the position of the mouse on the progress bar to
    // roughly work out what point in the video the user will skip to if
    // the progress bar is clicked at that point
    updateTimeBubble(event) {
      if (this.disabled) return
      let progress = this.$refs.progressbarInner

      // И тут такая же ситуация как в `skipAhead`
      let math = ((event.clientX - event.currentTarget.offsetLeft) / progress.clientWidth)
      if (math < 0) math = 0

      let time = this.formatTime(math * this.progressBar.duration)
      this.bubble.position = `${event.clientX}px`
      this.bubble.time = `${time.minutes}:${time.seconds}`
    },
    // showTimeBubble change bubble state to showen
    showTimeBubble() {
      if (this.disabled) return
      this.bubble.hidden = false
    },
    // hideTimeBubble change bubble state to hidden
    hideTimeBubble() {
      if (this.disabled) return
      this.bubble.hidden = true
    },
    // progressBarWidth 
    progressBarWidth(type) {
      if (this.progressBar.duration) {
        let r = (this.progressBar[type] / this.progressBar.duration)
        return r <= 1 ? r : 1
      }

      return 0
    }
  }
}
</script>

<style lang="scss" scoped>
.knob {
  position: absolute;
  left: var(--left, 0);
  top: -5px;
  margin-left: calc(-15px - var(--x-player-bar-progressbar-height) / 2);
  width: var(--x-player-bar-progressbar-knob-size, calc(30px + var(--x-player-bar-progressbar-height)));
  height: var(--x-player-bar-progressbar-knob-size, calc(30px + var(--x-player-bar-progressbar-height)));
  z-index: 9999;
  pointer-events: none;
  touch-action: none;

  &__inner {
    margin: 10px;
    width: var(--paper-slider-knob-inner-size, calc(100% - 20px));
    height: var(--paper-slider-knob-inner-size, calc(100% - 20px));
    background-color: var(--x-player-bar-progressbar-knob-color, transparent);
    border: 2px solid var(--x-player-bar-progressbar-knob-color, transparent);
    border-radius: 50%;
    box-shadow: var(--paper-slider-knob-box-shadow-style, none);
    box-sizing: border-box;
    transition-property: transform, background-color, border;
    transition-duration: 0.18s;
    transition-timing-function: ease;
    cursor: pointer;
  }
}

.time-bubble {
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 50px;
  height: 25px;
  padding: 0 5px;
  border-radius: 7px;
  background: rgba(0, 0, 0, 0.8);
  color: #fff;
  font-size: 11px;
  line-height: normal;
  position: absolute;
  left: calc(var(--left, 0) - var(--x-player-bar-progressbar-offset, 0));
  top: -10px;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.bar-progressbar {
  padding: 10px 0;
  position: absolute;
  top: 0;
  left: var(--x-player-bar-progressbar-offset, 0);
  right: var(--x-player-bar-progressbar-offset, 0);
  transform: translateY(-50%);
  transform-origin: left center;
  will-change: transform;

  &--disabled {
    opacity: .6;
    pointer-events: none;
  }

  &:not(&--disabled):hover {
    cursor: pointer;
    --x-player-bar-progressbar-height: 5px;
    --x-player-bar-progressbar-knob-color: var(--x-player-bar-progressbar-current-color);
  }

  &__inner {
    background: var(--x-player-bar-progressbar-color);
    width: 100%;
    position: relative;
    left: 0;
    right: 0;
    height: var(--x-player-bar-progressbar-height);
    z-index: var(--x-player-bar-progressbar-z-index);
    border-radius: 6px;
    overflow: hidden;
  }

  .progress {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    outline: none;
    user-select: none;
    transform-origin: left center;
    transform: scaleX(0);
    will-change: transform;

    &--current {
      background: var(--x-player-bar-progressbar-current-color);
      transform: scaleX(var(--width));
      z-index: calc(var(--x-player-bar-progressbar-z-index) + 2);
    }
    &--buffered {
      background: var(--x-player-bar-progressbar-buffered-color);
      transform: scaleX(var(--width));
      z-index: calc(var(--x-player-bar-progressbar-z-index) + 1);
    }
  }
}
</style>