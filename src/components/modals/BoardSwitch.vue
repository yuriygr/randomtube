<template>
  <modal class="board-switch">
    <modal-header :title="$t('modals.boards')">
      <template #after>
        <icon-button name="search-line" mode="tertiary" @click.exact="toggleSearch" :title="$t('actions.search')" />
        <icon-button name="close-circle-line" mode="tertiary" @click.exact="closeModal" :title="$t('actions.close')" />
      </template>
    </modal-header>

    <div class="modal__search" v-show="searchOppened">
      <div class="search">
        <div class="search__icon">
          <icon name="search-line" width="16" height="16" />
        </div>
        <input v-model="searchQuery" ref="input" class="search__input" :placeholder="$t('modals.search')"/>
      </div>
    </div>

    <div :class="[ 'board-switch__list' , { 'board-switch__list--loading': loading } ]" v-if="filteredBoards.length > 0">
      <template v-for="(item, index) in filteredBoards" :key="'bsi-' + index">
        <router-link class="board-switch__item" :to="item.link" exact-active-class="" active-class="board-switch__item--active">
          <span class="board">/{{ item.board }}/ - {{ item.name }}</span>
          <span class="count">{{ item.count }} видео</span>
        </router-link>
      </template>
    </div>

    <template v-if="!error && !loading">
      <template v-if="filteredBoards.length == 0">
        <modal-placeholder v-if="searching"
          :text="$t('error.not_found')"
        />

        <modal-placeholder v-if="!searching"
          :text="$t('error.empty_data')"
        />
      </template>
    </template>

    <modal-placeholder v-if="loading && filteredBoards.length == 0"
      :text="$t('modals.loading')"
    />

    <modal-placeholder v-if="error"
      :icon="$t(humanizeError.icon)"
      :header="$t(humanizeError.title)"
      :text="$t(humanizeError.description)"
    />
  
    <footer v-if="!searching && filteredBoards.length >= 0" class="modal__footer">
      <n-button size="l" stretched mode="secondary" icon_before="refresh-fill" @click.exact="refresh">{{ $t('actions.refresh') }}</n-button>
    </footer>
  </modal>
</template>

<script>
import { mapState } from 'vuex'
import { Modal, ModalHeader, ModalPlaceholder, NButton, Icon, IconButton } from '@vue-norma/ui'

export default {
  name: 'board-switch-modal',
  components: { Modal, ModalHeader, ModalPlaceholder, NButton,  Icon, IconButton },
  data() {
    return {
      searchQuery: '',
      searchOppened: false
    }
  },
  computed: {
    ...mapState('availableBoards', {
      'data': state => state.data,
      'loading': state => state.loading,
      'error': state => state.error
    }),
    $input() {
      return this.$refs.input
    },
    searching() {
      return this.searchQuery !== ''
    },
    filteredBoards() {
      let flatBoards = this.data.map(item => {
        return {
          ...item,
          name: this.$t('boards.' + item.board) || item.board,
          link: { name: 'player-board', params: { board: item.board }}
        }
      })

      return flatBoards.filter((item) => {
        return item.board.toLowerCase().includes(this.searchQuery.toLowerCase())
        || item.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      })
    },
    humanizeError() {
      return this.$filters.humanizeError(this.error)
    }
  },
  methods: {
    refresh() {
      this.$store.dispatch('availableBoards/fetch')
    },
    toggleSearch() {
      this.searchOppened = !this.searchOppened
      if (this.searchOppened)
        this.$nextTick(() => {
          this.$input.focus()
        })
    },
    closeModal() {
      this.$modals.close()
    }
  }
}
</script>

<style lang="scss">
.board-switch {

  &__list {
    padding: 1rem;

    &--loading {
      opacity: .7;
      cursor: default;
    }
  }

  &__item {
    display: flex;
    flex-direction: column;
    flex: 1;
    align-self: center;
    min-width: 1px;
    border-radius: 12px;
    padding: .75rem 1rem;
    margin-bottom: .5rem;

    .board {
      color: var(--x-color);
      font-size: 1.5rem;
      word-break: break-all;
    }
    .count {
      color: var(--x-color);
      font-size: 1.3rem;
      opacity: .6;
    }

    &:hover {
      background: var(--board-switch-item-background--hover);
    }
    &--active {
      background: var(--board-switch-item-background--active);
    }
  }
}
</style>