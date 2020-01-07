---
title: 指定不可选店铺（LP3）
desc: 传入不可选店铺Id列表
---

````javascript
import React, { Component } from 'react';
import ShopSelector from 'cloud-business/shop-selector';

import { Button } from 'cloud-react';

let tenantId = 'qiushi6';
let serverName = 'https://qa-ual.shuyun.com'; // https://qa-ual.shuyun.com 或者 https://ual.shuyun.com
let selectedShop = ['jos_128682']; // ['jos_19890202', 'offline_2018092015096', 'offline_2018092015109', 'taobao_100571094'];
let disabledRowIdList = ['suning_6010355201', 'jos_128682', 'taobao_108243594'];

let commonOptions = {
	platform: ['jos', 'taobao', 'offline'], // 添加用户平台参数platform，数组形式，['jos', 'taobao', 'offline']
	selectedShop,
	isSingleSelected: false,
	serverName,
	disabledRowIdList
};


export default class ShopSelectorDemo extends Component {
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
            	<Button type="normal" onClick={this.onOpenShopSelector}>指定不可选店铺</Button>
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
