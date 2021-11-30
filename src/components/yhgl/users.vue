<template>
  <div class="user_wrap">
    <!-- 面包屑路径 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="table">
      <!-- 搜索框 -->
      <div style="margin: 15px 0">
        <el-input
          placeholder="请输入内容"
          v-model="inp"
          class="input-with-select"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="search_more"
          ></el-button>
        </el-input>
        <el-button type="primary" @click="dialogFormVisible = true"
          >添加用户</el-button
        >
      </div>
      <!-- 添加用户 -->
      <el-dialog title="添加用户" :visible.sync="dialogFormVisible">
        <el-form :model="form">
          <el-form-item label="用户名" :label-width="formLabelWidth">
            <el-input v-model="form.user" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="密码" :label-width="formLabelWidth">
            <el-input v-model="form.pass" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" :label-width="formLabelWidth">
            <el-input v-model="form.email" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="手机" :label-width="formLabelWidth">
            <el-input v-model="form.mobile" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="add_user">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 编辑用户 -->
      <el-dialog title="编辑用户" :visible.sync="dialogTable">
        <el-form :model="edit_user">
          <el-form-item label="用户名" :label-width="formLabelWidth">
            <el-input
              v-model="edit_user.user"
              autocomplete="off"
              disabled
            ></el-input>
          </el-form-item>
          <el-form-item label="邮箱" :label-width="formLabelWidth">
            <el-input v-model="edit_user.email" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="手机" :label-width="formLabelWidth">
            <el-input v-model="edit_user.mobile" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogTable = false">取 消</el-button>
          <el-button type="primary" @click="edit_">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 分配角色 -->
      <el-dialog title="分配角色" :visible.sync="role_bol">
        <el-form :model="edit_user">
          <el-form-item label="当前的用户：" :label-width="formLabelWidth">
            <span>{{ edit_role.user }}</span>
          </el-form-item>
          <el-form-item label="当前的角色：" :label-width="formLabelWidth">
            <span>{{ edit_role.role_name }}</span>
          </el-form-item>
          <el-form-item label="分配新角色：" :label-width="formLabelWidth">
            <el-select placeholder="请选择" v-model.number="value_">
              <el-option
                v-for="item in role_arr"
                :key="item.id"
                :label="item.roleName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="role_bol = false">取 消</el-button>
          <el-button type="primary" @click="role_">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 列表 -->
      <el-table :data="tableData" border style="width: 96%">
        <el-table-column prop="id" label="#" width="60"> </el-table-column>
        <el-table-column prop="username" label="姓名" width="150">
        </el-table-column>
        <el-table-column prop="email" label="邮箱" width="160">
        </el-table-column>
        <el-table-column prop="mobile" label="电话" width="160">
        </el-table-column>
        <el-table-column prop="role_name" label="角色" width="150">
        </el-table-column>
        <el-table-column prop="mg_state" label="状态" width="150">
          <template slot-scope="scope">
            <!-- 开 关 -->
            <el-switch
              v-model="scope.row.mg_state"
              @change="stateChanged(scope.row.id, scope.row.mg_state)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="操作" min-width="180px">
          <template slot-scope="scope">
            <!-- 编辑 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="handleEdit(scope.$index, scope.row)"
            ></el-button>
            <!-- 删除 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="handleDelete(scope.row)"
            ></el-button>
            <!-- 设置 -->
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="setting(scope.$index, scope.row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页器 -->
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pagenum"
          :page-sizes="[5, 10, 15, 20]"
          :page-size="pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import http from "../../components/http/index.js";
