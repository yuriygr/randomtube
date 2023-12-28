<template>
  <app-layout>
    <app-header />
    <app-content />
  </app-layout>

  <alerts-layer />
  <modals-layer />
  <loading-layer />
  <popover-layer />

  <icons-sprite-layer :path="require('@/assets/symbols.svg')" />
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import { AlertsLayer, IconsSpriteLayer, LoadingLayer, ModalsLayer, PopoverLayer } from '@vue-norma/ui'
import { AppHeader, AppContent, AppLayout } from '@/components/_app'

import BoardSwitchModal from '@/components/modals/BoardSwitch'

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
    ...mapState('app', [ 'theme', 'pwa' ]),
    ...mapState('player', [ 'zen' ]),
    ...mapGetters('app', [ 'themeStatusBar' ])
  },
  methods: {
    switchBoard() {
      this.$modals.show(BoardSwitchModal)
    },
    changeDataset(key, value) {
      if (value == false) {
        delete document.documentElement.dataset[key]
        return
      }
      document.documentElement.dataset[key] = value
    },
    changeMeta(key, value) {
     document.querySelector(`meta[name="${key}"]`).setAttribute("content", value)
    } 
  },
  mounted() {
    this.$store.dispatch('initApplication')

    this.changeDataset('zen', this.zen ? 'on' : false)
    this.changeDataset('layout', this.$route.meta.layout ?? false)
    this.changeDataset('modal', this.modal ? 'on' : false)
    this.changeDataset('pwa', this.pwa ? 'on' : false)
    this.changeDataset('theme', this.theme)
    this.changeMeta('theme-color', this.themeStatusBar)
  },
  created() {
    this.$modals.on('show', _ => this.modal = true)
    this.$modals.on('close', _ => this.modal = false)

    this.$bus.on(this.$bus.openSwitchBoard, this.switchBoard)
  },
  watch: {
    zen(to) {
      this.changeDataset('zen', to ? 'on' : false)
    },
    modal(to) {
      this.changeDataset('modal', to ? 'on' : false)
    },
    pwa(to) {
      this.changeDataset('pwa', to ? 'on' : false)
    },
    theme(to) {
      this.changeDataset('theme', to)
      this.changeMeta('theme-color', this.themeStatusBar)
    },
    '$route.meta.layout'(to) {
      this.changeDataset('layout', to ?? false)
    }
  }
}
</script>

<style lang="scss">

</style>