<template> 
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div style="padding-bottom: 15px;">
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button style="float:right" type="primary" @click="handleSearchList()" size="small">
          查询搜索
        </el-button>
        <el-button style="float:right;margin-right: 15px" @click="handleResetSearch()" size="small">
          重置
        </el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="120px">
          <el-form-item label="收货地址名称：">
            <el-input v-model="listQuery.keyword" class="input-width" placeholder="收货地址名称" clearable></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button  type="primary" class="btn-add" @click="handleAdd()" size="mini">添加</el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="returnApplyTable" :data="list" style="width: 100%;" v-loading="listLoading" border>
        <el-table-column label="ID" width="100" align="center">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column label="收货地址名称" width="180" align="center">
          <template slot-scope="scope">{{scope.row.addressName}}</template>
        </el-table-column>
        <el-table-column label="收货人" width="180" align="center">
          <template slot-scope="scope">{{scope.row.name}}</template>
        </el-table-column>
        <el-table-column label="收货电话" width="180" align="center">
          <template slot-scope="scope">{{scope.row.phone}}</template>
        </el-table-column>
        <el-table-column label="收货地址" min-width="180" header-align="center">
          <template slot-scope="scope">{{scope.row | formatAdress}}</template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" layout="total, sizes,prev, pager, next,jumper" :current-page.sync="listQuery.pageNum" :page-size="listQuery.pageSize" :page-sizes="[10,20,50,100]" :total="total">
      </el-pagination>
    </div>
    <el-dialog :title="isEdit?'编辑':'添加'" :visible.sync="receiverDialogVisible" width="800px">
      <el-form :model="receiverInfo" ref="receiverInfoForm" label-width="150px">
        <el-form-item label="收货地址名称：" required>
          <el-input v-model="receiverInfo.addressName" clearable></el-input>
        </el-form-item>
        <el-form-item label="收货人：">
          <el-input v-model="receiverInfo.name" clearable></el-input>
        </el-form-item>
        <el-form-item label="手机号码：">
          <el-input v-model="receiverInfo.phone" clearable>
          </el-input>
        </el-form-item>
        <el-form-item label="所在区域：">
          <v-distpicker :province="receiverInfo.province" :city="receiverInfo.city" :area="receiverInfo.region" @selected="onSelectRegion"></v-distpicker>
        </el-form-item>
        <el-form-item label="详细地址：">
          <el-input v-model="receiverInfo.detailAddress" type="textarea" rows="3">
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="receiverDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import {
    formatDate
  } from '@/utils/date';
  import {
    fetchList,
    deleteList,
    updateList,
    createList
  } from '@/api/returnAdress';
  import VDistpicker from 'v-distpicker';
  const defaultListQuery = {
    pageNum: 1,
    pageSize: 10,
    keyword: null,
  };
  const defaultForm = {
    addressName: "",
    name: "",
    phone: "",
    province: "",
    city: "",
    region: "",
    detailAddress: "",
    status: 1
  };
  export default {
    name: 'returnApplyList',
    components: {
      VDistpicker
    },
    data() {
      return {
        listQuery: Object.assign({}, defaultListQuery),
        receiverInfo: Object.assign({}, defaultForm),
        receiverDialogVisible: false,
        isEdit: false,
        list: null,
        total: null,
        listLoading: false,
        multipleSelection: [],
        operateType: 1,
        operateOptions: [{
          label: "批量删除",
          value: 1
        }],
      }
    },
    created() {
      this.getList();
    },
    filters: {
      formatTime(time) {
        if (time == null || time === '') {
          return '--';
        }
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
      },
      formatAdress(row) {
        return row.province + ' ' + (row.city ? row.city : '') + ' ' + row.region + ' ' + row.detailAddress
      },
    },
    methods: {
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      handleResetSearch() {
        this.listQuery = Object.assign({}, defaultListQuery);
      },
      handleSearchList() {
        this.listQuery.pageNum = 1;
        this.getList();
      },
      handleBatchOperate() {
        if (this.multipleSelection == null || this.multipleSelection.length < 1) {
          this.$message({
            message: '请选择要操作的申请',
            type: 'warning',
            duration: 1000
          });
          return;
        }
        if (this.operateType === 1) {
          //批量删除
          this.$confirm('是否要进行删除操作?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let params = new URLSearchParams();
            let ids = [];
            for (let i = 0; i < this.multipleSelection.length; i++) {
              ids.push(this.multipleSelection[i].id);
            }
            params.append("ids", ids);
            deleteApply(params).then(response => {
              this.getList();
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
            });
          })
        }
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
      getList() {
        this.listLoading = true;
        fetchList(this.listQuery).then(response => {
          this.listLoading = false;
          this.list = response.data.list;
          this.total = response.data.total;
        });
      },
      handleAdd() {
        this.receiverDialogVisible = true;
        this.isEdit = false;
        this.receiverInfo = Object.assign({}, defaultForm);
      },
      handleUpdate(row) {
        this.receiverDialogVisible = true;
        this.isEdit = true;
        this.receiverInfo = Object.assign({}, row);
      },
      handleDelete(row) {
        this.$confirm('是否要删除该活动?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteList(row.id).then(response => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.getList();
          });
        });
      },
      handleConfirm() {
        if (!receiverInfo.addressName) {
          this.$message({
            message: '请输入收货地址名称！',
            type: 'success'
          });
          return
        }
        if (this.isEdit) {
          updateList(this.receiverInfo.id, this.receiverInfo).then(response => {
            this.$message({
              message: '修改成功！',
              type: 'success'
            });
            this.receiverDialogVisible = false;
            this.getList();
          })
        } else {
          createList(this.receiverInfo).then(response => {
            this.$message({
              message: '添加成功！',
              type: 'success'
            });
            this.receiverDialogVisible = false;
            this.getList();
          })
        }
      },
      onSelectRegion(data) {
        this.receiverInfo.province = data.province.value;
        this.receiverInfo.city = data.city.value;
        this.receiverInfo.region = data.area.value;
      },

    }
  }
</script>
<style scoped>
  .input-width {
    width: 203px;
  }
</style>