// const pubUrl = "http://127.0.0.1:3000/api" //这是我要请求的数据接口的公共部分
import {
	BaseUrl
} from '@/utils/config.js'

const Request = (options) => {
	return new Promise((resolve, reject) => {
		uni.request({
			url: BaseUrl + options.url,
			method: options.method || 'post',
			data: options.data || {},
			header: options.header || {
				'content-type': 'application/x-www-form-urlencoded',
				'Authorization': uni.getStorageSync("token") || ''
			},

			success: (res) => {
				console.log(options.url);
				console.log(res.data);
				if (res.data.code === 302) {
					uni.reLaunch({
						url: "../../pages/login/login"
					})
				}
				// 成功返回数据
				resolve(res.data)
			},
			fail: reject
		})
	})
}
export default Request