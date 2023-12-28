<template>
  <div class="app-header">
    <span :class="[ 'header-navigation-item' ]" :title="$t('header.nav.switch')" @click.exact="switchBoard" @click.prevent.stop>
      <span class="label">{{ $t('header.nav.switch') }}</span>
    </span>

    <template v-if="appMode == 'tube'">
    <a href="https://randompicture.xyz/" target="_blank" class="header-navigation-item" title="randomPicture">
      <span class="label">randomPicture</span>
    </a>
    </template>

    <template v-if="appMode == 'picture'">
    <a href="https://randomTube.xyz/" target="_blank" class="header-navigation-item" title="randomTube">
      <span class="label">randomTube</span>
    </a>
    </template>

    <a href="https://www.donationalerts.com/r/yuriygr" target="_blank" class="header-navigation-item" :title="$t('header.nav.donate')">
      <span class="label">{{ $t('header.nav.donate') }}</span>
    </a>
  
    <a href="https://t.me/yuriygr" target="_blank" class="header-navigation-item" :title="$t('header.nav.support')">
      <span class="label">{{ $t('header.nav.support') }}</span>
    </a>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'app-header',
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

<style lang="scss" scoped>
.app-header {
  display: flex;
  flex-direction: row;
  justify-content: center;
  height: var(--x-site-header-height);
  -webkit-app-region: drag;
}
.header-navigation-item {
  background: var(--x-site-header-item-background);
  color: var(--x-site-header-item-color);

  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  cursor: pointer;
  border: none;
  outline: none;
  user-select: none;
  padding: 2px;

  min-width: var(--x-site-header-item-size);
  height: var(--x-site-header-item-size);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  transition: var(--x-transition);

  -webkit-app-region: no-drag;

  svg { fill: currentColor; flex-shrink: 0; }
  svg + .label { margin-left: 4px; }

  & + & {
    margin-left: 5px;
  }

  &:hover {
    background: var(--x-site-header-item-background--hover);
    color: var(--x-site-header-item-color--hover);
  }
}
</style>