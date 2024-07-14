<template>
  <div class="app-header">
    <div class="app-header__wrapper">
      <tabs>
        <tabs-item size="xs" @click.exact="switchBoard" @click.prevent.stop>{{ $t('header.nav.switch') }}</tabs-item>

        <tabs-item size="xs" v-if="appMode == 'tube'" target="_blank" to="https://randompicture.xyz">randomPicture</tabs-item>
        <tabs-item size="xs" v-if="appMode == 'picture'" target="_blank" to="https://randomTube.xyz">randomTube</tabs-item>

        <tabs-item size="xs" target="_blank" to="https://www.donationalerts.com/r/yuriygr">{{ $t('header.nav.donate') }}</tabs-item>
        <tabs-item size="xs" target="_blank" to="https://t.me/yuriygr" >{{ $t('header.nav.support') }}</tabs-item>
      </tabs>
    </div>
  </div>
</template>

<script>

import { mapState } from 'vuex'
import { Tabs, TabsItem, Icon } from '@vue-norma/ui'

export default {
  name: 'app-header',
  components: { Tabs, TabsItem, Icon },
  computed: {
    ...mapState({
      'appTitle': state => state.app.title,
      'appMode': state => state.app.mode,
    }),
  },
  methods: {
    switchBoard() {
      this.$bus.emit(this.$bus.openSwitchBoard)
    }
  }
}
</script>

<style lang="scss">
.app-header {
  display: flex;
  justify-content: center;
  align-items: center;
  height: var(--x-site-header-height);
  -webkit-app-region: drag;
}
</style>