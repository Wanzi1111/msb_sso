<template>
  <div
    :class="{ fullscreen: fullscreen }"
    class="tinymce-container"
    :style="{ width: containerWidth }"
  >
    <textarea :id="tinymceId" class="tinymce-textarea" />
    <div class="editor-custom-btn-container">
      <editorImage
        color="#1890ff"
        class="editor-upload-btn"
        @successCBK="imageSuccessCBK"
      />
      <!-- <editorImage
        color="#1890ff"
        class="editor-upload-btn"
        @successCBK="imageSuccessCBK"
      /> -->
    </div>
  </div>
</template>

<script>
/**
 * docs:
 * https://panjiachen.github.io/vue-element-admin-site/feature/component/rich-editor.html#tinymce
 */
import editorImage from './components/EditorImage'
import plugins from './plugins'
import toolbar from './toolbar'
import load from './dynamicLoadScript'

// why use this cdn, detail see https://github.com/PanJiaChen/tinymce-all-in-one
// 当前版本：Version: 5.2.0 (2020-02-13)
// 现将CDN放在美术宝的OSS上，可以在下面tinymce中文网找更多插件
// http://tinymce.ax-z.cn/more-plugins/bdmap.php
// const tinymceCDN = 'https://cdn.jsdelivr.net/npm/tinymce-all-in-one@4.9.3/tinymce.min.js'
const tinymceCDN =
  'https://cdnvip.meishubao.com/vipboss/static/tinymce/tinymce.min.js'

