<template>
  <div class="navbar">
    <hamburger
      id="hamburger-container"
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />
    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />
    <div class="right-menu">
      <template v-if="device !== 'mobile'">
        <search id="header-search" class="right-menu-item" />
        <el-tooltip content="全屏缩放" effect="dark" placement="bottom">
          <screenfull id="screenfull" class="right-menu-item hover-effect" />
        </el-tooltip>
        <el-tooltip content="布局设置" effect="dark" placement="bottom">
          <size-select id="size-select" class="right-menu-item hover-effect" />
        </el-tooltip>
      </template>
      <el-dropdown
        class="avatar-container right-menu-item hover-effect"
        trigger="click"
      >
        <div class="avatar-wrapper">
          <img
            :src="
              user.avatarName ? baseApi + '/avatar/' + user.avatarName : Avatar
            "
            class="user-avatar"
          />
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <span style="display: block" @click="show = true">
            <el-dropdown-item> 布局设置 </el-dropdown-item>
          </span>
          <router-link to="/user/center">
            <el-dropdown-item> 个人中心 </el-dropdown-item>
          </router-link>
          <span style="display: block" @click="open">
            <el-dropdown-item divided> 退出登录 </el-dropdown-item>
          </span>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { AppModule } from '@/store/modules/app'
import { UserModule } from '@/store/modules/user'
import { SettingsModule } from '@/store/modules/settings'
import { ApiModule } from '@/store/modules/api'
import Breadcrumb from '@/components/Breadcrumb/Index.vue'
import Hamburger from '@/components/Hamburger/Index.vue'
import Screenfull from '@/components/Screenfull/Index.vue'
import SizeSelect from '@/components/SizeSelect/Index.vue'
import Search from '@/components/HeaderSearch/Index.vue'
import Avatar from '@/assets/images/avatar.png'

@Component({
  name: 'Navbar',
  components: {
    Breadcrumb,
    Hamburger,
    Screenfull,
    SizeSelect,
    Search
  }
})
export default class extends Vue {
  private Avatar = Avatar;
  private dialogVisible = false;

  get sidebar() {
    return AppModule.sidebar
  }

  get device() {
    return AppModule.device
  }

  get user() {
    return UserModule.user
  }

  get baseApi() {
    return ApiModule.baseApi
  }

  get show() {
    return SettingsModule.showSettings
  }

  set show(value: boolean) {
    SettingsModule.ChangeSetting({
      key: 'showSettings',
      value
    })
  }

  private toggleSideBar() {
    AppModule.toggleSideBar()
  }

  private open() {
    this.$confirm('确定注销并退出系统吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      this.logout()
    })
  }

  private async logout() {
    await UserModule.LogOut()
    location.reload()
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

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
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
