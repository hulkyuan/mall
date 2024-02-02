<template>
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>报警视频管理</span>
      <el-button size="mini" type="primary" class="btn-add" @click="getList()" style="margin-left: 20px">刷新</el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="adminTable" :data="list" style="width: 100%;" v-loading="listLoading" border>
        <el-table-column label="ID" width="100" align="center">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="视频" align="center">
          <template slot-scope="scope">
            <img :src='scope.row.imageUrl' height="100"/>
          </template>
        </el-table-column>
        <el-table-column label="视频描述" align="center">
          <template slot-scope="scope">{{ scope.row.desc }}</template>
        </el-table-column>
        <el-table-column label="更新时间" width="160" align="center">
          <template slot-scope="scope">{{ scope.row.create_time | formatDateTime }}</template>
        </el-table-column>
        <el-table-column label="操作" width="150" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="handleStopAndPlay(scope.$index, scope.row)">
              播放
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
    <el-dialog :title="'视频'" :visible.sync="dialogVideoVisible" width="50%" @closed="onDialogClose">
      <video id="videoElement" ref="myAudio" controls :src="source" width="100%"></video>
      <button id="play" type="button" @click="playVideo()" class="btn btn-default btn-sm"><i class="fa fa-play"></i> 播放视频 </button>
      <button id="stop" type="button" @click="stopVideo()" class="btn btn-default btn-sm"><i class="fa fa-stop"></i> 停止播放 </button>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVideoVisible = false" size="small">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  fetchList,
} from '@/api/alermList';
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
  name: 'adminList',
  data() {
    return {
      myAudio:null,
      listQuery: Object.assign({}, defaultListQuery),
      list: null,
      total: null,
      listLoading: false,
      dialogVideoVisible: false,
      flvPlayer:null,
      algorithm: Object.assign({}, defaultAdmin),
      isEdit: false,
      allocDialogVisible: false,
      source:null,
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
    onDialogClose() {
      if (!this.$refs.myAudio.paused) {
        this.$refs.myAudio.pause();
        this.source = ''
      }

    },
    stopVideo(){
      if (typeof this.flvPlayer === "undefined" || this.flvPlayer === null) {
            myAlert("播放器暂未启动！","error");
            return;
        }
        this.flvPlayer.pause();
        this.flvPlayer.unload();
        this.flvPlayer.detachMediaElement();
        this.flvPlayer.destroy();
        this.flvPlayer = null;
    },
    playVideo(){
      const row=this.algorithm;
      if (flvjs.isSupported()) {
        var videoElement = document.getElementById('videoElement');
        this.flvPlayer = flvjs.createPlayer({
          type: 'flv',
          url: row.videoUrl,
          enableStashBuffer: true,
          isLive: true,
          withCredentials: false,
          hasAudio: true,
          hasVideo: true,
        }, {
          enableWorker: false,
          lazyLoadMaxDuration: 3 * 60,
          seekType: 'range',
        });
        this.flvPlayer.attachMediaElement(videoElement);
        this.flvPlayer.load();
        this.flvPlayer.play();
      }
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
    handleDelete(index, row) {
      this.$confirm('是否要删除该视频?', '提示', {
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
      this.dialogVideoVisible = true;
      
      this.algorithm = Object.assign({}, row);
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
  