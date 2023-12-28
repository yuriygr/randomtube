<template>
  <section ref="player" class="player" v-on="$playerEvents" tabindex="0">
    <video v-show="!emptyWithError"
      ref="video"
      class="player__video --width"
      playsinline

      v-on="$videoEvents"
      v-bind="$videoBinds"
    />

    <player-error v-if="emptyWithError" :error="error" />

    <player-playlist :items="sources" :currentIndex="currentIndex" :oppened="togglers.playlist" @select="changeCurrentIndex" @close="closePlaylist" />

    <div :class="[ 'player__bar', { 'player__bar--zen': zenMode } ]" @contextmenu.prevent>
      <bar-progressbar :disabled="!currentFile" :progressBar="progressBar" @skipAhead="skipAhead" />

      <bar-buttons>
        <bar-item icon="skip-back" :title="$t('player.bar.move-backward')" :disabled="!canPlayPrev" @click.exact="moveBackward" />
        <template v-if="!emptyWithLoading && !emptyWithError">
          <bar-item icon="play"  :title="$t('player.bar.play')"  :disabled="!currentFile" @click.exact="togglePlay" v-if="!togglers.playing" />
          <bar-item icon="pause" :title="$t('player.bar.pause')" :disabled="!currentFile" @click.exact="togglePlay" v-else/>
        </template>
        <template v-else-if="emptyWithLoading">
          <bar-item-loading :title="$t('player.bar.loading')" />
        </template>
        <template v-else-if="emptyWithError">
          <bar-item icon="refresh" :title="$t('player.bar.refresh')" @click.exact="refresh" />
        </template>
        <bar-item icon="skip-forward" :title="$t('player.bar.move-forward')" :disabled="!canPlayNext" @click.exact="moveForward" />
        
        <bar-item-reaction type="like" :title="$t('player.bar.like')" :liked="currentFileReactions.current == 'like'" :disabled="!currentFile" @click.exact="toggleReaction('like')" />
        
        <bar-divider />

        <template v-if="this.muted || (this.volume == 0)">
          <bar-item icon="volume-mute" :title="$t('player.bar.mute')" :disabled="!currentFile || !hasAudio" @click.exact="toggleMute" />
        </template>
        <template v-else>
          <bar-item :icon="this.volume >= 0.6 ? 'volume-up' : 'volume-down'" :title="$t('player.bar.unmute')" :disabled="!currentFile || !hasAudio" @click.exact="toggleMute" />
        </template>
        
        <bar-item icon="repeat"    :title="$t('player.bar.loop')"     :disabled="!currentFile"        :active="togglers.loop"     @click.exact="toggleLoop" />
        <bar-item icon="play-list" :title="$t('player.bar.playlist')" :disabled="sources.length == 0" :active="togglers.playlist" @click.exact="togglePlaylist" />
        <bar-item icon="more"      :title="$t('player.bar.options')"  @click.exact="showOptions" ref="options" />
      </bar-buttons>
    </div>
  </section>
</template>

