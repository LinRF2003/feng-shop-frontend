<template>
	<view>
		<view class="address">

		</view>

		<view class="content">

		</view>
		<view class="bottom">
			共3件
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				productList: [],
				totalNum: 0,
				totalPrice: 0			}
		},
		methods: {

		},
		mounted() {
			// 获取购物车列表
			let cartList = uni.getStorageSync("cart");

			// 购物车中有数据
			if (cartList || cartList.userId === uni.getStorageSync("userInfo").userId) {
				this.productList = cartList.productList.filter(item=>!!item.isSelect);
				// 获取购物车金额
				this.totalNum = cartList.totalNum;
				this.totalPrice = cartList.totalPrice;
			}
			console.log(this);
		}
	}
</script>

<style>

</style>