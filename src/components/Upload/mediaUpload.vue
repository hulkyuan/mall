<template>
  <div>
    <el-upload :action="minioUploadUrl" :data="null" list-type="picture" :multiple="false" :show-file-list="showFileList"
      :file-list="fileList" :before-upload="beforeUpload" :on-remove="handleRemove" :on-success="handleUploadSuccess">
      <el-button size="small" type="primary">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">只能上传mp3/mp4文件，且不超过10MB</div>
    </el-upload>
  </div>
</template>
<script>
import {
  policy
} from '@/api/oss'

export default {
  name: 'singleUpload',
  props: {
    value: String,
    type: String
  },
  computed: {
    imageUrl() {
      return this.value;
    },
    imageName() {
      if (this.value != null && this.value !== '') {
        return this.value.substr(this.value.lastIndexOf("/") + 1);
      } else {
        return null;
      }
    },
    fileList() {
      return [{
        name: this.name,
        url: this.url
      }]
    },
    showFileList: {
      get: function () {
        return this.value !== null && this.value !== '' && this.value !== undefined;
      },
      set: function (newValue) { }
    }
  },
  data() {
    return {
      dataObj: {
        dir: '',
        host: '',
      },
      minioUploadUrl: 'http://111.229.115.233:8086/audio/upload',
    };
  },
  created() {

  },
  methods: {
    emitInput(val) {
      this.$emit('mediaChange', val)
    },
    handleRemove(file, fileList) {
      this.emitInput('');
    },
    beforeUpload(file) {
      // const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 10;

        // if (!isJPG) {
        //   this.$message.error('上传头像图片只能是 JPG 格式!');
        // }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return  isLt2M;
    },
    handleUploadSuccess(res, file) {
      this.showFileList = true;
      this.fileList.pop();
      let url = this.dataObj.host+res.data.url;
      this.fileList.push({
        name: res.data.name,
        url: url
      });
      this.emitInput(this.fileList[0]);
    }
  }
}
</script>
<style></style>
