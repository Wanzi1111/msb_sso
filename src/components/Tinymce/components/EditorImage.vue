<template>
  <div class="">
    <el-button
      :style="{ background: color, borderColor: color }"
      icon="el-icon-upload"
      size="mini"
      type="primary"
      @click="dialogVisible = true"
    >上传图片</el-button>
    <el-dialog width="750px" title="上传图片" :visible.sync="dialogVisible">
      <div class="ed-img-list">
        <ul class="materiel-list">
          <li
            v-for="(item, i) in imgList"
            :key="i"
            :class="item.check ? 'img-check' : ''"
            @click="selectMateriel(i)"
          >
            <img :src="item.url" alt="">
            <div
              :class="
                item.check
                  ? 'materiel-check materiel-check-y'
                  : 'materiel-check'
              "
            >
              <i class="el-icon-check" />
            </div>
          </li>
        </ul>
      </div>
      <div class="form-item-element">
        <input
          ref="img"
          style="display: none"
          type="file"
          @change="uploadMedia"
        >

        <div v-if="uploadLoading" class="media-upload">
          <i class="el-icon-loading" />&ensp;文件上传中...
        </div>
        <div v-else class="media-upload" @click="clickUpload">
          <i class="el-icon-upload2" />&ensp;上传
        </div>
      </div>
      <div class="ed-img-action">
        <div>
          <el-button
            icon="el-icon-check"
            type="primary"
            @click="handleSubmit"
          >确定</el-button>
        </div>
        <div>
          <el-button
            icon="el-icon-close"
            @click="dialogVisible = false"
          >取消</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { upload } from '@/api/common'

export default {
  name: 'EditorSlideUpload',
  props: {
    color: {
      type: String,
      default: '#1890ff'
    }
  },
  data() {
    return {
      dialogVisible: false,
      uploadLoading: false,
      imgList: []
    }
  },
  methods: {
    // 触发选择文件
    clickUpload() {
      this.$refs.img.click()
    },
    // 上传文件
    uploadMedia(e) {
      const mediaRules = {
        type: 'GIF,PNG,JPG,JPEG,MP4',
        size: 10
      }
      if (!this.uploadBefore(e.target.files[0], mediaRules)) {
        return false
      }

      console.log(e.target.files)

      this.uplaods(e.target.files[0], url => {
        const img = {
          hasSuccess: true,
          uid: 1579158660770,
          width: 200,
          url: url,
          check: true
        }
        this.imgList = [...this.imgList, img]
      })
    },
    // 上传
    uplaods(file, callback) {
      upload({ file: file })
        .then(([up, url]) => {
          this.uploadLoading = true
          up.then(() => {
            callback && callback(url)
          })
            .catch(() => {
              callback('')
            })
            .finally(() => {
              this.uploadLoading = false
            })
        })
        .catch(() => {
          callback('')
        })
    },
    // 上传文件校验
    uploadBefore(file, mediaRules = { type: '', size: 2048 }) {
      const isType =
        mediaRules.type === '' ||
        mediaRules.type.toLowerCase().indexOf(file.type.split('/')[1]) >= 0
      const isBig = file.size / 1024 / 1024 < mediaRules.size
      if (isType && isBig) {
        return true
      } else {
        this.$message.error(
          `请上传${mediaRules.size}M以下文件，支持${mediaRules.type}格式`
        )
        return false
      }
    },
    // 点选物料
    selectMateriel(index) {
      const { imgList } = this
      // 多选
      for (let i = 0; i < imgList.length; i++) {
        if (i === index) {
          imgList[i].check = !imgList[i].check
          break
        }
      }
      // 单选
      // for (let i = 0; i < imgList.length; i++) {
      //   imgList[i].check = false
      // }
      // imgList[index].check = true
      this.imgList = [...imgList]
    },
    // 确认选择
    handleSubmit() {
      const { imgList } = this
      const checkImg = []
      imgList.map(item => {
        if (item.check) {
          checkImg.push(item)
        }
        item.check = false
      })
      this.$emit('successCBK', checkImg)
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.media-upload {
  cursor: pointer;
  border: 1px dashed #ddd;
  width: 100%;
  height: 60px;
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
    border: 1px dashed #1790ff;
    color: #1790ff;
  }
}
.ed-img-list {
  .materiel-list {
    margin: 0 -10px 20px 0;
    padding: 0;
    max-height: 330px;
    overflow: auto;

    &:after {
      content: "";
      display: block;
      clear: both;
    }
    li {
      list-style: none;
      float: left;
      width: 225px;
      height: 150px;
      margin-right: 15px;
      margin-bottom: 15px;
      border: 1px dashed #ddd;
      box-sizing: border-box;
      overflow: hidden;
      /*transition: all .35s;*/
      cursor: pointer;
      position: relative;
      &:hover {
        border: 1px dashed #89c3f9;
        img,
        video {
          transform: scale(1.1);
        }
      }
      img,
      video {
        float: left;
        width: 225px;
        height: 150px;
        transition: all 0.35s;
      }
      &:nth-child(3n) {
        margin-right: 0;
      }
      .materiel-check {
        width: 30px;
        height: 30px;
        border-radius: 15px;
        right: 10px;
        bottom: 10px;
        position: absolute;
        background-color: #9e9e9e;
        text-align: center;
        i {
          font-size: 24px;
          color: #ffffff;
          cursor: pointer;
          font-weight: 900;
          line-height: 30px;
        }
      }
      .materiel-check-y {
        background-color: #2196f3;
      }
    }
    .img-check {
      border-color: #fff;
      &:hover {
        border-color: #fff;
      }
    }
  }
}
.ed-img-action {
  margin-top: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  > div {
    margin: 0 5px;
  }
}
</style>
