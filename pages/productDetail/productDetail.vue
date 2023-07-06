<template>
	<view class="product-detail">
		<view class="swiper" v-if="productDetailInfo.bannerList !== '[]'">
			<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" circular
				style="width: 750rpx;height: 750rpx;">
				<!-- 	<swiper-item v-for="(item,index) in productDetailInfo.bannerList && JSON.parse(productDetailInfo.bannerList)" :key="index"> -->
				<swiper-item v-for="(item,index) in bannerList" :key="index">
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
		<view class="bottom">
			<button type="warn" @click="addCart">
				加入购物车
			</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				productDetailInfo: {},
				ImgUrl: "46  01 14",
				productId: null,
				bannerList: []
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
					this.bannerList = JSON.parse(this.productDetailInfo.bannerList)
					console.log(this.productDetailInfo);
					uni.setNavigationBarTitle({
						title: result.data.productName
					})
				}
			},
			// 加入购物车
			addCart() {
				console.log(this.productDetailInfo);
				// let info = {
				// 	productName: this.productDetailInfo.productName,
				// 	productId: this.productDetailInfo.productId,
				// 	productPrice: this.productDetailInfo.productPrice,
				// 	productInventory: this.productDetailInfo.productInventory,
				// 	isActive: this.productDetailInfo.isActive,
				// 	isSelect:1,
				// 	cover: this.productDetailInfo.cover,
				// 	num: 1
				// }
				let info = {
						productId: this.productDetailInfo.productId,
						isSelect:0,
						num: 1
				}
				// 下面判断购物车中是否有此信息时用到
				let isHas = false;
				let cartList = uni.getStorageSync("cart");
				if (!cartList || cartList.userId != uni.getStorageSync("userInfo").userId) {
					// 初始化信息
					cartList = {
						productList: [],
						totalPrice: 0,
						totalNum: 0,
						userId: uni.getStorageSync("userInfo").userId
					}
				} else {


					// 判断购物车中是否有此信息
					cartList.productList.forEach(item => {
						if (item.productId === info.productId) {
							isHas = true;
							if (item.num < info.productInventory) {
								item.num += 1;
								cartList.totalNum += 1;
								cartList.totalPrice += info.productPrice * 100;
							} else {
								uni.showToast({
									title: "购物车商品已达库存数量",
									icon: "none"
								})
							}
							return;
						}
					})

				}
				if (!isHas) {
					cartList.productList.push(info);
					cartList.totalNum += 1;
					cartList.totalPrice += info.productPrice * 100;
				}

				uni.setStorageSync("cart", cartList);
				console.log(cartList);
				console.log(info);
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

			.name {
				margin-top: 20rpx;
				font-weight: bold;
			}
		}

		.bottom {
			position: fixed;
			bottom: 0;
			right: 0;
		}
	}
</style>