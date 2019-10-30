import React,{ useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { Input, Select, Datepicker } from 'cloud-react';
import { platShopDropdown } from '../../utils';
import PlatShop from './plat-shop';

const { Option } = Select;

const types = {
    INPUT: 'input',
    DROPDOWN: 'dropdown',
    NUM_RANGE: 'numRange',
    DATE_RANGE: 'date',
    PLAT_SHOP: 'platShop'
};

function GoodsFormItem(props) {
    /**
     * props
     */
    const { label, type, placeholder, field, onChange, dataList, index, ...rest } = props;

    /**
     * hooks
     */
    const [value, setValue] = useState(props.value);

    // reset
    useEffect(() => {
        setValue(props.value);
    }, [props.value]);

    /**
     * handlers
     */
    function handleChange(key) {
        return e => {
            const v = e.target ? e.target.value : e; //  传入e或者value
            let newValue;
            if (!key) {
                newValue = v;
            } 
            if (typeof key === 'number') {
                value[key] = v;
                newValue = [...value];
            }
            if (key === 'platShop') {
                newValue = Object.values(v);
            }
            
            setValue(newValue);
            onChange(newValue, index, key);
        }; 
    }

    /**
     * types
     */
    function renderInput() {
        return (
            <div className="goods-form-item">
                <span className="goods-form-item-label">{label}：</span>
                <Input placeholder={placeholder} className="goods-form-item-input" value={value} onChange={handleChange()}/>
            </div>
        );
    }

    function renderNumRange() {
        return (
            <div className="goods-form-item">
                <span className="goods-form-item-label">{label}：</span>
                <Input className="goods-form-item-range" value={value[0]} onChange={handleChange(0)}/>
                 -
                <Input className="goods-form-item-range" value={value[1]} onChange={handleChange(1)}/>
            </div>
        );
    }

    function renderDropdown() {
        const defaultValue = Array.isArray(dataList) && dataList.length ? dataList[0].value : null;
        const view = dataList.map(item => <Option className="goods-form-item-dropdown" value={item.value} key={item.value} >{item.label}</Option>);
        return (
            <div className="goods-form-item">
                <span className="goods-form-item-label">{label}：</span>
                <Select
                    {...rest}
                    placeholder="请选择..."
                    value={value}
                    defaultValue={defaultValue}
                    onChange={handleChange()}>
                    { view }
                </Select>
            </div>
        );
    }

    function renderPlatShop() {
        const { platList, shopList } = platShopDropdown(dataList);
        const [ platCode, shopId ] = value;
        return (
            <PlatShop 
                platList={platList} 
                shopList={shopList} 
                platCode={platCode} 
                shopId={shopId} 
                label={label} 
                onChange={handleChange('platShop')}/>
        );
    }

    function renderDateRange() {
        return (
            <div className="goods-form-item">
                <span className="goods-form-item-label">{label}：</span>
                <Datepicker showToday maxDate={value[1]} value={value[0]} onChange={handleChange(0)} placeholder="年月日" />
                -
                <Datepicker showToday minDate={value[0]} value={value[1]} onChange={handleChange(1)} placeholder="年月日" />
            </div>
        );
    }

    switch(type) {
        case types.INPUT:
            return renderInput();
        case types.NUM_RANGE:
            return renderNumRange();
        case types.DROPDOWN:
            return renderDropdown();
        case types.DATE_RANGE:
            return renderDateRange();
        case types.PLAT_SHOP:
            return renderPlatShop();
        default:
            return renderInput();
    }
}

GoodsFormItem.defaultProps = {
    onChange: () => {}
};
GoodsFormItem.propTypes = {
    onChange: PropTypes.func
};

const C = React.memo(GoodsFormItem);
C.types = types;
export default C;
