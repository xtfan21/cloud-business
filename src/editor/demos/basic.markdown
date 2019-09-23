---
title: 基础用法
desc: 内容编辑器
order: 1
---

````javascript
import React from 'react';
import Editor from 'cloud-business/editor';
import { Button } from 'cloud-react';

export default class EditorDemo extends React.Component {

	keywords = [
		{
			type: 'taobao',
			name: 'QZ',
			text: '前缀测试',
			defaultValue: '前缀测试'
		},
		{
			type: 'taobao',
			name: 'HZ',
			text: '后缀测试',
			defaultValue: '后缀测试'
		},
		{
			type: 'taobao',
			name: 'XMTB',
			text: '姓名淘宝',
			defaultValue: '西凉少女Ash'
		},
		{
			type: 'taobao',
			name: 'XMJDWMRZ',
			text: '姓名京东无默认值',
			disabled: true
		},
		{
			type: 'taobao',
			name: 'DDBH',
			text: '订单编号',
			defaultValue: '6666666666',
			disabled: true
		},
		{
			type: 'taobao',
			name: 'shortlink',
			text: '同城关怀_2018-08-07',
			defaultValue: 'c.tb.cn/c.0zYeW#'
		},
		{
			type: 'taobao',
			name: 'LXDH',
			text: '联系电话',
			defaultValue: '180-0000-0000'
		}
	];

	constructor(props) {

		super(props);

		this.state = {
			keywords: this.keywords,
			content: '如果地区{选择器}要使用{{xxxx}}þ_enter_þþ_enter_þ后端数据, 请配置 ual 参数 œœ_[taobao]shortlink_œœ œœ_[taobao]XMTB_œœ 13456789876',
			disabled: false,
			isTrimSpace: false,
			editorText: '',
			outerText: '',
			previewText: []
		}

		this.smsRef = React.createRef();
	}

	handleOuterTextChange = (event) => {
		this.setState({
			outerText: event.target.value
		});
	}

	handleInsertText = () => {
		this.smsRef.current.insertText(this.state.outerText);
	}

	handleInsertKeyword = () => {
		this.smsRef.current.insertKeyword({
			text: '订单短链',
			type: 'taobao'
		});
	}

	handleContentChange = ({editorText, previewText}) => {
		if (editorText) {
			this.setState({editorText});
		}

		if (previewText) {
			this.setState({previewText});
		}
	}

	render() {

		const { keywords, content, disabled, text, isTrimSpace, outerText, previewText } = this.state;

		return (
			<div className="wrapper">

				<Editor ref={this.smsRef}
						disabled={disabled}
						content={content}
						keywords={keywords}
						isTrimSpace={isTrimSpace}
						width={500}
						height={150}
						onContentChanged={this.handleContentChange} />

					<div className="item">
						<label>插入文本内容：</label>
						<input type="text" value={outerText} onChange={this.handleOuterTextChange}/>&nbsp;&nbsp;&nbsp;
						<Button size="small" type="primary" onClick={this.handleInsertText}>插入文本</Button>
					</div>

					<div className="item">
						<label>插入变量：</label>
						<Button size="small" type="primary" onClick={this.handleInsertKeyword}>插入变量</Button>
					</div>

					<div className="sms-preview">
						{
							Array.isArray(previewText) && previewText.map(item =>
								item.length ? 
								<div key={Math.random()} dangerouslySetInnerHTML={{ __html: item }}></div> : <div key={Math.random()}><br/></div>
							)
						}
					</div>
			</div>
		);
	}
}
````


````less
.wrapper {
	position: relative;
}
.sms-preview {
	position: absolute;
	top: 0;
	right: 0;
	width: 200px;
	padding: 10px;
	background: #fff9f9;
}
.item {
	display: flex;
	margin-top: 15px;
}
label {
	width: 100px;
	text-align: right;
}
.text {
	display: inline-block;
	width: 550px;
}
```
