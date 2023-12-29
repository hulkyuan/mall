<template> 
  <div class="app-container">
    <!-- 返回上一级 -->
    <el-button type="primary" plain size="medium" icon="el-icon-back" @click="handleGoBack">返回上一页</el-button>
    <div class="title">
      <svg-icon icon-class="marker" style="color: #606266"></svg-icon>
      <span class="font-small">收货人信息</span>
    </div>
    <div class="table-layout">
      <div class="table-flex">
        <div class="table-cell-title">订单编号</div>
        <div class="table-cell-title">收货人</div>
        <div class="table-cell-title">手机号码</div>
        <div class="table-cell-title">邮政编码</div>
        <div class="table-cell-title">收货地址</div>
      </div>
      <div class="table-flex">
        <div class="table-cell">{{orderList.orderSn}}</div>
        <div class="table-cell">{{orderList.receiverName}}</div>
        <div class="table-cell">{{orderList.receiverPhone}}</div>
        <div class="table-cell">{{orderList.receiverPostCode}}</div>
        <div class="table-cell">{{orderList.address}}</div>
      </div>
    </div>
    <div class="title">
      <svg-icon icon-class="marker" style="color: #606266"></svg-icon>
      <span class="font-small">订单发货</span>
    </div>
    <!-- <el-form :model="form">
      <el-form-item label="发货方式：">
        <el-radio-group v-model="form.type">
          <el-radio :label="1">批量发货</el-radio>
          <el-radio :label="2">分开发货</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form> -->
    <!-- <el-button v-if="form.type===1" type="primary" @click="handleAllDelivery()">点击批量发货</el-button> -->
    <div class="order-boder">
      <el-table ref="orderItemTable" :data="order.orderItemList" border>
        <el-table-column label="商品图片" width="120" align="center">
          <template slot-scope="scope">
            <img :src="scope.row.productPic" style="height: 80px">
          </template>
        </el-table-column>
        <el-table-column label="商品名称" header-align="center">
          <template slot-scope="scope">
            <div>{{scope.row.productName}}</div>
            <div>品牌：{{scope.row.productBrand}}</div>
          </template>
        </el-table-column>
        <el-table-column label="价格/货号" header-align="center">
          <template slot-scope="scope">
            <div>价格：￥{{scope.row.productPrice}}</div>
            <div>货号：{{scope.row.productSn}}</div>
          </template>
        </el-table-column>
        <el-table-column label="属性" header-align="center">
          <template slot-scope="scope">
            {{scope.row.productAttr | formatProductAttr}}
          </template>
        </el-table-column>
        <el-table-column label="数量" align="center" width="120">
          <template slot-scope="scope">
            {{scope.row.productQuantity}}
          </template>
        </el-table-column>
        <el-table-column label="配送方式" align="center">
          <template slot-scope="scope">
            <el-select v-model="scope.row.deliveryCompany" placeholder="请选择物流公司" size="small">
              <el-option v-for="item in companyOptions" :key="item" :label="item" :value="item"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="物流单号" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.deliverySn" size="small" clearable></el-input>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top: 20px;text-align: center;">
        <el-button @click="cancel()">取消</el-button>
        <el-button @click="confirm()" type="primary">确定</el-button>
      </div>
    </div>
  </div>
</template>
<script>
  import {
    deliveryOrder,
    getOrderItem
  } from '@/api/order'
  const companyOptions = ["顺丰快递", "圆通快递", "中通快递", "韵达快递"];
  export default {
    name: 'deliverOrderList',
    data() {
      return {
        orderList: {},
        order: {},
        companyOptions,
        form: {
          type: 1
        }
      }
    },
    created() {
      this.resetParams()
    },
    filters: {
      formatProductAttr(value) {
        if (value == null) {
          return '';
        } else {
          let attr = JSON.parse(value);
          let result = '';
          for (let i = 0; i < attr.length; i++) {
            result += attr[i].key;
            result += ":";
            result += attr[i].value;
            result += ";";
          }
          return result;
        }
      }
    },
    methods: {
      handleGoBack(){
        this.$router.go(-1)
      },
      resetParams() {
        const orderList = window.sessionStorage.getItem('order_list_session');
        const row = JSON.parse(orderList);
        this.orderList = row
        this.getList()
      },
      getList() {
        this.listLoading = true;
        getOrderItem(this.orderList.orderId).then(response => {
          this.order = response.data
          this.listLoading = false;
        });
      },
      cancel() {
        this.$router.back();
      },
      confirm() {
        this.$confirm('是否要进行发货操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let list = [];
          for (let i = 0; i < this.order.orderItemList.length; i++) {
            list.push({
              orderItemId: this.order.orderItemList[i].id,
              orderId: this.orderList.orderId,
              orderSn: this.orderList.orderSn,
              receiverName: this.orderList.receiverName,
              receiverPhone: this.orderList.receiverPhone,
              receiverPostCode: this.orderList.receiverPostCode,
              address: this.orderList.address,
              deliveryCompany: this.order.orderItemList[i].deliveryCompany,
              deliverySn: this.order.orderItemList[i].deliverySn
            })
          }
          deliveryOrder(list).then(response => {
            this.$router.go(-1);
            window.sessionStorage.removeItem('order_list_session')
            this.$message({
              type: 'success',
              message: '发货成功!'
            });
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消发货'
          });
        });
      }
    }
  }
</script>
<style lang="scss" scoped>
  .title {
    margin: 20px 0;
  }

  .order-boder {}

  .table-layout {
    margin-top: 20px;
    border-left: 1px solid #DCDFE6;
    border-top: 1px solid #DCDFE6;
  }

  .table-flex {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
  }

  .table-cell {
    height: 60px;
    line-height: 40px;
    border-right: 1px solid #DCDFE6;
    border-bottom: 1px solid #DCDFE6;
    padding: 10px;
    font-size: 14px;
    color: #606266;
    text-align: center;
    overflow: hidden;
  }

  .table-cell-title {
    border-right: 1px solid #DCDFE6;
    border-bottom: 1px solid #DCDFE6;
    padding: 10px;
    background: #F2F6FC;
    text-align: center;
    font-size: 14px;
    color: #303133;
  }
</style>
