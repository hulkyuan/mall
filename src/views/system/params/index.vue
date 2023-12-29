<template> 
  <div class="app-container">
    <el-table ref="adminTable" :data="list" v-loading="listLoading" border>
      <el-table-column label="ID" width="60" align="center">
        <template slot-scope="scope">{{scope.row.id}}</template>
      </el-table-column>
      <el-table-column label="参数名称" align="center">
        <template slot-scope="scope">{{scope.row.name}}</template>
      </el-table-column>
      <el-table-column label="参数编码" align="center">
        <template slot-scope="scope">{{scope.row.code}}</template>
      </el-table-column>
      <el-table-column label="显示状态" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.status === 1">显示</span>
          <span v-else>隐藏</span>
        </template>
      </el-table-column>
      <el-table-column label="最后更新人" align="center">
        <template slot-scope="scope">{{scope.row.updaterman}}</template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button size="mini" type="text" @click="handleView(scope.row)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="编辑信息" :visible.sync="dialogVisible" width="700">
      <el-form :model="form" ref="form" label-width="120px" size="small" v-loading="dialogLoading">
        <el-form-item label="参数名称：" prop="name" required>
          <el-input v-model="form.name" clearable></el-input>
        </el-form-item>
        <el-form-item label="参数编码：" required>
          <el-input v-model="form.code" clearable disabled></el-input>
        </el-form-item>
        <el-form-item label="内容详情：" required>
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
    updateParams,
    getInfo
  } from '@/api/system/params';
  import Tinymce from '@/components/Tinymce'
  const defaultAdmin = {
    id: null,
    name: '',
    code: '',
    content: ''
  };
  export default {
    name: 'adminList',
    components: {
      Tinymce
    },
    data() {
      return {
        list: null,
        listLoading: false,
        dialogLoading: false,
        dialogVisible: false,
        dialogDetailVisible: false,
        form: Object.assign({}, defaultAdmin),
        detailHtml: ''
      }
    },
    created() {
      this.getList();
    },
    methods: {
      // 查询列表信息
      getList() {
        this.listLoading = true;
        fetchList(this.listQuery).then(response => {
          this.listLoading = false;
          this.list = response.data;
        });
      },
      handleUpdate(row) {
        this.dialogVisible = true;
        this.form.content = ''
        this.form = Object.assign({}, row);
      },
      handleDialogConfirm() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.dialogLoading = true
            updateParams(this.form,this.form.id).then(response => {
              this.$message({
                message: '修改成功！',
                type: 'success'
              });
              this.dialogVisible = false;
              this.dialogLoading = false;
              this.getList();
            })
          }
        })
      },
      // 查看公告详情在手机上的展示情况
      handleView(row) {
        getInfo(row.id).then(response => {
          this.detailHtml = response.data.content
          this.dialogDetailVisible = true
        });
      },
    }
  }
</script>
<style lang="scss" scoped>
  .btn-add{
    margin-bottom: 20px;
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

  .detail-phone {
    width: 375px;
    height: 667px;
    border: 1px solid #d9d9d9;
    box-sizing: border-box;
    padding: 20px;
  }
</style>
