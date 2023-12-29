<template>
  <div class="detail-container">
    <!-- 返回上一级 -->
    <el-button type="primary" plain size="medium" icon="el-icon-back" @click="handleGoBack" style="margin-bottom: 20px;">返回上一页</el-button>
    <el-card shadow="never">
      <span class="font-title-medium">退货商品</span>
      <el-table border class="standard-margin" ref="productTable" :data="productList">
        <el-table-column label="商品图片" width="160" align="center">
          <template slot-scope="scope">
            <img style="height:80px" :src="scope.row.productPic">
          </template>
        </el-table-column>
        <el-table-column label="商品名称" align="center">
          <template slot-scope="scope">
            <span class="font-small">{{scope.row.productName}}</span><br>
            <span class="font-small">品牌：{{scope.row.productBrand}}</span>
          </template>
        </el-table-column>
        <el-table-column label="价格/货号" width="180" align="center">
          <template slot-scope="scope">
            <span class="font-small">价格：￥{{scope.row.productRealPrice}}</span><br>
            <span class="font-small">货号：NO.{{scope.row.productId}}</span>
          </template>
        </el-table-column>
        <el-table-column label="属性" width="180" align="center">
          <template slot-scope="scope">{{scope.row.productAttr}}</template>
        </el-table-column>
        <el-table-column label="数量" width="100" align="center">
          <template slot-scope="scope">{{scope.row.productCount}}</template>
        </el-table-column>
        <el-table-column label="小计" width="100" align="center">
          <template slot-scope="scope">￥{{totalAmount}}</template>
        </el-table-column>
      </el-table>
      <div style="float:right;margin-top:15px;margin-bottom:15px">
        <span class="font-title-medium">合计：</span>
        <span class="font-title-medium color-danger">￥{{totalAmount}}</span>
      </div>
    </el-card>
    <el-card shadow="never" class="standard-margin">
      <span class="font-title-medium">服务单信息</span>
      <div class="form-container-border">
        <el-row>
          <el-col :span="6" class="form-border form-left-bg font-small">服务单号</el-col>
          <el-col class="form-border font-small" :span="18">{{orderReturnApply.id}}</el-col>
        </el-row>
        <el-row>
          <el-col class="form-border form-left-bg font-small" :span="6">申请状态</el-col>
          <el-col class="form-border font-small" :span="18">{{orderReturnApply.status | formatStatus}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="form-border form-left-bg font-small" style="height:50px;line-height:30px">订单编号
          </el-col>
          <el-col class="form-border font-small" :span="18" style="height:50px">
            {{orderReturnApply.orderSn}}
            <el-button type="text" size="small" @click="handleViewOrder">查看</el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-col class="form-border form-left-bg font-small" :span="6">申请时间</el-col>
          <el-col class="form-border font-small" :span="18">{{orderReturnApply.createTime | formatTime}}</el-col>
        </el-row>
        <el-row>
          <el-col class="form-border form-left-bg font-small" :span="6">用户账号</el-col>
          <el-col class="form-border font-small" :span="18">{{orderReturnApply.memberUsername}}</el-col>
        </el-row>
        <el-row>
          <el-col class="form-border form-left-bg font-small" :span="6">联系人</el-col>
          <el-col class="form-border font-small" :span="18">{{orderReturnApply.returnName}}</el-col>
        </el-row>
        <el-row>
          <el-col class="form-border form-left-bg font-small" :span="6">联系电话</el-col>
          <el-col class="form-border font-small" :span="18">{{orderReturnApply.returnPhone}}</el-col>
        </el-row>
        <el-row>
          <el-col class="form-border form-left-bg font-small" :span="6">退货原因</el-col>
          <el-col class="form-border font-small" :span="18">{{orderReturnApply.reason}}</el-col>
        </el-row>
        <el-row>
          <el-col class="form-border form-left-bg font-small" :span="6">问题描述</el-col>
          <el-col class="form-border font-small" :span="18">{{orderReturnApply.description}}</el-col>
        </el-row>
        <el-row>
          <el-col class="form-border form-left-bg font-small" :span="6" style="height:100px;line-height:80px">凭证图片
          </el-col>
          <el-col class="form-border font-small" :span="18" style="height:100px">
            <img v-for="item in proofPics" style="width:80px;height:80px" :src="item">
          </el-col>
        </el-row>
      </div>

      <div class="form-container-border">
        <el-row>
          <el-col class="form-border form-left-bg font-small" :span="6">订单金额</el-col>
          <el-col class="form-border font-small" :span="18">￥{{totalAmount}}</el-col>
        </el-row>
        <div v-show="orderReturnApply.status==2">
          <el-row>
            <el-col class="form-border form-left-bg font-small" :span="6">退款</el-col>
            <el-col class="form-border font-small" :span="18">￥{{orderReturnApply.returnAmount}}</el-col>
          </el-row>
        </div>
        <div v-show="orderReturnApply.status==1">
          <el-row>
            <el-col class="form-border form-left-bg font-small" :span="6">物流单号</el-col>
            <el-col class="form-border font-small" :span="18">{{orderReturnApply.deliverySn}}</el-col>
          </el-row>
          <el-row>
            <el-col class="form-border form-left-bg font-small" :span="6">物流公司</el-col>
            <el-col class="form-border font-small" :span="18">{{orderReturnApply.deliveryCompany}}</el-col>
          </el-row>
          <el-row>
            <el-col class="form-border form-left-bg font-small" :span="6">联系电话</el-col>
            <el-col class="form-border font-small" :span="18">{{orderReturnApply.deliveryPhone}}</el-col>
          </el-row>
          <el-row>
            <el-col class="form-border form-left-bg font-small" :span="6">发货时间</el-col>
            <el-col class="form-border font-small" :span="18">{{orderReturnApply.deliveryTime | formatTime}}</el-col>
          </el-row>
        </div>
      </div>
      <div class="form-container-border" v-show="orderReturnApply.status!==0">
        <el-row>
          <el-col class="form-border form-left-bg font-small" :span="6">处理人员</el-col>
          <el-col class="form-border font-small" :span="18">{{orderReturnApply.handleMan}}</el-col>
        </el-row>
        <el-row>
          <el-col class="form-border form-left-bg font-small" :span="6">处理时间</el-col>
          <el-col class="form-border font-small" :span="18">{{orderReturnApply.handleTime | formatTime}}</el-col>
        </el-row>
        <el-row>
          <el-col class="form-border form-left-bg font-small" :span="6">处理备注</el-col>
          <el-col class="form-border font-small" :span="18">{{orderReturnApply.handleNote}}</el-col>
        </el-row>
      </div>
      <!-- 退货退款流程 -->
      <div style="margin-top:15px" v-if="orderReturnApply.type===2">
        <div v-show="orderReturnApply.status === 0">
          <el-button type="primary" size="small" @click="handleAgreement(1)">同意申请</el-button>
          <el-button type="danger" size="small" @click="handleAgreement(3)">拒绝申请</el-button>
        </div>
        <div v-show="orderReturnApply.status === 1">
          <el-button type="primary" size="small" @click="handleAgreement(4)">确认收货</el-button>
        </div>
        <div v-show="orderReturnApply.status === 4">
          <el-button type="primary" size="small" @click="handleAgreement(2)">确认退款</el-button>
        </div>
      </div>
      <!-- 仅退款流程 -->
      <div style="margin-top:15px" v-else-if="orderReturnApply.type===1">
        <div v-show="orderReturnApply.status === 0">
          <el-button type="primary" size="small" @click="handleAgreement(2)">确认退款</el-button>
          <el-button type="primary" size="small" @click="handleAgreement(3)">拒绝退款</el-button>
        </div>
      </div>

    </el-card>
    <el-dialog title="同意申请" :visible.sync="dialogVisible" width="700">
      <el-form :model="updateStatusParam" ref="form" label-width="120px" size="small" v-loading="dialogLoading">
        <div v-show="orderReturnApply.type===2&&orderReturnApply.status===0">
          <el-form-item label="选择收货点：" prop="companyAddressId" required>
            <el-select v-model="updateStatusParam.companyAddressId" @change="handleCompanyChange">
              <el-option v-for="address in companyAddressList" :key="address.id" :value="address.id" :label="address.addressName">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="收货人姓名：">
            <el-input v-model="currentAddress.name" disabled></el-input>
          </el-form-item>
          <el-form-item label="所在区域：">
            <el-input v-model="currentAddress.province" disabled></el-input>
          </el-form-item>
          <el-form-item label="详细地址：">
            <el-input v-model="currentAddress.detailAddress" disabled></el-input>
          </el-form-item>
          <el-form-item label="联系电话：">
            <el-input v-model="currentAddress.phone" disabled></el-input>
          </el-form-item>
        </div>
        <div v-show="orderReturnApply.type===2&&orderReturnApply.status===1">
          <el-form-item label="收货备注：">
            <el-input v-model="updateStatusParam.receiveNote" clearable></el-input>
          </el-form-item>
        </div>
        <div v-show="(orderReturnApply.type===2&&orderReturnApply.status===4) || (orderReturnApply.type===1&&orderReturnApply.status===0)">
          <el-form-item label="订单金额：">
            <el-input v-model="totalAmount" disabled></el-input>
          </el-form-item>
          <el-form-item label="确认退款金额：">
            <el-input v-model="updateStatusParam.returnAmount"></el-input>
          </el-form-item>
          <el-form-item label="处理备注：">
            <el-input v-model="updateStatusParam.handleNote"></el-input>
          </el-form-item>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" :loading="dialogLoading" @click="handleConfirm">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="同意申请" :visible.sync="dialogNoVisible" width="700">
      <el-form :model="updateStatusParam" ref="form" label-width="120px" size="small" v-loading="dialogNoLoading">
        <el-form-item label="拒绝理由：">
          <el-input v-model="updateStatusParam.handleNote" clearable></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogNoVisible = false">取 消</el-button>
        <el-button type="primary" :loading="dialogNoLoading" @click="handleNoConfirm">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>
<script>
  import {
    mapGetters
  } from 'vuex'
  import {
    getApplyDetail,
    updateApplyStatus
  } from '@/api/returnApply';
  import {
    fetchList
  } from '@/api/companyAddress';
  import {
    formatDate
  } from '@/utils/date';

  const defaultUpdateStatusParam = {
    companyAddressId: null,
    handleMan: 'admin',
    handleNote: null,
    receiveMan: 'admin',
    receiveNote: null,
    returnAmount: 0,
    status: 0
  };
  const defaultOrderReturnApply = {
    id: null,
    orderId: null,
    companyAddressId: null,
    productId: null,
    orderSn: null,
    createTime: null,
    memberUsername: null,
    returnAmount: null,
    returnName: null,
    returnPhone: null,
    status: null,
    handleTime: null,
    productPic: null,
    productName: null,
    productBrand: null,
    productAttr: null,
    productCount: null,
    productPrice: null,
    productRealPrice: null,
    reason: null,
    description: null,
    proofPics: null,
    handleNote: null,
    handleMan: null,
    receiveMan: null,
    receiveTime: null,
    receiveNote: null
  };
  export default {
    name: 'returnApplyDetail',
    data() {
      return {
        dialogVisible: false,
        dialogLoading: false,
        dialogNoVisible: false,
        dialogNoLoading: false,
        currentAddress: {},
        id: null,
        orderReturnApply: Object.assign({}, defaultOrderReturnApply),
        productList: null,
        proofPics: null,
        updateStatusParam: Object.assign({}, defaultUpdateStatusParam),
        companyAddressList: null
      }
    },
    created() {
      this.id = this.$route.query.id;
      this.getDetail();
    },
    computed: {
      ...mapGetters([
        'name'
      ]),
      totalAmount() {
        if (this.orderReturnApply != null) {
          return this.orderReturnApply.productRealPrice * this.orderReturnApply.productCount;
        } else {
          return 0;
        }
      },

    },
    filters: {
      formatStatus(status) {
        if (status === 0) {
          return "待处理";
        } else if (status === 1) {
          return "退货中";
        } else if (status === 2) {
          return "已完成";
        } else if (status === 3) {
          return "已拒绝";
        } else if (status === 4) {
          return "退款中";
        } else {
          return "--";
        }
      },
      formatTime(time) {
        if (time == null || time === '') {
          return 'N/A';
        }
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
      },
      formatRegion(address) {
        let str = address.province;
        if (address.city != null) {
          str += "  " + address.city;
        }
        str += "  " + address.region;
        return str;
      }
    },
    methods: {
      handleGoBack() {
        this.$router.go(-1)
      },
      handleViewOrder() {
        this.$router.push({
          path: '/oms/orderDetail',
          query: {
            id: this.orderReturnApply.orderId
          }
        });
      },
      // 获取详情
      getDetail() {
        getApplyDetail(this.id).then(response => {
          this.orderReturnApply = response.data;
          this.productList = [];
          this.productList.push(this.orderReturnApply);
          if (this.orderReturnApply.proofPics != null) {
            this.proofPics = this.orderReturnApply.proofPics.split(",")
          }
          this.getCompanyAddressList();
        });
      },
      // 获取平台地址信息
      getCompanyAddressList() {
        fetchList().then(response => {
          this.companyAddressList = response.data;
        });
      },
      // 点击按钮操作
      handleAgreement(status) {
        this.updateStatusParam.status = status;
        if (status === 3) {
          this.updateStatusParam.handleNote = ''
          this.updateStatusParam.handleMan = ''
          this.dialogNoVisible = true
        } else {
          this.updateStatusParam.companyAddressId = ''
          this.updateStatusParam.handleNote = ''
          this.updateStatusParam.handleMan = ''
          this.updateStatusParam.receiveMan = ''
          this.updateStatusParam.receiveNote = ''
          this.updateStatusParam.returnAmount = this.totalAmount
          this.dialogVisible = true
        }

      },
      // 选择公司信息的时候连带
      handleCompanyChange(value) {
        let obj = this.companyAddressList.find(item => item.id === value)
        if (obj) {
          this.currentAddress = obj
          if (this.currentAddress.city != null) {
            this.currentAddress.province += "  " + this.currentAddress.city;
          }
          this.currentAddress.province += "  " + this.currentAddress.region;
        } else {
          this.currentAddress = {}
        }
      },
      // 弹窗提交
      handleConfirm() {
        let params = {}
        if (this.orderReturnApply.type === 2) {
          if (this.orderReturnApply.status == 0) {
            params = {
              companyAddressId: this.updateStatusParam.companyAddressId,
              status: this.updateStatusParam.status
            }
          } else if (this.orderReturnApply.status == 1) {
            params = {
              receiveMan: this.name,
              receiveNote: this.updateStatusParam.receiveNote,
              status: this.updateStatusParam.status
            }
          } else if (this.orderReturnApply.status == 4) {
            params = {
              returnAmount: parseFloat(this.updateStatusParam.returnAmount),
              handleMan: this.name,
              handleNote: this.updateStatusParam.handleNote,
              status: this.updateStatusParam.status
            }
          }
        } else {
          if (this.orderReturnApply.status == 0) {
            params = {
              returnAmount: parseFloat(this.updateStatusParam.returnAmount),
              handleMan: this.name,
              handleNote: this.updateStatusParam.handleNote,
              status: this.updateStatusParam.status
            }
          }
        }
        if (this.orderReturnApply.status == 3) {
          params = {
            handleMan: this.name,
            handleNote: this.updateStatusParam.handleNote,
            status: this.updateStatusParam.status
          }
        }
        // console.log(this.name)
        // return
        updateApplyStatus(this.id, params).then(response => {
          this.$message({
            type: 'success',
            message: '操作成功!',
            duration: 1000
          });
          this.$router.back();
        });
      },
      handleNoConfirm() {
        let params = {}
        params = {
          handleMan: this.name,
          handleNote: this.updateStatusParam.handleNote,
          status: this.updateStatusParam.status
        }
        updateApplyStatus(this.id, params).then(response => {
          this.$message({
            type: 'success',
            message: '操作成功!',
            duration: 1000
          });
          this.$router.back();
        });
      }
    }
  }
</script>
<style scoped>
  .detail-container {
    position: absolute;
    left: 0;
    right: 0;
    width: 1080px;
    padding: 35px 35px 15px 35px;
    margin: 20px auto;
  }

  .standard-margin {
    margin-top: 15px;
  }

  .form-border {
    border-right: 1px solid #DCDFE6;
    border-bottom: 1px solid #DCDFE6;
    padding: 0 10px;
    height: 38px;
    line-height: 38px;
  }

  .form-container-border {
    border-left: 1px solid #DCDFE6;
    border-top: 1px solid #DCDFE6;
    margin-top: 15px;
  }

  .form-left-bg {
    background: #F2F6FC;
  }
</style>