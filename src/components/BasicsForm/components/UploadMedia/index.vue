<template>
  <div class="form-item-element" v-bind="item.attr">
    <el-input v-show="false" v-model="trigger" />
    <input :ref="item.prop" style="display: none" type="file" :multiple="item.mediaRules.multiple" @change="e => uploadMediaFc(e, item)">
    <template v-if="loadingProp.indexOf(item.prop) === -1 && url">
      <div class="media-item">
        <el-image v-if="item.mediaRules.media === 'img'" :key="url" :preview-src-list="[url]" :src="url" alt="" />
        <videos v-else ref="videoWrapper" :key="url" :url="url" :poster="poster" :poster-ratio="item.mediaRules.posterRatio" :auto-poster="!poster && item.mediaRules.poster" @dataUri="dataUri" />
        <div v-if="!item.attr || !item.attr.disabled" class="media-upload-update" @click="clickUpload(item.prop)"><i class="el-icon-upload2" />&ensp;修改</div>
        <div v-else-if="item.attr.rotate" class="media-upload-update" @click="clickRotate(item.prop)"><i class="el-icon-refresh-right" />&ensp;旋转</div>
      </div>
    </template>
    <div v-else-if="loadingProp.indexOf(item.prop) >= 0" class="media-upload">
      <i class="el-icon-loading" />&ensp; {{ speedLoading[item.prop] ? `[${upNow}/${upMax}] ${speedLoading[item.prop]}` : `[${upMax}]个文件上传中...` }}
    </div>
    <div v-else-if="!item.attr || !item.attr.disabled" class="media-upload" @click="clickUpload(item.prop)">
      <i class="el-icon-upload2" />&ensp;上传
    </div>
    <div v-else class="media-upload media-upload-disabled" />
  </div>
</template>

<script>

const mime = require('mime')
import Videos from '../Video'
import { videoType, m3u8Duration, m3u8Size } from '@/utils'

