<template>
	<view class="login">
		<u--form ref="form" :rules="rules" :model="userInfo" labelPosition="top">
			<u-form-item  prop="email" >
				<u--input v-model="userInfo.email" placeholder="请输入邮箱"></u--input>
			</u-form-item>
			<u-form-item  prop="password" >
				<u--input v-model="userInfo.password" placeholder="请输入密码" type="password"></u--input>
			</u-form-item>
			<view class="box">
				<view class="forget" @click="forgetOrRegister(false)">忘记密码？</view>
				<view class="register" @click="forgetOrRegister(true)">还没有账户？立即注册</view>
			</view>
			<u-button text="登录" type="primary" @click="login"></u-button>
		</u--form>

	</view>
</template>

<script>
	import {
		emailReg,
		passwordReg
	} from "@/utils/Regular";

	export default {
		data() {
			return {
				userInfo: {
					email: "",
					password: ""
				},
				// 表单验证规则
				rules: {
					'email': {
						required: true,
						pattern: emailReg,
						message: "邮箱格式不正确",
					},

					'password': {
						required: true,
						pattern: passwordReg,
						message: "密码至少8位且必有数字+特殊字符+字母",
					},

				},
			}
		},
		methods: {
			login() {
				// 校验表单
				this.$refs.form.validate().then(async res => {
					// 成功
					// 发送登录请求
					console.log(this.userInfo);
					let result = await this.$Request({
						url: "/login",
						data: {
							email: this.userInfo.email,
							password: this.userInfo.password,
						}
					})
					if (result.code === 200) {
						// 登录成功
						// 设置 token 和 token 的开始时间
						uni.setStorageSync("token", result.token);
						uni.setStorageSync("tokenStartTime", Date.now());
						uni.showToast({
							title: "登陆成功"
						})
						// 跳转路由
						uni.reLaunch({
							url: "../../pages/index/index"
						})
						// 获取用户信息
						let res = await this.$Request({
							url: "/user/get"
						})
						if (res.code === 200) {
							uni.setStorageSync("userInfo", res.userInfo);
							console.log(uni.getStorageSync("userInfo"));
						}

					} else {
						uni.showToast({
							title: result.message,
							icon: "none"
						})
					}
				}).catch(errors => {
					
				})
			},
			forgetOrRegister(isRegister){
				uni.navigateTo({
					url:`/pages/register/register?isRegister=${isRegister}`
				})
			}
		},
		onLoad() {
			uni.hideHomeButton();
		}
	}
</script>

<style lang="scss">
	.login {
		background: #f4f4f4;
		width: 100%;
		height: calc(100vh - var(--window-top);
				position: relative;

				.u-form {
				position: absolute;
				box-sizing: border-box;
				width: calc(100% - 40rpx);
				padding: 40rpx;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				background: hsla(0, 0%, 100%, .7);
				top: 200rpx;
				left:20rpx;
				border-radius: 16px;

				// box-shadow: 2px 2px 10px #ddd;
				.u-form-item {
					width: 100%;
				}

				.u-button {
					margin-top: 20rpx;
				}
			}

			.box {
				width: 100%;
				display: flex;
				justify-content: space-between;
				font-size: 24rpx;
				margin-top: 16rpx;
				color: #666;
			}
		}
</style>