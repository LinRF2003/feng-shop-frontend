<template>
	<view class="cart-item">
		<label class="radio">
			<radio :checked="productInfo.isSelect === 1" @click="changeSelect" />
		</label>
		<view class="cover">
			<image :src="productInfo.cover" mode="" class="image"></image>
		</view>
		<view class="right">
			<view class="name">{{productInfo.productName}}</view>
			<view class="box">
				<view class="price">
					<view class="s">￥</view>
					<view class="b">{{Math.trunc(productInfo.productPrice)}}.</view>
					<view class="s">
						{{String(productInfo.productPrice).substring(String(productInfo.productPrice).length-2)}}
					</view>
				</view>
				<view class="number-box">
					<u-number-box v-model="productInfo.productInventory" @change="changeProductInventory" min="1"
						max="999" size="120">
						<view slot="minus" class="minus" v-if="productInfo.productInventory!=1">
							<u-icon name="minus" size="12" color="#FFFFFF"></u-icon>
						</view>
						<view slot="minus" class="disabled-bg" v-else>
							<u-icon name="minus" color="#000" size="12"></u-icon>
						</view>
						<input slot="input" type="number" class="input" v-model="productInfo.productInventory"
							maxlength="3" @blur="inputBlur">
						<view slot="plus" class="plus" v-if="productInfo.productInventory!=999">
							<u-icon name="plus" color="#fff" size="12"></u-icon>
						</view>
						<view slot="plus" class="disabled-bg" v-else>
							<u-icon name="plus" color="#000" size="12"></u-icon>
						</view>
					</u-number-box>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "CartItem",
		data() {
			return {
				oldNum: 8,
				productInfo: {
					cover: "http://127.0.0.1:3000/images/default.png",
					productId: 2,
					isActive: 1,
					isSelect: 0,
					productName: "aaa",
					productPrice: 888.99,
					productInventory: 8
				}
			};
		},
		methods: {
			// 改变选择
			changeSelect() {
				
				// 给父组件发送信息
				if (this.productInfo.isSelect) {
					this.$emit("changePrice",
						-this.productInfo.productInventory * this.productInfo.productPrice * 100
					)
					this.productInfo.isSelect = 0;
				} else {
					this.$emit("changePrice",
						this.productInfo.productInventory * this.productInfo.productPrice * 100
					)
					this.productInfo.isSelect = 1;
				}
				
				// 给父组件发送消息判断是否全选
				this.$emit("changeSelect",this.productInfo.isSelect)
			},
			// 改变选择的数量
			changeProductInventory(e) {
				if (this.productInfo.isSelect) {
					this.$emit("changePrice",
						// productId: this.productInfo.productId,
						// productInventory: e.value,
						// productPrice: this.productInfo.productPrice,
						(e.value - this.oldNum) * this.productInfo.productPrice * 100
					)

				}
				this.oldNum = e.value;
			},
			// 选择数量 input 失去焦点
			inputBlur(e){
				
				if (parseInt(e.detail.value) < 1) {
					this.productInfo.productInventory = 1;
				} else if (parseInt(e.detail.value) > 999) {
					this.productInfo.productInventory = 999;
				}
			}
		}
	}
</script>

<style lang="scss">
	.cart-item {
		display: flex;
		align-items: center;

		.cover {
			.image {
				width: 200rpx;
				height: 200rpx;
			}
		}

		.right {
			flex: 1;

			.box {
				display: flex;
				align-items: center;

				.number-box {
					background: #ebecee;
					border-radius: 44rpx;

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
						padding: 0 20rpx;
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
	}
</style>