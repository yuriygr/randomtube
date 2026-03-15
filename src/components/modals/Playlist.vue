<template>
  <modal class="playlist">
    <modal-header :title="$t('player.playlist.title')">
      <template #after>
        <n-button icon_before="close-circle-line" mode="tertiary" @click.exact="closeModal" :title="$t('actions.close')" />
      </template>
    </modal-header>
    
    <div class="playlist-wrapper" ref="scrollable">
      <template v-for="(item, index) in sources" :key="`item-${index}`">
        <entry-thumb :data="item" :isActive="isItemActive(index)" @select="select(index)" />
      </template>
    </div>

  </modal>
</template>

<script>
import { mapState } from 'vuex'
import { Icon, NButton, Modal, ModalHeader } from '@vue-norma/ui'

export default {
  name: 'player-playlist',
  components: { Icon, NButton, Modal, ModalHeader },
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

</style>