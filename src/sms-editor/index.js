/*
 * @Author: fang.yang
 * @Date: 2020-01-10 18:11:43
 * @prd url: http://wiki.yunat.com/pages/viewpage.action?pageId=38613411
 */

import React, { cloneElement, createRef, Children, Component } from 'react';
import PropTypes from 'prop-types';

import SmsContext from './SmsContext';

import Preview from './preview';
import Editor from './editor';

/**
 * @description 根据变量和换行符获取短信预览内容
 * @param {*} { preview, signature, gatewayType, unsubscribeText, customSignature }
 * @returns
 */
function getContent({ preview = [], signature = '', gatewayType, unsubscribeText = '', customSignature = '' }) {

	const content = preview;
	const len = content.length;

	switch (gatewayType) {
		case 0:
			content[len - 1] = content[len - 1] + unsubscribeText + customSignature;
			break;
		case 1:
		case 5:
			content[len - 1] = content[len - 1] + unsubscribeText + customSignature + signature;
			break;
		case 2:
			content[0] = customSignature + content[0];
			content[len - 1] = content[len - 1] + unsubscribeText;
			break;
		case 3:
		case 4:
			content[0] = signature + customSignature + content[0];
			content[len - 1] = content[len - 1] + unsubscribeText;
			break;
		default:
	}
	return content;
}

class Sms extends Component {

	static Editor = ({ ...props }) => <Editor ref = { props.editorRef } onContentChanged = { props.onContentChanged }/>;

	static Preview = () => <Preview />;

    // 存储编辑器的原始内容生成的预览文本
    originalPreviewText = [];

    // 存储编辑器原始内容的总字数
	originalTotalChars = 0;

	constructor(props) {

		super(props);

		this.editorRef = createRef();

		this.state = {
			editorText: '',
			previewText: '',
			totalChars: 0,
			newLineNumber: 0,
			variableNumber: 0,
			customSignature: '',
			unsubscribeText: ''
		};

		this.getOuterData = this.getOuterData.bind(this);
	}

	static getDerivedStateFromProps(props, state) {

		const { useUnsubscribe, customSignature, unsubscribeText, gateway, content } = props;

		const _customSignature = customSignature ? `【${customSignature.replace(/</g, '&lt;')}】` : '';
		const _unsubscribeText = useUnsubscribe ? unsubscribeText : '';

		if (state.customSignature !== _customSignature || state.unsubscribeText !== _unsubscribeText || state.gateway !== gateway || state.content !== content) {
			return {
				customSignature: _customSignature,
				unsubscribeText: _unsubscribeText,
				gateway,
				content
			}
		}

		return null;
	}

	componentDidUpdate(prevProps) {

		const { useUnsubscribe, customSignature, unsubscribeText, gateway } = this.props;
		const { useUnsubscribe: _useUnsubscribe, customSignature: _customSignature, unsubscribeText: _unsubscribeText, gateway: _gateway } = prevProps;

		if (_useUnsubscribe !== useUnsubscribe || _customSignature !== customSignature || _unsubscribeText !== unsubscribeText || gateway !== _gateway) {
			this.resolveUpdate();
		}
	}

	/**
	 * @description [对业务方暴露需要的数据]
	 * @returns
	 */
	getOuterData() {

		const { editorText, previewText, totalChars, newLineNumber, variableNumber } = this.state;

		return {
			editorText,
			previewText,
			totalChars,
			newLineNumber,
			variableNumber
		};
	}

	handleContent(data) {

		const { editorText, previewText, totalChars, newLineNumber, variableNumber } = data;

		if (editorText !== undefined) {
			this.setState({ editorText });
		}

		if (newLineNumber !== undefined) {
			this.setState({ newLineNumber });
		}

		if (variableNumber !== undefined) {
			this.setState({ variableNumber });
		}

		if (previewText !== undefined) {
			this.originalPreviewText = previewText;
			this.resolveUpdate();
		}

		if (totalChars !== undefined) {
			this.originalTotalChars = totalChars;
			this.resolveUpdate();
		}
		// 只对外暴露编辑器文本值，其余均需要通过 getOuterData 去统一获取
		if (editorText !== undefined) {
			this.props.onContentChange({ editorText });
		}
	}

    /**
     * 处理签名、短信通道变化之后，预览内容和总字数计算变化
     */
	resolveUpdate() {

		const { gateway: { signature, gatewayType } } = this.props;
		const { unsubscribeText, customSignature } = this.state;

		const gatewayTypes = [1, 3, 4, 5];
		const gatewayLength = gatewayTypes.indexOf(gatewayType) > -1 ? signature.length : 0;

		const totals = this.originalTotalChars + gatewayLength + customSignature.length + unsubscribeText.length;

		const preview = [...this.originalPreviewText];

		const previews = getContent({ preview, signature, gatewayType, unsubscribeText, customSignature });

		this.setState({
			previewText: previews,
			totalChars: totals
		});

	}

	insertText(text) {
		this.editorRef.current.handleInsertText(text);
	}

	insertKeyword(keyword) {
		this.editorRef.current.handleInsertKeyword(keyword);
	}

	/**
	 * @description [递归渲染传递进来的节点]
	 * @param {*} children
	 * @returns
	 */
	renderChild(children) {

		return Children.map(children, child => {

			if (child.props && child.props.children) {
				return cloneElement(child, {
					...child.props,
					children: this.renderChild(child.props.children)
				});
			}

			if (child.type && child.type.prototype === Sms.Editor.prototype) {
				return cloneElement(child, {
					editorRef: this.editorRef,
					onContentChanged: this.handleContent.bind(this)
				});
			}

			if (child.type && child.type.prototype === Sms.Preview.prototype) {
				return cloneElement(child);
			}

			return child;
		})
	}

	render() {

		const { previewText, totalChars, newLineNumber, variableNumber } = this.state;
		const { keywords, disabled, gateway, isTrimSpace, content } = this.props;

		return (
			<SmsContext.Provider
				value={{
					content,
					previewText,
					gateway,
					isTrimSpace,
					totalChars,
					newLineNumber,
					variableNumber,
					disabled,
					keywords
				}}>
				{
					this.renderChild(this.props.children)
				}
			</SmsContext.Provider>
		);
	}
}

Sms.contextType = SmsContext;

export default Sms;

Sms.propTypes = {
	content: PropTypes.string,
	keywords: PropTypes.array,
	isTrimSpace: PropTypes.bool,
	disabled: PropTypes.bool,
	customSignature: PropTypes.string,
	useUnsubscribe: PropTypes.bool,
	unsubscribeText: PropTypes.string,
	gateway: PropTypes.shape({
		gatewayType: PropTypes.number,
		multiLimit: PropTypes.number,
		wordsLimit: PropTypes.number,
		signature: PropTypes.string
	}),
	onContentChange: PropTypes.func
};

Sms.defaultProps = {
	content: '',
	keywords: [],
	isTrimSpace: false,
	disabled: false,
	customSignature: '',
	useUnsubscribe: false,
	unsubscribeText: '回T退',
	gateway: {},
	onContentChange: () => {}
};
