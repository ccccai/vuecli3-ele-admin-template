<template>
  <div class="sidebar-logo-container" :class="{'collapse':collapse}" title="回到主页">
    <transition name="sidebarLogoFade">
      <router-link v-if="collapse" key="collapse" class="sidebar-logo-link" to="/">
        <img v-if="logo" src="@/assets/images/logo.png" class="sidebar-logo collapse-logo">
        <!-- <h1 v-else class="sidebar-title">
          {{ title }}
        </h1> -->
        <div v-else class="sidebar-title">
          <span>{{ title }}</span>
        </div>
      </router-link>
      <router-link v-else key="expand" class="sidebar-logo-link" to="/">
        <img v-if="logo" src="@/assets/images/logo.png" class="sidebar-logo">
        <!-- <h1 class="sidebar-title">
          {{ title }}
        </h1> -->
        <div class="sidebar-title">
          <span>{{ title }}</span>
        </div>
      </router-link>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'SidebarLogo',
  props: {
    collapse: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      title: '后台管理系统',
      logo: true
    }
  }
}
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 50px;
  line-height: 50px;
  background: #2b2f3a;
  text-align: center;
  overflow: hidden;

  .collapse-logo {
    width: 30px !important;
    height: 25px !important;
    padding-right: 0!important;
  }

  & .sidebar-logo-link {
    height: 100%;
    width: 100%;

    & .sidebar-logo {
      width: 30px;
      height: 25px;
      vertical-align: middle;
      margin-right: 15px;
    }

    & .sidebar-title {
      display: inline-block;
      margin: 0;
      color: #fff;
      font-weight: 600;
      line-height: 50px;
      font-size: 14px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
      span {
        padding-left: 15px;
        border-left: 1px solid #fff;
      }
    }
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0px;
    }
  }
}
</style>