<script>
  import { mapGetters, mapState } from 'vuex'
  import { cancelEvent } from '@/app/services/utilities'

  import {
    PlayerOverlay, PlayerError, PlayerPlaylist, PlayerWaterfall
  } from '@/components/player'
  import {
    BarProgressbar, BarButtons, BarItem, BarItemReaction, BarItemLoading, BarDivider
  } from '@/components/player-bar'

  import FiltersModal from '@/components/modals/Filters'
  import ReportItemModal  from '@/components/modals/ReportItem'
  import KeybindingsModal  from '@/components/modals/Keybindings'

  export default {
    name: 'player',
    components: {
      PlayerOverlay, PlayerError, PlayerPlaylist, PlayerWaterfall,
      BarProgressbar, BarButtons, BarItem, BarItemReaction, BarItemLoading, BarDivider
    },
    data() {
      return {
        default: {
          chan: '2ch.hk',
          board: 'b',

          volume: 1,
          muted: false,
          playbackRate: 1
        },

        togglers: {
          playing: false,
          fullscreen: false,
          loop: false,
          playlist: false
        },
        volume: 1,
        muted: false,
        availablePlaybackRates: [ 0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 4 ],
        playbackRate: 1,
        
        progressBar: {
          current: 0,
          buffered: 0,
          duration: 0
        },

        options: {
          preload: 'auto',
          controls: 'controls',
          poster: false,
          autoplay: false,
          delay: 500,
        },

        hasAudio: true,
        waitingTimer: null,
        needUpdate: false
      }
    },
    mounted() {
      this.$store.dispatch('player/fetch', { type: 'videos', params: this.params })

      // Pip events
      navigator.mediaSession.setActionHandler('previoustrack', this.moveBackward)
      navigator.mediaSession.setActionHandler('nexttrack', this.moveForward)

      // Восстанавливаем уровень громкости
      this.volume = this.$storage.getItem('volume')           || this.default.volume
      this.muted = JSON.parse(this.$storage.getItem('muted')) || this.default.muted

      // Фокусируемся на плеене чтобы работали эвент хендлеры
      this.$player.focus()
      // И после закрытия модалки тоже
      this.$modals.on('close', _ => this.$player.focus())

      //window.addEventListener('contextmenu', e => e.preventDefault())
    },
    computed: {
      $video() {
        return this.$refs.video
      },
      $videoEvents() {
        return {
          loadeddata:       this.player_onLoaded,

          keydown:          this.player_onKeydown,
          click:            this.player_onClick,
          dblclick:         this.player_onDblclick,

          ended:            this.player_onEnded,
          error:            this.player_onError,

          playing:          this.player_onPlaying,
          play:             this.player_onPlay,
          pause:            this.player_onPause,

          timeupdate:       this.player_onTimeupdate,
          progress:         this.player_onProgress,
          seeking:          this.player_onSeeking,

          volumechange:     this.player_onVolumechange,
          fullscreenchange: this.player_onFullscreenChange
        }
      },
      $videoBinds() {
        return {
          style: {
            '--width': this.currentFile.width,
            '--height': this.currentFile.height
          },

          preload:  this.options.preload,
          controls: this.options.controls,
          poster:   this.currentFile.thumb || this.options.poster,
          loop:     this.togglers.loop,
          autoplay: this.options.autoplay,

          volume:       this.volume,
          muted:        this.muted,
          playbackRate: this.playbackRate,

          src:  this.currentFile.url,
          type: this.currentFile.type,
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
      $options() {
        return this.$refs.options
      },
      ...mapState({
        'appTitle': state => state.app.title,
        'appMode': state => state.app.mode,
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

        let video = {
          title: this.$t('player.bar.video'),
          items: [
            {
              icon: 'fullscreen-fill',
              label: this.$t('player.bar.fullscreen'),
              action: this.toggleFullscreen,
              disabled: !this.currentFile || this._checkCanFullscreen()
            },
            {
              icon: 'picture-in-picture-fill',
              label: this.$t('player.bar.picture-in-picture'),
              action: this.togglePictureInPicture,
              disabled: !this.currentFile || this._checkPictureInPicture()
            },
            {
              icon: 'speed-up-fill',
              label: this.$t('player.bar.playback-rate'),
              action: () => { this.showPlaybackRate() },
              disabled: !this.currentFile
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

        return [ navigation, video, file ]
      },
      playbackRatesItems() {
        let items = this.availablePlaybackRates.map(rate => ({
          label: this.$tc(rate == 1 ? 'player.playback.normal' : 'player.playback.other', rate),
          value: rate,
          action: () => { this.setPlaybackRate(rate), this.$popover.close() }
        }))
        return [
          {
            icon: 'arrow-left-s-line',
            label: this.$t('player.bar.playback-rate'),
            action: () => { this.showOptions() }
          },
          ...items
        ]
      }
    },
    methods: {
      player_onKeydown(e) {
        cancelEvent(e)
        this.handleKeydown(e)
      },

      player_onClick(e) {
        if (this.currentFile) {
          this.togglePlay()
        }

        this.$popover.close()

        return cancelEvent(e)
      },

      player_onDblclick(e) {
        if (this.currentFile) {
          this.toggleFullscreen()
        }
        
        return cancelEvent(e)
      },

      player_onEnded(e) {
        if (this.togglers.loop) return

        this.waitingTimer = setTimeout(_ => {
          clearTimeout(this.waitingTimer)
          this.moveForward()
        }, this.options.delay)

        this.$gtag.event('player', {
          'event_category': 'video',
          'event_label': 'ended'
        })
      },

      player_onVolumechange(e) {
        this.volume = this.$video.volume
        this.muted = this.$video.muted
      },

      player_onError(e) {
        this.$store.commit('player/SPLICE_SOURCE', this.currentIndex)
      },

      player_onLoaded(event) {
        // Check volume
        this.hasAudio = this._checkVideoHasVolume(event.target)

        // Set progress bar data
        this.progressBar.current = (event.target.currentTime || 0)
        if (event.target.buffered.length > 0)
          this.progressBar.buffered = event.target.buffered.end(event.target.buffered.length - 1)
        else 
          this.progressBar.buffered = 0
        this.progressBar.duration = (event.target.duration || 0)

        this.$video.play()

        this.$gtag.event('player', {
          'event_category': 'video',
          'event_label': 'loaded'
        })
      },

      player_onTimeupdate(event) {
        this.progressBar.current = (event.target.currentTime || 0)
      },

      player_onProgress(event) {
        let buffered = event.target.buffered
        if (buffered.length > 0)
          this.progressBar.buffered = buffered.end(buffered.length - 1) 
        else 
          this.progressBar.buffered = 0
      },

      player_onPlaying(e) {
        if (!this.togglers.playing)
          this.togglers.playing = true
      },
      player_onPause(e) { this.togglers.playing = false },
      player_onPlay(e) { this.togglers.playing = true },

      player_onSeeking(e) { },

      player_onFullscreenChange(e) {
        this.togglers.fullscreen =
          (document.webkitIsFullScreen || document.mozFullScreen || document.msFullscreenElement)
          ? true
          : false
      },

      // Проверяем можем ли мы делать фуллскрин
      _checkCanFullscreen() {
        return (
          this.$video.fullscreenElement && 
          this.$video.mozFullScreenElement &&
          this.$video.webkitFullscreenElement &&
          this.$video.msFullscreenElement
        )
      },

      // Проверяем можем ли мы запустить картинку-в-картинке
      _checkPictureInPicture() {
        return (
          this.$video.pictureInPictureElement ||
          this.$video.pictureInPictureEnabled
        )
      },

      // Проверяет наличие звуковых дорожек и подобное бла-бла
      _checkVideoHasVolume(video) {
        if (
          (typeof video.mozHasAudio !== "undefined" && video.mozHasAudio) ||
          (typeof video.webkitAudioDecodedByteCount !== "undefined" && video.webkitAudioDecodedByteCount > 0) ||
          Boolean(video.audioTracks?.length)
        ) {
          return true
        } else {
          return false
        }   
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

      /**
       * Ебать
       */
      skipAhead(time) {
        this.$video.currentTime = time
      },

      /**
       * Звук
       */
      volumeUp() {
        if (this.volume < 1)
          this.volume = (this.volume + 0.1).toFixed(1)

        this.$gtag.event('player', {
          'event_category': 'navigation',
          'event_label': 'volumeUp'
        })
      },
      volumeDown() {
        if (this.volume > 0)
          this.volume = (this.volume - 0.1).toFixed(1)

        this.$gtag.event('player', {
          'event_category': 'navigation',
          'event_label': 'volumeDown'
        })
      },
      toggleMute() {
        this.muted = !this.muted

        this.$gtag.event('player', {
          'event_category': 'navigation',
          'event_label': 'toggleMute'
        })
      },

      /**
       * Скорости воспроизведения
       */
      setPlaybackRate(rate = 1) {
        this.playbackRate = rate

        this.$gtag.event('player', {
          'event_category': 'navigation',
          'event_label': 'setPlaybackRate'
        })
      },
      increasePlaybackRate() {
        let speed = this.playbackRate + 0.25
        if (speed > 2) speed = 2
        this.playbackRate = speed

        this.$gtag.event('player', {
          'event_category': 'navigation',
          'event_label': 'increasePlaybackRate'
        })
      },
      decreasePlaybackRate() {
        let speed = this.playbackRate - 0.25
        if (speed < 0.25) speed = 0.25
        this.playbackRate = speed

        this.$gtag.event('player', {
          'event_category': 'navigation',
          'event_label': 'decreasePlaybackRate'
        })
      },
      resetPlaybackRate() {
        this.playbackRate = 1
      },

      resetProgressBar() {
        this.progressBar = {
          current: 0,
          buffered: 0,
          duration: 0,
        }
      },

      /**
       * Переключатели состояний
       */
      togglePlay() {
        this.togglers.playing = !this.togglers.playing
        !!(this.$video.paused || this.$video.ended) ? this.$video.play() : this.$video.pause()

        this.$gtag.event('player', {
          'event_category': 'navigation',
          'event_label': 'togglePlay'
        })
      },

      toggleFullscreen() {
        let element = this.$video // this.$player
        if (!document.fullscreenElement && // alternative standard method
          !document.mozFullScreenElement &&
          !document.webkitFullscreenElement &&
          !document.msFullscreenElement
        ) {
          if (element.requestFullscreen) {
            element.requestFullscreen()
          } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen()
          } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen()
          } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen()
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
  
        this.$gtag.event('player', {
          'event_category': 'navigation',
          'event_label': 'toggleFullscreen'
        })
      },

      togglePictureInPicture() {
        if (document.pictureInPictureElement) {
          document.exitPictureInPicture()
        } else if (document.pictureInPictureEnabled) {
          this.$video.requestPictureInPicture()
        }
      },

      toggleLoop() {
        this.togglers.loop = !this.togglers.loop

        this.$gtag.event('player', {
          'event_category': 'navigation',
          'event_label': 'toggleLoop'
        })
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

      showFiltersModal(e) {
        this.$modals.show(FiltersModal, {
          filters: {}
        })
      },

      showPlaybackRate(e) {
        let target = typeof e == "object" ? e.currentTarget : this.$refs.options.$el
        this.$popover.open({
          items: this.playbackRatesItems,
          selected: this.playbackRate,
          target: target,
          align: 'right'
        })

        this.$gtag.event('player', {
          'event_category': 'navigation',
          'event_label': 'showPlaybackRate'
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
        this.$video.pause()
        this.$popover.close()

        this.$gtag.event('player', {
          'event_category': 'navigation',
          'event_label': 'reportItem'
        })
      },

      openKeybindingsModal() {
        this.$modals.show(KeybindingsModal, {
          mode: 'video'
        })
        this.$video.pause()
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
            case 32: // Пробел
              this.togglePlay()
            break;
            case 37: // Лево
              this.moveBackward()
            break;
            case 39: // Право
              this.moveForward()
            break;
            case 70: // F key
              this.toggleFullscreen()
            break;
            case 77: // M key
              this.toggleMute()
            break;
            case 76: // L key
              this.toggleLoop()
            break;
            case 90: // Z key
              this.toggleZenMode()
            break;
            case 38: // Arrow top
              this.volumeUp()
              break;
            case 40: // Arrow bottom
              this.volumeDown()
              break;
          }
        }
        // Операции со шифтом
        if (e.shiftKey && !(e.ctrlKey || e.metaKey)) {
          switch(e.keyCode) {
            case 38: // Arrow top
              this.increasePlaybackRate()
            break;
            case 40: // Arrow bottom
              this.decreasePlaybackRate()
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
        this.$store.dispatch('player/fetch', { type: 'videos', params: this.params })
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
            this.$store.dispatch('player/fetch', { type: 'videos', params: this.params })
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
        // Сбраываем прогрессбар
        this.resetProgressBar()

        // Сбрасываем скорость воспроизведения
        this.resetPlaybackRate()

        // Сбрасываем таймер ожидания
        clearTimeout(this.waitingTimer)

        // Если приближаемся к концу списка - меняем страницу
        if (this.sources.length > 0 && (this.currentIndex >= this.sources.length - 10))
          this.$store.commit('player/SET_CURRENT_PAGE', this.currentPage + 1)

        // Подгружаем видео
        this.$video.load()

        // Прячем всплывашку
        this.$popover.close()
      },

      // Записываем в хранилище значения
      volume(to) {
        this.$storage.setItem('volume', this.$video.volume = to)
      },
      muted(to) {
        this.$storage.setItem('muted', this.$video.muted = to)
      },

      $route(to) {
        // Фокусируемся на плеере чтобы работали эвент хендлеры
        this.$player.focus()
        // Закрываем все модальные окна
        this.$modals.close()
        // Прячем всплывашку
        this.$popover.close()
        
        // Waterfall
        if (to.name == 'player-board-waterfall') {
          this.isWaterfall = true
        } else {
          this.isWaterfall = false
        }
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