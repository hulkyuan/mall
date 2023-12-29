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
        <el-form-item label="用户昵称：">
          <el-input v-model="listQuery.nickname" placeholder="请输入用户昵称" clearable></el-input>
        </el-form-item>
        <el-form-item label="用户手机号：">
          <el-input v-model="listQuery.phone" placeholder="请输入用户手机号" clearable></el-input>
        </el-form-item>
        <el-form-item label="启用状态：">
          <el-select v-model="listQuery.status" placeholder="请选择状态" clearable>
            <el-option label="启用" :value="1"></el-option>
            <el-option label="禁用" :value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-card>
    <el-table ref="adminTable" :data="list" style="width: 100%; margin-top: 20px;" v-loading="listLoading" border>
      <el-table-column label="ID" width="60" align="center">
        <template slot-scope="scope">{{scope.row.id}}</template>
      </el-table-column>
      <el-table-column label="用户登录名" align="center">
        <template slot-scope="scope">{{scope.row.username}}</template>
      </el-table-column>
      <el-table-column label="用户昵称" align="center">
        <template slot-scope="scope">{{scope.row.nickname}}</template>
      </el-table-column>
      <el-table-column label="手机号码" align="center">
        <template slot-scope="scope">{{scope.row.phone}}</template>
      </el-table-column>
      <el-table-column label="性别" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.gender === 1">男</span>
          <span v-else-if="scope.row.gender === 2">女</span>
          <span v-else>未知</span>
        </template>
      </el-table-column>
      <el-table-column label="所在城市" align="center">
        <template slot-scope="scope">{{scope.row.city}}</template>
      </el-table-column>
      <el-table-column label="成长值" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="handleView(scope.row,'growth')">{{scope.row.growth}}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="积分" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="handleView(scope.row,'integration')">{{scope.row.integration}}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.status === 1">启用</span>
          <span v-else>禁用</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="handleUpdate(scope.$index, scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" layout="total,sizes,prev,pager,next,jumper" :current-page.sync="listQuery.pageNum" :page-size="listQuery.pageSize" :page-sizes="[10,15,20]" :total="total"></el-pagination>
    </div>
    <el-dialog title="编辑" :visible.sync="dialogVisible" width="700">
      <el-form :model="form" ref="form" label-width="120px" size="small" v-loading="dialogLoading">
        <el-form-item label="用户昵称：" prop="name">
          <el-input v-model="form.nickname" clearable></el-input>
        </el-form-item>
        <el-form-item label="手机号：" prop="note">
          <el-input v-model="form.phone" clearable></el-input>
        </el-form-item>
        <el-form-item label="积分：" prop="note">
          <el-input-number v-model="form.integration" :min="0" clearable></el-input-number>
        </el-form-item>
        <el-form-item label="成长值：" prop="note">
          <el-input-number v-model="form.growth" :min="0" clearable></el-input-number>
        </el-form-item>
        <el-form-item label="是否启用:">
          <el-radio-group v-model="form.status">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" :loading="dialogLoading" @click="handleDialogConfirm" size="small">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="查看明细" :visible.sync="dialogDetailVisible" width="700">
      <el-table :data="infoList" style="width: 100%" v-loading="infoLoading" border v-if="flag==='growth'">
        <el-table-column label="ID" width="60" align="center">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column label="成长值来源" align="center">
          <template slot-scope="scope">{{scope.row.source}}</template>
        </el-table-column>
        <el-table-column label="成长值变化" align="center">
          <template slot-scope="scope">{{scope.row.growth}}</template>
        </el-table-column>
        <el-table-column label="总成长值" align="center">
          <template slot-scope="scope">{{scope.row.totalGrowth}}</template>
        </el-table-column>
        <el-table-column label="时间" align="center">
          <template slot-scope="scope">{{scope.row.createTime | formatDateTime}}</template>
        </el-table-column>
      </el-table>
      <el-table :data="infoList" style="width: 100%" v-loading="infoLoading" border v-else>
        <el-table-column label="ID" width="60" align="center">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column label="积分来源" align="center">
          <template slot-scope="scope">{{scope.row.source}}</template>
        </el-table-column>
        <el-table-column label="积分变化" align="center">
          <template slot-scope="scope">{{scope.row.integration>0?'+'+scope.row.integration:scope.row.integration}}</template>
        </el-table-column>
        <el-table-column label="可用积分" align="center">
          <template slot-scope="scope">{{scope.row.totalIntegration}}</template>
        </el-table-column>
        <el-table-column label="时间" align="center">
          <template slot-scope="scope">{{scope.row.createTime | formatDateTime}}</template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogDetailVisible = false" size="small">取 消</el-button>
      </span>
    </el-dialog>

  </div>
</template>
<script>
  import {
    fetchList,
    updateList,
    getGrowthList,
    getIntegrationList
  } from '@/api/user/userList';
  import {
    formatDate
  } from '@/utils/date';
  const defaultAdmin = {
    memberId: null,
    nickname: '',
    phone: '',
    integration: 0,
    growth: 0,
    status: 1
  };
  export default {
    name: 'adminList',
    data() {
      return {
        listQuery: {
          pageNum: 1,
          pageSize: 10,
          nickname: '',
          phone: '',
          status: null,
        },
        list: null,
        total: null,
        listLoading: false,
        dialogLoading: false,
        dialogVisible: false,
        dialogDetailVisible: false,
        form: Object.assign({}, defaultAdmin),
        infoList: [],
        infoLoading: false,
        flag: 'growth'
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
          nickname: '',
          phone: '',
          status: null,
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
      handleUpdate(index, row) {
        this.dialogVisible = true;
        this.form = Object.assign({}, {
          memberId: row.id,
          nickname: row.nickname,
          phone: row.phone,
          integration: row.integration ? row.integration : 0,
          growth: row.growth ? row.growth : 0,
          status: row.status,
        });
      },
      handleDialogConfirm() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.dialogLoading = true
            updateList(this.form).then(response => {
              this.$message({
                message: '修改成功！',
                type: 'success'
              });
              this.dialogVisible = false;
              this.dialogLoading = false;
              this.getList();
            }).catch(() => {
              this.dialogLoading = false;
            })
          }
        })
      },
      // 查看公告详情在手机上的展示情况
      handleView(row, flag) {
        this.flag = flag
        this.dialogDetailVisible = true
        this.infoLoading = true;
        if (flag === 'growth') {
          getGrowthList(row.id).then(response => {
            this.infoLoading = false;
            this.infoList = response.data
          });
        } else {
          getIntegrationList(row.id).then(response => {
            this.infoLoading = false;
            this.infoList = response.data
          });
        }

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

  // /deep/ .el-dialog__body {
  //   max-height: 75vh;
  //   overflow-y: scroll;
  //   padding: 16px 20px;
  // }

  // /deep/ .el-dialog__footer {
  //   border-top: 1px solid #dcdfe6;
  // }

  // /deep/ .el-dialog__header {
  //   border-bottom: 1px solid #dcdfe6;
  // }
</style>
