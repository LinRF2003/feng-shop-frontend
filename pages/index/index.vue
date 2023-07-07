<template>
	<view class="index" >
		<u-sticky bgColor="#fff">
			<u-tabs :list="categoryList" keyName="categoryName" @click="changeCategory"></u-tabs>
		</u-sticky>
		<view class="product-list">
			<ProductItem v-for="item in productList" :key="item.productId" :productInfo="item" class="item">
			</ProductItem>
		</view>
		<u-empty text="所谓伊人，在水一方" mode="list" v-if="productList.length === 0 && !loading"></u-empty>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				categoryList: [],
				productList: [],
				pageNo: 1,
				pageSize: 20,
				currentCategoryId: null,
				isOver: false, // 数据是否获取完毕
				loading:true// 数据加载中
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
					url: "../../pages/login/login",
				})
			} else {
				// 获取用户信息
				let result = await this.$Request({
					url: "/user/get"
				})
				if (result.code === 200) {
					uni.setStorageSync("userInfo", result.userInfo);
					console.log(uni.getStorageSync("userInfo"));
				}
			}

			// 获取分类
			this.getCategoryList();
		},
		// 下拉
		onReachBottom(e) {
			// 下拉刷新事件
			// 添加数据
			if (!this.isOver) {
				this.getProductByCategoryId();
			}
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
					this.currentCategoryId = this.categoryList[0].categoryId;
					this.getProductByCategoryId();
				}
			},
			// 获取分类商品
			async getProductByCategoryId() {
				this.loading = true;
				uni.showLoading({
					title: "数据加载中"
				})
				let result = await this.$Request({
					url: "/product/getByCategoryId",
					data: {
						isActive: 1,
						categoryId: this.currentCategoryId,
						pageNo: this.pageNo,
						pageSize: this.pageSize
					}
				});
				if (result.code === 200) {
					if (result.data.list.length === 0 && this.pageNo != 1 ) {
							this.isOver = true;
							uni.showToast({
								title: "没有更多了",
								duration: 2000,
								icon: "none"
							})
						return;
					}
					this.productList = [...this.productList, ...result.data.list];
					this.pageNo += 1;
				}
				this.loading = false;
				uni.hideLoading();
			},
			// 改变分类
			changeCategory(e) {
				// console.log(categoryId);
				// 数据清空
				this.productList = [];
				this.isOver = false;
				this.pageNo = 1;
				this.currentCategoryId = e.categoryId
				this.getProductByCategoryId();
			},

		}
	}
</script>

<style lang="scss">
	.index {
		box-sizing: border-box;
		background: #f4f4f4;
		// min-height: calc(100% -100px);
		// min-height: calc(100vh - 94px);
		min-height: 100%;

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