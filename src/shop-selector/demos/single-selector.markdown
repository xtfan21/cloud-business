---
title: 单选店铺选择器
desc: 单选
---

````javascript
import React, { Component } from 'react';
import ShopSelector from 'cloud-business/shop-selector';

import { Button } from 'cloud-react';

let hasFooter = true;
let tenantId = 'qiushi6';
let serverName = ''; // http://qa-ual.shuyun.com 或者 http://ual.shuyun.com
let isSupportedChannel = true;
let selectedShop = ['jos_19890202']; // ['jos_19890202']
let isOpenSelectedTab = false; // 存在已选店铺是否需要直接进入已选店铺 tab

let commonOptions = {
	hasFooter,
	selectedShop,
	isSingleSelected: true,
	serverName,
	isSupportedChannel,
	isOpenSelectedTab
};


const singleOption = {
	// 添加用户平台参数platform，数组形式，['jos', 'taobao', 'offline']
	platform: ['jos', 'taobao', 'offline'],
	...commonOptions
}

export default class shopSelectorDemo extends Component {
	constructor(props) {
		super(props);
		this.state = {
			visible: false
		}
	}
	
	onOpenShopSelector = () => {
		this.setState({
			visible: true
		});
	}
	
	onClose = () => {
		this.setState({
			visible: false
		})
	}
	
	onCancel = () => {
		this.setState({
			visible: false
		})
	}
	
	onOk = () => {
		this.setState({
			visible: false
		})
	}
	
     render() {
        return (
            <div className="app-contain">
            	<Button type="normal" onClick={this.onOpenShopSelector}>单选店铺选择器</Button>
            	 <ShopSelector
            	 visible={this.state.visible}
            	 onOk={this.onOk}
            	 onClose={this.onClose}
            	 onCancel={this.onCancel}
            	 option={singleOption}
            	 tenantId={tenantId}
            	 />
            </div>
        )
    }
}

````
