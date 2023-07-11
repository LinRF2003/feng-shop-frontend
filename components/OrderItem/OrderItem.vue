<template>
	<view class="order-item">
		<view class="top">
			<view>订单</view>
			<view>交易成功</view>
		</view>
		<navigator class="content" :url="`../../pages/OrderDetail/OrderDetail?orderId=${orderInfo.orderId}`">
			<view class="item" v-for="productInfo in orderInfo.productList" :key="productInfo.productId" >
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
				<view class="num">共{{orderInfo.totalNum}}件</view>
				<view class="price">
					<view class="t">
						合计:
					</view>
					<view class="s">￥</view>
					<view class="b">{{parseInt(orderInfo.totalPrice)}}</view>
					<view class="s">
						{{String(orderInfo.totalPrice).slice(String(orderInfo.totalPrice).length - 3 , String(orderInfo.totalPrice).length)}}
					</view>
				</view>	
			
			</view>
		</navigator>
		<view class="use">
			<button class="del-button" @click="showModal">删除订单</button>
			<u-modal :show="showDelBox" :content="`你确定删除这个订单吗`" show-cancel-button close-on-click-overlay
				width="400rpx" cancel-text="我再想想" confirm-text="删除" @cancel="closeModal" @confirm="deleteOrder"
				@close="closeModal"></u-modal>
		</view>
	</view>
</template>

<script>
	export default {
		name: "OrderItem",
		props: ["orderInfo"],
		data() {
			return {
				ImgUrl: "",
				showDelBox:false
			};
		},
		methods:{
			// 删除订单
			async deleteOrder() {
				let result = await this.$Request({url:"/order/del",data:{
					orderId:this.orderInfo.orderId
				}})
				if(result.code === 200) {
					this.$emit("finishDeleteOrder",this.orderInfo.orderId);
				}
			
				this.showDelBox = false;
			
			},
			// 关闭弹出层
			closeModal() {
				this.showDelBox = false;
			},
			// 显示弹出层
			showModal() {
				this.showDelBox = true;
			}
		},
		mounted() {
			this.ImgUrl = this.$ImageUrl;
		}
	}
</script>

<style lang="scss">
	.order-item {
		background: #fff;
		border-radius: 16rpx;
		padding: 16rpx;
		margin-bottom: 20rpx;

		.top {
			display: flex;
			justify-content: space-between;
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
						font-size: 28rpx;
						min-height: 120rpx;
						word-break: break-all;
								overflow: hidden;
								display: -webkit-box;
								-webkit-line-clamp:3;
								-webkit-box-orient: vertical;
					
					}

					.p-box {
						display: flex;
						justify-content: space-between;
						.product-price{
							font-weight: 550;
								
						}
					}
				}

			}
			.bottom {
	
				background: #fff;
				height: 100rpx;
				display: flex;
				align-items: center;
				justify-content: flex-end;
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
		}
	}
</style>