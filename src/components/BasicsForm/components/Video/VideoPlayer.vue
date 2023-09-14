<template>
  <div v-if="reseted">
    <video ref="video" class="video-js">
      <track
        v-for="(crtTrack,index) in trackList"
        :key="index"
        :kind="crtTrack.kind"
        :label="crtTrack.label"
        :src="crtTrack.src"
        :srcLang="crtTrack.srcLang"
        :default="crtTrack.default"
      >
      <p class="vjs-no-js">
        To view this video please enable JavaScript, and consider upgrading to a web browser that
        <a href="https://videojs.com/html5-video-support/" target="_blank">supports HTML5 video</a>
      </p>
    </video>
  </div>
</template>

<script>
const videojsCDNCss = 'https://cdnvip.meishubao.com/vipboss/static/css/video-js.7.9.1.min.css'
const videojsCDNJs = 'https://cdnvip.meishubao.com/vipboss/static/js/video.7.9.1.min.js'
const videojsZhCDNJs = 'https://cdnvip.meishubao.com/vipboss/static/js/video.7.9.1.zh-CN.min.js'
import load from './dynamicLoadScript'
import { dynamicLoadCss } from '@/utils'
import loadScript from '@/utils/dynamicLoadScript'

export default {
  name: 'Videoplayer',
  props: {
    crossOrigin: {
      type: String,
      default: ''
    },
    playsinline: {
      type: Boolean,
      default: false
    },
    customEventName: {
      type: String,
      default: 'statechanged'
    },
    options: {
      type: Object,
      required: true
    },
    events: {
      type: Array,
      default: () => []
    },
    globalOptions: {
      type: Object,
      default: () => ({
        // 查看文档: https://docs.videojs.com/tutorial-options.html#fluid
        autoplay: true,
        controls: true,
        language: 'zh',
        inactivityTimeout: 0,
        preload: 'auto',
        fluid: false,
        techOrder: ['html5'],
        plugins: {},
        playbackRateSupported: true,
        playbackRates: [1, 1.5, 2, 2.5, 3]
      })
    },
    globalEvents: {
      type: Array,
      default: () => []
    },
    trackList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      player: null,
      reseted: true
    }
  },
  watch: {
    options: {
      deep: true,
      handler(options, oldOptions) {
        this.dispose(() => {
          if (options && options.sources && options.sources.length) {
            this.initialize()
          }
        })
      }
    }
  },
  mounted() {
    this.init()
    // if (!this.player) {
    //   this.initialize()
    // }
  },
  beforeDestroy() {
    if (this.player) {
      this.dispose()
    }
  },
  methods: {
    init() {
      // dynamic load tinymce from cdn
      dynamicLoadCss(videojsCDNCss)
      load(videojsCDNJs, (err) => {
        if (err) {
          this.$message.error(err.message)
          return
        }
        loadScript(videojsZhCDNJs, '', () => {
          console.log('zh-CN Language OK!')
          this.initialize()
        })
      })
    },
    initialize: function() {
      const self = this
      const videoObj = this.$refs.video
      // videojs options
      const videoOptions = Object.assign({}, this.globalOptions, this.options)
      // ios fullscreen
      if (this.playsinline) {
        videoObj.setAttribute('playsinline', this.playsinline)
        videoObj.setAttribute('webkit-playsinline', this.playsinline)
        videoObj.setAttribute('x5-playsinline', this.playsinline)
        videoObj.setAttribute('x5-video-player-type', 'h5')
        videoObj.setAttribute('x5-video-player-fullscreen', false)
      }
      // cross origin
      if (this.crossOrigin !== '') {
        videoObj.crossOrigin = this.crossOrigin
        videoObj.setAttribute('crossOrigin', this.crossOrigin)
      }
      // avoid error "VIDEOJS: ERROR: Unable to find plugin: __ob__"
      if (videoOptions.plugins) {
        delete videoOptions.plugins.__ob__
      }
      // emit event
      const emitPlayerState = (event, value) => {
        if (event) {
          this.$emit(event, this.player)
        }
        if (value) {
          this.$emit(this.customEventName, { [event]: value })
        }
      }
      // player
      // console.log(videoOptions)
      this.player = window.videojs(videoObj, videoOptions, function() {
        // events
        const DEFAULT_EVENTS = [
          'loadeddata',
          'canplay',
          'canplaythrough',
          'play',
          'pause',
          'waiting',
          'playing',
          'ended',
          'error'
        ]
        const events = DEFAULT_EVENTS.concat(self.events).concat(
          self.globalEvents
        )

        // watch events
        const onEdEvents = {}
        for (let i = 0; i < events.length; i++) {
          if (
            typeof events[i] === 'string' &&
              onEdEvents[events[i]] === undefined
          ) {
            (event => {
              onEdEvents[event] = null
              this.on(event, () => {
                emitPlayerState(event, true)
              })
            })(events[i])
          }
        }
        // player readied
        self.$emit('ready', this)
        setTimeout(function() {
          const rate = localStorage.getItem('rate') ? localStorage.getItem('rate') : 1
          const arr = ['1', '1.5', '2', '2.5', '3']
          if (arr.includes(rate)) {
            self.player.playbackRate(rate)
          } else {
            console.log(rate, 'rate')
            localStorage.setItem('rate', 1)
            self.player.playbackRate(1)
          }
        //   console.log(self.player, 'player')
        }, 20)
        this.on('ratechange', (e) => {
          const rate = self.player.playbackRate()
          localStorage.setItem('rate', rate)
        })
      })
    },
    dispose(callback) {
      if (this.player && this.player.dispose) {
        if (this.player.techName_ !== 'Flash') {
          this.player.pause && this.player.pause()
        }
        this.player.dispose()
        this.player = null
        this.$nextTick(() => {
          this.reseted = false
          this.$nextTick(() => {
            this.reseted = true
            this.$nextTick(() => {
              callback && callback()
            })
          })
        })
      }
    }
  }
}

</script>
