<template>
  <div class="roles">
    <!-- 面包屑，顶部路径 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="table">
      <!-- 添加角色按钮 -->
      <button @click="isshow = true">添加角色</button>

      <!-- 角色列表表格 -->
      <el-table :data="rolesList" border stripe>
        <!-- 展开行的列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              v-for="item1 in scope.row.children"
              :key="item1.id"
              class="centerRow"
              @close="removeRight(scope.row, item1.id)"
            >
              <!-- 这一列，专门渲染 一级权限 -->
              <el-col :span="5" height="100%">
                <el-tag closable>{{ item1.authName }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 还剩余 19 列，分配给二三级权限 -->
              <el-col :span="19">
                <!-- 这里显示二三级权限 -->
                <el-row
                  v-for="item2 in item1.children"
                  :key="item2.id"
                  class="centerRow"
                  border
                  @close="removeRight(scope.row, item2.id)"
                >
                  <!-- 放二级权限 -->
                  <el-col :span="6">
                    <el-tag closable type="success">{{
                      item2.authName
                    }}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 放三级权限 -->
                  <el-col :span="18">
                    <el-tag
                      closable
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      @close="removeRight(scope.row, item3.id)"
                    >
                      {{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>

        <!-- 角色表格 -->
        <el-table-column label="#" type="index"> </el-table-column>
        <el-table-column label="角色名称" prop="roleName" width="200px">
        </el-table-column>
        <el-table-column label="角色描述" prop="roleDesc" width="400px">
        </el-table-column>
        <el-table-column label="操作" min-width="300px">
          <!-- 操作单元格内的按钮 -->
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="quer(scope.row)">
              <i class="el-icon-edit"></i>
              编辑</el-button
            >
            <el-button size="mini" type="danger" @click="delete_(scope.row)"
              ><i class="el-icon-delete"></i> 删除</el-button
            >
            <el-button
              size="mini"
              type="warning"
              color="#e6a23c"
              @click="handleClose(scope.row)"
              ><i class="el-icon-setting"></i> 分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 添加角色对话框 -->
    <el-dialog title="提示" :visible.sync="isshow" width="45%">
      <p>角色名称:<input type="text" v-model="vname" /></p>
      <p>角色描述:<input type="text" v-model="vmiao" /></p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isshow = false">取 消</el-button>
        <el-button type="primary" @click="bianj">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 角色编辑对话框 -->
    <el-dialog title="提示" :visible.sync="isshowj" width="45%">
      <p>角色名称:<input type="text" v-model="sname" /></p>
      <p>角色描述:<input type="text" v-model="smiao" /></p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isshowj = false">取 消</el-button>
        <el-button type="primary" @click="quer_bianji">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配权限的对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="istree"
      width="50%"
      @open="open_quanx()"
      @close="close_quanx"
    >
      <!-- 权限树形结构 -->
      <el-tree
        ref="tree"
        :data="rightTree"
        :props="treeConfig"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defaultCheckedKeys"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="istree = false">取 消</el-button>
        <el-button type="primary" @click="saveRight">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import http from "./../http/index";
export default {
  props: {},
  data() {
    return {
      rolesList: [], //存放角色列表
      isshow: false, //控制添加角色对话框显示与隐藏
      isshowj: false, //控制编辑角色对话框
      vname: "",
      vmiao: "", //添加角色对话框邦定的值
      sname: "",
      smiao: "", //编辑角色对话框邦定的值
      rightTree: "", //权限树型结构数据
      istree: false, //树形结构对话框的显示与隐藏
      //   树形结构，权限名称
      treeConfig: {
        children: "children",
        label: "authName",
      },
      defaultCheckedKeys: [],
      bianj_id: "", //编辑角色id
      row: [],
      quanx_id: "", //编辑权限id
    };
  },
  methods: {
    //   请求角色列表
    axios_roles() {
      http("/roles").then((res) => {
        this.rolesList = res.data;
      });
    },
    // 角色编辑事件
    quer(row) {
      this.isshow = true;
      this.bianj_id = row.id;
      //   console.log(this.bianj_id);
    },
    // 点击确认添加角色
    bianj() {
      this.isshow = false;
      if (this.vname == "" || this.vmiao == "") {
        this.$message.error("请输入完整信息");
        return false;
      }
      // 请求添加角色接口
      http({
        url: "/roles",
        method: "post",
        data: {
          roleName: this.vname,
          roleDesc: this.vmiao,
        },
      }).then((res) => {
        if (res.meta == 400) {
          this.$message.error("添加角色失败");
        } else {
          this.$message({
            message: res.meta.msg,
            type: "success",
          });
          this.axios_roles();
          this.isshow = false;
        }
      });
    },
    // 点击编辑对话框内的确认按钮
    quer_bianji() {
      if (this.sname == "" || this.smiao == "") {
        this.$message.error("请输入完整信息");
        return false;
      }
      // 请求添加角色接口
      http({
        url: `/roles/${this.bianj_id}`,
        method: "put",
        data: {
          roleName: this.sname,
          roleDesc: this.smiao,
        },
      }).then((res) => {
        if (res.meta == 400) {
          this.$message.error("编辑角色失败");
        } else {
          this.$message({
            message: "编辑角色成功",
            type: "success",
          });
          this.axios_roles();
          this.isshowj = false;
        }
      });
    },
    // 删除角色权限
    removeRight(row, id) {
      console.log(row, id);
      //  请求删除角色权限接口
      http({
        url: `roles/${row.id}/rights/${id}`,
        method: "delete",
      }).then((res) => {
        if (res.meta.status !== 200) {
          return this.$message.error("删除权限失败！");
        }
        this.$message.success("删除权限成功！");
        // 删除成功后，重新渲染
        console.log(res);
        row.children = res.data;
      });
    },
    // 分配权限
    handleClose(row) {
      // 请求权限数据
      http("rights/tree").then((res) => {
        if (res.meta.status !== 200)
          return this.$message.error("初始化权限失败！");
        // 把权限的树形结构数据，保存到data中，供页面渲染使用
        this.rightTree = res.data;
        this.getLeafIds(row, this.defaultCheckedKeys);
        this.row = row;
        this.quanx_id = row.id;
        if (this.defaultCheckedKeys) {
          this.istree = true;
        }
      });
    },
    // 权限分配对话框展开时
    open_quanx() {
      // this.getLeafIds(row, this.defaultCheckedKeys);
      if (this.$refs.tree && this.defaultCheckedKeys) {
        this.$refs.tree.setCheckedNodes(this.defaultCheckedKeys);
      }
    },
    // 权限对话框关闭时
    close_quanx() {
      this.defaultCheckedKeys = [];
      this.$refs.tree.setCheckedNodes([]);
    },
    // 点击权限对话框的确认时
    saveRight() {
      // 拿到选中的节点key数组
      const arr1 = this.$refs.tree.getCheckedKeys();
      // 拿到半选中的节点key数组
      const arr2 = this.$refs.tree.getHalfCheckedKeys();
      // rids就是所有被选中节点权限，用于请求权限分配接口的参数
      const rids = [...arr1, ...arr2].join(",");
      http({
        url: `roles/${this.quanx_id}/rights`,
        method: "post",
        data: {
          rids,
        },
      }).then((res) => {
        if (res.meta.status !== 200) {
          return this.$message.error("分配权限失败！");
        }
        this.$message.success("分配权限成功！");
        // 分配权限成功后，重新请求，重新渲染页面
        this.axios_roles();
        this.istree = false;
      });
    },
    // 获取树形结构默认选中的id
    getLeafIds(node, keys) {
      if (!node.children) {
        keys.push(node.id);
      } else {
        node.children.forEach((item) => this.getLeafIds(item, keys));
      }
    },
    // 删除角色
    delete_(row) {
      this.$confirm("此操作将永久删除该角色, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // 请求删除角色接口
          http({
            url: `roles/${row.id}`,
            method: "delete",
          }).then((res) => {
            if (res.meta.status != 200)
              return this.$message.error("删除角色失败");
            this.axios_roles();
            this.$message({
              type: "success",
              message: "删除成功!",
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
  components: {},
  created() {
    //创建后调用方法，拿到用户列表数据
    this.axios_roles();
  },
};
</script>

<style scoped lang="scss">
.el-dialog {
  p {
    height: 50px;
    font-size: 18px;
    margin-top: 20px;
    input {
      margin-left: 10px;
      border: 1px solid #ccc;
      width: 80%;
      height: 40px;
    }
  }
}
.roles {
  height: 100%;
  .table {
    background-color: #fff;
    padding: 15px;
    > button {
      height: 45px;
      background-color: #409eff;
      color: #fff;
      border-radius: 5px;
      width: 100px;
      margin-bottom: 15px;
    }
  }
}
.el-breadcrumb {
  height: 50px;
  line-height: 50px;
}

.el-row {
  padding: 5px 10px;
  display: flex;
  align-items: center;
  .el-col {
    .el-tag {
      margin: 5px;
    }
  }
}
.bodt {
  border-top: 1px solid #ccc;
}
.bodb {
  border-bottom: 1px solid #ccc;
}
</style>
