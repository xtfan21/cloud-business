import React, { Component, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './index.less';

function initKeywords(data) {

	return data.reduce((types, item) => {

		const { type } = item;

		if (type && types.indexOf(type) === -1) {
			types.push(type);
		}

		return types;
	}, []);
}

// 变量过多展示下拉显示更多箭头
const Toggle = props => {

	const { keywords, width, handleClick } = props;

	const HASH_WIDTH = 7;
	const PADDING = 20;
	const MARGIN = 5;
	const ARROW_PADDING = 45;

	const keywordLength = keywords.reduce((result, keyword) => {
		return result + keyword.text.length * 12 + HASH_WIDTH + PADDING + MARGIN;
	}, 0);

	const isShow = keywordLength > width - ARROW_PADDING;

	return isShow && <span className="editor-keywords-toggle" onClick={handleClick}></span>;
}

// 当前平台下的关键字
const Keywords = props => {

    const [isShowAll, setIsShowAll] = useState(false);
    const { keywords, currentType, width, onInsertKeyword } = props;

	const data = keywords.filter(item => item.type === currentType);

	function handleClick() {
		setIsShowAll(!isShowAll);
	}

	function handleInsertKeyword(item) {
		if (item.disabled) return;
		onInsertKeyword(item);
	}

	return (
		<div className="editor-keywords-wrapper">
			<ul className={ classNames('editor-keywords-list', { 'expanded': isShowAll }) }>
				{
					data.map(item =>
						<li role="presentation" className={classNames('editor-keywords-item', { 'disabled': item.disabled })} key={item.name} onClick={handleInsertKeyword.bind(null, item)}>
							#{item.text}
						</li>
					)
				}
			</ul>
			<Toggle keywords={keywords} width={width} handleClick={handleClick} />
		</div>
	);
}

// 平台类型选择，如果只有一个平台的话则不显示切换平台的选项
const KeywordTypeSelector = (props) => {

	const { currentType, keywordTypes, onChangeType } = props;

	function handleClick(type) {
		onChangeType(type);
	}

	return (

		keywordTypes.length > 1 &&
			<div>
				{
					keywordTypes.map(item =>
						<span key={item} className={classNames('editor-keywords-type', {
							'active': item === currentType
						})} onClick={handleClick.bind(null, item)}>
						{ item }
						</span>
					)
				}
			</div>
	);
}

class Keyword extends Component {

	constructor(props) {

		super(props);

		this.keywordTypes = initKeywords(props.keywords);

		this.state = {
			currentType: this.keywordTypes[0]
		}
	}

	handleChangeType = type => {
		this.setState({
			currentType: type
		});
	}

	render() {

		const { keywords, width } = this.props;
		const { currentType } = this.state;

		return (
			<div className="editor-keywords" style={{ width: `${width}px` }}>
				<KeywordTypeSelector keywords={keywords} currentType={currentType} keywordTypes={this.keywordTypes} onChangeType={this.handleChangeType} />
				<Keywords currentType={currentType} {...this.props} />
			</div>
		);
	}
}

export default Keyword;

Keyword.propTypes = {
	keywords: PropTypes.array,
	width: PropTypes.number,
	onInsertKeyword: PropTypes.func
};

Keyword.defaultProps = {
	keywords: [],
	width: 200,
	onInsertKeyword: () => {}
};
