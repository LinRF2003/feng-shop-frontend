<script>
	export default {
		onLaunch: async function() {
			console.log('App Launch');
			// 获取购物车信息
			let result = await this.$Request({
				url: "/cart/get"
			})
			// 初始化信息
			const cartList = {
				productList: JSON.parse(result.data.list),
				totalPrice: result.data.totalPrice * 100,
				totalNum: result.data.totalNum,
				userId: result.data.userId
			}
			console.log(cartList);
			uni.setStorageSync("cart", cartList)
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
						totalPrice: parseFloat((cartList.totalPrice / 100) + "." + (cartList.totalPrice %
							100)),
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

	uni-page-body,
	html,
	body {
		height: 100%;
	}
</style>