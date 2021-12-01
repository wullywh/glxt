<template>
  <div class="wrap">
    <!-- 头部警告信息 -->
    <el-alert
      title="注意：只允许为第三级分类设置相关参数！"
      type="warning"
      show-icon
      :closable="false"
    >
    </el-alert>
    <!-- 选择商品分类 -->
    <div class="block">
      <span class="demonstration">选择商品分类：</span>
      <el-cascader
        v-model="value"
        :options="options"
        :props="{ label: 'cat_name', value: 'cat_id' }"
        @change="handleChange"
      ></el-cascader>
      <!-- 动态参数和静态属性 -->
      <el-tabs v-model="activeName" @tab-click="handleClick" class="nav_sess">
        <el-tab-pane label="动态参数" name="first">动态参数</el-tab-pane>
        <el-tab-pane label="静态属性" name="second">静态属性</el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import http from "../../components/http/index.js";
export default {
  props: {},
  data() {
    return {
      // 参数导航选项卡
      activeName: "first",
      value: [],
      //获取商品分类列表
      options: [],
    };
  },
  mounted() {
    //获取商品分类列表
    http({
      url: "/categories",
    }).then((res) => {
      this.options = res.data;
      console.log(res);
    });
  },
  methods: {
    // 选择商品分类
    handleClick(tab, event) {
      console.log(tab, event);
    },
    // 动态参数和静态属性
    handleChange(value) {
      console.log(value);
    },
  },
  components: {},
};
</script>

<style scoped lang="scss">
.wrap {
  padding: 20px;
  box-sizing: border-box;
  background-color: #fff;
}
.block {
  margin: 20px 0;
}
.nav_sess {
  margin-top: 20px;
}
</style>
