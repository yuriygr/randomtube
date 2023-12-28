<template>
  <section ref="player" class="player" v-on="$playerEvents" tabindex="0">
    <img v-show="!emptyWithError"
      ref="image"
      class="player__video --width"

      v-on="$imageEvents"
      v-bind="$imageBinds"
    >

    <player-overlay v-if="!emptyWithError" :url="currentOverlayURL" />

    <player-error v-if="emptyWithError" :error="error" />

    <player-playlist :items="sources" :currentIndex="currentIndex" :oppened="togglers.playlist" @select="changeCurrentIndex" @close="closePlaylist" />

    <div :class="[ 'player__bar', { 'player__bar--zen': zenMode } ]" @contextmenu="$event.preventDefault()">
      <bar-buttons>
        <bar-item icon="skip-back" :title="$t('player.bar.move-backward')" :disabled="!canPlayPrev" @click.exact="moveBackward" />
        <bar-item icon="skip-forward" :title="$t('player.bar.move-forward')" :disabled="!canPlayNext" @click.exact="moveForward" />
        
        <bar-item-reaction type="like" :title="$t('player.bar.like')" :liked="currentFileReactions.current == 'like'" :disabled="!currentFile" @click.exact="toggleReaction('like')" />
        
        <bar-divider />

        <a :href="currentFile.source" target="_blank" :class="[ 'bar-item', { 'bar-item--disabled': !currentFile.source }]" :title="$t('player.bar.source')">
          <icon name="external-link-fill" width="18" height="18" />
        </a>
        <bar-item icon="play-list" :title="$t('player.bar.playlist')" :disabled="sources.length == 0" :active="togglers.playlist" @click.exact="togglePlaylist" />
        <bar-item icon="more"      :title="$t('player.bar.options')"  @click.exact="showOptions" ref="options" />
      </bar-buttons>
    </div>
  </section>
</template>

