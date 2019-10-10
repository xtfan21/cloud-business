/**
 * store.js
 * @author wangbo
 * @since 2019/10/10
 */
import http from './http';

class Store {
    /**
     * 获取完整客户信息数据
     */
    // eslint-disable-next-line class-methods-use-this
    async getCustomerInfo(uniId){
        const url = `https://ual.shuyun.com/data-manage-x/1.0/customer/${uniId}`;
        const data = await http.get(url);
        return data.data;
    }

    /**
     * 获取客户信息完整 姓名fullName、手机号mobile、邮箱email
     * @param uniId
     * @param type
     */
    // eslint-disable-next-line class-methods-use-this
    async getCustomerItemInfo(uniId, type) {
        const url = `https://ual.shuyun.com/data-manage-x/1.0/customer/decrypt/${uniId}/${type}`;
        const data = await http.get(url);
        return data.data;
    }

    /**
     * 保存客户信息
     * @param field
     * @param value
     * @param uniId
     */
    // eslint-disable-next-line class-methods-use-this
    async saveCustomerItemInfo(field, value, uniId) {
        // {field: "fullName, gender, birthday, mobile, email, unionAddress", value: ""}
        const url = `https://ual.shuyun.com/data-manage-x/1.0/customer/${uniId}`;
        const data = await http.put(url, { field, value });
        return data.data;
    }

    /**
     * 获取RFM标签列表
     * todo 现在是与自定义标签列表混合，后期需要单独分开
     * @param uniId
     * @returns {Promise<T>}
     */
    // eslint-disable-next-line class-methods-use-this
    async getCustomerTagList(uniId) {
        const url = `https://ual.shuyun.com/data-manage-x/1.0/customerTag/${uniId}`;
        const data = await http.get(url);
        return data.data;
    }

    /**
     * 获取已打标的自定义标签列表: type=1
     * 获取已打标的云标签列表: type=0
     * @returns {Promise<void>}
     */
    // eslint-disable-next-line class-methods-use-this
    async getCustomerMarkedTagList(uniId, type) {
        const url = `https://ual.shuyun.com/data-manage-x/1.0/customerTag/${uniId}/tag/${type}`;
        const data = await http.get(url);
        return data.data;
    }

    /**
     * 获取打标时可选择标签列表, 1表示自定义标签
     * @returns {Promise<void>}
     */
    // eslint-disable-next-line class-methods-use-this
    async getCustomerCanSelectTagList() {
        const url = 'https://ual.shuyun.com/data-manage-x/1.0/tagManage/1/groupInfo';
        const data = await http.get(url);
        return data.data;
    }

    /**
     * 删除自定义标签
     * @param uniId
     * @param tagId
     * @returns {Promise<T>}
     * @constructor
     */
    // eslint-disable-next-line class-methods-use-this
    async DeleteCustomerDefineTag(uniId, tagId) {
        const url = `https://ual.shuyun.com/data-manage-x/1.0/customerTag/${uniId}/tag/${tagId}`;
        const data = await http.delete(url);
        return data.data;
    }

    /**
     * 获取客户常用收货地址信息列表
     */
    // eslint-disable-next-line class-methods-use-this
    async getCustomerAddressList(query, uniId) {
        const url = `https://ual.shuyun.com/data-manage-x/1.0/customer/${uniId}/receiver/address`;
        const data = await http.get(url, { params: query });
        return data.data;
    }

    /**
     * 获取客户权益信息列表
     */
    // eslint-disable-next-line class-methods-use-this
    async getCustomerBenefitList(query) {
        const url = 'https://ual.shuyun.com/data-manage-x/1.0/preferential/detail';
        const data = await http.get(url, { params: query });
        return data.data;
    }

    /**
     * 获取客户互动信息列表
     */
    // eslint-disable-next-line class-methods-use-this
    async getCustomerInteractiveList(query) {
        const url = 'https://ual.shuyun.com/data-manage-x/1.0/customer/interactive';
        const data = await http.get(url, { params: query });
        return data.data;
    }

    /**
     * 获取客户营销信息列表
     */
    // eslint-disable-next-line class-methods-use-this
    async getCustomerMarketingList(query) {
        const url = 'https://ual.shuyun.com/data-manage-x/1.0/marketing/detail';
        const data = await http.get(url, { params: query });
        return data.data;
    }

    /**
     * 获取客户订单信息列表
     */
    // eslint-disable-next-line class-methods-use-this
    async getCustomerOrderList(query) {
        const url = 'https://ual.shuyun.com/data-manage-x/1.0/order/detail';
        const data = await http.get(url, { params: query });
        return data.data;
    }

    /**
     * 获取客户评价信息列表
     */
    // eslint-disable-next-line class-methods-use-this
    async getCustomerOrderRateList(query) {
        const url = 'https://ual.shuyun.com/data-manage-x/1.0/order/rate';
        const data = await http.get(url, { params: query });
        return data.data;
    }

    /**
     * 获取平台列表
     */
    // eslint-disable-next-line class-methods-use-this
    async getPlatList() {
        const url = 'https://ual.shuyun.com/data-manage-x/1.0/customer/platform';
        const data = await http.get(url);
        return data.data;
    }

    /**
     * 获取店铺列表
     */
    // eslint-disable-next-line class-methods-use-this
    async getShopList(platCode) {
        const url = 'https://ual.shuyun.com/data-manage-x/1.0/customer/shops';
        const data = await http.get(url, platCode ? { params: { platCode } } : '');
        return data.data;
    }

}
const store = new Store();
export default store;
