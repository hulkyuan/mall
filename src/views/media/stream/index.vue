<template>
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>在线视频流</span>
      <el-button size="mini" type="primary" class="btn-add" @click="getList()" style="margin-left: 20px">刷新</el-button>
      <el-button size="mini" type="primary" class="btn-add" @click="handleAdd()" style="margin-left: 20px">添加</el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="adminTable" :data="list" style="width: 100%;" v-loading="listLoading" border>
        <el-table-column label="ID" width="50" align="center">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="视频流名称" align="center">
          <template slot-scope="scope">{{ scope.row.name }}</template>
        </el-table-column>
        <el-table-column label="视频流来源" align="center">
          <template slot-scope="scope">{{ scope.row.cameraId }}</template>
        </el-table-column>
        <el-table-column label="在线人数" width="100" align="center">
          <template slot-scope="scope">{{ scope.row.users }}</template>
        </el-table-column>
        <el-table-column label="入口宽带" width="100" align="center">
          <template slot-scope="scope">{{ scope.row.netWidth }}</template>
        </el-table-column>
        <el-table-column label="视频信息" width="160" align="center">
          <template slot-scope="scope">{{ scope.row.video }}</template>
        </el-table-column>
        <el-table-column label="音频信息" width="160" align="center">
          <template slot-scope="scope">{{ scope.row.audio }}</template>
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
    <el-dialog :title="isEdit ? '编辑视频流' : '添加视频流'" :visible.sync="dialogVisible" width="40%">
      <el-form :model="algorithm" ref="adminForm" label-width="150px" size="small">
        <el-form-item label="视频流名称:">
          <el-input v-model="algorithm.name" style="width: 250px" clearable></el-input>
        </el-form-item>
        <el-form-item label="视频流来源:">
          <el-select v-model="algorithm.cameraId" placeholder="请选择">
            <el-option v-for="item in cameraList" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="在线人数:">
          <el-input v-model="algorithm.users" style="width: 250px" clearable></el-input>
        </el-form-item>
        <el-form-item label="入口宽带:">
          <el-input v-model="algorithm.netWidth" style="width: 250px" clearable></el-input>
        </el-form-item>
        <el-form-item label="视频信息:">
          <el-input v-model="algorithm.video" style="width: 250px" clearable></el-input>
        </el-form-item>
        <el-form-item label="音频信息:">
          <el-input v-model="algorithm.audio" style="width: 250px" clearable></el-input>
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
  cameraList
} from '@/api/stream';
import {
  formatDate
} from '@/utils/date';
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
  name: 'stream',
  data() {
    return {
      myAudio: null,
      listQuery: Object.assign({}, defaultListQuery),
      list: null,
      cameraList: [],
      total: null,
      listLoading: false,
      dialogVisible: false,
      algorithm: Object.assign({}, defaultAdmin),
      isEdit: false,
      allocDialogVisible: false,
      source: null,
      host: 'http://111.229.115.233:8086'
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
      cameraList().then(response => {
        this.cameraList = response.data;
      })
    },
    handleDelete(index, row) {
      this.$confirm('是否要删除该视频流?', '提示', {
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
    handleStopAndPlay(index, row) {
      this.source = this.host + row.urls;
      this.$refs.myAudio.play()
    },
    handleUpdate(index, row) {
      this.dialogVisible = true;
      cameraList().then(response => {
        this.cameraList = response.data;
      })
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
  