/**
 * 消费记录组件
 * ConsumptionModule
 * wangbo
 * 2019/10/8
 */
import React from 'react';
import { PLAT_LIST } from '../constant';

class ConsumptionModule extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const { boughtPlatform, boughtShopName, totalPurchaseAmount, firstPurchasePlatform, firstPurchaseShopName, totalPurchaseTimes, lastPurchasePlatform, lastPurchaseShopName, averageCustomerPrice } = this.props;
        // const boughtPlatform = 'TAOBAO,JOS,SUNING';
        return (
            <div className="consumption-area">
                <ul>
                    <li>
                        <span>购买过的平台：</span>
                        <span>
                            {
                                boughtPlatform ? boughtPlatform.split(',').map(i => {
                                    return (
                                        PLAT_LIST.map(p => {
                                            return (p.plat === i && <span key={p.platCode}>{`${p.platName} ${boughtPlatform.split(',').length > 1 ? '、' : ''}`}</span>);
                                    }));
                                }): '--'
                            }
                        </span>
                    </li>
                    <li>
                        <span>购买过的店铺：</span>
                        <span>{boughtShopName ? boughtShopName.split(',').join('、') : '--'}</span>
                    </li>
                    <li>
                        <span>总购买金额：</span>
                        <span>¥{totalPurchaseAmount || '0.00'}</span>
                    </li>
                </ul>
                <ul>
                    <li>
                        <span>首次购买平台：</span>
                        <span>
                            {
                                firstPurchasePlatform ? firstPurchasePlatform.split(',').map(i => {
                                    return (
                                        PLAT_LIST.map(p => {
                                            return (p.plat === i && <span key={p.platCode}>{`${p.platName} ${firstPurchasePlatform.split(',').length > 1 ? '、' : ''}`}</span>);
                                        }));
                                }): '--'
                            }
                        </span>
                    </li>
                    <li>
                        <span>首次购买店铺：</span>
                        <span>{firstPurchaseShopName ? firstPurchaseShopName.split(',').join('、') : '--'}</span>
                    </li>
                    <li>
                        <span>总购买次数：</span>
                        <span>{`${+totalPurchaseTimes}次` || '--'}</span>
                    </li>
                </ul>
                <ul>
                    <li>
                        <span>最后一次购买平台：</span>
                        <span>
                            {
                                lastPurchasePlatform ? lastPurchasePlatform.split(',').map(i => {
                                    return (
                                        PLAT_LIST.map(p => {
                                            return (p.plat === i && <span key={p.platCode}>{`${p.platName} ${lastPurchasePlatform.split(',').length > 1 ? '、' : ''}`}</span>);
                                        }));
                                }) : '--'
                            }
                        </span>
                    </li>
                    <li>
                        <span>最近一次购买店铺：</span>
                        <span>{lastPurchaseShopName ? lastPurchaseShopName.split(',').join('、') : '--'}</span>
                    </li>
                    <li>
                        <span>平均客单价：</span>
                        <span>¥{averageCustomerPrice || '0.00'}</span>
                    </li>
                </ul>
            </div>
        );
    }
}

export default ConsumptionModule;
