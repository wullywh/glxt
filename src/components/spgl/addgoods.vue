<template>
  <div class="add">
    <el-alert type="info" :closable="false" center>
      <i class="el-icon-info"></i>添加商品信息
    </el-alert>
    <!-- 横向步骤条 -->
    <el-steps :active="active" finish-status="success">
      <el-step title="基本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
      <el-step title="完成"></el-step>
    </el-steps>
    <div class="contant">
      <el-tabs
        tab-position="left"
        style="height: 200px"
        @tab-click="activeto"
        :before-leave="beforeleave"
      >
        <!-- 基本信息 -->
        <el-tab-pane label="基本信息">
          <el-form
            :model="addForm"
            :rules="rules"
            ref="ruleForm"
            label-width="100px"
            class="demo-ruleForm"
            label-position="top"
          >
            <el-form-item label="商品名称" prop="name">
              <el-input v-model="addForm.name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="name">
              <el-input v-model="addForm.price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="name">
              <el-input v-model="addForm.weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="name">
              <el-input v-model="addForm.number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类">
              <el-cascader
                :options="cateList"
                v-model="addForm.cat"
                :props="{
                  expandTrigger: 'hover',
                  label: 'cat_name',
                  value: 'cat_id',
                }"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <!-- 商品参数 -->
        <el-tab-pane label="商品参数">
          <div v-for="item in manyData" :key="item.attr_id">
            <p>{{ item.attr_name }}</p>
            <el-checkbox v-model="checkList" :lable="item.attr_name" border>{{
              item.attr_vals
            }}</el-checkbox>
          </div>
        </el-tab-pane>
        <!-- 商品属性 -->
        <el-tab-pane label="商品属性">
          <el-form label-position="top" label-width="80px" :model="onlyData_">
            <el-form-item
              :label="ite.attr_name"
              v-for="ite in onlyData"
              :key="ite.attr_id"
            >
              <el-input :value="ite.attr_vals"></el-input>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <!-- 商品图片 -->
        <el-tab-pane label="商品图片">
          <el-upload
            class="upload-demo"
            action="https://jsonplaceholder.typicode.com/posts/"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :file-list="fileList"
            list-type="picture"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件，且不超过500kb
            </div>
          </el-upload>
        </el-tab-pane>
        <!-- 商品内容 -->
        <el-tab-pane label="商品内容">
          <quill-editor v-model="addForm.goods_introduce"></quill-editor>
          <el-button type="primary" @click="add_go">添加商品</el-button>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import http from "../http/index";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

export default {
  props: {},
  data() {
    return {
      active: 0,
      // 表单填入信息
      addForm: {
        name: "",
        price: "",
        number: "",
        weight: "",
        cat: "",
        attributes: "",
        goods_introduce: "",
      },
      // 表单验证规则
      rules: {
        name: [{ required: true, message: "请输入信息", trigger: "blur" }],
      },
      // 多级链表
      cateList: [],
      // 多级链表最后选中的分类id
      cateId: "",
      // 动态参数列表
      manyData: {},
      checkList: [],
      // 静态属性列表
      onlyData: {},
      onlyData_: {
        name: "",
      },
      // 图片上传
      fileList: [
        {
          name: "food.jpeg",
          url: "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100",
        },
      ],
    };
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
      this.active = parseInt(key - 1);
    },
    // 左边选择 进度条变化
    activeto(v) {
      console.log(v);
      this.active = parseInt(v.paneName);
    },
    // 商品分类选择
    handleChange(value) {
      // console.log(value);
      // 获取最后选中的参数id
      let sel_id = value[value.length - 1];
      // console.log(sel_value);
      this.cateId = sel_id;
      //请求商品动态参数
      http({
        url: `categories/${this.cateId}/attributes`,
        params: { sel: "many" },
      }).then((res) => {
        console.log(res);
        this.manyData = res.data;
      });
      //请求商品静态属性
      http({
        url: `categories/${this.cateId}/attributes`,
        params: { sel: "only" },
      }).then((res) => {
        console.log(res);
        this.onlyData = res.data;
      });
    },
    // 离开第一个标签页做判断
    beforeleave(activeName, oldActiveName) {
      console.log(activeName, oldActiveName);
      if (oldActiveName === "0" && this.addForm.cat.length < 3) {
        this.$message.error("请先选择商品分类");
        return false;
      }
    },
    // 删除图片
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    // 预览图片
    handlePreview(file) {
      console.log(file);
      this.previewImgSrc = file.response.data.url;
      this.previewVisible = true;
    },
    // 添加商品
    add_go() {
      http({
        url: "/goods",
        method: "post",
        data: {
          goods_name: this.addForm.name,
          goods_cat: this.addForm.cat.join(),
          goods_price: this.addForm.price,
          goods_number: this.addForm.number,
          goods_weight: this.addForm.weight,
        },
      }).then((res) => {
        console.log(res);
        this.$router.push("/home/goods");
      });
    },
  },
  mounted() {
    // 请求分类信息
    http({
      url: "/categories",
    }).then((res) => {
      console.log(res);
      this.cateList = res.data;
    });
  },
  components: {},
};
</script>

<style scoped lang="scss">
.add {
  width: 100%;
  padding: 10px 20px 20px 20px;
  background: white;
  box-sizing: border-box;
  flex: 1;
  display: flex;
  flex-direction: column;
}
.el-alert[type="info"] {
  text-align: center;
}
.el-steps {
  padding: 0px 40px;
}
.el-tabs {
  height: 100% !important;
}
</style>
