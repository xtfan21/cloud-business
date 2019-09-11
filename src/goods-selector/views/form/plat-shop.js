import React, { useState, useEffect } from 'react';
import { Select } from 'cloud-react';

import { useFirstRender } from '../../hooks';

const { Option } = Select;

export default function PlatShop(props) {
    const { platList, shopList, platCode, shopId, label, onChange } = props;
    
    const [params, setParams] = useState(() => {
        const plat = platCode || platList[0].platCode;
        const currentShopList = shopList.filter(shop => shop.platCode === plat);
        const shop = shopId || currentShopList[0].shopId;
        return { platCode: plat, shopId: shop };
    });

    const firstRender = useFirstRender();

    useEffect(() => {
        if (!firstRender && platCode !== undefined && shopId !== undefined) {
            setParams({ platCode, shopId });
        }
    }, [platCode, shopId]);

    function handleChange(name) {
        return value => {
            let newParams;
            if (name === 'shopId') {
                newParams = { ...params, shopId: value };
            }
            if (name === 'platCode') {
                const shops = shopList.filter(shop => shop.platCode === value);
                newParams = { platCode: value, shopId: shops[0].shopId };
            }
            setParams(newParams);

            onChange(newParams);
        }
    }

    let { platCode: platValue } = params;
    const { shopId: shopValue } = params;

    platValue = platValue || platList[0].platCode; // 默认第一个

    let currentShopList = shopList.filter(shop => shop.platCode === platValue);
    currentShopList = currentShopList.length > 0 ? currentShopList : shopList; // 正常情况下都会找到店铺，如果未找到，则赋予所有店铺

    const platViews = platList.map(plat => <Option className="goods-form-item-dropdown" value={plat.platCode} key={plat.platCode} >{plat.platName}</Option>);
    const shopViews = currentShopList.map(shop => <Option className="goods-form-item-dropdown" value={shop.shopId} key={shop.shopId} >{shop.shopName}</Option>);

    const isMultiShop = platValue && platValue.includes('offline');

    let multiShops = shopValue || currentShopList[0].shopId; // 默认第一个
    if (isMultiShop && !Array.isArray(multiShops)) {
        multiShops = [multiShops];
    }

    return (
        <>
        {   platViews.length !== 1 && 
            <div className="goods-form-item">
                <span className="goods-form-item-label">{label[0]}：</span>
                <Select
                    placeholder="请选择..."
                    value={platValue}
                    onChange={handleChange('platCode')}>
                    { platViews }
                </Select>
            </div>
        }

        {   (platViews.length !== 1 || shopViews.length !== 1) && 
            <div className="goods-form-item">
                <span className="goods-form-item-label">{label[1]}：</span>
                <Select
                    hasSelectAll
                    multiple={isMultiShop}
                    placeholder="请选择..."
                    value={multiShops}
                    onChange={handleChange('shopId')}>
                    { shopViews }
                </Select>
            </div>
        }
        </>
    )
}