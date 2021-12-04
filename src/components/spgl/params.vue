<template>
  <div class="wrap">
    <!-- 面包屑，顶部路径 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="table">
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
          <el-tab-pane label="动态参数" name="first">
            <!-- 动态参数 -->
            <el-button type="primary" @click="dong_c = true"
              >添加参数</el-button
            >
            <el-table
              :data="tableData"
              style="width: 100%"
              border
              @expand-change="zhank_"
            >
              <!-- 展开行 -->
              <el-table-column type="expand">
                <template>
                  <el-tag type="success">{{ zhank_data.attr_name }}</el-tag>
                  <el-tag type="info">{{ zhank_data.attr_write }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="#" type="index"> </el-table-column>
              <el-table-column label="参数名称" prop="attr_name">
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button
                    type="primary"
                    icon="el-icon-edit"
                    @click="bianj(scope.row)"
                    >编辑</el-button
                  >
                  <el-button
                    type="danger"
                    icon="el-icon-delete"
                    @click="delete_(scope.row)"
                    >删除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>

          <!-- 静态属性 -->
          <el-tab-pane label="静态属性" name="second">
            <el-button type="primary" @click="dong_c = true"
              >添加参数</el-button
            >
            <el-table
              :data="tableData"
              style="width: 100%"
              border
              @expand-change="zhank_"
            >
              <el-table-column type="expand">
                <template> </template>
              </el-table-column>
              <el-table-column label="#" type="index"> </el-table-column>
              <el-table-column label="参数名称" prop="attr_name">
              </el-table-column>
              <el-table-column label="操作" width="250">
                <template slot-scope="scope">
                  <el-button
                    type="primary"
                    icon="el-icon-edit"
                    @click="bianj(scope.row)"
                    >编辑</el-button
                  >
                  <el-button
                    type="danger"
                    icon="el-icon-delete"
                    @click="delete_(scope.row)"
                    >删除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>

    <!-- 添加动态参数 -->
    <el-dialog title="添加动态参数" :visible.sync="dong_c">
      <el-form>
        <el-form-item label="动态参数" label-width="80px">
          <el-input v-model="d_name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dong_c = false">取 消</el-button>
        <el-button type="primary" @click="dongt_quer">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑参数参数 -->
    <el-dialog title="修改参数" :visible.sync="isbianj">
      <el-form>
        <el-form-item label="动态参数" label-width="80px">
          <el-input v-model="b_name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isbianj = false">取 消</el-button>
        <el-button type="primary" @click="xiugai_quer">确 定</el-button>
      </div>
    </el-dialog>
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
      // 分类参数id
      fenlId: "",
      sel: "many", //参数
      tableData: [], //分类参数数据

      dong_c: false, //添加动态参数对话框
      d_name: "", //添加动态参数

      isbianj: false, //编辑参数对话框
      b_name: "", //编辑参数
      bj_id: "", //编辑参数id

      zhank_data: "", //展开行数据
    };
  },
  mounted() {
    //获取商品分类列表
    http({
      url: "/categories",
    }).then((res) => {
      this.options = res.data;
    });

    // 请求展开行的数据
    http({
      url: `categories/${this.fenlId}/attributes/${this}`,
      params: {
        attr_sel: this.sel,
      },
    });
  },
  methods: {
    // 请求动态,静态参数
    axios_cans() {
      http({
        url: `categories/${this.fenlId}/attributes`,
        params: {
          sel: this.sel,
        },
      }).then((res) => {
        console.log(res);
        this.tableData = res.data;
      });
    },
    // 请求添加动态参数和静态属性
    axios_add() {
      return http({
        url: `categories/${this.fenlId}/attributes`,
        method: "post",
        data: {
          attr_name: this.d_name,
          attr_sel: this.sel,
        },
      });
    },
    // 选择商品分类(动态参数和静态属性)
    handleClick(tab) {
      if (tab._props.label == "动态参数") {
        this.sel = "many";
      }
      if (tab._props.label == "静态属性") {
        this.sel = "only";
      }
      this.axios_cans();
    },
    //获取商品分类选项
    handleChange(value) {
      this.fenlId = value[2];
      if (value) {
        console.log(value);
        this.axios_cans();
      }
    },
    // 确认修改动态参数
    dongt_quer() {
      if (this.fenlId == "") {
        this.$message.error("请选择商品类型");
        this.dong_c = false;
        this.d_name = "";
        return;
      }
      this.axios_add().then((res) => {
        if (res.meta.status == 400) {
          return this.$message.error("获取动态参数列表失败！");
        } else {
          this.$message({
            type: "success",
            message: res.meta.msg,
          });
          this.tableData.push(res.data);
          this.d_name = "";
        }
      });
      this.dong_c = false;
    },
    // 删除分类参数
    delete_(row) {
      console.log(row);
      this.$confirm("此操作将永久删除该参数, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // 请求删除参数接口
          http({
            url: `categories/${this.fenlId}/attributes/${row.attr_id}`,
            method: "delete",
          }).then((res) => {
            if (res.meta.status == 400) {
              this.$message.error("删除分类参数失败");
            } else {
              this.$message({
                type: "success",
                message: res.meta.msg,
              });
              // 删除成功，刷新数据
              this.axios_cans();
            }
            console.log(res);
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 编辑参数
    bianj(row) {
      console.log(row);
      this.bj_id = row.attr_id;
      this.isbianj = true;
    },
    // 点击确认编辑
    xiugai_quer() {
      console.log(this.bj_id);
      // 请求确认编辑参数接口
      http({
        url: `categories/${this.fenlId}/attributes/${this.bj_id}`,
        method: "put",
        data: {
          attr_name: this.b_name,
          attr_sel: this.sel,
        },
      }).then((res) => {
        console.log(res);
        if (res.meta.status !== 200) {
          this.$message.error("修改参数失败");
        } else {
          this.$message({
            type: "success",
            message: res.meta.msg,
          });
          this.axios_cans();
          this.b_name = "";
          this.isbianj = false;
        }
      });
    },

    //展开行数据
    zhank_(row) {
      console.log(row);
      // 请求展开行数据接口
      http({
        url: `categories/${this.fenlId}/attributes/${row.attr_id}`,
        params: {
          attr_sel: this.sel,
        },
      }).then((res) => {
        this.zhank_data = res.data;
      });
    },
  },
  components: {},
};
</script>

<style scoped lang="scss">
.wrap {
  box-sizing: border-box;
  flex: 1;
  padding-top: 0;
  box-sizing: border-box;
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
  }
}
.block {
  margin: 20px 0;
}
.nav_sess {
  margin-top: 20px;
}
.el-table {
  margin-top: 15px;
  .el-tag {
    margin-left: 15px;
  }
}
</style>
