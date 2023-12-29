<template>
  <div class="container">
    <div class="carousel">
      <div class="image-wrapper">
        <img :src="imgList[0].src" class="loaded" mode="aspectFill"></img>
      </div>
    </div>

    <div class="introduce-section">
      <span class="title">{{product.name}}</span><br>
      <span class="title2">{{product.subTitle}}</span>
      <div class="price-box">
        <span class="price-tip">¥</span>
        <span class="price">{{product.price}}</span>
        <span class="m-price">¥{{product.originalPrice}}</span>
      </div>
      <div class="bot-row">
        <span>销量: {{product.sale}}</span>
        <span>库存: {{product.stock}}</span>
        <span>浏览量: 768</span>
      </div>
    </div>

    <div class="c-list">
      <div class="c-row b-b" @click="toggleSpec">
        <span class="tit">购买类型</span>
        <div class="con">
          <span class="selected-span" v-for="(sItem, sIndex) in specSelected" :key="sIndex">
            {{sItem.name}}
          </span>
        </div>
        <span class="yticon icon-you"></span>
      </div>
      <div class="c-row b-b" @click="toggleAttr">
        <span class="tit">商品参数</span>
        <div class="con">
          <span class="con t-r">查看</span>
        </div>
        <span class="yticon icon-you"></span>
      </div>
      <!-- list -->
      <div class="c-row b-b">
        <span class="tit">优惠券</span>
        <span class="con t-r">暂无可领取优惠券</span>
      </div>
      <div class="c-row b-b">
        <span class="tit">促销活动</span>
        <div class="con-list">
          <span>暂无促销活动</span>
        </div>
      </div>
      <div class="c-row b-b">
        <span class="tit">服务</span>
        <div class="bz-list con">
          <span v-for="item in serviceList" :key="item">{{item}} ·</span>
        </div>
      </div>
    </div>

    <div class="detail-desc">
      <div class="d-header">
        <span>图文详情</span>
      </div>
      <div class="detailHtml" v-html="product.detailHtml"></div>
    </div>
  </div>
</template>

