/**
 * 客户营销信息
 * CustomerMarketing
 * wangbo
 * 2019/10/8
 */
import React from 'react';
import { Table, Tooltip } from 'cloud-react';
import store from '../store';
import { GRID_COMMON_CONFIG } from '../constant';
import CustomerViewContext from '../context';

class CustomerMarketing extends React.Component {
    static contextType = CustomerViewContext;

    constructor(props) {
        super(props);
        this.state = {
            marketingCount: '',
            lastMarketingTime: ''
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
        return store.getCustomerMarketingList(tmp).then(resData => {
            return resData;
        });
    };

    render() {
        const gridManagerName = 'customer-marketing-list';
        const columnData = [
            {
                text: '营销时间',
                key: 'marketingTime',
                align: 'left'
            },
            {
                text: '营销场景',
                align: 'left',
                key: 'marketingTypeName'
            },
            {
                text: '活动名称',
                key: 'activityName',
                align: 'left',
                template: (activityName) => {
                    return <Tooltip content={activityName}><span>{activityName}</span></Tooltip>;
                }
            },
            {
                text: '沟通方式',
                align: 'left',
                key: 'communicationMode'
            },
            {
                text: '沟通内容',
                align: 'left',
                key: 'communicationContent',
                template: (communicationContent) => {
                    return <Tooltip content={communicationContent} placement="bottom-left"><span>{communicationContent}</span></Tooltip>;
                }
            }
        ];
        return (
            <div className="customer-marketing-area">
                <div className="title-label-tips">
                    <label>90天内营销次数：</label>
                    <span className="title-count">{this.state.marketingCount || <span className="empty">--</span>}</span>
                    <label>最后一次营销时间：</label>
                    <span>{this.state.lastMarketingTime || <span className="empty">--</span>}</span>
                </div>
                <Table
                    gridManagerName={gridManagerName}
                    ajaxData={this.ajaxData}
                    columnData={columnData}
                    {...GRID_COMMON_CONFIG}
                    ajaxSuccess={(res) => {
                        this.setState({
                            marketingCount: res.marketingCount,
                            lastMarketingTime: res.lastMarketingTime
                        });
                    }}
                />
                <div className="tips-label">列表显示90天内营销记录</div>
            </div>
        );
    }
}

export default CustomerMarketing;
