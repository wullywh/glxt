<template>
  <div class="box">
    <el-container>
      <el-header
        >电商后台管理系统
        <span @click="exit">退出</span>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <h4>|||</h4>
          <el-col :span="12">
            <el-menu
              default-active="2"
              class="el-menu-vertical-demo"
              @open="handleOpen"
              @close="handleClose"
              background-color="#333744"
              text-color="#fff"
              active-text-color="#ffd04b"
              :unique-opened="unique"
            >
              <el-submenu
                v-for="item in menus"
                :key="item.id"
                :index="item.id + ''"
              >
                <template slot="title">
                  <i class="el-icon-location"></i>
                  <span>{{ item.authName }}</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item
                    :index="ite.id + ''"
                    v-for="ite in item.children"
                    :key="ite.id"
                    @click="go_(ite.path)"
                  >
                    {{ ite.authName }}</el-menu-item
                  >
                </el-menu-item-group>
              </el-submenu>
            </el-menu>
          </el-col>
        </el-aside>
        <el-main>
          <h3 v-if="iswellcom">wellcome</h3>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import http from "../components/http/index";
export default {
  props: {},
  data() {
    return {
      menus: [],
      unique: true,
      iswellcom: true,
    };
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    go_(v) {
      this.iswellcom = false;
      this.$router.push(`/home/${v}`);
    },
    exit(){
      
    }
  },
  components: {},
  created() {
    // axios请求(获取菜单栏数据)
    http("/menus").then((res) => {
      this.menus = res.data;
    });
  },
};
</script>

<style scoped lang="scss">
.box {
  height: 100%;
  .el-container {
    height: 100%;
    .el-header {
      background-color: #373d41;
      line-height: 60px;
      color: #fff;
      font-size: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      span {
        width: 70px;
        height: 40px;
        background-color: #909399;
        border-radius: 6px;
        color: #fff;
        font-size: 16px;
        text-align: center;
        line-height: 40px;
      }
    }
    .el-aside {
      background-color: #333744;
      h4 {
        font-size: 16px;
        background-color: #4a5064;
        color: #fff;
        height: 30px;
        line-height: 30px;
        text-align: center;
      }
      .el-col {
        width: 100%;
      }
    }
  }
}
</style>
