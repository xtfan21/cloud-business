/**
 * 客户互动信息
 * CustomerInteractive
 * wangbo
 * 2019/10/8
 */
import React from 'react';
import { Table, Tooltip } from 'cloud-react';
import store from '../store';
import { GRID_COMMON_CONFIG } from '../constant';
import CustomerViewContext from '../context';

class CustomerInteractive extends React.Component {
    static contextType = CustomerViewContext;

    constructor(props) {
        super(props);
        this.state = {
            interactionCount: '',
            lastInteractionTime: ''
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
        return store.getCustomerInteractiveList(tmp).then(resData => {
            return resData;
        });
    };

    render() {
        const gridManagerName = 'customer-interactive-list';
        const columnData = [
            {
                text: '互动时间',
                key: 'interactionTime',
                align: 'left'
            },
            {
                text: '互动渠道',
                align: 'left',
                key: 'interactionChannel'
            },
            {
                text: '互动类型',
                key: 'interactionType',
                align: 'left'

            },
            {
                text: '互动详情',
                align: 'left',
                key: 'interactionDetail',
                template: (interactionDetail) => {
                    return <Tooltip content={interactionDetail}><span>{interactionDetail}</span></Tooltip>;
                }
            }
        ];
        return (
            <div className="customer-interactive-area">
                <div className="title-label-tips">
                    <label>90天内互动次数：</label>
                    <span className="title-count">{this.state.interactionCount || <span className="empty">--</span>}</span>
                    <label>最后一次互动时间：</label>
                    <span>{this.state.lastInteractionTime || <span className="empty">--</span>}</span>
                </div>
                <Table
                    gridManagerName={gridManagerName}
                    ajaxData={this.ajaxData}
                    columnData={columnData}
                    {...GRID_COMMON_CONFIG}
                    ajaxSuccess={(res) => {
                        this.setState({
                            interactionCount: res.interactionCount,
                            lastInteractionTime: res.lastInteractionTime
                        });
                    }}
                />
                <div className="tips-label">列表显示90天内互动记录</div>
            </div>
        );
    }
}

export default CustomerInteractive;