export default {
  name: 'Tinymce',
  components: {
    editorImage
  },
  props: {
    id: {
      type: String,
      default: function() {
        return (
          'vue-tinymce-' +
          +new Date() +
          ((Math.random() * 1000).toFixed(0) + '')
        )
      }
    },
    value: {
      type: String,
      default: ''
    },
    toolbar: {
      type: Array,
      required: false,
      default() {
        return []
      }
    },
    menubar: {
      type: String,
      default: 'file edit insert view format table'
    },
    height: {
      type: [Number, String],
      required: false,
      default: 360
    },
    width: {
      type: [Number, String],
      required: false,
      default: 'auto'
    },
    modify: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      hasChange: false,
      hasInit: false,
      tinymceId: this.id,
      fullscreen: false,
      languageTypeList: {
        en: 'en',
        zh: 'zh_CN',
        es: 'es_MX',
        ja: 'ja'
      }
    }
  },
  computed: {
    containerWidth() {
      const width = this.width
      if (/^[\d]+(\.[\d]+)?$/.test(width)) {
        // matches `100`, `'100'`
        return `${width}px`
      }
      return width
    }
  },
  watch: {
    value(val) {
      if ((!this.hasChange && this.hasInit) || (this.hasInit && this.modify)) {
        this.$nextTick(() =>
          window.tinymce.get(this.tinymceId).setContent(val || '')
        )
      }
      this.hasChange = false
      if (this.modify) {
        this.$emit('update:modify', false)
      }
    }
  },
  mounted() {
    this.init()
  },
  activated() {
    if (window.tinymce) {
      this.initTinymce()
    }
  },
  deactivated() {
    this.destroyTinymce()
  },
  destroyed() {
    this.destroyTinymce()
  },
  methods: {
    init() {
      // dynamic load tinymce from cdn
      load(tinymceCDN, err => {
        if (err) {
          this.$message.error(err.message)
          return
        }
        this.initTinymce()
      })
    },
    initTinymce() {
      const _this = this
      window.tinymce.init({
        selector: `#${this.tinymceId}`,
        language: this.languageTypeList['zh'],
        height: this.height,
        body_class: 'panel-body ',
        object_resizing: false,
        toolbar: this.toolbar.length > 0 ? this.toolbar : toolbar,
        //  toolbar: ["media", "image"],
        menubar: this.menubar,
        plugins: plugins,
        end_container_on_empty_block: true,
        powerpaste_word_import: 'clean',
        // paste_webkit_styles: 'all', // 粘贴保留样式
        code_dialog_height: 450,
        code_dialog_width: 1000,
        advlist_bullet_styles: 'square',
        advlist_number_styles: 'default',
        imagetools_cors_hosts: ['www.tinymce.com', 'codepen.io'],
        default_link_target: '_blank',
        link_title: true,
        nonbreaking_force_tab: true, // inserting nonbreaking space &nbsp; need Nonbreaking Space Plugin
        init_instance_callback: editor => {
          if (_this.value) {
            editor.setContent(_this.value)
          }
          _this.hasInit = true
          editor.on('NodeChange Change KeyUp SetContent', () => {
            this.hasChange = true
            this.$emit('input', editor.getContent())
          })
        },
        setup(editor) {
          editor.on('FullscreenStateChanged', e => {
            _this.fullscreen = e.state
          })
        },
        // 整合七牛上传
        // images_dataimg_filter(img) {
        //   setTimeout(() => {
        //     const $image = $(img);
        //     $image.removeAttr('width');
        //     $image.removeAttr('height');
        //     if ($image[0].height && $image[0].width) {
        //       $image.attr('data-wscntype', 'image');
        //       $image.attr('data-wscnh', $image[0].height);
        //       $image.attr('data-wscnw', $image[0].width);
        //       $image.addClass('wscnph');
        //     }
        //   }, 0);
        //   return img
        // },

        file_picker_callback: function(callback, value, meta) {
          console.log(callback, value, meta)
          var filetype = ' .mp3, .mp4'
          // 后端接收上传文件的地址
          // var upurl = "/demo/upfile.php";
          // 为不同插件指定文件类型及后端地址
          // switch (meta.filetype) {
          //   case "image":
          //     filetype = ".jpg, .jpeg, .png, .gif";
          //     upurl = "upimg.php";
          //     break;
          //   case "media":
          //     filetype = ".mp3, .mp4";
          //     upurl = "upfile.php";
          //     break;
          //   case "file":
          //   default:
          // }
          // 模拟出一个input用于添加本地文件
          var input = document.createElement('input')
          input.setAttribute('type', 'file')
          input.setAttribute('accept', filetype)
          input.click()
          input.onchange = function() {
            var file = this.files[0]
            console.log(file.name)
            // xhr = new XMLHttpRequest();
            // xhr.withCredentials = false;
            // xhr.open("POST", upurl);
            // xhr.onload = function() {
            //   var json;
            //   if (xhr.status != 200) {
            //     failure("HTTP Error: " + xhr.status);
            //     return;
            //   }
            //   json = JSON.parse(xhr.responseText);
            //   if (!json || typeof json.location != "string") {
            //     failure("Invalid JSON: " + xhr.responseText);
            //     return;
            //   }
            //   callback(json.location);
            // };
            console.log(file)
            // formData.append("file", file, file.name);
            // console.log(formData);
            _this.$emit('upload', { file: file }, res => {
              // progress(100);

              if (res) {
                this.url = res
                callback(res)
              } else {
                // failure('出现未知问题，刷新页面，或者联系程序员')
              }
            })
            // xhr.send(formData);
          }
        },
        media_upload_handler(blobInfo, success, failure, progress) {
          progress(0)
          console.log(blobInfo.blob())
          _this.$emit('upload', { file: blobInfo.blob() }, res => {
            if (res) {
              success(res)
            } else {
              // failure('出现未知问题，刷新页面，或者联系程序员')
            }
          })
        },
        images_upload_handler(blobInfo, success, failure, progress) {
          progress(0)
          console.log(blobInfo.blob())
          _this.$emit('upload', { file: blobInfo.blob() }, res => {
            if (res) {
              success(res)
            } else {
              // failure('出现未知问题，刷新页面，或者联系程序员')
            }
          })
        }
      })
    },
    destroyTinymce() {
      const tinymce = window.tinymce.get(this.tinymceId)
      if (this.fullscreen) {
        tinymce.execCommand('mceFullScreen')
      }

      if (tinymce) {
        tinymce.destroy()
      }
    },
    setContent(value) {
      window.tinymce.get(this.tinymceId).setContent(value)
    },
    getContent() {
      window.tinymce.get(this.tinymceId).getContent()
    },
    imageSuccessCBK(arr) {
      const _this = this
      arr.forEach(v => {
        window.tinymce
          .get(_this.tinymceId)
          .insertContent(`<img width="100%" class="wscnph" src="${v.url}" >`)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.tinymce-container {
  position: relative;
  line-height: normal;
}
.tinymce-container >>> .mce-fullscreen {
  z-index: 10000;
}
.tinymce-container >>> .tox-tinymce {
  z-index: 0;
}
.tinymce-container {
  /deep/ .tox-statusbar__branding {
    display: none !important;
  }
}
.tinymce-textarea {
  visibility: hidden;
  z-index: -1;
}
.editor-custom-btn-container {
  position: absolute;
  right: 4px;
  top: 4px;
  /*z-index: 2005;*/
}
.editor-custom-btn-container >>> button {
  z-index: 1;
}
.fullscreen .editor-custom-btn-container {
  z-index: 10000;
  position: fixed;
}
.editor-upload-btn {
  display: inline-block;
}
</style>
