<template>
	<view class="product-detail">
		<view class="swiper" v-if="productDetailInfo.bannerList !== '[]'">
			<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" circular
				style="width: 750rpx;height: 750rpx;">
				<swiper-item v-for="(item,index) in JSON.parse(productDetailInfo.bannerList)" :key="index">
					<view class="swiper-item">
						<image :src="ImgUrl + item" class="image"></image>
					</view>
				</swiper-item>

			</swiper>
		</view>
		<view class="cover" v-else>
			<image :src="ImgUrl + productDetailInfo.cover" class="image"></image>
		</view>
		<view class="content">
			<view class="price">
				<view class="b">￥{{Math.trunc(productDetailInfo.productPrice)}}</view>
				<view class="s">
					.{{String(productDetailInfo.productPrice).substring(String(productDetailInfo.productPrice).length-2)}}
				</view>
			</view>
			<view class="name">
				  {{productDetailInfo.productName}}
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				productDetailInfo: {},
				ImgUrl: "",
				productId: null,
			}
		},
		methods: {
			// 获取商品详情数据
			async getProductDetail(productId) {
				let result = await this.$Request({
					url: "/product/getDetail",
					data: {
						productId
					}
				})
				if (result.code === 200) {
					this.productDetailInfo = result.data;
					console.log(this.productDetailInfo);
					uni.setNavigationBarTitle({
						title: result.data.productName
					})
				}
			}
		},
		onLoad(options) {
			this.productId = options.productId;
		},
		mounted() {
			this.getProductDetail(this.productId);
			this.ImgUrl = this.$ImageUrl
		}
	}
</script>

<style lang="scss">
	.product-detail {
		.image {
			display: block;
			width: 750rpx;
			height: 750rpx;
		}

		.content {
			padding: 20rpx;

			.price {
				color: red;
				display: flex;
				align-items: flex-end;

				.b {
					font-size: 48rpx;
				}

				.s {
					font-size: 36rpx;
					line-height: 52rpx;
				}
			}
			
			.name{
				margin-top: 20rpx;
				font-weight: bold;
			}
		}
	}
</style>