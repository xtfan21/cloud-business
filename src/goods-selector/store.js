import axios from 'axios';
import jeasy from 'jeasy';

import { urlMap } from './constants';

// 针对请求，拦截添加x-token
axios.interceptors.response.use(config => {
    const { headers } = config;
    const credential = localStorage.ccmsRequestCredential;

    headers['X-TOKEN'] = credential ? JSON.parse(credential).id : 'no token error';
    return config;
});


const storeSymbol = Symbol('goods-selector-store');
export default class Store {

    instance = null;

    categoryCache = {};

    // 延时单例
    static getInstance(server, extraQuery) {
        this.instance  = this.instance || new Store(server, extraQuery, storeSymbol);
        return this.instance;
    }

    constructor(server, extraQuery, symbol) {
        if (symbol !== storeSymbol) {
            throw Error('can not instantiate by new method');
        }
        this.server = server;
        this.extraQuery = extraQuery;
    }

    skusMap = {}; // skusId到Goods数据的映射

    async fetchGoods(search, handler) {
        const { platCode } = search;
        const resData = platCode.startsWith('uni_') ? await this.fetchGoodsUni(search) : await this.fetchGoodsLegacy(search);
        
        // 兼容空数据格式
        resData.data = resData.data || [];
        resData.totalCount = resData.totalCount || 0;

        // 处理skus映射和skus标志, 处理商品信息中平台统一
        const rs = this.handleGoods(resData.data, platCode);
        const processData = handler({ ...resData, data: rs });
        return processData || rs;
    }

    async fetchGoodsUni(search) {
        const url = `${this.server}${urlMap.GOODS_LIST}`
        const { params, data } = this.search2Params(search);  
        const { data: resData } = await axios.post(url, data, { params });
        return resData;
    }

    async fetchGoodsLegacy(search) {
        const url = `${this.server}${urlMap.GOOD_LIST_LEGACY}`
        const { params, data } = this.search2Params(search);  
        delete params.tenant;
        const { data: resData } = await axios.post(url, data, { params });
        return resData;
    }

    /**
     * @param {shopId, platCode} search 
     */
    async fetchCategories(search) {
        const { platCode } = search;
        if (platCode.startsWith('uni_')) {
            return this.fetchCategoriesUni(search);
        }
        return this.fetchCategoriesLegacy(search);
    }

    async fetchCategoriesUni(search) {
        const url = `${this.server}${urlMap.CATEGORIES}`;
        const { params, data } = this.search2Params(search);
        const { data: resData } = await axios.post(url, data, { params });
        return resData.data || [];
    }

    async fetchCategoriesLegacy(search) {
        const url = `${this.server}${urlMap.CATEGORIES_LEGACY}`;
        const { params, data } = this.search2Params(search);
        delete params.tenant;
        const { data: resData } = await axios.post(url, data, { params });
        return resData.data || [];
    }

    async batchImport(search) {
        const { platCode } = search;
        const goods = platCode.startsWith('uni_') ? await this.batchImportUni(search) : await this.batchImportLegacy(search);
        return this.handleGoods(goods);
    }

    async batchImportUni(search) {
        const url = `${this.server}${urlMap.BATCH_IMPORT}`;
        const params = this.extraQuery;
        
        const { platCode: platform, shopId, ...rest } = search;
        const data = { platform, shopId, ...rest };

        const { data: resData } = await axios.post(url, data, { params });
        return resData.data || [];
    }

    async batchImportLegacy(search) {
        const url = `${this.server}${urlMap.BATCH_IMPORT_LEGACY}`;
        
        const { platCode: platform, shopId, ...rest } = search;
        const data = { platform, shopId, ...rest };
        
        const { data: resData } = await axios.post(url, data);
        return resData.data || [];
    }

    search2Params(search) {
        const { id, shopId, platCode, ...reset } = search;
        const data = {};
       
        if (id) {
            data.id = Array.isArray(id) ? id : [id]
        }
        if (shopId) {
            data.shopId = Array.isArray(shopId) ? shopId : [shopId]
        }
   
        let params = { ...reset, ...this.extraQuery, platform: platCode };
        params = jeasy.trim(params);
        
        return { params, data };
    }

    handleGoods(data=[], platCode) {
        return data.map(goods => {
            // 处理skus
            const { skus } = goods;
            if (Array.isArray(skus)) {
                skus.forEach(sku => {
                    sku['isSku'] = true; // eslint-disable-line
                    this.skusMap[sku.id] = goods;
                });
            }
            
            // 处理平台店铺的差异性， 统一使用搜索时的platCode，shopId使用返回值中的。
            return { ...goods, platCode };
        });
    }
}