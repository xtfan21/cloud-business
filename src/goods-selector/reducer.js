import Store from './store';

export const actionTypes = {
    ADD_SELECTED: 'add_selected_goods',
    REMOVE_SELECTED: 'remove_selected_goods',
    SET_SELECTED: 'set_selected_goods',
    CLEAR_SELECTED: 'clear_selected_goods',
    
    CHANGE_TAB: 'change_active_tab'
};

/**
 * 添加单个商品或sku
 */
function addSingleGoods(target, item, selectedHash) {
    const index = selectedHash[item.id];
    // 存在，则覆盖；不存在，则累加。(这里是因为sku，所以需要覆盖)
    return index === undefined ? [...target, item] : [...target.slice(0, index), item, ...target.slice(index + 1)];
}

/**
 * 添加商品或者sku（单个或多个）
 */
function addGoods(selectedGoods, data) {
    // 记录已选商品的id和索引值
    const selectedGoodsHash = selectedGoods.reduce((acc, goods, index) => ({ ...acc, [goods.id]: index }), {});
    if (Array.isArray(data)) {
        return data.reduce((acc, item) => addSingleGoods(acc, item, selectedGoodsHash), selectedGoods);
    }
    return addSingleGoods(selectedGoods, data, selectedGoodsHash);
}

/**
 * 移除商品或者sku
 */
function removeGoods(selectedGoods, data) {
    // 单独处理sku的移除
    if (data.isSku) {
        const store = Store.getInstance();
        const { id: goodsId } = store.skusMap[data.id];
        const index = selectedGoods.findIndex(selected => selected.id === goodsId);
        const goods = selectedGoods[index];
        const newSkus = goods.skus.filter(sku => sku.id !== data.id);
        const newGoods = { ...goods, skus: newSkus };

        return newSkus.length === 0 ?
            selectedGoods.filter(selected => selected.id !== goodsId) : // sku被删完了，商品也被需要被移除
            [...selectedGoods.slice(0, index), newGoods, ...selectedGoods.slice(index + 1)];
    }
    return Array.isArray(data) ?
        selectedGoods.filter(item => data.every(d => item.id !== d.id)) :
        selectedGoods.filter(item => item.id !== data.id);
}

function skus2Goods(sku, selectedGoods) {
    const { id: skuId } = sku;
    const store = Store.getInstance();

    const goods = store.skusMap[skuId];
    // 通过skus在selectedGoods中寻找，如果能找到则用找到的这个往上增量；如果没找到，则初始化一个新的
    const targetGoods = selectedGoods.find(selected => selected.id === goods.id);
    return targetGoods ? { ...targetGoods, skus: [...targetGoods.skus, sku] } : { ...goods, skus: [sku] };
}

function goodsReducer(selectedGoods, action) {
    const { data, type } = action;
    switch(type) {
        case actionTypes.ADD_SELECTED:
            // 涉及sku操作时，data不会为数组类型
            const goods = data.isSku ? skus2Goods(data, selectedGoods) : data; // eslint-disable-line
            return addGoods(selectedGoods, goods);

        case actionTypes.REMOVE_SELECTED:
            return removeGoods(selectedGoods, data);

        case actionTypes.SET_SELECTED:
            return [...data];

        case actionTypes.CLEAR_SELECTED:
            return [];

        default:
            return selectedGoods;
    }
}

function tabReducer(activeTab, action) {
    const { data, type } = action;
    switch(type) {
        case actionTypes.CHANGE_TAB:
            return data;
        default:
            return activeTab;
    }
}

export default function reducer(state, action) {
    return {
        selectedGoods: goodsReducer(state.selectedGoods, action),
        activeTab: tabReducer(state.activeTab, action)
    };
}