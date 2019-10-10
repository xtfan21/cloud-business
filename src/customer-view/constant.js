/**
 * constant.js
 * @author wangbo
 * @since 2019/10/10
 */

// 平台列表
export const PLAT_LIST = [
    {
        plat: 'TAOBAO',
        name: '淘宝昵称',
        platName: '淘宝'
    },
    {
        plat: 'JOS',
        name: '京东昵称',
        platName: '京东'
    },
    {
        plat: 'OFFLINE',
        name: '线下账号',
        platName: '线下'
    },
    {
        plat: 'YOUZAN',
        name: '有赞账号',
        platName: '有赞'
    },
    {
        plat: 'YHD',
        name: '一号店账号',
        platName: '一号店'
    },
    {
        plat: 'SUNING',
        name: '苏宁账号',
        platName: '苏宁'
    },
    {
        plat: 'DD',
        name: '当当账号',
        platName: '当当'
    },
    {
        plat: 'OMNI',
        name: '全渠道账号',
        platName: '全渠道'
    },
    {
        plat: 'WX',
        name: '微信账号',
        platName: '微信'
    },
    {
        plat: 'MGJ',
        name: '蘑菇街账号',
        platName: '蘑菇街'
    }
];

// 性别列表
export const GENDER_LIST = [
    {
        label: '男',
        value: 'M'
    },
    {
        label: '女',
        value: 'F'
    }
];

// 表格通用配置
export const GRID_COMMON_CONFIG = {
    ajaxType: 'GET',
    supportAjaxPage: true,
    supportAutoOrder: false,
    supportCheckbox: false,
    currentPageKey: 'pageNum',
    pageSizeKey: 'pageSize',
    disableLine: true,
    dataKey: 'list',  // 指定返回数据列表的key键值
    totalsKey: 'totals'  // 指定返回数据总条数的key键值
};

// 正则
export const REG_EXPRESS = {
    mobile: /(13\d|14[579]|15[^4\D]|17[^49\D]|18\d)\d{8}/,
    email: /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/
};