<script>
  import {
    getProduct
  } from '@/api/product';
  import {
    mapState
  } from 'vuex';
  import {
    formatDate
  } from '@/utils/date';
  const defaultServiceList = [{
    id: 1,
    name: "无忧退货"
  }, {
    id: 2,
    name: "快速退款"
  }, {
    id: 3,
    name: "免费包邮"
  }];
  export default {
    data() {
      return {
        specClass: 'none',
        attrClass: 'none',
        specSelected: [],
        favorite: false,
        shareList: [],
        imgList: [],
        desc: '',
        specList: [],
        specChildList: [],
        product: {},
        brand: {},
        serviceList: [],
        skuStockList: [],
        attrList: [],
        promotionTipList: [],
        couponState: 0,
        couponList: [],
        list: {}
      };
    },
    created() {
      this.loadData();
    },
    computed: {
      ...mapState(['hasLogin'])
    },
    filters: {
      formatDateTime(time) {
        if (time == null || time === '') {
          return 'N/A';
        }
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
      },
      formatCouponUseType(useType) {
        if (useType == 0) {
          return "全场通用";
        } else if (useType == 1) {
          return "指定分类商品可用";
        } else if (useType == 2) {
          return "指定商品可用";
        }
        return null;
      },
    },
    methods: {
      async loadData() {
        getProduct(this.$route.query.id).then(response => {
          this.product = response.data;
          this.skuStockList = response.data.skuStockList;
          this.initImgList();
          this.initServiceList();
          this.initSpecList(response.data);
          this.initAttrList(response.data);
          this.initPromotionTipList(response.data);
          this.initProductDesc();
          this.handleReadHistory();
          this.initProductCollection();
        });
      },
      //规格弹窗开关
      toggleSpec() {
        if (this.specClass === 'show') {
          this.specClass = 'hide';
          setTimeout(() => {
            this.specClass = 'none';
          }, 250);
        } else if (this.specClass === 'none') {
          this.specClass = 'show';
        }
      },
      //属性弹窗开关
      toggleAttr() {
        if (this.attrClass === 'show') {
          this.attrClass = 'hide';
          setTimeout(() => {
            this.attrClass = 'none';
          }, 250);
        } else if (this.attrClass === 'none') {
          this.attrClass = 'show';
        }
      },
      //优惠券弹窗开关
      toggleCoupon(type) {
        fetchProductCouponList(this.product.id).then(response => {
          this.couponList = response.data;
          if (this.couponList == null || this.couponList.length == 0) {
            uni.showToast({
              title: "暂无可领优惠券",
              icon: "none"
            })
            return;
          }
          let timer = type === 'show' ? 10 : 300;
          let state = type === 'show' ? 1 : 0;
          this.couponState = 2;
          setTimeout(() => {
            this.couponState = state;
          }, timer)
        });
      },
      //选择规格
      selectSpec(index, pid) {
        let list = this.specChildList;
        list.forEach(item => {
          if (item.pid === pid) {
            this.$set(item, 'selected', false);
          }
        })

        this.$set(list[index], 'selected', true);
        //存储已选择
        /**
         * 修复选择规格存储错误
         * 将这几行代码替换即可
         * 选择的规格存放在specSelected中
         */
        this.specSelected = [];
        list.forEach(item => {
          if (item.selected === true) {
            this.specSelected.push(item);
          }
        })
        this.changeSpecInfo();

      },
      //领取优惠券
      addCoupon(coupon) {
        this.toggleCoupon();
        addMemberCoupon(coupon.id).then(response => {
          uni.showToast({
            title: '领取优惠券成功！',
            duration: 2000
          });
        });
      },
      //分享
      share() {
        this.$refs.share.toggleMask();
      },
      //收藏
      toFavorite() {
        if (!this.checkForLogin()) {
          return;
        }
        if (this.favorite) {
          //取消收藏
          deleteProductCollection({
            productId: this.product.id
          }).then(response => {
            uni.showToast({
              title: "取消收藏成功！",
              icon: 'none'
            });
            this.favorite = !this.favorite;
          });
        } else {
          //收藏
          let productCollection = {
            productId: this.product.id,
            productName: this.product.name,
            productPic: this.product.pic,
            productPrice: this.product.price,
            productSubTitle: this.product.subTitle
          }
          createProductCollection(productCollection).then(response => {
            uni.showToast({
              title: "收藏成功！",
              icon: 'none'
            });
            this.favorite = !this.favorite;
          });
        }
      },
      buy() {
        uni.showToast({
          title: "暂时只支持从购物车下单！",
          icon: 'none'
        });
      },
      stopPrevent() {},
      //设置头图信息
      initImgList() {
        let tempPics = this.product.albumPics.split(',');
        tempPics.unshift(this.product.pic);
        for (let item of tempPics) {
          if (item != null && item != '') {
            this.imgList.push({
              src: item
            });
          }
        }
      },
      //设置服务信息
      initServiceList() {
        for (let item of defaultServiceList) {
          if (this.product.serviceIds.indexOf(item.id) != -1) {
            this.serviceList.push(item.name);
          }
        }
      },
      //设置商品规格
      initSpecList(data) {
        for (let i = 0; i < data.productAttributeList.length; i++) {
          let item = data.productAttributeList[i];
          if (item.type == 0) {
            this.specList.push({
              id: item.id,
              name: item.name
            });
            if (item.handAddStatus == 1) {
              //支持手动新增的
              let valueList = data.productAttributeValueList;
              let filterValueList = valueList.filter(value => value.productAttributeId == item.id);
              let inputList = filterValueList[0].value.split(',');
              for (let j = 0; j < inputList.length; j++) {
                this.specChildList.push({
                  pid: item.id,
                  pname: item.name,
                  name: inputList[j]
                });
              }
            } else if (item.handAddStatus == 0) {
              //不支持手动新增的
              let inputList = item.inputList.split(',');
              for (let j = 0; j < inputList.length; j++) {
                this.specChildList.push({
                  pid: item.id,
                  pname: item.name,
                  name: inputList[j]
                });
              }
            }
          }
        }
        let availAbleSpecSet = new Set();
        for (let i = 0; i < this.skuStockList.length; i++) {
          let spDataArr = JSON.parse(this.skuStockList[i].spData);
          for (let j = 0; j < spDataArr.length; j++) {
            availAbleSpecSet.add(spDataArr[j].value);
          }
        }
        // 根据商品sku筛选出可用规格
        this.specChildList = this.specChildList.filter(item => {
          return availAbleSpecSet.has(item.name)
        });
        // 规格 默认选中第一条
        this.specList.forEach(item => {
          for (let cItem of this.specChildList) {
            if (cItem.pid === item.id) {
              this.$set(cItem, 'selected', true);
              this.specSelected.push(cItem);
              this.changeSpecInfo();
              break;
            }
          }
        })
      },
      //设置商品参数
      initAttrList(data) {
        for (let item of data.productAttributeList) {
          if (item.type == 1) {
            let valueList = data.productAttributeValueList;
            let filterValueList = valueList.filter(value => value.productAttributeId == item.id);
            let value = filterValueList[0].value;
            this.attrList.push({
              key: item.name,
              value: value
            });
          }
        }
      },
      //设置促销活动信息
      initPromotionTipList(data) {
        let promotionType = this.product.promotionType;
        if (promotionType == 0) {
          this.promotionTipList.push("暂无优惠");
        } else if (promotionType == 1) {
          this.promotionTipList.push("单品优惠");
        } else if (promotionType == 2) {
          this.promotionTipList.push("会员优惠");
        } else if (promotionType == 3) {
          this.promotionTipList.push("多买优惠");
          for (let item of data.productLadderList) {
            this.promotionTipList.push("满" + item.count + "件打" + item.discount * 10 + "折");
          }
        } else if (promotionType == 4) {
          this.promotionTipList.push("满减优惠");
          for (let item of data.productFullReductionList) {
            this.promotionTipList.push("满" + item.fullPrice + "元减" + item.reducePrice + "元");
          }
        } else if (promotionType == 5) {
          this.promotionTipList.push("限时优惠");
        }
      },
      //初始化商品详情信息
      initProductDesc() {
        let rawhtml = this.product.detailMobileHtml;
        let tempNode = document.createElement('div');
        tempNode.innerHTML = rawhtml;
        let imgs = tempNode.getElementsByTagName('img');
        for (let i = 0; i < imgs.length; i++) {
          imgs[i].style.width = '100%';
          imgs[i].style.height = 'auto';
          imgs[i].style.display = 'block';
        }
        this.desc = tempNode.innerHTML;
      },
      //处理创建浏览记录
      handleReadHistory() {
        if (this.hasLogin) {
          let data = {
            productId: this.product.id,
            productName: this.product.name,
            productPic: this.product.pic,
            productPrice: this.product.price,
            productSubTitle: this.product.subTitle,
          }
          createReadHistory(data);
        }
      },
      //当商品规格改变时，修改商品信息
      changeSpecInfo() {
        let skuStock = this.getSkuStock();
        if (skuStock != null) {
          this.product.originalPrice = skuStock.price;
          if (this.product.promotionType == 1) {
            //单品优惠使用促销价
            this.product.price = skuStock.promotionPrice;
          } else {
            this.product.price = skuStock.price;
          }
          this.product.stock = skuStock.stock;
        }
      },
      //获取当前选中商品的SKU
      getSkuStock() {
        for (let i = 0; i < this.skuStockList.length; i++) {
          let spDataArr = JSON.parse(this.skuStockList[i].spData);
          let availAbleSpecSet = new Map();
          for (let j = 0; j < spDataArr.length; j++) {
            availAbleSpecSet.set(spDataArr[j].key, spDataArr[j].value);
          }
          let correctCount = 0;
          for (let item of this.specSelected) {
            let value = availAbleSpecSet.get(item.pname);
            if (value != null && value == item.name) {
              correctCount++;
            }
          }
          if (correctCount == this.specSelected.length) {
            return this.skuStockList[i];
          }
        }
        return null;
      },
      //将商品加入到购物车
      addToCart() {
        if (!this.checkForLogin()) {
          return;
        }
        let productSkuStock = this.getSkuStock();
        let cartItem = {
          price: this.product.price,
          productAttr: productSkuStock.spData,
          productBrand: this.product.brandName,
          productCategoryId: this.product.productCategoryId,
          productId: this.product.id,
          productName: this.product.name,
          productPic: this.product.pic,
          productSkuCode: productSkuStock.skuCode,
          productSkuId: productSkuStock.id,
          productSn: this.product.productSn,
          productSubTitle: this.product.subTitle,
          quantity: 1
        };
        addCartItem(cartItem).then(response => {
          uni.showToast({
            title: response.message,
            duration: 1500
          })
        });
      },
      //检查登录状态并弹出登录框
      checkForLogin() {
        if (!this.hasLogin) {
          uni.showModal({
            title: '提示',
            content: '你还没登录，是否要登录？',
            confirmspan: '去登录',
            cancelspan: '取消',
            success: function(res) {
              if (res.confirm) {
                uni.navigateTo({
                  url: '/pages/public/login'
                })
              } else if (res.cancel) {
                console.log('用户点击取消');
              }
            }
          });
          return false;
        } else {
          return true;
        }
      },
      //初始化收藏状态
      initProductCollection() {
        if (this.hasLogin) {
          productCollectionDetail({
            productId: this.product.id
          }).then(response => {
            this.favorite = response.data != null;
          });
        }
      },
      //跳转到品牌详情页
      navToBrandDetail() {
        let id = this.brand.id;
        uni.navigateTo({
          url: `/pages/brand/brandDetail?id=${id}`
        })
      },
    },

  }
