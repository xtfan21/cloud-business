import { focusNode } from './utils';

function focusTextNode(textNode, offset) {

	const range = document.createRange();
	range.setStart(textNode, offset);
	range.setEnd(textNode, offset);

	const selection = window.getSelection();
	selection.removeAllRanges();
	selection.addRange(range);
}

/**
 * 删除Node
 */
function deleteNode(node) {

	const range = document.createRange();
	range.selectNode(node);

	const selection = window.getSelection();
	selection.removeAllRanges();
	selection.addRange(range);

	document.execCommand('delete', false, null);
}

// 控制 firefox 的方向键事件
export default function controlFirefoxCursor(event) {

	const range = window.getSelection().getRangeAt(0);

	const { startContainer: node, startOffset } = range;
	const { childNodes, nodeType, previousSibling, parentNode, nextSibling } = node;

	const preNode = childNodes[startOffset - 2];
	const currentNode = childNodes[startOffset - 1];
	const nextNode = childNodes[startOffset];

	switch (event.keyCode) {
		case 37: // left
			if (node && nodeType === 3) {
				if (startOffset === 1) {
					if (previousSibling) { // {keyword}{text}
						focusNode(previousSibling);
						event.preventDefault();
					}
				}
				if (startOffset === 0) { // {text}
					if (parentNode && parentNode.previousSibling) {
						focusNode(parentNode.previousSibling.lastChild);
						event.preventDefault();
					}
				}
			} else if (preNode && preNode.nodeName === 'IMG') { // {keyword}{keyword}
					focusNode(preNode);
					event.preventDefault();
				} else if (preNode && preNode.nodeType === 3) { // {text}{keyword}
					focusTextNode(preNode, preNode.length);
					event.preventDefault();
				} else if (preNode === undefined && currentNode !== undefined) { // {keyword}
					focusNode(currentNode, true);
					event.preventDefault();
				} else if (preNode === undefined && currentNode === undefined) { // {keyword}
					if (node && previousSibling) {
						focusNode(previousSibling.lastChild);
						event.preventDefault();
					}
				}
			break;
		case 39: // right
			if (node && nodeType === 3) {
				if (node.length === startOffset) { // {text}{keyword}
					if (nextSibling) {
						focusNode(nextSibling);
						event.preventDefault();
					} else { // {text}
						// eslint-disable-next-line no-lonely-if
						if (parentNode && parentNode.nextSibling) {
							focusNode(parentNode.nextSibling.firstChild, true);
							event.preventDefault();
						}
					}
				}
			} else if (nextNode && nextNode.nodeName === 'IMG') { // {keyword}{keyword}
					focusNode(nextNode);
					event.preventDefault();
				} else if (nextNode === undefined) { // {keyword}
					// 火狐下面莫名其妙加入一个 <br>
					if (node && nextSibling && nextSibling.nodeName === 'DIV') {
						focusNode(nextSibling.firstChild, true);
						event.preventDefault();
					}
				}
			break;
		case 8: // delete
			if (node && node.nodeType === 3 && startOffset === 0) {
				if (previousSibling) {
					deleteNode(previousSibling);
					event.preventDefault();
				}
			}
			break;
		default:
	}
}
