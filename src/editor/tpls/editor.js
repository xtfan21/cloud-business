import React, { createRef, Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import controlFirefoxCursor from '../common/firefoxHelper';
import { createInput, focusNode, isFirefox } from '../common/utils';
import { BRACKET_REG } from '../common/constant';

import Keyword from './keyword';

// css
import './index.less';

class Editor extends Component {

	static propTypes = {
		hasUrl: PropTypes.bool,
		width: PropTypes.number,
		height: PropTypes.number
	};

	static defaultProps = {
		hasUrl: false,
		width: 300,
		height: 130
	};

	constructor(props) {

		super(props);

		// 移除 __moz_resizing
		if(isFirefox()) {
			document.designMode = 'on';
			document.execCommand('enableObjectResizing', false, 'false');
			document.designMode = 'off';
        }

        this.state = {
			hasInvalidString: false,
			isManualClosedUrlTip: false
        };

		this.contentRef = createRef();

		// 对外暴露插入文本 和 变量 的方法
		this.handleInsertText = this.handleInsertText.bind(this);
		this.handleInsertKeyword = this.handleInsertKeyword.bind(this);
	}

	componentDidMount() {
		this.checkEmpty();
	}

	handleKeyDown = event => {

		if(isFirefox()) {
			controlFirefoxCursor(event);
		}
	};

	handleCloseInvalidString = () => {
        this.setState({
			hasInvalidString: false
		});
	}

	handleCloseInvalidUrl = () => {
		this.setState({
			isManualClosedUrlTip: true
		})
	}

	/**
	 * 清除火狐下多出来的br标签
	 */
	clearMozBr = () => {

		const br = this.contentRef.current.querySelector('br[type=_moz]');

		if (br) {
			br.parentNode.removeChild(br);
		}
	}

	/**
	 * @description [处理编辑器内容发生改变的事件]
	 * @memberof Editor
	 */
	onChange = event => {

		this.clearMozBr();

		const { target } = event;
		const { nodeName } = target;

		if (event && (nodeName === 'INPUT' || nodeName === 'IMG')) {
			focusNode(target);
		}

		this.rememberFocus();

		const htmlContent = this.contentRef.current.innerHTML;

		if (BRACKET_REG.test(htmlContent)) {

			// 记录初始光标
			const nodes = [].slice.call(this.contentRef.current.childNodes);
			const node = this._range.startContainer;
			const inputContent = this._range.startContainer.textContent;

			const offset = this._range.startOffset - 1;
			let	caretNodeIndex = nodes.indexOf(node);

			if (/^[【】]/.test(inputContent)) {
				caretNodeIndex -= 1;
			}

			// 修改 HTML
			this.contentRef.current.innerHTML = htmlContent.replace(BRACKET_REG, '');

			// 恢复光标
			const selection = window.getSelection();
			const range = document.createRange();

			selection.removeAllRanges();

			const newPosNode = this.contentRef.current.childNodes[caretNodeIndex];

			if (!newPosNode) {
				// 输入位置在头部
				range.selectNode(this.contentRef.current.firstChild);
				range.collapse(true);
			} else if (newPosNode.nodeType !== 3) {
				// 变量之后
				range.selectNode(newPosNode);
				range.collapse();
			} else {
				// 文字之间
				range.setStart(newPosNode, offset);
				range.setEnd(newPosNode, offset);
			}
			selection.addRange(range);
		} else {
			this.props.onContentChanged(htmlContent);
			this.checkEmpty();
		}
	}

	handlePaste = event => {

		const htmlContent = event.clipboardData.getData('text/html');

		if (htmlContent.indexOf('sms-keyword-inserted') > -1) {
			// TODO: 后期考虑使用 <p> 标签做段落处理, 这样可以使用 br 作为行内换行
			if (isFirefox()) {
				// 临时处理 删除导致换行的 html 标签
				event.preventDefault();
				document.execCommand('insertHTML', false, htmlContent.replace(/<div>/g, '').replace(/<\/div>/g, '').replace(/<br>/g, ''));
				return;
			}
			return;
		}

		event.preventDefault();

		const textContent = event.clipboardData.getData('text/plain');
		const hasError = BRACKET_REG.test(textContent);

        if (hasError) {
            this.setState({
                hasInvalidString: true
            });
        }

		if (isFirefox()) {
			document.execCommand('insertText', false, textContent.replace(BRACKET_REG, '').replace('\n', ''));
		} else {
			document.execCommand('insertText', false, textContent.replace(BRACKET_REG, ''));
		}
	}

	/**
	 * 往短信编辑器中插入标签
	 * @param {string} text - 标签名
	 * @param {string} type - 标签类型
	 */
	handleInsertKeyword = ({ text, type }) => {

		this.reFocus();

		document.execCommand('insertHTML', false, createInput(text, type));

		this.handleInsertAfter();
	}

	/**
	 * 重新定位光标
	 * - 如果记忆了光标位置, 返回
	 * - 如果之前没有操作过, 则定位到文本框最后
	 */
	reFocus = () => {

		if (this._range) {

			const selection = window.getSelection();

			selection.removeAllRanges();

			if (this._range.commonAncestorContainer.parentNode.nodeName === 'A') {

				const range = document.createRange();

				range.selectNodeContents(this.contentRef.current);
				range.collapse(false);
				selection.removeAllRanges();
				selection.addRange(range);

			} else {
				selection.addRange(this._range);
			}
		} else {

			this.contentRef.current.focus();

			const range = document.createRange();

			range.selectNodeContents(this.contentRef.current);
			range.collapse(false);

			const selection = window.getSelection();

			selection.removeAllRanges();
			selection.addRange(range);
		}
	};

	/**
	 * 往短信编辑器中插入文本
	 * @param {string} text - 文本
	 */
	handleInsertText(text) {

		this.reFocus();
		// 此处不能使用insertText，会出现focus焦点错误
		document.execCommand('insertHTML', false, text);

		this.handleInsertAfter();
	}

	/**
	 * 如果文本编辑器为空, 为其添加 empty 样式
	 */
	checkEmpty() {

		const currentElement = this.contentRef.current;

		if (currentElement.innerHTML === '<br>') {
			currentElement.innerHTML = '';
		}

		currentElement.parentNode.classList[currentElement.innerHTML.length ? 'remove' : 'add']('empty');
	}

	/**
	*  记录光标在编辑器中的位置
	*/
	rememberFocus() {

		const selection = window.getSelection();

		if (selection.rangeCount) {
			this._range = selection.getRangeAt(0);
		}
	}

	/**
	 * 处理插入文本 和 变量后的公共事件
	 */
	handleInsertAfter() {

		this.clearMozBr();

		this.props.onContentChanged(this.contentRef.current.innerHTML);

		this.checkEmpty();

		if (this._range) {

			const { startContainer, startOffset } = this._range;
			const { nodeType, childNodes, nextSibling } = startContainer;

			if (nodeType === 1) {
				this._range = focusNode(childNodes[startOffset]);
			} else if (nodeType === 3 && (startContainer.length === startOffset && nextSibling)) {
				this._range = focusNode(nextSibling);
			}
		}
	}

	render() {

		const { hasInvalidString, isManualClosedUrlTip } = this.state;
		const { keywords, width, height, disabled, resultContent, hasUrl } = this.props;

		const classes = classNames('editor-content', {
			'empty': resultContent.length === 0
		});

		return (
			<div className="editor">
				{/* 变量列表 */}
				<Keyword keywords={keywords} width={width} onInsertKeyword={this.handleInsertKeyword} />
				{/* 编辑器部分 */}
				<div className={classes} style={{ width: `${width}px` }}>
                    <div className="editor-content-main"
                        style={{ width: `${width}px`, height: `${height}px` }}
                        ref={this.contentRef}
                        contentEditable={!disabled}
                        dangerouslySetInnerHTML={{ __html: resultContent }}
                        onKeyDown={this.handleKeyDown}
                        onKeyUp={this.onChange}
                        onMouseUp={this.onChange}
                        onPaste={this.handlePaste}>
                    </div>
                    {
						hasInvalidString &&
						<div className="url-tips">
							您的内容中含有非法字符，已进行过滤。
							<span className="url-tips-close" onClick={this.handleCloseInvalidString}></span>
						</div>
					}
					{
						(hasUrl && !isManualClosedUrlTip) &&
						<div className="url-tips">
							输入短链地址时，请在后方加上 #，以确保短链能够正常打开，如 www.shuyun.com#
							<span className="url-tips-close" onClick={this.handleCloseInvalidUrl}></span>
						</div>
					}
				</div>
			</div>
		)
	}
}

export default Editor;
