<template>
  <div class="splb">
    <!-- 面包屑，顶部路径 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="table">
      <!-- 搜索查找框 -->
      <div style="margin-top: 15px">
        <el-input
          placeholder="请输入内容"
          v-model="query"
          class="input-with-select"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="search"
          ></el-button>
        </el-input>
        <el-button type="primary" @click="add">添加商品</el-button>
      </div>
      <!-- 表格信息 -->
      <el-table :data="tableData" border stripe style="width: 100%">
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column
          prop="goods_name"
          label="商品名称"
          width="500"
        ></el-table-column>
        <el-table-column
          prop="goods_price"
          label="商品价格（元）"
          width="180"
        ></el-table-column>
        <el-table-column
          prop="goods_weight"
          label="商品重量"
          width="180"
        ></el-table-column>
        <el-table-column
          prop="add_time"
          label="创建时间"
          width="180"
        ></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">
              <i class="el-icon-edit"></i>
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
            >
              <i class="el-icon-delete"></i>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagenum"
        :page-sizes="[10, 20, 30, 40]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>

      <!-- 修改信息 -->
      <el-dialog title="修改信息" :visible.sync="dialogFormVisible">
        <el-form :model="form">
          <el-form-item label="商品名称" :label-width="formLabelWidth">
            <el-input v-model="form.goods_name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="商品价格（元）" :label-width="formLabelWidth">
            <el-input v-model="form.goods_price" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="商品数量" :label-width="formLabelWidth">
            <el-input v-model="form.goods_number" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="商品重量" :label-width="formLabelWidth">
            <el-input v-model="form.goods_weight" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="changeover">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import http from "../http/index";
export default {
  props: {},
  data() {
    return {
      // 当前页列表
      tableData: [],
      // 指向第几页 以及每页默认显示数量
      pagenum: 1,
      pagesize: 10,
      // 总数量
      total: 0,
      //搜索参数
      query: "",
      //修改信息
      changeid: "",
      dialogFormVisible: false,
      form: {
        goods_name: "",
        goods_number: "",
        goods_price: "",
        goods_weight: "",
      },
      formLabelWidth: "120px",
    };
  },
  methods: {
    // 搜索
    search() {
      http({
        url: `/goods?pagenum=${this.pagenum}&pagesize=${this.pagesize}&query=${this.query}`,
      }).then((res) => {
        console.log(res);
        (this.tableData = res.data.goods),
          (this.total = res.data.total),
          (this.pagenum = parseInt(res.data.pagenum));
      });
    },
    // 添加数据
    add() {
      this.$router.push("/home/addgoods");
    },
    //修改数据
    handleEdit(index, row) {
      console.log(index, row);
      this.dialogFormVisible = true;
      this.changeid = row.goods_id;
      http({
        url: `goods/${this.changeid}`,
      }).then((res) => {
        console.log(res);
        this.form.goods_name = res.data.goods_name;
        this.form.goods_number = res.data.goods_number;
        this.form.goods_price = res.data.goods_price;
        this.form.goods_weight = res.data.goods_weight;
        this.form.goods_cat = res.data.goods_cat;
      });
    },
    changeover() {
      console.log(this.form.goods_name);
      http({
        url: `goods/${this.changeid}`,
        method: "put",
        data: {
          goods_name: this.form.goods_name,
          goods_number: this.form.goods_number,
          goods_price: this.form.goods_price,
          goods_weight: this.form.goods_weight,
          goods_cat: this.form.goods_cat,
        },
      }).then((res) => {
        console.log(res, this.changeid);
        http({
          url: `/goods?pagenum=${this.pagenum}&pagesize=${this.pagesize}`,
        }).then((res) => {
          (this.tableData = res.data.goods),
            (this.total = res.data.total),
            (this.pagenum = parseInt(res.data.pagenum));
          console.log(this.tableData);
        });
      });
      this.dialogFormVisible = false;
    },
    // 删除数据
    handleDelete(index, row) {
      console.log(index, row);
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          http({
            url: `/goods/${row.goods_id}`,
            method: "delete",
          }).then((res) => {
            console.log(res);
            http({
              url: `/goods?pagenum=${this.pagenum}&pagesize=${this.pagesize}`,
            }).then((res) => {
              (this.tableData = res.data.goods),
                (this.total = res.data.total),
                (this.pagenum = parseInt(res.data.pagenum));
              console.log(this.tableData);
            });
          });
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 分页器
    // 每页多少条
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pagesize = `${val}`;
      http({
        url: `/goods?pagenum=${this.pagenum}&pagesize=${this.pagesize}`,
      }).then((res) => {
        (this.tableData = res.data.goods),
          (this.total = res.data.total),
          (this.pagenum = parseInt(res.data.pagenum));
      });
    },
    // 选择第几页
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.pagenum = parseInt(`${val}`);
      http({
        url: `/goods?pagenum=${this.pagenum}&pagesize=${this.pagesize}`,
      }).then((res) => {
        (this.tableData = res.data.goods),
          (this.total = res.data.total),
          (this.pagenum = parseInt(res.data.pagenum));
      });
    },
    // 封装时间戳转正常时间
  },

  mounted() {
    http({
      url: `/goods?pagenum=${this.pagenum}&pagesize=${this.pagesize}`,
    }).then((res) => {
      (this.tableData = res.data.goods),
        (this.total = res.data.total),
        (this.pagenum = parseInt(res.data.pagenum));
      console.log(this.tableData);
    });
  },

  components: {},
};
</script>

<style scoped lang="scss">
.splb {
  width: 100%;
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
    background: white;
    padding: 10px 20px 20px 20px;
  }
}
//搜索框
.el-select .el-input {
  width: 130px;
}
.input-with-select .el-input-group__prepend {
  background-color: #fff;
}
.input-with-select {
  width: 345px;
  margin-right: 21px;
}
</style>
