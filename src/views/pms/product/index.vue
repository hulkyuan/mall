<template> 
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button style="float: right" @click="handleSearchList()" type="primary" size="small">
          查询结果
        </el-button>
        <el-button style="float: right;margin-right: 15px" @click="handleResetSearch()" size="small">
          重置
        </el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="输入搜索：">
            <el-input style="width: 203px" v-model="listQuery.keyword" placeholder="商品名称" clearable></el-input>
          </el-form-item>
          <el-form-item label="商品货号：">
            <el-input style="width: 203px" v-model="listQuery.productSn" placeholder="商品货号" clearable></el-input>
          </el-form-item>
          <el-form-item label="商品分类：">
            <el-cascader clearable v-model="selectProductCateValue" :options="productCateOptions">
            </el-cascader>
          </el-form-item>
          <el-form-item label="商品品牌：">
            <el-select v-model="listQuery.brandId" placeholder="请选择品牌" clearable>
              <el-option v-for="item in brandOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="上架状态：">
            <el-select v-model="listQuery.publishStatus" placeholder="全部" clearable>
              <el-option v-for="item in publishStatusOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="审核状态：">
            <el-select v-model="listQuery.verifyStatus" placeholder="全部" clearable>
              <el-option v-for="item in verifyStatusOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button type="primary" class="btn-add" @click="handleAddProduct()" size="mini">
        添加
      </el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="productTable" :data="list" style="width: 100%" @selection-change="handleSelectionChange" v-loading="listLoading" border>
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column label="编号" width="100" align="center">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column label="商品图片" width="120" align="center">
          <template slot-scope="scope"><img style="height: 80px" :src="scope.row.pic"></template>
        </el-table-column>
        <el-table-column label="商品名称" align="center">
          <template slot-scope="scope">
            <p>{{scope.row.name}}</p>
            <p>品牌：{{scope.row.brandName}}</p>
          </template>
        </el-table-column>
        <el-table-column label="价格/货号" width="120" align="center">
          <template slot-scope="scope">
            <p>价格：￥{{scope.row.price}}</p>
            <p>货号：{{scope.row.productSn}}</p>
          </template>
        </el-table-column>
        <el-table-column label="标签" width="140" align="center">
          <template slot-scope="scope">
            <p>上架：
              <el-switch @change="handlePublishStatusChange(scope.$index, scope.row)" :active-value="1" :inactive-value="0" v-model="scope.row.publishStatus">
              </el-switch>
            </p>
            <p>新品：
              <el-switch @change="handleNewStatusChange(scope.$index, scope.row)" :active-value="1" :inactive-value="0" v-model="scope.row.newStatus">
              </el-switch>
            </p>
            <p>推荐：
              <el-switch @change="handleRecommendStatusChange(scope.$index, scope.row)" :active-value="1" :inactive-value="0" v-model="scope.row.recommandStatus">
              </el-switch>
            </p>
          </template>
        </el-table-column>
        <el-table-column label="排序" width="100" align="center">
          <template slot-scope="scope">{{scope.row.sort}}</template>
        </el-table-column>
        <el-table-column label="SKU库存" width="100" align="center">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" @click="handleShowSkuEditDialog(scope.$index, scope.row)" circle></el-button>
          </template>
        </el-table-column>
        <el-table-column label="销量" width="100" align="center">
          <template slot-scope="scope">{{scope.row.sale}}</template>
        </el-table-column>
        <el-table-column label="审核状态" width="100" align="center">
          <template slot-scope="scope">
            <div>{{scope.row.verifyStatus | verifyStatusFilter}}</div>
            <div>
              <el-button v-if="scope.row.verifyStatus===0" type="text" @click="handleShowVerify(scope.row.id)">审核</el-button>
              <el-button v-else type="text" @click="handleShowVerifyDetail(scope.row.id)">审核详情</el-button>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160" align="center">
          <template slot-scope="scope">
            <p>
              <el-button size="mini" @click="handleShowProduct(scope.$index, scope.row)">查看
              </el-button>
              <el-button size="mini" @click="handleUpdateProduct(scope.$index, scope.row)">编辑
              </el-button>
            </p>
            <p>
              <el-button size="mini" @click="handleShowLog(scope.row.id)">日志
              </el-button>
              <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除
              </el-button>
            </p>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="batch-operate-container">
      <el-select size="small" v-model="operateType" placeholder="批量操作">
        <el-option v-for="item in operates" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <el-button style="margin-left: 20px" class="search-button" @click="handleBatchOperate()" type="primary" size="small">
        确定
      </el-button>
    </div>
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" layout="total, sizes,prev, pager, next,jumper" :page-size="listQuery.pageSize" :page-sizes="[5,10,15]" :current-page.sync="listQuery.pageNum" :total="total">
      </el-pagination>
    </div>
    <el-dialog title="编辑货品信息" :visible.sync="editSkuInfo.dialogVisible" width="60%">
      <span>商品货号：</span>
      <span>{{editSkuInfo.productSn}}</span>
      <el-input placeholder="按sku编号搜索" v-model="editSkuInfo.keyword" size="small" style="width: 50%;margin-left: 20px" clearable>
        <el-button slot="append" icon="el-icon-search" @click="handleSearchEditSku"></el-button>
      </el-input>
      <el-table style="width: 100%;margin-top: 20px" :data="editSkuInfo.stockList" border>
        <el-table-column label="SKU编号" align="center" width="180">
          <template slot-scope="scope">
            <el-input v-model="scope.row.skuCode" clearable></el-input>
          </template>
        </el-table-column>
        <el-table-column v-for="(item,index) in editSkuInfo.productAttr" :label="item.name" :key="item.id" align="center">
          <template slot-scope="scope">
            {{getProductSkuSp(scope.row,index)}}
          </template>
        </el-table-column>
        <el-table-column label="销售价格" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.price" clearable></el-input>
          </template>
        </el-table-column>
        <el-table-column label="商品库存" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.stock" clearable></el-input>
          </template>
        </el-table-column>
        <el-table-column label="库存预警值" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.lowStock" clearable></el-input>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editSkuInfo.dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleEditSkuConfirm">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 日志信息 -->
    <el-dialog title="日志" :visible.sync="logDialogVisible" width="70%">
      <el-table :data="logDialog.list" border>
        <el-table-column label="操作员名称" align="center" width="150">
          <template slot-scope="scope">{{scope.row.adminName}}</template>
        </el-table-column>
        <el-table-column label="客户端ip" align="center">
          <template slot-scope="scope">{{scope.row.ip}}</template>
        </el-table-column>
        <el-table-column label="操作内容" header-align="center">
          <template slot-scope="scope">{{scope.row.content}}</template>
        </el-table-column>
        <el-table-column label="操作类型" align="center">
          <template slot-scope="scope">{{formatType(scope.row.operatorType)}}</template>
        </el-table-column>
        <el-table-column label="操作时间" align="center">
          <template slot-scope="scope">{{scope.row.createTime}}</template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination background @current-change="handleDialogCurrentChange" layout="total,prev,pager,next" :current-page.sync="logDialog.pageNum" :total="logDialog.total">
        </el-pagination>
      </div>
      <div style="clear: both;"></div>
      <div slot="footer">
        <el-button size="small" @click="logDialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 审核 -->
    <el-dialog title="审核" :visible.sync="checkDialogVisible" width="700">
      <el-form :model="checkForm" label-width="120px">
        <el-form-item label="审批类型：">
          <el-radio-group v-model="checkForm.verifyStatus">
            <el-radio :label="1">通过</el-radio>
            <el-radio :label="2">拒绝</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="审批备注：">
          <el-input type="textarea" v-model="checkForm.detail"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button size="small" @click="checkDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleCheckConfirm">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 审核详情 -->
    <el-dialog title="审核详情" :visible.sync="dialogVerifyVisible" width="70%">
      <el-table :data="verifyDialog.list" border>
        <el-table-column label="操作员名称" align="center" width="150">
          <template slot-scope="scope">{{scope.row.adminName}}</template>
        </el-table-column>
        <el-table-column label="客户端ip" align="center">
          <template slot-scope="scope">{{scope.row.ip}}</template>
        </el-table-column>
        <el-table-column label="审核类型" align="center">
          <template slot-scope="scope">{{scope.row.operatorType===1?'审核通过':scope.row.operatorType===2?'审核拒绝':"--"}}</template>
        </el-table-column>
        <el-table-column label="操作内容" align="center">
          <template slot-scope="scope">{{scope.row.content}}</template>
        </el-table-column>
        <el-table-column label="操作时间" align="center">
          <template slot-scope="scope">{{scope.row.createTime}}</template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination background @current-change="handleVerifyDialogCurrentChange" layout="total,prev,pager,next" :current-page.sync="verifyDialog.pageNum" :total="verifyDialog.total">
        </el-pagination>
      </div>
      <div style="clear: both;"></div>
      <div slot="footer">
        <el-button size="small" @click="dialogVerifyVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import {
    fetchList,
    updateDeleteStatus,
    updateNewStatus,
    updateRecommendStatus,
    updatePublishStatus,
    getProductLog,
    getProductVerify,
    updateProductVerify
  } from '@/api/product'
  import {
    fetchList as fetchSkuStockList,
    update as updateSkuStockList
  } from '@/api/skuStock'
  import {
    fetchList as fetchProductAttrList
  } from '@/api/productAttr'
  import {
    fetchList as fetchBrandList
  } from '@/api/brand'
  import {
    fetchListWithChildren
  } from '@/api/productCate'

  const defaultListQuery = {
    keyword: null,
    pageNum: 1,
    pageSize: 10,
    publishStatus: null,
    verifyStatus: null,
    productSn: null,
    productCategoryId: null,
    brandId: null
  };
  export default {
    name: "productList",
    data() {
      return {
        editSkuInfo: {
          dialogVisible: false,
          productId: null,
          productSn: '',
          productAttributeCategoryId: null,
          stockList: [],
          productAttr: [],
          keyword: null
        },
        operates: [{
            label: "商品上架",
            value: "publishOn"
          },
          {
            label: "商品下架",
            value: "publishOff"
          },
          {
            label: "设为推荐",
            value: "recommendOn"
          },
          {
            label: "取消推荐",
            value: "recommendOff"
          },
          {
            label: "设为新品",
            value: "newOn"
          },
          {
            label: "取消新品",
            value: "newOff"
          },
          {
            label: "转移到分类",
            value: "transferCategory"
          },
          {
            label: "移入回收站",
            value: "recycle"
          }
        ],
        operateType: null,
        listQuery: Object.assign({}, defaultListQuery),
        list: null,
        total: null,
        listLoading: true,
        selectProductCateValue: null,
        multipleSelection: [],
        productCateOptions: [],
        brandOptions: [],
        publishStatusOptions: [{
          value: 1,
          label: '上架'
        }, {
          value: 0,
          label: '下架'
        }],
        verifyStatusOptions: [{
          value: 0,
          label: '未审核'
        }, {
          value: 1,
          label: '审核通过'
        }, {
          value: 2,
          label: '审核拒绝'
        }],
        logDialogVisible: false,
        logDialog: {
          list: [],
          pageNum: 1,
          pageSize: 10,
          total: 0,
          id: null
        },
        dialogVerifyVisible: false,
        verifyDialog: {
          list: [],
          pageNum: 1,
          pageSize: 10,
          total: 0,
          id: null
        },
        checkDialogVisible: false,
        checkForm: {
          verifyStatus: 1,
          detail: ''
        }
      }
    },
    created() {
      this.getList();
      this.getBrandList();
      this.getProductCateList();
    },
    watch: {
      selectProductCateValue: function(newValue) {
        if (newValue != null && newValue.length == 2) {
          this.listQuery.productCategoryId = newValue[1];
        } else {
          this.listQuery.productCategoryId = null;
        }

      }
    },
    filters: {
      verifyStatusFilter(value) {
        if (value === 1) {
          return '审核通过';
        } else if (value === 2) {
          return '审核拒绝';
        } else {
          return '未审核';
        }
      }
    },
    methods: {
      getProductSkuSp(row, index) {
        let spData = JSON.parse(row.spData);
        if (spData != null && index < spData.length) {
          return spData[index].value;
        } else {
          return null;
        }
      },
      getList() {
        this.listLoading = true;
        fetchList(this.listQuery).then(response => {
          this.listLoading = false;
          this.list = response.data.list;
          this.total = response.data.total;
        });
      },
      getBrandList() {
        fetchBrandList({
          pageNum: 1,
          pageSize: 100
        }).then(response => {
          this.brandOptions = [];
          let brandList = response.data.list;
          for (let i = 0; i < brandList.length; i++) {
            this.brandOptions.push({
              label: brandList[i].name,
              value: brandList[i].id
            });
          }
        });
      },
      getProductCateList() {
        fetchListWithChildren().then(response => {
          let list = response.data;
          this.productCateOptions = [];
          for (let i = 0; i < list.length; i++) {
            let children = [];
            if (list[i].children != null && list[i].children.length > 0) {
              for (let j = 0; j < list[i].children.length; j++) {
                children.push({
                  label: list[i].children[j].name,
                  value: list[i].children[j].id
                });
              }
            }
            this.productCateOptions.push({
              label: list[i].name,
              value: list[i].id,
              children: children
            });
          }
        });
      },
      handleShowSkuEditDialog(index, row) {
        this.editSkuInfo.dialogVisible = true;
        this.editSkuInfo.productId = row.id;
        this.editSkuInfo.productSn = row.productSn;
        this.editSkuInfo.productAttributeCategoryId = row.productAttributeCategoryId;
        this.editSkuInfo.keyword = null;
        fetchSkuStockList(row.id, {
          keyword: this.editSkuInfo.keyword
        }).then(response => {
          this.editSkuInfo.stockList = response.data;
        });
        if (row.productAttributeCategoryId != null) {
          fetchProductAttrList(row.productAttributeCategoryId, {
            type: 0
          }).then(response => {
            this.editSkuInfo.productAttr = response.data.list;
          });
        }
      },
      handleSearchEditSku() {
        fetchSkuStockList(this.editSkuInfo.productId, {
          keyword: this.editSkuInfo.keyword
        }).then(response => {
          this.editSkuInfo.stockList = response.data;
        });
      },
      handleEditSkuConfirm() {
        if (this.editSkuInfo.stockList == null || this.editSkuInfo.stockList.length <= 0) {
          this.$message({
            message: '暂无sku信息',
            type: 'warning',
            duration: 1000
          });
          return
        }
        this.$confirm('是否要进行修改', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          updateSkuStockList(this.editSkuInfo.productId, this.editSkuInfo.stockList).then(response => {
            this.$message({
              message: '修改成功',
              type: 'success',
              duration: 1000
            });
            this.editSkuInfo.dialogVisible = false;
          });
        });
      },
      handleSearchList() {
        this.listQuery.pageNum = 1;
        this.getList();
      },
      handleAddProduct() {
        this.$router.push({
          path: '/pms/addProduct'
        });
      },
      handleBatchOperate() {
        if (this.operateType == null) {
          this.$message({
            message: '请选择操作类型',
            type: 'warning',
            duration: 1000
          });
          return;
        }
        if (this.multipleSelection == null || this.multipleSelection.length < 1) {
          this.$message({
            message: '请选择要操作的商品',
            type: 'warning',
            duration: 1000
          });
          return;
        }
        this.$confirm('是否要进行该批量操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let ids = [];
          for (let i = 0; i < this.multipleSelection.length; i++) {
            ids.push(this.multipleSelection[i].id);
          }
          switch (this.operateType) {
            case this.operates[0].value:
              this.updatePublishStatus(1, ids);
              break;
            case this.operates[1].value:
              this.updatePublishStatus(0, ids);
              break;
            case this.operates[2].value:
              this.updateRecommendStatus(1, ids);
              break;
            case this.operates[3].value:
              this.updateRecommendStatus(0, ids);
              break;
            case this.operates[4].value:
              this.updateNewStatus(1, ids);
              break;
            case this.operates[5].value:
              this.updateNewStatus(0, ids);
              break;
            case this.operates[6].value:
              break;
            case this.operates[7].value:
              this.updateDeleteStatus(1, ids);
              break;
            default:
              break;
          }
          this.getList();
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
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      handlePublishStatusChange(index, row) {
        let ids = [];
        ids.push(row.id);
        this.updatePublishStatus(row.publishStatus, ids);
      },
      handleNewStatusChange(index, row) {
        let ids = [];
        ids.push(row.id);
        this.updateNewStatus(row.newStatus, ids);
      },
      handleRecommendStatusChange(index, row) {
        let ids = [];
        ids.push(row.id);
        this.updateRecommendStatus(row.recommandStatus, ids);
      },
      handleResetSearch() {
        this.selectProductCateValue = [];
        this.listQuery = Object.assign({}, defaultListQuery);
      },
      handleDelete(index, row) {
        this.$confirm('是否要进行删除操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let ids = [];
          ids.push(row.id);
          this.updateDeleteStatus(1, ids);
        });
      },
      handleUpdateProduct(index, row) {
        this.$router.push({
          path: '/pms/updateProduct',
          query: {
            id: row.id
          }
        });
      },
      handleShowProduct(index, row) {
        this.$router.push({
          path: '/pms/productDetail',
          query: {
            id: row.id
          }
        });
      },
      handleShowVerify(id) {
        this.checkForm = {
          id: id,
          verifyStatus: 1,
          detail: ''
        }
        this.checkDialogVisible = true
      },
      // 提交审核结果
      handleCheckConfirm() {
        let ids = [];
        ids.push(this.checkForm.id);
        let params = new URLSearchParams();
        params.append('ids', ids);
        params.append('verifyStatus', this.checkForm.verifyStatus);
        params.append('detail', this.checkForm.detail);
        updateProductVerify(params).then(response => {
          this.$message({
            message: '审核结果提交成功',
            type: 'success',
            duration: 1000
          });
          this.checkDialogVisible = false
          this.getList()
        });
      },
      // 审核详情
      handleShowVerifyDetail(id) {
        let params = {
          pageNum: this.verifyDialog.pageNum
        }
        this.verifyDialog.id = id
        getProductVerify(id, params).then(response => {
          const {
            data
          } = response
          this.verifyDialog.list = data.list
          this.verifyDialog.total = data.total
          this.dialogVerifyVisible = true
        });
      },
      handleShowLog(id) {
        let params = {
          pageNum: this.logDialog.pageNum,
          pageSize: 10
        }
        this.logDialog.id = id
        getProductLog(id, params).then(response => {
          const {
            data
          } = response
          this.logDialog.list = data.list
          this.logDialog.total = data.total
          this.logDialogVisible = true
        });
      },
      handleDialogCurrentChange(page) {
        this.logDialog.pageNum = page
        this.handleShowLog(this.logDialog.id)
      },
      handleVerifyDialogCurrentChange(page) {
        this.verifyDialog.pageNum = page
        this.handleShowVerifyDetail(this.verifyDialog.id)
      },
      formatType(type) {
        if (type === 1) {
          return '新增'
        } else if (type === 2) {
          return '修改'
        } else if (type === 3) {
          return '删除'
        } else if (type === 4) {
          return '查询'
        } else {
          return ''
        }
      },
      updatePublishStatus(publishStatus, ids) {
        let params = new URLSearchParams();
        params.append('ids', ids);
        params.append('publishStatus', publishStatus);
        updatePublishStatus(params).then(response => {
          this.$message({
            message: '修改成功',
            type: 'success',
            duration: 1000
          });
        });
      },
      updateNewStatus(newStatus, ids) {
        let params = new URLSearchParams();
        params.append('ids', ids);
        params.append('newStatus', newStatus);
        updateNewStatus(params).then(response => {
          this.$message({
            message: '修改成功',
            type: 'success',
            duration: 1000
          });
        });
      },
      updateRecommendStatus(recommendStatus, ids) {
        let params = new URLSearchParams();
        params.append('ids', ids);
        params.append('recommendStatus', recommendStatus);
        updateRecommendStatus(params).then(response => {
          this.$message({
            message: '修改成功',
            type: 'success',
            duration: 1000
          });
        });
      },
      updateDeleteStatus(deleteStatus, ids) {
        let params = new URLSearchParams();
        params.append('ids', ids);
        params.append('deleteStatus', deleteStatus);
        updateDeleteStatus(params).then(response => {
          this.$message({
            message: '删除成功',
            type: 'success',
            duration: 1000
          });
        });
        this.getList();
      }
    }
  }
</script>
<style></style>
