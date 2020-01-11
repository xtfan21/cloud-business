---
title: 短信编辑器弹框使用demo
desc: 在弹窗中使用
---

````javascript
import React from 'react';
import SmsEditor from 'cloud-business/sms-editor';
import { Button, Modal, Table } from 'cloud-react';

const resource = () => fetch('https://www.lovejavascript.com/learnLinkManager/getLearnLinkList').then(res => res.json());
const columnData = [
    {
        key: 'name',
        text: '名称',
        align: 'left'
    },{
        key: 'info',
        text: '使用说明'
    }
];

class SmsDemo1 extends React.Component {

	keywords = [
		{
			type: 'taobao',
			name: 'QZ',
			text: '前缀测试',
			isShow: true,
			defaultValue: '前缀测试'
		},
		{
			type: 'taobao',
			name: 'HZ',
			text: '后缀测试',
			isShow: true,
			defaultValue: '后缀测试'
		},
		{
			type: 'taobao',
			name: 'XMTB',
			text: '姓名淘宝',
			isShow: true,
			defaultValue: '西凉少女Ash'
		}
	];

	gateways = [{
			name: 'GatewayType 0',
			gatewayId: 0,
			wordsLimit: 70,
			multiLimit: 67,
			gatewayType: 0,
			signature: '数云食堂',
	}];

	constructor(props) {

		super(props);

		this.state = {
			gateway: this.gateways[0],
			keywords: this.keywords,
			content: '如果地区{选择器}要使用{{xxxx}}þ_enter_þþ_enter_þ后端数据, 请配置 ual 参数 œœ_[taobao]shortlink_œœ œœ_[taobao]XMTB_œœ 13456789876',
			useUnsubscribe: true,
			unsubscribeText: '回T退定',
			customSignature: '我是自定义的签名',
			disabled: false,
			isTrimSpace: false,
			text: '',
			outerText: '',
            visible: false
		}

        this.smsRef = React.createRef();

	}

	handleChange = (event) => {

		const id = event.target.value;
		const gateway = this.gateways.find(item => item.gatewayId === Number(id));

		this.setState({
			gateway: gateway
		});
	}

    // 插入的变量中包含 http
	handleInsertKeyword = () => {
		this.smsRef.current.insertKeyword({
            text: '整单发货关怀_简单关怀2（24个字）',
            type: 'h5^101881409^qiushi6^taobao_101881409^http://pre.vcrm.me/AAfH'
        });
	}

	handleContentChange = data => {
        console.log(data);
	}

	openModal = () => {
		this.setState({
            visible: true
        });
	}

    handleOk = () => {
        this.setState({
            visible: false
		});
		this.handleInsertKeyword();
    };

    handleCancel = () => {
        this.setState({
            visible: false
        })
    };

	render() {

		const { keywords, content, gateway, useUnsubscribe, unsubscribeText, customSignature, disabled, text, isTrimSpace, outerText } = this.state;

		return (
			<div className="wrapper">

				<SmsEditor ref={this.smsRef}
					 disabled={disabled}
					 content={content}
					 keywords={keywords}
					 isTrimSpace={isTrimSpace}
					 gateway={gateway}
					 useUnsubscribe={useUnsubscribe}
					 unsubscribeText={unsubscribeText}
					 customSignature={customSignature}
					 onContentChange={this.handleContentChange}>

					<div className="item">
						<label>发送通道：</label>
						<select value={gateway.gatewayId} onChange={this.handleChange}>
							{
								this.gateways.map(item =>
									<option key={item.gatewayId} value={item.gatewayType}>{item.name}</option>
								)
							}
						</select>
					</div>

					<SmsEditor.Editor />

					<div className="item">
						<label>插入变量：</label>
						<Button size="small" type="primary" onClick={this.handleInsertKeyword}>插入变量</Button>
					</div>

                    <Modal
						title='点击确定按钮插入变量'
						visible={this.state.visible}
						clickMaskCanClose={false}
						onOk={this.handleOk}
						onCancel={this.handleCancel}
						onClose={this.handleCancel}>
						<Table gridManagerName="test-table987765" ajaxData={resource} columnData={columnData} />
                     </Modal>

					<div className="sms-modal-insert" style={{ marginTop: 20 }}>
						 <Button size="small" type="primary" onClick={this.openModal}>打开弹窗插入变量</Button>
					</div>
				</SmsEditor>
			</div>
		);
	}
}

export default class SmsModal extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            visible1: false
        };
    }

    openModal1 = () => {
        this.setState({
            visible1: true
        });
    };

    handleOk1 = () => {
        this.setState({
            visible1: false
        })
    };

    handleCancel1 = () => {
        this.setState({
            visible1: false
        })
    };

    render() {
        return <div>
                <Button size="small" type="primary" onClick={this.openModal1}>打开弹窗</Button>
                <Modal
                     title='短信编辑器'
                     visible={this.state.visible1}
                     clickMaskCanClose={false}
                     onOk={this.handleOk1}
                     onCancel={this.handleCancel1}
					 onClose={this.handleCancel1}>
                     <SmsDemo1 />
                 </Modal>
            </div>
    }
}
````