<script>
  import { mapState, mapGetters } from 'vuex'
  import { cancelEvent } from '@/app/services/utilities'
  
  import {
    PlayerOverlay, PlayerError, PlayerPlaylist
  } from '@/components/player'
  import {
    BarButtons, BarItemReaction, BarItem, BarDivider
  } from '@/components/player-bar'

  import ReportItemModal  from '@/components/modals/ReportItem'
  import KeybindingsModal  from '@/components/modals/Keybindings'
  
  export default {
    name: 'gallery',
    components: { PlayerOverlay, PlayerError, PlayerPlaylist, BarItem, BarDivider, BarButtons, BarItemReaction },
    data() {
      return {
        default: {
          chan: '2ch.hk',
          board: 'b'
        },

        togglers: {
          playlist: false
        },

        // Чтобы не скакал размер при переключении
        currentOverlayURL: '',
        currentWidth: 0,
        currentHeight: 0,

        needUpdate: false
      }
    },
    mounted() {
      this.$store.dispatch('player/fetch', { type: 'images', params: this.params })

      // Фокусируемся на плеене чтобы работали эвент хендлеры
      this.$image.focus()
      // И после закрытия модалки тоже
      this.$modals.on('close', _ => this.$image.focus())
    },
    computed: {
      $image() {
        return this.$refs.image
      },
      $imageEvents() {
        return {
          load:             this.player_onLoaded,

          keydown:          this.player_onKeydown,
          click:            this.player_onClick,
          dblclick:         this.player_onDblclick,

          error:            this.player_onError,
        }
      },
      $imageBinds() {
        return {
          style: {
            '--width': this.currentWidth,
            '--height': this.currentHeight
          },

          src:  this.currentFile.url,
          alt: this.currentFile.name,
       }
      },
      $player() {
        return this.$refs.player
      },
      $playerEvents() {
        return {
          keydown: this.handleKeydown,
        }
      },
      ...mapState({
        'appTitle': state => state.app.title,
        'theme': state => state.app.theme,
      }),
      ...mapState('player', [
        'sources',
        'currentPage',
        'currentIndex',
        'loading',
        'error',
        'zen'
      ]),
      ...mapGetters('player', [
        'currentFile',
        'currentFileReactions',
        'nextFile',
        'canPlayPrev',
        'canPlayNext',
        'emptyWithLoading',
        'emptyWithError'
      ]),
      params() {
        let params = {
          chan:  this.$route.params.chan  || this.default.chan,
          board: this.$route.params.board || this.default.board,
          page:  this.currentPage
        }
        
        // Так-как нам не надо чтоб в параметрах запроса были лишние поля
        // приходится выносить так вот тред
        if (this.$route.params.thread) 
          params.thread = this.$route.params.thread

        return params
      },

      optionsItems() {

        let navigation = {
          title: this.$t('player.bar.navigation'),
          items: [
            {
              icon: 'order-play-fill',
              label: this.$t('player.bar.moar'),
              to: this.currentFile ?
                { name: 'player-board-thread', params: { board: this.currentFile.board, thread: this.currentFile.thread } }
                : null,
              disabled: !this.currentFile || (this.currentFile.thread == "0")
            },
            {
              icon: 'keyboard-box-line',
              label: this.$t('player.bar.keybindings'),
              action: this.openKeybindingsModal
            },
            {
              icon: 'palette-line',
              label: this.$t('player.bar.toggle-theme'),
              action: this.toggleTheme
            }
          ]
        }

        let file = {
          title: this.$t('player.bar.file'),
          items: [
            {
              icon: 'link',
              label: this.$t('player.bar.copy_link'),
              action: this.copyItemLink,
              disabled: !this.currentFile
            },
            {
              icon: 'external-link-fill',
              label: this.$t('player.bar.source'),
              url: this.currentFile.source,
              urlTarget: '_blank',
              disabled: !this.currentFile || (this.currentFile.source == "")
            },
            {
              icon: 'download-fill',
              label: this.$t('player.bar.download'),
              url: this.currentFile.url,
              urlTarget: '_blank',
              disabled: !this.currentFile
            },
            {
              icon: 'error-warning-line',
              label: this.$t('player.bar.report'),
              action: this.reportItem,
              disabled: !this.currentFile
            }
          ]
        }

        return [ navigation, file ]
      }
    },
    methods: {
      player_onKeydown(e) {
        cancelEvent(e)
        this.handleKeydown(e)
      },

      player_onClick(e) {
        if (this.currentFile) {
          this.moveForward()
        }

        this.$popover.close()

        return cancelEvent(e)
      },

      player_onDblclick(e) {
        return cancelEvent(e)
      },
    
      player_onError(e) {
        this.$store.commit('player/SPLICE_SOURCE', this.currentIndex)
      },

      player_onLoaded(event) {
        this.currentOverlayURL = this.currentFile.thumb
        this.currentWidth = this.currentFile.width
        this.currentHeight = this.currentFile.height

        this.$gtag.event('player', {
          'event_category': 'video',
          'event_label': 'loaded'
        })
      },

      /**
       * Навигация
       */
      moveBackward() {
        this.$store.dispatch('player/moveBackward')

        this.$gtag.event('player', {
          'event_category': 'navigation',
          'event_label': 'moveBackward'
        })
      },
      moveForward() {
        this.$store.dispatch('player/moveForward')

        this.$gtag.event('player', {
          'event_category': 'navigation',
          'event_label': 'moveForward'
        })
      },
      changeCurrentIndex(index) {
        this.$store.dispatch('player/changeCurrentIndex', index)

        this.$gtag.event('player', {
          'event_category': 'navigation',
          'event_label': 'changeCurrentIndex'
        })
      },

      toggleFullscreen() {
        if (!document.fullscreenElement && // alternative standard method
          !document.mozFullScreenElement &&
          !document.webkitFullscreenElement &&
          !document.msFullscreenElement
        ) {
          if (this.$image.requestFullscreen) {
            this.$image.requestFullscreen()
          } else if (this.$image.msRequestFullscreen) {
            this.$image.msRequestFullscreen()
          } else if (this.$image.mozRequestFullScreen) {
            this.$image.mozRequestFullScreen()
          } else if (this.$image.webkitRequestFullscreen) {
            this.$image.webkitRequestFullscreen()
          } else {
            console.log("Fullscreen API is not supported")
          }
        } else {
          if (document.exitFullscreen) {
            document.exitFullscreen()
          } else if (document.msExitFullscreen) {
            document.msExitFullscreen()
          } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen()
          } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen()
          }
        }
      },
    
      toggleTheme() {
        this.$store.dispatch('app/toggleTheme')

        this.$gtag.event('player', {
          'event_category': 'navigation',
          'event_label': 'toggleTheme'
        })
      },
      toggleZenMode() {
        this.$store.dispatch('player/toggleZen')

        this.$gtag.event('player', {
          'event_category': 'navigation',
          'event_label': 'toggleZen'
        })
      },

      toggleReaction(action = 'like') {
        this.$store.dispatch('player/reaction', { action })
        .then(message => {
          this.$alerts.success({ text: message })
        })
        .catch(message => {
          this.$alerts.danger({ text: message })
        })

        this.$gtag.event('player', {
          'event_category': 'navigation',
          'event_label': 'toggleReaction',
          'value': action
        })
      },

      /**
       * Всплыватули
       */
      closePlaylist() {
        this.$player.focus()
        this.togglePlaylist()
      },
      togglePlaylist() {
        this.togglers.playlist = !this.togglers.playlist

        this.$gtag.event('player', {
          'event_category': 'navigation',
          'event_label': 'togglePlaylist'
        })
      },

      showOptions(e) {
        let target = typeof e == "object" ? e.currentTarget : this.$refs.options.$el
        this.$popover.open({
          items: this.optionsItems,
          target: target,
          align: 'right'
        })

        this.$gtag.event('player', {
          'event_category': 'navigation',
          'event_label': 'showOptions'
        })
      },

      /**
       * Действия в опциях
       */
      copyItemLink(e) {
        navigator.clipboard.writeText(this.currentFile.url).then(_ => {
          this.$alerts.success({ text: 'Ссылка скопирована' })
        })
        this.$popover.close()

        this.$gtag.event('player', {
          'event_category': 'navigation',
          'event_label': 'copyItemLink'
        })
      },

      reportItem() {
        this.$modals.show(ReportItemModal, {
          data: this.currentFile
        })
        this.$popover.close()

        this.$gtag.event('player', {
          'event_category': 'navigation',
          'event_label': 'reportItem'
        })
      },

      openKeybindingsModal() {
        this.$modals.show(KeybindingsModal, {
          mode: 'image'
        })
        this.$popover.close()

        this.$gtag.event('player', {
          'event_category': 'navigation',
          'event_label': 'openKeybindingsModal'
        })
      },
      

      /**
       * Ну тут все ясно
       */
      handleKeydown(e) {
        if (!this.currentFile) return cancelEvent(e)
        if (!e.metaKey && !e.ctrlKey && !e.shiftKey) {
          switch(e.keyCode) {
            case 37: // Лево
              this.moveBackward()
            break;
            case 39: // Право
              this.moveForward()
            break;
            case 70: // F key
              this.toggleFullscreen()
            break;
            case 90: // Z key
              this.toggleZenMode()
            break;
          }
        }
        // Кхе-кхе, мы типо нативное приложение понял да?
        if ((e.metaKey || e.ctrlKey) && !e.shiftKey) {
          switch(e.keyCode) {
            case 67: // C
              e.preventDefault()
              this.copyItemLink()
            break;
            case 65: // A
              cancelEvent(e)
            case 83: // S
              cancelEvent(e)
            case 70: // f
              cancelEvent(e)
            break;
          }
        }
      },

      refresh() {
        this.$store.dispatch('player/fetch', { type: 'images', params: this.params })
      }
    },
    watch: {
      'params': {
        handler(to) {
          let _result = ''
          if (to.board) _result += `/${to.board}/`
          if (to.thread) _result += `${to.thread}`
          document.title = `${this.appTitle} - ${_result}`

          if (this.needUpdate)
            this.$store.dispatch('player/fetch', { type: 'images', params: this.params })
            .then(_ => this.needUpdate = false)
        },
        immediate: true
      },
      'params.board'() {
        this.$store.commit('player/SET_CURRENT_INDEX', 0)
        this.$store.commit('player/SET_CURRENT_PAGE', 1)
        this.$store.commit('player/RESET_SOURCES')

        this.needUpdate = true
      },
      'params.thread'() {
        this.$store.commit('player/SET_CURRENT_INDEX', 0)
        this.$store.commit('player/SET_CURRENT_PAGE', 1)
        this.$store.commit('player/RESET_SOURCES')

        this.needUpdate = true
      },
      'params.page'() {
        this.needUpdate = true
      },

      // При смене индекса
      currentIndex() { 
        // Сбрасываем таймер ожидания
        clearTimeout(this.waitingTimer)

        // Если приближаемся к концу списка - меняем страницу
        if (this.sources.length > 0 && (this.currentIndex >= this.sources.length - 10))
          this.$store.commit('player/SET_CURRENT_PAGE', this.currentPage + 1)

        // Прячем всплывашку
        this.$popover.close()
      },

      $route(to) {
        // Фокусируемся на плеере чтобы работали эвент хендлеры
        this.$player.focus()
        // Закрываем все модальные окна
        this.$modals.close()
        // Прячем всплывашку
        this.$popover.close()
      }
    }
  }
</script>

<style lang="scss">
.player {
  display: grid;
  grid-template: 1fr auto / 1fr;
  height: var(--x-player-height);
  justify-content: center;
  align-items: center;
  align-content: center;
  outline: none;
  overflow: hidden;
  position: relative;
}

.player__bar {
  background: var(--x-player-bar-background);
  color: var(--x-player-bar-color);
  height: var(--x-player-bar-height);
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

}

.player__video {
	background: #000;
	box-shadow: var(--x-player-box-shadow);
	margin: auto;
	display: block;
	border-radius: 5px;
	user-select: none;
	outline: none;
  max-width: 100%;
  max-height: var(--x-player-video-max-height);
  z-index: 0;

  &.--width {
    /* Находим соотношение сторон */
    --ratio: calc(var(--height) / var(--width));
    /* Добавляем пиксели к высоте */
    --height-with-units: calc(var(--height) * 2px);
    /* Выбираем минимальное значение из исходной высоты
      и вычисленной на основе ширины вьюпорта  */
    height: Min(calc(100vw * var(--ratio)), var(--height-with-units));
  }
}
</style>