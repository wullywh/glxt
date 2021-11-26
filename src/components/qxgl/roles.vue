<template>
  <div class="jues">
    <el-table :data="tableData" height="250" border style="width: 100%">
      <el-table-column prop="date" label="" width="60">
        <i class="el-icon-arrow-right"></i>
      </el-table-column>
      <el-table-column type="index" label="#" width="60"> </el-table-column>
      <el-table-column prop="roleName" label="角色名称" width="180">
      </el-table-column>
      <el-table-column prop="roleDesc" label="角色描述"> </el-table-column>
      <el-table-column label="操作">
        <span>
          <i class="el-icon-edit"></i>
          编辑</span
        >
        <span>
          <i class="el-icon-delete"></i>
          删除</span
        >
        <span>
          <i class="el-icon-setting"></i>
          分配权限</span
        >
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
    http("/roles").then((res) => {
      this.tableData = res.data;
      console.log(this.tableData);
    });
  },
};
</script>

<style scoped lang="scss">
</style>
