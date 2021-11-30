<template>
  <div class="box">
    <el-container>
      <!-- hearder -->
      <el-header>
        电商后台管理系统
        <span @click="exit">退出</span>
      </el-header>
      <el-container>
        <!-- 侧边栏 -->
        <el-aside width="200px">
          <h4>|||</h4>
          <el-col :span="12">
            <el-menu
              :default-active="da_index"
              class="el-menu-vertical-demo"
              @open="handleOpen"
              @close="handleClose"
              background-color="#333744"
              text-color="#fff"
              active-text-color="#ffd04b"
              :unique-opened="unique"
              :router="true"
            >
              <!-- 一级菜单 -->
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
                  <!-- 二级菜单 -->
                  <el-menu-item
                    v-for="ite in item.children"
                    :index="'/' + ite.path"
                    :key="ite.id"
                    @click="default_active('/' + ite.path)"
                    :route="{ path: '/home/' + ite.path }"
                  >
                    <i class="el-icon-menu"></i>
                    <span slot="title">{{ ite.authName }}</span></el-menu-item
                  >
                </el-menu-item-group>
              </el-submenu>
            </el-menu>
          </el-col>
        </el-aside>
        <!-- 菜单对应内容区域 -->
        <el-main>
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
      // 当前激活项
      da_index: "",
    };
  },
  methods: {
    // 保存激活菜单的index值
    default_active(index) {
      console.log(index);
      this.da_index = index;
      sessionStorage.setItem("index", index);
    },
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
  mounted() {
    this.da_index = sessionStorage.getItem("index");
  },
};
</script>

<style scoped lang="scss">
.box {
  height: 100%;
  > .el-container {
    display: flex;
    height: 100%;
    box-sizing: border-box;
    flex-direction: column;
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
    .el-container {
      .el-aside {
        height: 100%;
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
          background-color: #333744;
          .el-menu {
            border-right: none;
          }
        }
      }
      .el-main {
        padding-top: 0;
        background-color: #eaedf1;
        height: 100%;
      }
    }
  }
}
// .box {
//   height: 100%;
//   .el-container {
//     height: 100%;
//     .el-header {
//       background-color: #373d41;
//       line-height: 60px;
//       color: #fff;
//       font-size: 20px;
//       display: flex;
//       justify-content: space-between;
//       align-items: center;
//       span {
//         width: 70px;
//         height: 40px;
//         background-color: #909399;
//         border-radius: 6px;
//         color: #fff;
//         font-size: 16px;
//         text-align: center;
//         line-height: 40px;
//       }
//     }
//     .el-aside {
//       background-color: #333744;
//       h4 {
//         font-size: 16px;
//         background-color: #4a5064;
//         color: #fff;
//         height: 30px;
//         line-height: 30px;
//         text-align: center;
//       }
//       .el-col {
//         width: 100%;
//       }
//     }
//     .el-container {
//       flex-grow: 1;
//       box-sizing: border-box;
//     }
//     .el-main {
//       height: 100%;
//       box-sizing: border-box;
//       padding-top: 0;
//       background-color: #eaedf1;
//       display: flex;
//       flex-direction: column;
//       .el-breadcrumb {
//         height: 50px;
//         line-height: 50px;
//       }
//     }
//   }
// }
// // 内容区域改变背景色
// .el-main {
//   background-color: #eaedf1;
// }
</style>
