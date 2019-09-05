<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click" @visible-change="triggerFlag=!triggerFlag">
        <div class="avatar-wrapper">
          <svg-icon icon-class="user" class="user-avatar" />
          <i :class="triggerFlag ? 'el-icon-caret-bottom rotate' : 'el-icon-caret-bottom'" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <el-dropdown-item class="user-info-item">
            <div class="user-info">
              <span>{{ userName }}</span>
            </div>
          </el-dropdown-item>
          <el-dropdown-item>
            <span style="display:block;" @click="logout">退出账户</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  data() {
    return {
      triggerFlag: false
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar'
    ]),
    ...mapState({
      userName: state => state.user.name
    })
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('LogOut')
      await this.$store.dispatch('tagsView/delAllViews')
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="scss">
.user-dropdown {
  text-align: center;
  font-size: 14px;
  border-radius: 2px;
  border: 0;
  padding: 0;
  .el-dropdown-menu__item:focus, .el-dropdown-menu__item:not(.is-disabled):hover {
    border-radius: 2px;
  }
  .user-info-item {
    cursor: unset;
    text-align: center;
    border-radius: 2px;
    &:focus, &:not(.is-disabled):hover {
      background-color: #FFF;
      color: #333;
    }
  }
}
</style>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;/* no*/
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;
    padding-right: 20px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 9px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 30px;
          height: 30px;
          border-radius: 10px;
        }
        .rotate {
          transition: All 0.4s ease-in-out;
          -webkit-transition: All 0.4s ease-in-out;
          -moz-transition: All 0.4s ease-in-out;
          -o-transition: All 0.4s ease-in-out;
          transform:rotate(180deg);
          -ms-transform:rotate(180deg); 	/* IE 9 */
          -moz-transform:rotate(180deg); 	/* Firefox */
          -webkit-transform:rotate(180deg); /* Safari ? Chrome */
          -o-transform:rotate(180deg);
        }
        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -18px;
          top: 12px;
          font-size: 10px;
          transition: All 0.4s ease-in-out;
          -webkit-transition: All 0.4s ease-in-out;
          -moz-transition: All 0.4s ease-in-out;
          -o-transition: All 0.4s ease-in-out;
        }
      }
    }
  }
}
</style>