export default {
  name: 'UploadMedia',
  components: { Videos },
  props: {
    item: {
      type: Object,
      default: () => ({})
    },
    value: {
      type: [String, Object],
      default: ''
    }
  },
  data() {
    return {
      trigger: '',
      loadingProp: [],
      speedLoading: {},
      upMax: 1,
      upNow: 1,
      duration: 0,
      deg: 0
    }
  },
  computed: {
    url() {
      const { item } = this
      if (item.mediaRules.media === 'video') {
        return this.value.url
      } else {
        return this.value
      }
    },
    poster() {
      return this.value.poster
    }
  },
  watch: {
    value() {
      this.deg = 0
    }
  },
  methods: {
    triggerVal() {
      this.trigger = Math.random()
    },
    // 触发旋转文件
    clickRotate(name) {
      let el
      let type = ''
      if (name === 'videoUrl') {
        el = document.querySelector('.vjs-tech')
        type = 'rotateAngle'
      } else {
        el = document.querySelector('.el-image__inner')
        type = 'imgRotate'
      }
      if (!this.deg) {
        this.deg = 90
      } else {
        this.deg += 90
      }
      this.$emit('changeTurn', this.deg, type)
      el.style.transition = 'transform 1s'
      el.style.transform = `rotate(${this.deg}deg)`
    },
    // 触发选择文件
    clickUpload(name) {
      this.$refs[name].click()
    },
    // 上传
    uplaods(file, item = {}, callback, onUploadProgress = () => {}) {
      const mediaRules = item.mediaRules || {}
      const attr = item.attr || {}
      const time = mediaRules.time || 0
      this.$emit('upload', { file: file, time, onUploadProgress, attr }, res => callback(res))
    },
    /**
     * 上传文件校验
     * @param e
     * @param mediaRules
     * @returns {Promise<boolean>}
     */
    async uploadVerification(e, mediaRules) {
      mediaRules = {
        ...{ width: 0, height: 0, ratio: 0, type: '', size: 2048 },
        ...mediaRules
      }
      // console.log(e)
      // const isType = mediaRules.type === '' || mediaRules.type.toLowerCase().indexOf(e.target.files[0].type.split('/')[1]) >= 0
      let isType = false
      let isLong = true
      // 格式
      if (mediaRules.type) {
        const files = e.target.files
        for (let i = 0; i < files.length; i++) {
          mediaRules.type.split(',').map(item => {
            if (!files[i].type && (files[i].name.includes('.xls') || files[i].name.includes('.ts'))) {
              isType = true
            }
            if (files[i].type === mime.getType(item)) {
              isType = true
            }
            if (files[i].name.includes(item)) {
              isType = true
            }
          })
        }
      } else {
        isType = true
      }
      // 视频时长
      if (isType && mediaRules.media === 'video' && mediaRules.duration) {
        const files = e.target.files
        let duration = 0
        if (videoType(files) !== 'mp4') {
          duration = await m3u8Duration(files)
          if (duration > mediaRules.duration) {
            isLong = false
          }
        } else {
          // 获取视频或者音频时长
          // 经测试，发现audio也可获取视频的时长
          const mp4Duration = (file) => {
            const fileurl = URL.createObjectURL(file)
            const audioElement = new Audio(fileurl)
            return new Promise((resolve) => {
              audioElement.addEventListener('loadedmetadata', function(_event) {
                resolve(audioElement.duration)
              })
            })
          }
          duration = await mp4Duration(files[0])
          if (duration > mediaRules.duration) {
            isLong = false
          }
        }
        this.duration = duration
      }

      // 大小
      let isBig = true
      if (mediaRules.media === 'video' && e.target.files.length > 1) {
        isBig = m3u8Size(e.target.files) / 1024 < mediaRules.size
      } else {
        isBig = e.target.files[0].size / 1024 / 1024 < mediaRules.size
      }

      // 尺寸
      const getSize = () => {
        return new Promise((resolve, reject) => {
          const image = new Image()
          const fileReader = new FileReader()
          fileReader.readAsDataURL(e.target.files[0])
          fileReader.onload = file => {
            image.src = file.target.result
            // base64地址图片加载完毕后
            image.onload = img => {
              // reject()
              resolve(image)
            }
            image.onerror = error => {
              reject(error)
            }
          }
          fileReader.onerror = error => {
            reject(error)
          }
        })
      }

      try {
        if (!isLong) {
          this.$refs[this.item.prop].value = ''
          this.$message.error(`请上传时长不超过${mediaRules.duration}秒的视频`)
          return false
        }
        if (!isType) {
          this.$refs[this.item.prop].value = ''
          this.$message.error(`上传格式错误，请选择${mediaRules.type}格式`)
          return false
        }
        if (!isBig) {
          let txt = `${mediaRules.size}M`
          if (mediaRules.size < 1) {
            txt = `${mediaRules.size * 1024}KB`
          }

          this.$refs[this.item.prop].value = ''
          this.$message.error(`上传文件太大，请选择${txt}以下文件`)
          return false
        }
        if (mediaRules.ratio) {
          const sizeDat = await getSize()
          const ratio = parseFloat(mediaRules.ratio)
          if (sizeDat.width / sizeDat.height !== ratio) {
            this.$refs[this.item.prop].value = ''
            this.$message.error(`上传比例错误，请选择比例为 1:${1 / mediaRules.ratio} 的图片`)
            return false
          }
        } else if (mediaRules.width || mediaRules.height) {
          const sizeDat = await getSize()
          const width = parseInt(mediaRules.width)
          const height = parseInt(mediaRules.height)
          if (sizeDat.width !== width || sizeDat.height !== height) {
            this.$refs[this.item.prop].value = ''
            this.$message.error(`上传尺寸错误，请选择尺寸宽高为 ${mediaRules.width} * ${mediaRules.height} 的图片`)
            return false
          }
        }
        return true
      } catch (e) {
        this.$refs[this.item.prop].value = ''
        this.$message.error(`文件识别失败`)
        return false
      }
    },
    // 上传文件
    uploadMediaFc(e, dat) {
      this.upMax = 1
      this.upNow = 1
      // console.log(e)
      this.uploadVerification(e, dat.mediaRules).then(async sta => {
        if (sta) {
          this.$emit('input', '')
          // this.triggerVal()
          // this.form[dat.prop] = ''
          const { loadingProp } = this
          this.loadingProp = [...loadingProp, dat.prop]
          // this.form = { ...this.form }

          let upFile = e.target.files[0]
          const tsList = []
          if (dat.mediaRules.media === 'video' && e.target.files.length > 1) {
            const files = e.target.files
            for (let i = 0; i < files.length; i++) {
              if (files[i].name.includes('m3u8')) {
                upFile = files[i]
              } else {
                tsList.push(files[i])
              }
            }
          }
          if (tsList.length) {
            this.upMax = tsList.length + 1
            await this.upTs(tsList, 0)
          }

          this.uplaods(upFile, dat, url => {
            if (dat.mediaRules.media === 'video') {
              this.$emit('input', { duration: this.duration, url: url, poster: this.poster })
              this.triggerVal()
            } else {
              this.$emit('input', url)
              this.triggerVal()
            }

            // this.form = { ...this.form }
            this.$refs[dat.prop].value = ''
            const { loadingProp } = this
            const newLoad = loadingProp.filter(item => item !== dat.prop)
            this.loadingProp = [...newLoad]
            // this.$refs.basicsForm.validateField(dat.prop)
          }, progressEvent => {
            // console.log(progressEvent);
            // loaded: 180224
            // total: 84269786
            this.speedLoading = {
              ...this.speedLoading,
              [dat.prop]: `${(progressEvent.loaded / progressEvent.total * 100).toFixed(2)}%`
            }
          })
        } else {
          this.$refs[dat.prop].value = ''
        }
      })
    },
    // 上传m3u8的TS文件
    upTs(files, i) {
      return new Promise((resolve, reject) => {
        const up = (files, index) => {
          const { loadingProp, item } = this
          this.loadingProp = [...loadingProp, this.item.prop]
          const time = this.item.mediaRules.time || 0
          this.$emit('upload',
            {
              file: files[index],
              time,
              rename: false,
              attr: item.attr || {},
              onUploadProgress: (progressEvent) => {
                this.speedLoading = {
                  ...this.speedLoading,
                  [this.item.prop]: `${(progressEvent.loaded / progressEvent.total * 100).toFixed(2)}%`
                }
              }
            }, res => {
              const { loadingProp } = this
              const newLoad = loadingProp.filter(item => item !== this.item.prop)
              this.loadingProp = [...newLoad]
              console.log(res)
              index += 1
              if (files.length > index) {
                this.upNow += 1
                up(files, index)
              } else {
                resolve()
              }
            })
        }
        up(files, i)
      })
    },
    // 封面生成
    dataUri(base64) {
      function dataURLtoFile(dataurl, filename) { // 将base64转换为文件
        const arr = dataurl.split(','); const mime = arr[0].match(/:(.*?);/)[1]
        const bstr = atob(arr[1]); let n = bstr.length; const u8arr = new Uint8Array(n)
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n)
        }
        return new File([u8arr], filename, { type: mime })
      }
      const { item } = this
      this.uplaods(dataURLtoFile(base64, 'poster.png'), item, url => {
        this.$emit('input', { duration: this.duration, url: this.url, poster: url })
        this.triggerVal()
        this.$message.success('封面生成成功')
      }, progressEvent => {
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.media-item {
  overflow: hidden;
  border: 1px solid #f6f6f6;
  width: 300px;
  height: 200px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;

  img,
  video {
    /*position: absolute;*/
    /*z-index: 1;*/
    /*width: 300px;*/
    /*height: 200px;*/
    /*cursor: pointer;*/
    /*outline: none;*/
  }

  svg {
    font-size: 50px;
    z-index: 2;
    color: #1890ff;
    cursor: pointer;
  }
}

.media-upload-update {
  cursor: pointer;
  width: 100%;
  height: 36px;
  position: absolute;
  top: 0;
  text-align: center;
  background-color: #f6f6f6;
  color: #1790ff;
  z-index: 10;
  transition: all 0.35s;

  &:hover {
    background-color: #1790ff;
    color: #fff;
  }
}

.media-upload {
  cursor: pointer;
  border: 1px dashed #ddd;
  width: 225px;
  height: 150px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #666;
  transition: all 0.35s;

  i {
    font-size: 20px;
    z-index: 2;
  }

  &:hover {
    border: 1px dashed #1890ff;
    color: #1890ff;
  }
}
.media-upload-disabled {
  background-color: #f5f7fa;
  cursor: not-allowed;
  border-style: solid;
  border-color: #dfe4ed;
}
</style>
