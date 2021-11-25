<template>
  <div class="box">
    <el-container>
      <el-header>Header</el-header>
      <el-container>
        <el-aside width="200px">
          <el-col :span="12">
            <el-menu
              default-active="2"
              class="el-menu-vertical-demo"
              @open="handleOpen"
              @close="handleClose"
              background-color="#333744"
              text-color="#fff"
              active-text-color="#ffd04b"
              unique-opened="true"
            >
              <el-submenu
                v-for="item in menu"
                :key="item.id"
                :index="item.id + ''"
              >
                <template slot="title">
                  <i class="el-icon-location"></i>
                  <span>{{ item.authName }}</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item
                    :index="ite.id"
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
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {
      menu: [
        {
          authName: "用户管理",
          id: 1,
          children: [
            { authName: "用户列表", id: "1-1", path: "/home/userList" },
          ],
        },
        {
          authName: "用户管理",
          id: 2,
          children: [
            { authName: "添加用户", id: "2-1" },
            { authName: "修改用户", id: "2-2" },
            { authName: "删除用户", id: "2-3" },
            { authName: "启用或禁用用户", id: "2-4" },
            { authName: "用户角色分配", id: "2-5" },
          ],
        },
        {
          authName: "用户管理",
          id: 3,
          children: [
            { authName: "添加用户", id: "3-1" },
            { authName: "修改用户", id: "3-2" },
            { authName: "删除用户", id: "3-3" },
            { authName: "启用或禁用用户", id: "3-4" },
            { authName: "用户角色分配", id: "3-5" },
          ],
        },
        {
          authName: "用户管理",
          id: 4,
          children: [
            { authName: "添加用户", id: "4-1" },
            { authName: "修改用户", id: "4-2" },
            { authName: "删除用户", id: "4-3" },
            { authName: "启用或禁用用户", id: "4-4" },
            { authName: "用户角色分配", id: "4-5" },
          ],
        },
      ],
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
      this.$router.push(v);
    },
  },
  components: {},
};
</script>

<style scoped lang="scss">
.box {
  height: 100%;
  .el-container {
    height: 100%;
    .el-header {
      background-color: #373d41;
    }
    .el-aside {
      background-color: #333744;
      .el-col {
        width: 100%;
      }
    }
  }
}
</style>
