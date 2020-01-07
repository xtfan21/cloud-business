---
title: 多选店铺选择器
desc: 多选
---

````javascript
import React, { Component } from 'react';
import ShopSelector from 'cloud-business/shop-selector';

import { Button } from 'cloud-react';

let tenantId = 'qiushi6';
let serverName = 'https://qa-ual.shuyun.com'; // https://qa-ual.shuyun.com 或者 https://ual.shuyun.com
let selectedShop = ['jos_20199000', 'taobao_60790435']; // ['jos_19890202', 'offline_2018092015096', 'offline_2018092015109', 'taobao_100571094'];

let commonOptions = {
	platform: ['taobao', 'offline', 'jos'], // 添加用户平台参数platform，数组形式，['jos', 'taobao', 'offline']
	selectedShop,
	isSingleSelected: false,
	serverName
};

export default class ShopSelectorDemo extends Component {
	constructor(props) {
		super(props);
		this.state = {
			visible: false,
			 selectedShopList: []
		}
	}
	
	onOpenShopSelector = () => {
		this.setState({
			visible: true
		});
	};
	
	onClose = () => {
		this.setState({
			visible: false
		})
	};
	
	onCancel = list => {
		console.log('----------cancel---------', list);
		this.setState({
			visible: false
		});
	};
	
	onOk = list => {
		this.setState({
			visible: false
		});
		console.log('--------selectedShopList-------', list);
	};
	
	render() {
		return (
		    <div className="app-contain">
		        <Button type="normal" onClick={this.onOpenShopSelector}>多选店铺选择器</Button>
		         <ShopSelector
		         visible={this.state.visible}
		         onOk={this.onOk}
		         onClose={this.onClose}
		         onCancel={this.onCancel}
		         option={commonOptions}
		         tenantId={tenantId}
		         />
		    </div>
		)
	}
}

````
