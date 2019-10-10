/**
 * 客户权益信息
 * CustomerBenefit
 * wangbo
 * 2019/10/8
 */
import React from 'react';
import { Table, Tooltip } from 'cloud-react';
import store from '../store';
import { GRID_COMMON_CONFIG } from '../constant';
import CustomerViewContext from '../context';

class CustomerBenefit extends React.Component {
    static contextType = CustomerViewContext;

    constructor(props) {
        super(props);
        this.state = {
            preferentialCount: '',
            lastPreferentialTime: ''
        };
    }

    /**
     * 获取列表数据
     * @param setting
     * @param params
     * @returns {Promise<*>}
     */
    ajaxData = (setting, params) => {
        const tmp = { ...params, uniId: this.context.uniId };
        return store.getCustomerBenefitList(tmp).then(resData => {
            return resData;
        });
    };

    render() {
        const gridManagerName = 'customer-benefit-list';
        const columnData = [
            {
                text: '发放时间',
                key: 'sendTime',
                align: 'left'
            },
            {
                text: '发放场景',
                align: 'left',
                key: 'sendType'
            },
            {
                text: '权益类型',
                key: 'preferentialType',
                align: 'left'

            },
            {
                text: '平台',
                key: 'platName',
                align: 'left'

            },
            {
                text: '店铺',
                key: 'shopName',
                align: 'left',
                template: (shopName) => {
                    return <Tooltip content={shopName}><span>{shopName}</span></Tooltip>;
                }
            },
            {
                text: '权益名称',
                align: 'left',
                key: 'preferentialName',
                template: (preferentialName) => {
                    return <Tooltip content={preferentialName}><span>{preferentialName}</span></Tooltip>;
                }
            },
            {
                text: '权益详情',
                align: 'left',
                key: 'preferentialContent',
                template: (preferentialContent) => {
                    return <Tooltip content={preferentialContent}><span>{preferentialContent}</span></Tooltip>;
                }
            },
            {
                text: '是否核销',
                align: 'left',
                key: 'isVerification'
            }
        ];

        return (
            <div className="customer-benefit-area">
                <div className="title-label-tips">
                    <label>90天权益发放量：</label>
                    <span className="title-count">{this.state.preferentialCount || <span className="empty">--</span>}</span>
                    <label>最后一次权益发放时间：</label>
                    <span>{this.state.lastPreferentialTime || <span className="empty">--</span>}</span>
                </div>
                <Table
                    gridManagerName={gridManagerName}
                    {...GRID_COMMON_CONFIG}
                    ajaxData={this.ajaxData}
                    columnData={columnData}
                    ajaxSuccess={(res) => {
                        this.setState({
                            preferentialCount: res.preferentialCount,
                            lastPreferentialTime: res.lastPreferentialTime
                        });
                    }}
                />
                <div className="tips-label">列表显示90天内权益发放记录</div>
            </div>
        );
    }
}

export default CustomerBenefit;
