<template>
	<view class="product-item" @click="goToProductDetail(productInfo.productId)" v-if="productInfo.productInventory >= 0">
		<view class="cover">
			<image :src="ImgUrl + productInfo.cover" mode="widthFix"></image>
			<!-- <image :src="$ImageUrl + productInfo.cover + productInfo.cover"></image> -->
			<!-- {{productInfo}} -->
		</view>
		<view class="content">
			<view class="name">
				{{productInfo.productName}}
			</view>
			<view class="price">
				<view class="s">￥</view>
				<view class="b">{{Math.trunc(productInfo.productPrice)}}.</view>
				<view class="s">
					{{String(productInfo.productPrice).substring(String(productInfo.productPrice).length-2)}}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "ProductItem",
		props: {
			productInfo: {
				type: Object,
				require: true
			}
		},
		data() {
			return {
				ImgUrl: ""
			};
		},
		methods: {
			// 去到博客详情
			goToProductDetail(productId) {
				uni.navigateTo({
					url: `/pages/productDetail/productDetail?productId=${productId}`
				})
			}
		},
		mounted() {
			this.ImgUrl = this.$ImageUrl
		}
	}
</script>

<style lang="scss">
	.product-item {
		background: #fff;
		border-radius: 16rpx;
		// width: calc(50% - 20rpx);
		width: 345rpx;
		box-sizing: border-box;
		padding: 10rpx;
		margin: 10rpx;

		image {
			width: 100%;
			display: block;
		}

		.content {
			padding: 0 20rpx;

			.name {
				font-size: 28rpx;
				height: 80rpx;	
				word-break: break-all;
				overflow: hidden;
				display: -webkit-box;
				-webkit-line-clamp: 2;
				-webkit-box-orient: vertical;
				margin-bottom: 8rpx;
			}

			.price {
				color: red;
				display: flex;
				align-items: flex-end;

				.b {
					font-size: 36rpx;
				}

				.s {
					font-size: 28rpx;
					line-height: 40rpx;
				}
			}
		}

	}
</style>