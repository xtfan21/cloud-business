import React, { createRef, Component } from 'react';

import Editor from '../editor';
import SmsContext from './SmsContext';

// 校验是否为 url 地址
const regUrlBase = '((([A-Za-z]{3,9}:(?:\\/\\/)?)(?:[-;:&=\\+\\$,\\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\\+\\$,\\w]+@)[A-Za-z0-9.-]+)((?:\\/[\\+~%\\/.\\w-_]*)?\\??(?:[-\\+=&;%@.\\w_]*)#?(?:[.\\!\\/\\\\w]*))?)';
export const REG_URL = new RegExp(regUrlBase);
export const REG_URL_HASH = new RegExp(`${regUrlBase}#`);

class SmsEditor extends Component {

	state = {
		// 编辑器内容触发的提示信息
		tip: ''
	};

	constructor(props) {

		super(props);

		this.smsRef = createRef();

		this.handleInsertText = this.handleInsertText.bind(this);
		this.handleInsertKeyword = this.handleInsertKeyword.bind(this);
	}

	handleContentChanged = data => {

        const { editorText } = data;

		if (editorText !== undefined ) {

			const hasUrl = REG_URL.test(editorText) && !REG_URL_HASH.test(editorText);

			this.setState({
				tip: hasUrl ? '输入短链地址时，请在后方加上 #，以确保短链能够正常打开，如 www.shuyun.com#' : ''
			});
		}

		this.props.onContentChanged(data);
	}

	handleInsertText(text) {
		this.smsRef.current.insertText(text);
	}

	handleInsertKeyword(keyword) {
		this.smsRef.current.insertKeyword(keyword);
	}

	render() {

		const { content, disabled, keywords, isTrimSpace } = this.context;

		return (
            <Editor ref={this.smsRef}
                    disabled={disabled}
                    content={content}
                    keywords={keywords}
                    isTrimSpace={isTrimSpace}
                    tip={this.state.tip}
                    width={500}
                    height={150}
                    onContentChanged={this.handleContentChanged} />

		);
	}
}

SmsEditor.contextType = SmsContext;

export default SmsEditor;
