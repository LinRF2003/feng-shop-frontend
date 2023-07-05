<template>
	<view class="cart">

		<view class="cart-list">
			<CartItem v-for="(i,index) in 10" :key="index" ref="cartItem" @changePrice="changePrice"
				@changeSelect="changeSelect"></CartItem>
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
	export default {
		data() {
			return {
				selectAll: false,
				totalPrice: 0
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
					if (!item.productInfo.isSelect) {
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
					if (item.productInfo.isSelect) {
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
		computed: {
			// allPrice(){
			// 	if(this.$refs.cartItem){
			// 		this.$refs.cartItem.forEach(item => {
			// 			console.log(item);
			// 		})
			// 	}
			// 	console.log(this.$refs);

			// 	return 1;
			// }
		},
		mounted() {
			this.$refs.cartItem.forEach(item => {
				// console.log(this);
				// console.log(item.productInfo.isSelect)
				// console.log(item.productInfo.productInventory);
				// console.log(item.productInfo.productPrice);
				if (item.productInfo.isSelect) {
					this.totalPrice += item.productInfo.productInventory * 100 * item.productInfo.productPrice;
				}
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