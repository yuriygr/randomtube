<template>
  <template v-if="(!loading && !error) || data.length > 0">
    <notification-item-wrapper v-for="(item, index) in data" :key="`item-${index}`">
      <entry-thumb :data="item" />
    </notification-item-wrapper>

    <loadmore-trigger v-if="hasMoreItems" @intersected="loadMore" />

    <n-button v-if="hasMoreItems" mode="secondary" @click.exact="loadMore" size="l" :stretched="true" :disabled="loading">{{ $t('action.load_more') }}</n-button>
  </template>
  <template v-if="data.length == 0">
    <placeholder-loading v-if="loading" />
    <placeholder v-else-if="error"
      :icon="$t(humanizeError.icon)"
      :header="$t(humanizeError.title)"
      :text="$t(humanizeError.description)"
    />
    <placeholder v-else
      :icon="$t('errors.empty_likes.icon')"
      :header="$t('errors.empty_likes.title')"
      :text="$t('errors.empty_likes.description')"
    />
  </template>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { NHeader, Separator, Spacer, NButton, LoadmoreTrigger, Placeholder, PlaceholderLoading } from '@vue-norma/ui'

export default {
  name: 'likes',
  components: {
    NHeader, Separator, Spacer, NButton, LoadmoreTrigger, Placeholder, PlaceholderLoading
  },
  meta() { return this.meta },
  data() {
    return {
      meta: {
        title: this.$t('likes.title')
      }
    }
  },
  computed: {
    ...mapState('likes', [ 'data', 'filters', 'loading', 'error' ]),
    ...mapGetters('likes', [ 'hasMoreItems' ]),
    ...mapState('app', {
      'appMode': state => state.mode
    }),
    humanizeError() {
      return this.$filters.humanizeError(this.error)
    }
  },
  methods: { },
  async mounted() {
    await this.$store.dispatch('likes/setFilters', {
      type: this.appMode, offset: undefined
    })
    this.$store.dispatch('likes/fetch')
  },
}
</script>

<style lang="scss">
$logo-size: 100px;

.about {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 2rem 0;
  user-select: none;

  &__logo {
    box-shadow: var(--x-box-shadow--depth-4);
    width: $logo-size;
    height: $logo-size;
    border-radius: 25px;
    margin-bottom: 1rem;
  }

  &__title {
    margin-bottom: .5rem;
  }
}
</style>