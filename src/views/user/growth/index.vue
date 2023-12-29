<template> 
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div class="filter-title">
        <div class="text">
          <i class="el-icon-search"></i>
          <span>筛选搜索</span>
        </div>
        <div class="operate">
          <el-button type="primary" @click="handleSearchList()" size="small">搜索</el-button>
          <el-button @click="handleResetSearch()" size="small">重置</el-button>
        </div>
      </div>
      <el-form :inline="true" :model="listQuery" label-width="120px" size="small">
        <el-form-item label="公告标题：">
          <el-input v-model="listQuery.name" placeholder="请输入公告标题" clearable></el-input>
        </el-form-item>
        <el-form-item label="审核状态：">
          <el-select v-model="listQuery.status" placeholder="请选择状态" clearable>
            <el-option label="有效" :value="1"></el-option>
            <el-option label="无效" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="创建日期查询：">
          <el-date-picker v-model="listQuery.startDate" type="date" class="input-width" placeholder="选择开始日期"  format="yyyy-MM-dd" value-format="yyyy-MM-dd" clearable></el-date-picker>
          <span>--</span>
          <el-date-picker v-model="listQuery.endDate" type="date" class="input-width" placeholder="选择结束日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" clearable></el-date-picker>
        </el-form-item>
      </el-form>
    </el-card>
    <el-button type="primary" icon="el-icon-plus" class="btn-add" @click="handleAdd()">添加</el-button>
    <el-table ref="adminTable" :data="list" style="width: 100%; margin-top: 20px;" v-loading="listLoading" border>
      <el-table-column label="编号" width="60" align="center">
        <template slot-scope="scope">{{scope.row.id}}</template>
      </el-table-column>
      <el-table-column label="标题" header-align="center" min-width="200" show-overflow-tooltip>
        <template slot-scope="scope">{{scope.row.name}}</template>
      </el-table-column>
      <el-table-column label="描述" header-align="center" min-width="200" show-overflow-tooltip>
        <template slot-scope="scope">{{scope.row.note}}</template>
      </el-table-column>
      <el-table-column label="图片" align="center" width="130">
        <template slot-scope="scope">
          <img :src="scope.row.pic" alt="" style="width: 100px;height: auto;">
        </template>
      </el-table-column>
      <el-table-column label="排序" align="center" width="100">
        <template slot-scope="scope">{{scope.row.sort}}</template>
      </el-table-column>
      <el-table-column label="发布时间" align="center" width="180">
        <template slot-scope="scope">{{scope.row.startTime | formatDateTime}}</template>
      </el-table-column>
      <el-table-column label="创建人" align="center" width="120">
        <template slot-scope="scope">{{scope.row.createrName}}</template>
      </el-table-column>
      <el-table-column label="操作" width="180" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="handleUpdate(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="text" @click="handleView(scope.row)">查看</el-button>
          <el-button size="mini" type="text" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" layout="total,sizes,prev,pager,next,jumper" :current-page.sync="listQuery.pageNum" :page-size="listQuery.pageSize" :page-sizes="[10,15,20]" :total="total"></el-pagination>
    </div>
    <el-dialog :title="isEdit?'编辑公告':'添加公告'" :visible.sync="dialogVisible" width="700" custom-class="fixed">
      <el-form :model="form" ref="form" :key="key" label-width="120px" size="small" v-loading="dialogLoading">
        <el-form-item label="公告标题：" prop="name" required>
          <el-input v-model="form.name" clearable></el-input>
        </el-form-item>
        <el-form-item label="公告描述：" prop="note" required>
          <el-input v-model="form.note" type="textarea" clearable></el-input>
        </el-form-item>
        <el-form-item label="公告图片：" required>
          <el-upload action="" class="avatar-uploader" :http-request="uploadFile" :before-upload="beforeAvatarUpload">
            <template v-if="form.pic">
              <img :src="form.pic" class="avatar">
            </template>
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
        <div class="form-grid">
          <el-form-item label="排序：" prop="sort" required>
            <el-input-number v-model="form.sort" :min="0" clearable></el-input-number>
          </el-form-item>
          <el-form-item label="发布时间：" prop="startTime" required>
            <el-date-picker v-model="form.startTime" type="datetime" placeholder="投放开始时间" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" />
          </el-form-item>
        </div>
        <el-form-item label="公告详情：" required>
          <!-- 富文本编辑器 -->
          <tinymce :width="595" :height="300" v-model="form.content"></tinymce>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" :loading="dialogLoading" @click="handleDialogConfirm" size="small">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 公告详情在手机上展示情况 -->
    <el-dialog title="公告详情页展示" :visible.sync="dialogDetailVisible" width="700">
      <div class="detail-phone">
        <p v-html="detailHtml"></p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogDetailVisible = false" size="small">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import {
    fetchList,
    createNotice,
    updateNotice,
    deletNotice
  } from '@/api/system/notice';
  import {
    uploadImg
  } from '@/api/upload';
  import {
    formatDate
  } from '@/utils/date';
  import Tinymce from '@/components/Tinymce'
  const defaultAdmin = {
    id: null,
    name: '',
    note: '',
    pic: '',
    sort: 0,
    startTime: '',
    content: ''
  };
  export default {
    name: 'adminList',
    components: {
      Tinymce
    },
    data() {
      return {
        listQuery: {
          pageNum: 1,
          pageSize: 10,
          name: '',
          status: null,
          startDate: '',
          endDate: '',
        },
        list: null,
        total: null,
        listLoading: false,
        dialogLoading: false,
        dialogVisible: false,
        dialogDetailVisible: false,
        form: Object.assign({}, defaultAdmin),
        isEdit: false,
        key: 1,
        detailHtml: ''
      }
    },
    created() {
      this.getList();
    },
    filters: {
      formatDateTime(time) {
        if (time == null || time === '') {
          return 'N/A';
        }
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
      }
    },
    methods: {
      // 查询列表信息
      getList() {
        this.listLoading = true;
        fetchList(this.listQuery).then(response => {
          this.listLoading = false;
          this.list = response.data.list;
          this.total = response.data.total;
        });
      },
      handleResetSearch() {
        this.listQuery = Object.assign({}, {
          pageNum: 1,
          pageSize: 10,
          name: '',
          status: null,
          startDate: '',
          endDate: '',
        });
      },
      handleSearchList() {
        this.listQuery.pageNum = 1;
        this.getList();
      },
      handleSizeChange(val) {
        this.listQuery.pageNum = 1;
        this.listQuery.pageSize = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.listQuery.pageNum = val;
        this.getList();
      },
      handleAdd() {
        this.dialogVisible = true;
        this.isEdit = false;
        this.key += 1
        this.form = Object.assign({}, defaultAdmin);
      },
      handleUpdate(index, row) {
        this.dialogVisible = true;
        this.isEdit = true;
        this.key += 1
        this.form.content = ''
        this.form = Object.assign({}, row);
      },
      handleDialogConfirm() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.dialogLoading = true
            if (this.isEdit) {
              updateNotice(this.form).then(response => {
                this.$message({
                  message: '修改成功！',
                  type: 'success'
                });
                this.dialogVisible = false;
                this.dialogLoading = false;
                this.getList();
              })
            } else {
              createNotice(this.form).then(response => {
                this.$message({
                  message: '添加成功！',
                  type: 'success'
                });
                this.dialogVisible = false;
                this.dialogLoading = false;
                this.getList();
              })
            }
          }
        })
      },
      handleDelete(index, row) {
        this.$confirm('是否要删除该用户?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = {
            id: row.id
          }
          deletNotice(params).then(response => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.getList();
          });
        });
      },

      beforeAvatarUpload(file) {
        const isJpgPng = file.type === 'image/jpeg' || file.type === 'image/png'

        if (!isJpgPng) {
          this.$message({
            message: '上传文件格式只能是jpg/png！',
            type: 'error'
          });
          return false
        }

        const isLt1M = file.size / 1024 / 1024 < 1
        if (!isLt1M) {
          this.$message({
            message: '上传图片大小不能超过 1MB！',
            type: 'error'
          });
          return false
        }

        const isSize = new Promise(function(resolve, reject) {
          let _URL = window.URL || window.webkitURL;
          let img = new Image();
          img.onload = function() {
            let valid = parseFloat(img.width / img.height).toFixed(2) == 1.78;
            valid ? resolve() : reject();
          }
          img.src = _URL.createObjectURL(file);
        }).then(() => {
          return file;
        }, () => {
          this.$message({
            message: '上传图片比例只能为16:9, 请重新选择上传!',
            type: 'error'
          });
          return Promise.reject();
        })

        return isJpgPng && isLt1M && isSize
      },
      uploadFile(file, params) {
        const arr = []
        this.formDate = new FormData()
        this.formDate.append('file', file.file)
        this.dialogLoading = true
        uploadImg(this.formDate)
          .then(res => {
            this.$notify({
              type: 'success',
              message: '上传成功'
            })
            this.dialogLoading = false
            this.form.pic = res.data.url
          })
          .catch(res => {
            this.dialogLoading = false
          })
      },
      // 查看公告详情在手机上的展示情况
      handleView(row) {
        this.detailHtml = row.content
        this.dialogDetailVisible = true
      },
    }
  }
</script>
<style lang="scss" scoped>
  /deep/ .filter-container {
    margin-bottom: 20px;
  }

  /deep/ .el-card__body {
    padding-bottom: 0;
  }

  /deep/ .el-dialog__body {
    max-height: 75vh;
    overflow-y: scroll;
    padding: 16px 20px;
  }

  /deep/ .el-dialog__footer {
    border-top: 1px solid #dcdfe6;
  }

  /deep/ .el-dialog__header {
    border-bottom: 1px solid #dcdfe6;
  }

  .avatar-uploader {
    /deep/ .el-upload {
      cursor: pointer;
      position: relative;
    }

    /deep/ .el-upload:hover {
      border-color: #409eff;
    }

    /deep/ .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 100px;
      height: 100px;
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      line-height: 100px;
      text-align: center;
    }

    /deep/ .avatar {
      width: 100px;
      height: 100px;
      display: block;
    }
  }

  .detail-phone {
    width: 375px;
    height: 667px;
    border: 1px solid #d9d9d9;
    box-sizing: border-box;
    padding: 20px;
  }
</style>
