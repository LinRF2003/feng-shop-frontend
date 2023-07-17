<template>
	<view class="register">
		<u--form ref="form" :rules="rules" :model="userInfo" labelPosition="top">
			<u-form-item prop="email">
				<u--input v-model="userInfo.email" placeholder="请输入邮箱"></u--input>
			</u-form-item>
			<u-form-item prop="captcha">
				<u--input v-model="userInfo.captcha" placeholder="请输入验证码"></u--input>
				<view class="send size" v-if="canSend" @click="sendCaptcha">发送验证码</view>
				<view v-show="!canSend" class="ban size">剩余{{ captchaSecond }}秒</view>
			</u-form-item>
			<u-form-item prop="password">
				<u--input v-model="userInfo.password" placeholder="请输入密码" type="password"></u--input>
			</u-form-item>
			<u-form-item prop="repassword">
				<u--input placeholder="再次输入密码" v-model="userInfo.repassword" type="password" show-password
					:validate-event="false"></u--input>
			</u-form-item>
			<navigator class="l" open-type="redirect" url="/pages/login/login">
				<view v-if="isRegister">已有账户？立即登录</view>
				<view v-else>去登录</view>
			</navigator>
			<u-button type="primary" @click="forgetOrRegister">{{isRegister?'注册':'重置密码'}}</u-button>
		</u--form>

	</view>
</template>

<script>
	import {
		emailReg,
		passwordReg,
		captchaReg
	} from "@/utils/Regular";

	export default {
		data() {
			// 密码两次输入对比
			let rePass = (rule, value, callback) => {
				console.log(rule,value);
				if (value === "") {
					callback(new Error("请再次输入密码"));
				} else if (value !== this.userInfo.password) {
					callback(new Error("两次输入密码不一致!"));
				} else {
					callback();
				}
			};
			return {
				isRegister: null,
				userInfo: {
					email: "",
					password: "",
					repassword: "",
					captcha: ""
				},
				canSend: true, // 是否可以发送验证码请求
				captchaSecond: 0, // 倒计时剩余秒数
				// 表单验证规则
				rules: {
					'email': {
						required: true,
						pattern: emailReg,
						message: "邮箱格式不正确",
						trigger: ['blur', 'change']
					},
					'captcha': [{
							required: true,
							message: "验证码不能为空",
							trigger: ['blur', 'change']
						},
						{
							pattern: captchaReg,
							message: "验证需为6位整数",
							trigger: ['blur']
						},
					],
					'password': {
						required: true,
						pattern: passwordReg,
						message: "密码至少8位且必有数字+特殊字符+字母",
						trigger: ['blur', 'change']
					},

					'repassword': {
						validator: rePass,
						trigger: ['blur', 'change']
					}

				},
			};
		},
		onLoad(options) {
			if (options.isRegister === 'true') {
				this.isRegister = true;
			} else {
				uni.setNavigationBarTitle({
					title: "重置密码"
				})
				this.isRegister = false;
			}
		},
		methods: {
			// 发送验证码
			async sendCaptcha() {
				let result = await this.$Request({
					url: '/email/send',
					data: {
						email: this.userInfo.email
					}
				});
				if (result.code === 200) {
					this.captchaSecond = 10;
					this.canSend = false;
					this.timer = setInterval(() => {
						this.captchaSecond -= 1;
					}, 1000);
				} else {
					uni.showToast({
						title: result.message
					})

				}
			},
			// 重置密码或注册
			forgetOrRegister() {
				console.log(this.userInfo);
				// 校验表单
				this.$refs.form.validate().then(async res => {
					// 成功
					// 发送请求
					console.log(this.userInfo);
					let result = await this.$Request({
						url: "/register",
						data: {
							email: this.userInfo.email,
							password: this.userInfo.password,
							repassword: this.userInfo.repassword,
							captcha: this.userInfo.captcha,
							isRegister:this.isRegister ? 1 : 0
						}
					})
					if (result.code === 200) {
						uni.showToast({
							title: this.userInfo.isRegister ? "注册成功" : "重置密码成功",
							icon: "none"
						})
						// 去到登录页
						uni.reLaunch({
							url:"/pages/login/login"
						})
					} else {
						uni.showToast({
							title: result.desc || result.message,
							icon: "none"
						})
					}
				}).catch(errors => {

				})
			},
		},
		watch: {
			captchaSecond: function() {
				if (this.captchaSecond == 0) {
					clearInterval(this.timer);
					this.timer = null;
					this.canSend = true;
				}
			}
		},
		onhide() {
			clearInterval(this.timer);
		},
	}
</script>

<style lang="scss">
	.register {
		background: #f4f4f4;
		width: 100%;
		height: calc(100vh - var(--window-top));
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
			background: hsla(0, 0%, 100%, .5);
			top: 200rpx;
			left: 20rpx;
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

		.title {
			font-size: 40rpx;
			margin-bottom: 20rpx;
			text-align: center;
		}

		.size {

			display: flex;
			align-items: center;
			justify-content: center;
			min-width: 70px;
			max-width: 70px;
			margin: 0 0 0 8px;
			font-size: 12px;
			color: #fff;
			height: 38px;
		}

		.send {
			cursor: pointer;
			background: #409EFF;
		}

		.ban {
			background: #aaa;
			cursor: no-drop;
		}

		.l {
			width: 100%;
			font-size: 24rpx;
			display: flex;
			justify-content: flex-end;
		}
	}
</style>