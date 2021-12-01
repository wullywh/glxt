<template>
  <div class="jues">
    <!-- 点击分配权限显示的权限列表 -->
    <el-dialog
      title="分配权限"
      :visible.sync="dialogVisible"
      width="50%"
      :before-close="handleClose"
    >
      <!-- 权限列表 -->
      <el-tree
        ref="tree"
        :data="rightTree"
        :props="treeConfig"
        show-checkbox
        node-
        key="id"
        default-expand-all
        :default-checked-keys="defaultCheckedKeys"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 添加角色 -->
    <button @click="isshow = true">添加角色</button>
    <el-table :data="tableData" style="width: 100%" border height="85%">
      <!-- 下拉弹出权限分配 -->
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-row
            v-for="item1 in props.row.children"
            :key="item1.id"
            class="centerRow"
          >
            <!-- 这一列，专门渲染 一级权限 -->
            <el-col :span="5">
              <el-tag closable @close="removeRight(scope.row, item1.id)">{{
                item1.authName
              }}</el-tag>
              <i class="el-icon-caret-right"></i>
            </el-col>
            <!-- 还剩余 19 列，分配给二三级权限 -->
            <el-col :span="19">
              <!-- 这里显示二三级权限 -->
              <el-row
                v-for="item2 in item1.children"
                :key="item2.id"
                class="centerRow"
              >
                <!-- 放二级权限 -->
                <el-col :span="6">
                  <el-tag closable type="success">{{ item2.authName }}</el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <!-- 放三级权限 -->
                <el-col :span="18">
                  <el-tag
                    closable
                    type="warning"
                    v-for="item3 in item2.children"
                    :key="item3.id"
                  >
                    {{ item3.authName }}</el-tag
                  >
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>

      <el-table-column label="#" type="index"> </el-table-column>
      <el-table-column label="角色名称" prop="roleName"> </el-table-column>
      <el-table-column label="角色描述" prop="roleDesc"> </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click="handleEdit(scope.$index, scope.row)"
          >
            <i class="el-icon-edit"></i>
            编辑</el-button
          >
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
            ><i class="el-icon-delete"></i> 删除</el-button
          >
          <el-button
            size="mini"
            type="warning"
            color="#e6a23c"
            @click="handleClose(scope.$index, scope.row)"
            ><i class="el-icon-setting"></i> 分配权限</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加角色对话框 -->
    <el-dialog title="提示" :visible.sync="isshow" width="45%">
      <p>角色名称:<input type="text" v-model="vname" /></p>
      <p>角色描述:<input type="text" v-model="vmiao" /></p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isshow = false">取 消</el-button>
        <el-button type="primary" @click="quer">确 定</el-button>
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
      tableData: [],
      dialogVisible: false,
      rightTree: [],
      treeConfig: {
        children: "children",
        label: "authName",
      },
      isshow: false,
      vname: "",
      vmiao: "",
      defaultCheckedKeys: [
        109, 129, 130, 134, 135, 138, 139, 140, 141, 147, 131, 132, 133, 136,
        137, 148,
      ],
    };
  },
  methods: {
    // 请求角色列表
    axios_roles() {
      http("/roles").then((res) => {
        this.tableData = res.data;
      });
    },
    handleEdit(index, row) {
      console.log(index, row);
    },
    handleDelete(index, row) {
      console.log(index, row);
    },
    // 分配权限事件
    handleClose(index, row) {
      http("/rights/tree").then((res) => {
        this.rightTree = res.data;
      });
      this.dialogVisible = !this.dialogVisible;
      console.log(index, row);
      const keys = []; // 专门存放所有三级节点的Id
      this.getLeafIds(row, keys);
      // this.defaultCheckedKeys = keys;
      // console.log(this.defaultCheckedKeys);
    },
    removeRight(row, id) {
      console.log(row, id);
    },
    // 添加角色
    quer() {
      this.isshow = true;
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
    getLeafIds(node, keys) {
      if (!node.children) {
        keys.push(node.id);
      } else {
        node.children.forEach((item) => this.getLeafIds(item, keys));
      }
    },
  },
  components: {},
  created() {
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
.jues {
  box-sizing: border-box;
  background-color: #fff;
  padding: 20px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow: auto;
  > button {
    height: 45px;
    background-color: #409eff;
    color: #fff;
    border-radius: 5px;
    width: 100px;
    margin-bottom: 15px;
  }
  .el-table_3_column_15 {
    text-align: center;
    .cell {
      text-align: center;
      display: flex;
      justify-content: center;
      span {
        padding: 5px 10px;
        display: inline-block;
      }
    }
  }
  .el-table__cell {
    flex-direction: column;
    justify-content: center;
    display: flex;
    align-items: center;
    > .centerRow {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
      padding: 0 20px;
      .el-col {
        // display: flex;
        // align-items: center;
        .centerRow {
          display: flex;
          align-items: center;
        }
      }
      .el-tag {
        margin-right: 10px;
        margin-bottom: 10px;
      }
    }
  }
}
</style>