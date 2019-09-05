---
title: ccMenu
desc: 菜单和店铺选择的组合
order: 5
---

````javascript
import React, { Component } from 'react';
import CcMenu from 'cloud-business/cc-menu';
import { HashRouter } from 'react-router-dom';

const menuSource = [{
    title: '基础组件',
    key: '/components2',
    children: [{
        title: <span style={{color: 'red'}}>Button 按钮</span>,
        key: '/components/button'
    }, {
        title: '积分',
        key: '/components/modal'
    }]
}, {
    title: '业务组件',
    key: '/components',
    children: [{
        title: 'CcMenu 侧边栏',
        key: '/components/cc-menu'
    }, {
        title: '地址选择器',
        key: '/components/area-selector'
    }]
}];

const shopSource = [{
    title: '京东',
    key: 'jos',
    children: [{
        title: '店铺1',
        key: 'shop1',
        icon: 'http://wx.qlogo.cn/mmopen/bIN3CwO4iam6iaYx3uNZiakWvIVE2QOLQC3HUEsuxKVajUeRYVkZ7ibCIAdBeWfnYib34icHynVh19r9JnmFPzUVsQLuuMafuiaJFhU/0'
    }, {
        title: '店铺2',
        key: 'shop2',
        icon: ''
    }]
}, {
    title: '淘宝',
    key: 'taobao',
    children: [{
        title: '天猫1',
        key: 'tm1',
        icon: 'http://wx.qlogo.cn/mmopen/TjeR0tH4DszjrycEBROicLhdJsPI2dBM4xT27ujiboM7SNM8OeibJbBiaNOUo5CfnKl9ueR3dwGxBUK0yibL4XzTVzKxKCl9icfVET/0'
    }, {
        title: '天猫2',
        key: 'tm2'
    }]
}];

export default class MenuBasicDemo extends Component {

    handleSubMenuToggle = (key, path, expanded) => {
        console.log('激活项目key:', key);
        console.log('激活项目定位路径:', path);
        console.log('子菜单是否展开：', expanded);
    }

    handleMenuItemClick = (key, path) => {
        console.log('激活项目key:', key);
        console.log('激活项目定位路径:', path);
    }

    handleShopSearch = (keyword, newShopList) => {
        console.log('搜索关键字:', keyword);
        console.log('搜索结果', newShopList);
    }

    handleShopChange = (shop, plat) => {
        console.log('选中的店铺:', shop);
        console.log('选中的平台:', plat);
    }

    render() {

        return (
            <HashRouter>
                <div className="cc-menu-wrapper">
                    <CcMenu
                        shopSource={shopSource}
                        menuSource={menuSource}
                        onMenuItemClick={this.handleMenuItemClick}
                        onSubMenuToggle={this.handleSubMenuToggle}
                        onShopSearch={this.handleShopSearch}
                        onShopChange={this.handleShopChange}>
                    </CcMenu>
                </div>
            </HashRouter>
       );

   }
}

````

````less
.cc-menu-wrapper {
    height: 300px;
    border: 1px solid #ccc;
    overflow: hidden;
}
````
