import http from './http';

class Store {

	/**
	 * 获取店铺列表
	 */
	async getShopList(query) {  // eslint-disable-line
		const url = 'https://qa-ual.shuyun.com/ucenter-interface-service/v1/shops/shopDetails';
		const data = await http.get(url, { params: query });

		return data.data;
	}

	/**
	 * 平台数据
	 * @returns {Promise<void>}
	 */
	async fetchChannelData() {  // eslint-disable-line
		const url = 'https://qa-ual.shuyun.com/ucenter-interface-service/v1/channel?tenantName=qiushi6';
		const { data: resData } = await http.get(url);
		return resData
	}

	/**
	 * 线下区域树数据
	 * @param query
	 * @returns {Promise<T>}
	 */
	async fetchRegionTree(query) {  // eslint-disable-line
		const url = 'https://qa-ual.shuyun.com/ucenter-interface-service/v1/region';
		const { data: resData } = await http.get(url, { params: query });

		return resData.data;
	}
}
const store = new Store();
export default store;
