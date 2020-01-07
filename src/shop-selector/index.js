import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'cloud-react';
import './index.less';
import ShopSelectorCore from './views/shop-selector-core';
import ShopContext from './context';

class ShopSelector extends Component {

	constructor(props) {
		super(props);
		this.state = { selectedShopList: props.option.selectedShop };
	}

	changeSelectedShops = list => {
		this.setState({ selectedShopList: list });
	};

	ok = () => {
		this.props.onOk(this.state.selectedShopList);
	};


	render() {
		const { visible, onClose, onCancel, option, tenantId } = this.props;

		const { isSupportedChannel, platform } = option;

		if (visible) {
			if (!tenantId && tenantId !== 0) {
				console.error('shopSelector 缺少 tenantId 参数');
				return (
					<></>
				)
			}

			// 已配置支持平台，但是平台数组为0
			if (isSupportedChannel && platform && !platform.length) {
				console.error('您已配置支持平台，平台数组长度不能为0, 一个平台：platform.length === 1; n个平台：platform.length === n; 不限平台：platform === null');
				return (
					<></>
				)
			}
		}
		return (
			<Modal
				title="请选择店铺"
				visible={visible}
				onOk={this.ok}
				onClose={onClose}
				onCancel={onCancel}
				hasFooter={ option.hasFooter }
			>
				<ShopContext.Provider value={{ ...this.state, changeSelectedShops: this.changeSelectedShops }}>
					{ visible && <ShopSelectorCore selectedShopList={this.state.selectedShopList} option={option} tenantId={tenantId}/>}
				</ShopContext.Provider>
			</Modal>

		)
	}
}

ShopSelector.propTyes = {
	option: {
		hasFooter: PropTypes.bool,
		isSupportedChannel: PropTypes.bool,
		isOpenSelectedTab: PropTypes.bool,
		permissionType: PropTypes.bool,
		isSingleSelected: PropTypes.bool,
		serverName: PropTypes.string.isRequired,
		selectedShop: PropTypes.array,
		platform: PropTypes.array
	},
	tenantId: PropTypes.string.isRequired,
	onClose: PropTypes.func,
	onCancel: PropTypes.func,
	visible: PropTypes.bool
};

ShopSelector.defaultProps = {
	option: {
		hasFooter: true, // 是否有footer，默认有
		isSupportedChannel: true, // 是否支持平台选项，默认支持
		isOpenSelectedTab: false, // 存在已选店铺是否需要直接进入已选店铺 tab
		permissionType: false, // 用户权限，默认不设置权限
		isSingleSelected: false, // 单选/多选店铺选择器，默认是多选
		serverName: '', // https://qa-ual.shuyun.com 或者 https://ual.shuyun.com
		selectedShop: [], // 已选店铺
		platform: [] // 平台
	},
	tenantId: '', // tenantId: 租户ID 必填
	onClose: () => {},
	onCancel: () => {},
	visible: false

};
export default ShopSelector
