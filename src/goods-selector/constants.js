
const urlMap = {
    'GOODS_LIST': '/standard-selector/1.0/items',
    'GOOD_LIST_LEGACY': '/shuyun-searchapi/1.0/items',
    
    'CATEGORIES': '/standard-selector/1.0/categories',
    'CATEGORIES_LEGACY': '/shuyun-searchapi/1.0/categories',

    'BATCH_IMPORT': '/standard-selector/1.0/items/batchImportIds',
    'BATCH_IMPORT_LEGACY': '/shuyun-searchapi/1.0/items/batchImportIds'
}

const DEFAULT_GRID_CONFIG = {
    disableLine: true,
    supportAjaxPage: true,
    supportTreeData: true,
    supportAutoOrder: false,
    supportCheckbox: false,
    supportDrag: false,
    supportAdjust: false,
    supportMenu: false,
    currentPageKey: 'pageNum',
    pageSizeKey: 'pageSize',
    dataKey: 'data',
    totalsKey: 'totalCount',
    treeConfig: {
        // 树展开操作按键所属容器，此处配置columnData的key值。未配置时，将默认选择columnData的第一项
        insertTo: 'name',
        // 初始将所有数据展开, 默认为false
        openState: false,
        // 子节点关键字，默认为'children'
        treeKey: 'skus'
    }
};

export default {};

export {
    urlMap,
    DEFAULT_GRID_CONFIG
};