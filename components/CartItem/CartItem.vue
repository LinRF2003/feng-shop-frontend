<template>
	<view class="cart-item">
		<label class="radio">
			<radio :checked="product.isSelect === 1" @click="changeSelect" v-if="productInfo.isActive" />
			<radio disabled v-else />
		</label>
		<view class="cover" v-if="productInfo.cover">
			<image :src="ImgUrl + productInfo.cover" mode="" class="image"></image>
		</view>
		<view class="right">
			<view class="name">{{productInfo.productName}}</view>
			<view class="box">
				<view class="price">
					<view class="s">￥</view>
					<view class="b">{{Math.trunc(productInfo.productPrice)}}.</view>
					<view class="s">
							{{String(productInfo.productPrice*100).substring(String(productInfo.productPrice*100).length-2)}}
					</view>
				</view>

			</view>
		</view>
		<view class="number-box" v-if="product" v-show="!isManage">
			<u-number-box v-model="product.num" @change="changeProductInventory" :min="1"
				:max="productInfo.productInventory">
				<view slot="minus" class="minus" v-if="productInfo.num!=1">
					<u-icon name="minus" size="12" color="#FFFFFF"></u-icon>
				</view>
				<view slot="minus" class="disabled-bg" v-else>
					<u-icon name="minus" color="#000" size="12"></u-icon>
				</view>
				<input slot="input" type="number" class="input" v-model="product.num" maxlength="3" @blur="inputBlur">
				<view slot="plus" class="plus" v-if="product.num<productInfo.productInventory">
					<u-icon name="plus" color="#fff" size="12"></u-icon>
				</view>
				<view slot="plus" class="disabled-bg" v-else>
					<u-icon name="plus" color="#000" size="12"></u-icon>
				</view>
			</u-number-box>
		</view>
		<button class="del-button" v-show="isManage" @click="delCart">删除</button>
	</view>
</template>

<script>
	export default {
		name: "CartItem",
		data() {
			return {
				oldNum: 0,
				ImgUrl: "",
				productInfo: {},
				product: null
			};
		},
		props: ["product2", "isManage"],
		methods: {
			// 改变选择
			changeSelect() {
				// 给父组件发送信息
				if (this.product.isSelect) {
					this.$emit("changePrice", {
							price: -this.product.num * (this.productInfo.productPrice * 100),
							num: -this.product.num
						}

					)
					this.product.isSelect = 0;
				} else {
					this.$emit("changePrice", {
						price: this.product.num * (this.productInfo.productPrice * 100),
						num: this.product.num
					})
					this.product.isSelect = 1;
				}

				// 给父组件发送消息判断是否全选
				this.$emit("changeSelect", this.product.isSelect)
			},
			// 改变选择的数量
			changeProductInventory(e) {
				if (this.product.isSelect) {
					this.$emit("changePrice",
						// productId: this.productInfo.productId,
						// productInventory: e.value,
						// productPrice: this.productInfo.productPrice,
						{
							price: (e.value - this.oldNum) * (this.productInfo.productPrice * 100),
							num: e.value - this.oldNum
						}
					)

				}
				this.oldNum = e.value;
			},
			// 选择数量 input 失去焦点
			inputBlur(e) {
				if (parseInt(e.detail.value) < 1) {
					this.product.num = 1;
				} else if (parseInt(e.detail.value) > this.productInfo.productInventory) {
					this.product.num = this.productInfo.productInventory;
				}
				if (this.product.isSelect) {
					this.$emit("changePrice",
						// productId: this.productInfo.productId,
						// productInventory: e.value,
						// productPrice: this.productInfo.productPrice,
						{
							price: (this.product.num - this.oldNum) * (this.productInfo.productPrice * 100),
							num: this.product.num - this.oldNum
						}


					)

				}
				this.oldNum = this.product.num;

			},
			// 获取商品详情数据
			async getProductDetail(productId) {
				let result = await this.$Request({
					url: "/product/getDetail",
					data: {
						productId
					}
				})
				if (result.code === 200) {
					this.productInfo = result.data;
				}
			},
			// 删除购物车中当前商品信息
			delCart() {
				console.log(this.product.productId);
				console.log(this.productInfo.productPrice);
				console.log(this.product.num);
				// 选中状态下
				if (this.product.isSelect) {
					this.$emit("delCart", {
						productId: this.productInfo.productId,
						changePrice: this.productInfo.productPrice * 100 * this.product.num,
						changeNum: this.product.num
					})
				} else {
					this.$emit("delCart", {
						productId: this.productInfo.productId,
						changePrice: 0,
						changeNum: 0
					})
				}
			}
		},
		mounted() {
			this.product = this.product2;
			this.getProductDetail(this.product.productId)
			this.oldNum = this.product.num;
			this.ImgUrl = this.$ImageUrl;
			if (!this.product.isSelect) {
				// 给父组件发送消息判断是否全选
				this.$emit("changeSelect", this.product.isSelect)
			}

		}
	}
</script>

<style lang="scss">
	.cart-item {
		display: flex;
		align-items: center;
		padding: 10px 0;
		.cover {
			.image {
				width: 200rpx;
				height: 200rpx;
				border-radius: 16rpx;
			}
		}

		.right {
			flex: 1;
			height: 100%;
			margin:0 16rpx ;
			.name {
				font-size: 24rpx;
				margin-bottom: 20rpx;
				word-break: break-all;
				overflow: hidden;
				display: -webkit-box;
				-webkit-line-clamp: 3;
				-webkit-box-orient: vertical;
			}

			.box {
				display: flex;
				align-items: center;


				.price {
					flex: 1;
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

		.del-button {
			min-width: 160rpx;
		}

		.number-box {
			background: #ebecee;
			border-radius: 44rpx;
			min-width: 160rpx;

			// 步进器样式start
			.minus {
				width: 44rpx;
				height: 44rpx;
				border-radius: 50%;
				@include flex;
				justify-content: center;
				align-items: center;
				background-color: #304D99;
				border: 1rpx solid #dddddd;
			}

			.input {
				padding: 0 10rpx;
				width: 48rpx;
				text-align: center;
				color: #000000;
				font-size: 24rpx;
			}

			.plus {
				width: 44rpx;
				height: 44rpx;
				background-color: #304D99;
				border-radius: 50%;
				/* #ifndef APP-NVUE */
				display: flex;
				/* #endif */
				justify-content: center;
				align-items: center;
			}

			.disabled-bg {
				width: 44rpx;
				height: 44rpx;
				background-color: #f7f8fa;
				border-radius: 50%;
				/* #ifndef APP-NVUE */
				display: flex;
				/* #endif */
				justify-content: center;
				align-items: center;
			}

			// 步进器样式end
		}
	}
</style>