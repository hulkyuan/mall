<template>
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>音频管理</span>
      <audio ref="myAudio" autoplay controls :src="source"></audio>
      <el-button size="mini" type="primary" class="btn-add" @click="getList()" style="margin-left: 20px">刷新</el-button>
      <el-button size="mini" type="primary" class="btn-add" @click="handleAdd()" style="margin-left: 20px">添加</el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="adminTable" :data="list" style="width: 100%;" v-loading="listLoading" border>
        <el-table-column label="ID" width="100" align="center">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="音频编号" align="center">
          <template slot-scope="scope">{{ scope.row.code }}</template>
        </el-table-column>
        <el-table-column label="音频名称" align="center">
          <template slot-scope="scope">{{ scope.row.name }}</template>
        </el-table-column>
        <el-table-column label="更新时间" width="160" align="center">
          <template slot-scope="scope">{{ scope.row.updateTime | formatDateTime }}</template>
        </el-table-column>
        <el-table-column label="操作" width="150" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="handleStopAndPlay(scope.$index, scope.row)">
              播放
            </el-button>
            <el-button size="mini" type="text" @click="handleUpdate(scope.$index, scope.row)">
              编辑
            </el-button>
            <el-button size="mini" type="text" @click="handleDelete(scope.$index, scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper" :current-page.sync="listQuery.pageNum"
        :page-size="listQuery.pageSize" :page-sizes="[10, 15, 20]" :total="total">
      </el-pagination>
    </div>
    <el-dialog :title="isEdit ? '编辑音频' : '添加音频'" :visible.sync="dialogVisible" width="40%">
      <el-form :model="algorithm" ref="adminForm" label-width="150px" size="small">
        <el-form-item label="音频编号:">
          <el-input v-model="algorithm.code" style="width: 250px" clearable></el-input>
        </el-form-item>
        <el-form-item label="音频名称:">
          <el-input v-model="algorithm.name" style="width: 250px" clearable></el-input>
        </el-form-item>
        <el-form-item label="音频文件:">
          <media-upload @mediaChange="onMediaChange" v-model="algorithm.fileList"
            style="width: 300px;display: inline-block;margin-left: 10px"></media-upload>
        </el-form-item>
        <el-form-item label="文件路径:">
          <el-input :disabled="true" v-model="algorithm.urls" style="width: 250px" clearable></el-input>
        </el-form-item>
        <el-form-item label="备注:">
          <el-input v-model="algorithm.description" type="textarea" :rows="5" style="width: 250px" clearable></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleDialogConfirm()" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  fetchList,
  create,
  updateAction,
  deleteAction,
} from '@/api/audio';
import {
  formatDate
} from '@/utils/date';
import MediaUpload from '@/components/Upload/mediaUpload'
const defaultListQuery = {
  pageNum: 1,
  pageSize: 10,
  keyword: null
};
const defaultAdmin = {
  id: null,
  code: null,
  createTime: null,
  description: null,
  name: null,
  updateTime: null,
  urls: null
};
export default {
  name: 'adminList',
  components: {
    MediaUpload,
  },
  data() {
    return {
      myAudio:null,
      listQuery: Object.assign({}, defaultListQuery),
      list: null,
      total: null,
      listLoading: false,
      dialogVisible: false,
      algorithm: Object.assign({}, defaultAdmin),
      isEdit: false,
      allocDialogVisible: false,
      source:null,
      host:'http://111.229.115.233:8086'
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
      return formatDate(date, 'yyyy-MM-dd hh:mm')
    }
  },
  methods: {
    onMediaChange(file) {
     
      this.algorithm.urls = file.url;
     
      // this.algorithm.name = file.name;
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
      this.algorithm = Object.assign({}, defaultAdmin);
    },
    handleDelete(index, row) {
      this.$confirm('是否要删除该音频?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteAction(row.id).then(response => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.getList();
        });
      });
    },
    handleStopAndPlay(index,row){
      this.source=this.host+row.urls;
      this.$refs.myAudio.play()
    },
    handleUpdate(index, row) {
      this.dialogVisible = true;
      this.isEdit = true;
      this.algorithm = Object.assign({}, row);
    },
    handleDialogConfirm() {
      this.$confirm('是否要确认?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (this.isEdit) {
          updateAction(this.algorithm.id, this.algorithm).then(response => {
            this.$message({
              message: '修改成功！',
              type: 'success'
            });
            this.dialogVisible = false;
            this.getList();
          })
        } else {
          create(this.algorithm).then(response => {
            this.$message({
              message: '添加成功！',
              type: 'success'
            });
            this.dialogVisible = false;
            this.getList();
          })
        }
      })
    },
    getList() {
      this.listLoading = true;
      fetchList(this.listQuery).then(response => {
        this.listLoading = false;
        this.list = response.data.list;
        this.total = response.data.total;
      });
    },
  }
}
</script>
<style></style>
  