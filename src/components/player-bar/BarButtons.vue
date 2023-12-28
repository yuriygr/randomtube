<template>
  <div class="bar-buttons">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'bar-buttons'
}
</script>

<style lang="scss">
.bar-buttons {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: .75rem var(--x-player-bar-buttons-offset);
  width: 100%;

  transition: display 0.1s ease-out,
              visibility 0.1s ease-out,
              opacity 0.1s ease-out;

  .bar-item {
    background: var(--x-player-bar-item-background);
    color: var(--x-player-bar-item-color);

    margin: 0;
    padding: 0;
    cursor: pointer;
    border: none;
    outline: none;
    user-select: none;

    width: var(--x-player-bar-item-size);
    height: var(--x-player-bar-item-size);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
    font-size: 12px;

    transition: var(--x-transition);

    svg { fill: currentColor; flex-shrink: 0; }

    @media (hover: hover) {
      &:hover {
        background: var(--x-player-bar-item-background--hover);
        color: var(--x-player-bar-item-color--hover);
      }
    }

    &--active {
      background: var(--x-player-bar-item-background--hover);
      box-shadow: 0 1px 1px rgba(32,35,51,.04), 0 2px 4px rgba(32,35,51,.02);
    }

    &--disabled {
      opacity: 0.4;
      pointer-events: none;
      @media (hover: hover) {
        &:hover {
          background: var(--x-player-bar-item-background);
          color: var(--x-player-bar-item-color);
        }
      }
    }

    &--liked {
      color: var(--x-player-bar-item-like-color);
      @media (hover: hover) {
        &:hover {
          background: var(--x-player-bar-item-like-background--hover);
          color: var(--x-player-bar-item-like-color);
        }
      }
    }

  }

  & *:not(:last-child) {
    margin-right: var(--x-player-bar-items-gap);
  }
}
</style>