<template>
  <div class="shuju">
    <!-- 面包屑，顶部路径 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <div ref="main" class="shuj"></div>
  </div>
</template>

<script>
import http from "./../http/index";
import * as echarts from "echarts";
export default {
  props: {},
  data() {
    return {
      data: {},
    };
  },
  methods: {},
  components: {},
  mounted() {
    var myChart = echarts.init(this.$refs.main);
    http("/reports/type/1").then((res) => {
      let data = res.data;
      myChart.setOption(data);
    });
  },
};
</script>

<style scoped lang="scss">
.shuju {
  height: 100%;
  display: flex;
  flex-direction: column;
  .el-breadcrumb {
    height: 50px;
    line-height: 50px;
  }
}
.shuj {
  width: 100%;
  height: 100%;
  background-color: #fff;
  padding: 20px;
}
</style>
