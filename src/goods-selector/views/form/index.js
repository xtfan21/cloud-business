import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'cloud-react';

import FormItem from './item';
import './index.less';
import { mapFieldValue, genNewConfig } from '../../utils';
import Store from '../../store';

const noop = () => {};

function genSearchConfig(params) {
    const { platShopValue, platShopList } = params;
    return [{
        label: ['平台选择', '店铺选择'],
        field: ['platCode', 'shopId'],
        type: FormItem.types.PLAT_SHOP,
        value: [platShopValue.platCode, platShopValue.shopId],
        dataList: platShopList
    }, {
        label: '商品ID',
        field: 'id',
        type: FormItem.types.INPUT,
        placeholder: '商品ID',
        value: ''
    }, {
        label: '商品标题',
        field: 'name',
        type: FormItem.types.INPUT,
        placeholder: '商品标题',
        value: ''
    }, {
        label: '标准类目',
        field: 'categories.id',
        type: FormItem.types.DROPDOWN,
        searchable: true,
        value: params.categories,
        dataList: []
    }, {
        label: '商品状态',
        field: 'status',
        type: FormItem.types.DROPDOWN,
        value: '',
        dataList: [{ label: '不限', value: '' }, { label: '在架', value: 1 }, { label: '下架', value: 0 }, { label: '售罄', value: 2 }]
    }, {
        label: '价格',
        field: ['minPrice', 'maxPrice'],
        type: FormItem.types.NUM_RANGE,
        placeholder: '请输入价格',
        value: []
    }, {
        label: '上架时间',
        field: ['startListTime', 'endListTime'],
        type: FormItem.types.DATE_RANGE,
        placeholder: '商品标题',
        value: []
    }, {
        label: '商品商家编码',
        field: 'outerId',
        type: FormItem.types.INPUT,
        placeholder: '商品商家编码',
        value: ''
    }];
}

function GoodsForm(props) {
    const { platShopList, platShopValue, onSearch } = props;

    const paramsRef = useRef({});
    const [searchConfig, setSearchConfig] = useState(() => {
        return genSearchConfig({ platShopValue, platShopList });
    });

    async function changeCategores(search, configList) {
        const index = configList.findIndex(config => config.field === 'categories.id');
        if (index === -1) return;

        const cats = await Store.getInstance().fetchCategories(search)
        const catsDropdown = cats.map(cat => ({ label: cat.name, value: cat.id }));

        const newSearchConfig = genNewConfig(configList, index, {
            dataList: catsDropdown, 
            // value: catsDropdown.length ? catsDropdown[0].value : null
            value: null
        });
        
        setSearchConfig(newSearchConfig);
    }

    useEffect(() => {
        const newParams = searchConfig.reduce((acc, current) => {
            const { field, value } = current;
            const data = mapFieldValue(field, value);
            return { ...acc, ...data };
        }, {});
        paramsRef.current = newParams; // params也应该响应搜索配置searchConfig的变化
    }, [searchConfig]);

    useEffect(() => {
        changeCategores(platShopValue, searchConfig); // 初始化获取类目
    }, []);

    /**
     *  handlers
     */
    function handleChange(value, index, key) {
        const newSearchConfig = genNewConfig(searchConfig, index, { value });

        setSearchConfig(newSearchConfig);
        // 标准类目联动平台店铺, 需要更改 平台、店铺、类目，三个设置
        if (key === 'platShop') {
            const [ platCode, shopId ] = value;
            changeCategores({ platCode, shopId }, newSearchConfig);
        }
    }

    function handleSearch() {
        const startTimes = paramsRef.current.startListTime;
        const endTimes = paramsRef.current.endListTime;
        if(startTimes || endTimes) {
            paramsRef.current.startListTime = (new Date(startTimes)).getTime();
            paramsRef.current.endListTime = (new Date(endTimes)).getTime();
        }
        onSearch(paramsRef.current);
    }

    function handleReset() {
        setSearchConfig(config => {
            return config.map(conf => {
                const { field } = conf;
                const value = Array.isArray(field) ? Array(field.length).fill('') : '';
                const newConf = { ...conf, value };
                return newConf;
            });
        });
    }

    return (
        <section className="goods-form">
            {searchConfig.map((item, index) => <FormItem key={item.field} index={index} onChange={handleChange} {...item}/>)}

            <div className="operator-area">
                <Button type="primary" onClick={handleSearch}>搜索</Button>
                <span className="search-reset" onClick={handleReset}>重置</span>
            </div>
        </section>
    );
}

GoodsForm.propTypes = {
    onSearch: PropTypes.func
};
GoodsForm.defaultProps = {
    onSearch: noop
};

export default React.memo(GoodsForm);