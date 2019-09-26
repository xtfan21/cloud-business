import React, { Component } from 'react';
import { Modal, Tabs } from 'cloud-react';
import './index.less';
import AllShop from './views/all-shop';
import SelectedShop from './views/selected-shop';


const { Panel } = Tabs;

export default class ShopSelector extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedShops: undefined
		};
	}

	selectedShopHandle = shop => {
		this.setState({
			selectedShops: shop.checkedList
		});
	};

	onChecked = (selectedShops) => {
		this.setState({
			selectedShops,
		});
	};


	renderContext(){
		const { selectedShops } = this.state;
		const { option, tenantId } = this.props;
		const { isOpenSelectedTab } = option;

		return (
			<Tabs defaultActiveKey={isOpenSelectedTab ? '2' : '1'} className="shop-selector" mode="remain">
				<Panel key="1" tab="全部店铺" className="shop-selector-panel">
					{
						selectedShops && selectedShops.length ? <div className="selected-num">{selectedShops.length}</div> : <></>
					}

					<AllShop onSelect={this.selectedShopHandle}
							 option={option}
							 selectedShops={selectedShops}
							 tenantId={tenantId}/>
				</Panel>

				<Panel key="2" tab="已选店铺" className="shop-selector-panel">
					{
						selectedShops && selectedShops.length ? <div className="selected-num">{selectedShops.length}</div> : <></>
					}
					<SelectedShop
						selectedShops={selectedShops}
						onChecked={this.onChecked}
						option={option}
						tenantId={tenantId}/>
				</Panel>
			</Tabs>
		)
	}

	render() {
		// todo tenantId，areaUrl接口传参需要使用
		const { visible, onOk, onClose, onCancel, option, tenantId } = this.props;
		const areaUrl = `${option.serverName}/shuyun-searchapi/1.0/area?platform=unification`;

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

			if (!areaUrl) {
				console.error('areaUrl 参数不能为空');
				return (
					<></>
				)
			}
		}

		return (
			<Modal
				title="请选择店铺"
				visible={visible}
				onOk={onOk}
				onClose={onClose}
				onCancel={onCancel}
				hasFooter={ option.hasFooter === undefined ? this.state.hasFooter : option.hasFooter }
			>
				{this.renderContext()}
			</Modal>
		)
	}
}
