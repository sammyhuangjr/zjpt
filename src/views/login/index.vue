<template>
  <div class="login-container">
    <img class="back" src="@/assets/images/back.png" />
    <img class="title" src="@/assets/images/title.png" />
    <div class="form_login">
      <!-- <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">

      <div class="title-container">
        <h3 class="title">智慧云授权系统</h3>
      </div>
      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="Username"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="Password"
          name="password"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>
      
      <el-form-item prop="code" style="width:48%">
        <span class="svg-container">
          <svg-icon icon-class="code" />
        </span>
        <el-input style="width:75%" ref="code" v-model="code" placeholder="请输入验证码" name="code" type="text" tabindex="1" auto-complete="on"/>
      </el-form-item> 
      <div class="codeItem">
        <canvas ref='code' class="code" width="100" height="40" @click="getCode"></canvas><span class="codeTip">看不清请点图片刷新</span>
      </div>
      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">登录</el-button>
    </el-form>
         -->
         <div class="form_item" style="margin-top: 17.15%;">
			<div class="icon">
				<img src="@/assets/images/username.png" alt="">
			</div>
           <input type="text" placeholder="请输入用户名" v-model="loginForm.username" @keyup.enter="handleLogin">
         </div>
         <div class="form_item">
			<div class="icon">
				<img src="@/assets/images/password.png" alt="">
			</div>
           <input :type="isShowPassword ? 'text' : 'password'" placeholder="请输入密码" v-model="loginForm.password" @keyup.enter="handleLogin">
		   <div class="icon eye" @click="onChangeShow">
				<img v-show="isShowPassword" src='@/assets/images/eye.png' alt="">
				<img v-show="!isShowPassword" src='@/assets/images/eye2.png' alt="">
		   </div>
         </div>
		 <div class="form_item" style="width: 48%;float: left;">
			<div class="icon" style="margin-left: 7.33%;">
				<img src="@/assets/images/code.png" alt="">
			</div>
		   <input type="text" placeholder="请输入验证码" v-model="code" @keyup.enter="handleLogin">
		 </div>
		 <div class="codeItem" style="float: left;">
		   <canvas ref='code' class="code" width="100" height="40" @click="getCode"></canvas>
		   <!-- <span class="codeTip">看不清请点图片刷新</span> -->
		 </div>
		 <div class="login" @click="handleLogin">登录</div>
    </div>
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'
import { httpRquest } from '@/api/URL'
import store from '@/store'
export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('请输入用户名'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('请输入密码'))
      } else {
        callback()
      }
    }
    return {
      code:'',
      loginForm: {
        username: '',
        password: '',
    
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur' }],
        password: [{ required: true, trigger: 'blur' }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined,
      loginCode:'',
      isRushCode:false,
	  isShowPassword:false
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
	onChangeShow(){
		this.isShowPassword = !this.isShowPassword;
	},
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.loading = true
      // this.$router.push({ path: '/dashboard' })
      let req = {
        username:this.loginForm.username,
        password:this.loginForm.password,
        code:this.code
      }
      // this.$router.push({ path: this.redirect || '/' });
      httpRquest(this.URL.LOGIN,'GET',req).then((res)=>{
        console.log('=====>',res);
        if(res.code != 0){
          this.$message({
            message: res.msg,
            type: 'error'
          });
          return;
        }
        this.loading = false
        this.$store.dispatch('user/login',res.data.token);
        localStorage.setItem('roleCode',res.data.roleCode);
        //获取权限
        httpRquest(this.URL.GET_PERMISSION,'GET',{}).then((res)=>{
          console.log('=====>',res);
          localStorage.setItem('permission',JSON.stringify(res.data));
        })
        this.$router.push({ path: this.redirect || '/' });
      })


    },
    //随机颜色值
    colorRandom(){
      var r = Math.floor(Math.random()*256);
      var g = Math.floor(Math.random()*256);
      var b = Math.floor(Math.random()*256);
      return "rgb("+ r + ","+ g +","+ b+")";
    },
    //随机干扰点
    drawPoint(context,x){
        for (var i = 0; i < x; i++) {
            context.beginPath();
            var x = Math.random() * 100;
            var y = Math.random() * 40;
            context.moveTo(x, y);
            context.lineTo(x + 1, y + 1);
            context.strokeStyle = this.colorRandom();
            context.stroke();//开始绘制
        }
    },
    //随机干扰线
    drawLine(context,m){
        for (var i = 0; i < m; i++) {
            context.beginPath(); //开始一个路径
            context.moveTo(Math.random() * 100, Math.random() * 40);//设置起点坐标
            context.lineTo(Math.random() * 100, Math.random() * 40);//设置终点坐标
            context.strokeStyle = this.colorRandom();
            context.stroke();//开始绘制
        }
    },
    //随机绘制验证码
    getCode(){
      let that = this;
      if(this.isRushCode) return;
      httpRquest(this.URL.GET_CODE,'GET',{}).then((res)=>{
        let resCode = res.data.split('');
        that.loginCode = res.data;
        let canvas = that.$refs.code;
        let context;
        that.loginCode = '';
        context = canvas.getContext('2d');
        context.clearRect(0,0,100,40);//清除画布
        context.beginPath();
        // context.fillStyle = that.colorRandom();//显示验证码区域的背景色
        context.fillStyle = "rgba(64, 158, 225, 1)"
        context.rect(0,0,100,40);
        context.fill();
        for(var i = 0;i<4;i++){
          context.font ="20px 微软雅黑";//数字随机大小
          context.fillStyle = that.colorRandom();//数字颜色
          context.fillText(resCode[i], 15 + 20*i,30);   //0-9的随机数
        }
        that.drawPoint(context,100);
        that.drawLine(context,5)
        that.isRushCode = false
      }).catch((error)=>{
        that.isRushCode = false
      })
    }
  },
  mounted(){
    this.getCode();
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

// $bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .back{
      position: absolute;
      width: 100%;
      height: 100%;
      z-index: 10;
    }
  .title{
      position: absolute;
      z-index: 20;
      top: 6.11%;
      left: 9.9%;
      width: 20.52%;
      height: 6.57%;
    }
  .form_login{
    width: 28.65%;
    height: 53.98%;
    background-color: #FFFFFF;
    border-radius:2px;
    position: absolute;
    z-index: 20;
    top: 21.8%;
    right: 10%;
    .form_item{
      width: 80%;
      height: 11.32%;
      background:rgba(255,255,255,1);
	  border:1px solid rgba(4,22,126,1);
      border-radius:2px;
	  margin: 0 0 2.69% 10%;
      display: flex;
      align-items: center;
	  position: relative;
	  .icon{
		  width: 10%;
		  height: 66.67%;
		  margin:0 2.5%;
		  display: flex;
		  align-items: center;
		  justify-content: center;
		  img{
			height: auto;
			max-width: 11px;
		  }
	  }
	  input{
		  outline: none;
		  border: none;
		  color: #04167E;
      background: none;
		  width: 70%;
	  }
	  .eye{
		  position: absolute;
		  right: 3.18%;
		  top: 16.67%;
		  img{
			height: auto;
			max-width: 20px;
		  }
	  }
    }
	.codeItem{
		width:30.18%;
		height:11.32%;
		border-radius:2px;
		display: flex;
		margin-left: 2%;
		.code{
			width:100px;
			height: 40px;
		}
		.codeTip{
			line-height: 40px;
			margin-left: 5px;
			font-size: 12px;
			color:#fff;
		}
	}
	.login{
		float: left;
		width: 80%;
		height: 50px;
		line-height: 50px;
		color: #fff;
		background:rgba(64,158,255,1);
		border-radius:2px;
		margin-top: 5.56%;
		margin-left: 10%;
		text-align: center;
	}
  }

    
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      // &:-webkit-autofill {
      //   box-shadow: 0 0 0px 1000px $bg inset !important;
      //   -webkit-text-fill-color: $cursor !important;
      // }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
// $bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  // background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
.login-container .login-form{
  padding:60px 35px 0 35px;
  .el-form-item{
    background: none;
    border:1px solid rgba(4,22,126,1);
    height: 44px;
    display: flex;
    .el-input{
      height: 44px;
      color: #04167E;
      input{
        height: 44px;
      }
    }
    .svg-icon{
      color: #04167E;
    }
    .svg-container{
      display: flex;
      align-items: center;
      justify-content: center;
      height: 44px;
    }
  }
}
</style>
