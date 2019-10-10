/**
 * 客户订单信息
 * CustomerOrder
 * wangbo
 * 2019/10/8
 */
import React, { Fragment } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import jEasy from 'jeasy';
import { Table, Select, Tooltip, Message, Loading } from 'cloud-react';
import store from '../store';
import { GRID_COMMON_CONFIG } from '../constant';

class CustomerOrder extends React.Component {
    constructor(props) {
        super(props);
        this.gridManagerName = 'customer-order-list';

        this.state = {
            platList: [],
            shopList: [{ shopId: '', shopName: '不限' }],
            nowPlat: '',
            nowShop: '',
            loading: true
        };
        this.query = {
            oneYearLater: false,
            uniId: '0012cf20c4057d1e56280e7da494d6a6'
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
    };

    /**
     * 获取列表数据
     * @param setting
     * @param params
     * @returns {Promise<*>}
     */
    ajaxData = (setting, params) => {
        const tmp = { ...params, ...this.query };
        return store.getCustomerOrderList(tmp).then(resData => {
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
        const columnData = [
            {
                key: 'productName',
                text: '商品',
                align: 'left',
                template: (orderList, row) => {
                    return (
                        <div className="order-list" style={{ padding: 0 }}>
                            {
                                row.orderList.map(orderItem => {
                                    return (
                                        <div className="order-item">
                                            <a target="_blank" rel="noopener noreferrer" href={orderItem.detailUrl}>
                                                <OrderImg picUrl={orderItem.picUrl}/>
                                            </a>
                                            <span className="product-name">
                                                <Tooltip content={this.isProductNameOverWidth(orderItem.productName)}><a target="_blank" rel="noopener noreferrer" href={orderItem.detailUrl}>{orderItem.productName}</a></Tooltip>
                                                <p>
                                                    <span className="sku">{orderItem.skuDetail}</span>
                                                    <span className="product-refund">{orderItem.isRefund === '1' ? '退款成功' : ''}</span>
                                                </p>
                                            </span>
                                        </div>
                                    );
                                })
                            }
                        </div>
                    );
                }
            },
            {
                key: 'price',
                text: '价格',
                align: 'left',
                width: '100px',
                template: (orderList, row) => {
                    return (
                        <div className="order-list-price">
                            {
                                row.orderList.map(orderItem => {
                                    return (
                                        <div className="order-price">¥ {orderItem.price}</div>
                                    );
                                })
                            }
                        </div>
                    );
                }
            },
            {
                key: 'productNum',
                text: '商品数量',
                align: 'left',
                width: '230px',
                template: (orderList, row) => {
                    return (
                        <div>
                            {
                                row.orderList.map(orderItem => {
                                    return (
                                        <span>{orderItem.productNum}</span>
                                    );
                                })
                            }
                        </div>
                    );
                }
            },
            {
                key: 'tradeDiscountFee',
                align: 'center',
                text: '优惠金额',
                width: '190px',
                template: (tradeDiscountFee) => {
                    return (
                        <span>￥{tradeDiscountFee}</span>
                    );
                }
            },
            {
                key: 'payment',
                text: '订单总金额',
                align: 'center',
                width: '190px',
                template: (payment, row) => {
                    return (
                        <div>
                            <div>￥{row.payment}</div>
                            <div>（含运费：￥{row.postFee}）</div>
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
                            <span>付款时间：{row.payTime || '--'}</span>
                            <span>交易状态：{row.orderStatus}</span>
                        </span>
                    </div>
                );
            }
        };
        const { Option } = Select;
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
                    {...GRID_COMMON_CONFIG}
                    query={this.query}
                    columnData={columnData}
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

export default CustomerOrder;
