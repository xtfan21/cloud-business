/**
 * 客户评价信息
 * CustomerEvaluation
 * wangbo
 * 2019/10/8
 */
import React, { Fragment } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import jEasy from 'jeasy';
import { Table, Select, Tooltip, Message, Loading } from 'cloud-react';
import store from '../store';
import { GRID_COMMON_CONFIG } from '../constant';
import CustomerViewContext from '../context';

class CustomerEvaluation extends React.Component {
    static contextType = CustomerViewContext;

    constructor(props) {
        super(props);
        this.gridManagerName = 'customer-order-rate-list';

        this.state = {
            platList: [],
            shopList: [{ shopId: '', shopName: '不限' }],
            nowPlat: '',
            nowShop: '',
            loading: true
        };
    };

    componentDidMount() {
        this.query = {
            oneYearLater: false,
            uniId: this.context.uniId
        };
        // 获取平台下拉列表数据
        store.getPlatList().then(platRes => {
            this.setState({
                    platList: [{
                        platCode: '',
                        platName: '不限'
                    }, ...platRes],
                    loading: false
                }
            )}).catch(err => {
            Message.error(err.message || '内部错误，请联系数据客服');
        });
    }

    /**
     * 获取列表数据
     * @param setting
     * @param params
     * @returns {Promise<*>}
     */
    ajaxData = (setting, params) => {
        const tmp = { ...params, ...this.query };
        return store.getCustomerOrderRateList(tmp).then(resData => {
            return resData;
        });
    };

    /**
     * 计算商品名称是否超过宽度
     * @param productName 商品名称String
     */
    // eslint-disable-next-line class-methods-use-this
    isProductNameOverWidth = productName => {
        if ((jEasy.getTextWidth(productName) / 2) + 20 > 300) return productName;
        return '';
    };

    // eslint-disable-next-line class-methods-use-this
    reformTime = time => {
        return time ? jEasy.moment(time).format('yyyy-MM-dd HH:mm:ss') : '--';
    };

    /**
     * 切换平台
     */
    handleChangePlat = (platCode) => {
        store.getShopList(platCode).then(res => {
            this.setState({
                shopList: [{
                    shopId: '',
                    shopName: '不限'
                }, ...res],
                nowPlat: platCode
            });
            Table.setQuery(this.gridManagerName, { platCode });
        }).catch(err => {
            Message.error(err.message || '内部错误，请联系数据客服');
        });
    };

    /**
     * 切换店铺
     */
    handleChangeShop = (shopId) => {
        this.setState({
            nowShop: shopId
        });
        Table.setQuery(this.gridManagerName, { platCode: this.state.nowPlat, shopId });
    };

    render() {
        const { Option } = Select;
        const columnData = [
            {
                key: 'productName',
                text: '商品评价',
                align: 'left',
                template: (rates, row) => {
                    return (
                        <div className="order-list" style={{ padding: 0 }}>
                            {
                                row.rates.map(orderItem => {
                                    return (
                                        <div className="order-item">
                                            <a target="_blank" rel="noopener noreferrer" href={orderItem.detailUrl}>
                                                <OrderImg picUrl={orderItem.picUrl}/>
                                            </a>
                                            <span className="product-name">
                                                <Tooltip content={this.isProductNameOverWidth(orderItem.productName)}><a target="_blank" rel="noopener noreferrer" href={orderItem.detailUrl}>{orderItem.productName}</a></Tooltip>
                                                <p><span className="sku">{orderItem.skuDetail}</span></p>
                                            </span>
                                            <div className="rate-area">
                                                <div className="rate-time">
                                                    评价时间：{this.reformTime(orderItem.estimateTime)}
                                                    <icon-good-review ng-if="orderItem.estimateResult === 'good'"></icon-good-review>
                                                    <icon-medium-review ng-if="orderItem.estimateResult === 'neutral'"></icon-medium-review>
                                                    <icon-poor-review ng-if="orderItem.estimateResult === 'bad'"></icon-poor-review>
                                                </div>
                                                 <div className="rate-content">{orderItem.estimateContent}</div>
                                                <div className={orderItem.estimateReplay ? 'rate-replay' : 'hideLabel'}>回复：{orderItem.estimateReplay}</div>
                                            </div>
                                        </div>
                                    );
                                })
                            }
                        </div>
                    );
                }
            }
        ];
        const topFullColumn = {
            template: (row) => {
                return (
                    <div className="order-list">
                        <span>{row.platCode} - {row.shopName}</span>
                        <span className="order-state-info">
                            <span>订单号：
                                <Tooltip content="点击复制">
                                    <CopyToClipboard text={row.orderId} onCopy={() => {Message.success('复制成功')}}>
                                        <span className="account-name">{row.orderId}</span>
                                    </CopyToClipboard>
                                </Tooltip>
                            </span>
                            <span>下单时间：{row.created || '--'}</span>
                        </span>
                    </div>
                );
            }
        };

        return (
            this.state.loading ? <Loading /> :  <div className="customer-order-area">
                <div className="title-label-tips">
                    <label>平台：</label>
                    <Select
                        defaultValue={this.state.nowPlat}
                        onChange={this.handleChangePlat}>
                        {
                            this.state.platList.map((item) => (
                                <Option key={item.platCode} value={item.platCode}>{item.platName}</Option>
                            ))
                        }
                    </Select>
                    <label>店铺：</label>
                    <Select
                        defaultValue={this.state.nowShop}
                        onChange={this.handleChangeShop}>
                        {
                            this.state.shopList.map((item) => (
                                <Option key={item.shopId} value={item.shopId}>{item.shopName}</Option>
                            ))
                        }
                    </Select>
                </div>
                <Table
                    gridManagerName={this.gridManagerName}
                    ajaxData={this.ajaxData}
                    query={this.query}
                    columnData={columnData}
                    {...GRID_COMMON_CONFIG}
                    topFullColumn={topFullColumn}/>
            </div>
        );
    }
}

/**
 * 订单图片组件
 */
function OrderImg({ picUrl }) {
    return (
        <Fragment>
            {picUrl && <img width="70px" height="70px" src={picUrl} alt=""/>}
            {!picUrl && <div className="default-img">暂无图片</div>}
        </Fragment>
    );
}


export default CustomerEvaluation;
