<template>
  <div
    :class="[ 'entry-thumb', { 'entry-thumb--active': isActive } ]"
    @click.exact="click"
  >
    <div class="thumb">
      <img :src="data.thumb" />
      <div class="thumb__indicator" v-if="isActive">
        <icon name="rhythm-fill" width="20" height="20" />
      </div>
    </div>
    <div class="content">
      <div class="name">{{ data.name.replace(/\.[^/.]+$/, "") }}</div>
      <div class="meta">
        <span v-if="data.duration != '0'" class="meta__item">{{ $filters.formatDuration(data.duration) }}</span>
        <span v-if="data.filesize" class="meta__item">{{ $filters.formatBytes(data.filesize * 1024, 2) }}</span>
        <span class="meta__item">{{ data.name.split('.').at(-1) }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { Icon } from '@vue-norma/ui'

export default {
  name: 'entry-thumb',
  emits: [ 'select' ],
  components: { Icon },
  props: {
    data: {
      type: [ Object, Boolean ],
      default: false
    },
    isActive: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    click() {
      this.$emit('select')
    },
  }
}
</script>

<style lang="scss" scoped>
.entry-thumb {
  --x-entry-thumb-background: transparent;
  --x-entry-thumb-background--hover: #ededed;
  --x-entry-thumb-background--active: #e7e7e7;

  html[data-theme="black"] & {
    --x-entry-thumb-background: transparent;
    --x-entry-thumb-background--hover: #232323;
    --x-entry-thumb-background--active: #232323;
  }
}

.entry-thumb {
  border-radius: 12px;
  padding: .75rem 1rem;
  margin-bottom: .5rem;
  cursor: pointer;
  display: flex;
  align-items: center;

  .thumb {
    background: #000;
    border-radius: 12px;
    width: var(--x-entry-thumb-thumbnail-size);
    height: var(--x-entry-thumb-thumbnail-size);
    margin: 0 16px 0 0;
    overflow: hidden;
    position: relative;

    &__indicator {
      color: #fff;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 3;
      display: flex;
      align-items: center;
      justify-content: center;

      svg { fill: currentColor; flex-shrink: 0; }
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      text-indent: 100%;
      white-space: nowrap;
      overflow: hidden;
      font-size: 0;
    }
  }
  
  .content {
    display: flex;
    flex-direction: column;
    flex: 1;
    align-self: center;
    min-width: 1px;

    .name {
      font-size: 1.2rem;
      word-break: break-all;
    }
    .meta {
      &__item {
        font-size: 1.1rem;
        opacity: .6;

        &:not(:last-child) { margin-right: .75rem; }
      }
    }
  }

  &:hover {
    background: var(--x-entry-thumb-background--hover);
  }
  &--active {
    background: var(--x-entry-thumb-background--active);

    .thumb:after {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 2;
      background-color: rgba(0,0,0,.4);
      background: radial-gradient(circle, rgb(0 0 0 / 60%) 0%, rgb(0 0 0 / 15%) 100%);
      border-radius: inherit;
    }
  }
}

</style>