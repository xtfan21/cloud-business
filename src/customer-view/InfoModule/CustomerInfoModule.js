/**
 * 客户信息组件
 * CustomerInfoModule
 * wangbo
 * 2019/10/8
 */
import React  from 'react';
import jEasy from 'jeasy';
import { Icon, Input, Message, Select, Tooltip, Datepicker } from 'cloud-react';
import { GENDER_LIST, REG_EXPRESS } from '../constant';
import AreaSelect from '../component/AreaSelect';
import store from '../store';
import CustomerViewContext from '../context';

class CustomerInfoModule extends React.Component {
    static contextType = CustomerViewContext;

    constructor(props) {
        super(props);
        this.state = {
            // 姓名明文
            lawsName: '',
            // 手机号明文
            lawsMobile: '',
            // 邮箱明文
            lawsEmail: '',
            // 新的性别
            newGender: '',
            // 新的生日
            newBirthday: '',
            showEditBtn: false,
            showFullNameInput: false,
            showMobileInput: false,
            showEmailInput: false,
            showAddressSelect: false,
            showGenderSelector: false,
            showDatePicker: false,
            selectedArea: '',
            selectedAreaName: ''
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
            switch (type) {
                case 'fullName':
                    this.setState({
                        lawsName: res.data
                    });
                    break;
                case 'mobile':
                    this.setState({
                        lawsMobile: res.data
                    });
                    break;
                case 'email':
                    this.setState({
                        lawsEmail: res.data
                    });
                    break;
                default:
                    break;
            }
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
        this.cancelCustomerInfo();

        if ((type === 'email' || type === 'fullName' || type === 'mobile') && value) {
            this.viewCustomerItemInfo(type);
        }

        switch (type) {
            case 'fullName':
                this.setState({
                    showFullNameInput: true
                });
                break;
            case 'gender':
                this.setState({
                    showGenderSelector: true
                });
                break;
            case 'birthday':
                this.setState({
                    showDatePicker: true
                });
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
        // 校验手机号与邮箱格式
        if (field === 'mobile' && value && !REG_EXPRESS.mobile.test(value)) {
            Message.error('请输入符合规则的手机号');
            return;
        }
        if (field === 'email' && value && !REG_EXPRESS.email.test(value)) {
            Message.error('请输入符合规则的邮箱');
            return;
        }

        store.saveCustomerItemInfo(field, value, this.context.uniId).then(res => {
            this.cancelCustomerInfo();
            switch (field) {
                case 'fullName':
                    this.setState({
                        lawsName: res.data
                    });
                    break;
                case 'mobile':
                    this.setState({
                        lawsMobile: res.data
                    });
                    break;
                case 'email':
                    this.setState({
                        lawsEmail: res.data
                    });
                    break;
                case 'gender':
                    this.setState({
                        newGender: res.data
                    });
                    break;
                case 'birthday':
                    this.setState({
                        newBirthday: res.data
                    });
                    break;
                case 'unionAddress':
                    this.setState({
                        selectedArea: res.data
                    });
                    break;
                default:
                    break;
            }
        }).catch(err => {
            Message.error(err.message || '内部错误，请联系数据客服');
        })
    };

    /**
     * 隐藏客户信息
     * @param type
     */
    hideCustomerItemInfo = (type) => {
        this.cancelCustomerInfo();
        switch (type) {
            case 'fullName':
                this.setState({
                    lawsName: ''
                });
                break;
            case 'mobile':
                this.setState({
                    lawsMobile: ''
                });
                break;
            case 'email':
                this.setState({
                    lawsEmail: ''
                });
                break;
            default:
                break;
        }
    };

    /**
     * 取消保存
     */
    cancelCustomerInfo = () => {
        this.setState({
            lawsName: '',
            lawsMobile: '',
            lawsEmail: '',
            newGender: '',
            newBirthday: '',
            showFullNameInput: false,
            showMobileInput: false,
            showEmailInput: false,
            showAddressSelect: false,
            showDatePicker: false,
            showGenderSelector: false
        });
    };

    /**
     * 输入
     * @param type
     * @param e
     */
    onChangeInput = (type, e) => {
        switch (type) {
            case 'fullName':
                this.setState({
                    lawsName: e.target.value
                });
                break;
            case 'mobile':
                this.setState({
                    lawsMobile: e.target.value
                });
                break;
            case 'email':
                this.setState({
                    lawsEmail: e.target.value
                });
                break;
            case 'gender':
                this.setState({
                    newGender: e
                });
                break;
            case 'birthday':
                this.setState({
                    newBirthday: e && jEasy.moment(e).format('YYYYMMDD')
                });
                break;
            default:
                break;
        }
    };


    /**
     * 选中地址
     */
    onSelectedArea = (stateName, state, cityName, city, districtName, district, townName, town, address) => {
        const addressValue = `${state || ''},${city || ''},${district || ''},${town || ''},${address || ''}`;
        const addressName = `${stateName || ''},${cityName || ''},${districtName || ''},${townName || ''},${address || ''}`;
        this.setState({
            selectedArea: addressValue,
            selectedAreaName: addressName
        });

    };

    render() {
        const { fullName, gender, birthday, birthYear, mobile, email, state, stateName, city, cityName, district, districtName, town, townName, address } = this.props;
        // 原始地址id
        const addressValue = `${state || ''},${city || ''},${district || ''},${town || ''},${address || ''}`;
        // 原始地址名称
        const addressName = `${stateName || ''},${cityName || ''},${districtName || ''},${townName || ''},${address || ''}`;

        return (
            <div className={`account-info-area customer-info ${this.state.showEditBtn && 'mouse-enter'}`} onMouseEnter={this.mouseEnter} onMouseLeave={this.mouseLeave}>
                {/* 姓名操作 */}
                <OperateFullName
                    type="fullName"
                    fullName={fullName}
                    newName={this.state.lawsName}
                    showFullNameInput={this.state.showFullNameInput}
                    showEditIcon={this.state.showEditBtn}
                    showSaveIcon={this.state.showFullNameInput}
                    handleChange={this.onChangeInput}
                    onEditInfo={this.editCustomerItemInfo}
                    onHideInfo={this.hideCustomerItemInfo}
                    onViewInfo={this.viewCustomerItemInfo}
                    onSaveInfo={this.saveCustomerItemInfo}
                    onCancelInfo={this.cancelCustomerInfo}/>

                {/* 性别操作 */}
                <OperateGender
                    type="gender"
                    gender={gender}
                    newGender={this.state.newGender}
                    showEditIcon={this.state.showEditBtn}
                    showSaveIcon={this.state.showGenderSelector}
                    showGenderSelector={this.state.showGenderSelector}
                    onChangeInput={this.onChangeInput}
                    onEditInfo={this.editCustomerItemInfo}
                    onSaveInfo={this.saveCustomerItemInfo}
                    onCancelInfo={this.cancelCustomerInfo}/>

                {/* 生日操作 */}
                <OperateBirthday
                    type="birthday"
                    birthday={birthday}
                    newBirthday={this.state.newBirthday}
                    showEditIcon={this.state.showEditBtn}
                    showSaveIcon={this.state.showDatePicker}
                    showDatePicker={this.state.showDatePicker}
                    onChangeInput={this.onChangeInput}
                    onEditInfo={this.editCustomerItemInfo}
                    onSaveInfo={this.saveCustomerItemInfo}
                    onCancelInfo={this.cancelCustomerInfo}/>

                <span><label>年龄：</label>{(this.state.newBirthday || birthYear) ? `${new Date().getFullYear() - (Number((this.state.newBirthday && jEasy.moment(this.state.newBirthday).format('YYYY')) || birthYear))}岁` : '--'}</span>

                {/* 手机号操作 */}
                <OperateMobile
                    type="mobile"
                    mobile={mobile}
                    newMobile={this.state.lawsMobile}
                    showHideIcon={this.state.lawsMobile}
                    showMobileInput={this.state.showMobileInput}
                    showEditIcon={this.state.showEditBtn}
                    showSaveIcon={this.state.showMobileInput}
                    handleChange={this.onChangeInput}
                    onEditInfo={this.editCustomerItemInfo}
                    onHideInfo={this.hideCustomerItemInfo}
                    onViewInfo={this.viewCustomerItemInfo}
                    onSaveInfo={this.saveCustomerItemInfo}
                    onCancelInfo={this.cancelCustomerInfo}/>

                {/* 邮箱操作 */}
                <OperateEmail
                    type="email"
                    email={email}
                    newEmail={this.state.lawsEmail}
                    showHideIcon={this.state.lawsEmail}
                    showEmailInput={this.state.showEmailInput}
                    showEditIcon={this.state.showEditBtn}
                    showSaveIcon={this.state.showEmailInput}
                    handleChange={this.onChangeInput}
                    onEditInfo={this.editCustomerItemInfo}
                    onHideInfo={this.hideCustomerItemInfo}
                    onViewInfo={this.viewCustomerItemInfo}
                    onSaveInfo={this.saveCustomerItemInfo}
                    onCancelInfo={this.cancelCustomerInfo}/>

                {/* 地址操作 */}
                <OperateAddress
                    type="unionAddress"
                    showAddressSelect={this.state.showAddressSelect}
                    showEmailInput={this.state.showAddressSelect}
                    showEditIcon={this.state.showEditBtn}
                    showSaveIcon={this.state.showAddressSelect}
                    value={this.state.selectedArea || addressValue}
                    valueName={this.state.selectedAreaName || addressName}
                    stateName={stateName}
                    cityName={cityName}
                    districtName={districtName}
                    townName={townName}
                    address={address}
                    onSelectedAddress={this.onSelectedArea}
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
function OperateFullName({ type, fullName, newName, handleChange, showFullNameInput, showEditIcon, showSaveIcon, onEditInfo, onViewInfo, onSaveInfo, onCancelInfo, onHideInfo }) {
    return (
        <span>
            <label>姓名：</label>
            {!showFullNameInput && <span>{newName || fullName || '--'}</span>}
            {showFullNameInput && <Input className="edit-input" value={newName} hasClear onChange={(e) => handleChange(type, e)}/>}
            <OperatorIcon
                type={type}
                value={newName || fullName}
                showEditIcon={showEditIcon}
                showSaveIcon={showSaveIcon}
                showHideIcon={newName}
                onEditInfo={onEditInfo}
                onHideInfo={onHideInfo}
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
function OperateGender({ type, gender, newGender, showGenderSelector, showEditIcon, showSaveIcon, onEditInfo, onSaveInfo, onCancelInfo, onChangeInput }) {
    const { Option } = Select;

    return (
        <span>
            <label>性别：</label>
            {/* eslint-disable-next-line no-nested-ternary */}
            {!showGenderSelector && <span>{(newGender || gender) === 'F' ? '女' : (newGender || gender) === 'M' ? '男' : '未知'}</span>}
            {showGenderSelector &&
                <Select className="edit-input" onChange={e => onChangeInput(type, e)}>
                    {GENDER_LIST.map(item => (
                        <Option value={item.value} key={item.value}>
                            {item.label}
                        </Option>
                    ))}
                </Select>
            }
            <OperatorIcon
                type={type}
                value={newGender || gender}
                showEditIcon={showEditIcon}
                showSaveIcon={showSaveIcon}
                onEditInfo={onEditInfo}
                onSaveInfo={onSaveInfo}
                onCancelInfo={onCancelInfo}/>
        </span>
    );
}

/**
 * 生日操作
 * @constructor
 */
function OperateBirthday({ type, birthday, newBirthday, showDatePicker, showEditIcon, showSaveIcon, onEditInfo, onSaveInfo, onCancelInfo, onChangeInput }) {

    return (
        <span>
            <label>生日：</label>
            <span>{!showDatePicker && ((newBirthday || birthday) ? jEasy.moment(newBirthday || birthday).format('YYYY/MM/DD') : '--')}</span>

            {showDatePicker && <Datepicker showToday
                                           maxDate={new Date()}
                                           defaultValue={birthday && new Date(jEasy.moment(birthday).format('YYYY/MM/DD')) || new Date()}
                                           onChange={e => onChangeInput(type, e)}
                                           placeholder="年月日" />}
            <OperatorIcon
                type={type}
                value={newBirthday || birthday}
                showEditIcon={showEditIcon}
                showSaveIcon={showSaveIcon}
                onEditInfo={onEditInfo}
                onSaveInfo={onSaveInfo}
                onCancelInfo={onCancelInfo}/>
        </span>
    );
}

/**
 * 手机号操作
 * @constructor
 */
function OperateMobile({ type, mobile, newMobile, handleChange, showMobileInput, showEditIcon, showSaveIcon, onEditInfo, onViewInfo, onSaveInfo, onCancelInfo, onHideInfo }) {
    return (
        <span>
            <label>手机号：</label>
            {!showMobileInput && <span>{newMobile || mobile || '--'}</span>}
            {showMobileInput && <Input className="edit-input" hasClear maxLength="13" value={newMobile} onChange={(e) => handleChange(type, e)}/>}
            <OperatorIcon
                type={type}
                value={newMobile || mobile}
                showEditIcon={showEditIcon}
                showSaveIcon={showSaveIcon}
                showHideIcon={newMobile}
                onEditInfo={onEditInfo}
                onHideInfo={onHideInfo}
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
function OperateEmail({ type, email, newEmail, handleChange, showEmailInput, showEditIcon, showSaveIcon, onEditInfo, onViewInfo, onSaveInfo, onCancelInfo, onHideInfo }) {
    return (
        <span>
            <label>邮箱：</label>
            {!showEmailInput && <span>{newEmail || email || '--'}</span>}
            {showEmailInput && <Input className="edit-input" hasClear value={newEmail} onChange={(e) => handleChange(type, e)}/>}
            <OperatorIcon
                type={type}
                value={newEmail || email}
                showEditIcon={showEditIcon}
                showSaveIcon={showSaveIcon}
                showHideIcon={newEmail}
                onEditInfo={onEditInfo}
                onHideInfo={onHideInfo}
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
function OperateAddress({ type, value, valueName, onSelectedAddress, stateName, cityName, districtName, townName, address, showAddressSelect, showEditIcon, showSaveIcon, onEditInfo, onViewInfo, onSaveInfo, onCancelInfo }) {
    const addressTmp = `${stateName || ''} ${cityName || ''} ${districtName || ''} ${townName || ''} ${address || ''}`;
    return (
        <span>
            <label>地址：</label>
            {!showAddressSelect && <Tooltip content={valueName.split(',') || addressTmp}><span className="address-label">{(valueName.split(',')) || addressTmp}</span></Tooltip> }

            {showAddressSelect && <AreaSelect addressValue={value} addressName={valueName} address={address} selectdArea={onSelectedAddress}/>}
             <OperatorIcon
                 type={type}
                 value={value}
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
 * 编辑按钮图标d
 */
function OperatorIcon({ type, value, showEditIcon, showHideIcon, showSaveIcon, onEditInfo, onViewInfo, onSaveInfo, onCancelInfo, onHideInfo }) {
    return (
        <div className="edit-icon-area">
            {/* 编辑、查看按钮 */}
            {
                showEditIcon && !showSaveIcon &&
                <span>
                    <Icon type="edit" className="edit-icon" onClick={() => onEditInfo(type, value)}/>
                    {/* 昵称、手机号、邮箱是加密的，支持点击查看明文 */}
                    { (type === 'fullName' || type === 'email' || type === 'mobile') && value &&
                    <span>
                        {!showHideIcon && <Icon type="view" className="edit-icon" onClick={() => onViewInfo(type)}/>}
                        {showHideIcon && <Icon type="hide" className="edit-icon" onClick={() => onHideInfo(type)}/>}
                    </span>
                    }
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
