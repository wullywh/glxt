<template>
  <div class="box">
    <el-container>
      <el-header>
        电商后台管理系统
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
              <el-submenu v-for="item in menus" :key="item.id" :index="item.id + ''">
                <template slot="title">
                  <i class="el-icon-location"></i>
                  <span>{{ item.authName }}</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item
                    :index="ite.id + ''"
                    v-for="ite in item.children"
                    :key="ite.id"
                    @click="go_(ite.path, ite.authName)"
                  >
                    {{ ite.authName }}</el-menu-item
                  >
                </el-menu-item-group>
              </el-submenu>
            </el-menu>
          </el-col>
        </el-aside>
        <el-main>
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }"
              >首页</el-breadcrumb-item
            >
            <el-breadcrumb-item v-show="path_1">{{
              path_1
            }}</el-breadcrumb-item>
            <el-breadcrumb-item v-show="path_2">{{
              path_2
            }}</el-breadcrumb-item>
          </el-breadcrumb>
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
      path_1: "",
      path_2: "",
    };
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
      let a = this.menus.filter((item) => {
        return item.id == key;
      });
      console.log(a);
      this.path_1 = a[0].authName;
      this.path_2 = "";
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    go_(v, t) {
      this.iswellcom = false;
      this.$router.push(`/home/${v}`);
      this.path_2 = t;
    },
    exit() {
      // 退出登录消息提示
      this.$confirm("是否退出登录?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "退出成功",
          });
          // 执行退出登录操作
          setTimeout(() => {
            sessionStorage.removeItem("token");
            this.$router.push("/login");
          }, 2000);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消退出",
          });
        });
    },
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
    .el-main {
      padding-top: 0;
      background-color: #eaedf1;
      .el-breadcrumb {
        height: 50px;
        line-height: 50px;
      }
    }
  }
}
// 内容区域改变背景色
.el-main {
  background-color: #eaedf1;
}
</style>
