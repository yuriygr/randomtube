<template>
  <div class="container-fluid">

    <div class="row">
      <div class="col-xs-12 col-sm-8">
        <page-search />
        <template v-if="!loading && !error">
          <template v-if="emptyQuery">
            <page-placeholder :text="$t('search.empty_query')" />
          </template>

          <template v-if="data.length > 0">
            <template v-for="(item, index) in data" :key="'search' + index">
              <pre>{{ item }}</pre>
            </template>
          </template>

          <template v-if="data.length == 0">
            <page-placeholder :text="$t('search.not_found')" />
          </template>
        </template>

        <page-loading v-if="loading" />

        <page-placeholder v-if="error"
          :icon="$t(humanizeError.icon)"
          :header="$t(humanizeError.title)"
          :text="$t(humanizeError.description)"
        />
      </div>
      <div class="col-xs-hide col-sm-4">
        fil
      </div>
    </div>

  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import { PageSearch, PagePlaceholder, Icon } from '@vue-norma/ui'

export default {
  name: 'search',
  components: {
    PageSearch, PagePlaceholder, Icon
  },
  computed: {
    ...mapState('search', {
      'data': state => state.data,
      'filters': state => state.filters,
      'loading': state => state.loading,
      'error': state => state.error
    }),
    ...mapGetters('search', [
      'emptyQuery',
      'searching'
    ]),
    humanizeError() {
      return this.$filters.humanizeError(this.error)
    }
  },
  methods: {
    search() {
    }
  },
  async mounted() {
    await this.$store.dispatch('search/setFilters', { 
      query: this.$route.query.q
    })
    this.$store.dispatch('search/fetch')
  }
}
</script>

<style>

</style>