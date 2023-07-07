<template>
	<view class="cart">
		<view class="top">
			<view class="title">购物车</view>
			<view class="cart-manage" @click="()=>{
				isManage = isManage ? false : true;

			}">管理</view>
		</view>
		<view class="cart-list">
			<view class="item" v-for="item in productList" :key="item.productId">
				<CartItem ref="cartItem" @changePrice="changePrice" @changeSelect="changeSelect" :product2="item"
					:isManage="isManage" @delCart="delCart">
				</CartItem>
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
			<view class="info" v-show="!isManage">
				<view class="t">共{{totalNum}}件</view>
				<view class="t">总金额:</view>
				<view class="price">
					<view class="b">￥{{parseInt(totalPrice/100)}}</view>
					<view class="s">
						.{{totalPrice%100}}
					</view>

				</view>

			</view>

			<button @click="settlement" type="warn" v-show="!isManage">
				结算
			</button>
			<view class="del-all-button"> <button @click="deleteSelectCart" type="warn" v-show="isManage">
					删除
				</button></view>

		</view>
	</view>
</template>

<script>
	import {
		nextTick
	} from 'process';
	export default {
		data() {
			return {
				selectAll: false,
				totalPrice: 0,
				totalNum: 0,
				productList: [],
				isManage: false, // 是否显示管理内容
				selectManageAll: false
			}
		},
		methods: {
			// 全选商品按钮
			selectAllButton() {
				this.selectAll = this.selectAll ? false : true;
				this.totalPrice = 0;
				this.totalNum = 0;
				console.log(this.$refs);
				if (this.selectAll) {
					this.$refs.cartItem.forEach(item => {
						this.totalPrice += item.product.num * 100 * item.productInfo.productPrice;
						item.product.isSelect = 1;
						this.totalNum += item.product.num;
					})
				} else {
					this.$refs.cartItem.forEach(item => {
						item.product.isSelect = 0;
					})
				}
			},
			// 改变商品总金额
			changePrice({
				price,
				num
			}) {

				this.totalPrice += price;
				this.totalNum += parseInt(num);
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
					if (!item.product.isSelect) {
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
					// console.log(item.productInfo.productInfo.isSelect)
					// console.log(item.productInfo.productInventory);
					// console.log(item.productInfo.productPrice);
					if (item.product.isSelect) {
						orderInfo.productId = item.productInfo.productId;
						orderInfo.num = item.product.num;
						orderList.push(orderInfo);
					}

				})
				console.log(orderList);
			},
			// 删除商品
			delCart(e) {
				console.log(e);
				this.selectAll = true;
				this.$refs.cartItem.forEach((item, index) => {

					if (item.productInfo.productId === e.productId) {
						// 修改数据
						this.totalNum -= e.changeNum;
						this.totalPrice -= e.changePrice;

						// 删除页面中的数据
						this.productList.splice(index, 1);

					}
					// 判断是否为全选
					if (!item.product.isSelect && item.productInfo.productId !== e.productId) {
						console.log(111);
						this.selectAll = false;
					}
				})
			}
		},
		onShow() {

			// 获取购物车列表
			let cartList = uni.getStorageSync("cart");

			// 购物车中有数据
			if (cartList || cartList.userId === uni.getStorageSync("userInfo").userId) {
				this.productList = cartList.productList;
				// 获取购物车金额
				this.totalNum = cartList.totalNum;
				this.totalPrice = cartList.totalPrice;
			}

		},
		mounted() {
			// 循环判断是否全选
			if (this.$refs.cartItem.length != 0) {
				this.selectAll = true;
			}
			this.$refs.cartItem.forEach(item => {
				if (!item.product.isSelect) {
					this.selectAll = false;
				}
			})
		},
		onHide() {
			// 判断购物车信息是否修改
			let cartList = {
				productList: [],
				totalPrice: this.totalPrice,
				totalNum: this.totalNum,
				userId: uni.getStorageSync("userInfo").userId
			};
			// 商品信息
			this.$refs.cartItem.forEach(item => {
				let productInfo = {
					productId: item.product.productId,
					isSelect: item.product.isSelect,
					num: item.product.num
				}
				cartList.productList.push(productInfo);
			})
			// 写入缓存
			uni.setStorageSync("cart", cartList);
			// this.totalNum = cartList.totalNum;
			// this.totalPrice = cartList.totalPrice;
			// 把购物车信息写入数据库
			this.$Request({
				url: "/cart/update",
				data: {
					list: JSON.stringify(cartList.productList),
					// 转换下数据
					totalPrice: parseFloat((cartList.totalPrice / 100) + "." + (cartList.totalPrice % 100)),
					totalNum: cartList.totalNum
				}
			})
			uni.setStorageSync("isChangeCart", false)

		}

	}
</script>

<style lang="scss">
	.cart {
		margin-bottom: 100rpx;

		.top {
			padding: 0 20rpx;
			display: flex;
			justify-content: space-between;
		}

		.cart-list {

			padding: 0 20rpx;


		}

		.bottom {
			position: fixed;
			z-index: 100;
			width: 100vw;
			background: #fff;
			bottom: var(--window-bottom);
			height: 100rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 0 10px;
			box-sizing: border-box;

			.all-select {
				display: flex;
				align-items: center;
				background: #fff;
			}

			.info {
				flex: 1;
				display: flex;
				align-items: center;
				padding: 10rpx;
				justify-content: flex-end;

				.t {
					font-size: 28rpx;
					margin-left: 5px;
				}

				.price {
					color: red;
					display: flex;
					align-items: flex-end;


					.b {
						font-size: 48rpx;
					}

					.s {
						font-size: 26rpx;
						line-height: 52rpx;
					}
				}
			}

		}
	}
</style>