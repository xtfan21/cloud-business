---
title: 外部控制预览样式
desc: 通过 hasTagInPreview = false 来设置预览输出为纯文本，不包含任何html标签，用于展示特定样式。
order: 2
---

````javascript
import React from 'react';
import Editor from 'cloud-business/editor';
import { Button } from 'cloud-react';

export default class EditorDemo extends React.Component {

	keywords = [{
		type: 'taobao',
		name: 'XMTB',
		text: '姓名淘宝',
		defaultValue: '西凉少女Ash'
	},
	{
		type: 'taobao',
		name: 'shortlink',
		text: '同城关怀_2018-08-07',
		defaultValue: 'c.tb.cn/c.0zYeW#'
	}];

	constructor(props) {

		super(props);

		this.state = {
			keywords: this.keywords,
			hasTagInPreview: false,
			editorText: '',
			previewText: [],
			content: '如果地区{选择器}要使用{{xxxx}}þ_enter_þþ_enter_þ后端数据, 请配置 ual 参数 œœ_[taobao]shortlink_œœ œœ_[taobao]XMTB_œœ 13456789876'
		}

		this.smsRef = React.createRef();
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

		const { keywords, content, hasTagInPreview, result, previewText } = this.state;

		return (
			<div className="wrapper">
				<Editor ref={this.smsRef}
						content={content}
						keywords={keywords}
						width={500}
						height={150}
					 	hasTagInPreview={hasTagInPreview}
						onContentChanged={this.handleContentChange}	 />

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
