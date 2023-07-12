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
			<view class="box"><view class="price">
				<view class="b">￥{{Math.trunc(productDetailInfo.productPrice)}}</view>
				<view class="s">
					.{{String(productDetailInfo.productPrice).substring(String(productDetailInfo.productPrice).length-2)}}
				</view>
			</view>
			<view>	库存: {{productDetailInfo.productInventory}}</view></view>
			
		
			<view class="name">
				{{productDetailInfo.productName}}
			</view>
		</view>
		<view class="bottom">
			<button type="default" @click="addCart">
				加入购物车
			</button>
			<button type="warn" @click="settlement">
				立即购买
			</button>
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
				if(this.productDetailInfo.productInventory <= 0) {
					return uni.showToast({
						title:"商品库存为0，暂时不可购买",
						icon:"none"
					})
				}
				// 把修改商品值设为 true
				uni.setStorageSync("isChangeCart", true);
				// 商品信息
				let info = {
					productId: this.productDetailInfo.productId,
					isSelect: 0,
					num: 1
				}
				// 下面判断购物车中是否有此信息时用到
				let isHas = false;
				let cartList = uni.getStorageSync("cart");
				// 判断购物车中是否有此信息
				cartList.productList.forEach(item => {
					if (item.productId === info.productId) {
						isHas = true;
						if (item.num < this.productDetailInfo.productInventory) {
							item.num += 1;
							if (item.isSelect) {
								cartList.totalNum += 1;
								cartList.totalPrice += this.productDetailInfo.productPrice * 100;
							}

							uni.showToast({
								title: "加入购物车成功",
								icon: "none"
							})
						} else {
							uni.showToast({
								title: "购物车商品已达库存数量",
								icon: "none"
							})
						}
						return;
					}
				})
				// }
				if (!isHas) {
					cartList.productList.push(info);
				}

				uni.setStorageSync("cart", cartList);
				console.log(cartList);
				console.log(info);
			},
			settlement() {
				if(this.productDetailInfo.productInventory <= 0) {
					return uni.showToast({
						title:"商品库存为0，暂时不可购买",
						icon:"none"
					})
				}
				this.productDetailInfo.num = 1;
				// 购物车选中数据
				let cartDetail = {
					productList: [this.productDetailInfo],
					totalNum: 1,
					totalPrice: this.productDetailInfo.productPrice * 100
				}

				// // 价格 名称 数量 封面图

				// 前往结算页面
				// cartDetail.productList.num = 1;
				// console.log(cartDetail.productList.num);
				cartDetail.productList = JSON.stringify(cartDetail.productList);
				// 存入缓存
				uni.setStorageSync("settlementCart", cartDetail);
				uni.navigateTo({
					url: "/pages/settlement/settlement"
				})
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
			.box{
				display: flex;
				justify-content: space-between;
			}
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
			display: flex;
			bottom: 0;
			right: 0;

			button {
				margin-left: 20rpx;
			}
		}
	}
</style>