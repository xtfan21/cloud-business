/**
 * 信息区域组件
 * Index
 * wangbo
 * 2019/10/8
 */
import React from 'react';
import { Loading, Message } from 'cloud-react';
import AccountInfoModule from './AccountInfoModule';
import CustomerInfoModule from './CustomerInfoModule';
import ConsumptionModule from './ConsumptionModule';
import store from '../store';
import CustomerViewContext from '../context';

class InfoModule extends React.Component {
    static contextType = CustomerViewContext;

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            customerInfo: {}
        };
    }

    componentDidMount() {
        // 获取客户信息
        store.getCustomerInfo(this.context.uniId).then(res => {
            this.setState({
                customerInfo: res,
                loading: false
            })
        }).catch(err => {
            Message.error(err.message || '内部错误，请联系数据客服');
        });
    }

    render() {
        // 性别，平台信息，姓名，生日，手机号，邮箱，省，市，区，镇，详细地址，购买过的平台，购买过的店铺，总购买金额，首次购买平台，首次购买店铺，总购买次数，最近一次购买平台，最近一次购买店铺，平均客单价
        const {
            gender, platAccountList,
            fullName, birthday, birthYear,
            mobile, email,
            state, city, district, town, address,
            stateName, cityName, districtName, townName,
            boughtPlatform, boughtShopName, totalPurchaseAmount,
            firstPurchasePlatform, firstPurchaseShopName, totalPurchaseTimes,
            lastPurchasePlatform, lastPurchaseShopName, averageCustomerPrice }  = this.state.customerInfo;
        return (
            this.state.loading ? <Loading/> :
            <div className="account-area">
                <Avatar gender={gender}/>
                <div className="customer-account-info">
                    <AccountInfoModule uniId={this.context.uniId} platAccountList={platAccountList}/>
                    <CustomerInfoModule
                        fullName={fullName}
                        gender={gender}
                        birthday={birthday}
                        birthYear={birthYear}
                        mobile={mobile}
                        email={email}
                        state={state}
                        stateName={stateName}
                        city={city}
                        cityName={cityName}
                        district={district}
                        districtName={districtName}
                        town={town}
                        townName={townName}
                        address={address}/>
                </div>
                <ConsumptionModule
                    boughtPlatform={boughtPlatform}
                    boughtShopName={boughtShopName}
                    totalPurchaseAmount={totalPurchaseAmount}
                    firstPurchasePlatform={firstPurchasePlatform}
                    firstPurchaseShopName={firstPurchaseShopName}
                    totalPurchaseTimes={totalPurchaseTimes}
                    lastPurchasePlatform={lastPurchasePlatform}
                    lastPurchaseShopName={lastPurchaseShopName}
                    averageCustomerPrice={averageCustomerPrice}/>
            </div>
        );
    }
}

/**
 * 头像组件
 * @constructor
 */
function Avatar({ gender }) {
    return (
        // eslint-disable-next-line no-nested-ternary
        <section className={`avatar ${gender === 'F' ? 'f-avatar' : gender === 'M' ? 'm-avatar' : 'default-avatar'}`}/>
    );
}

export default InfoModule;
