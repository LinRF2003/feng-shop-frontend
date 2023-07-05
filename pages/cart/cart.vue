<template>
	<view class="cart">

		<view class="cart-list">
			<view class="item" v-for="item in productList" :key="item.productId" >
			<CartItem  ref="cartItem" @changePrice="changePrice"
				@changeSelect="changeSelect" :productInfo="item"></CartItem>
				</view>
		</view>
		<view class="bottom">
			<view class="all-select">
				<view class="radio">
					<radio :checked="selectAll" @click="selectAllButton" />
				</view>
				<view class="text">全选</view>
			</view>
			<!-- {{allPrice}} -->
			<view class="t">总金额:</view>
			<view class="price">
				<view class="b">￥{{parseInt(totalPrice/100)}}</view>
				<view class="s">
					.{{totalPrice%100}}
				</view>

			</view>
			<button @click="settlement">
				结算
			</button>
		</view>
	</view>
</template>

<script>
import { nextTick } from 'process';
	export default {
		data() {
			return {
				selectAll: false,
				totalPrice: 0,
				productList:[]
			}
		},
		methods: {
			// 全选按钮
			selectAllButton() {
				this.selectAll = this.selectAll ? false : true;
				this.totalPrice = 0;
				console.log(this.$refs);
				if (this.selectAll) {
					this.$refs.cartItem.forEach(item => {
						this.totalPrice += item.productInfo.productInventory * 100 * item.productInfo.productPrice;
						item.productInfo.isSelect = 1;
					})
				} else {
					this.$refs.cartItem.forEach(item => {
						item.productInfo.isSelect = 0;
					})
				}
			},
			// 改变商品总金额
			changePrice(price) {
				console.log(price);
				this.totalPrice += price
			},
			// 子组件改变选择时判断是否全选
			changeSelect(isSelect) {
				console.log(isSelect);
				// 如果传递过来为取消选择，直接设置全选按钮为false
				if (!isSelect) {
					this.selectAll = false;
					return;
				}

				// 循环判断是否全选
				this.selectAll = true;
				this.$refs.cartItem.forEach(item => {
					if (!item.isSelect) {
						this.selectAll = false;
					}
				})
			},
			// 结算
			settlement() {
				let orderList = [];
				this.$refs.cartItem.forEach(item => {
					let orderInfo = {}
					// console.log(this);
					// console.log(item.productInfo.isSelect)
					// console.log(item.productInfo.productInventory);
					// console.log(item.productInfo.productPrice);
					if (item.isSelect) {
						orderInfo.productId = item.productInfo.productId;
						orderInfo.productName = item.productInfo.productName;
						orderInfo.productInventory = item.productInfo.productInventory;
						orderInfo.productPrice = item.productInfo.productPrice;
						orderInfo.cover = item.productInfo.cover;
						orderList.push(orderInfo);
					}

				})
				console.log(orderList);
			}
		},
		mounted() {
			// 获取购物车列表
			let cartList = uni.getStorageSync("cart");
			console.log(cartList);
			if (cartList || cartList.userId === uni.getStorageSync("userInfo").userId) {
				this.productList = cartList.productList;
				console.log(this.productList);
			}
			
			// 获取购物车金额
		
			nextTick(()=>{
					console.log(this.$refs);
				this.$refs.cartItem.forEach(item => {
					// console.log(this);
					// console.log(item.productInfo.isSelect)
					// console.log(item.productInfo.productInventory);
					// console.log(item.productInfo.productPrice);
					if (item.productInfo.isSelect) {
						this.totalPrice += item.productInfo.productInventory * (this.productInfo.productPrice * 100);
					}
				})
			})
		
		}
	}
</script>

<style lang="scss">
	.cart {
		padding-bottom: 100rpx;

		.bottom {
			position: fixed;
			z-index: 100;
			width: 100vw;
			background: #fff;
			bottom: var(--window-bottom);
			height: 100rpx;
			display: flex;
			align-items: center;

			.all-select {
				display: flex;
				align-items: center;
				background: #fff;
			}

			.price {
				color: red;
				display: flex;
				align-items: flex-end;
				flex: 1;
				justify-content: flex-end;
				.b {
					font-size: 48rpx;
				}

				.s {
					font-size: 28rpx;
					line-height: 52rpx;
				}
			}
		}
	}
</style>