/**
 * 客户信息组件
 * CustomerInfoModule
 * wangbo
 * 2019/10/8
 */
import React  from 'react';
import jEasy from 'jeasy';
import { Icon, Input, Message, Select, Tooltip } from 'cloud-react';
import { GENDER_LIST } from '../constant';
import AreaSelect from '../component/AreaSelect';
import store from '../store';
import CustomerViewContext from '../context';

class CustomerInfoModule extends React.Component {
    static contextType = CustomerViewContext;

    constructor(props) {
        super(props);
        this.state = {
            // 明文
            lawsValue: '',
            showEditBtn: false,
            showFullNameInput: false,
            showMobileInput: false,
            showEmailInput: false,
            showAddressSelect: false
        };
    }

    /**
     * 鼠标进入区域
     */
    mouseEnter = () => {
       this.setState({
           showEditBtn: true
       });
    };

    /**
     * 鼠标离开区域
     */
    mouseLeave = () => {
        this.setState({
            showEditBtn: false
        });
    };

    /**
     * 查看明文信息
     * @param type
     */
    viewCustomerItemInfo = (type) => {
        // 查看明文
        store.getCustomerItemInfo(this.context.uniId, type).then(res => {
            console.log(res);
            this.setState({
                // lawsValue: res.data
            })
        }).catch(err => {
            Message.error(err.message || '内部错误，请联系数据客服');
        });
    };

    /**
     * 编辑客户信息
     * @param type
     * @param value
     */
    editCustomerItemInfo = (type, value) => {
        if (type === 'email' || type === 'fullName' || type === 'mobile') {
            this.viewCustomerItemInfo(type);
        }
        this.cancelCustomerInfo();
        switch (type) {
            case 'fullName':
                this.setState({
                    showFullNameInput: true
                });
                console.log(value);
                break;
            case 'gender':
                break;
            case 'birthday':
                break;
            case 'mobile':
                this.setState({
                    showMobileInput: true
                });
                break;
            case 'email':
                this.setState({
                    showEmailInput: true
                });
                break;
            case 'unionAddress':
                this.setState({
                    showAddressSelect: true
                });
                break;
            default:
                break;
        }
    };

    /**
     * 保存客户信息
     * @param field
     * @param value
     */
    saveCustomerItemInfo = (field, value) => {
        store.saveCustomerItemInfo(field, value, this.context.uniId).then(res => {
            console.log(res);
            this.cancelCustomerInfo();
        }).catch(err => {
            Message.error(err.message || '内部错误，请联系数据客服');
        })
    };

    /**
     * 取消保存
     */
    cancelCustomerInfo = () => {
        this.setState({
            lawsValue: '',
            showFullNameInput: false,
            showMobileInput: false,
            showEmailInput: false,
            showAddressSelect: false
        });
    };

    onChangeInput = (e) => {
        this.setState({
            lawsValue: e.target.value
        });
    };

    render() {
        const { fullName, gender, birthday, birthYear, mobile, email, state, stateName, city, cityName, district, districtName, town, townName, address } = this.props;
        const addressValue = `${state},${city},${district},${town}`;
        return (
            <div className={`account-info-area customer-info ${this.state.showEditBtn && 'mouse-enter'}`} onMouseEnter={this.mouseEnter} onMouseLeave={this.mouseLeave}>
                {/* 姓名操作 */}
                <OperateFullName
                    fullName={ this.state.lawsValue || fullName}
                    handleChange={this.onChangeInput}
                    showFullNameInput={this.state.showFullNameInput}
                    showEditIcon={this.state.showEditBtn}
                    showSaveIcon={this.state.showFullNameInput}
                    onEditInfo={this.editCustomerItemInfo}
                    onViewInfo={this.viewCustomerItemInfo}
                    onSaveInfo={this.saveCustomerItemInfo}
                    onCancelInfo={this.cancelCustomerInfo}/>

                {/* 性别操作 */}
                <OperateGender
                    gender={gender}
                    showGenderInput={this.state.showGenderInput}/>

                {/* 生日操作 */}
                <OperateBirthday
                    birthday={birthday}
                    showBirthdayInput={this.state.showBirthdayInput}/>

                <span><label>年龄：</label>{birthYear ? `${new Date().getFullYear() - String(birthYear)}岁` : '--'}</span>

                {/* 手机号操作 */}
                <OperateMobile
                    mobile={mobile}
                    showMobileInput={this.state.showMobileInput}
                    showEditIcon={this.state.showEditBtn}
                    showSaveIcon={this.state.showMobileInput}
                    onEditInfo={this.editCustomerItemInfo}
                    onViewInfo={this.viewCustomerItemInfo}
                    onSaveInfo={this.saveCustomerItemInfo}
                    onCancelInfo={this.cancelCustomerInfo}/>

                {/* 邮箱操作 */}
                <OperateEmail
                    email={email}
                    showEmailInput={this.state.showEmailInput}
                    showEditIcon={this.state.showEditBtn}
                    showSaveIcon={this.state.showEmailInput}
                    onEditInfo={this.editCustomerItemInfo}
                    onViewInfo={this.viewCustomerItemInfo}
                    onSaveInfo={this.saveCustomerItemInfo}
                    onCancelInfo={this.cancelCustomerInfo}/>

                {/* 地址操作 */}
                <OperateAddress
                    showAddressSelect={this.state.showAddressSelect}
                    showEmailInput={this.state.showAddressSelect}
                    showEditIcon={this.state.showEditBtn}
                    showSaveIcon={this.state.showAddressSelect}
                    value={addressValue}
                    stateName={stateName}
                    cityName={cityName}
                    districtName={districtName}
                    townName={townName}
                    address={address}
                    onEditInfo={this.editCustomerItemInfo}
                    onViewInfo={this.viewCustomerItemInfo}
                    onSaveInfo={this.saveCustomerItemInfo}
                    onCancelInfo={this.cancelCustomerInfo}/>
            </div>
        );
    }
}

