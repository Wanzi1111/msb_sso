<template>
  <div>
    <video-player ref="videoPlayer" class="custom-video" :options="playerOptions" @ready="ready" />
    <canvas ref="myCanvas" width="800" :height="800/posterRatio" style="position: fixed;left: 0;top: 0;display: none" />
  </div>
</template>

<script>
import videoPlayer from './VideoPlayer'

export default {
  name: 'Videos',
  components: { videoPlayer },
  props: {
    url: {
      type: String,
      default: ''
    },
    poster: {
      type: String,
      default: ''
    },
    autoPoster: {
      type: Boolean,
      default: false
    },
    posterRatio: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      canvas: '',
      playerOptions: {
        language: 'zh-CN',
        autoplay: false,
        // autoplay: !!sessionStorage.getItem('videoPlay'),
        // loop: !!sessionStorage.getItem('videoPlay'),
        controls: true
      },
      player: ''
    }
  },
  methods: {
    ready() {
      this.canvas = this.$refs.myCanvas.getContext('2d')
      this.player = this.$refs.videoPlayer.player
      this.init()
    },
    init() {
      const { url } = this
      let type = 'application/x-mpegurl' // 'application/x-mpegurl'/'video/mp4'
      if (url.includes('.mp4')) {
        type = 'video/mp4'
      }
      const video = {
        // withCredentials: false,
        type: type,
        src: url
      }
      this.player.reset() // in IE11 (mode IE10) direct usage of src() when <src> is already set, generated errors,
      this.player.src(video)
      this.player.ready(() => {
        // if (this.autoPoster && !this.poster) {
        //   this.$confirm('是否生成视频封面？', '', {
        //     confirmButtonText: '生成'
        //   }).then(() => {
        //     this.$nextTick(() => {
        //       this.getBaseUrl()
        //     })
        //   }).catch()
        // }
      })
    },
    getBaseUrl() {
      this.canvas.drawImage(this.player.tech().el(), 0, 0, 800, 800 / this.posterRatio)
      try {
        const dataUri = this.canvas.canvas.toDataURL('image/png')
        this.$emit('dataUri', dataUri)
      } catch (e) {
        this.$message.error('生成失败')
        console.error(e)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
	.custom-video {
		/deep/ .video-js {
			width: 300px;
			height: 200px;
			display: flex;
			justify-content: center;
			align-items: center;

			.vjs-big-play-button {
				position: relative;
				border-radius: 100%;
				height: 50px;
				width: 50px;
				top: auto;
				left: auto;
			}
		}
	}
</style>
