<template>
  <div class="player-error">
    <div v-if="isHasIcon" class="player-error__icon">
      <icon :name="$t(humanizeError.icon)" class="icon" width="56" height="56"/>
    </div>
    <h2 v-if="isHasHeader" class="player-error__title">{{ $t(humanizeError.title) }}</h2>
    <h4 v-if="isHasText" class="player-error__description">{{ $t(humanizeError.description) }}</h4>
  </div>
</template>

<script>
import { Icon } from '@vue-norma/ui'

export default {
  name: 'player-error',
  components: { Icon },
  props: {
    error: {
      type: [ Object ],
      default: {}
    }
  },
  computed: {
    humanizeError() {
      return this.$filters.humanizeError(this.error)
    },
    isHasIcon() {
      return this.humanizeError.icon != ''
    },
    isHasHeader() {
      return this.humanizeError.title != ''
    },
    isHasText() {
      return this.humanizeError.description != ''
    }
  }
}
</script>

<style lang="scss" scoped>
.player-error {
  align-items: center;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: var(--player-error--color, inherit);
  text-align: center;
  padding: 10rem 1rem;
  user-select: none;

  &__icon {
    display: inline-block;
    vertical-align: top;

    svg { fill: currentColor; flex-shrink: 0; display: block; }
  }

  &__title {
    font-weight: 400;
    margin: 0;
    padding: 0;
    font-size: 2.2rem;
    line-height: calc(1.6 * 1em);
  }

  &__description {
    color: var(--player-error__description-color, inherit);
    font-weight: 400;
    margin: 0;
    padding: 0;
    font-size: 1.5rem;
    line-height: calc(1.6 * 1em);
  }

  &__title + &__description {
    margin-top: 7px;
  }
}
</style>