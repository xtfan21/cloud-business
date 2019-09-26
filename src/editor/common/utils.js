import { DEFAULT_TYPE_NAME, NEW_LINE } from './constant';

/**
 * @description [格式化编辑器内容]
 * @param {*} data
 * @returns 内容切割成数组一段一段
 */
function formatEmpty(data) {
	const sms = [];
	// eslint-disable-next-line no-restricted-syntax
	for (const item of data) {
		const content = item.length ? `<div>${item}</div>` : '<div><br/></div>';
		sms.push(content);
	}
	return sms.join('');
}

/**
* @description [获取文字宽度]
* @param {*} text
* @returns {number} 字数宽度
*/
function getTextWidth(text) {

	const element = document.createElement('div');
	element.className = 'sms-content';
	element.style.display = 'inline-block';
	element.style.opacity = '0';
	element.style.fontSize = '14px';
	element.innerHTML = text;

	document.body.appendChild(element);

	const { width } = window.getComputedStyle(element);

	document.body.removeChild(element);

	return parseInt(width, 10);
}

/**
 * 将包含 html 的字符串转为文本
 * e.g. < => &lt;  &nbsp; => &amp;nbsp;
 * @param text
 * @returns {string}
 */
export function convertContent(text, isTrimSpace) {

	const reg = /(&nbsp;?)|(&lt;?)|(&gt;?)|(&amp;?)/g;

	const _text = text.replace(reg, result => {
					return `&amp;${result.slice(1)}` ;
				}).replace(/</g, '&lt;')

	// 针对文本前后空格不 trim 的设置, 将空格转成 &nbsp; 因为 html 不显示文本的前后空格
	return isTrimSpace ? _text : _text.replace(/\s/g, '&nbsp;');
}

/**
 * @description [判断当前浏览器是否为火狐浏览器]
 * @returns true - 是火狐浏览器， false - 非火狐浏览器
 */
export function isFirefox() {
	return navigator.userAgent.indexOf('Firefox') !== -1;
}

export function escapeRegExp(str) {
	// eslint-disable-next-line no-useless-escape
	const reg = /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g;
	return str.replace(reg, '\\$&');
}

export function getVarReg(prefix, suffix) {
	return RegExp(`${escapeRegExp(prefix)}_(?:\\[(\\S*?)])?(.+?)_${escapeRegExp(suffix)}`, 'g');
}

 /**
 * Keyword name 和 text 字段转换
 * @param arg
 * @param argIsText - true: 输入 text, 转出 name   - false: 输入 name, 转出 text
 * @returns {*}
 */
export function keywordTextNameConvert(arg, argIsText = true, keywords) {

	let matchedKeyword;

	if (keywords && keywords.length) {
		matchedKeyword = keywords.find(keyword => keyword[argIsText ? 'text' : 'name'] === arg);
	}
	return matchedKeyword ? matchedKeyword[argIsText ? 'name' : 'text'] : arg;
}

/**
 * 构造插入到文本编辑器的 input 标签
 * @param {string} text - 标签名
 * @param {string} type - 标签类型
 * @returns {string}
 */
export function createInput(text, type = DEFAULT_TYPE_NAME) {

	const width = getTextWidth(text);

	if (isFirefox()) {
		return `<img class="keyword-insert ${type}" value="${text}" alt="${text}" style="width: ${width + 2}px">`;
	}

	return `<input class="keyword-insert ${type}" value="${text}" style="width: ${width + 2}px" disabled>`;
}

/**
 * 将短信数据中的 tag 标签转化为 input
 * @param {string} text - 短信数据
 * @returns {string}
 */
export function parseTag(text, prefix, suffix, keywords) {

	const varReg = getVarReg(prefix, suffix);

	return text.replace(varReg, (result, $1, $2) => {
		const _keyword = keywordTextNameConvert($2, false, keywords);
		return createInput(_keyword, $1);
	});
}

/**
 * @description 格式化短信内容
 * @param {*} text
 * @returns
 */
export function formatContent(text) {
	const data = text.split(NEW_LINE);
	return formatEmpty(data);
}


/**
 * 解析富文本编辑器中的 HTML, 生成预览文本和最终存到服务器的文本
 */
export function parseHTML(text) {

	let parsed = text.trim()
		.replace(/disabled(="[^"]*")?/i, '')
		.replace(/style="[^"]+"/i, '')
		.trim();

	if (!parsed.startsWith('<div>')) {
		const parsedArr = parsed.split('<div>');
		const a = parsed.replace(parsedArr[0], '');
		parsed = `<div>${parsedArr[0]}</div>${a}`;
	}

	parsed = parsed.replace(/<\/div>/g, '')
		.replace(/<div>/g, NEW_LINE)
		.replace(/þ_enter_þ/, '');

	return parsed;

}

/**
 * 获取变量替换的标签表达式
 */
export function getVariableReg() {

	let reg = /<input\s+class="keyword-insert\s*([^"]*)"\s+value="([^"]+)"[^>]*>/ig;

	if (isFirefox()) {
		reg = /<img\s+class="keyword-insert\s*([^"]*)"\s+value="([^"]+)"[^>]*>/ig;
	}

	return reg;
}

/**
* 构造标签的预览文本
* - 如果标签有默认值, 则显示默认值; 否则显示 #标签名#
* @param {Array} keywords - 标签列表
* @param {string} text - 标签名
* @param {string|undefined} type - 标签类型
* @returns {string}
*/
export function createTagPreview(keywords, text, type = '') {

	// eslint-disable-next-line
	(type === DEFAULT_TYPE_NAME) && (type = undefined);

	const [matchedTag] = keywords.filter(item => item.type === type && item.text === text);

	// eslint-disable-next-line
	return matchedTag ? (matchedTag.defaultValue ? `œ${matchedTag.defaultValue}œ` : `œ#${matchedTag.text}#œ`) : `œ#${text}#œ`;
 }

/**
 * 聚焦Node节点的前面还是后面
 */
export function focusNode(node, isBefore = false) {

	const range = document.createRange();
	range.selectNode(node);
	range.collapse(isBefore);

	const selection = window.getSelection();
	selection.removeAllRanges();
	selection.addRange(range);

	return range;
}
