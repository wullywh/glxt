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
      //   this.axios.post("http://127.0.0.1:8888/api/private/v1/login", {
      //     username: this.user,
      //     password: this.pass,
      //   });
      http({
        url: "/login",
        method: "post",
        data: {
          username: this.user,
          password: this.pass,
        },
      }).then((res) => console.log(res));
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
