<template>
  <div class="container">
    <div class="img">
      <img :src="img.baseImage" />
    </div>
    <div class="login-content">
      <form @submit="loginUser">
        <img :src="img.avatarImage" />
        <h2 class="title">ยินดีต้อนรับ</h2>
        <div class="input-div user">
          <div class="i">
            <i class="fas fa-user"></i>
          </div>
          <div class="div">
            <h5>Username</h5>
            <input
              type="text"
              class="input"
              v-model="login.username"
              @blur="handleBlur"
              @focus="handleFocus"
            />
          </div>
        </div>
        <div class="input-div pass">
          <div class="i">
            <i class="fas fa-lock"></i>
          </div>
          <div class="div">
            <h5>Password</h5>
            <input
              type="password"
              class="input"
              v-model="login.password"
              @blur="handleBlur"
              @focus="handleFocus"
            />
          </div>
        </div>
        <a href="#">Forgot Password?</a>
        <input
          type="submit"
          class="btn"
          value="เข้าสู่ระบบ"
          @click="loginService()"
        />
      </form>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";

export default {
  data() {
    return {
      img: {
        baseImage: require("../../assets/img/undraw_data_report_bi6l.svg"),
        avatarImage: require("../../assets/img/undraw_male_avatar_323b.svg"),
      },
      login: {
        username: "",
        password: "",
      },
    };
  },
  computed: {
    ...mapGetters({ isAuthenticated: "token/isAuthenticated" }),
  },
  methods: {
    ...mapActions({ setTokenUser: "token/setTokenUser" }),
    handleFocus(e) {
      e.target.classList.add("focus");
    },
    handleBlur(e) {
      e.target.classList.remove("focus");
    },
    loginUser(e) {
      e.preventDefault();
      this.setTokenUser(this.login).then(() => {
        if (!this.isAuthenticated) {
        } else {
          this.$router.push("/pages/home");
        }
      });
    },
    loginService() {
      this.$router.push("/configuration");
    },
  },
};
</script>
<style lang="scss" scoped>
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}
.container {
  width: 100vw;
  height: 100vh;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 7rem;
  padding: 0 2rem;
  background-color: #ffffff;
}
.img {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  img {
    width: 500px;
  }
}
.login-content {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  text-align: center;
  img {
    height: 100px;
  }
  h2 {
    margin: 15px 0;
    color: #333;
    text-transform: uppercase;
    font-size: 2.9rem;
  }
  .input-div {
    position: relative;
    display: grid;
    grid-template-columns: 7% 93%;
    margin: 25px 0;
    padding: 5px 0;
    border-bottom: 2px solid #d9d9d9;
  }
}
form {
  width: 360px;
}
.i {
  color: #d9d9d9;
  display: flex;
  justify-content: center;
  align-items: center;
  i {
    transition: 0.3s;
  }
}
.input-div {
  > div {
    position: relative;
    height: 45px;
    > h5 {
      position: absolute;
      left: 10px;
      top: 50%;
      transform: translateY(-50%);
      color: #999;
      font-size: 18px;
      transition: 0.3s;
    }
    > input {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      border: none;
      outline: none;
      background: none;
      padding: 0.5rem 0.7rem;
      font-size: 1.2rem;
      color: #555;
      font-family: "poppins", sans-serif;
    }
  }
  &:before {
    content: "";
    position: absolute;
    bottom: -2px;
    width: 0%;
    height: 2px;
    background-color: #38d39f;
    transition: 0.4s;
    right: 50%;
  }
  &:after {
    content: "";
    position: absolute;
    bottom: -2px;
    width: 0%;
    height: 2px;
    background-color: #38d39f;
    transition: 0.4s;
    left: 50%;
  }
}
.input-div.focus {
  &:before {
    width: 50%;
  }
  &:after {
    width: 50%;
  }
  > div {
    > h5 {
      top: -5px;
      font-size: 15px;
    }
  }
  > .i {
    > i {
      color: #38d39f;
    }
  }
}
.input-div.pass {
  margin-bottom: 4px;
}
a {
  display: block;
  text-align: right;
  text-decoration: none;
  color: #999;
  font-size: 0.9rem;
  transition: 0.3s;
  &:hover {
    color: #38d39f;
  }
}
.btn {
  display: block;
  width: 100%;
  height: 50px;
  border-radius: 25px;
  outline: none;
  border: none;
  background-image: linear-gradient(to right, #32be8f, #38d39f, #32be8f);
  background-size: 200%;
  font-size: 1.2rem;
  color: #fff;
  font-family: "Poppins", sans-serif;
  text-transform: uppercase;
  margin: 1rem 0;
  cursor: pointer;
  transition: 0.5s;
  &:hover {
    background-position: right;
  }
}
@media screen and (max-width: 1050px) {
  .container {
    grid-gap: 5rem;
  }
}
@media screen and (max-width: 1000px) {
  form {
    width: 290px;
  }
  .login-content {
    h2 {
      font-size: 2.4rem;
      margin: 8px 0;
    }
  }
  .img {
    img {
      width: 400px;
    }
  }
}
@media screen and (max-width: 900px) {
  .container {
    grid-template-columns: 1fr;
  }
  .img {
    display: none;
  }
  .wave {
    display: none;
  }
  .login-content {
    justify-content: center;
  }
}
</style>
