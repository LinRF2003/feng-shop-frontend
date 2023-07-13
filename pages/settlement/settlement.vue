<template>
	<view class="settlement">
		<view class="address-box bgbrp">
			<!-- 	<view class="address-info">
				广东省广州市白云区钟落潭镇现龙街南101号广东青年职业学院白云校区菜鸟驿站
			</view>
			<view class="info">
				<view class="name">
					林先生
				</view>
				<view class="phone">1813874231</view>
			</view> -->
			<u-cell :title="addressInfo.addressDetail" title-style="font-weight: 550;" isLink
				:label="`${addressInfo.consigneeName} ${addressInfo.phone}`" :border="false" arrow-direction="right"
				@click="goToMyAddress" v-if="addressInfo"></u-cell>
			<u-cell title="还没有地址信息,立即填写" title-style="font-weight: 550;" isLink :border="false" arrow-direction="right"
				@click="goToMyAddress" v-else></u-cell>

		</view>

		<view class="content bgbrp">
			<view class="item" v-for="productInfo in cartDetail.productList" :key="productInfo.productId">
				<view class="cover">
					<image :src="ImgUrl + productInfo.cover" style="width: 100px;height: 100px;"></image>
				</view>
				<view class="product-info">
					<view class="product-name">{{productInfo.productName}}</view>
					<view class="p-box">
						<view class="product-price">￥{{productInfo.productPrice}}</view>
						<view class="product-num">×{{productInfo.num || 1}}</view>
					</view>
				</view>
			</view>

		</view>
		<view class="payment-type bgbrp">
			<view>支付方式</view>
			<radio-group @change="changePaymentType">
				<view class="payment-type-item">
					<view class="name">微信支付</view>
					<label class="radio">
						<radio value="1" :checked="paymentType === '1'" />
					</label>
				</view>
				<view class="payment-type-item">
					<view class="name">支付宝</view>
					<label class="radio">
						<radio value="2" :checked="paymentType === '2'" />
					</label>
				</view>
			</radio-group>
		</view>
		<view class="bottom">
			<view class="num">共{{cartDetail.totalNum}}件</view>
			<view class="price">
				<view class="t">
					合计:
				</view>
				<view class="s">￥</view>
				<view class="b">{{parseInt(cartDetail.totalPrice/100)}}</view>
				<view class="s">
					.{{cartDetail.totalPrice%100}}
				</view>
			</view>
			<view class="button">
				<u-button class="button" type="warning" @click="submitOrder">提交订单</u-button>
			</view>


		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				cartDetail: {},
				ImgUrl: "",
				addressInfo: null,
				paymentType: '1',
				isCart:true
			}
		},
		methods: {
			// 显示地址详情页面
			showAddress() {
				console.log("showAddress");
				paymentType: this.paymentType
			},
			// 提交订单
			async submitOrder() {
				if(!this.addressInfo){
					return uni.showLoading({
						title: "地址未填写",
						icon:"none"
					})
				}
				uni.showLoading({
					title: "支付中"
				})
				let result = await this.$Request({
					url: "/order/add",
					data: {
						productList: JSON.stringify(this.cartDetail.productList),
						totalPrice: parseInt(this.cartDetail.totalPrice / 100) + this.cartDetail.totalPrice % 100 / 100,
						totalNum: this.cartDetail.totalNum,
						address: this.addressInfo.fullAddress,
						paymentType: this.paymentType,
						phone: this.addressInfo.phone,
						consigneeName: this.addressInfo.consigneeName
					}
				})
				if (result.code === 200) {
					if(this.isCart){
						console.log(this.isCart +"iscart");
						// 删除购物车中已支付的数据
						// 获取购物车列表
						// 获取id列表
						let arr = [];
						this.cartDetail.productList.forEach(item => {
							arr.push(item.productId)
						})
						let cartList = uni.getStorageSync("cart");
						
						cartList.productList = cartList.productList.filter(item => {
							return !arr.includes(item.productId);
						})
						cartList.totalNum -= this.cartDetail.totalNum;
						cartList.totalPrice -= this.cartDetail.totalPrice;
						uni.setStorageSync("cart", cartList)
					}
					
					uni.hideLoading();
					// 跳转路由
					uni.redirectTo({
						url: `/pages/paymentSuccess/paymentSuccess?orderId=${result.id}`
					})
				}
			},
			// 获取默认地址
			async getDefaultAddress() {
				let result = await this.$Request({
					url: "/address/getDefault"
				})
				if (result.code === 200) {
					// 如果没有地址信息
					if (!result.data) {
						this.addressInfo = null
						return;
					}
					this.addressInfo = result.data;
				}
			},
			goToMyAddress() {
				uni.redirectTo({
					url: "/pages/myAddress/myAddress?isSettlement=true"
				})
			},
			// 改变支付方式
			changePaymentType(e) {
				this.paymentType = e.detail.value;
			}
		},
		onLoad(options) {
			// 从路由传参获取
			// console.log(options);
			// console.log(options.productList);
			// this.cartDetail = options;
			// this.cartDetail.productList = JSON.parse(this.cartDetail.productList);

			if (options.addressInfo) {
				this.addressInfo = JSON.parse(options.addressInfo);
			}
			if (options.isCart) {
				this.isCart = false;
			}
		},
		mounted() {
			this.ImgUrl = this.$ImageUrl;
			// 从缓存获取
			this.cartDetail = uni.getStorageSync("settlementCart");
			this.cartDetail.productList = JSON.parse(this.cartDetail.productList);
			console.log(this.cartDetail);
			if(!this.addressInfo){
				this.getDefaultAddress();
			}
		}
	}
