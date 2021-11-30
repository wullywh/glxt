<template>
  <div class="orders">
    <!-- 面包屑，顶部路径 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="table">
      <div style="margin-top: 15px">
        <el-input
          placeholder="请输入内容"
          v-model="input"
          class="input-with-select"
        >
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </div>
      <template>
        <el-table :data="tableData" style="width: 100%" border>
          <el-table-column type="index" label="#" width="50"> </el-table-column>
          <el-table-column prop="order_number" label="订单编号" width="300s">
          </el-table-column>
          <el-table-column label="是否付款" width="100px">
            <template slot-scope="scope">
              <el-tag
                size="small"
                v-if="scope.row.pay_status == '0'"
                type="danger"
                >未付款</el-tag
              >
              <el-tag type="warning" size="small" v-else>已付款</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="is_send" label="是否发货" width="100">
          </el-table-column>
          <el-table-column prop="create_time" label="下单时间" min-width="150">
          </el-table-column>
          <el-table-column prop="address" label="操作" width="400px">
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="mini"
                icon="el-icon-edit"
                @click="set_address(scope.row)"
              ></el-button>
              <el-button
                type="success"
                size="mini"
                icon="el-icon-location-outline"
                @click="look_address()"
              ></el-button>
              <el-button
                type="success"
                size="mini"
                @click="look_dingd(scope.row.order_id)"
                >查看订单</el-button
              >
              <el-button
                type="success"
                size="mini"
                @click="set_dingd(scope.row)"
                >修改订单状态</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </template>

      <!-- 分页器 -->
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="1"
          :page-sizes="[5, 10, 20, 30]"
          :page-size="this.feny_data.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total_dingd"
        >
        </el-pagination>
      </div>
    </div>

    <!-- 修改地址对话框 -->
    <el-dialog title="收货地址" :visible.sync="isset_address">
      <el-form :model="form">
        <el-form-item label="省市区/县" :label-width="formLabelWidth">
          <el-cascader
            v-model="selectedOptions"
            :options="options"
            :props="{ expandTrigger: 'hover' }"
            @change="handleChange"
            checkStrictly
            style="width: 80%"
          >
          </el-cascader>
        </el-form-item>
      </el-form>
      <el-form :model="form">
        <el-form-item label="详细地址" :label-width="formLabelWidth">
          <el-input
            v-model="dingd_address.xiangx"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isset_address = false">取 消</el-button>
        <el-button type="primary" @click="quer_setaddress">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 订单物流信息 -->
    <el-dialog title="物流进度" :visible.sync="wuliu_info" class="wuliu">
      <el-timeline :reverse="reverse">
        <el-timeline-item
          v-for="(item, index) in wlList"
          :key="index"
          :timestamp="item.time"
        >
          {{ item.context }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>

    <!-- 订单详情 -->
    <el-dialog title="订单详情" :visible.sync="dingd_info">
      <p>
        订单编号：<span>{{ dingd_data.order_number }}</span>
      </p>
      <p>
        订单状态：<span>{{
          dingd_data.is_end == "否" ? "未发货" : "已发货"
        }}</span>
      </p>
      <p>订单价格：{{ dingd_data.order_price }}</p>
      <p>支付状态：{{ dingd_data.pay_status == "0" ? "未付款" : "已付款" }}</p>
      <p>是否发货：{{ dingd_data.is_send }}</p>
      <p>发货地址：{{ dingd_data.consignee_addr }}</p>
      <p>下单时间：{{ dingd_data.update_time }}</p>
    </el-dialog>

    <!-- 修改订单状态对话框 -->
    <el-dialog title="修改订单状态" :visible.sync="isset_dingd">
      <p>
        是否发货：<input
          type="radio"
          name="send"
          value="1"
          v-model="from_dingd.is_send"
        />已发货
        <input
          type="radio"
          name="send"
          value="0"
          v-model="from_dingd.is_send"
        />未发货
      </p>
      <p>
        支付方式：<input
          type="radio"
          name="pay"
          value="0"
          v-model="from_dingd.order_pay"
        />未支付
        <input
          type="radio"
          name="pay"
          value="1"
          v-model="from_dingd.order_pay"
        />支付宝
        <input
          type="radio"
          name="pay"
          value="2"
          v-model="from_dingd.order_pay"
        />微信
        <input
          type="radio"
          name="pay"
          value="3"
          v-model="from_dingd.order_pay"
        />银行卡
      </p>
      <p>订单价格：<input type="text" v-model="from_dingd.order_price" /></p>
      <p>订单数量：<input type="text" v-model="dingd_num" /></p>
      <p>
        支付状态：<input
          type="radio"
          value="0"
          name="status"
          v-model="from_dingd.pay_status"
        />未支付
        <input
          type="radio"
          value="1"
          name="status"
          v-model="from_dingd.pay_status"
        />已支付
      </p>
      <p>发货地址：<input type="text" v-model="from_dingd.consignee_addr" /></p>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isset_dingd = false">取 消</el-button>
        <el-button type="primary" @click="quer_dingd()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import http from "./../http/index";
import { regionData, CodeToText } from "element-china-area-data";
export default {
  props: {},
  data() {
    return {
      tableData: [], // 订单列表数据
      input: "", //输入框绑定的值
      isset_address: false, //修改地址对话框的显示与隐藏
      // 修改地址中地址绑定的数据
      form: {},
      // 修改地址对话框的最小宽度
      formLabelWidth: "80px",
      total_dingd: 0,

      // 分页器数据
      feny_data: {
        pagenum: 1, //当前页数
        pagesize: 10, //每页显示条数
      },

      // 订单地址绑定的值
      dingd_address: {
        bause: "",
        xiangx: "",
      },
      set_address_id: "", //修改地址的id

      options: regionData, //省市区级联选择器数据
      selectedOptions: [],
      wlList: [], //物流信息
      wuliu_info: false, //物流信息对话框的显示与隐藏
      reverse: false,

      dingd_data: "", //订单信息
      dingd_info: false, //订单详情对话框的显示与隐藏

      isset_dingd: false, //修改订单对话框的显示与隐藏

      shou_address: "", //返货地址

      // 修改订单状态对应的值
      from_dingd: {
        is_send: "",
        order_pay: "",
        order_price: "",
        pay_status: "",
        consignee_addr: "",
      },
      dingd_zhuangt_id: "", //修改订单状态id
      dingd_num: 1,
    };
  },
  methods: {
    // 订单列表数据的请求
    axios_dingd() {
      http({
        url: "/orders",
        params: {
          pagenum: this.feny_data.pagenum,
          pagesize: this.feny_data.pagesize,
        },
      }).then((res) => {
        this.tableData = res.data.goods;
        this.total_dingd = res.data.total - 0;
      });
    },
    // 查看订单物流状态
    look_address() {
      // 请求物流状态接口
      http("/kuaidi/1106975712662").then((res) => {
        if (res.meta.status !== 200) {
          return this.$message.error("获取物流进度失败！");
        }
        this.wlList = res.data.data;
        console.log(this.wlList);
        if (this.wlList) {
          this.wuliu_info = true;
        }
      });
    },
    // 修改订单地址
    set_address(row) {
      this.isset_address = true;
      this.set_address_id = row.order_id;
      console.log(this.set_address_id);
    },
    // 确认修改地址
    quer_setaddress() {
      if (this.dingd_address.bause == "" || this.dingd_address.xiangx == "") {
        this.$message.error("请输入完整地址");
      } else {
        // 请求修改地址路径
        console.log(this.dingd_address);
        http({
          url: `/orders/${this.set_address_id}`,
          method: "put",
          data: {
            consignee_addr:
              this.dingd_address.bause + this.dingd_address.xiangx,
          },
        }).then((res) => {
          console.log(res);
          this.isset_address = false;
        });
      }
    },

    // 分页器对应的页数
    handleSizeChange(val) {
      this.feny_data.pagesize = val;
      this.axios_dingd();
    },
    handleCurrentChange(val) {
      this.feny_data.pagenum = val;
      this.axios_dingd();
    },
    handleChange() {
      var loc = "";
      for (let i = 0; i < this.selectedOptions.length; i++) {
        loc += CodeToText[this.selectedOptions[i]];
      }
      this.dingd_address.bause = loc;
      console.log(loc);
    },
    // 查看订单详情
    look_dingd(id) {
      // 请求订单详情接口
      http(`/orders/${id}`).then((res) => {
        this.dingd_data = res.data;
        this.dingd_info = true;
      });
    },
    // 修改订单状态
    set_dingd(row) {
      this.from_dingd = row;
      this.dingd_zhuangt_id = row.order_id;
      console.log(this.dingd_zhuangt_id);
      if (this.from_dingd) {
        this.isset_dingd = true;
      }
    },
    // 确认修改订单
    quer_dingd() {
      console.log(this.from_dingd);
      // 请求修改订单状态
      http({
        url: `/orders/${this.dingd_zhuangt_id}`,
        method: "put",
        data: {
          is_send: this.from_dingd.is_send,
          order_pay: this.from_dingd.order_pay,
          order_price: this.from_dingd.order_price,
          order_number: this.order_number,
          pay_status: this.from_dingd.pay_status,
          consignee_addr: this.from_dingd.consignee_addr,
        },
      }).then((res) => {
        if (res.meta.status == 400) {
          this.$message.error("修改订单状态失败");
        } else {
          this.$message({
            type: "success",
            message: res.meta.msg,
          });
          this.axios_dingd();
          this.isset_dingd = false;
        }
      });
    },
  },
  components: {},
  created() {
    this.axios_dingd();
  },
};
</script>

<style scoped lang="scss">
.el-dialog {
  .el-timeline {
    height: 50% !important;
    overflow: auto;
  }
  p {
    line-height: 30px;
    input {
      border: 1px solid #000;
    }
  }
}
.orders {
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
    .el-table {
      height: 100%;
      overflow: auto;
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
</style>
