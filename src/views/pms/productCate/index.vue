<template>
  <div class="app-container">
    <!-- 返回上一级 -->
    <el-button type="primary" plain size="medium" icon="el-icon-back" @click="handleGoBack" v-if="btnShow">返回上一页</el-button>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets" style="margin-top: 5px"></i>
      <span style="margin-top: 5px">数据列表</span>
      <el-button type="primary" class="btn-add" @click="handleAddProductCate()" size="mini">
        添加
      </el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="productCateTable" style="width: 100%" :data="list" v-loading="listLoading" border>
        <el-table-column label="编号" width="100" align="center">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column label="分类名称" align="center">
          <template slot-scope="scope">{{scope.row.name}}</template>
        </el-table-column>
        <el-table-column label="级别" width="100" align="center">
          <template slot-scope="scope">{{scope.row.level | levelFilter}}</template>
        </el-table-column>
        <el-table-column label="商品数量" width="100" align="center">
          <template slot-scope="scope">{{scope.row.productCount }}</template>
        </el-table-column>
        <el-table-column label="数量单位" width="100" align="center">
          <template slot-scope="scope">{{scope.row.productUnit }}</template>
        </el-table-column>
        <el-table-column label="首页推荐" width="100" align="center" v-if="parentId">
          <template slot-scope="scope">
            <el-switch @change="handleRecommandChange(scope.$index, scope.row)" :active-value="1" :inactive-value="0" v-model="scope.row.recommandStatus">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="导航栏" width="100" align="center">
          <template slot-scope="scope">
            <el-switch @change="handleNavStatusChange(scope.$index, scope.row)" :active-value="1" :inactive-value="0" v-model="scope.row.navStatus">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="是否显示" width="100" align="center">
          <template slot-scope="scope">
            <el-switch @change="handleShowStatusChange(scope.$index, scope.row)" :active-value="1" :inactive-value="0" v-model="scope.row.showStatus">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="排序" width="100" align="center">
          <template slot-scope="scope">{{scope.row.sort }}</template>
        </el-table-column>
        <el-table-column label="设置" width="200" align="center">
          <template slot-scope="scope">
            <el-button size="mini" :disabled="scope.row.level | disableNextLevel" @click="handleShowNextLevel(scope.$index, scope.row)">查看下级
            </el-button>
            <!-- <el-button size="mini" @click="handleTransferProduct(scope.$index, scope.row)">转移商品
            </el-button> -->
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleUpdate(scope.$index, scope.row)">编辑
            </el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" layout="total, sizes,prev, pager, next,jumper" :page-size="listQuery.pageSize" :page-sizes="[10,20,50,100]" :current-page.sync="listQuery.pageNum" :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import {
    fetchList,
    deleteProductCate,
    updateShowStatus,
    updateNavStatus,
    updateRecommanStatus
  } from '@/api/productCate'

  export default {
    name: "productCateList",
    data() {
      return {
        list: null,
        total: null,
        listLoading: true,
        listQuery: {
          pageNum: 1,
          pageSize: 10
        },
        parentId: 0,
        btnShow: false
      }
    },
    created() {
      this.resetParentId();
      this.getList();
    },
    watch: {
      $route(route) {
        this.resetParentId();
        this.getList();
      }
    },
    methods: {
      resetParentId() {
        this.listQuery.pageNum = 1;
        if (this.$route.query.parentId != null) {
          this.parentId = this.$route.query.parentId;
          this.btnShow = true
        } else {
          this.parentId = 0;
          this.btnShow = false
        }
      },
      handleGoBack() {
        this.$router.go(-1)
      },
      handleAddProductCate() {
        let level = 0;
        if (this.$route.query.parentId != null) {
          level = 1;
        } else {
          level = 0;
        }
        this.$router.push({
          path: '/pms/addProductCate',
          query: {
            level: level
          }
        })
      },
      getList() {
        this.listLoading = true;
        fetchList(this.parentId, this.listQuery).then(response => {
          this.listLoading = false;
          this.list = response.data.list;
          this.total = response.data.total;
        });
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
      handleRecommandChange(index, row) {

        let data = new URLSearchParams();
        let ids = [];
        ids.push(row.id)
        data.append('ids', ids);
        data.append('recommandStatus', row.recommandStatus);
        updateRecommanStatus(data).then(response => {
          this.$message({
            message: '修改成功',
            type: 'success',
            duration: 1000
          });
        });
      },
      handleNavStatusChange(index, row) {
        let data = new URLSearchParams();
        let ids = [];
        ids.push(row.id)
        data.append('ids', ids);
        data.append('navStatus', row.navStatus);
        updateNavStatus(data).then(response => {
          this.$message({
            message: '修改成功',
            type: 'success',
            duration: 1000
          });
        });
      },
      handleShowStatusChange(index, row) {
        let data = new URLSearchParams();
        let ids = [];
        ids.push(row.id)
        data.append('ids', ids);
        data.append('showStatus', row.showStatus);
        updateShowStatus(data).then(response => {
          this.$message({
            message: '修改成功',
            type: 'success',
            duration: 1000
          });
        });
      },
      handleShowNextLevel(index, row) {
        this.$router.push({
          path: '/pms/productCate',
          query: {
            parentId: row.id
          }
        })
      },
      handleTransferProduct(index, row) {
        console.log('handleAddProductCate');
      },
      handleUpdate(index, row) {
        this.$router.push({
          path: '/pms/updateProductCate',
          query: {
            id: row.id,
            level: row.level
          }
        });
      },
      handleDelete(index, row) {
        this.$confirm('是否要删除该品牌', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteProductCate(row.id).then(response => {
            this.$message({
              message: '删除成功',
              type: 'success',
              duration: 1000
            });
            this.getList();
          });
        });
      }
    },
    filters: {
      levelFilter(value) {
        if (value === 0) {
          return '一级';
        } else if (value === 1) {
          return '二级';
        }
      },
      disableNextLevel(value) {
        if (value === 0) {
          return false;
        } else {
          return true;
        }
      }
    }
  }
</script>

<style scoped>

</style>
