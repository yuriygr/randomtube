<template>
  <app-layout>
    <app-header />
    <app-content />
  </app-layout>

  <alerts-layer />
  <modals-layer />
  <loading-layer :loading="loading" />
  <popover-layer />

  <icons-sprite-layer :path="require('@/assets/symbols.svg')" />
</template>

<script>
import { defineAsyncComponent } from 'vue'
import { mapGetters, mapState } from 'vuex'
import { AlertsLayer, IconsSpriteLayer, LoadingLayer, ModalsLayer, PopoverLayer } from '@vue-norma/ui'

import { AppHeader, AppContent, AppLayout } from '@/components/_app'

let BoardSwitchModal = defineAsyncComponent(() => import("@/components/modals/BoardSwitch.vue"))

export default {
  name: 'app',
  components: {
    AlertsLayer, IconsSpriteLayer, LoadingLayer, ModalsLayer, PopoverLayer,
    AppHeader, AppContent, AppLayout
  },
  data() {
    return {
      modal: false
    }
  },
  computed: {
    ...mapState('app', [ 'locale', 'theme', 'loading' ]),
    ...mapState('player', [ 'zen' ]),
    ...mapGetters('app', [ 'themeStatusBar' ])
  },
  methods: {
    switchBoard() {
      this.$modals.show(BoardSwitchModal)
      this.$popover.close()
    },

    setZen(state = false) {
      this.changeDataset('zen', state ? 'on' : false)
    }, 
    setModal(state = false) {
      this.changeDataset('modal', state ? 'on' : false)
    }, 
    setLocale(state = false) {
      this.$i18n.locale = state
      this.changeDataset('locale', state ? state : false)
      document.documentElement.setAttribute("lang", state ? state : false);
    },
    setTheme(state = false) {
      this.changeDataset('theme', state)
      this.changeMeta('theme-color', this.themeStatusBar)
    }, 
    setLayout(state = false) {
      this.changeDataset('layout', state ?? false)
    }, 
  },
  mounted() {
    this.$store.dispatch('initApplication')

    this.setZen(this.zen)
    this.setModal(this.modal)
    this.setLocale(this.locale)
    this.setTheme(this.theme)
    this.setLayout(this.$route.meta.layout)
  },
  created() {
    this.$modals.on('show', _ => this.modal = true)
    this.$modals.on('close', _ => this.modal = false)

    this.$bus.on(this.$bus.openSwitchBoard, this.switchBoard)
  },
  watch: {
    zen(to) {
      this.setZen(to)
    },
    modal(to) {
      this.setModal(to)
    },
    locale(to) {
      this.setLocale(to)
    },
    theme(to) {
      this.setTheme(to)
    },
    '$route.meta.layout'(to) {
      this.setLayout(to)
    }
  }
}
</script>

<style lang="scss">

</style>