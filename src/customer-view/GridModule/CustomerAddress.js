/**
 * 客户地址信息
 * CustomerAddress
 * wangbo
 * 2019/10/8
 */
import React from 'react';
import { Table, Tooltip } from 'cloud-react';
import store from '../store';
import { GRID_COMMON_CONFIG } from '../constant';
import CustomerViewContext from '../context';

class CustomerAddress extends React.Component {
    static contextType = CustomerViewContext;

    /**
     * 获取列表数据
     * @param setting
     * @param params
     * @returns {Promise<*>}
     */
    ajaxData = (setting, params) => {
        return store.getCustomerAddressList(params, this.context.uniId).then(resData => {
            return resData;
        });
    };

    render() {
        const gridManagerName = 'customer-address-list';
        const columnData = [
            {
                text: '收货人姓名',
                key: 'fullName',
                align: 'left',
                width: '100px',
                template: (fullName) => {
                    return <span>{fullName}</span>;
                }
            },
            {
                text: '收货人手机',
                align: 'left',
                key: 'mobile',
                width: '100px',
                template: (mobile) => {
                    return <span>{mobile}</span>;
                }
            },
            {
                text: '省份',
                key: 'stateName',
                align: 'left',
                width: '100px',
            },
            {
                text: '城市',
                align: 'left',
                key: 'cityName',
                width: '100px',
            },
            {
                text: '区县',
                align: 'left',
                key: 'districtName',
                width: '100px',
            },
            {
                text: '街道',
                align: 'left',
                key: 'townName',
                width: '100px',
                template: (townName) => {
                    return <Tooltip content={townName}><span>{townName}</span></Tooltip>;
                }
            },
            {
                text: '详细地址',
                key: 'address',
                align: 'left',
                template: (address) => {
                    return <Tooltip content={address}><span>{address}</span></Tooltip>;
                }
            },
            {
                text: '<span class="trade-count">收货订单数</span>',
                key: 'tradeCount',
                align: 'right',
                width: '100px',
                template: (tradeCount) => {
                    return <span>{tradeCount}</span>;
                }
            }
        ];

        return (
            <div className="customer-address-area">
                <Table
                    gridManagerName={gridManagerName}
                    ajaxData={this.ajaxData}
                    {...GRID_COMMON_CONFIG}
                    columnData={columnData}/>
            </div>
        );
    }
}

export default CustomerAddress;
