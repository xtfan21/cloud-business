---
order: 1
title: CustomerView
desc: 客户视图演示
---

```javascript
import React from 'react';
import { Button } from 'cloud-react';
import CustomerView from 'cloud-business/customer-view';
export default class CustomerViewDemo extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            visible: false,
            uniId: '000030487161163d37fcb25fce28b7df',
            serverName: 'data-manage-x/1.0/',
            domain: 'https://qa-ual.shuyun.com'
        };
    }

    showCustomerView = () => {
        this.setState({
            visible: true
        })
    };

    hideCustomerView = () => {
        this.setState({
            visible: false
        })
    };

    render() {
        return (
            <div className="area">
                <Button onClick={this.showCustomerView}>打开客户视图</Button>

                <CustomerView 
                    visible={this.state.visible} 
                    onClose={this.hideCustomerView} 
                    serverName={this.state.serverName}
                    domain={this.state.domain}
                    uniId={this.state.uniId}/>
            </div>
        )
    }
}
```
