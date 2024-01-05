<template>
    <el-upload :action="minioUploadUrl" accept=".xls,.xlsx" :data="null" :multiple="false" :show-file-list="false"
      :file-list="fileList" :before-upload="beforeUpload" :on-remove="handleRemove" :on-success="handleUploadSuccess">
      <el-button size="mini" type="primary">点击上传</el-button>
    </el-upload>
</template>
<script>

export default {
  name: 'fileUpload',
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
  },
  data() {
    return {
      dataObj: {
        dir: '',
        host: '',
      },
      minioUploadUrl: 'http://111.229.115.233:8086/camera/batchAdd',
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
      const msg=res.data;
      this.$message.success(msg);
      this.emitInput('success');
    }
  }
}
</script>
<style></style>