/**
 * 姓名操作
 * @constructor
 */
function OperateFullName({ fullName, handleChange, showFullNameInput, showEditIcon, showSaveIcon, onEditInfo, onViewInfo, onSaveInfo, onCancelInfo }) {
    return (
        <span>
            <label>姓名：</label>
            {!showFullNameInput && <span>{fullName}</span>}
            {showFullNameInput && <Input className="edit-input" hasClear value={fullName} onChange={handleChange}/>}
            <OperatorIcon
                type="fullName"
                value={fullName}
                showEditIcon={showEditIcon}
                showSaveIcon={showSaveIcon}
                onEditInfo={onEditInfo}
                onViewInfo={onViewInfo}
                onSaveInfo={onSaveInfo}
                onCancelInfo={onCancelInfo}/>
        </span>
    );
}

/**
 * 性别操作
 * @constructor
 */
function OperateGender({ gender }) {
    const { Option } = Select;
    return (
        <span>
            <label>性别：</label>
            {/* eslint-disable-next-line no-nested-ternary,no-constant-condition */}
            <span>{gender === 'F' ? '女' ? gender === 'M' : '男' : '未知'}</span>
            <Select className="edit-input" defaultValue="M">
                {GENDER_LIST.map(item => (
                    <Option value={item.value} key={item.value}>
                        {item.label}
                    </Option>
                ))}
            </Select>
        </span>
    );
}

/**
 * 生日操作
 * @constructor
 */
function OperateBirthday({ birthday }) {
    return (
        <span>
            <label>生日：</label>
            <span>{jEasy.moment(birthday).format('YYYY-MM-DD')}</span>
        </span>
    );
}

/**
 * 手机号操作
 * @constructor
 */
function OperateMobile({ mobile, showMobileInput, showEditIcon, showSaveIcon, onEditInfo, onViewInfo, onSaveInfo, onCancelInfo }) {
    return (
        <span>
            <label>手机号：</label>
            {!showMobileInput && <span>{mobile || '--'}</span>}
            {showMobileInput && <Input className="edit-input" hasClear value={mobile}/>}
            <OperatorIcon
                type="mobile"
                value={mobile}
                showEditIcon={showEditIcon}
                showSaveIcon={showSaveIcon}
                onEditInfo={onEditInfo}
                onViewInfo={onViewInfo}
                onSaveInfo={onSaveInfo}
                onCancelInfo={onCancelInfo}/>
        </span>
    );
}

/**
 * 邮箱操作
 * @constructor
 */
function OperateEmail({ email, showEmailInput, showEditIcon, showSaveIcon, onEditInfo, onViewInfo, onSaveInfo, onCancelInfo }) {
    return (
        <span>
            <label>邮箱：</label>
            {!showEmailInput && <span>{email || '--'}</span>}
            {showEmailInput && <Input className="edit-input" hasClear value={email || ''} onChange={() => {}}/>}
            <OperatorIcon
                type="email"
                value={email}
                showEditIcon={showEditIcon}
                showSaveIcon={showSaveIcon}
                onEditInfo={onEditInfo}
                onViewInfo={onViewInfo}
                onSaveInfo={onSaveInfo}
                onCancelInfo={onCancelInfo}/>
        </span>
    );
}

/**
 * 地址操作
 * @constructor
 */
function OperateAddress({ addressValue, stateName, cityName, districtName, townName, address, showAddressSelect, showEditIcon, showSaveIcon, onEditInfo, onViewInfo, onSaveInfo, onCancelInfo }) {
    const addressTmp = `${stateName || ''} ${cityName || ''} ${districtName || ''} ${townName || ''} ${address || ''}`;
    return (
        <span>
            <label>地址：</label>
            {!showAddressSelect && <Tooltip content={addressTmp}><span className="address-label">{addressTmp}</span></Tooltip>}

            {showAddressSelect && <AreaSelect addressValue={addressValue} address={address}/>}
             <OperatorIcon
                 type="unionAddress"
                 value={addressValue}
                 showEditIcon={showEditIcon}
                 showSaveIcon={showSaveIcon}
                 onEditInfo={onEditInfo}
                 onViewInfo={onViewInfo}
                 onSaveInfo={onSaveInfo}
                 onCancelInfo={onCancelInfo}/>
        </span>
    );
}

/**
 * 编辑按钮图标
 */
function OperatorIcon({ type, value, showEditIcon, showSaveIcon, onEditInfo, onViewInfo, onSaveInfo, onCancelInfo }) {
    return (
        <div className="edit-icon-area">
            {/* 编辑、查看按钮 */}
            {
                showEditIcon && !showSaveIcon &&
                <span>
                    <Icon type="edit" className="edit-icon" onClick={() => onEditInfo(type, value)}/>
                    { (type === 'fullName' || type === 'email' || type === 'mobile') && <Icon type="search-file" className="edit-icon" onClick={() => onViewInfo(type)}/>}
                </span>
            }

            {/* 保存、取消按钮 */}
            {
                showSaveIcon &&
                <span>
                    <Icon type="finish" className="edit-icon save-icon" onClick={() => onSaveInfo(type, value)}/>
                    <Icon type="close" className="edit-icon" onClick={() => onCancelInfo()}/>
                </span>
            }
        </div>
    )
}
export default CustomerInfoModule;
