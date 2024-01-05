<template>
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>摄像头管理</span>
      <audio ref="myAudio" autoplay controls :src="source"></audio>
      <el-button size="mini" type="primary" class="btn-add" @click="setAllActive()"
        style="margin-left: 20px">全部转发</el-button>
      <file-upload class="btn-add" @mediaChange="onMediaChange"
        style="margin-left: 20px"></file-upload>
      <el-button size="mini" type="primary" class="btn-add" @click="getList()" style="margin-left: 20px">刷新</el-button>
      <el-button size="mini" type="primary" class="btn-add" @click="handleAdd()" style="margin-left: 20px">添加</el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="adminTable" :data="list" style="width: 100%;" v-loading="listLoading" border>
        <!-- <el-table-column label="ID" width="100" align="center">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column> -->
        <el-table-column label="摄像头编号" width="120" align="center">
          <template slot-scope="scope">{{ scope.row.code }}</template>
        </el-table-column>
        <el-table-column label="摄像头视频流地址" align="center">
          <template slot-scope="scope">{{ scope.row.urls }}</template>
        </el-table-column>
        <el-table-column label="摄像头名称" width="120" align="center">
          <template slot-scope="scope">{{ scope.row.name }}</template>
        </el-table-column>
        <el-table-column label="转发状态" width="120" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.activeStatus == 0">未转发</span>
            <span v-else-if="scope.row.activeStatus == 1">转发中</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="handleStatus(scope.$index, scope.row)">
              <span v-if="scope.row.activeStatus == 0">开启</span>
              <span v-if="scope.row.activeStatus == 1">停止</span>
            </el-button>
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
    <el-dialog :title="isEdit ? '编辑摄像头' : '添加摄像头'" :visible.sync="dialogVisible" width="50%">
      <el-form :model="algorithm" ref="adminForm" label-width="180px" size="small">
        <el-form-item label="系统生成编号:">
          <el-input v-model="algorithm.code" style="width: 100%" clearable></el-input>
        </el-form-item>
        <el-form-item label="ws-fmp4:">
          <el-input v-model="algorithm.fmp4" style="width: 100%" clearable></el-input>
        </el-form-item>
        <el-form-item label="rtsp:">
          <el-input v-model="algorithm.rtsp" style="width: 100%" clearable></el-input>
        </el-form-item>
        <el-form-item label="flv:">
          <el-input v-model="algorithm.flv" style="width: 100%" clearable></el-input>
        </el-form-item>
        <el-form-item label="hls:">
          <el-input v-model="algorithm.hls" style="width:100%" clearable></el-input>
        </el-form-item>
        <el-form-item label="摄像头视频流地址(rtsp):">
          <el-input v-model="algorithm.urls" style="width: 100%" clearable></el-input>
        </el-form-item>
        <el-form-item label="摄像头名称:">
          <el-input v-model="algorithm.name" style="width: 100%" clearable></el-input>
        </el-form-item>
        <el-form-item label="备注:">
          <el-input v-model="algorithm.description" type="textarea" :rows="2" style="width: 100%" clearable></el-input>
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
  setAllActiveAction,
  setActiveAction,
  batchAdd
} from '@/api/camera';
import FileUpload from '@/components/Upload/fileUpload'
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
    FileUpload,
  },
  data() {
    return {
      myAudio: null,
      listQuery: Object.assign({}, defaultListQuery),
      list: null,
      total: null,
      listLoading: false,
      dialogVisible: false,
      algorithm: Object.assign({}, defaultAdmin),
      isEdit: false,
      allocDialogVisible: false,
      source: '',
      options: [{
        value: 0,
        label: '未转发'
      }, {
        value: 1,
        label: '转发中'
      }],
    }
  },
  created() {
    this.getList();
  },

  methods: {
    onMediaChange(msg) {
      if (msg == 'success') {
        this.getList();
      }
    },
    setAllActive() {
      setAllActiveAction(1).then(response => {
        this.$message({
          type: 'success',
          message: '操作成功!'
        });
        this.getList();
      })
    },
    handleStatus(index, row) {
      let status;
      if (row.activeStatus == 1) {
        status = 0
      } else {
        status = 1;
      }
      setActiveAction(row.id, status).then(response => {
        this.$message({
          type: 'success',
          message: '操作成功!'
        });
        this.getList();
      })
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
    handleBatchAdd() {

    },
    handleDelete(index, row) {
      this.$confirm('是否要删除该摄像头?', '提示', {
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
  