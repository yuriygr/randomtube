<template>
  <modal size="small" class="keybindings-modal">
    <modal-header :title="$t('modals.keybindings')">
      <template #after>
        <icon-button name="close-circle-line" mode="tertiary" @click.exact="closeModal" :title="$t('actions.close')" />
      </template>
    </modal-header>

    <div class="keybindings-modal__wrapper">
      <div class="keybindings-modal__list">
        <template v-for="(item, index) in items" :key="`keybinding-${index}`">
          <span class="key">{{ item.key }}</span>
          <span class="label">{{ $t(`keybindings.${item.label}`) }}</span>
        </template>
      </div>
    </div>
  
  </modal>
</template>

<script>
import { Modal, ModalHeader, ModalPlaceholder, IconButton } from '@vue-norma/ui'

export default {
  name: 'keybindings-modal',
  components: { Modal, ModalHeader, ModalPlaceholder, IconButton },
  props: [ 'mode' ],
  methods: {
    closeModal() {
      this.$modals.close()
    }
  },
  computed: {
    items() {
      let keys = {}

      keys['image'] =  [
        { key: 'left', label: 'move-backward-image' },
        { key: 'right', label: 'move-forward-image' },
        { key: 'z', label: 'zen-mode' },
        { key: 'ctrl + c', label: 'copy-item-link' },
        { key: 'ctrl + d', label: 'add-site-to-favorite' }
      ]

      keys['video'] =  [
        { key: 'left', label: 'move-backward-video' },
        { key: 'right', label: 'move-forward-video' },
        { key: 'top', label: 'volume-up' },
        { key: 'bottom', label: 'volume-down' },
        { key: 'space', label: 'play-pause' },
        { key: 'f', label: 'fullscreen' },
        { key: 'm', label: 'mute' },
        { key: 'l', label: 'loop' },
        { key: 'z', label: 'zen-mode' },
        { key: 'ctrl + c', label: 'copy-item-link' },
        { key: 'ctrl + d', label: 'add-site-to-favorite' },
        { key: 'shift + top', label: 'increase-playback-rate' },
        { key: 'shift + down', label: 'decrease-playback-rate' },
      ]

      return keys[this.mode]
    }
  }
}
</script>

<style lang="scss">
.keybindings-modal {
  &__wrapper {
    display: flex;
    margin-right: auto;
    margin-left: auto;
    justify-content: center;
    align-items: center;
    align-content: center;
  }

  &__list {
    padding: 4rem 1rem;
    display: grid;
    grid-template-columns: min-content 1fr;
    grid-column-gap: 1rem;

    .key {
      font-weight: 600;
      text-align: right;
      font-size: 1.6rem;
      white-space: nowrap;
    }
    .label {
      font-weight: 400;
      margin-left: 1rem;
      font-size: 1.5rem;
    }
  }
}
</style>