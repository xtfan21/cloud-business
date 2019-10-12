// libs
import React, { createRef, Component } from 'react';
import PropTypes from 'prop-types';

// utils and constant
import { createTagPreview, convertContent, escapeRegExp, formatContent, getVariableReg, keywordTextNameConvert, parseTag, parseHTML } from './common/utils';
import { DEFAULT_TYPE_NAME, KEYWORD_SIGN, HTML_ENTITY_CODE, NEW_LINE, REG_URL_HASH } from './common/constant';

// components
import EditorMain from './tpls/editor';

class Editor extends Component {

	static propTypes = {
		content: PropTypes.string,
		disabled: PropTypes.bool,
		isTrimSpace: PropTypes.bool,
		hasTagInPreview: PropTypes.bool,
		keywords: PropTypes.array,
		onContentChanged: PropTypes.func
	};

	static defaultProps = {
		content: '',
		disabled: false,
		isTrimSpace: false,
		hasTagInPreview: true,
		keywords: [],
		onContentChanged: () => {}
	};

	constructor(props) {

		super(props);

		this.tempRef = createRef();

		this.editorRef = createRef();

		this.state = {
			resultContent: '',
			editorText: '',
			previewText: []
		};

		this.insertText = this.insertText.bind(this);
		this.insertKeyword = this.insertKeyword.bind(this);
	}

	static getDerivedStateFromProps(props, state) {

		if (props.content !== state.content) {
			return { content: props.content };
		}

		return null;
	}

	componentDidMount() {
		this.resolveContent();
	}

	resolveContent = () => {

		const { content, isTrimSpace, keywords } = this.props;

		let resultContent = '';

		if (content) {

			let text = convertContent(content, isTrimSpace);

			// 当前编辑器存在 keywords 的时候才存在变量转换的必要
			if (keywords.length) {
				text = parseTag(text, KEYWORD_SIGN, KEYWORD_SIGN, keywords);
			}

			resultContent = formatContent(text);

			this.setState({ resultContent });
		}

		this.handleContent(resultContent);

	}

	// 计算不包含变量和换行的文本字数
	setTotalChars = text => {

		const variableReg = RegExp(`${escapeRegExp(KEYWORD_SIGN)}_(\\[[^]]+])?(.+?)_${escapeRegExp(KEYWORD_SIGN)}`, 'g');

		const totals = text.replace(variableReg, '').replace(`/${NEW_LINE}/g`, ' ').length;

		this.props.onContentChanged({ totalChars: totals });
	}

	// 计算短信内容包含的换行符数量
	setNewLineNumber = text => {

		const newLineNumber = text.split(NEW_LINE).length - 1;
		this.props.onContentChanged({ newLineNumber });

	}

	// 计算短信内天包含的变量数量
	setVariableNumber = text => {

		const variableReg = RegExp(`${escapeRegExp(KEYWORD_SIGN)}_(\\[[^]]+])?(.+?)_${escapeRegExp(KEYWORD_SIGN)}`, 'g');

		const varMatch= text.match(variableReg);
		const variableNumber = varMatch ? varMatch.length : 0;

		this.props.onContentChanged({ variableNumber });

    }
    
    // 计算内容包含的变量预估字数
    setVariableWordsNumber = varibaleNames => {
        
        const { keywords } = this.props;

        let variableWordsNumber = 0;

        varibaleNames.map(name => {

            const result = keywords.find(keyword => keyword.name === name) || {};

            variableWordsNumber += result.wordCount ? result.wordCount : 0;

            return null;

        });

        this.props.onContentChanged({ variableWordsNumber })

    }

	setEditorText = text => {

		const { isTrimSpace, keywords } = this.props;
        const inputReg = getVariableReg();
        // 内容变量 name 集合
        const varibaleNames = [];

		let data = text
			.replace(inputReg, (result, $1, $2) => {
                
                // 编辑器中显示需要 text，但是给到后端解析需要使用 name 字段
                const name = keywordTextNameConvert($2, true, keywords);
                varibaleNames.push(name);

				if ($1 === DEFAULT_TYPE_NAME) {
					return `${KEYWORD_SIGN}_${name}_${KEYWORD_SIGN}`;
				}
                return `${KEYWORD_SIGN}_[${$1}]${name}_${KEYWORD_SIGN}`;
                
			})
			.replace(/<[^>]+>/g, '')
			.replace(/(&nbsp;)|(&lt;)|(&gt;)|(&amp;)/g, result => {
				return HTML_ENTITY_CODE[result];
			});

		if (isTrimSpace) {
			data = data.trim();
		}

		this.setState({
			editorText: data
        });
        
		this.props.onContentChanged({ editorText: data });

		this.setTotalChars(data);
		this.setNewLineNumber(data);
        this.setVariableNumber(data);
        this.setVariableWordsNumber(varibaleNames);
	};

	setPreviewText = text => {

		const { isTrimSpace, keywords, hasTagInPreview } = this.props;

		const inputReg = getVariableReg();

		this.tempRef.current.innerHTML = text
			.replace(inputReg, (result, $1, $2) => {
				return createTagPreview(keywords, $2, $1);
			});

		const content = convertContent(this.tempRef.current.textContent, isTrimSpace);
        
        let preview = content;	

		if (hasTagInPreview) {
			// 关键字高亮, URL, 手机及固话号码下划线
			preview = content
						.replace(/œ([^œ]+)œ/g, (result, $1) => {
							return `<span class="preview-content-tag">${$1.trim()}</span>`;
						})
						.replace(REG_URL_HASH, result => {
							return `<a href="javascript: void(0);">${result.slice(0, result.length - 1)}</a>#`;
						})
						.replace(/(\D|\b)(1[3-9]\d-?\d{4}-?\d{4})(\D|\b)/g, (match, p1, p2, p3) => {
							return `${p1}<a href="javascript: void(0);">${p2}</a>${p3}`;
						})
						.replace(/(\D)((?:[08][1-9]\d{1,2}-?)?[2-9]\d{6,7})(\D)/g, (match, p1, p2, p3) => {
							return `${p1}<a href="javascript: void(0);">${p2}</a>${p3}`;
						});
        } else {
            // 输出普通文本的时候需要将解析的变量剔除
            preview = content
                        .replace(/œ([^œ]+)œ/g, (result, $1) => {
                            return $1.trim();
                        });
        }

        const previews = preview.split(NEW_LINE) || [];

		this.setState({ previewText: previews });

		this.props.onContentChanged({ previewText: previews });
	};

	handleContent = data => {

		const text = parseHTML(data);

		this.setEditorText(text);

		this.setPreviewText(text);
	};

	insertText(text) {
		this.editorRef.current.handleInsertText(text);
	}

	insertKeyword(keyword) {
		this.editorRef.current.handleInsertKeyword(keyword);
	}

	render() {

		const { resultContent, editorText, previewText } = this.state;
		const { keywords, disabled, isTrimSpace, tip, width, height } = this.props;

		return (
			<>
                <EditorMain ref={this.editorRef}
                        width={width}
                        height={height}
                        tip={tip}
                        resultContent={resultContent}
                        editorText={editorText}
                        previewText={previewText}
                        keywords={keywords}
                        disabled={disabled}
                        isTrimSpace={isTrimSpace}
                        onContentChanged={this.handleContent} />

				{/* 隐藏的节点，用于生成预览文本 */}
				<div ref={this.tempRef} style={{ display: 'none' }}></div>
			</>
        );
        
	}
}

export default Editor;
