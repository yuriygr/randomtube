<template>
  <modal class="playlist">
    <modal-header :title="$t('player.playlist.title')">
      <template #after>
        <icon-button name="close-circle-line" mode="tertiary" @click.exact="closeModal" :title="$t('actions.close')" />
      </template>
    </modal-header>
    
    <div class="playlist-wrapper" ref="scrollable">
      <template v-for="(item, index) in sources" :key="`item${index}`">
        <div
          :class="[ 'playlist-item', { 'playlist-item--active': isItemActive(index) } ]"
          @click.exact="select(index)"
          :ref="`item${index}`"
        >
          <div class="thumb">
            <img :src="item.thumb" />
            <div class="thumb__indicator" v-if="isItemActive(index)">
              <icon name="rhythm-fill" width="20" height="20" />
            </div>
          </div>
          <div class="content">
            <div class="name">{{ item.name.replace(/\.[^/.]+$/, "") }}</div>
            <div class="meta">
              <span v-if="item.duration != '0'" class="meta__item">{{ $filters.formatDuration(item.duration) }}</span>
              <span v-if="item.filesize" class="meta__item">{{ $filters.formatBytes(item.filesize * 1024, 2) }}</span>
              <span class="meta__item">{{ item.name.split('.').at(-1) }}</span>
            </div>
          </div>
        </div>
      </template>
    </div>

  </modal>
</template>

<script>
import { mapState } from 'vuex'
import { Icon, IconButton, Modal, ModalHeader } from '@vue-norma/ui'

export default {
  name: 'player-playlist',
  components: { Icon, IconButton, Modal, ModalHeader },
  props: {},
  computed: {
    ...mapState('player', [
      'sources',
      'currentPage',
      'currentIndex'
    ]),
  },
  beforeUpdate(){
    this.$nextTick(() => {
      // @TODO: Спорная штука, надо доделать и будет конфетка
      // this.scrollToActiveItem()
    })
  },
  methods: {
    isItemActive(index) {
      return index === this.currentIndex
    },
    select(index) {
      this.$store.dispatch('player/changeCurrentIndex', index)
      this.closeModal()

      this.$gtag.event('player', {
        'event_category': 'playlist',
        'event_label': 'changeCurrentIndex'
      })
    },

    scrollToActiveItem() {
      const e = this.$refs[`item${this.currentIndex}`]
      e && e[0] && (this.$refs.scrollable.scrollTop = e[0].offsetTop - e[0].offsetHeight)
    },
    closeModal() {
      this.$modals.close()
    }
  }
}
</script>

<style lang="scss" scoped>
.playlist {
  --x-player-playlist-item-background: transparent;
  --x-player-playlist-item-background--hover: #ededed;
  --x-player-playlist-item-background--active: #e7e7e7;

  html[data-theme="black"] & {
    --x-player-playlist-item-background: transparent;
    --x-player-playlist-item-background--hover: #232323;
    --x-player-playlist-item-background--active: #232323;
  }
}

.playlist-wrapper {
  overflow-x: auto;
  padding: 1rem;
  flex: 1;
}

.playlist__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--playlist__header-background);
  border-bottom: var(--playlist__header-border-bottom);
  padding: var(--playlist-padding);
}

.playlist__title {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 32px;
  color: var(--playlist__header-color);
  font-size: var(--playlist__header-font-size);
  font-weight: var(--playlist__header-font-weight);
  user-select: none;
}

.playlist__buttons {
  display: flex;
  flex-direction: row;
  justify-content: end;
  gap: 5px;
}

.playlist-item {
  border-radius: 12px;
  padding: .75rem 1rem;
  margin-bottom: .5rem;
  cursor: pointer;
  display: flex;
  align-items: center;

  .thumb {
    background: #000;
    border-radius: 12px;
    width: var(--x-player-playlist-item-thumbnail-size);
    height: var(--x-player-playlist-item-thumbnail-size);
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
      // Hide alt text
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
    background: var(--x-player-playlist-item-background--hover);
  }
  &--active {
    background: var(--x-player-playlist-item-background--active);

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