</script>

<style lang="scss">
	.settlement {
		background: #f4f4f4;
		padding: 20rpx 20rpx 120rpx;
		box-sizing: border-box;
		min-height: 100%;

		.bgbrp {
			background: #fff;
			border-radius: 16rpx;
			padding: 16rpx;
		}

		.address-box {
			margin-bottom: 20rpx;

			.address-info {
				width: 90%;
				margin-bottom: 8rpx;
			}

			.info {
				display: flex;
				align-items: center;

				.phone {
					color: #666;
					font-size: 28rpx;
					margin-left: 10rpx;
				}

			}

			.address-info {
				font-size: 30rpx;
			}
		}

		.content {
			.item {
				display: flex;
				border-bottom: 1px solid #efefef;
				padding: 20rpx 0;
				align-items: center;
				image{
					border-radius: 10rpx;
				}
				.product-info {
					margin-left: 12rpx;
					flex: 1;
					
					.product-name {
						font-size: 28rpx;
						min-height: 120rpx;
					}

					.p-box {
						margin-top: 20rpx;
						display: flex;
						justify-content: space-between;
					}
				}

			}

		}

		.payment-type {
			margin-top: 20rpx;

			.payment-type-item {
				display: flex;
				padding: 20rpx 0;
				justify-content: space-between;
				font-size: 28rpx;
			}
		}

		.bottom {
			position: fixed;
			z-index: 100;
			width: 100vw;
			background: #fff;
			left: 0;
			bottom: var(--window-bottom);
			height: 100rpx;
			display: flex;
			align-items: center;
			justify-content: flex-end;
			padding: 0 10px;
			box-sizing: border-box;

			.button {
				width: 180rpx;
				border-radius: 40rpx;
			}

			.num {
				margin-right: 8rpx;
				font-size: 28rpx;
				color: #666;
				margin-top: 4rpx;
			}

			.price {
				color: red;
				display: flex;
				align-items: flex-end;
				margin-right: 8rpx;

				.t {
					font-weight: 550;
					font-size: 28rpx;
					color: #000;
					line-height: 60rpx;
				}

				.b {
					font-size: 48rpx;
					font-weight: 550;
				}

				.s {
					font-size: 28rpx;
					line-height: 52rpx;
				}
			}
		}

		.payment-type {}
	}
</style>