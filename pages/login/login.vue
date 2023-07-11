<template>
	<view class="login">
		<u--form ref="form" :rules="rules" :model="userInfo">
			<u-form-item label="邮箱" prop="email" borderBottom>
				<u--input v-model="userInfo.email" border="none" placeholder="请输入邮箱"></u--input>
			</u-form-item>
			<u-form-item label="密码" prop="password" borderBottom>
				<u--input v-model="userInfo.password" border="none" placeholder="请输入密码" type="password"></u--input>
			</u-form-item>
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
						trigger: ['blur', 'change']
					},

					'password': {
						required: true,
						pattern: passwordReg,
						message: "密码至少8位且必有数字+特殊字符+字母",
						trigger: ['blur', 'change']
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
					console.log(result);
				}).catch(errors => {

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
		background:#f4f4f4;
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
	}
</style>