</script>

<style lang='scss'>
  .container {
    width: 375px;
    height: 667px;
    border: 1px solid #d9d9d9;
    box-sizing: border-box;
    overflow-y: scroll;
    margin: 20px;
  }

  .icon-you {
    color: #888;
  }

  .carousel {
    height: 360px;
    position: relative;

    swiper {
      height: 100%;
    }

    .image-wrapper {
      width: 100%;
      height: auto;

      .loaded {
        width: 100%;
        height: auto;
      }
    }

    .swiper-item {
      display: flex;
      justify-content: center;
      align-content: center;
      height: 375px;
      overflow: hidden;

      image {
        width: 100%;
        height: 100%;
      }
    }

  }

  /* 标题简介 */
  .introduce-section {
    background: #fff;
    padding: 10px 15px;

    .title {
      font-size: 16px;
      color: #303133;
      height: 26px;
      line-height: 26px;
    }

    .title2 {
      font-size: 14px;
      color: #909399;
      height: 24px;
      line-height: 24px;
    }

    .price-box {
      display: flex;
      align-items: baseline;
      height: 32px;
      padding: 5px 0;
      font-size: 14px;
      color: #fa436a;
    }

    .price {
      font-size: 18px;
    }

    .m-price {
      margin: 0 6px;
      color: #909399;
      span-decoration: line-through;
    }

    .bot-row {
      display: flex;
      align-items: center;
      height: 26px;
      font-size: 12px;
      color: #909399;

      span {
        flex: 1;
      }
    }
  }

  /* 分享 */
  .share-section {
    display: flex;
    align-items: center;
    color: #606266;
    background: linear-gradient(left, #fdf5f6, #fbebf6);
    padding: 6px 15px;

    .share-icon {
      display: flex;
      align-items: center;
      width: 35px;
      height: 15px;
      line-height: 1;
      border: 1px solid #fa436a;
      border-radius: 2px;
      position: relative;
      overflow: hidden;
      font-size: 12px;
      color: #fa436a;

      &:after {
        content: '';
        width: 25px;
        height: 25px;
        border-radius: 50%;
        left: -10px;
        top: -6px;
        position: absolute;
        background: #fa436a;
      }
    }

    .icon-xingxing {
      position: relative;
      z-index: 1;
      font-size: 12px;
      margin-left: 1px;
      margin-right: 5px;
      color: #fff;
      line-height: 1;
    }

    .tit {
      font-size: 14px;
      margin-left: 5px;
    }

    .icon-bangzhu1 {
      padding: 5px;
      font-size: 16px;
      line-height: 1;
    }

    .share-btn {
      flex: 1;
      span-align: right;
      font-size: 12px;
      color: #fa436a;
    }

    .icon-you {
      font-size: 12px;
      margin-left: 2px;
      color: #fa436a;
    }
  }

  .c-list {
    font-size: 14px;
    color: #606266;
    background: #fff;

    .c-row {
      display: flex;
      align-items: center;
      padding: 10px 15px;
      position: relative;
    }

    .tit {
      width: 70px;
    }

    .con {
      flex: 1;
      color: #303133;

      .selected-span {
        margin-right: 5px;
      }
    }

    .bz-list {
      height: 20px;
      font-size: 14px;
      color: #303133;

      span {
        display: inline-block;
        margin-right: 15px;
      }
    }

    .con-list {
      flex: 1;
      display: flex;
      flex-direction: column;
      color: #303133;
      line-height: 20px;
    }

    .red {
      color: #fa436a;
    }
  }

  /* 评价 */
  .eva-section {
    display: flex;
    flex-direction: column;
    padding: 10px 15px;
    background: #fff;
    margin-top: 8px;

    .e-header {
      display: flex;
      align-items: center;
      height: 36px;
      font-size: 14px;
      color: #909399;

      .tit {
        font-size: 16px;
        color: #303133;
        margin-right: 2px;
      }

      .tip {
        flex: 1;
        span-align: right;
      }

      .icon-you {
        margin-left: 5px;
      }
    }
  }

  /*  详情 */
  .detail-desc {
    background: #fff;
    margin-top: 8px;

    .d-header {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 40px;
      font-size: 16px;
      color: #303133;
      position: relative;

      span {
        padding: 0 10px;
        background: #fff;
        position: relative;
        z-index: 1;
      }

      &:after {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translateX(-50%);
        width: 150px;
        height: 0;
        content: '';
        border-bottom: 1px solid #ccc;
      }
    }

    .detailHtml {
      img {
        width: 100%;
        height: auto;
        display: block;
        margin: 0;
      }
    }
  }

  .detail-desc>>>img {
    width: 100%;
    height: auto;
  }

  .no-padding {
    padding: 0;
  }

  /*  弹出层 */
  .popup {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 99;

    &.show {
      display: block;

      .mask {
        animation: showPopup 0.2s linear both;
      }

      .layer {
        animation: showLayer 0.2s linear both;
      }
    }

    &.hide {
      .mask {
        animation: hidePopup 0.2s linear both;
      }

      .layer {
        animation: hideLayer 0.2s linear both;
      }
    }

    &.none {
      display: none;
    }

    .mask {
      position: fixed;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
      background-color: rgba(0, 0, 0, 0.4);
    }

    .layer {
      position: fixed;
      z-index: 99;
      bottom: 0;
      width: 100%;
      min-height: 40vh;
      border-radius: 5px 5px 0 0;
      background-color: #fff;

      .btn {
        height: 33px;
        line-height: 33px;
        border-radius: 50px;
        background: #fa436a;
        font-size: 16px;
        color: #fff;
        margin: 15px auto 10px;
      }
    }

    @keyframes showPopup {
      0% {
        opacity: 0;
      }

      100% {
        opacity: 1;
      }
    }

    @keyframes hidePopup {
      0% {
        opacity: 1;
      }

      100% {
        opacity: 0;
      }
    }

    @keyframes showLayer {
      0% {
        transform: translateY(120%);
      }

      100% {
        transform: translateY(0%);
      }
    }

    @keyframes hideLayer {
      0% {
        transform: translateY(0);
      }

      100% {
        transform: translateY(120%);
      }
    }
  }

  /* 优惠券面板 */
  .mask {
    display: flex;
    align-items: flex-end;
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    width: 100%;
    background: rgba(0, 0, 0, 0);
    z-index: 9995;
    transition: .3s;

    .mask-content {
      width: 100%;
      min-height: 30vh;
      max-height: 70vh;
      background: #f3f3f3;
      transform: translateY(100%);
      transition: .3s;
      overflow-y: scroll;
    }

    &.none {
      display: none;
    }

    &.show {
      background: rgba(0, 0, 0, .4);

      .mask-content {
        transform: translateY(0);
      }
    }
  }

  .brand-info {
    margin-top: 8px;
    background-color: #fff;
    display: flex;
    flex-direction: column;

    .brand-box {
      display: flex;
      align-items: center;
      padding: 15px 25px;

      .image-wrapper {
        width: 105px;
        height: 35px;

        image {
          width: 100%;
          height: 100%;
        }
      }

      .title {
        flex: 1;
        display: flex;
        flex-direction: column;
        font-size: 20px;
        margin-left: 15px;
        color: #303133;

        span:last-child {
          font-size: 12px;
          color: #909399;
          margin-top: 4px;

          &.Skeleton {
            width: 110px;
          }
        }
      }
    }

    .d-header {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 40px;
      font-size: 16px;
      color: #303133;
      position: relative;

      span {
        padding: 0 10px;
        background: #fff;
        position: relative;
        z-index: 1;
      }

      &:after {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translateX(-50%);
        width: 150px;
        height: 0;
        content: '';
        border-bottom: 1px solid #ccc;
      }
    }
  }
</style>