export default {
  props: {},
  data() {
    return {
      value: true,
      currentPage: 1, //页码默认是第一页
      inp: "", //搜索框
      tableData: [], //用户信息
      total: null, //用户信息总数
      pagenum: 1, //页码
      pagesize: 5, //每页数量
      // 添加用户信息
      dialogFormVisible: false,
      form: {
        user: "",
        pass: "",
        email: "",
        mobile: "",
      },
      formLabelWidth: "120px",
      // 编辑用户信息
      // 打开弹窗
      dialogTable: false,
      edit_user: {
        id: null,
        user: "",
        email: "",
        mobile: "",
      },
      //分配用户角色
      role_bol: false,
      edit_role: {
        id: null,
        role_id: null,
        user: "",
        role_name: "",
      },
      //角色数组
      role_arr: [],
      value_: "",
    };
  },
  mounted() {
    // 列表加载渲染,默认渲染第一页内容
    this.refrsh();
    //获取角色列表
    http({
      url: "/roles",
    }).then((res) => {
      this.role_arr = res.data;
    });
  },
  methods: {
    //搜索
    search_more() {
      http({
        url: `/users?query=${this.inp}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`,
      }).then((res) => {
        this.tableData = res.data.users;
        this.total = res.data.total;
      });
    },
    // 改变用户状态
    stateChanged(id, mg_state) {
      http({
        url: `/users/${id}/state/${mg_state}`,
        method: "put",
      }).then((res) => {
        console.log(res);
      });
    },
    // 编辑用户信息
    handleEdit(index, row) {
      this.dialogTable = true;
      this.edit_user.id = row.id;
      this.edit_user.user = row.username;
      this.edit_user.email = row.email;
      this.edit_user.mobile = row.mobile;
    },
    // 提交编辑信息
    edit_() {
      http({
        url: `/users/${this.edit_user.id}`,
        method: "put",
        data: {
          // username: this.edit_user.user,
          email: this.edit_user.email,
          mobile: this.edit_user.mobile,
        },
      }).then((res) => {
        console.log(res);
        // 编辑失败
        if (res.meta.status == 400) {
          this.$message.error(res.meta.msg);
        } else {
          // 编辑成功
          this.$message({
            message: res.meta.msg,
            type: "success",
          });
          this.refrsh();
        }
        this.dialogTable = false;
      });
    },

    //删除
    handleDelete(row) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          http({
            url: `/users/${row.id}`,
            method: "delete",
          }).then((res) => {
            this.$message({
              type: "success",
              message: res.meta.msg,
            });
            this.refrsh();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 角色弹窗的数据绑定
    setting(index, row) {
      console.log(index, row);
      this.edit_role.id = row.id;
      this.edit_role.user = row.username;
      this.edit_role.role_name = row.role_name;
      this.role_bol = true;
    },
    //修改角色
    role_() {
      http({
        url: `/users/${this.edit_role.id}/role`,
        method: "put",
        data: {
          rid: this.value_,
        },
      }).then((res) => {
        console.log(this.value_);
        // 修改失败
        if (res.meta.status == 400) {
          this.$message.error(res.meta.msg);
        } else {
          // 修改成功
          this.$message({
            message: res.meta.msg,
            type: "success",
          });
          this.refrsh();
        }
        this.role_bol = false;
      });
    },

    // 分页器的方法
    // 每页显示条数改变时会触发pageSize
    handleSizeChange(val) {
      this.pagesize = parseInt(`${val}`);
      http({
        url: "/users",
        params: {
          pagenum: this.pagenum,
          pagesize: this.pagesize,
        },
      }).then((res) => {
        this.tableData = res.data.users;
        this.total = res.data.total;
      });
    },
    // 当前页数currentPage 改变时会触发
    handleCurrentChange(val) {
      this.pagenum = parseInt(`${val}`);
      // 点击页码重新渲染列表页
      this.refrsh();
    },
    // 添加用户
    add_user() {
      if (this.user == "") {
        this.$message({
          message: "请输入用户名",
          type: "warning",
        });
      }
      if (this.pass == "") {
        this.$message({
          message: "请输入密码",
          type: "warning",
        });
      }
      if (this.pass != "" && this.user != "") {
        http({
          url: "/users",
          method: "post",
          data: {
            username: this.form.user,
            password: this.form.pass,
            email: this.form.email,
            mobile: this.form.mobile,
          },
        }).then((res) => {
          // console.log(res);
          // 添加失败
          if (res.meta.status == 400) {
            this.$message.error(res.meta.msg);
          } else {
            // 添加成功
            this.$message({
              message: res.meta.msg,
              type: "success",
            });
            this.refrsh();
          }
          this.dialogFormVisible = false;
        });
      }
    },
    // 添加用户

    // 封装渲染刷新页面的请求
    refrsh() {
      http({
        url: "/users",
        params: {
          pagenum: this.pagenum,
          pagesize: this.pagesize,
        },
      }).then((res) => {
        this.tableData = res.data.users;
        this.total = res.data.total;
      });
    },
  },
  components: {},
};
</script>

<style scoped lang="scss">
.user_wrap {
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  .el-breadcrumb {
    height: 50px;
    line-height: 50px;
  }
  .table {
    flex-grow: 1;
    background-color: #fff;
    padding: 15px;
    display: flex;
    flex-direction: column;
    > div {
      margin-bottom: 15px;
    }
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
// 分页器
.block {
  margin-top: 20px;
}
</style>
