<template>
  <div class="comp-tinymce-wrapper">
    <textarea :id="tinymceId"></textarea>
  </div>
</template>
<script>
  //上传图片方法

  import {
    uploadImg
  } from '@/api/upload';
  export default {
    name: 'tinymce',
    props: {
      id: {
        type: String
      },
      value: {
        type: String,
        default: ''
      },
      //可以自定义toolbar
      toolbar: {
        type: Array,
        require: false,
        default () {
          return ['removeformat undo redo |  bullist numlist | outdent indent  | fullscreen code', 'formatselect |  bold italic strikethrough forecolor blockquote | alignleft aligncenter alignright | image link ']
        }
      },
      menubar: {
        default: ''
      },
      height: {
        type: Number,
        requier: false,
        default: 400
      }
    },
    data() {
      return {
        tinymceId: this.id || 'vue-tinymce' + Date.parse(new Date()),
        hasInit: false,
        hasChange: false
      }
    },
    mounted() {
      this.initTinymce()
    },
    watch: {
      value(newV, oldV) {
        //当传入值不变化的时候更新富文本内容,
        window.tinymce.get(this.tinymceId).setContent(newV)
        // if (this.hasInit && !this.hasChange) {
        //   window.tinymce.get(this.tinymceId).setContent(newV)
        // }
      }
    },
    methods: {
      initTinymce() {
        const _this = this
        tinymce.init({
          selector: `#${this.tinymceId}`,
          height: this.height,
          body_class: 'panel-body rich-text',
          theme: 'modern',
          content_style: '{p{color_red} }',
          //是否可拉伸
          resize: false,
          //语言
          language: 'zh_CN',
          //是否显示POWERED BY TINYMCE
          branding: false,
          //toolbar
          toolbar: this.toolbar,
          fixed_toolbar_container: '#mytoolbar',
          //menubar
          menubar: this.menubar,
          //插件
          plugins: 'advlist,autolink,code,paste,textcolor, colorpicker,fullscreen,link,lists, image ',

          powerpaste_word_import: 'clean',
          //源代码弹出层宽
          code_dialog_height: 450,
          block_formats: 'Paragraph=p;Header 1=h1;Header 2=h2;Header 3=h3',
          imagetools_cors_hosts: ['wpimg.wallstcn.com', 'wallstreetcn.com'],
          //链接打开方式
          default_link_target: '_blank',
          images_upload_url: '/oss/file/uploadRichImg?dir=image',
          //上传图片回调
          images_upload_handler: (blobInfo, success, failure) => {
            let fd = new FormData()
            fd.append('file', blobInfo.blob())
            uploadImg(fd).then(res => {
                let result = res.data
                success(result.url)
              })
              .catch(err => {
              })
          },
          init_instance_callback: editor => {
            if (_this.value) {
              editor.setContent(_this.value)
            }
            _this.hasInit = true
            editor.on('NodeChange Change input KeyUp', () => {
              //change触发watch去setContent，光标变化了，
              this.hasChange = true
              this.$emit('input', editor.getContent({
                format: 'raw'
              }))
            })
          }
        })
      },
      destroyTiny() {
        if (window.tinymce.get(this.tinymceId)) {
          window.tinymce.get(this.tinymceId).destroy()
        }
      },
      setContent(val) {
        window.tinymce.get(this.tinymceId).setContent(val)
      },
      getContent() {
        window.tinymce.get(this.tinymceId).getContent()
      },
      destroyed() {
        this.destroyTiny()
      }

    }
  }
</script>
<style scoped>
  .tinymce-container {
    position: relative;
  }

  .tinymce-container>>>.mce-fullscreen {
    z-index: 10000;
  }

  .tinymce-textarea {
    visibility: hidden;
    z-index: -1;
  }

  .editor-custom-btn-container {
    position: absolute;
    right: 10px;
    top: 2px;
    /*z-index: 2005;*/
  }

  .editor-upload-btn {
    display: inline-block;
  }
</style>
