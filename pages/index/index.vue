<template>
	<view class="index">
		<u-sticky bgColor="#fff">
			<u-tabs :list="categoryList" keyName="categoryName" @click="changeCategory"></u-tabs>
		</u-sticky>
		<view class="product-list">
			<ProductItem v-for="item in productList" :key="item.productId" :productInfo="item" class="item">
			</ProductItem>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				categoryList: [],
				productList: []
			}
		},
		async onLoad() {
			// 获取token 判断是否登录
			let token = uni.getStorageSync("token");
			let tokenStartTime = uni.getStorageSync("tokenStartTime");
			// 定义token过期时间 后端时间为30天  前端定义3天
			const timeOver = 3 * 24 * 60 * 60 * 1000;
			if (!token || !tokenStartTime || (Date.now() - tokenStartTime) > timeOver) {
				uni.reLaunch({
					url: "../../pages/login/login"
				})
			}else{
				// 获取用户信息
				let result = await this.$Request({url:"/user/get"})
				if(result.code === 200){
					uni.setStorageSync("userInfo",result.userInfo);
					console.log(uni.getStorageSync("userInfo"));
				}
			}

			// 获取分类
			this.getCategoryList();
		},
		methods: {
			// 获取分类
			async getCategoryList() {
				let result = await this.$Request({
					url: "/category/get"
				})
				if (result.code === 200) {
					this.categoryList = result.data;
					// 初始化第一个商品列表
					this.getProductByCategoryId(this.categoryList[0].categoryId);
				}
			},
			// 获取分类商品
			async getProductByCategoryId(categoryId) {
				let result = await this.$Request({
					url: "/product/getByCategoryId",
					data: {
						isActive: 1,
						categoryId
					}
				});
				if (result.code === 200) {
					this.productList = result.data.list
				}
			},
			// 改变分类
			changeCategory(e) {
				// console.log(categoryId);
				this.getProductByCategoryId(e.categoryId);
			},

		}
	}
</script>

<style lang="scss">
	.index {
		box-sizing: border-box;
		background: #f4f4f4;
		// min-height: calc(100% -100px);
		min-height: calc(100vh - 94px);

		.product-list {
			padding: 10rpx;
			display: flex;
			flex-wrap: wrap;
			.item {
				// width: 100%;
			}
		}
	}
</style>