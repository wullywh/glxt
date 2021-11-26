<template>
  <div>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="date" label="#" width="70"> </el-table-column>
      <el-table-column prop="name" label="邮箱" width="170"> </el-table-column>
      <el-table-column prop="date" label="电话" width="170"> </el-table-column>
      <el-table-column prop="name" label="角色" width="170"> </el-table-column>
      <el-table-column prop="date" label="状态" width="170"> </el-table-column>
      <el-table-column prop="name" label="操作" width="170">
        <el-switch
          v-model="value"
          active-color="#13ce66"
          inactive-color="#ff4949"
        >
        </el-switch>
      </el-table-column>
      <el-table-column prop="address" label="地址" width="205">
        <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
        <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
        <el-button
          type="warning"
          icon="el-icon-setting"
          size="mini"
        ></el-button>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
// import http from "./../components/http/index";
export default {
  props: {},
  data() {
    return {
      value: true,
      tableData: [
        {
          date: "1",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄",
        },
        {
          date: "3",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄",
        },
        {
          date: "4",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄",
        },
      ],
    };
  },
  methods: {},
  components: {},
};
</script>

<style scoped lang="scss">
.el-table__header {
  overflow: hidden;
}
</style>
