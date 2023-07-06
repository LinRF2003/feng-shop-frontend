<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide');


			let isChangeCart = uni.getStorageSync("isChangeCart")
			// 购物车中有数据
			if (isChangeCart) {
				let cartList = uni.getStorageSync("cart");
				this.productList = cartList.productList;
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
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import "@/uni_modules/uview-ui/index.scss";
</style>