/**
 * 客户标签组件
 * CustomerLabel
 * wangbo
 * 2019/10/8
 */
import React from 'react';
import CustomerTagModule from './CustomerTagModule';
import CustomerRFMModule from './CustomerRFMModule';

class CustomerLabel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div className="customer-label-area">
                <CustomerTagModule/>

                <CustomerRFMModule/>
            </div>
        );
    }
}

export default CustomerLabel;
