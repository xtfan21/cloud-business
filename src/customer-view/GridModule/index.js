/**
 * 表格区域组件
 * Index
 * wangbo
 * 2019/10/8
 */
import React from 'react';
import Tabs from 'cloud-react/tabs';
import CustomerBenefit from './CustomerBenefit';
import CustomerCard from './CustomerCard';
import CustomerEvaluation from './CustomerEvaluation';
import CustomerInteractive from './CustomerInteractive';
import CustomerLabel from './CustomerLabel/CustomerLabel';
import CustomerOrder from './CustomerOrder';
import CustomerMarketing from './CustomerMarketing';
import CustomerAddress from './CustomerAddress';

class GridModule extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div className="grid-area">
                <Tabs defaultActiveKey="label" onChange={this.handleChange}>
                    <Tabs.Panel tab="客户标签" key="label"><CustomerLabel/></Tabs.Panel>
                    <Tabs.Panel tab="会员卡信息" key="card"><CustomerCard/></Tabs.Panel>
                    <Tabs.Panel tab="订单信息" key="order"><CustomerOrder/></Tabs.Panel>
                    <Tabs.Panel tab="营销信息" key="marketing"><CustomerMarketing/></Tabs.Panel>
                    <Tabs.Panel tab="互动信息" key="interactive"><CustomerInteractive/></Tabs.Panel>
                    <Tabs.Panel tab="评价信息" key="evaluation"><CustomerEvaluation/></Tabs.Panel>
                    <Tabs.Panel tab="权益信息" key="benefit"><CustomerBenefit/></Tabs.Panel>
                    <Tabs.Panel tab="常用收货信息" key="address"><CustomerAddress/></Tabs.Panel>
                </Tabs>
            </div>
        );
    }
}

export default GridModule;
