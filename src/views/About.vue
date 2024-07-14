<template>
  <div
    class="about"
    @contextmenu="$event.preventDefault()"
    @dragstart="$event.preventDefault()"
    @drop="$event.preventDefault()"
  >
    <img class="about__logo" src="@/assets/logo.png" />
    <n-header class="about__title">{{ appTitle }}</n-header>
    <meta-info class="about__version" :items="metaItems" />
  </div>
  <separator />
  <navigation-section>
    <template v-for="(item, index) in helpItems" :key="`section-about-item-${index}`">
      <navigation-item :to="item.to" :chevron="item.chevron" :disabled="item.disabled">
        {{ item.label }}
      </navigation-item>
    </template>
  </navigation-section>
  <navigation-footer>
    <a href="#" @click.prevent="refresh">{{ $t('about.refresh') }}</a>
  </navigation-footer>
</template>

<script>
import { NHeader, Separator, NavigationSection, NavigationItem, NavigationFooter, MetaInfo } from '@vue-norma/ui'
import { mapState } from 'vuex'

export default {
  name: 'about',
  components: {
    NHeader, Separator,
    NavigationSection, NavigationItem, NavigationFooter, MetaInfo
  },
  meta() { return this.meta },
  data() {
    return {
      meta: {
        title: this.$t('about.title')
      }
    }
  },
  computed: {
    ...mapState('app', {
      'appTitle': state => state.title,
      'appVersion': state => state.version
    }),
    metaItems() {
      return [
        { label: this.$t('app.version', { version: this.appVersion }) }
      ]
    },
    helpItems() {
      return [
        {
          label: this.$t('about.item.user-agreement'),
          to: { name: 'help-page', params: { uuid: 'user-agreement' } },
          chevron: true
        },
        {
          label: this.$t('about.item.privacy'),
          to: { name: 'help-page', params: { uuid: 'privacy' } },
          chevron: true
        },
        {
          label: this.$t('about.item.legal'),
          to: { name: 'help-page', params: { uuid: 'legal' } },
          chevron: true
        },
        {
          label: this.$t('about.item.data-security'),
          to: { name: 'help-page', params: { uuid: 'data-security' } },
          chevron: true
        }
      ]
    }
  },
  methods: {
    refresh() {
      window.location.reload()
    }
  }
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