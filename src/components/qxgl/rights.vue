<template>
  <div class="rights">
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
  padding: 20px;
  background-color: #fff;
}
</style>
