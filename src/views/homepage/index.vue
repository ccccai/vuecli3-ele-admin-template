<template>
  <div class="home">
    <svg-icon icon-class="drink" />
  </div>
</template>
<script>
export default {
}
</script>
<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
.home {
  height: 100%;
  @include flexBox;
  @include alignCenter;
  @include justifyCenter;
  .svg-icon {
    font-size: 70px;
  }
}
</style>
