import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tabs } from 'cloud-react';
import '../index.less';
import AllShop from './all-shop';
import SelectedShop from './selected-shop';
import store from '../store';
import ShopContext from '../context'


const { Panel } = Tabs;

class ShopSelectorCore extends Component {

	static contextType = ShopContext;

	constructor(props) {
		super(props);
		this.state = {
			selectedShops: undefined,
			channelConfig: null
		};
	}

	componentDidMount() {
		this.channelList();
	}

	selectedShopHandle = shop => {
		this.setState({
			selectedShops: shop.checkedList
		});

		this.context.changeSelectedShops(shop.checkedList);
	};

	onChecked = (selectedShops) => {
		this.setState({
			selectedShops,
		});
	};

	/**
	 * 获取平台数据
	 * @returns {Promise<any>}
	 */
	async channelList() {
		const { option, tenantId } = this.props;
		this.channel = await store.fetchChannelData({ serverName: option.serverName, tenantId });
		this.channel.forEach(item => {
			if (item.filter.length) {
				this.shopTypeList = item.filter;
			}
		});

		this.setState({
			channelConfig: {
				channelList: this.channel,
				shopTypeList: this.shopTypeList
			}
		})
	}

	render(){
		const { selectedShops, channelConfig } = this.state;
		const { option, tenantId } = this.props;
		const { isOpenSelectedTab } = option;

		return (
				<Tabs defaultActiveKey={isOpenSelectedTab ? '2' : '1'} className="shop-selector" mode="remain">
					<Panel key="1" tab="全部店铺" className="shop-selector-panel">
						{
							selectedShops && selectedShops.length ? <div className="selected-num">{selectedShops.length}</div> : <></>
						}

						{
							channelConfig && <AllShop onSelect={this.selectedShopHandle}
														   option={option}
														   selectedShops={selectedShops}
														   tenantId={tenantId}
														   channel={channelConfig}
							/>
						}

					</Panel>

					<Panel key="2" tab="已选店铺" className="shop-selector-panel">
						{
							selectedShops && selectedShops.length ? <div className="selected-num">{selectedShops.length}</div> : <></>
						}
						{ channelConfig && <SelectedShop
							selectedShops={selectedShops}
							onChecked={this.onChecked}
							option={option}
							tenantId={tenantId}
							channel={channelConfig}
							shopTypeList={this.shopTypeList}/>}
					</Panel>
				</Tabs>
		)
	}
}

ShopSelectorCore.propTyes = {
	option: PropTypes.object,
	tenantId: PropTypes.string
};

ShopSelectorCore.defaultProps = {
	option: {},
	tenantId: ''
};

export default ShopSelectorCore
