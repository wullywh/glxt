<template>
  <div class="login">
    <div class="user">
      <div class="logo">
        <img src="./../assets/logo.png" />
      </div>
      <form class="from">
        <p>
          <i class="el-icon-s-custom"></i>
          <input type="text" placeholder="用户名" v-model="user" />
        </p>
        <p>
          <i class="el-icon-lock"></i>
          <input type="password" placeholder="密码" v-model="pass" />
        </p>

        <div>
          <button class="dengl" @click="login_">登录</button>
          <button class="reset">重置</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import http from "./../components/http/index";
export default {
  props: {},
  data() {
    return {
      user: "admin",
      pass: "123456",
    };
  },
  methods: {
    login_() {
      // 登录验证
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
          url: "/login",
          method: "post",
          data: {
            username: this.user,
            password: this.pass,
          },
        }).then((res) => {
          // 登录失败
          if (res.meta.status == 400) {
            this.$message.error(res.meta.msg);
          } else {
            // 登录成功
            this.$message({
              message: res.meta.msg,
              type: "success",
            });
            // 保存token
            sessionStorage.setItem("token", res.data.token);
            // 实现跳转，进入主页
            setTimeout(() => {
              this.$router.push("/home");
            }, 2000);
          }
        });
      }
    },
  },
  components: {},
};
</script>

<style scoped lang="scss">
.login {
  width: 100%;
  height: 100%;
  background-color: #2b4b6b;
  position: relative;
  .user {
    background-color: #fff;
    width: 450px;
    height: 300px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    .logo {
      z-index: 10;
      width: 120px;
      height: 120px;
      border-radius: 50%;
      overflow: hidden;
      position: absolute;
      top: 0;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: #eeeeee;
      border: 10px solid #fff;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .from {
      margin: 115px 20px 0 20px;
      p {
        height: 40px;
        line-height: 40px;
        border: 1px solid #dcdfe6;
        border-radius: 5px;
        &:first-child {
          margin-bottom: 20px;
        }
        i {
          font-size: 26px;
          margin: 0 10px;
        }
      }
      div {
        margin-top: 20px;
        text-align: right;
        button {
          width: 70px;
          height: 40px;
          text-align: center;
          line-height: 40px;
          border-radius: 4px;
          color: #fff;
          &:first-child {
            background-color: #409eff;
            margin-right: 10px;
          }
          &:last-child {
            background-color: #909399;
          }
        }
      }
    }
  }
}
</style>
