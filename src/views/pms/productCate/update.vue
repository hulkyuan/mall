<template> 
  <product-cate-detail :is-edit='true' :is-level='level'></product-cate-detail>
</template>
<script>
  import ProductCateDetail from './components/ProductCateDetail'
  export default {
    name: 'updateProductCate',
    components: { ProductCateDetail },
    data() {
      return {
        level: 0
      }
    },
    created() {
      if (this.$route.query.level != null) {
        this.level = parseInt(this.$route.query.level);
      } else {
        this.level = 0;
      }
    }
  }
</script>
<style>
</style>


