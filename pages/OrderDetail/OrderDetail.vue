<template>
	<view class="order-detail">
		
		<view class="content">
			<view class="top">
				<view>订单详情</view>
			</view>
			<view class="item" v-for="productInfo in orderInfo.productList" :key="productInfo.productId">
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
			<view class="bottom">
				<view class="price-box">
					<view class="left">实付款：</view>
					<view class="price">
						<view class="s">￥</view>
						<view class="b">{{parseInt(orderInfo.totalPrice)}}</view>
						<view class="s">
							.{{String(orderInfo.totalPrice*100).substring(String(orderInfo.totalPrice*100).length-2)}}
						</view>
					</view>
				</view>
				<view class="row">
					<view class="left">
						收货信息:
					</view>
					<view class="right">
						{{orderInfo.consigneeName}}
						{{orderInfo.phone}}
						{{orderInfo.address}}
					</view>
				</view>
				<view class="row">
					<view class="left">
						订单编号:
					</view>
					<view class="right">
						{{orderInfo.orderId}}
					</view>
				</view>
				<view class="row">
					<view class="left">
						交易时间:
					</view>
					<view class="right">
						{{orderInfo.createTime}}
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				orderInfo: {},
				ImgUrl: ""
			};
		},
		methods: {
			// 获取订单详情
			async getOrderDetail(orderId) {
				let result = await this.$Request({
					url: "/order/getDetail",
					data: {
						orderId
					}
				})
				if (result.code === 200) {
					this.orderInfo = result.data
				}
			}
		},
		onLoad(options) {
			if (options.orderId) {
				this.getOrderDetail(options.orderId)
			}
			this.ImgUrl = this.$ImageUrl
		},
		onBackPress() {
			uni.redirectTo({
				url:"/pages/myOrder/myOrder"
			})
		}
	}
</script>

<style lang="scss">
	.order-detail {
		background: #f4f4f4;
		min-height: calc(100vh - 40rpx - var(--window-top));
		padding: 20rpx;

		.content {
			background: #fff;
			border-radius: 16rpx;
			padding: 16rpx;
			min-height: calc(100vh - 72rpx - var(--window-top));
			.item {
				display: flex;
				border-bottom: 1px solid #efefef;
				padding: 20rpx 0;
				align-items: center;

				.product-info {
					flex: 1;
					margin-left: 16rpx;
					.product-name {
						font-size: 28rpx;
						min-height: 120rpx;
						word-break: break-all;
						overflow: hidden;
						display: -webkit-box;
						-webkit-line-clamp: 3;
						-webkit-box-orient: vertical;

					}

					.p-box {
						display: flex;
						justify-content: space-between;

						.product-price {
							font-weight: 550;

						}
					}
				}

			}

			.bottom {
				.price-box{
					display: flex;
					justify-content: space-between;
					margin-top: 16rpx;
					min-height: 80rpx;
					align-items: center;
					margin-bottom: 20rpx;
					.left{
						font-size: 28rpx;
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
				.row {
					display: flex;
					justify-content: space-between;
					margin-top: 16rpx;
					min-height: 80rpx;
					align-items: flex-start;
					
					.left{
						font-size: 28rpx;
						min-width: 160rpx;
						line-height: 36rpx;
					}
					.right{
						font-size: 26rpx;
						color: #676767;
						line-height: 36rpx;
					}
					
				}
			}

		}
	}
</style>