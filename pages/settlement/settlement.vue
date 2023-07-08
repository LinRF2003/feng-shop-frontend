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
			<u-cell title="停车坐爱枫林晚" title-style="font-weight: 550;" isLink label="林先生 1813874231" :border="false"
				arrow-direction="right" url="/pages/myAddress/myAddress"></u-cell>

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
						<view class="product-num">×{{productInfo.num}}</view>
					</view>

				</view>
			</view>
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
				<u-button class="button" type="warning">提交订单</u-button>
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
			}
		},
		methods: {
			// 显示地址详情页面
			showAddress() {
				console.log("showAddress");
			}
		},
		mounted() {
			this.ImgUrl = this.$ImageUrl;
			this.cartDetail = uni.getStorageSync("settlementCart");
			console.log(this.cartDetail);
		}
	}
</script>

<style lang="scss">
	.settlement {
		background: #f4f4f4;
		padding: 20rpx 20rpx 120rpx;
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

				.product-info {
					flex: 1;

					.product-name {
						font-size: 30rpx;
						min-height: 120rpx;
					}

					.p-box {
						display: flex;
						justify-content: space-between;
					}
				}

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
			.num{
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
	}
</style>