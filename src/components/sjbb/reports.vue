<template>
  <div ref="main" class="shuj"></div>
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
.shuj {
  width: 100%;
  height: 100%;
  background-color: #fff;
  padding: 20px;
}
</style>
