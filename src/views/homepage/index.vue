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
@import "~@/styles/mixin";
.home {
  position: absolute;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .svg-icon {
    font-size: 70px;
  }
}
</style>
