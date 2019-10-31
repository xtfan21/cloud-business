import { DEFAULT_GRID_CONFIG } from './constants';

export default {};

const ORDER = new Proxy({
    taobao: 1,
    top: 1,
    uni_top: 1,
    jd: 2,
    jos: 2,
    uni_jos: 2,
    youzan: 3,
    uni_youzan: 3,
    offline: 4,
    uni_offline: 4
}, {
    get(target, propName) {
        return target[propName.toLowerCase()];
    }
});

function compareBetween(value, start, end) {
    if(value === undefined || value === null || value === '') return true;
    if (start && !end) return value >= start;
    if (!start && end) return value <= end;
    if (start && end) return value >= start && value <= end;
    return true;
}

/**
 * 本地资源，使用query进行前端搜索
 */
export function filterData(data, query) {

    const {
        platCode,
        shopId,
        'categories.id': categoriesId,
        minPrice,
        maxPrice,
        startListTime,
        endListTime,
    } = query;

    // 相等处理
    return data.filter(d => {
        // 基础比较
        const isMatched = ['id', 'name', 'status', 'outerId'].every(key => {
            const value = d[key];
            const valueSearch = query[key];
            if (!value || !valueSearch) return true;
            return key === 'name' ? value.includes(valueSearch) : value === valueSearch;
        });
        if (isMatched === false) return false;

        // 区间比较
        const { listTime, price } = d;
        const startTime = (new Date(startListTime)).getTime();
        const endTime = (new Date(endListTime)).getTime();
        if (!compareBetween(listTime, startTime, endTime)) return false;
        if (!compareBetween(price, minPrice, maxPrice)) return false; 

        // 特殊比较
        if (categoriesId) {
            if (!d.categories.find(item => item.id === categoriesId)) return false;
        }

        if ((shopId.toString()) !== (d.shopId.toString()) ) {
            return false;
        }

        if (platCode) {
            if (ORDER[d.platCode] !== ORDER[platCode]) return false;
        }

        return true;
    });
}

/**
 * 本地数据分页
 */
export function sliceData(dataList, pageSize, rawPageNum, query = {}) {
    const totalCount = dataList.length;
    const totalPage = Math.ceil(totalCount / pageSize);
    const pageNum = Math.min(rawPageNum, totalPage);
    let data = dataList.slice((pageNum - 1) * pageSize, pageNum * pageSize);

    if (Object.keys(query).length !== 0) {
        data = filterData(data, query);
    }

    return { data, pageSize, pageNum, totalCount, totalPage };
}

/**
 * 生成高亮元素
 */
export function highlighter(source, keyword, accentColor='yellow') {
    if (source == null || keyword == null || keyword === '') return source;
    const reg = new RegExp(`${keyword}`, 'ig');
    return source.replace(reg, `<span style="background: ${accentColor}">${keyword}</span>`);
}

/**
 * 通过field生成params
 */
export function mapFieldValue(field, value) {
    if (!Array.isArray(field) || !Array.isArray(value)) {
        return value ? { [field]: value } : {};
    }
    return field.reduce((acc, item, index) => {
        return value[index] ? { ...acc, [item]: value[index] } : acc;
    }, {});
}

/**
 * cellCheck的选中状态
 */
export function getCheckStatus(row, selectedGoods) {
    // 处理skus的选择
    if (row.isSku) {
        return selectedGoods.some(goods => {
            const { skus } = goods;
            return Array.isArray(skus) && skus.some(sku => sku.id === row.id);
        });
    }
    
    // 处理商品的选择（包含半选）
    const targetGoods = selectedGoods.find(item => item.id === row.id);
    if (!targetGoods) return false;
    if (!targetGoods.skus || targetGoods.skus.length === row.skus.length) return true;
    return 'indeterminate';
}

/**
 * 全选当页/全选全部
 */
export function getMultiCheckedStatus(dataList, selectedGoods) {
    if (dataList.length * selectedGoods.length === 0 || selectedGoods.length < dataList.length) return false;

    const selectedGoodsHash = selectedGoods.reduce((acc, data, index) => ({ ...acc, [data.id]: index }), {});
    return dataList.every(data => {
        if (!data.skus) return data.id in selectedGoodsHash;  // 无skus

        const index = selectedGoodsHash[data.id];
        return data.id in selectedGoodsHash && selectedGoods[index].skus.length === data.skus.length;
    });
}

/**
 * 生成表格配置
 */

export function genGridConf(limit, config={}) {
    return { 
        ...DEFAULT_GRID_CONFIG, 
        textConfig: {
            'checked-info': {
                'zh-cn': `<span class="goods-selector-footer-tips">已选：商品（{0}/${limit}）</span>`
            }
        },
        ...config
     };
}

export function platShopDropdown(platShopList) {
    const platList = [];
    const shopList = [];
    const platHash = {};

    platShopList.forEach(item => {
        const { platCode, platName, shopId, shopName } = item;
        shopList.push({ shopId, shopName, platCode, platName });
        if (platCode in platHash) {
            return;
        }
        platList.push({ platCode, platName });
        platHash[platCode] = null;
    });

    return { platList, shopList };
}

export function genPlatShopValue(platShopList, platShop) {
    const { shopId: defaultShop, platCode: defaultPlat } = platShopList[0]; // default
    const { shopId = defaultShop, platCode = defaultPlat } = platShop;

    return { shopId, platCode };
}

export function genNewConfig(config, index, alternative) {
    return [
        ...config.slice(0, index),
        { ...config[index], ...alternative },
        ...config.slice(index + 1)
    ];
}