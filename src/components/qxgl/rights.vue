<template>
  <div class="rights">
    <!-- 面包屑，顶部路径 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="table">
      <el-table :data="tableData" style="width: 100%" border height="100%">
        <el-table-column label="#" type="index"> </el-table-column>
        <el-table-column label="权限名称" prop="authName"> </el-table-column>
        <el-table-column label="路径" prop="path"> </el-table-column>
        <el-table-column label="权限等级" prop="roleDesc">
          <template slot-scope="scope">
            <el-tag size="small" v-if="scope.row.level == 0">一级</el-tag>
            <el-tag type="success" size="small" v-else-if="scope.row.level == 1"
              >二级</el-tag
            >
            <el-tag type="warning" size="small" v-else>三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import http from "./../http/index";
export default {
  props: {},
  data() {
    return {
      tableData: [],
    };
  },
  methods: {},
  components: {},
  created() {
    http("rights/list").then((res) => {
      this.tableData = res.data;
    });
  },
};
</script>

<style scoped lang="scss">
.rights {
  box-sizing: border-box;
  height: 100%;
  display: flex;
  flex-direction: column;
  .el-breadcrumb {
    height: 50px;
    line-height: 50px;
  }
  .table {
    margin-top: 10px;
    background: white;
    padding: 10px 20px 20px 20px;
    flex-grow: 1;
    //搜索框
    // .el-select .el-input {
    //   width: 130px;
    // }
  }
}
</style>
